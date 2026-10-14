"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import LogoMark from "@/components/brand/LogoMark";
import {
  FRAME_W,
  FRAME_H,
  FRAME_POINTS,
  WORDMARK_FALLBACK_POINTS,
} from "./logoDustPoints";

/**
 * Vintage Vibe Events — Gold Dust Logo Formation Loader.
 *
 * Visual Sequence:
 *   Phase A — Atmospheric Opening (0.0–0.8s):
 *     Deep imperial burgundy canvas with subtle radial gold ambience.
 *     Sparse field of fine antique-gold dust drifting gently in 3D layers.
 *     Wordmark and frame are completely hidden (0% opacity, no ghost letters).
 *
 *   Phase B — Gold Dust Gathers (0.8–2.0s):
 *     Gold dust begins moving in flowing, swirling currents toward the logo's center.
 *     Arced trajectories and spiral vortex pull metallic sand into the design.
 *     No rigid rectangular tiles or seams.
 *
 *   Phase C — Ornamental Frame Formation (2.0–3.3s):
 *     Dust traces and fills the actual filigree contours of the canonical master frame.
 *     Base high-res master frame cross-fades in seamlessly (2.85–3.35s) under the settled dust.
 *
 *   Phase D — Wordmark Materialization (3.0–4.2s):
 *     Only after the frame has formed, dust streams inward to outline and fill the letters:
 *     "VINTAGE" -> "VIBE" -> "EVENTS".
 *     Canonical typography cross-fades in (3.8–4.2s) with exact kerning and padding.
 *
 *   Phase E — Final Settling & Tagline (4.2–5.0s):
 *     Remaining ambient dust settles gently.
 *     Subtle localized gold luster bloom washes softly across the mark.
 *     Tagline ("Creating moments. Designing memories.") reveals below.
 *     Composed hold before graceful exit dissolve.
 *
 * Lifecycle:
 *   - Enforces strict MINIMUM of 5,000ms visible duration.
 *   - Waits for document.readyState === "complete" and document.fonts.ready.
 *   - Replays on every full browser reload (F5 / Refresh).
 *   - Locks background scrolling while active; restores upon exit.
 *   - Respects prefers-reduced-motion with an elegant static composition.
 */

const MIN_DISPLAY_MS = 5000;
const EXIT_MS = 650;

// Gold palette for fine metallic dust
const GOLD_PALETTE = [
  "rgba(247, 235, 184, ", // light champagne gold highlight
  "rgba(229, 196, 131, ", // luminous warm gold
  "rgba(201, 161, 90, ",  // classic antique gold
  "rgba(164, 124, 54, ",  // deep bronze gold shadow
];

