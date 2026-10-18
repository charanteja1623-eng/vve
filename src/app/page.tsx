import Image from "next/image";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import LogoLoader from "@/components/loader/LogoLoader";
import LogoMark from "@/components/brand/LogoMark";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import ScrollExperienceController from "@/components/scroll/ScrollExperienceController";
import EditorialSplitStage from "@/components/sections/EditorialSplitStage";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import Link from "next/link";
import { artisanalServices, portfolioProjects, site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <LogoLoader />
      <ScrollExperienceController />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory">
        
        {/* 1. Hero Section with Scroll-Driven Dolly Zoom */}
        <section className="hero-viewport pt-20 pb-12 px-5 sm:px-6">
          {/* Background Layer — scales and moves with scroll progress */}
          <div className="hero-bg-layer" aria-hidden="true">
            {/* Architectural Palace Courtyard Background Image */}
            <Image
              src="/images/hero/palace-courtyard.jpg"
              alt="Palatial architectural courtyard with warm celebratory illumination"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />

            {/* Deep imperial burgundy tinted overlay for contrast & brand continuity */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(55,6,9,0.72)_0%,_rgba(33,3,4,0.88)_75%,_#150102_100%)]" />
            
            {/* Soft antique gold ember ambient luster behind cartouche */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_40%,_rgba(201,161,90,0.22)_0%,_transparent_75%)]" />

            {/* Textured stipple grid that provides continuous motion perception */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#c9a15a_1.5px,transparent_1.5px)] [background-size:28px_28px]" />
            
            {/* Architectural mandala & filigree pattern spanning the viewport */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none" stroke="#c9a15a" strokeWidth="1" className="max-w-[850px] max-h-[850px] w-full h-full">
                {/* Concentric Vedic arches & rings */}
                <circle cx="400" cy="400" r="380" strokeDasharray="4 6" strokeWidth="1" />
                <circle cx="400" cy="400" r="340" strokeWidth="0.75" />
                <circle cx="400" cy="400" r="290" strokeDasharray="8 4" strokeWidth="1.2" />
                <circle cx="400" cy="400" r="230" strokeWidth="0.75" />
                <circle cx="400" cy="400" r="160" strokeDasharray="3 3" />
                {/* Geometric radial axis & diamond facets */}
                <path d="M400 20 L400 780 M20 400 L780 400" strokeDasharray="6 6" strokeWidth="0.75" />
                <path d="M131 131 L669 669 M131 669 L669 131" strokeDasharray="4 8" strokeWidth="0.75" />
                <polygon points="400,60 740,400 400,740 60,400" strokeWidth="0.8" />
                <polygon points="400,110 690,400 400,690 110,400" strokeDasharray="4 4" strokeWidth="0.6" />
                {/* Corner ornamental cartouche accents */}
                <path d="M80 80 Q140 80 140 140 M80 80 Q80 140 140 140" strokeWidth="1.5" />
                <path d="M720 80 Q660 80 660 140 M720 80 Q720 140 660 140" strokeWidth="1.5" />
                <path d="M80 720 Q140 720 140 660 M80 720 Q80 660 140 660" strokeWidth="1.5" />
                <path d="M720 720 Q660 720 660 660 M720 720 Q720 660 660 660" strokeWidth="1.5" />
              </svg>
            </div>
            
            {/* Elegant vignette preserving edge focus and smooth fade to next section */}
            <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep/70 via-transparent to-burgundy-deep" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-burgundy-deep/30 to-burgundy-deep" />
          </div>
          
          {/* Foreground Content Layer — Stays sharp, readable and never scales */}
          <div className="hero-content-layer max-w-4xl mx-auto flex flex-col items-center text-center gap-5 sm:gap-6 mt-4 sm:mt-8">
            {/* Editorial Eyebrow */}
            <div className="flex items-center justify-center gap-3 opacity-90">
              <span className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-gold/60" />
              <p className="font-sans text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-gold-light">
                Bespoke Event Management · Hyderabad
              </p>
              <span className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-gold/60" />
            </div>

            {/* Canonical LogoMark */}
            <div className="hero-brand-lockup flex flex-col items-center text-center w-full">
              <h1 className="m-0">
                <LogoMark className="w-[min(80vw,460px)]" priority />
              </h1>
            </div>

            {/* Tagline */}
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-ivory tracking-wide max-w-2xl leading-tight font-normal">
              <span className="inline-block">Creating moments.</span>{" "}
              <span className="inline-block text-gold italic font-serif">Designing memories.</span>
            </p>

            {/* Subtle Royal Divider Pip */}
            <div className="flex items-center justify-center gap-2 my-0.5 opacity-80">
              <span className="w-5 h-px bg-gold/40" />
              <span className="text-gold text-[9px]">♦</span>
              <span className="w-5 h-px bg-gold/40" />
            </div>

            {/* Value Proposition */}
            <p className="font-serif text-sm sm:text-base md:text-lg text-ivory/90 italic max-w-lg leading-relaxed px-2">
              Palatial event scenography, royal culinary spreads, and turnkey celebration productions.
            </p>

            {/* Call to Actions with Safe Mobile Clearance */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-4 sm:mt-6 w-full max-w-md px-4 sm:px-0">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-[0.18em] text-xs hover:bg-gold-light transition-all shadow-[0_4px_25px_rgba(201,161,90,0.35)] hover:shadow-[0_4px_35px_rgba(201,161,90,0.6)] hover:-translate-y-0.5 transform rounded text-center"
              >
                Book a Consultation
              </Link>
              <Link
                href="#events"
                className="w-full sm:w-auto px-8 py-3.5 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-[0.18em] text-xs hover:border-gold hover:bg-burgundy/60 transition-all bg-burgundy-deep/60 backdrop-blur-md rounded text-center"
              >
                Explore Disciplines
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Brand Story / The Atelier Creed */}
        <section id="about" className="section-entry-reveal scroll-mt-24 py-24 px-6 lg:px-12 bg-burgundy border-t border-gold/15">
          <div className="max-w-6xl mx-auto border border-gold/25 bg-burgundy-deep/85 p-8 md:p-16 lg:p-24 relative rounded-xl shadow-2xl backdrop-blur-sm">
            <div className="flex justify-center mb-12">
               <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/50" />
               <div className="w-2.5 h-2.5 rounded-full bg-gold mx-4" />
               <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/50" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-5 text-center lg:text-left">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-4">The Atelier Creed</span>
                <h2 className="font-serif text-4xl md:text-5xl text-ivory leading-tight">
                  The Architecture<br className="hidden lg:block"/>of Royal Emotion
                </h2>
              </div>
              <div className="lg:col-span-7 font-sans text-base md:text-lg text-ivory/80 leading-relaxed space-y-6 lg:border-l border-gold/20 lg:pl-16 text-center lg:text-left">
                <p>
                  Born in Hyderabad, the city of Nizami splendor and timeless architectural majesty, <strong className="text-ivory font-semibold">{site.name}</strong> was founded with a singular conviction: luxury is not simply excess—it is the harmony of heritage proportions, evocative floral choreography, and unblemished execution.
                </p>
                <p>
                  From sacred Vedic mandaps to high-concept contemporary celebrations, our artisanal scenographers and production maestros sculpt environments where each moment unfolds naturally into an heirloom memory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Editorial Split-Stage: 6 Curated Disciplines */}
        <EditorialSplitStage />

        {/* Curated Disciplines Exploration Bridge */}
        <div className="py-10 px-6 bg-burgundy-deep/90 border-t border-b border-gold/15 text-center">
          <p className="font-serif text-base sm:text-lg text-ivory/85 mb-3">
            Seeking intimate proposals, campus concerts, or palatial lawn banquets?
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-gold font-sans text-xs font-bold uppercase tracking-widest hover:text-gold-light transition-colors border-b border-gold/30 hover:border-gold pb-1"
          >
            <span>Explore All 6 Curated Disciplines</span>
            <span>→</span>
          </Link>
        </div>

        {/* 5. Artisanal Services Showcase */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-burgundy border-y border-gold/20" id="services">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-4">Artisanal Guild</span>
                <h2 className="font-serif text-3xl md:text-5xl text-ivory">Comprehensive Event Services</h2>
              </div>
              <p className="font-sans text-sm md:text-base text-ivory/75 max-w-md md:text-right leading-relaxed">
                Seamlessly integrated artisanal services executed under one unified master production team.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {artisanalServices.map((service) => (
                <div
                  key={service.id}
                  className="p-6 border border-gold/20 bg-burgundy-deep/75 hover:border-gold hover:bg-burgundy-deep transition-all duration-300 flex flex-col justify-between group rounded-xl shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-2xl text-gold/60 group-hover:text-gold transition-colors">{service.number}</span>
                    <span className="w-2 h-2 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-ivory group-hover:text-gold transition-colors mb-2">{service.title}</h3>
                    <p className="font-sans text-xs text-ivory/70 line-clamp-3 leading-relaxed mb-6">{service.description}</p>
                  </div>
                  <Link
                    href="/events#addons"
                    className="font-sans text-[11px] font-bold uppercase tracking-wider text-gold/80 group-hover:text-gold-light flex items-center gap-1.5 pt-4 border-t border-gold/15"
                  >
                    <span>View Add-On Details</span>
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Portfolio Preview (Neutral Placeholders & Responsive Flow) */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-burgundy-deep" id="work">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-4">Curated Archive</span>
                <h2 className="font-serif text-4xl md:text-5xl text-ivory">Recent Palatial Work</h2>
              </div>
              <Link
                href="/work"
                className="text-gold font-sans text-xs font-bold uppercase tracking-widest hover:text-gold-light transition-colors border-b border-gold/30 hover:border-gold pb-1 w-fit"
              >
                Browse Full Portfolio Archive →
              </Link>
            </div>
            
            <div className="mobile-swipe-rail md:grid md:grid-cols-12 md:gap-6 w-full">
              {portfolioProjects.slice(0, 4).map((project, idx) => {
                const spanClass = idx === 0 ? "md:col-span-8 min-h-[420px]" : idx === 1 ? "md:col-span-4 min-h-[420px]" : idx === 2 ? "md:col-span-5 min-h-[360px]" : "md:col-span-7 min-h-[360px]";
                return (
                  <div
                    key={project.id}
                    className={`mobile-swipe-item ${spanClass} relative border border-gold/25 bg-plum flex flex-col justify-end p-8 group overflow-hidden rounded-xl shadow-xl`}
                  >
                    <ImagePlaceholder
                      title={project.title}
                      category={project.categoryLabel}
                      aspectRatio="16/9"
                      className="absolute inset-0 w-full h-full"
                      alt={`Neutral placeholder block for ${project.title}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/95 via-burgundy-deep/60 to-transparent z-10" />
                    <div className="relative z-20 text-left transition-transform duration-500 group-hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold">{project.categoryLabel}</span>
                        <span className="text-gold/40 text-xs">•</span>
                        <span className="font-sans text-xs text-gold/80">{project.statusLabel}</span>
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl text-ivory mb-2">{project.title}</h3>
                      <p className="font-sans text-xs text-ivory/75 max-w-lg line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Consultation CTA */}
        <section className="py-32 lg:py-40 px-6 bg-burgundy text-center relative overflow-hidden border-t border-gold/20">
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 to-transparent pointer-events-none" />
          <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold">Begin The Journey</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory leading-tight">
              Plan Your Extraordinary Event
            </h2>
            <p className="font-sans text-base md:text-lg text-ivory/80 leading-relaxed max-w-2xl">
              Whether curating a royal wedding or an exclusive private soirée in Hyderabad, our atelier directors are at your service.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-5 mt-4 w-full sm:w-auto">
              <Link
                href="/contact"
                className="px-12 py-5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-[0_4px_25px_rgba(201,161,90,0.35)] hover:-translate-y-0.5 rounded w-full sm:w-auto text-center"
              >
                Schedule Consultation
              </Link>
              <WhatsAppLink
                message="Hello Vintage Vibe Events, I would like to schedule an event consultation."
                className="px-10 py-5 border border-gold/50 text-ivory font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold/15 transition-all rounded w-full sm:w-auto text-center"
              >
                WhatsApp Direct →
              </WhatsAppLink>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
