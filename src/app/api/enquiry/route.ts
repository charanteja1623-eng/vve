import { NextResponse } from "next/server";
import crypto from "crypto";
import { enquirySchema } from "@/lib/validations/enquiry";
import { createClient } from "@supabase/supabase-js";
import {
  getEmailConfig,
  sendEnquiryNotificationEmail,
  extractAddonList,
  formatAddons,
} from "@/lib/email";

// Supabase environment variables (Server-side privileged client)
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * In-memory rate limiting state.
 *
 * ARCHITECTURE CAVEAT:
 * In serverless environments with ephemeral compute instances (Vercel, AWS Lambda, Cloudflare Workers),
 * in-memory Maps are isolated per cold container and do not synchronize across distributed edge nodes.
 * For high-traffic production environments, a managed distributed store (such as Upstash Redis or
 * Cloudflare KV) MUST be configured to enforce cluster-wide rate limits.
 */
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 3; // 3 requests per minute per client IP

/**
 * In-memory deduplication state for accidental double submission / retry protection.
 *
 * NOTE ON DELIVERY GUARANTEES:
 * Best-effort in-memory deduplication combined with provider-level idempotency keys
 * mitigates rapid double clicks and network retry storms within a 60-second window.
 * Exactly-once delivery is NOT claimed across distributed ephemeral serverless instances
 * without an external distributed consensus store (e.g., Redis).
 */
const recentSubmissionsMap = new Map<string, { timestamp: number; success: boolean }>();
const DEDUP_WINDOW = 60 * 1000; // 60 seconds