interface Particle {
  // Current coordinates
  x: number;
  y: number;
  // Starting disperse position
  x0: number;
  y0: number;
  // Normalized target coordinates in 720x436 space (0..1)
  normX: number;
  normY: number;
  // Dynamic screen target coordinates
  tx: number;
  ty: number;
  // Particle visual properties
  size: number;
  baseAlpha: number;
  colorPrefix: string;
  depth: number;
  // Swirl physics
  swirlAngle: number;
  swirlRadius: number;
  phase: number;
  // Timing
  delay: number;
  duration: number;
  isAmbient: boolean;
  wordIdx?: number;
}

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
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

    // Lock scrolling while loader is active
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

    // 1. Strict minimum 5,000ms timer
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
      if (doneRef.current) {
        document.documentElement.removeAttribute("data-loader-active");
        document.body.style.overflow = "";
      }
    };
  }, [onDone]);

  // Gold Dust Canvas Animation Loop
  useEffect(() => {
    if (hidden || reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    const startTime = performance.now();

    // Initialize particles array
    const particles: Particle[] = [];

    // Helper: update stage bounds and target positions accurately from DOM
    const updateTargetPositions = (w: number, h: number) => {
      let stageW = Math.min(w * 0.84, 540);
      let stageH = stageW * (FRAME_H / FRAME_W);
      let stageX = (w - stageW) / 2;
      let stageY = (h - stageH) / 2;

      if (stageRef.current) {
        const r = stageRef.current.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          stageX = r.left;
          stageY = r.top;
          stageW = r.width;
          stageH = r.height;
        }
      }

      for (const p of particles) {
        if (!p.isAmbient) {
          p.tx = stageX + p.normX * stageW;
          p.ty = stageY + p.normY * stageH;
        }
      }
    };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      updateTargetPositions(width, height);
    };

    // Build initial particle cloud
    const rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || window.innerHeight;

    // 1. Frame contour particles (720 points sampled from public/vve-frame.png)
    for (let i = 0; i < FRAME_POINTS.length; i++) {
      const pt = FRAME_POINTS[i];
      const normX = pt[0] / FRAME_W;
      const normY = pt[1] / FRAME_H;
      const distCenter = Math.hypot(normX - 0.5, normY - 0.5);

      // Disperse across 3D spherical space around center
      const startAngle = (i * 0.17 + Math.sin(i)) * Math.PI * 2;
      const startDist = (width * 0.18) + (i % 7) * (width * 0.04) + Math.random() * 60;
      const x0 = (width / 2) + Math.cos(startAngle) * startDist;
      const y0 = (height / 2) + Math.sin(startAngle) * (startDist * 0.65);

      // Stagger: outer flourishes gather first (0.9s), inner cartouche rails gather later (1.6s)
      const delay = 0.9 + (1 - distCenter * 1.4) * 0.7 + (i % 5) * 0.06;
      const duration = 1.25 + (i % 4) * 0.08;

      particles.push({
        x: x0,
        y: y0,
        x0,
        y0,
        normX,
        normY,
        tx: 0,
        ty: 0,
        size: 1.1 + (i % 3) * 0.45,
        baseAlpha: 0.65 + (i % 4) * 0.1,
        colorPrefix: GOLD_PALETTE[i % GOLD_PALETTE.length],
        depth: 0.7 + (i % 5) * 0.15,
        swirlAngle: ((i % 2 === 0 ? 1 : -1) * (1.2 + (i % 7) * 0.2)),
        swirlRadius: 30 + (i % 6) * 8,
        phase: i * 0.35,
        delay,
        duration,
        isAmbient: false,
      });
    }

    // 2. Wordmark glyph particles (~390 points across VINTAGE, VIBE, EVENTS)
    for (let i = 0; i < WORDMARK_FALLBACK_POINTS.length; i++) {
      const pt = WORDMARK_FALLBACK_POINTS[i];
      const normX = pt[0] / FRAME_W;
      const normY = pt[1] / FRAME_H;
      const wordIdx = pt[2]; // 0: VINTAGE, 1: VIBE, 2: EVENTS

      const startAngle = (i * 0.23) * Math.PI * 2;
      const startDist = 70 + (i % 9) * 22;
      const x0 = (width / 2) + Math.cos(startAngle) * startDist;
      const y0 = (height / 2) + Math.sin(startAngle) * (startDist * 0.5);

      // Progressive letter emergence:
      // VINTAGE (2.9s - 3.4s) -> VIBE (3.3s - 3.7s) -> EVENTS (3.6s - 4.0s)
      const wordBaseDelay = wordIdx === 0 ? 2.95 : wordIdx === 1 ? 3.30 : 3.60;
      const charStagger = (normX - 0.2) * 0.6;
      const delay = wordBaseDelay + Math.max(0, charStagger) + (i % 4) * 0.04;
      const duration = 0.9 + (i % 3) * 0.08;

      particles.push({
        x: x0,
        y: y0,
        x0,
        y0,
        normX,
        normY,
        tx: 0,
        ty: 0,
        size: 1.0 + (i % 3) * 0.35,
        baseAlpha: 0.75 + (i % 3) * 0.1,
        colorPrefix: GOLD_PALETTE[i % 3], // bright/luminous golds
        depth: 0.9 + (i % 4) * 0.1,
        swirlAngle: (i % 2 === 0 ? 0.9 : -0.9) + (i % 5) * 0.15,
        swirlRadius: 20 + (i % 4) * 6,
        phase: i * 0.5,
        delay,
        duration,
        isAmbient: false,
        wordIdx,
      });
    }

    // 3. Ambient atmospheric drifting dust (160 particles)
    for (let i = 0; i < 160; i++) {
      const x0 = Math.random() * width;
      const y0 = Math.random() * height;
      particles.push({
        x: x0,
        y: y0,
        x0,
        y0,
        normX: 0,
        normY: 0,
        tx: 0,
        ty: 0,
        size: 0.8 + Math.random() * 1.4,
        baseAlpha: 0.25 + Math.random() * 0.35,
        colorPrefix: GOLD_PALETTE[i % GOLD_PALETTE.length],
        depth: 0.5 + Math.random() * 1.0,
        swirlAngle: (Math.random() - 0.5) * Math.PI,
        swirlRadius: 15 + Math.random() * 20,
        phase: Math.random() * Math.PI * 2,
        delay: 0,
        duration: 999,
        isAmbient: true,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    // Main 60fps render loop
    const render = (now: number) => {
      const t = (now - startTime) / 1000; // time in seconds

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.isAmbient) {
          // Continuous 3D atmospheric floating drift
          const floatX = Math.sin(t * 0.9 + p.phase) * (18 * p.depth);
          const floatY = Math.cos(t * 0.7 + p.phase) * (12 * p.depth) + (t * 4 * p.depth) % height;
          p.x = (p.x0 + floatX) % width;
          p.y = (p.y0 + floatY) % height;

          const twinkle = 0.8 + 0.2 * Math.sin(t * 2.5 + p.phase);
          const alpha = p.baseAlpha * twinkle;

          ctx.fillStyle = `${p.colorPrefix}${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Converging logo dust particles
          if (t < p.delay) {
            // Atmospheric drift before individual convergence time
            const driftMag = 8 * p.depth;
            const floatX = Math.sin(t * 1.4 + p.phase) * driftMag;
            const floatY = Math.cos(t * 1.1 + p.phase) * (driftMag * 0.7);
            p.x = p.x0 + floatX;
            p.y = p.y0 + floatY;

            // In Phase A (0.0-0.8s), wordmark particles remain sparse and soft
            const preAlpha =
              p.wordIdx !== undefined && t < 2.0
                ? p.baseAlpha * 0.25 * Math.min(1, t / 0.8)
                : p.baseAlpha * 0.65;

            ctx.fillStyle = `${p.colorPrefix}${preAlpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Convergence into target contours
            const rawP = Math.min(1, (t - p.delay) / p.duration);
            const progress = easeOutQuart(rawP);

            // Arced swirling path that decays to 0 exactly at destination
            const swirlDecay = (1 - rawP) * Math.sin(rawP * Math.PI);
            const arcX = Math.cos(p.swirlAngle + rawP * Math.PI * 2) * p.swirlRadius * swirlDecay;
            const arcY = Math.sin(p.swirlAngle + rawP * Math.PI * 2) * p.swirlRadius * swirlDecay * 0.6;

            p.x = p.x0 + (p.tx - p.x0) * progress + arcX;
            p.y = p.y0 + (p.ty - p.y0) * progress + arcY;

            // Settle smoothly into canonical mark: as the canonical artwork cross-fades in,
            // settled particles smoothly dissolve into the solid gold surface, leaving a clean, crisp mark.
            let alpha = p.baseAlpha;
            const fadeStart = p.wordIdx !== undefined ? 4.05 : 3.35;
            if (t > fadeStart) {
              const settleFade = Math.max(0, 1 - (t - fadeStart) / 0.6);
              alpha = p.baseAlpha * settleFade;
            }

            ctx.fillStyle = `${p.colorPrefix}${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [hidden, reduced]);

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

      {/* Cinematic Gold Dust Particle Canvas */}
      {!reduced && (
        <canvas
          ref={canvasRef}
          className="vve-dust-canvas"
          aria-hidden
        />
      )}

      {reduced ? (
        <div className="flex flex-col items-center justify-center gap-6 text-center px-4 relative z-10">
          <LogoMark className="w-[min(84vw,540px)]" priority />
          <div className="vve-tagline-wrap" aria-hidden>
            <p className="vve-tagline vve-tagline--static">
              <span className="inline-block">Creating moments.</span>{" "}
              <span className="inline-block vve-tagline-accent">Designing memories.</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center px-4 w-full relative z-10">
          <div ref={stageRef} className="vve-stage">
            {/* Base master frame — seals fine filigree tips at 2.85s - 3.35s */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="vve-frame-base"
              src="/vve-frame.png"
              alt=""
              aria-hidden
            />

            {/* Wordmark materializes progressively via dust, solidifying at 3.8s - 4.2s */}
            <div
              className="vve-wordmark vve-wordmark--loader"
              aria-label="VINTAGE VIBE EVENTS"
            >
              <span className="vve-word">VINTAGE</span>
              <span className="vve-word">VIBE</span>
              <span className="vve-word">EVENTS</span>
            </div>

            {/* Restrained Gold Luster Bloom (3.4s - 4.4s settling phase) */}
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
