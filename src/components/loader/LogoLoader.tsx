"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { SHARDS } from "./logoShards";
import LogoMark from "@/components/brand/LogoMark";

/**
 * Vintage Vibe Events — Precision Cinematic 5-Second Logo Loader.
 *
 * Sequence:
 *   0.0–0.8s: Deep burgundy canvas fades in with warm ambient radial gold glow.
 *   0.8–3.2s: Coordinated anatomical fragment assembly & per-letter wordmark formation.
 *             Letters converge into their exact baseline and kerning with zero clipping.
 *   2.8–3.3s: Base master frame cross-fades in to seal all fine filigree tips.
 *   3.2–4.2s: Restrained gold luster bloom washes softly across the mark and settles.
 *   4.2–5.0s: Tagline ("Creating moments. Designing memories.") fades in with composed hold.
 *   5.0s+:    Smooth exit dissolve once page is ready, cleanly handing off to hero.
 *
 * Lifecycle:
 *   - Enforces a strict MINIMUM of 5,000ms visible duration from first mount.
 *   - Waits for document.readyState === "complete" and document.fonts.ready.
 *   - Replays on every full browser reload (F5 / Refresh).
 *   - Locks scrolling on document.documentElement while active; hides scrollbars.
 *   - Honors prefers-reduced-motion with an elegant static composition.
 */

const MIN_DISPLAY_MS = 5000; // ms — strict minimum visible sequence duration
const EXIT_MS = 650; // ms — smooth overlay dissolve transition

const WORDS = ["VINTAGE", "VIBE", "EVENTS"] as const;

// Deterministic per-letter trajectory configurations
const LETTER_CONFIG = [
  // VINTAGE (7 chars)
  { dx: -14, dy: -6, rot: -3, delay: 1.30 },
  { dx: -10, dy: 6, rot: 2, delay: 1.38 },
  { dx: -12, dy: -5, rot: -2, delay: 1.46 },
  { dx: -8, dy: 5, rot: 3, delay: 1.54 },
  { dx: -10, dy: -6, rot: -1, delay: 1.62 },
  { dx: -6, dy: 6, rot: 2, delay: 1.70 },
  { dx: -5, dy: -4, rot: -2, delay: 1.78 },
  // VIBE (4 chars)
  { dx: -4, dy: 5, rot: 2, delay: 1.86 },
  { dx: 3, dy: -5, rot: -2, delay: 1.94 },
  { dx: -3, dy: 4, rot: 1, delay: 2.02 },
  { dx: 4, dy: -4, rot: -1, delay: 2.10 },
  // EVENTS (6 chars)
  { dx: 5, dy: 5, rot: 2, delay: 2.18 },
  { dx: 6, dy: -5, rot: -2, delay: 2.26 },
  { dx: 8, dy: 4, rot: 1, delay: 2.34 },
  { dx: 10, dy: -5, rot: -2, delay: 2.42 },
  { dx: 12, dy: 6, rot: 2, delay: 2.50 },
  { dx: 14, dy: -6, rot: 3, delay: 2.58 },
];

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (notify) => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
      }
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => {
      if (typeof window === "undefined" || !window.matchMedia) return false;
      return window.matchMedia(REDUCED_QUERY).matches;
    },
    () => false,
  );
}

function waitForPageReady(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }

    const checkReady = () => {
      const isComplete = document.readyState === "complete";
      const fontsPromise =
        typeof document.fonts !== "undefined" && document.fonts.ready
          ? document.fonts.ready
          : Promise.resolve();

      if (isComplete) {
        fontsPromise.then(() => resolve()).catch(() => resolve());
      } else {
        window.addEventListener(
          "load",
          () => {
            fontsPromise.then(() => resolve()).catch(() => resolve());
          },
          { once: true },
        );
      }
    };

    checkReady();
  });
}

