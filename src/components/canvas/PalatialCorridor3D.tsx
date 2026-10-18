"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

export interface PalatialCorridor3DProps {
  /** Height of the pinned scroll track */
  trackHeight?: string;
  /** Primary title */
  title?: string;
  /** Subtitle descriptor */
  subtitle?: string;
  /** Category badge */
  tag?: string;
  /** Additional container classes */
  className?: string;
  /** Static high-res fallback image */
  fallbackSrc?: string;
}

// Architectural milestones along the 3D Z-axis
export const CORRIDOR_PORTALS = [
  {
    id: "portal-1",
    z: 0,
    name: "The Nizami Grand Portico",
    tagline: "Triple-scalloped imperial arches & antique brass finials",
    color: "#c9a15a",
  },
  {
    id: "portal-2",
    z: -550,
    name: "The Royal Jali Colonnade",
    tagline: "Carved sandstone lattice pillars & bracket lanterns",
    color: "#dfc28c",
  },
  {
    id: "portal-3",
    z: -1100,
    name: "Jasmine & Marigold Vault",
    tagline: "Suspended floral chandeliers & cascading crystalline drops",
    color: "#f5d799",
  },
  {
    id: "portal-4",
    z: -1650,
    name: "Imperial Diya Lantern Hall",
    tagline: "Flickering antique brass oil lamps casting warm ambient amber",
    color: "#e69c24",
  },
  {
    id: "portal-5",
    z: -2200,
    name: "Sunburst Vedic Architrave",
    tagline: "Hand-chiseled peacock motifs & sacred solar medallions",
    color: "#d4af37",
  },
  {
    id: "sanctum",
    z: -2750,
    name: "The Sacred Mandap Sanctum",
    tagline: "The royal 25-foot lotus floral dome illuminated in divine luster",
    color: "#f3e5ab",
  },
] as const;

const TOTAL_DEPTH = 2750; // Total Z distance to sanctum

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

