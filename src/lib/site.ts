/**
 * Central site configuration — single source of truth for business facts.
 *
 * CONFIRMED facts (product brief §4a) are safe to render anywhere.
 * UNCONFIRMED values (§4b) are flagged and must NOT be presented as real.
 */

export const site = {
  name: "Vintage Vibe Events",
  tagline: "Creating moments. Designing memories.",
  serviceArea: "Hyderabad", // §4a — exact boundary beyond this is unconfirmed (§4b)

  // §4a — confirmed contact details
  phones: ["8886882608", "9032880528"],
  email: "vintagevibeevents12@gmail.com",
  instagram: {
    handle: "@vintage_vibe_events",
    url: "https://instagram.com/vintage_vibe_events",
  },

  // §4b — UNCONFIRMED. Obviously non-functional placeholder on purpose.
  // TODO: confirm WhatsApp number with client — do NOT assume it matches a phone above.
  whatsappNumber: "WHATSAPP_NUMBER_UNCONFIRMED",

  // §4b — UNCONFIRMED
  // TODO: confirm business hours with client.
  businessHours: null as string | null,
} as const;

export const PLACEHOLDER_WHATSAPP = "WHATSAPP_NUMBER_UNCONFIRMED";
