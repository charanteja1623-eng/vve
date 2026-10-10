import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `Our Services — ${site.name}`,
  description: "Comprehensive event management and production services in Hyderabad.",
};

export default function ServicesPage() {
  const services = [
    "Catering", "Decoration", "Tent House", "DJ & Screens", 
    "Photography & Videography", "Customized Gifts", "Resin & 3D Moulds", "Corporate Gifting"
  ];

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-24">
        {/* Hero */}
        <section className="py-20 px-6 text-center border-b border-gold/20 relative">
          <div className="absolute inset-0 bg-plum opacity-50 z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">Our Offerings</span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6">Services</h1>
            <p className="font-sans text-lg text-ivory/80 max-w-2xl leading-relaxed">
              Integrate these exclusive artisanal services seamlessly into your core event production.
            </p>
          </div>
        </section>

        {/* Services List */}
        <section className="py-24 px-6 lg:px-12 bg-burgundy">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="p-8 border border-gold/20 bg-burgundy-deep/60 hover:border-gold hover:bg-burgundy-deep transition-all duration-300 text-center flex flex-col items-center justify-center gap-6 group rounded-xl shadow-lg">
                <div className="w-16 h-16 rounded-full border border-gold/30 bg-plum flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-burgundy-deep transition-colors font-serif text-2xl">
                  {idx + 1}
                </div>
                <h3 className="font-serif text-xl text-ivory group-hover:text-gold transition-colors">{service}</h3>
                <p className="font-sans text-sm text-ivory/60 italic">
                  [Service details placeholder for {service.toLowerCase()}.]
                </p>
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
