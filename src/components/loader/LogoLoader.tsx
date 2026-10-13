"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { SHARDS, COLS, ROWS, FRAME_W, FRAME_H } from "./logoShards";
import LogoMark from "@/components/brand/LogoMark";

/**
 * Vintage Vibe Events — Cinematic 5-Second Logo Loader.
 *
 * Sequence:
 *   0.0–0.8s: Deep burgundy canvas fades in with warm ambient radial glow.
 *   0.8–3.2s: Gold fragments follow controlled trajectories and assemble into
 *             the official frame artwork (public/vve-frame.png).
 *   2.25–3.2s: Cinzel Decorative Bold wordmark emerges from center-out.
 *   2.95–3.4s: Base master frame cross-fades in to seal all fine filigree tips.
 *   3.25–4.3s: Restrained gold light sweep reveals the completed mark.
 *   4.2–5.0s:  Tagline ("Creating moments. Designing memories.") fades in.
 *   5.0s+:     Holds serenely until page is ready, then dissolves gracefully.
 *
 * Lifecycle:
 *   - Enforces a MINIMUM of 5,000ms visible duration from first mount.
 *   - Waits for document.readyState === "complete" and document.fonts.ready.
 *   - If page is not ready after 5,000ms, holds in calm assembled state.
 *   - Honors prefers-reduced-motion with an elegant static composition
 *     while maintaining the full minimum 5,000ms display duration.
 */

const FRAME_SRC = "url(/vve-frame.png)";
const SETTLE_DELAY = 2.95; // s — base image cross-fades in as shards settle
const WORDMARK_DELAY = 2.25; // s — wordmark reveal starts
const MIN_DISPLAY_MS = 5000; // ms — strict minimum visible sequence duration
const EXIT_MS = 650; // ms — smooth overlay dissolve transition

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

/**
 * Resolves when both document lifecycle and web fonts are fully ready.
 */
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
    let seen = false;
    try {
      const params = new URLSearchParams(window.location.search);
      const isForced = params.get("loader") === "always";
      seen = !isForced && sessionStorage.getItem("vve_loader_seen") === "1";
    } catch {}

    if (seen) {
      // Returning-visitor fast path: sessionStorage can only be read post-hydration
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(true);
      onDone?.();
      return;
    }

    const prevOverflow = document.body.style.overflow;
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
        try {
          sessionStorage.setItem("vve_loader_seen", "1");
        } catch {}
        exitTimer = window.setTimeout(() => {
          if (!isMounted) return;
          setHidden(true);
          document.body.style.overflow = prevOverflow;
          onDone?.();
        }, EXIT_MS);
      }
    };

    // 1. Strict minimum 5,000ms timer from visible mount
    const durationTimer = window.setTimeout(() => {
      minTimeElapsed = true;
      tryDismiss();
    }, MIN_DISPLAY_MS);

    // 2. Wait for full page readiness (DOM + images/subresources + fonts)
    waitForPageReady().then(() => {
      pageReady = true;
      tryDismiss();
    });

    return () => {
      isMounted = false;
      window.clearTimeout(durationTimer);
      window.clearTimeout(exitTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [onDone]);

  if (hidden) return null;

  const stageStyle = {
    "--frame-w": String(FRAME_W),
    "--frame-h": String(FRAME_H),
    "--cols": String(COLS),
    "--rows": String(ROWS),
    "--frame-src": FRAME_SRC,
    "--settle-delay": `${SETTLE_DELAY}s`,
    "--wordmark-delay": `${WORDMARK_DELAY}s`,
  } as CSSProperties;

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
          <LogoMark className="w-[min(82vw,560px)]" priority />
          <div className="vve-tagline-wrap" aria-hidden>
            <p className="vve-tagline vve-tagline--static">
              Creating moments.{" "}
              <span className="vve-tagline-accent">Designing memories.</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center px-4 w-full">
          <div className="vve-stage" style={stageStyle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="vve-frame-base"
              src="/vve-frame.png"
              alt=""
              aria-hidden
            />
            <div className="vve-shards" aria-hidden>
              {SHARDS.map((s, i) => (
                <span
                  key={i}
                  className="vve-shard"
                  style={
                    {
                      "--c": String(s.c),
                      "--r": String(s.r),
                      "--dx": String(s.dx),
                      "--dy": String(s.dy),
                      "--rot": String(s.rot),
                      "--sc": String(s.sc),
                      "--delay": `${(0.8 + s.delay * 1.35).toFixed(3)}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <span className="vve-wordmark vve-wordmark--animated" aria-hidden>
              VINTAGE VIBE EVENTS
            </span>
            {/* Restrained gold light sweep */}
            <div className="vve-shimmer" aria-hidden />
          </div>

          {/* Tagline reveals smoothly between 4.2s and 5.0s */}
          <div className="vve-tagline-wrap" aria-hidden>
            <p className="vve-tagline">
              Creating moments.{" "}
              <span className="vve-tagline-accent">Designing memories.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
