"use client";

import { site } from "@/lib/site";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key and focus trapping for mobile menu
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    // Set initial focus to first link in menu
    const timer = setTimeout(() => {
      const firstLink = menuRef.current?.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 ${isOpen ? "z-[60] h-screen bg-burgundy-deep/95 backdrop-blur-xl" : "z-50 bg-burgundy-deep shadow-[0_4px_30px_rgba(15,1,2,0.85)]"} w-full border-b border-gold/25 text-ivory transition-colors duration-300`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl tracking-wide text-gold-light hover:text-gold hover:drop-shadow-[0_0_12px_rgba(201,161,90,0.4)] transition-all z-[70]" onClick={() => setIsOpen(false)}>
          {site.name}
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-widest uppercase font-sans">
          <Link href="/" className="hover:text-gold hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.3)] transition-all">Home</Link>
          <Link href="/events" className="hover:text-gold hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.3)] transition-all">Events</Link>
          <Link href="/work" className="hover:text-gold hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.3)] transition-all">Portfolio</Link>
          <Link href="/contact" className="hover:text-gold hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.3)] transition-all text-gold">Contact</Link>
        </nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden z-[70]">
          <button
            ref={buttonRef}
            className="text-gold p-2 -mr-2 focus:outline-none focus:ring-2 focus:ring-gold rounded hover:bg-gold/10 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay — overlays entire screen */}
      {isOpen && (
        <div id="mobile-menu" ref={menuRef} className="fixed inset-0 z-[60] bg-burgundy-deep/95 backdrop-blur-2xl pt-24 px-6 md:hidden overflow-y-auto border-b border-gold/25 shadow-[inset_0_1px_0_rgba(227,201,133,0.15)]" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <nav className="flex flex-col gap-8 text-center text-lg font-semibold tracking-widest uppercase font-sans">
            <Link href="/" className="hover:text-gold hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.3)] transition-all" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/events" className="hover:text-gold hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.3)] transition-all" onClick={() => setIsOpen(false)}>Events</Link>
            <Link href="/work" className="hover:text-gold hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.3)] transition-all" onClick={() => setIsOpen(false)}>Portfolio</Link>
            <Link href="/contact" className="text-gold hover:text-gold-light hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.3)] transition-all" onClick={() => setIsOpen(false)}>Contact</Link>
          </nav>
          
          <div className="mt-14 text-center space-y-3 font-sans">
            <div className="flex flex-col items-center gap-2">
              <a href={site.telLinks[0]} className="text-gold-light hover:text-gold transition-colors text-base">
                {site.phones[0]}
              </a>
              <a href={site.telLinks[1]} className="text-gold-light hover:text-gold transition-colors text-base">
                {site.phones[1]}
              </a>
            </div>
            <a href={`mailto:${site.email}`} className="block text-gold-light/80 hover:text-gold transition-colors text-sm pt-2">
              {site.email}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
