"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

export interface ScrollCanvasSequenceProps {
  /** Total number of frames in the sequence */
  frameCount?: number;
  /** Function mapping a 0-indexed frame number to an asset URL */
  framePattern?: (index: number) => string;
  /** Static high-resolution fallback image URL */
  fallbackSrc?: string;
  /** Additional container classes */
  className?: string;
  /** Heading overlaid on the sequence */
  title?: string;
  /** Subtitle / descriptor overlaid on the sequence */
  subtitle?: string;
  /** Category tag */
  tag?: string;
  /** Flag indicating whether the sequence frame files exist on disk */
  isSequenceReady?: boolean;
}

// Media query subscriptions via React's useSyncExternalStore
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * ScrollCanvasSequence — High-performance, isolated scroll-linked canvas renderer.
 *
 * Architecture & Constraints:
 * - Completely isolated: Does not mutate global CSS custom properties or interfere with the hero controller.
 * - Hardware accelerated: Renders to an HTML5 2D canvas with devicePixelRatio scaling.
 * - Passive rAF scheduling: Draws frames on compositor animation frames without React state thrashing.
 * - Progressive loading: Prioritizes frame 0 and fallback, with windowed preloading of nearby frames.
 * - Safe aspect ratio: Employs an exact 'cover' clipping algorithm to prevent distortion or blank flashes.
 * - Accessible: Honors prefers-reduced-motion via useSyncExternalStore, provides semantic alt text.
 */
