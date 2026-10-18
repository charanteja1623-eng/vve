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
      <div className="max-w-7xl mx-auto">

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
                className="group relative rounded-2xl border border-gold/25 bg-burgundy/60 hover:bg-burgundy/80 hover:border-gold/50 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
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
                        <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-gold px-3.5 py-1 rounded-full bg-burgundy-deep/90 border border-gold/30">
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
                            <li key={fIdx} className="flex items-center gap-2 font-sans text-xs text-ivory/80">
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
                        className="px-6 py-2.5 bg-gold text-burgundy-deep font-sans text-xs font-bold uppercase tracking-widest rounded hover:bg-gold-light transition-all shadow-md text-center"
                      >
                        Explore Package →
                      </Link>
                      <Link
                        href={`/contact?eventType=${cat.slug}`}
                        className="px-5 py-2.5 border border-gold/40 text-ivory font-sans text-xs font-bold uppercase tracking-wider rounded hover:border-gold hover:bg-burgundy/60 transition-colors text-center"
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
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-gold/30 shadow-2xl bg-burgundy-deep">
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
                        <span className="font-sans text-[10px] uppercase tracking-wider text-gold-light px-2.5 py-1 rounded bg-burgundy-deep/80 backdrop-blur-sm border border-gold/20">
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
