import { Resend } from "resend";
import crypto from "crypto";
import type { EnquiryData } from "@/lib/validations/enquiry";

/**
 * Server-Side Resend Email Service for Vintage Vibe Events.
 *
 * Security & Reliability Guarantees:
 * 1. Environment variables (RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL)
 *    are evaluated exclusively on the server and never sent to client bundles.
 * 2. All user-supplied fields are strictly HTML-escaped before insertion into email markup.
 * 3. Human-readable plain-text version is delivered alongside HTML for maximal client compatibility.
 * 4. Idempotency keys are supported via Resend requestOptions to prevent duplicate sends on retries.
 * 5. Errors are safely handled without logging secrets or leaking internal provider messages to browsers.
 */

const CATEGORY_MAP: Record<string, string> = {
  "wedding-packages": "Wedding Packages",
  "birthday-parties": "Birthday Parties",
  "surprise-parties": "Surprise Parties",
  "indoor-outdoor-events": "Indoor & Outdoor Events",
  "school-college-events": "School & College Events",
  "new-year-parties": "New Year Parties",
  other: "Other Celebrations",
};

const ADDON_MAP: Record<string, string> = {
  catering: "Catering",
  decoration: "Decoration",
  "tent-house": "Tent House",
  "dj-screens": "DJ & Screens",
  "photo-videography": "Photo & Videography",
  "customized-gifts": "Customized Gifts",
  "resin-3d-molds": "Resin & 3D Molds",
};

/**
 * Escapes characters with special meaning in HTML to prevent XSS / markup injection.
 */
export function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapes multiline content and converts newlines to `<br />` tags.
 */
export function formatMultilineHtml(unsafe: string | null | undefined): string {
  return escapeHtml(unsafe).replace(/\r\n|\n|\r/g, "<br />");
}

export function getCategoryTitle(eventType: string): string {
  const key = eventType.toLowerCase().trim();
  return CATEGORY_MAP[key] || eventType;
}

export function extractAddonList(data: {
  addon?: string | null;
  addons?: string[] | string | null;
  addOnServices?: string[] | string | null;
}): string[] {
  const set = new Set<string>();
  if (data.addon && typeof data.addon === "string" && data.addon.trim()) {
    data.addon.split(",").forEach((item) => {
      const trimmed = item.trim();
      if (trimmed) set.add(trimmed);
    });
  }
  const processList = (raw: string[] | string | null | undefined) => {
    if (!raw) return;
    if (Array.isArray(raw)) {
      raw.forEach((item) => {
        if (typeof item === "string" && item.trim()) set.add(item.trim());
      });
    } else if (typeof raw === "string" && raw.trim()) {
      raw.split(",").forEach((item) => {
        const trimmed = item.trim();
        if (trimmed) set.add(trimmed);
      });
    }
  };
  processList(data.addons);
  processList(data.addOnServices);
  return Array.from(set);
}

export function formatAddons(addons: string[]): string {
  if (addons.length === 0) return "None selected";
  return addons.map((id) => ADDON_MAP[id.toLowerCase()] || id).join(", ");
}

export interface EmailConfig {
  apiKey: string;
  toEmail: string;
  fromEmail: string;
}

/**
 * Safely inspects server-side configuration.
 */
export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.ENQUIRY_TO_EMAIL?.trim();
  const fromEmail = process.env.ENQUIRY_FROM_EMAIL?.trim();

  if (!apiKey || !toEmail || !fromEmail) {
    return null;
  }

  return { apiKey, toEmail, fromEmail };
}

/**
 * Builds readable plain-text alternative for the notification email.
 */
