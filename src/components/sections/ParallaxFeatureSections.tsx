"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/feature-sections.module.css";
import { eventDisciplines } from "@/lib/site";

export default function ParallaxFeatureSections() {
  const [revealed, setRevealed] = useState<{ [key: string]: boolean }>({
    s1: false,
    s2: false,
    s3: false,
  });

  const s1Ref = useRef<HTMLElement>(null);
  const s2Ref = useRef<HTMLElement>(null);
  const s3Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // CSS prefers-reduced-motion already forces opacity: 1 and transform: none !important.
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) {
              setRevealed((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    const refs = [s1Ref.current, s2Ref.current, s3Ref.current];
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const weddings = eventDisciplines.find((d) => d.id === "wedding-packages") || eventDisciplines[0];
  const celebrations = eventDisciplines.find((d) => d.id === "birthday-parties") || eventDisciplines[1];
  const corporate = eventDisciplines.find((d) => d.id === "indoor-outdoor-events") || eventDisciplines[3];

  return (
    <div className="w-full flex flex-col">
      {/* ============================================================
          Feature Section 1: Wedding Experiences
          Reveal: Subtle horizontal entrance (translateX + opacity)
          Parallax: Vedic architectural mandala backplate
          ============================================================ */}
      <section
        ref={s1Ref}
        data-section-id="s1"
        id="events"
        className={`${styles.parallaxSection} scroll-mt-32 pt-28 sm:pt-32 pb-20 sm:pb-28 lg:pb-32 px-5 sm:px-8 lg:px-12 border-t border-gold/20`}
      >
        {/* Parallax Background Layer with Safety Bleed */}
        <div className={styles.parallaxBackplate} aria-hidden="true">
          {/* Deep royal burgundy base with luminous center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,_#380407_0%,_#1d0204_70%,_#150102_100%)]" />

          {/* Ornamental Vedic arch mandala motif */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <svg width="700" height="700" viewBox="0 0 700 700" fill="none" stroke="#c9a15a" strokeWidth="1" className="max-w-[700px] w-full">
              <circle cx="350" cy="350" r="320" strokeDasharray="4 6" />
              <circle cx="350" cy="350" r="260" strokeWidth="0.75" />
              <circle cx="350" cy="350" r="200" strokeDasharray="6 4" strokeWidth="1" />
              <polygon points="350,50 650,350 350,650 50,350" strokeWidth="0.8" />
              <polygon points="350,95 605,350 350,605 95,350" strokeDasharray="3 3" strokeWidth="0.6" />
            </svg>
          </div>

          {/* Soft edge fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep via-transparent to-burgundy-deep" />
        </div>

        {/* Foreground Content Card — Reveal: Horizontal Entrance */}
        <div
          className={`max-w-6xl mx-auto relative z-10 ${styles.revealHorizontal} ${
            revealed.s1 ? styles.isRevealed : ""
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Editorial Copy (Col 1-7) */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-gold/60" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Signature Discipline · 01
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight">
                Royal Weddings &<br />
                <span className="text-gold italic font-serif">Mandap Scenography</span>
              </h2>

              {/* Subtitle */}
              <p className="font-serif text-base sm:text-lg text-gold-light/90 italic">
                {weddings.subtitle}
              </p>

              {/* Body */}
              <p className="font-sans text-sm sm:text-base text-ivory/80 leading-relaxed max-w-xl">
                {weddings.description}
              </p>

              {/* Curated Inclusions */}
              <div className="pt-2">
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-ivory/60 block mb-3">
                  Signature Architectural Inclusions:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {weddings.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-xs font-sans text-ivory/90 bg-burgundy-deep/70 px-3.5 py-2.5 rounded border border-gold/15"
                    >
                      <span className="text-gold text-[10px]">♦</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Link
                  href="/contact?eventType=wedding"
                  className="px-7 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all rounded shadow-md text-center"
                >
                  Enquire for Royal Weddings
                </Link>
                <Link
                  href="/events#weddings"
                  className="px-6 py-3.5 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-widest text-xs hover:border-gold hover:bg-burgundy/60 transition-all rounded text-center flex items-center justify-center gap-2 group"
                >
                  <span>Explore Discipline</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            {/* Visual Media Card (Col 8-12) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className={`w-full relative aspect-[16/10] min-h-[260px] sm:min-h-[320px] rounded-xl overflow-hidden border border-gold/30 bg-burgundy-deep/40 backdrop-blur-md`}>
                <Image
                  src={weddings.image}
                  alt={weddings.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-sans px-3 py-1.5 bg-burgundy-deep/90 text-gold border border-gold/25 rounded backdrop-blur-md">
                  <span>Planning Scope</span>
                  <span className="font-semibold text-ivory">{weddings.tag}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          Feature Section 2: Celebrations & Milestones
          Reveal: Vertical fade-up (translateY + opacity)
          Parallax: Radial ember stipple backplate
          Layout: Alternating mirrored orientation
          ============================================================ */}
      <section
        ref={s2Ref}
        data-section-id="s2"
        id="celebrations"
        className={`${styles.parallaxSection} scroll-mt-32 pt-28 sm:pt-32 pb-20 sm:pb-28 lg:pb-32 px-5 sm:px-8 lg:px-12 border-t border-gold/15 bg-burgundy`}
      >
        {/* Parallax Background Layer with Safety Bleed */}
        <div className={styles.parallaxBackplate} aria-hidden="true">
          {/* Deep plum-burgundy base with warm ambient center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_45%_55%,_#42080c_0%,_#240406_65%,_#180103_100%)]" />


          {/* Concentric diamond geometry */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
            <svg width="650" height="650" viewBox="0 0 650 650" fill="none" stroke="#c9a15a" strokeWidth="1" className="max-w-[650px] w-full">
              <rect x="175" y="175" width="300" height="300" className="rotate-45 origin-center" strokeDasharray="6 4" />
              <rect x="225" y="225" width="200" height="200" className="rotate-45 origin-center" strokeWidth="0.75" />
              <circle cx="325" cy="325" r="160" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* Vignette fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep/80 via-transparent to-burgundy-deep" />
        </div>

        {/* Foreground Content Card — Reveal: Vertical Fade-Up */}
        <div
          className={`max-w-6xl mx-auto relative z-10 ${styles.revealVertical} ${
            revealed.s2 ? styles.isRevealed : ""
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Media Card (Col 1-5 on desktop - Mirrored Layout) */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col items-center">
              <div className={`w-full relative aspect-[16/10] min-h-[260px] sm:min-h-[320px] rounded-xl overflow-hidden border border-gold/30 bg-burgundy-deep/40 backdrop-blur-md`}>
                <Image
                  src={celebrations.image}
                  alt={celebrations.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-sans px-3 py-1.5 bg-burgundy-deep/90 text-gold border border-gold/25 rounded backdrop-blur-md">
                  <span>Curated Scope</span>
                  <span className="font-semibold text-ivory">{celebrations.tag}</span>
                </div>
              </div>
            </div>

            {/* Editorial Copy (Col 6-12 on desktop - Mirrored Layout) */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-5 text-left">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-gold/60" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Bespoke Soirées · 02
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight">
                Celebrations &<br />
                <span className="text-gold italic font-serif">Milestone Evenings</span>
              </h2>

              {/* Subtitle */}
              <p className="font-serif text-base sm:text-lg text-gold-light/90 italic">
                {celebrations.subtitle}
              </p>

              {/* Body */}
              <p className="font-sans text-sm sm:text-base text-ivory/80 leading-relaxed max-w-xl">
                {celebrations.description}
              </p>

              {/* Curated Inclusions */}
              <div className="pt-2">
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-ivory/60 block mb-3">
                  Signature Soirée Inclusions:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {celebrations.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-xs font-sans text-ivory/90 bg-burgundy-deep/70 px-3.5 py-2.5 rounded border border-gold/15"
                    >
                      <span className="text-gold text-[10px]">♦</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Link
                  href="/contact?eventType=birthday"
                  className="px-7 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all rounded shadow-md text-center"
                >
                  Enquire for Celebrations
                </Link>
                <Link
                  href="/events#birthdays"
                  className="px-6 py-3.5 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-widest text-xs hover:border-gold hover:bg-burgundy/60 transition-all rounded text-center flex items-center justify-center gap-2 group"
                >
                  <span>Explore Celebrations</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          Feature Section 3: Corporate Events
          Reveal: Gentle scale-and-opacity entrance (scale + opacity)
          Parallax: Architectural staging grid backplate
          Layout: Commanding architectural widescreen presentation
          ============================================================ */}
      <section
        ref={s3Ref}
        data-section-id="s3"
        id="corporate"
        className={`${styles.parallaxSection} scroll-mt-32 pt-28 sm:pt-32 pb-20 sm:pb-28 lg:pb-32 px-5 sm:px-8 lg:px-12 border-t border-gold/15 bg-burgundy-deep`}
      >
        {/* Parallax Background Layer with Safety Bleed */}
        <div className={styles.parallaxBackplate} aria-hidden="true">
          {/* Deep obsidian burgundy base */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_45%,_#330406_0%,_#1a0203_70%,_#120102_100%)]" />

          {/* Architectural linear grid backplate */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="corporateGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c9a15a" strokeWidth="0.75" strokeDasharray="2 4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#corporateGrid)" />
            </svg>
          </div>

          {/* Fade edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep via-transparent to-burgundy-deep" />
        </div>

        {/* Foreground Content Card — Reveal: Gentle Scale & Opacity */}
        <div
          className={`max-w-6xl mx-auto relative z-10 ${styles.revealScale} ${
            revealed.s3 ? styles.isRevealed : ""
          }`}
        >
          {/* Editorial Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-8 h-px bg-gold/60" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Enterprise Production · 03
              </span>
              <span className="w-8 h-px bg-gold/60" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight mb-4">
              Executive Corporate Galas &<br />
              <span className="text-gold italic font-serif">Leadership Summits</span>
            </h2>

            <p className="font-serif text-base sm:text-lg text-gold-light/90 italic mb-4">
              {corporate.subtitle}
            </p>

            <p className="font-sans text-sm sm:text-base text-ivory/80 leading-relaxed max-w-2xl mx-auto">
              {corporate.description}
            </p>
          </div>

          {/* Two-Column Technical Presentation: Visual + Technical Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-10">
            {/* Widescreen Media Visual (Col 1-7) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className={`w-full relative aspect-[16/9] min-h-[260px] sm:min-h-[320px] rounded-xl overflow-hidden border border-gold/30 bg-burgundy-deep/40 backdrop-blur-md`}>
                <Image
                  src={corporate.image}
                  alt={corporate.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-sans px-3 py-1.5 bg-burgundy-deep/90 text-gold border border-gold/25 rounded backdrop-blur-md">
                  <span>Production Scope</span>
                  <span className="font-semibold text-ivory">{corporate.tag}</span>
                </div>
              </div>
            </div>

            {/* Inclusions Bento List (Col 8-12) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 bg-burgundy-deep/80 border border-gold/25 rounded-xl shadow-xl backdrop-blur-sm">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold block mb-4">
                  Enterprise Production Standards:
                </span>
                <div className="space-y-3">
                  {corporate.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-burgundy/60 rounded border border-gold/15"
                    >
                      <span className="text-gold text-xs mt-0.5">✦</span>
                      <span className="text-xs font-sans text-ivory/90 leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-6 pt-4 border-t border-gold/20">
                <Link
                  href="/contact?eventType=corporate"
                  className="px-6 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all rounded shadow-md text-center flex-1"
                >
                  Enquire for Corporate Galas
                </Link>
                <Link
                  href="/events#corporate"
                  className="px-5 py-3.5 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-widest text-xs hover:border-gold hover:bg-burgundy/60 transition-all rounded text-center flex items-center justify-center gap-1.5 group"
                >
                  <span>Explore</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
