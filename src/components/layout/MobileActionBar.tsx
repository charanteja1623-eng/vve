"use client";

import { site } from "@/lib/site";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

/**
 * Mobile-only bottom action bar (viewport <= 768px).
 *
 * Requirements:
 * - Outside transformed/animated layers.
 * - Call: tel:8886882608 (primary confirmed phone).
 * - Enquire: Navigates to /contact#enquiry-form on subpages; on /contact, smoothly scrolls to and focuses form.
 * - WhatsApp: Hidden until confirmed in site.ts.
 * - Sits below mobile navigation drawer (drawer priority z-index).
 * - Respects safe-area insets.
 */
export default function MobileActionBar() {
  const pathname = usePathname();
  const primaryPhone = site.phones[0] || "8886882608";
  const cleanPhone = primaryPhone.replace(/\D/g, "");

  const handleEnquireClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/contact") {
      e.preventDefault();
      const form = document.getElementById("enquiry-form") || document.querySelector("form");
      if (form) {
        form.scrollIntoView({ behavior: "smooth", block: "start" });
        const nameInput = document.getElementById("name") as HTMLInputElement | null;
        if (nameInput) {
          nameInput.focus({ preventScroll: true });
        }
      }
    }
  };

  return (
    <nav
      aria-label="Mobile quick actions"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-burgundy-deep/95 backdrop-blur-md border-t border-gold/30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around px-4 py-2.5 max-w-md mx-auto gap-3">
        {/* Call Action */}
        <a
          href={`tel:${cleanPhone}`}
          aria-label={`Call Vintage Vibe Events at ${primaryPhone}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded bg-burgundy/80 border border-gold/40 text-gold-light font-sans text-xs font-bold uppercase tracking-widest hover:border-gold hover:bg-burgundy active:scale-[0.98] transition-all min-h-[48px]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Call</span>
        </a>

        {/* Enquire Action */}
        <Link
          href="/contact#enquiry-form"
          onClick={handleEnquireClick}
          aria-label="Enquire about event planning"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded bg-gold text-burgundy-deep font-sans text-xs font-bold uppercase tracking-widest hover:bg-gold-light active:scale-[0.98] transition-all shadow-[0_2px_15px_rgba(201,161,90,0.3)] min-h-[48px]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Enquire</span>
        </Link>

        {/* WhatsApp Action: strictly conditionally rendered ONLY if confirmed */}
        {Boolean(site.whatsappNumber) && (
          <a
            href={`https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Vintage Vibe Events on WhatsApp"
            className="flex items-center justify-center p-3 rounded bg-[#25D366] text-white hover:opacity-90 active:scale-[0.98] transition-all min-h-[48px] min-w-[48px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
          </a>
        )}
      </div>
    </nav>
  );
}