export async function POST(request: Request) {
  try {
    // 0. Payload Size Hardening: Enforce strict 10KB (10 * 1024 bytes) maximum limit
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 10 * 1024) {
      return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
    }

    // Read body text to enforce physical byte limit even if content-length header was omitted/chunked
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).length > 10 * 1024) {
      return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
    }

    // 1. Client IP Extraction & Rate Limiting
    // PROXY TRUST ASSUMPTION:
    // When deployed behind edge infrastructure (e.g., Vercel, Cloudflare), the first IP token in
    // `x-forwarded-for` or `x-real-ip` represents the connecting client, assuming the outer proxy
    // strips spoofed inbound headers. In local development or untrusted reverse proxies, this defaults to 127.0.0.1.
    const forwardedHeader = request.headers.get("x-forwarded-for");
    const realIpHeader = request.headers.get("x-real-ip");
    const ip = realIpHeader || (forwardedHeader ? forwardedHeader.split(",")[0].trim() : "127.0.0.1");

    const now = Date.now();

    // Memory Hygiene: Prune expired rate-limit entries before evaluating
    for (const [key, val] of rateLimitMap.entries()) {
      if (now - val.timestamp >= RATE_LIMIT_WINDOW) {
        rateLimitMap.delete(key);
      }
    }

    const rateLimitInfo = rateLimitMap.get(ip);
    if (rateLimitInfo && now - rateLimitInfo.timestamp < RATE_LIMIT_WINDOW) {
      if (rateLimitInfo.count >= MAX_REQUESTS) {
        console.warn(`Rate limit exceeded for IP: ${ip}`); // Safe logging, no PII
        return NextResponse.json(
          { error: "Too Many Requests. Please try again later." },
          { status: 429 }
        );
      }
      rateLimitInfo.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    // Parse JSON payload
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // 2. Honeypot Anti-Spam Check
    if (body.company_website) {
      console.warn("Honeypot triggered."); // Safe log, no PII
      // Silently accept to mislead automated spam scrapers without persisting or emailing
      return NextResponse.json(
        { success: true, message: "Your enquiry has been successfully submitted." },
        { status: 200 }
      );
    }

    // 3. Zod Input Schema Validation with Length Bounds
    const result = enquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;

    // 4. Configuration Check (Supabase Storage & Resend Email Service)
    const emailConfig = getEmailConfig();
    if (!supabaseUrl || !supabaseSecretKey || !emailConfig) {
      // Per architectural specification: if credentials are unavailable, document the exact
      // integration blocker and do NOT simulate successful database persistence or notification.
      return NextResponse.json(
        {
          error: "Configuration Missing",
          message:
            "The online form is temporarily unavailable due to backend configuration. Please contact us via phone or email.",
        },
        { status: 503 }
      );
    }

    // 5. Duplicate Submission Check (In-memory Deduplication)
    // Prune expired entries from deduplication map
    for (const [key, val] of recentSubmissionsMap.entries()) {
      if (now - val.timestamp >= DEDUP_WINDOW) {
        recentSubmissionsMap.delete(key);
      }
    }

    // Build deterministic fingerprint of the enquiry payload
    const selectedAddons = extractAddonList(data);
    const addonsLabel = formatAddons(selectedAddons);

    const submissionFingerprint = crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          ip,
          name: data.name.trim().toLowerCase(),
          phone: data.phone.trim(),
          email: (data.email || "").trim().toLowerCase(),
          location: data.location.trim().toLowerCase(),
          eventType: data.eventType.trim().toLowerCase(),
          date: (data.date || "").trim(),
          budget: (data.budget || "").trim(),
          message: data.message.trim(),
          addons: [...selectedAddons].sort(),
        })
      )
      .digest("hex");

    const existingSubmission = recentSubmissionsMap.get(submissionFingerprint);
    if (existingSubmission && existingSubmission.success) {
      // Duplicate submission detected within the deduplication window.
      // Return previous success status safely without re-inserting or re-emailing.
      return NextResponse.json(
        { success: true, message: "Your enquiry has been successfully submitted." },
        { status: 200 }
      );
    }

    // 6. Database Persistence via Supabase Client
    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    // Format message to include optional add-on service(s) if specified
    const finalMessage = selectedAddons.length > 0
      ? `${data.message}\n\n[Selected Add-On Services: ${addonsLabel}]`
      : data.addon
      ? `${data.message}\n\n[Selected Add-On Service: ${data.addon}]`
      : data.message;

    const insertPayload: Record<string, unknown> = {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      location: data.location,
      event_type: data.eventType,
      event_date: data.date || null,
      budget: data.budget || null,
      message: finalMessage,
      status: "new",
      addons: selectedAddons,
    };

    let { error: dbError } = await supabase.from("enquiries").insert([insertPayload]);

    // Non-breaking fallback if 'addons' column has not yet been migrated in database schema (PGRST204)
    if (dbError && dbError.code === "PGRST204") {
      delete insertPayload.addons;
      const retryResult = await supabase.from("enquiries").insert([insertPayload]);
      dbError = retryResult.error;
    }

    if (dbError) {
      console.error("Supabase insert error. Code:", dbError.code); // Do not log client data to prevent PII leaks
      return NextResponse.json(
        {
          error: "Failed to save enquiry",
          message: "A database error occurred while saving your enquiry.",
        },
        { status: 500 }
      );
    }

    // 7. Transactional Email Notification via Resend
    // Uses deterministic payload hash as idempotency key internally to prevent duplicate provider dispatches
    const emailResult = await sendEnquiryNotificationEmail(data);

    if (!emailResult.success) {
      // Safe error log without exposing provider credentials or PII
      console.error("Resend notification dispatch failed.");
      return NextResponse.json(
        {
          error: "Notification Delivery Failed",
          message:
            "The online form is temporarily unavailable due to backend configuration. Please contact us via phone or email.",
        },
        { status: 500 }
      );
    }

    // 8. Record Successful Submission in Deduplication Cache
    recentSubmissionsMap.set(submissionFingerprint, {
      timestamp: now,
      success: true,
    });

    // 9. Explicit Success State
    return NextResponse.json(
      { success: true, message: "Your enquiry has been successfully submitted." },
      { status: 200 }
    );
  } catch {
    console.error("Enquiry API error encountered.");
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
