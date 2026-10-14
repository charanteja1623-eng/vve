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
      return;
    }

    let rafId: number | null = null;
    let lastProgress = -1;

    const onScroll = () => {
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        // Bounded transition distance: 100vh (or viewport height)
        const vh = window.innerHeight || 800;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        
        // Progress from 0 to 1 over 100vh
        const progress = Math.min(1, Math.max(0, scrollY / vh));
        
        // Only update if changed meaningfully to avoid unnecessary style recalculations
        if (Math.abs(progress - lastProgress) > 0.002) {
          lastProgress = progress;
          document.documentElement.style.setProperty(
            "--scroll-progress",
            progress.toFixed(4)
          );
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