export default function ScrollCanvasSequence({
  frameCount = 24,
  framePattern = (idx) => `/sequences/mandap-assembly/frame_${String(idx + 1).padStart(2, "0")}.webp`,
  fallbackSrc = "/sequences/mandap-assembly/fallback.jpg",
  className = "",
  title = "Sacred Mandap Architecture",
  subtitle = "Interactive scroll assembly of royal Vedic floral dome and carved antique-gold pillars",
  tag = "Atelier Scenography Prototype",
  isSequenceReady = true,
}: ScrollCanvasSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!canvas || !container || !track) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Cache bounded map of loaded HTMLImageElements
    const imageCache = new Map<number, HTMLImageElement>();
    let fallbackImage: HTMLImageElement | null = null;
    let lastDrawnFrame = -1;
    let rafId: number | null = null;
    let isDisposed = false;

    // Helper: Draw image with cover geometry
    const drawCover = (img: HTMLImageElement) => {
      if (!canvas || !ctx) return;
      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;

      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (iw === 0 || ih === 0) return;

      const canvasRatio = cw / ch;
      const imgRatio = iw / ih;

      let rw = cw;
      let rh = ch;
      let ox = 0;
      let oy = 0;

      if (canvasRatio > imgRatio) {
        rw = cw;
        rh = cw / imgRatio;
        ox = 0;
        oy = (ch - rh) / 2;
      } else {
        rh = ch;
        rw = ch * imgRatio;
        ox = (cw - rw) / 2;
        oy = 0;
      }

      ctx.fillStyle = "#150102";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, ox, oy, rw, rh);
    };

    // Helper: Resize canvas matching container client bounds with DPR
    const resizeCanvas = () => {
      if (!canvas || !container) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        return true;
      }
      return false;
    };

    // Helper: Load a single frame
    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      if (imageCache.has(index)) {
        return Promise.resolve(imageCache.get(index)!);
      }

      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.decoding = "async";
        img.src = framePattern(index);

        img.onload = () => {
          if (isDisposed) return;
          // Maintain cache size <= 32 images
          if (imageCache.size > 32) {
            const firstKey = imageCache.keys().next().value;
            if (firstKey !== undefined) imageCache.delete(firstKey);
          }
          imageCache.set(index, img);
          resolve(img);
        };

        img.onerror = () => {
          reject(new Error(`Failed to load frame ${index}`));
        };
      });
    };

    // Helper: Progressive preloading of window around current frame
    const preloadWindow = (centerIndex: number, windowSize = 4) => {
      const start = Math.max(0, centerIndex - windowSize);
      const end = Math.min(frameCount - 1, centerIndex + windowSize);
      for (let i = start; i <= end; i++) {
        if (!imageCache.has(i)) {
          loadFrame(i).catch(() => {});
        }
      }
    };

    // Primary Render Routine
    const render = (forceRedraw = false) => {
      if (!track || !container || isDisposed) return;

      const sizeChanged = resizeCanvas();

      // Compute normalized progress [0, 1] relative to the pinned scroll track
      const trackRect = track.getBoundingClientRect();
      const scrollableDistance = trackRect.height - window.innerHeight;

      let progress = 0;
      if (scrollableDistance > 0) {
        const currentScroll = -trackRect.top;
        progress = Math.min(1, Math.max(0, currentScroll / scrollableDistance));
      }

      // Map progress to target frame index
      const targetFrame = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(progress * (frameCount - 1)))
      );

      // Expose current frame & progress to container dataset for inspection without re-rendering React
      container.dataset.frameIndex = String(targetFrame);
      container.dataset.scrollProgress = progress.toFixed(3);

      // Skip draw if frame and size are unchanged
      if (!forceRedraw && !sizeChanged && targetFrame === lastDrawnFrame) {
        return;
      }

      // Preload adjacent frames if sequence assets are ready
      if (isSequenceReady) {
        preloadWindow(targetFrame);
      }

      // Get target frame or best loaded substitute
      let imgToDraw = imageCache.get(targetFrame);

      if (!imgToDraw) {
        // Asynchronously load the target frame and redraw as soon as it arrives
        if (isSequenceReady) {
          loadFrame(targetFrame)
            .then(() => {
              if (isDisposed) return;
              render(true);
            })
            .catch(() => {});
        }

        // Find nearest loaded frame in the interim to avoid flashes
        let closestDist = Infinity;
        let closestImg: HTMLImageElement | null = null;
        imageCache.forEach((cachedImg, idx) => {
          const dist = Math.abs(idx - targetFrame);
          if (dist < closestDist) {
            closestDist = dist;
            closestImg = cachedImg;
          }
        });
        imgToDraw = closestImg || fallbackImage || undefined;
      }

      if (imgToDraw) {
        drawCover(imgToDraw);
        lastDrawnFrame = targetFrame;
      }
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        render();
      });
    };

    // Step 1: Priority load master fallback
    const masterFallback = document.createElement("img");
    masterFallback.decoding = "async";
    masterFallback.src = fallbackSrc;

    masterFallback.onload = () => {
      if (isDisposed) return;
      fallbackImage = masterFallback;
      resizeCanvas();
      drawCover(masterFallback);
      
      // Step 2: Attempt frame 0 only if sequence assets are ready
      if (isSequenceReady) {
        loadFrame(0)
          .then((f0) => {
            if (isDisposed) return;
            drawCover(f0);
            lastDrawnFrame = 0;
          })
          .catch(() => {
            // Graceful fallback remains active if sequence load fails
          });
      }
    };

    masterFallback.onerror = () => {
      if (isDisposed) return;
      setLoadError(true);
    };

    // Attach passive listeners
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      isDisposed = true;
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [frameCount, framePattern, fallbackSrc, isReducedMotion, isSequenceReady]);

  // Reduced motion presentation: static high-resolution frame with no forced pinning
  if (isReducedMotion) {
    return (
      <section
        className={`relative w-full py-16 px-5 sm:px-8 bg-burgundy-deep text-ivory border-y border-gold/20 ${className}`}
        aria-label={title}
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-gold/60" />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">
              {tag}
            </span>
            <span className="w-8 h-px bg-gold/60" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-ivory">{title}</h2>
          <p className="font-sans text-sm sm:text-base text-ivory/80 max-w-xl">{subtitle}</p>

          <div className="w-full relative rounded-xl overflow-hidden border border-gold/30 shadow-2xl aspect-video bg-plum">
            <Image
              src={fallbackSrc}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-4 left-4 font-sans text-xs px-3 py-1.5 bg-burgundy-deep/90 text-gold border border-gold/30 rounded backdrop-blur-md">
              Motion Reduced Presentation · Master Mandap
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      ref={trackRef}
      className={`relative w-full h-[260vh] bg-burgundy-deep ${className}`}
      data-testid="canvas-sequence-track"
    >
      {/* Sticky Viewport Container */}
      <div
        ref={containerRef}
        data-testid="canvas-sequence-container"
        data-frame-index="0"
        data-scroll-progress="0.000"
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-burgundy-deep"
      >
        {/* Canvas Render Surface */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`${title} — Interactive scroll-controlled frame sequence`}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Ambient Filigree Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-transparent to-burgundy-deep/80 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(21,1,2,0.85)_100%)] pointer-events-none z-10" />

        {/* Editorial Overlay Pill & Instructions */}
        <div className="relative z-20 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-4 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-burgundy-deep/85 border border-gold/40 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              {tag}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory tracking-wide drop-shadow-md">
            {title}
          </h2>

          <p className="font-sans text-xs sm:text-sm text-ivory/80 max-w-md leading-relaxed drop-shadow">
            {subtitle}
          </p>

          {/* Interactive Scroll Prompt Indicator */}
          <div className="flex items-center gap-3 pt-2 text-gold/80 font-sans text-[11px] uppercase tracking-widest">
            <span>Scroll Down to Assemble</span>
            <span className="text-sm">↓</span>
            <span>Scroll Up to Reverse</span>
          </div>
        </div>

        {/* Bottom Telemetry Bar (For prototype observability) */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none text-[11px] font-sans text-ivory/70">
          <span className="px-3 py-1 bg-burgundy-deep/90 border border-gold/20 rounded backdrop-blur-md">
            {isSequenceReady ? (
              <>Deterministic Local Assets: <code className="text-gold">/sequences/mandap-assembly/</code></>
            ) : (
              <>Prototype Mode: <span className="text-gold">Master Mandap Reference Active (3D Renders Pending)</span></>
            )}
          </span>
          <span className="px-3 py-1 bg-burgundy-deep/90 border border-gold/20 rounded backdrop-blur-md hidden sm:inline-block">
            Hardware Accelerated Canvas 2D · Cover Projection
          </span>
        </div>

        {/* Accessible hidden fallback content */}
        <div className="sr-only">
          <p>{title}</p>
          <p>{subtitle}</p>
          {loadError && <p>Static fallback active: authentic master mandap rendering loaded.</p>}
        </div>
      </div>
    </div>
  );
}
