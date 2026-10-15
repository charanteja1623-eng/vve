import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ScrollCanvasSequence from "@/components/canvas/ScrollCanvasSequence";
import Link from "next/link";

export const metadata = {
  title: "Cinematic Canvas Prototype — Vintage Vibe Events",
  description: "Isolated scroll-linked canvas animation prototype simulating progressive royal mandap assembly.",
};

export default function CanvasPrototypePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-20">
        
        {/* Prototype Header Banner */}
        <section className="py-16 px-6 text-center border-b border-gold/20 bg-burgundy">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-gold px-3.5 py-1 rounded bg-burgundy-deep/80 border border-gold/30">
              Prompt 4 Prototype Laboratory
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-ivory leading-tight">
              Scroll-Controlled Cinematic Canvas
            </h1>
            <p className="font-sans text-sm sm:text-base text-ivory/80 max-w-2xl leading-relaxed">
              An isolated, hardware-accelerated HTML5 canvas sequence simulating the progressive architectural assembly of a palatial Vedic wedding mandap. Scrolling downward advances the sequence; scrolling upward reverses it.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-sans text-gold/90 bg-burgundy-deep/60 px-3 py-1.5 rounded border border-gold/20">
                Pinned Track: 260vh
              </span>
              <span className="text-xs font-sans text-gold/90 bg-burgundy-deep/60 px-3 py-1.5 rounded border border-gold/20">
                Asset Target: /sequences/mandap-assembly/
              </span>
            </div>
          </div>
        </section>

        {/* The Isolated Canvas Sequence Prototype */}
        <ScrollCanvasSequence
          frameCount={24}
          title="Sacred Mandap Assembly"
          subtitle="Watch the 25-foot floral lotus dome, carved Rajasthani pillars, and antique brass diya lanterns materialize as you scroll."
          tag="Cinematic Scenography Sequence"
        />

        {/* Post-Pinning Release Verification Section */}
        <section className="py-24 px-6 bg-burgundy border-t border-gold/20 text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
              Pin Release & Flow Continuity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
              Sequence Complete
            </h2>
            <p className="font-sans text-base text-ivory/80 leading-relaxed">
              The scroll track has naturally unpinned. Normal document flow, navigation links, and the mobile quick action bar remain completely unhindered and responsive.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link
                href="/contact?eventType=wedding"
                className="px-8 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all rounded shadow-md text-center"
              >
                Enquire for Royal Mandaps
              </Link>
              <Link
                href="/"
                className="px-8 py-3.5 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-widest text-xs hover:border-gold hover:bg-burgundy/60 transition-all rounded text-center"
              >
                Return to Production Home
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
