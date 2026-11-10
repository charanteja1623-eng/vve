"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";

/**
 * Concept 4: Cinematic Gilded Seal & Particle Assembly Loader
 *
 * Sequence & Pacing (~5.0s Total Lifecycle):
 *   0.0–1.8s: Golden stipple & particle assembly converging inward toward the cartouche.
 *   1.2–2.8s: Bilateral feathered mask reveal of the master cartouche frame.
 *   2.2–3.6s: Golden Cinzel Decorative wordmark reveal with soft specular luster sweep.
 *   3.4–4.6s: Editorial tagline reveals in warm ivory and gold italic ("Creating moments. Designing memories.").
 *   4.6–5.0s: Harmonic brand lockup holding state.
 *   5.0–5.5s: Seamless exit dissolve handoff into the hero stage.
 *
 * Lifecycle:
 *   - MIN_DISPLAY_MS = 4800ms
 *   - FAILSAFE_TRIGGER_MS = 5600ms (unconditional exit trigger; never traps scroll)
 *   - EXIT_TRANSITION_MS = 500ms
 *   - Replay: Replays on every full-page reload as mandated.
 *   - Bypass: Can be skipped with ?loader=skip.
 *   - Prefers-reduced-motion: Exits swiftly in <= 800ms with static composition.
 */

const NORMAL_DURATION_MS = 5000;
const EXIT_TRANSITION_MS = 400;
const REDUCED_MOTION_DURATION_MS = 400;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(notify: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_QUERY);
  if (mq.addEventListener) {
    mq.addEventListener("change", notify);
    return () => mq.removeEventListener("change", notify);
  } else if (mq.addListener) {
    mq.addListener(notify);
    return () => mq.removeListener(notify);
  }
  return () => {};
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

// 12 procedural particle coordinates converging to the cartouche frame
const PARTICLES = [
  { id: 1, x: "-80px", y: "-90px", delay: "0.1s", size: "4px" },
  { id: 2, x: "90px", y: "-85px", delay: "0.25s", size: "3px" },
  { id: 3, x: "-110px", y: "40px", delay: "0.15s", size: "3.5px" },
  { id: 4, x: "120px", y: "30px", delay: "0.3s", size: "4px" },
  { id: 5, x: "-60px", y: "95px", delay: "0.2s", size: "3px" },
  { id: 6, x: "70px", y: "100px", delay: "0.35s", size: "4.5px" },
  { id: 7, x: "-130px", y: "-40px", delay: "0.4s", size: "3px" },
  { id: 8, x: "140px", y: "-50px", delay: "0.2s", size: "3.5px" },
  { id: 9, x: "0px", y: "-110px", delay: "0.1s", size: "4px" },
  { id: 10, x: "0px", y: "115px", delay: "0.45s", size: "3px" },
  { id: 11, x: "-100px", y: "-70px", delay: "0.3s", size: "3.5px" },
  { id: 12, x: "105px", y: "75px", delay: "0.15s", size: "4px" },
];

export default function LogoLoader({ onDone }: { onDone?: () => void }) {
  const [hidden, setHidden] = useState(false);
  const [exiting, setExiting] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let isSkipped = false;
    try {
      const params = new URLSearchParams(window.location.search);
      isSkipped = params.get("loader") === "skip";
    } catch {}

    // Allow intentional bypass via ?loader=skip (for fast tests or explicit bypass)
    if (isSkipped) {
      setTimeout(() => {
        setHidden(true);
      }, 0);
      document.documentElement.removeAttribute("data-loader-active");
      document.documentElement.setAttribute("data-loader-done", "true");
      document.body.style.overflow = "";
      onDone?.();
      return;
    }

    // Lock background scrolling while loader is active
    document.documentElement.removeAttribute("data-loader-done");
    document.documentElement.setAttribute("data-loader-active", "true");
    document.body.style.overflow = "hidden";

    if (typeof window !== "undefined") {
      (window as unknown as { __vve_loader_mount_time?: number }).__vve_loader_mount_time = performance.now();
    }

    let paramReduced = false;
    try {
      paramReduced =
        new URLSearchParams(window.location.search).get("reducedMotion") ===
        "true";
    } catch {}

    const isMotionReduced =
      reduced ||
      paramReduced ||
      (typeof window !== "undefined" &&
        window.matchMedia?.(REDUCED_QUERY).matches);

    const activeDuration = isMotionReduced
      ? REDUCED_MOTION_DURATION_MS
      : NORMAL_DURATION_MS;
    const exitDuration = isMotionReduced ? 80 : EXIT_TRANSITION_MS;

    // Phase 1: Begin exit dissolve transition
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, activeDuration);

    // Phase 2: Complete dissolution, unmount from DOM, and release scroll locking
    const unmountTimer = setTimeout(() => {
      if (typeof window !== "undefined") {
        (window as unknown as { __vve_loader_unmount_time?: number }).__vve_loader_unmount_time = performance.now();
      }
      setHidden(true);
      document.documentElement.removeAttribute("data-loader-active");
      document.documentElement.setAttribute("data-loader-done", "true");
      document.body.style.overflow = "";
      onDone?.();
    }, activeDuration + exitDuration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
      // Failsafe: scroll lock is ALWAYS cleanly released on unmount
      document.documentElement.removeAttribute("data-loader-active");
      document.body.style.overflow = "";
    };
  }, [reduced, onDone]);

  if (hidden) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Vintage Vibe Events Logo"
      data-exiting={exiting ? "true" : "false"}
      className="vve-loader fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Warm ambient background aura */}
      <div className="vve-loader-ambient" aria-hidden="true" />

      {/* Cartouche Master Stage */}
      <div className="vve-stage relative">
        {/* Golden Assembly Particle Constellation */}
        {!reduced && (
          <div className="vve-particle-constellation absolute inset-0 pointer-events-none" aria-hidden="true">
            {PARTICLES.map((p) => (
              <span
                key={p.id}
                className="vve-particle"
                style={{
                  "--px": p.x,
                  "--py": p.y,
                  "--pdelay": p.delay,
                  "--psize": p.size,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* Master Cartouche Frame with Bilateral Feathered Reveal */}
        <div className="vve-seal-reveal-wrap absolute inset-0 w-full h-full">
          <Image
            src="/vve-frame.png"
            alt="Vintage Vibe Events Cartouche Frame"
            width={720}
            height={436}
            priority
            className="vve-frame-base w-full h-full object-contain"
          />
        </div>

        {/* Specular Shimmer Sweep Effect */}
        <div className="vve-shimmer-sweep pointer-events-none" aria-hidden="true" />

        {/* Wordmark typography */}
        <div
          className="vve-wordmark vve-wordmark--loader"
          aria-label="Vintage Vibe Events"
        >
          <span className="vve-word">VINTAGE</span>
          <span className="vve-word">VIBE</span>
          <span className="vve-word">EVENTS</span>
        </div>
      </div>

      {/* Tagline */}
      <div className="vve-tagline-wrap" aria-hidden="true">
        <p className={`vve-tagline ${reduced ? "vve-tagline--static" : ""}`}>
          Creating moments. <span className="vve-tagline-accent">Designing memories.</span>
        </p>
      </div>
    </div>
  );
}
