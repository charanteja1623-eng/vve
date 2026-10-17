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
  /** Responsive mobile frame URL builder for viewports <= 768px */
  mobileFramePattern?: (index: number) => string;
  /** Flag indicating whether the sequence frame files exist on disk */
  isSequenceReady?: boolean;
  /** Show the interactive 3D spatial scrubber interface (default: true) */
  showScrubber?: boolean;
  /** Show telemetry bar (default: false on production, configurable) */
  showTelemetry?: boolean;
}

export const SPATIAL_MANDAP_PHASES = [
  { minFrame: 0, maxFrame: 4, milestone: "Phase 01", label: "Sacred Plinth & Geometry", short: "Plinth" },
  { minFrame: 5, maxFrame: 9, milestone: "Phase 02", label: "Carved Antique-Gold Pillars", short: "Pillars" },
  { minFrame: 10, maxFrame: 14, milestone: "Phase 03", label: "Vedic Architraves & Capitals", short: "Arches" },
  { minFrame: 15, maxFrame: 19, milestone: "Phase 04", label: "Royal Lotus Floral Dome", short: "Dome" },
  { minFrame: 20, maxFrame: 23, milestone: "Phase 05", label: "Diya Luster & Illumination", short: "Sanctum" },
] as const;

export function getSpatialPhase(frameIndex: number) {
  for (const phase of SPATIAL_MANDAP_PHASES) {
    if (frameIndex >= phase.minFrame && frameIndex <= phase.maxFrame) {
      return phase;
    }
  }
  return SPATIAL_MANDAP_PHASES[0];
}

// Media query subscriptions via React's useSyncExternalStore with cross-browser Safari/WebKit fallback
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.addEventListener) {
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  } else if ("addListener" in mq) {
    (mq as unknown as { addListener: (cb: () => void) => void }).addListener(callback);
    return () => (mq as unknown as { removeListener: (cb: () => void) => void }).removeListener(callback);
  }
  return () => {};
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * ScrollCanvasSequence — High-performance, isolated scroll-linked canvas renderer
 * with interactive 3D Spatial Canvas Scrubber (Option A).
 */
