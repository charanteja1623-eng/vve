import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `About Us — ${site.name}`,
  description: "Learn about the planning, coordination, and services behind Vintage Vibe Events in Hyderabad.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-24">
        {/* Hero */}
        <section className="py-20 px-6 text-center border-b border-gold/20 relative">
          <div className="absolute inset-0 bg-plum opacity-50 z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">Our Story</span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6">About the Atelier</h1>
            <p className="font-sans text-lg text-ivory/80 max-w-2xl leading-relaxed">
              Dedicated event planning, decor design, and production coordination for celebrations across Hyderabad & Secunderabad.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 px-6 lg:px-12 bg-burgundy">
          <div className="max-w-4xl mx-auto space-y-8 font-sans text-lg text-ivory/80 leading-relaxed">
            <p>
              Based in Hyderabad, <strong className="text-ivory font-semibold">{site.name}</strong> was founded with a singular conviction: thoughtful events arise from the harmony of balanced design, attentive coordination, and dependable execution.
            </p>
            <p>
              From traditional ceremonies to contemporary social gatherings, our event planning team coordinates environments where each moment unfolds naturally into an heirloom memory.
            </p>
            <p>
              Our team works closely with each client to understand their unique requirements, coordinating decoration, catering, sound, lighting, and vendor logistics under a single unified point of contact.
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
