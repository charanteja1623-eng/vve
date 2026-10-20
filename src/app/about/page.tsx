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
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">OUR STORY</span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6">Every Celebration Has a Story</h1>
            <p className="font-sans text-lg text-ivory/80 max-w-2xl leading-relaxed">
              Event planning, decoration, and coordination for celebrations across Hyderabad, Andhra Pradesh, and Telangana.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 px-6 lg:px-12 bg-burgundy">
          <div className="max-w-4xl mx-auto space-y-6 font-sans text-lg text-ivory/85 leading-relaxed">
            <p>
              Every beautiful journey starts with a small idea and a big dream. Vintage Vibe Events began with one simple goal: to turn ordinary moments into special memories.
            </p>
            <p>
              With creativity, love, and care, we bring people together through beautiful celebrations. From small family gatherings to grand weddings and special events, we work hard to make every occasion memorable.
            </p>
            <p>
              For us, it&apos;s not just about decorations or planning an event. It&apos;s about the smiles, the happiness, and the moments families remember for years to come.
            </p>
            <p className="font-serif text-xl sm:text-2xl text-gold italic pt-4">
              We don&apos;t just plan events. We create memories that last a lifetime.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-burgundy-deep text-center border-t border-gold/20">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
            <h2 className="font-serif text-4xl text-ivory">Ready to Plan Your Event?</h2>
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