export default function ScrollCanvasSequence({
  frameCount = 24,
  framePattern = (idx) => `/sequences/mandap-assembly/frame_${String(idx + 1).padStart(2, "0")}.webp`,
  mobileFramePattern = (idx) => `/sequences/mandap-assembly/mobile/frame_${String(idx + 1).padStart(2, "0")}.webp`,
  fallbackSrc = "/sequences/mandap-assembly/fallback.jpg",
  className = "",
  title = "Sacred Mandap Architecture",
  subtitle = "Interactive scroll assembly of royal Vedic floral dome and carved antique-gold pillars",
  tag = "Atelier Scenography Prototype",
  isSequenceReady = true,
  showScrubber = true,
  showTelemetry = false,
}: ScrollCanvasSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Scrubber DOM element refs for zero-re-render 60fps telemetry syncing
  const sliderRef = useRef<HTMLInputElement>(null);
  const frameBadgeRef = useRef<HTMLSpanElement>(null);
  const phaseLabelRef = useRef<HTMLSpanElement>(null);
  const phaseMilestoneRef = useRef<HTMLSpanElement>(null);
  const isAutoPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

    // Helper: Load a single frame with responsive mobile tier support
    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      if (imageCache.has(index)) {
        return Promise.resolve(imageCache.get(index)!);
      }

      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.decoding = "async";
        
        const useMobile = typeof window !== "undefined" && window.innerWidth <= 768 && Boolean(mobileFramePattern);
        const targetUrl = useMobile && mobileFramePattern ? mobileFramePattern(index) : framePattern(index);
        img.src = targetUrl;

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
          // If mobile tier fails, attempt desktop frame fallback before rejecting
          if (useMobile && targetUrl !== framePattern(index)) {
            img.src = framePattern(index);
            return;
          }
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

      // Update Scrubber HUD DOM without React re-renders
      if (sliderRef.current && document.activeElement !== sliderRef.current) {
        sliderRef.current.value = String(targetFrame);
      }
      if (frameBadgeRef.current) {
        frameBadgeRef.current.textContent = `Frame ${String(targetFrame + 1).padStart(2, "0")} / ${frameCount} · ${(progress * 100).toFixed(0)}%`;
      }
      const currentPhase = getSpatialPhase(targetFrame);
      if (phaseLabelRef.current) {
        phaseLabelRef.current.textContent = currentPhase.label;
      }
      if (phaseMilestoneRef.current) {
        phaseMilestoneRef.current.textContent = currentPhase.milestone;
      }

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
      // Synchronously update telemetry dataset on scroll for instant responsiveness
      const trackRect = track.getBoundingClientRect();
      const scrollableDistance = trackRect.height - window.innerHeight;
      if (scrollableDistance > 0) {
        const currentScroll = -trackRect.top;
        const progress = Math.min(1, Math.max(0, currentScroll / scrollableDistance));
        const targetFrame = Math.min(
          frameCount - 1,
          Math.max(0, Math.floor(progress * (frameCount - 1)))
        );
        container.dataset.frameIndex = String(targetFrame);
        container.dataset.scrollProgress = progress.toFixed(3);
      }
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
  }, [frameCount, framePattern, mobileFramePattern, fallbackSrc, isReducedMotion, isSequenceReady]);

  // Direct scrubbing interactions for Option A: 3D Spatial Canvas Scrubber
  const scrubToFrame = (frameIndex: number, instant = false) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(frameCount - 1, frameIndex));
    const targetProgress = clamped / (frameCount - 1);
    const trackRect = trackRef.current.getBoundingClientRect();
    const scrollableDistance = trackRef.current.offsetHeight - window.innerHeight;
    if (scrollableDistance > 0) {
      const targetScrollY = window.scrollY + trackRect.top + targetProgress * scrollableDistance;
      window.scrollTo({
        top: targetScrollY,
        behavior: instant ? "auto" : "smooth",
      });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = parseInt(e.target.value, 10);
    scrubToFrame(frame, true);
  };

  const handleStep = (direction: -1 | 1) => {
    const current = parseInt(containerRef.current?.dataset.frameIndex || "0", 10);
    scrubToFrame(current + direction, false);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlayingRef.current) {
      isAutoPlayingRef.current = false;
      setIsPlaying(false);
      return;
    }
    isAutoPlayingRef.current = true;
    setIsPlaying(true);

    let current = parseInt(containerRef.current?.dataset.frameIndex || "0", 10);
    const interval = setInterval(() => {
      if (!isAutoPlayingRef.current) {
        clearInterval(interval);
        return;
      }
      current = (current + 1) % frameCount;
      scrubToFrame(current, true);
      if (current === frameCount - 1) {
        isAutoPlayingRef.current = false;
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 180);
  };

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

        {/* Option A: Interactive 3D Spatial Canvas Scrubber Dock */}
        {showScrubber && (
          <div
            data-testid="spatial-canvas-scrubber"
            className="absolute bottom-16 sm:bottom-20 left-4 right-4 max-w-xl mx-auto z-30 p-3.5 sm:p-4 rounded-xl bg-burgundy-deep/90 border border-gold/30 backdrop-blur-md shadow-2xl flex flex-col gap-2.5 pointer-events-auto"
          >
            {/* Scrubber Top Row: Phase Indicator & Frame Counter */}
            <div className="flex items-center justify-between text-xs font-sans">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span ref={phaseMilestoneRef} className="text-gold font-bold uppercase tracking-wider text-[11px]">
                  Phase 01
                </span>
                <span className="text-gold/40">•</span>
                <span ref={phaseLabelRef} className="text-ivory/90 font-serif tracking-wide text-xs">
                  Sacred Plinth & Geometry
                </span>
              </div>
              <span
                ref={frameBadgeRef}
                className="font-mono text-[11px] text-gold-light bg-plum/70 px-2 py-0.5 rounded border border-gold/20"
              >
                Frame 01 / {frameCount} · 0%
              </span>
            </div>

            {/* Scrubber Center: 3D Spatial Slider with Gold Track */}
            <div className="relative flex items-center w-full">
              <input
                ref={sliderRef}
                type="range"
                min="0"
                max={frameCount - 1}
                defaultValue="0"
                onChange={handleSliderChange}
                aria-label="3D Spatial Scrubber Timeline"
                className="w-full h-1.5 bg-burgundy/80 rounded-lg appearance-none cursor-pointer accent-gold border border-gold/20 hover:border-gold/50 transition-colors focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            {/* Scrubber Bottom: Milestones & Orbit Controls */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  aria-label="Previous Frame"
                  className="px-2 py-1 text-[11px] font-sans font-bold text-ivory/80 bg-plum/50 hover:bg-gold/20 hover:text-gold border border-gold/20 rounded transition-colors"
                >
                  ◄
                </button>
                <button
                  type="button"
                  onClick={toggleAutoPlay}
                  aria-label={isPlaying ? "Pause 3D Orbit" : "Play 3D Orbit"}
                  className="px-2.5 py-1 text-[11px] font-sans font-bold uppercase tracking-wider text-burgundy-deep bg-gold hover:bg-gold-light rounded transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>{isPlaying ? "❚❚ Pause" : "▶ 3D Orbit"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  aria-label="Next Frame"
                  className="px-2 py-1 text-[11px] font-sans font-bold text-ivory/80 bg-plum/50 hover:bg-gold/20 hover:text-gold border border-gold/20 rounded transition-colors"
                >
                  ►
                </button>
              </div>

              {/* Milestone Quick Jump Buttons */}
              <div className="flex items-center gap-1">
                {SPATIAL_MANDAP_PHASES.map((p) => (
                  <button
                    key={p.milestone}
                    type="button"
                    onClick={() => scrubToFrame(p.minFrame)}
                    title={`${p.milestone}: ${p.label}`}
                    className="px-1.5 sm:px-2 py-0.5 text-[10px] font-sans text-gold/80 hover:text-gold hover:bg-gold/15 rounded border border-gold/15 transition-all"
                  >
                    {p.short}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Telemetry Bar (For prototype observability) */}
        {showTelemetry && (
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
        )}

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
