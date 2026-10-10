import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `Our Events — ${site.name}`,
  description: "Detailed breakdown of the event types organized by Vintage Vibe Events.",
};

export default function EventsPage() {
  const events = [
    { title: "Weddings", desc: "Bespoke mandaps, grand entry arches, and lavish production tailored to your vision." },
    { title: "Birthday Parties", desc: "Immersive thematic settings and personalized installations crafted for all ages." },
    { title: "Surprise Parties", desc: "Romantic setups, secret proposal installations, and anniversary celebrations." },
    { title: "Corporate Events", desc: "Executive unveilings, leadership summits, and awards galas engineered with precision." },
    { title: "School & College Events", desc: "Concert-grade outdoor stages, alumni galas, and safety-compliant setups." },
    { title: "Indoor & Outdoor Events", desc: "Adaptable scenography tailored for grand banquets, lush lawns, or intimate courtyards." }
  ];

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-24">
        {/* Hero */}
        <section className="py-20 px-6 text-center border-b border-gold/20 relative">
          <div className="absolute inset-0 bg-plum opacity-50 z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">Our Disciplines</span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6">Event Categories</h1>
            <p className="font-sans text-lg text-ivory/80 max-w-2xl leading-relaxed">
              We specialize in creating magnificent, bespoke environments for a wide range of celebrations.
            </p>
          </div>
        </section>

        {/* Event List */}
        <section className="py-24 px-6 lg:px-12 bg-burgundy">
          <div className="max-w-5xl mx-auto space-y-16">
            {events.map((event, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-12 items-center group">
                <div className={`w-full md:w-1/2 h-80 bg-plum border border-gold/20 relative overflow-hidden rounded-xl ${idx % 2 !== 0 ? 'md:order-last' : ''}`}>
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <span className="text-gold/30 font-sans text-xs uppercase tracking-widest z-10 px-4 text-center">Photography Placeholder</span>
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <h2 className="font-serif text-3xl text-gold">{event.title}</h2>
                  <p className="font-sans text-lg text-ivory/80 leading-relaxed">{event.desc}</p>
                  <p className="font-sans text-sm text-ivory/60 italic mt-4">
                    [Detailed service description placeholder for {event.title.toLowerCase()}.]
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-burgundy-deep text-center border-t border-gold/20">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
            <h2 className="font-serif text-4xl text-ivory">Plan Your Event</h2>
            <Link href="/contact" className="px-10 py-4 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all rounded shadow-lg">
              Book a Consultation
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