export default function LogoLoader({ onDone }: { onDone?: () => void }) {
  const [hidden, setHidden] = useState(false);
  const [exiting, setExiting] = useState(false);
  const reduced = usePrefersReducedMotion();
  const doneRef = useRef(false);

  useEffect(() => {
    let isForced = false;
    let isSkipped = false;
    try {
      const params = new URLSearchParams(window.location.search);
      isForced = params.get("loader") === "always";
      isSkipped = params.get("loader") === "skip";
    } catch {}

    const isSpaNav =
      typeof window !== "undefined" &&
      Boolean((window as unknown as { __vve_seen?: boolean }).__vve_seen);

    if (isSkipped || (!isForced && isSpaNav)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(true);
      document.documentElement.removeAttribute("data-loader-active");
      document.documentElement.setAttribute("data-loader-done", "true");
      onDone?.();
      return;
    }

    // Strictly lock scrolling while loader is active
    document.documentElement.setAttribute("data-loader-active", "true");
    document.body.style.overflow = "hidden";

    let isMounted = true;
    let minTimeElapsed = false;
    let pageReady = false;
    let exitTimer = 0;

    const tryDismiss = () => {
      if (!isMounted || doneRef.current) return;
      if (minTimeElapsed && pageReady) {
        doneRef.current = true;
        setExiting(true);

        exitTimer = window.setTimeout(() => {
          if (!isMounted) return;
          (window as unknown as { __vve_seen?: boolean }).__vve_seen = true;
          setHidden(true);
          document.documentElement.removeAttribute("data-loader-active");
          document.documentElement.setAttribute("data-loader-done", "true");
          document.body.style.overflow = "";
          onDone?.();
        }, EXIT_MS);
      }
    };

    // 1. Strict minimum 5,000ms timer from visible mount
    const durationTimer = window.setTimeout(() => {
      minTimeElapsed = true;
      tryDismiss();
    }, MIN_DISPLAY_MS);

    // 2. Wait for full page readiness (DOM + resources + web fonts)
    waitForPageReady().then(() => {
      pageReady = true;
      tryDismiss();
    });

    return () => {
      isMounted = false;
      window.clearTimeout(durationTimer);
      window.clearTimeout(exitTimer);
      // Clean up only if dismissed to prevent React StrictMode unmount clearing the lock
      if (doneRef.current) {
        document.documentElement.removeAttribute("data-loader-active");
        document.body.style.overflow = "";
      }
    };
  }, [onDone]);

  if (hidden) return null;

  return (
    <div
      className="vve-loader"
      data-exiting={exiting ? "true" : "false"}
      role="status"
      aria-label="Vintage Vibe Events — loading"
      aria-live="polite"
    >
      {/* Ambient warm atmospheric background glow */}
      <div className="vve-loader-ambient" aria-hidden />

      {reduced ? (
        <div className="flex flex-col items-center justify-center gap-6 text-center px-4">
          <LogoMark className="w-[min(84vw,540px)]" priority />
          <div className="vve-tagline-wrap" aria-hidden>
            <p className="vve-tagline vve-tagline--static">
              <span className="inline-block">Creating moments.</span>{" "}
              <span className="inline-block vve-tagline-accent">Designing memories.</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center px-4 w-full">
          <div className="vve-stage">
            {/* Base master frame — seals fine filigree tips at 2.85s - 3.35s */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="vve-frame-base"
              src="/vve-frame.png"
              alt=""
              aria-hidden
            />

            {/* Coordinated Anatomical Shards */}
            <div className="vve-shards" aria-hidden>
              {SHARDS.map((s) => (
                <span
                  key={s.id}
                  className={`vve-shard vve-shard--${s.id}`}
                  style={
                    {
                      "--clip-top": `${s.clipTop}%`,
                      "--clip-right": `${s.clipRight}%`,
                      "--clip-bottom": `${s.clipBottom}%`,
                      "--clip-left": `${s.clipLeft}%`,
                      "--ox": `${s.ox}%`,
                      "--oy": `${s.oy}%`,
                      "--dx": `${s.dx}px`,
                      "--dy": `${s.dy}px`,
                      "--rot": `${s.rot}deg`,
                      "--sc": String(s.sc),
                      "--delay": `${s.delay}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>

            {/* Coordinated Per-Letter Wordmark Assembly */}
            <div
              className="vve-wordmark vve-wordmark--animated"
              aria-label="VINTAGE VIBE EVENTS"
            >
              {WORDS.map((word, wIdx) => {
                const startIdx = wIdx === 0 ? 0 : wIdx === 1 ? 7 : 11;
                return (
                  <span key={word} className="vve-word">
                    {word.split("").map((char, cIdx) => {
                      const cfg = LETTER_CONFIG[startIdx + cIdx];
                      return (
                        <span
                          key={cIdx}
                          className="vve-letter"
                          style={
                            {
                              "--char-dx": `${cfg.dx}px`,
                              "--char-dy": `${cfg.dy}px`,
                              "--char-rot": `${cfg.rot}deg`,
                              "--char-delay": `${cfg.delay}s`,
                            } as CSSProperties
                          }
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>

            {/* Restrained Gold Luster Bloom (3.2s - 4.2s settling phase) */}
            <div className="vve-gold-luster" aria-hidden />
          </div>

          {/* Tagline reveals smoothly between 4.2s and 5.0s */}
          <div className="vve-tagline-wrap" aria-hidden>
            <p className="vve-tagline">
              <span className="inline-block">Creating moments.</span>{" "}
              <span className="inline-block vve-tagline-accent">Designing memories.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
