"use client";

import { site } from "@/lib/site";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Optional: Prevent scrolling on body when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 ${isOpen ? "z-[60] h-screen bg-burgundy-deep" : "z-50 bg-burgundy-deep/90 backdrop-blur-md"} w-full border-b border-gold/20 text-ivory`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl tracking-wide text-gold-light hover:text-gold transition-colors z-[70]" onClick={() => setIsOpen(false)}>
          {site.name}
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-widest uppercase font-sans">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <Link href="/events" className="hover:text-gold transition-colors">Events</Link>
          <Link href="/services" className="hover:text-gold transition-colors">Services</Link>
          <Link href="/work" className="hover:text-gold transition-colors">Work</Link>
          <Link href="/contact" className="hover:text-gold transition-colors text-gold">Contact</Link>
        </nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden z-[70]">
          <button 
            ref={buttonRef}
            className="text-gold p-2 -mr-2 focus:outline-none focus:ring-2 focus:ring-gold rounded" 
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

      {/* Mobile menu overlay — overlays entire screen including MobileActionBar */}
      {isOpen && (
        <div id="mobile-menu" ref={menuRef} className="fixed inset-0 z-[60] bg-burgundy-deep pt-24 px-6 md:hidden overflow-y-auto" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <nav className="flex flex-col gap-8 text-center text-lg font-semibold tracking-widest uppercase font-sans">
            <Link href="/" className="hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/events" className="hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>Events</Link>
            <Link href="/services" className="hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/work" className="hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>Work</Link>
            <Link href="/contact" className="text-gold hover:text-gold-light transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
          </nav>
          
          <div className="mt-16 text-center">
            <a href={`tel:${site.phones[0].replace(/\s+/g, '')}`} className="block text-gold-light hover:text-gold transition-colors font-sans mb-4">{site.phones[0]}</a>
            <a href={`mailto:${site.email}`} className="block text-gold-light hover:text-gold transition-colors font-sans">{site.email}</a>
          </div>
        </div>
      )}
    </header>
  );
}