export default function PalatialCorridor3D({
  trackHeight = "280vh",
  title = "Real-Time 3D Palatial Corridor",
  subtitle = "Interactive perspective camera gliding through authentic Nizami colonnades to the sacred mandap",
  tag = "Option B · Real-Time 3D Perspective Engine",
  className = "",
  fallbackSrc = "/vve-frame.png",
}: PalatialCorridor3DProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const depthDisplayRef = useRef<HTMLSpanElement>(null);
  const portalNameRef = useRef<HTMLSpanElement>(null);
  const portalTaglineRef = useRef<HTMLParagraphElement>(null);
  const autoPlayRef = useRef(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Real-time camera updates on scroll & mouse parallax
  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion) return;

    const track = trackRef.current;
    const container = containerRef.current;
    const world = worldRef.current;
    if (!track || !container || !world) return;

    let targetZ = 0;
    let currentZ = 0;
    let mouseX = 0;
    let mouseY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let rafId: number | null = null;
    let isDisposed = false;

    const updateCamera = () => {
      if (isDisposed) return;

      // Smooth camera interpolation (lerp)
      currentZ += (targetZ - currentZ) * 0.15;
      if (Math.abs(targetZ - currentZ) < 0.5) {
        currentZ = targetZ;
      }
      currentTiltX += ((mouseY * -5) - currentTiltX) * 0.08;
      currentTiltY += ((mouseX * 7) - currentTiltY) * 0.08;

      // Apply 3D Matrix Transform to World
      world.style.transform = `translate3d(0, 0, ${currentZ.toFixed(1)}px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;

      // Identify active portal
      const normalizedDepth = Math.min(1, Math.max(0, currentZ / TOTAL_DEPTH));
      const activeIdx = Math.min(
        CORRIDOR_PORTALS.length - 1,
        Math.floor(normalizedDepth * CORRIDOR_PORTALS.length)
      );
      const activePortal = CORRIDOR_PORTALS[activeIdx];

      // Update HUD refs directly without React state thrashing
      if (container) {
        container.dataset.cameraZ = currentZ.toFixed(0);
        container.dataset.scrollProgress = normalizedDepth.toFixed(3);
        container.dataset.activePortal = activePortal.id;
      }
      if (depthDisplayRef.current) {
        depthDisplayRef.current.textContent = `${Math.round(currentZ)} mm / ${TOTAL_DEPTH} mm (${(normalizedDepth * 100).toFixed(0)}%)`;
      }
      if (portalNameRef.current) {
        portalNameRef.current.textContent = activePortal.name;
      }
      if (portalTaglineRef.current) {
        portalTaglineRef.current.textContent = activePortal.tagline;
      }
      if (sliderRef.current && document.activeElement !== sliderRef.current) {
        sliderRef.current.value = String(Math.round(currentZ));
      }

      // Continue animation frame if movement is ongoing
      if (
        Math.abs(targetZ - currentZ) > 0.1 ||
        Math.abs(mouseY * -5 - currentTiltX) > 0.05 ||
        Math.abs(mouseX * 7 - currentTiltY) > 0.05
      ) {
        rafId = window.requestAnimationFrame(updateCamera);
      } else {
        rafId = null;
      }
    };

    const scheduleUpdate = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateCamera);
      }
    };

    const onScroll = () => {
      const trackRect = track.getBoundingClientRect();
      const scrollableDistance = trackRect.height - window.innerHeight;
      if (scrollableDistance > 0) {
        const currentScroll = -trackRect.top;
        const progress = Math.min(1, Math.max(0, currentScroll / scrollableDistance));
        targetZ = progress * TOTAL_DEPTH;
        if (container) {
          container.dataset.cameraZ = targetZ.toFixed(0);
          container.dataset.scrollProgress = progress.toFixed(3);
          const activeIdx = Math.min(
            CORRIDOR_PORTALS.length - 1,
            Math.floor(progress * CORRIDOR_PORTALS.length)
          );
          container.dataset.activePortal = CORRIDOR_PORTALS[activeIdx].id;
        }
        scheduleUpdate();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        scheduleUpdate();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    onScroll();

    return () => {
      isDisposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [isReducedMotion]);

  // Scrub camera directly to a given millimeter depth
  const scrubToDepth = (depthMm: number, smooth = true) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(TOTAL_DEPTH, depthMm));
    const progress = clamped / TOTAL_DEPTH;
    const trackRect = trackRef.current.getBoundingClientRect();
    const scrollableDistance = trackRef.current.offsetHeight - window.innerHeight;
    if (scrollableDistance > 0) {
      const targetScrollY = window.scrollY + trackRect.top + progress * scrollableDistance;
      window.scrollTo({
        top: targetScrollY,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const depth = parseInt(e.target.value, 10);
    scrubToDepth(depth, false);
  };

  const toggleAutoPlay = () => {
    if (autoPlayRef.current) {
      autoPlayRef.current = false;
      setIsAutoPlaying(false);
      return;
    }
    autoPlayRef.current = true;
    setIsAutoPlaying(true);

    let depth = parseInt(containerRef.current?.dataset.cameraZ || "0", 10);
    const interval = setInterval(() => {
      if (!autoPlayRef.current) {
        clearInterval(interval);
        return;
      }
      depth += 35;
      if (depth > TOTAL_DEPTH) {
        depth = 0;
      }
      scrubToDepth(depth, false);
    }, 60);
  };

  // Motion-reduced static presentation
  if (isReducedMotion) {
    return (
      <section
        className={`relative w-full py-16 px-6 bg-burgundy-deep text-ivory border-y border-gold/20 ${className}`}
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
              alt="Palatial Corridor Static Overview"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/85 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-4 left-4 font-sans text-xs px-3 py-1.5 bg-burgundy-deep/90 text-gold border border-gold/30 rounded backdrop-blur-md">
              Motion Reduced Presentation · Palatial Perspective Sanctuary
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-3xl pt-4">
            {CORRIDOR_PORTALS.map((portal, idx) => (
              <div
                key={portal.id}
                className="p-3 rounded-lg border border-gold/20 bg-burgundy/60 text-left flex flex-col gap-1"
              >
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold">
                  Portal 0{idx + 1}
                </span>
                <span className="font-serif text-sm text-ivory">{portal.name}</span>
                <span className="text-[11px] font-sans text-ivory/70 line-clamp-1">{portal.tagline}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      ref={trackRef}
      style={{ height: trackHeight }}
      className={`relative w-full bg-[#150102] ${className}`}
      data-testid="3d-corridor-track"
    >
      {/* Pinned Viewport Container */}
      <div
        ref={containerRef}
        data-testid="3d-corridor-container"
        data-camera-z="0"
        data-scroll-progress="0.000"
        data-active-portal="portal-1"
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#150102] [perspective:1000px] select-none"
      >
        {/* Ambient Radial Vignette Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(74,7,10,0.4)_0%,_rgba(21,1,2,0.95)_100%)] pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#150102] via-transparent to-[#150102]/90 pointer-events-none z-10" />

        {/* 3D Palatial World Stage */}
        <div
          ref={worldRef}
          className="relative w-full h-full [transform-style:preserve-3d] flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out"
        >
          {/* Palatial Floor: Marble Reflection Grid */}
          <div
            className="absolute bottom-0 w-[2400px] h-[3600px] [transform:rotateX(90deg)_translateZ(-480px)_translateY(-1200px)] [transform-origin:50%_100%] opacity-40 bg-[radial-gradient(#c9a15a_1.5px,transparent_1.5px)] [background-size:48px_48px] border-t border-gold/30"
            style={{
              backgroundImage: "linear-gradient(to top, rgba(201,161,90,0.15) 1px, transparent 1px), linear-gradient(to right, rgba(201,161,90,0.15) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Palatial Ceiling: Ribbed Vaulting */}
          <div
            className="absolute top-0 w-[2400px] h-[3600px] [transform:rotateX(-90deg)_translateZ(-480px)_translateY(-1200px)] [transform-origin:50%_0%] opacity-25 bg-[radial-gradient(#dfc28c_1.5px,transparent_1.5px)] [background-size:60px_60px] border-b border-gold/30"
          />

          {/* Sequential 3D Portals & Colonnades along the Z-axis */}
          {CORRIDOR_PORTALS.map((portal, index) => {
            const isSanctum = index === CORRIDOR_PORTALS.length - 1;

            return (
              <div
                key={portal.id}
                style={{ transform: `translate3d(0, 0, ${portal.z}px)` }}
                className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]"
              >
                {/* Grand Archway Frame */}
                <div className="relative w-[min(92vw,980px)] h-[min(82vh,680px)] flex flex-col items-center justify-between border-x-2 border-gold/40 rounded-t-[280px] bg-gradient-to-b from-burgundy-deep/40 via-transparent to-transparent shadow-[0_0_80px_rgba(201,161,90,0.12)]">
                  {/* Decorative Arch Crest / Nizami Finial */}
                  <div className="w-full flex flex-col items-center -mt-6">
                    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" className="text-gold">
                      <path d="M60 2 L65 14 L78 16 L68 24 L71 36 L60 30 L49 36 L52 24 L42 16 L55 14 Z" fill="#c9a15a" opacity="0.9" />
                      <path d="M10 38 Q60 10 110 38" stroke="#dfc28c" strokeWidth="1.5" />
                    </svg>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-gold px-3 py-0.5 rounded-full bg-burgundy-deep/90 border border-gold/30 backdrop-blur-md">
                      Portal 0{index + 1} · {portal.name}
                    </span>
                  </div>

                  {/* Left & Right Carved Colonnade Pillars */}
                  <div className="absolute -left-12 sm:-left-20 top-16 bottom-0 w-8 sm:w-14 border border-gold/30 bg-gradient-to-r from-[#210304] via-[#4a070a] to-[#210304] rounded-sm flex flex-col justify-between py-6 shadow-2xl">
                    <div className="w-full h-8 border-b border-gold/40 flex items-center justify-center text-gold text-[9px]">♦</div>
                    <div className="w-full h-12 border-y border-gold/30 flex items-center justify-center text-gold text-xs opacity-75">❖</div>
                    <div className="w-full h-8 border-t border-gold/40 flex items-center justify-center text-gold text-[9px]">♦</div>
                  </div>

                  <div className="absolute -right-12 sm:-right-20 top-16 bottom-0 w-8 sm:w-14 border border-gold/30 bg-gradient-to-r from-[#210304] via-[#4a070a] to-[#210304] rounded-sm flex flex-col justify-between py-6 shadow-2xl">
                    <div className="w-full h-8 border-b border-gold/40 flex items-center justify-center text-gold text-[9px]">♦</div>
                    <div className="w-full h-12 border-y border-gold/30 flex items-center justify-center text-gold text-xs opacity-75">❖</div>
                    <div className="w-full h-8 border-t border-gold/40 flex items-center justify-center text-gold text-[9px]">♦</div>
                  </div>

                  {/* Suspended Diya Lanterns at Arch Shoulders */}
                  <div className="absolute top-28 left-4 w-6 h-12 flex flex-col items-center">
                    <span className="w-px h-8 bg-gold/50" />
                    <span className="w-4 h-5 rounded-b-full bg-gradient-to-b from-gold to-burgundy border border-gold shadow-[0_0_15px_rgba(201,161,90,0.8)] animate-pulse" />
                  </div>
                  <div className="absolute top-28 right-4 w-6 h-12 flex flex-col items-center">
                    <span className="w-px h-8 bg-gold/50" />
                    <span className="w-4 h-5 rounded-b-full bg-gradient-to-b from-gold to-burgundy border border-gold shadow-[0_0_15px_rgba(201,161,90,0.8)] animate-pulse" />
                  </div>

                  {/* Sanctum Culmination: Royal Mandap Artwork Backdrop */}
                  {isSanctum && (
                    <div className="relative z-0 w-full h-[380px] sm:h-[460px] rounded-2xl overflow-hidden border-2 border-gold/60 shadow-[0_0_120px_rgba(201,161,90,0.4)] bg-plum mt-8">
                      <Image
                        src={fallbackSrc}
                        alt="The Royal Vedic Mandap Sanctum"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1000px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/90 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-6 inset-x-0 flex flex-col items-center text-center px-6">
                        <span className="text-gold font-sans text-xs font-bold uppercase tracking-[0.2em] mb-1">
                          Sanctum Sanctorum
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl text-ivory">
                          The Royal Lotus Mandap
                        </h3>
                        <p className="font-sans text-xs text-ivory/80 max-w-sm mt-1">
                          25-foot carved Rajasthani marble pavilion draped in fragrant Mogra & Sevanti
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Editorial Eyebrow & Headline (Top Center) */}
        <div className="absolute top-8 left-6 right-6 z-20 flex flex-col items-center text-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy-deep/85 border border-gold/40 backdrop-blur-md shadow-lg mb-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              {tag}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl text-ivory tracking-wide drop-shadow-md">
            {title}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ivory/80 max-w-lg mt-1 hidden sm:block">
            {subtitle}
          </p>
        </div>

        {/* 3D Perspective HUD Flight Controller & Scrubber Dock */}
        <div
          data-testid="3d-corridor-hud"
          className="absolute bottom-16 sm:bottom-20 left-4 right-4 max-w-xl mx-auto z-30 p-3.5 sm:p-4 rounded-xl bg-burgundy-deep/90 border border-gold/30 backdrop-blur-md shadow-2xl flex flex-col gap-2.5 pointer-events-auto"
        >
          {/* Telemetry Header */}
          <div className="flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span ref={portalNameRef} className="text-gold font-bold uppercase tracking-wider text-[11px]">
                {CORRIDOR_PORTALS[0].name}
              </span>
            </div>
            <span
              ref={depthDisplayRef}
              className="font-mono text-[11px] text-gold-light bg-plum/70 px-2 py-0.5 rounded border border-gold/20"
            >
              0 mm / {TOTAL_DEPTH} mm (0%)
            </span>
          </div>

          <p
            ref={portalTaglineRef}
            className="text-[11px] font-sans text-ivory/70 line-clamp-1 italic"
          >
            {CORRIDOR_PORTALS[0].tagline}
          </p>

          {/* Interactive Depth Range Slider */}
          <div className="relative flex items-center w-full">
            <input
              ref={sliderRef}
              type="range"
              min="0"
              max={TOTAL_DEPTH}
              defaultValue="0"
              onChange={handleSliderChange}
              aria-label="3D Camera Z-Depth Scrubber"
              className="w-full h-1.5 bg-burgundy/80 rounded-lg appearance-none cursor-pointer accent-gold border border-gold/20 hover:border-gold/50 transition-colors focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Quick Jump Portals & Tour Button */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button
              type="button"
              onClick={toggleAutoPlay}
              aria-label={isAutoPlaying ? "Pause 3D Tour" : "Start Auto-Glide 3D Tour"}
              className="px-3 py-1 text-[11px] font-sans font-bold uppercase tracking-wider text-burgundy-deep bg-gold hover:bg-gold-light rounded transition-colors shadow-sm flex items-center gap-1"
            >
              <span>{isAutoPlaying ? "❚❚ Pause Glide" : "▶ Glide Camera"}</span>
            </button>

            <div className="flex items-center gap-1">
              {CORRIDOR_PORTALS.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrubToDepth(Math.abs(p.z))}
                  title={p.name}
                  className="px-2 py-0.5 text-[10px] font-sans text-gold/80 hover:text-gold hover:bg-gold/15 rounded border border-gold/15 transition-all"
                >
                  P0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Technical Bar */}
        <div className="absolute bottom-5 left-6 right-6 z-20 flex items-center justify-between pointer-events-none text-[11px] font-sans text-ivory/70">
          <span className="px-3 py-1 bg-burgundy-deep/90 border border-gold/20 rounded backdrop-blur-md">
            Matrix3D CSS Perspective: <code className="text-gold">1,000px FOV · Z: 0→2,750mm</code>
          </span>
          <span className="px-3 py-1 bg-burgundy-deep/90 border border-gold/20 rounded backdrop-blur-md hidden sm:inline-block">
            Scroll Track: 280vh · Mouse Tilt Parallax Active
          </span>
        </div>
      </div>
    </div>
  );
}
