import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site, eventDisciplines } from "@/lib/site";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Link from "next/link";

export const metadata = {
  title: `Curated Event Disciplines — ${site.name}`,
  description: "Bespoke royal weddings, thematic milestone birthdays, corporate summits, and open lawn productions in Hyderabad.",
};

export default function EventsPage() {
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
              Curated Event Architecture
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6 leading-tight">
              Event Disciplines
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-2xl leading-relaxed">
              Every celebration is treated as an architectural commission. From sacred Vedic mandaps to high-octane corporate galas across Hyderabad.
            </p>
          </div>
        </section>

        {/* Disciplines Detailed Showcase */}
        <section className="py-24 px-6 lg:px-12 bg-burgundy">
          <div className="max-w-6xl mx-auto space-y-24">
            {eventDisciplines.map((event, idx) => (
              <article
                key={event.id}
                id={event.id}
                className="scroll-mt-32 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center p-8 md:p-12 rounded-2xl bg-burgundy-deep/80 border border-gold/25 shadow-2xl backdrop-blur-sm"
              >
                {/* Visual */}
                <div className={`w-full lg:w-1/2 relative h-80 sm:h-96 rounded-xl overflow-hidden shadow-lg border border-gold/20 ${idx % 2 !== 0 ? 'lg:order-last' : ''}`}>
                  <ImagePlaceholder
                    title={event.title}
                    category={event.tag}
                    aspectRatio="16/10"
                    className="w-full h-full"
                    alt={`Neutral placeholder block for ${event.title}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 font-sans text-xs font-semibold px-3 py-1.5 bg-burgundy-deep/90 text-gold border border-gold/30 rounded backdrop-blur-md">
                    Capacity: {event.capacity}
                  </span>
                </div>

                {/* Details */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-2">
                      {event.tag}
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl text-ivory mb-2">{event.title}</h2>
                    <p className="font-sans text-sm text-gold-light/90 italic">{event.subtitle}</p>
                  </div>

                  <p className="font-sans text-base text-ivory/80 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Feature Pills */}
                  <div className="space-y-3 pt-2">
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-ivory/60 block">
                      Signature Inclusions:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {event.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs font-sans text-ivory/90 bg-burgundy/60 px-3 py-2 rounded border border-gold/15">
                          <span className="text-gold">✦</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 flex items-center gap-4">
                    <Link
                      href={`/contact?eventType=${event.id}`}
                      className="px-8 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all rounded shadow-md text-center"
                    >
                      Enquire for this Event
                    </Link>
                    <a
                      href={`https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello Vintage Vibe Events, I would like to enquire about ${event.title}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 border border-gold/40 text-ivory font-sans font-semibold text-xs hover:bg-gold/10 transition-colors rounded text-center"
                    >
                      WhatsApp Atelier
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Global Consultation CTA */}
        <section className="py-24 px-6 bg-burgundy-deep text-center border-t border-gold/20">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
            <h2 className="font-serif text-4xl md:text-5xl text-ivory leading-tight">
              Begin Architectural Scenography
            </h2>
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-xl leading-relaxed">
              Connect with our master production team to schedule an in-person design consultation.
            </p>
            <Link
              href="/contact"
              className="px-12 py-5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all rounded shadow-xl"
            >
              Book a Consultation
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
