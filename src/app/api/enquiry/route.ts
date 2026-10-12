import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations/enquiry";
import { createClient } from "@supabase/supabase-js";

// Supabase environment variables (Server-side privileged client)
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// Rate limiting state (In-memory for now)
// REQUIREMENT: For serverless deployments (Vercel, etc.), a shared store like Upstash Redis MUST be used.
// In-memory maps will reset on cold starts and do not share state across Edge/Serverless instances.
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // 3 requests per minute per IP

export async function POST(request: Request) {
  try {
    // 0. Request Size Check (basic protection, Next.js also has limits)
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 10 * 1024) { // 10KB max
      return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
    }

    // 1. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    const rateLimitInfo = rateLimitMap.get(ip);

    if (rateLimitInfo && now - rateLimitInfo.timestamp < RATE_LIMIT_WINDOW) {
      if (rateLimitInfo.count >= MAX_REQUESTS) {
        console.warn(`Rate limit exceeded for IP: ${ip}`); // Safe log, no PII
        return NextResponse.json({ error: "Too Many Requests. Please try again later." }, { status: 429 });
      }
      rateLimitInfo.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    const body = await request.json();
    
    // 2. Honeypot Validation
    if (body.company_website) {
      console.warn("Honeypot triggered."); // Safe log, no PII
      // Silently accept it to deceive bots, but don't save
      return NextResponse.json({ success: true, message: "Your enquiry has been successfully submitted." }, { status: 200 });
    }

    // 3. Validate with Zod
    const result = enquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.issues },
        { status: 400 }
      );
    }
    
    const data = result.data;

    // 4. Check for Supabase credentials (Blocker documentation)
    if (!supabaseUrl || !supabaseSecretKey) {
      // "If external credentials are unavailable... document the exact integration blocker, and do not simulate successful persistence."
      return NextResponse.json(
        { 
          error: "Configuration Missing", 
          message: "The online form is temporarily unavailable due to backend configuration. Please contact us via phone or email." 
        },
        { status: 503 } // Service Unavailable
      );
    }

    // 5. Persistent Storage using Supabase
    // SECURITY NOTE: In production, consider using a Service Role Key kept server-side only (not NEXT_PUBLIC_)
    // to bypass restrictive RLS for inserts, or ensuring RLS strictly allows anonymous inserts but no selects.
    const supabase = createClient(supabaseUrl, supabaseSecretKey);
    
    const { error } = await supabase
      .from('enquiries')
      .insert([
        {
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          location: data.location,
          event_type: data.eventType,
          event_date: data.date || null,
          budget: data.budget || null,
          message: data.message,
          status: 'new' // default status for admin workflow
        }
      ]);

    if (error) {
      console.error("Supabase insert error. Code:", error.code); // Do not log 'data' to prevent PII leakage
      return NextResponse.json(
        { error: "Failed to save enquiry", message: "A database error occurred while saving your enquiry." },
        { status: 500 }
      );
    }

    // 6. Notifications
    // NOTIFICATION BLOCKER: Email notifications are not implemented.
    // A provider like Resend or SendGrid must be configured, and a delivery test must pass
    // before claiming email notifications work.

    // 7. Return Explicit Success State
    return NextResponse.json(
      { success: true, message: "Your enquiry has been successfully submitted." },
      { status: 200 }
    );

  } catch {
    console.error("Enquiry API error encountered."); // Safe log
    return NextResponse.json(
      { error: "Internal Server Error", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
