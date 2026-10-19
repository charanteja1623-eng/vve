"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { eventDisciplines } from "@/lib/site";

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

export default function EditorialSplitStage() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || reduced) return;

    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const slug = eventDisciplines[index]?.slug;
      if (!slug) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => ({ ...prev, [slug]: true }));
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.15,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [reduced]);

  const handleCardClick = (slug: string, e: React.MouseEvent) => {
    // If the click is on an interactive link/button inside the card, let it handle its own navigation
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }
    router.push(`/events/${slug}`);
  };

  return (
    <section id="events" className="scroll-mt-24 py-24 px-5 sm:px-8 lg:px-12 bg-burgundy-deep border-t border-gold/15 relative overflow-hidden">
      {/* Underlying ambient lighting so translucent glass cards refract warm color (NO dots) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Soft deep burgundy atmospheric illumination pools */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[#52090e]/35 blur-[120px]" />
        <div className="absolute top-2/3 -right-48 w-96 h-96 rounded-full bg-[#52090e]/30 blur-[120px]" />
        {/* Subtle antique gold ambient luster fields behind the card tracks */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.04] blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.04] blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-gold block mb-4">
            Curated Atelier Disciplines
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory leading-tight mb-6">
            Event Categories & Architecture
          </h2>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="font-sans text-base md:text-lg text-ivory/80 leading-relaxed">
            From comprehensive sacred wedding packages to private milestone celebrations and campus productions across Hyderabad & Secunderabad.
          </p>
        </div>

        {/* =========================================================
            6 Confirmed Categories — Alternating Editorial Reveal
            Desktop: Left text slides in, Right image reveals with stagger.
            Mobile: Natural stacked cards, zero horizontal overflow.
           ========================================================= */}
        <div className="flex flex-col gap-16 lg:gap-24">
          {eventDisciplines.map((cat, idx) => {
            const numeral = String(idx + 1).padStart(2, "0");
            const isVisible = reduced || !!visibleCards[cat.slug];

            return (
              <article
                key={cat.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                id={`stage-${cat.slug}`}
                onClick={(e) => handleCardClick(cat.slug, e)}
                className="group relative rounded-2xl border border-gold/25 bg-gradient-to-br from-white/[0.08] via-burgundy-deep/40 to-[#120102]/65 hover:bg-gradient-to-br hover:from-white/[0.12] hover:via-burgundy-deep/50 hover:to-[#120102]/75 hover:border-gold/45 p-6 sm:p-10 lg:p-12 shadow-[0_16px_40px_rgba(0,0,0,0.55),_inset_0_1px_0_rgba(255,255,255,0.18),_inset_0_0_24px_rgba(201,161,90,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.7),_inset_0_1px_0_rgba(255,255,255,0.28),_0_0_30px_rgba(201,161,90,0.18)] backdrop-blur-xl transition-all duration-300 cursor-pointer"
                aria-label={`${cat.title} — Click to view package details`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

                  {/* Left Side: Event Information (Slides in from left on desktop) */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-between transition-all duration-700 ease-out ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-6 lg:-translate-x-10"
                    }`}
                  >
                    <div>
                      {/* Numeral and Tag */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="font-serif text-3xl text-gold font-light tracking-wider">
                          {numeral}
                        </span>
                        <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-gold px-3.5 py-1 rounded-full bg-burgundy-deep/60 backdrop-blur-md border border-gold/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),_0_0_12px_rgba(201,161,90,0.15)]">
                          {cat.tag}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-3xl sm:text-4xl text-ivory mb-4 leading-tight group-hover:text-gold-light transition-colors">
                        {cat.title}
                      </h3>

                      {/* Concise description */}
                      <p className="font-sans text-base text-ivory/85 leading-relaxed mb-6">
                        {cat.description}
                      </p>

                      {/* Verified Planning Highlights */}
                      <div className="mb-8 pt-4 border-t border-gold/20">
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold block mb-3">
                          Planning & Coordination Scope:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {cat.features.map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-2 font-sans text-xs text-ivory/85 bg-white/[0.03] backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-gold/10">
                              <span className="text-gold text-[10px]">✦</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gold/15">
                      <Link
                        href={`/events/${cat.slug}`}
                        className="px-6 py-2.5 bg-gold text-burgundy-deep font-sans text-xs font-bold uppercase tracking-widest rounded hover:bg-gold-light transition-all shadow-[0_0_18px_rgba(201,161,90,0.35)] hover:shadow-[0_0_28px_rgba(201,161,90,0.55)] border border-gold-light/50 text-center font-semibold"
                      >
                        Explore Package →
                      </Link>
                      <Link
                        href={`/contact?eventType=${cat.slug}`}
                        className="px-5 py-2.5 border border-gold/40 text-ivory font-sans text-xs font-bold uppercase tracking-wider rounded hover:border-gold hover:bg-gold/15 hover:shadow-[0_0_16px_rgba(201,161,90,0.25)] transition-all bg-burgundy-deep/40 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-center"
                      >
                        Enquire for This Event
                      </Link>
                    </div>
                  </div>

                  {/* Right Side: Event Imagery (Reveals from right with subtle pop & stagger) */}
                  <div
                    className={`lg:col-span-6 transition-all duration-750 ease-out delay-150 ${
                      isVisible
                        ? "opacity-100 translate-x-0 scale-100"
                        : "opacity-0 translate-x-6 lg:translate-x-10 scale-95"
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-gold/30 bg-burgundy-deep/40 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.15)] group-hover:border-gold/50 group-hover:shadow-[0_16px_45px_rgba(0,0,0,0.7),_0_0_24px_rgba(201,161,90,0.2)] transition-all duration-500">
                      {/* Real category imagery */}
                      <Image
                        src={cat.image}
                        alt={cat.imageAlt}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />

                      {/* Restrained dark vignette for depth and elegance */}
                      <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 via-transparent to-transparent pointer-events-none" />

                      {/* Subtle category badge overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="font-serif text-sm text-ivory font-light drop-shadow">
                          {cat.title}
                        </span>
                        <span className="font-sans text-[10px] uppercase tracking-wider text-gold-light px-2.5 py-1 rounded bg-burgundy-deep/60 backdrop-blur-md border border-gold/25 shadow-sm">
                          View Details ↗
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
