import Image from "next/image";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site, artisanalServices } from "@/lib/site";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import Link from "next/link";

export const metadata = {
  title: `Add-On Services & Production — ${site.name}`,
  description: "Coordinated catering, decoration, tent house, DJ, screens, and event gifting across Hyderabad, Andhra Pradesh, and Telangana.",
};

export default function ServicesPage() {
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
              Event Add-On Services
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6 leading-tight">
              Production & Add-On Services
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-2xl leading-relaxed mb-6">
              Our seven add-on services support your weddings, birthdays, and celebrations across Hyderabad and nearby areas.
            </p>
            <Link
              href="/events#addons"
              className="text-gold font-sans text-xs font-bold uppercase tracking-widest hover:text-gold-light border-b border-gold/30 hover:border-gold pb-1"
            >
              View All Events & Packages →
            </Link>
          </div>
        </section>

        {/* 7 Services Bento Grid */}
        <section className="py-24 px-6 lg:px-12 bg-burgundy">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {artisanalServices.map((service) => (
              <article
                key={service.id}
                id={service.id}
                className="scroll-mt-32 border border-gold/25 bg-gradient-to-br from-white/[0.08] via-burgundy-deep/40 to-[#120102]/65 rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.55),_inset_0_1px_0_rgba(255,255,255,0.18),_inset_0_0_24px_rgba(201,161,90,0.04)] backdrop-blur-xl flex flex-col justify-between group hover:border-gold/45 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7),_inset_0_1px_0_rgba(255,255,255,0.28),_0_0_30px_rgba(201,161,90,0.18)] transition-all duration-500"
              >
                {/* Visual Header */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-burgundy-deep border-b border-gold/20">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/30 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="font-serif text-xl font-bold px-3 py-1 bg-burgundy-deep/90 text-gold border border-gold/30 rounded backdrop-blur-md shadow-sm">
                      {service.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col flex-1 justify-between gap-6">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-ivory mb-2 group-hover:text-gold transition-colors">
                      {service.title}
                    </h2>
                    <p className="font-sans text-sm text-ivory/80 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-2 pt-2 border-t border-gold/15">
                      <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold block mb-3">
                        What Is Included:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-ivory/80">
                        {service.highlights.map((item, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2">
                            <span className="text-gold">✦</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-gold/15 flex items-center justify-between">
                    <Link
                      href={`/contact?addon=${service.id}`}
                      className="text-gold font-sans text-xs font-bold uppercase tracking-widest hover:text-gold-light transition-colors flex items-center gap-1.5"
                    >
                      <span>Add to Your Event</span>
                      <span>→</span>
                    </Link>
                    <WhatsAppLink
                      message={`Hello Vintage Vibe Events, I would like to enquire about ${service.title} add-on service.`}
                      className="text-xs font-sans text-ivory/70 hover:text-gold transition-colors"
                    >
                      Chat on WhatsApp →
                    </WhatsAppLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-24 px-6 bg-burgundy-deep text-center border-t border-gold/20">
          <div className="max-w-3xl mx-auto rounded-2xl border border-gold/30 bg-burgundy-deep/80 p-8 sm:p-14 shadow-[0_15px_50px_rgba(15,1,2,0.9),_inset_0_1px_0_rgba(227,201,133,0.18)] backdrop-blur-xl relative overflow-hidden flex flex-col items-center gap-8">
            <h2 className="font-serif text-4xl md:text-5xl text-ivory">
              Plan Your Event With Us
            </h2>
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-xl leading-relaxed">
              Combine catering, decoration, sound, and gifts into one simple plan with our team.
            </p>
            <Link
              href="/contact"
              className="px-12 py-5 bg-gradient-to-r from-gold via-gold-light to-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_25px_rgba(201,161,90,0.45)] transition-all rounded shadow-xl"
            >
              Contact Us
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