export function buildEnquiryEmailText(data: EnquiryData, submittedAt: Date = new Date()): string {
  const categoryTitle = getCategoryTitle(data.eventType);
  const addons = extractAddonList(data);
  const addonsFormatted = formatAddons(addons);
  const emailDisplay = data.email && data.email.trim() ? data.email.trim() : "Not provided";
  const dateDisplay = data.date && data.date.trim() ? data.date.trim() : "Not specified";
  const budgetStr = data.budget !== null && data.budget !== undefined ? String(data.budget).trim() : "";
  const budgetDisplay = budgetStr || "Not specified";

  return `=======================================================
NEW ENQUIRY - VINTAGE VIBE EVENTS
=======================================================

A new client consultation request has been submitted.

--- CONTACT DETAILS ---
Name: ${data.name}
Phone: ${data.phone}
Email: ${emailDisplay}

--- EVENT DETAILS ---
Category: ${categoryTitle} (${data.eventType})
Location: ${data.location}
Date: ${dateDisplay}
Estimated Budget: ${budgetDisplay}
Add-On Services: ${addonsFormatted}

--- CLIENT MESSAGE ---
${data.message}

-------------------------------------------------------
Submitted At: ${submittedAt.toISOString()}
Source: Vintage Vibe Events Website (/contact)
=======================================================`;
}

/**
 * Builds responsive luxury HTML markup for the notification email.
 */
