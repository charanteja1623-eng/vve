import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `Our Work — ${site.name}`,
  description: "Explore our archive of past palatial curations and bespoke events.",
};

export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-24">
        {/* Hero */}
        <section className="py-20 px-6 text-center border-b border-gold/20 relative">
          <div className="absolute inset-0 bg-plum opacity-50 z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">The Archive</span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6">Our Work</h1>
            <p className="font-sans text-lg text-ivory/80 max-w-2xl leading-relaxed">
              Explore our portfolio of meticulously crafted celebrations, from royal weddings to intimate gatherings.
            </p>
          </div>
        </section>

        {/* Filter Placeholder */}
        <section className="py-8 px-6 bg-burgundy border-b border-gold/20 flex justify-center gap-6 font-sans text-sm font-bold uppercase tracking-widest">
          <button className="text-gold border-b border-gold pb-1">All</button>
          <button className="text-ivory/60 hover:text-ivory transition-colors pb-1">Weddings</button>
          <button className="text-ivory/60 hover:text-ivory transition-colors pb-1">Corporate</button>
          <button className="text-ivory/60 hover:text-ivory transition-colors pb-1">Intimate</button>
        </section>

        {/* Grid */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group border border-gold/20 bg-plum flex flex-col justify-end p-8 relative h-[400px] overflow-hidden rounded-xl">
                <div className="absolute inset-0 flex items-center justify-center z-0 bg-plum">
                  <span className="text-gold/30 font-sans text-xs uppercase tracking-widest text-center px-4">Portfolio Image<br/>Placeholder {item}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/40 to-transparent z-10" />
                <div className="relative z-20 text-left transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-3 block">Category</span>
                  <h3 className="font-serif text-2xl text-ivory">Development Placeholder</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-burgundy text-center border-t border-gold/20">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
            <h2 className="font-serif text-4xl text-ivory">Design Your Event</h2>
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
