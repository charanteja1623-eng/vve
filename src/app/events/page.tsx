import Image from "next/image";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site, eventDisciplines, artisanalServices } from "@/lib/site";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import Link from "next/link";

export const metadata = {
  title: `Event Categories & Add-On Services — ${site.name}`,
  description:
    "Comprehensive wedding packages, birthday celebrations, surprise parties, indoor & outdoor events, campus functions, and event add-on services across Hyderabad & Secunderabad.",
};

export default function EventsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-24">
        
        {/* Hero */}
        <section className="relative py-24 px-6 text-center border-b border-gold/20 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#3a0507_0%,_#210304_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep via-burgundy-deep/90 to-burgundy-deep" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">
              Event Planning & Production Catalogue
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6 leading-tight">
              Event Categories & Services
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-2xl leading-relaxed mb-8">
              Explore our six confirmed event categories and eight coordinated add-on services. Every event is planned with dedicated staging, décor, and vendor coordination across Hyderabad and Secunderabad.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#categories"
                className="px-6 py-3 bg-gradient-to-r from-gold via-gold-light to-gold text-burgundy-deep font-sans font-bold uppercase tracking-wider text-xs hover:shadow-[0_0_20px_rgba(201,161,90,0.4)] transition-all rounded shadow-md"
              >
                View Event Categories ↓
              </a>
              <a
                href="#addons"
                className="px-6 py-3 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-wider text-xs hover:border-gold hover:bg-burgundy/60 hover:shadow-[0_0_16px_rgba(201,161,90,0.2)] transition-all bg-burgundy-deep/40 backdrop-blur-sm rounded"
              >
                View Add-On Services ↓
              </a>
            </div>
          </div>
        </section>

        {/* Group 1: 6 Confirmed Event Categories */}
        <section id="categories" className="py-24 px-6 lg:px-12 bg-burgundy border-b border-gold/20 scroll-mt-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-2">
                Confirmed Disciplines
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-ivory">
                Event Categories
              </h2>
            </div>

            <div className="space-y-20">
              {eventDisciplines.map((category, idx) => (
                <article
                  key={category.slug}
                  id={category.slug}
                  className="scroll-mt-28 flex flex-col lg:flex-row gap-10 lg:gap-14 items-center p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/[0.08] via-burgundy-deep/40 to-[#120102]/65 border border-gold/25 shadow-[0_16px_40px_rgba(0,0,0,0.55),_inset_0_1px_0_rgba(255,255,255,0.18),_inset_0_0_24px_rgba(201,161,90,0.04)] backdrop-blur-xl group hover:border-gold/45 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7),_inset_0_1px_0_rgba(255,255,255,0.28),_0_0_30px_rgba(201,161,90,0.18)] transition-all duration-500"
                >
                  {/* Category Imagery */}
                  <div
                    className={`w-full lg:w-1/2 relative h-72 sm:h-88 rounded-xl overflow-hidden border border-gold/30 bg-burgundy-deep/40 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.15)] group-hover:border-gold/50 group-hover:shadow-[0_16px_45px_rgba(0,0,0,0.7),_0_0_24px_rgba(201,161,90,0.2)] transition-all duration-500 ${
                      idx % 2 !== 0 ? "lg:order-last" : ""
                    }`}
                  >
                    <Image
                      src={category.image}
                      alt={category.imageAlt}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-4 left-4 font-sans text-xs font-semibold px-3 py-1.5 bg-burgundy-deep/60 text-gold border border-gold/30 rounded backdrop-blur-md shadow-sm">
                      {category.tag}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="w-full lg:w-1/2 flex flex-col gap-5 text-left">
                    <div>
                      <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-1.5">
                        {category.tag}
                      </span>
                      <h3 className="font-serif text-3xl md:text-4xl text-ivory mb-2 group-hover:text-gold-light transition-colors">
                        {category.title}
                      </h3>
                    </div>

                    <p className="font-sans text-base text-ivory/80 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2.5 pt-2">
                      <span className="font-sans text-xs font-bold uppercase tracking-wider text-ivory/60 block">
                        Planning & Staging Focus:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {category.features.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-center gap-2 text-xs font-sans text-ivory/90 bg-burgundy-deep/60 px-3 py-2 rounded-lg border border-gold/15 backdrop-blur-sm shadow-sm"
                          >
                            <span className="text-gold">✦</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/events/${category.slug}`}
                        className="px-6 py-3 bg-gradient-to-r from-gold via-gold-light to-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(201,161,90,0.4)] transition-all rounded shadow-md text-center"
                      >
                        Explore Package Details →
                      </Link>
                      <Link
                        href={`/contact?eventType=${category.slug}`}
                        className="px-5 py-3 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-widest text-xs hover:border-gold hover:bg-burgundy/60 hover:shadow-[0_0_16px_rgba(201,161,90,0.2)] transition-all bg-burgundy-deep/40 backdrop-blur-sm rounded text-center"
                      >
                        Enquire for this Event
                      </Link>
                      <WhatsAppLink
                        message={`Hello Vintage Vibe Events, I would like to enquire about ${category.title}.`}
                        className="px-5 py-3 border border-gold/30 text-gold font-sans font-semibold text-xs hover:bg-gold/15 hover:border-gold hover:shadow-[0_0_14px_rgba(201,161,90,0.2)] transition-all bg-burgundy-deep/40 backdrop-blur-sm rounded text-center"
                      >
                        WhatsApp Atelier →
                      </WhatsAppLink>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Group 2: 8 Confirmed Add-On Services (Option 2A Unified Showcase) */}
        <section id="addons" className="py-24 px-6 lg:px-12 bg-burgundy-deep border-b border-gold/20 scroll-mt-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-2">
                Coordinated Add-Ons
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-ivory mb-4">
                Event Add-On Services
              </h2>
              <p className="font-sans text-sm md:text-base text-ivory/75 max-w-2xl mx-auto leading-relaxed">
                Add-on services tailored to complement your primary event package under single-team coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {artisanalServices.map((addon) => (
                <article
                  key={addon.id}
                  id={addon.id}
                  className="scroll-mt-28 p-6 border border-gold/22 bg-gradient-to-br from-white/[0.06] via-burgundy-deep/40 to-[#150102]/60 backdrop-blur-xl hover:border-gold/45 hover:shadow-[0_16px_40px_rgba(0,0,0,0.65),_inset_0_1px_0_rgba(255,255,255,0.22),_0_0_20px_rgba(201,161,90,0.16)] shadow-[0_10px_30px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-300 flex flex-col justify-between rounded-xl relative overflow-hidden group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-xl text-gold/70">{addon.number}</span>
                      <span className="w-2 h-2 rounded-full bg-gold/40" />
                    </div>

                    <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden border border-gold/15">
                      <ImagePlaceholder
                        title={addon.title}
                        category="Add-On Service"
                        aspectRatio="16/9"
                        className="w-full h-full"
                        alt={`Placeholder block for ${addon.title} — authentic event photography pending`}
                      />
                    </div>

                    <h3 className="font-serif text-xl text-ivory mb-2">
                      {addon.title}
                    </h3>
                    <p className="font-sans text-xs text-ivory/75 line-clamp-3 leading-relaxed mb-4">
                      {addon.description}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      {addon.highlights.slice(0, 3).map((hl, hIdx) => (
                        <div key={hIdx} className="text-[11px] font-sans text-ivory/70 flex items-center gap-1.5">
                          <span className="text-gold text-[9px]">♦</span>
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t border-gold/15">
                    <Link
                      href={`/contact?addon=${addon.id}`}
                      className="px-4 py-2.5 bg-gradient-to-r from-gold via-gold-light to-gold text-burgundy-deep font-sans font-bold uppercase tracking-wider text-[11px] hover:shadow-[0_0_16px_rgba(201,161,90,0.35)] transition-all rounded text-center shadow"
                    >
                      Enquire for Add-On
                    </Link>
                    <WhatsAppLink
                      message={`Hello Vintage Vibe Events, I would like to enquire about ${addon.title} add-on service.`}
                      className="px-3 py-2 border border-gold/30 text-gold font-sans font-semibold text-[10px] uppercase tracking-wider hover:bg-gold/15 hover:border-gold transition-colors rounded text-center bg-burgundy-deep/40 backdrop-blur-sm"
                    >
                      WhatsApp →
                    </WhatsAppLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Global Consultation CTA */}
        <section className="py-24 px-6 bg-burgundy text-center border-t border-gold/20">
          <div className="max-w-3xl mx-auto rounded-2xl border border-gold/30 bg-gradient-to-br from-white/[0.08] via-burgundy-deep/45 to-[#120102]/65 p-8 sm:p-14 shadow-[0_16px_45px_rgba(0,0,0,0.65),_inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl relative overflow-hidden flex flex-col items-center gap-8">
            <h2 className="font-serif text-4xl md:text-5xl text-ivory leading-tight">
              Begin Event Coordination
            </h2>
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-xl leading-relaxed">
              Connect with our team to discuss your dates, selected categories, and required add-on services.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contact"
                className="px-12 py-5 bg-gradient-to-r from-gold via-gold-light to-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_25px_rgba(201,161,90,0.45)] transition-all rounded shadow-xl"
              >
                Schedule Consultation
              </Link>
              <WhatsAppLink
                message="Hello Vintage Vibe Events, I would like to plan an event."
                className="px-8 py-5 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold/15 hover:border-gold hover:shadow-[0_0_20px_rgba(201,161,90,0.25)] transition-all bg-burgundy-deep/40 backdrop-blur-sm rounded"
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
