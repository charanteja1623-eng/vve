import React from "react";
import { site } from "@/lib/site";

export interface WhatsAppLinkProps {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reusable WhatsApp link component.
 * Strictly conditionally rendered: returns null if site.whatsappNumber is empty or unconfirmed.
 */
export default function WhatsAppLink({
  message,
  className = "",
  children = "Inquire on WhatsApp →",
}: WhatsAppLinkProps) {
  if (!site.whatsappNumber) return null;

  const cleanPhone = site.whatsappNumber.replace(/\D/g, "");
  if (!cleanPhone) return null;

  const defaultMessage = "Hello, I'd like to enquire about your event services.";
  const finalMessage = message !== undefined ? message : defaultMessage;

  const url = finalMessage
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage)}`
    : `https://wa.me/${cleanPhone}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
