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
      document.documentElement.style.setProperty("--story-progress", "1");
      document.querySelectorAll(".vve-reveal, .cinematic-image-container, .typography-mask").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    let rafId: number | null = null;
    let lastHeroProgress = -1;
    let lastSectionProgress = -1;
    let lastStoryProgress = -1;

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

        // 3. Story section progress tracking (#about)
        const storyEl = document.querySelector("#about");
        if (storyEl) {
          const rect = storyEl.getBoundingClientRect();
          const storyHeight = rect.height || vh;
          // Progress from when top enters bottom of viewport to when bottom leaves top
          const storyProgress = Math.min(
            1,
            Math.max(0, (vh - rect.top) / (vh + storyHeight))
          );
          if (Math.abs(storyProgress - lastStoryProgress) > 0.002) {
            lastStoryProgress = storyProgress;
            document.documentElement.style.setProperty(
              "--story-progress",
              storyProgress.toFixed(4)
            );
          }
        }

        // 4. Update story milestones active state based on viewport focus
        const milestones = document.querySelectorAll(".story-milestone-item");
        if (milestones.length > 0) {
          const focusLine = vh * 0.45;
          let bestIdx = 0;
          let minDistance = Infinity;

          milestones.forEach((item, idx) => {
            const r = item.getBoundingClientRect();
            const center = r.top + r.height / 2;
            const dist = Math.abs(center - focusLine);
            if (dist < minDistance) {
              minDistance = dist;
              bestIdx = idx;
            }
          });

          milestones.forEach((item, idx) => {
            if (idx === bestIdx) {
              item.classList.add("active");
            } else {
              item.classList.remove("active");
            }
          });
        }
      });
    };

    // 5. IntersectionObserver for bidirectional cinematic reveals
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
          } else {
            // Only un-reveal if scrolled below the viewport (scrolling up)
            // so content is never hidden while reading
            const rect = entry.boundingClientRect;
            if (rect.top > window.innerHeight) {
              el.classList.remove("is-revealed");
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    const observeElements = () => {
      const targets = document.querySelectorAll(
        ".vve-reveal, .vve-reveal-fade, .vve-reveal-scale, .vve-reveal-left, .vve-reveal-right, .cinematic-image-container, .typography-mask, .vve-stagger-group"
      );
      targets.forEach((el) => {
        revealObserver.observe(el);
      });
    };

    // Schedule after React initial hydration completes
    const initTimer = setTimeout(() => {
      observeElements();
    }, 50);

    // Re-observe if DOM mutates (e.g., client route changes)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Initialize progress on mount
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      revealObserver.disconnect();
      mutationObserver.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}