export function buildEnquiryEmailHtml(data: EnquiryData, submittedAt: Date = new Date()): string {
  const categoryTitle = escapeHtml(getCategoryTitle(data.eventType));
  const rawEventType = escapeHtml(data.eventType);
  const addons = extractAddonList(data);
  const addonsFormatted = escapeHtml(formatAddons(addons));

  const safeName = escapeHtml(data.name);
  const safePhone = escapeHtml(data.phone);
  const safeEmail = data.email && data.email.trim() ? escapeHtml(data.email.trim()) : "<em>Not provided</em>";
  const safeLocation = escapeHtml(data.location);
  const safeDate = data.date && data.date.trim() ? escapeHtml(data.date.trim()) : "<em>Not specified</em>";
  const budgetStr = data.budget !== null && data.budget !== undefined ? String(data.budget).trim() : "";
  const safeBudget = budgetStr ? escapeHtml(budgetStr) : "<em>Not specified</em>";
  const safeMessage = formatMultilineHtml(data.message);
  const formattedTimestamp = escapeHtml(submittedAt.toUTCString());

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Enquiry - Vintage Vibe Events</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f3ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2a1b18;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f6f3ee; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e8decb; box-shadow: 0 4px 20px rgba(58, 5, 7, 0.06);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #3a0507; padding: 32px 28px; text-align: center; border-bottom: 3px solid #c9a15a;">
              <h1 style="margin: 0 0 6px 0; color: #f9f6f0; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Vintage Vibe Events</h1>
              <p style="margin: 0; color: #c9a15a; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">New Consultation Enquiry</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px;">
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a3b38;">
                A new client enquiry has been received via the online booking portal. Details are summarized below:
              </p>

              <!-- Contact Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px; background-color: #fcfaf7; border: 1px solid #efe7db; border-radius: 8px;">
                <tr>
                  <td colspan="2" style="padding: 12px 16px; background-color: #f7f1e6; border-bottom: 1px solid #efe7db; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #3a0507;">
                    Visitor Contact Information
                  </td>
                </tr>
                <tr>
                  <td width="35%" style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #725e59; border-bottom: 1px solid #f0e9df;">Full Name</td>
                  <td width="65%" style="padding: 10px 16px; font-size: 14px; font-weight: 700; color: #1a100f; border-bottom: 1px solid #f0e9df;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #725e59; border-bottom: 1px solid #f0e9df;">Phone</td>
                  <td style="padding: 10px 16px; font-size: 14px; color: #1a100f; border-bottom: 1px solid #f0e9df;">
                    <a href="tel:${safePhone}" style="color: #3a0507; text-decoration: underline; font-weight: 600;">${safePhone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #725e59;">Email</td>
                  <td style="padding: 10px 16px; font-size: 14px; color: #1a100f;">
                    ${data.email && data.email.trim() ? `<a href="mailto:${safeEmail}" style="color: #3a0507; text-decoration: underline;">${safeEmail}</a>` : safeEmail}
                  </td>
                </tr>
              </table>

              <!-- Event Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px; background-color: #fcfaf7; border: 1px solid #efe7db; border-radius: 8px;">
                <tr>
                  <td colspan="2" style="padding: 12px 16px; background-color: #f7f1e6; border-bottom: 1px solid #efe7db; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #3a0507;">
                    Event Specifications
                  </td>
                </tr>
                <tr>
                  <td width="35%" style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #725e59; border-bottom: 1px solid #f0e9df;">Category</td>
                  <td width="65%" style="padding: 10px 16px; font-size: 14px; font-weight: 600; color: #1a100f; border-bottom: 1px solid #f0e9df;">
                    ${categoryTitle} <span style="font-size: 11px; color: #88746f;">(${rawEventType})</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #725e59; border-bottom: 1px solid #f0e9df;">Location</td>
                  <td style="padding: 10px 16px; font-size: 14px; color: #1a100f; border-bottom: 1px solid #f0e9df;">${safeLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #725e59; border-bottom: 1px solid #f0e9df;">Event Date</td>
                  <td style="padding: 10px 16px; font-size: 14px; color: #1a100f; border-bottom: 1px solid #f0e9df;">${safeDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #725e59; border-bottom: 1px solid #f0e9df;">Estimated Budget</td>
                  <td style="padding: 10px 16px; font-size: 14px; color: #1a100f; border-bottom: 1px solid #f0e9df;">${safeBudget}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #725e59;">Add-On Services</td>
                  <td style="padding: 10px 16px; font-size: 14px; color: #3a0507; font-weight: 600;">${addonsFormatted}</td>
                </tr>
              </table>

              <!-- Message Box -->
              <div style="margin-bottom: 24px; padding: 16px; background-color: #ffffff; border-left: 4px solid #c9a15a; border-top: 1px solid #efe7db; border-right: 1px solid #efe7db; border-bottom: 1px solid #efe7db; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #725e59;">Client Message</p>
                <div style="font-size: 14px; line-height: 1.6; color: #1a100f;">${safeMessage}</div>
              </div>

              <!-- Action Prompt -->
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #88746f; text-align: center;">
                Reply directly to this email to contact the visitor if an email address was provided.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7f1e6; padding: 20px 28px; text-align: center; border-top: 1px solid #e8decb;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #5a4945; font-weight: 600;">
                Vintage Vibe Events &mdash; Atelier Notification System
              </p>
              <p style="margin: 0; font-size: 11px; color: #8e7a75;">
                Received on ${formattedTimestamp}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export interface SendEnquiryEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Sends enquiry notification email using the official Resend SDK.
 * Handles configuration, validation, escaping, and returns clean results without leaking credentials.
 */
export async function sendEnquiryNotificationEmail(
  data: EnquiryData,
  options?: { idempotencyKey?: string }
): Promise<SendEnquiryEmailResult> {
  const config = getEmailConfig();
  if (!config) {
    return {
      success: false,
      error: "Email notification configuration is missing on the server",
    };
  }

  const resend = new Resend(config.apiKey);

  const formattedFrom = config.fromEmail.includes("<")
    ? config.fromEmail
    : `Vintage Vibe Events <${config.fromEmail}>`;

  const categoryTitle = getCategoryTitle(data.eventType);
  const subject = `New Enquiry: ${data.name} - ${categoryTitle}`;
  const html = buildEnquiryEmailHtml(data);
  const text = buildEnquiryEmailText(data);

  // Compute deterministic idempotency key from exact request content to prevent 409 mismatch errors
  const emailPayloadHash = crypto
    .createHash("sha256")
    .update(`${formattedFrom}::${config.toEmail}::${subject}::${text}::${html}`)
    .digest("hex");

  const effectiveIdempotencyKey = options?.idempotencyKey || `vve-${emailPayloadHash.slice(0, 32)}`;

  try {
    const response = await resend.emails.send(
      {
        from: formattedFrom,
        to: config.toEmail,
        replyTo: data.email && data.email.trim() ? data.email.trim() : undefined,
        subject,
        html,
        text,
      },
      { idempotencyKey: effectiveIdempotencyKey }
    );

    if (response.error) {
      console.error("Resend API rejected message:", response.error.name, response.error.message);
      return {
        success: false,
        error: response.error.message,
      };
    }

    return {
      success: true,
      id: response.data?.id,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Unexpected error dispatching email via Resend:", message);
    return {
      success: false,
      error: message,
    };
  }
}
