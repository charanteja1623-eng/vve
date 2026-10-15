"use client";

import { useEffect } from "react";

/**
 * Manages the scroll progress custom property (--scroll-progress)
 * for the mobile hero-to-events transition fallback.
 *
 * Performance & Architecture:
 * - Passive scroll listener.
 * - Scheduled exclusively via requestAnimationFrame.
 * - Updates only the CSS custom property (--scroll-progress) on document root.
 * - Zero React state updates on scroll frames (zero re-renders).
 * - Full cleanup of listeners and pending animation frames.
 * - Respects prefers-reduced-motion.
 * - Supports test automation toggle via ?scrollFallback=true or html[data-scroll-fallback="true"].
 */
export default function ScrollExperienceController() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if query param ?scrollFallback=true is set to force fallback for testing
    const params = new URLSearchParams(window.location.search);
    if (params.get("scrollFallback") === "true") {
      document.documentElement.setAttribute("data-scroll-fallback", "true");
    }

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      document.documentElement.style.setProperty("--scroll-progress", "0");
      document.documentElement.style.setProperty("--section-progress", "1");
      return;
    }

    let rafId: number | null = null;
    let lastHeroProgress = -1;
    let lastSectionProgress = -1;

    const onScroll = () => {
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        // Bounded transition distance: 100vh (or viewport height)
        const vh = window.innerHeight || 800;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        
        // 1. Hero scroll progress (0 to 1 over 100vh)
        const heroProgress = Math.min(1, Math.max(0, scrollY / vh));
        if (Math.abs(heroProgress - lastHeroProgress) > 0.002) {
          lastHeroProgress = heroProgress;
          document.documentElement.style.setProperty(
            "--scroll-progress",
            heroProgress.toFixed(4)
          );
        }

        // 2. Section entry progress (tracks when .section-entry-reveal enters viewport)
        const sectionEl = document.querySelector(".section-entry-reveal");
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect();
          // Entry starts when top edge reaches bottom of viewport (rect.top <= vh)
          // Entry finishes when top edge reaches 30% from top of viewport (rect.top <= vh * 0.3)
          const enterStart = vh;
          const enterEnd = vh * 0.3;
          const sectionProgress = Math.min(
            1,
            Math.max(0, (enterStart - rect.top) / (enterStart - enterEnd))
          );

          if (Math.abs(sectionProgress - lastSectionProgress) > 0.002) {
            lastSectionProgress = sectionProgress;
            document.documentElement.style.setProperty(
              "--section-progress",
              sectionProgress.toFixed(4)
            );
          }
        }
      });
    };

    // Initialize progress on mount
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}
