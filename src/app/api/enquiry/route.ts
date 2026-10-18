import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations/enquiry";
import { createClient } from "@supabase/supabase-js";

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

    // Memory Hygiene: Prune expired entries before evaluating to prevent unbounded memory growth
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
      // Silently accept to mislead automated spam scrapers without persisting
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

    // 4. Configuration Check (Gated Fallback for External Integrations)
    if (!supabaseUrl || !supabaseSecretKey) {
      // Per architectural specification: if credentials are unavailable, document the exact
      // integration blocker and do NOT simulate successful database persistence.
      return NextResponse.json(
        {
          error: "Configuration Missing",
          message:
            "The online form is temporarily unavailable due to backend configuration. Please contact us via phone or email.",
        },
        { status: 503 }
      );
    }

    // 5. Database Persistence via Supabase Client
    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    // Format message to include optional add-on service if specified
    const finalMessage = data.addon
      ? `${data.message}\n\n[Selected Add-On Service: ${data.addon}]`
      : data.message;

    const { error } = await supabase.from("enquiries").insert([
      {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        location: data.location,
        event_type: data.eventType,
        event_date: data.date || null,
        budget: data.budget || null,
        message: finalMessage,
        status: "new",
      },
    ]);

    if (error) {
      console.error("Supabase insert error. Code:", error.code); // Do not log client data to prevent PII leaks
      return NextResponse.json(
        {
          error: "Failed to save enquiry",
          message: "A database error occurred while saving your enquiry.",
        },
        { status: 500 }
      );
    }

    // 6. Notification Blocker Documentation:
    // Email notifications (e.g. via Resend, SendGrid) are deliberately gated and unconfigured.
    // They must not be claimed as operational until explicit SMTP/API provider credentials
    // are provisioned and an end-to-end delivery test passes.

    // 7. Explicit Success State
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
