import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site, artisanalServices } from "@/lib/site";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Link from "next/link";

export const metadata = {
  title: `Artisanal Services & Production — ${site.name}`,
  description: "Royal live catering, couture floral decoration, German tent hangars, concert sound, and heirloom bridal keepsakes in Hyderabad.",
};

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-24">
        
        {/* Hero */}
        <section className="relative py-24 px-6 text-center border-b border-gold/20 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#3a0507_0%,_#210304_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(#c9a15a_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep via-burgundy-deep/90 to-burgundy-deep" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">
              Integrated Artisanal Guild
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6 leading-tight">
              Production Services
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-2xl leading-relaxed">
              Every discipline is executed in-house or with certified luxury partners to ensure flawless aesthetic cohesion and hospitality standards.
            </p>
          </div>
        </section>

        {/* 8 Services Bento Grid */}
        <section className="py-24 px-6 lg:px-12 bg-burgundy">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {artisanalServices.map((service) => (
              <article
                key={service.id}
                id={service.id}
                className="scroll-mt-32 border border-gold/25 bg-burgundy-deep/85 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-gold/60 transition-all duration-500"
              >
                {/* Visual Header */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-plum border-b border-gold/20">
                  <ImagePlaceholder
                    title={service.title}
                    category={service.number}
                    aspectRatio="16/10"
                    className="w-full h-full"
                    alt={`Neutral placeholder block for ${service.title}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/30 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="font-serif text-xl font-bold px-3 py-1 bg-burgundy-deep/90 text-gold border border-gold/30 rounded backdrop-blur-md">
                      {service.number}
                    </span>
                    <span className="font-sans text-xs uppercase tracking-widest px-3 py-1.5 bg-burgundy-deep/80 text-ivory/90 border border-gold/20 rounded backdrop-blur-md">
                      {service.tagline}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col flex-1 justify-between gap-6">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-ivory mb-2 group-hover:text-gold transition-colors">
                      {service.title}
                    </h2>
                    <p className="font-sans text-xs font-semibold text-gold-light/90 mb-4">{service.subtitle}</p>
                    <p className="font-sans text-sm text-ivory/80 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-2 pt-2 border-t border-gold/15">
                      <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold block mb-3">
                        Key Deliverables:
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
                      href="/contact"
                      className="text-gold font-sans text-xs font-bold uppercase tracking-widest hover:text-gold-light transition-colors flex items-center gap-1.5"
                    >
                      <span>Incorporate in Package</span>
                      <span>→</span>
                    </Link>
                    <a
                      href={`https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello Vintage Vibe Events, I would like to enquire about ${service.title}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-sans text-ivory/70 hover:text-gold transition-colors"
                    >
                      Ask on WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-24 px-6 bg-burgundy-deep text-center border-t border-gold/20">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
            <h2 className="font-serif text-4xl md:text-5xl text-ivory">
              Commission Your Custom Production
            </h2>
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-xl leading-relaxed">
              Combine catering, decor, and technical production into one seamless turnkey agreement.
            </p>
            <Link
              href="/contact"
              className="px-12 py-5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all rounded shadow-xl"
            >
              Consult with Our Team
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
