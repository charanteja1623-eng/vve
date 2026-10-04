"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { SHARDS, COLS, ROWS, FRAME_W, FRAME_H } from "./logoShards";
import LogoMark from "@/components/brand/LogoMark";

/**
 * §7 shatter-and-reassemble splash loader.
 *
 * The gold ornamental frame breaks into plate/shard fragments — each an exact
 * grid slice of the real frame artwork — that scatter and then reassemble
 * pixel-exact, while the "VINTAGE VIBE EVENTS" wordmark (live Cinzel Decorative
 * Bold) reveals into place. Both converge into the canonical LogoMark. This is a
 * reassembly of the logo's OWN geometry — not ambient particle convergence.
 *
 * Animates transform + opacity only. Honors prefers-reduced-motion (static
 * logo, no shatter), supports early-exit (tap / key), and plays once per tab.
 */

const FRAME_SRC = "url(/vve-frame.png)";
const SETTLE_DELAY = 0.95; // s — base image fades in as the shards land
const WORDMARK_DELAY = 1.15; // s — wordmark reveal begins
const FULL_MS = 2450; // hold until fully assembled, then exit
const REDUCED_MS = 800; // reduced-motion: brief, calm hold
const EXIT_MS = 520; // overlay fade-out (matches CSS transition)

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Subscribe to the OS "reduce motion" setting as an external store — the
 * React-sanctioned way to read a browser API without a setState-in-effect.
 * Server snapshot is `false` (full markup renders), the client re-reads on
 * hydration and switches to the static fallback for users who opted out.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

export default function LogoLoader({ onDone }: { onDone?: () => void }) {
  const [hidden, setHidden] = useState(false);
  const [exiting, setExiting] = useState(false);
  const reduced = usePrefersReducedMotion();
  const doneRef = useRef(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("vve_loader_seen") === "1";
    } catch {}

    const prefersReduced = window.matchMedia?.(REDUCED_QUERY).matches ?? false;

    if (seen) {
      // Returning-visitor fast path. sessionStorage can't be read during SSR,
      // so this skip is necessarily a post-mount state sync, not derivable at
      // render time without a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(true);
      onDone?.();
      return;
    }
    try {
      sessionStorage.setItem("vve_loader_seen", "1");
    } catch {}

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let exitTimer = 0;
    const finish = () => {
      setHidden(true);
      document.body.style.overflow = prevOverflow;
      onDone?.();
    };
    const beginExit = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setExiting(true);
      exitTimer = window.setTimeout(finish, EXIT_MS);
    };

    const holdTimer = window.setTimeout(
      beginExit,
      prefersReduced ? REDUCED_MS : FULL_MS,
    );
    window.addEventListener("pointerdown", beginExit, { once: true });
    window.addEventListener("keydown", beginExit, { once: true });

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("pointerdown", beginExit);
      window.removeEventListener("keydown", beginExit);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {reduced ? (
        <LogoMark className="w-[min(80vw,560px)]" priority />
      ) : (
        <div className="vve-stage" style={stageStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="vve-frame-base" src="/vve-frame.png" alt="" aria-hidden />
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
                    "--delay": `${s.delay}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <span className="vve-wordmark vve-wordmark--animated" aria-hidden>
            VINTAGE VIBE EVENTS
          </span>
        </div>
      )}
    </div>
  );
}
