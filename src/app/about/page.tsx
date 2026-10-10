import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `About Us — ${site.name}`,
  description: "Learn about the heritage and artistry behind Vintage Vibe Events.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-24">
        {/* Hero */}
        <section className="py-20 px-6 text-center border-b border-gold/20 relative">
          <div className="absolute inset-0 bg-plum opacity-50 z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">Our Story</span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6">About the Atelier</h1>
            <p className="font-sans text-lg text-ivory/80 max-w-2xl leading-relaxed">
              We bring decades of artisanal scenography and production expertise to Hyderabad&apos;s most discerning hosts.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 px-6 lg:px-12 bg-burgundy">
          <div className="max-w-4xl mx-auto space-y-8 font-sans text-lg text-ivory/80 leading-relaxed">
            <p>
              Born in Hyderabad, the city of Nizami splendor and timeless architectural majesty, <strong className="text-ivory font-semibold">Vintage Vibe Events</strong> was founded with a singular conviction: luxury is not simply excess—it is the harmony of heritage proportions, evocative floral choreography, and unblemished execution.
            </p>
            <p>
              From royal palace weddings to high-concept contemporary celebrations, our artisanal scenographers and production maestros sculpt environments where each moment unfolds naturally into an heirloom memory.
            </p>
            <p>
              Our team works closely with each client to understand their unique vision, translating it into a fully immersive environment. Whether designing an intimate gathering or a grand corporate gala, we apply the same rigorous standards of excellence and meticulous attention to detail.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-burgundy-deep text-center border-t border-gold/20">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
            <h2 className="font-serif text-4xl text-ivory">Begin the Journey</h2>
            <Link href="/contact" className="px-10 py-4 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all rounded shadow-lg">
              Contact Us
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
