import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PalatialCorridor3D from "@/components/canvas/PalatialCorridor3D";
import Link from "next/link";

export const metadata = {
  title: "Real-Time 3D Perspective Palatial Corridor — Vintage Vibe Events",
  description: "Option B 3D scroll animation engine simulating an imperial Nizami palatial corridor leading into the sacred mandap sanctum.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PalatialCorridorPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-20">
        
        {/* Prototype Header Banner */}
        <section className="py-16 px-6 text-center border-b border-gold/20 bg-burgundy">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-gold px-3.5 py-1 rounded bg-burgundy-deep/80 border border-gold/30">
              Option B · 3D Laboratory
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-ivory leading-tight">
              Real-Time 3D Perspective Palatial Corridor
            </h1>
            <p className="font-sans text-sm sm:text-base text-ivory/80 max-w-2xl leading-relaxed">
              An interactive CSS 3D perspective engine propelling the camera forward through authentic Nizami scalloped archways, carved Rajasthani sandstone colonnades, and suspended diya lanterns toward the illuminated royal mandap.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="text-xs font-sans text-gold/90 bg-burgundy-deep/60 px-3 py-1.5 rounded border border-gold/20">
                Pinned Track: 280vh
              </span>
              <span className="text-xs font-sans text-gold/90 bg-burgundy-deep/60 px-3 py-1.5 rounded border border-gold/20">
                FOV: 1,000px Perspective
              </span>
              <span className="text-xs font-sans text-gold/90 bg-burgundy-deep/60 px-3 py-1.5 rounded border border-gold/20">
                Interactive Z-Scrubber Active
              </span>
            </div>
          </div>
        </section>

        {/* The Real-Time 3D Corridor Experience */}
        <PalatialCorridor3D
          trackHeight="280vh"
          title="The Royal Nizami Colonnade"
          subtitle="Scroll or drag the 3D scrubber to traverse the 2,750mm palatial corridor to the sacred mandap"
          tag="Option B · 3D Matrix Camera"
        />

        {/* Post-Pinning Release Verification Section */}
        <section className="py-24 px-6 bg-burgundy border-t border-gold/20 text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
              Pin Release & Comparative Verification
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
              Corridor Traversal Complete
            </h2>
            <p className="font-sans text-base text-ivory/80 leading-relaxed">
              The 3D perspective camera has reached the Mandap Sanctum. Normal document flow unpins smoothly. Compare this real-time 3D perspective engine (Option B) with the high-resolution 3D spatial canvas sequence scrubber (Option A).
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
              <Link
                href="/prototype/canvas"
                className="px-8 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all rounded shadow-md text-center w-full sm:w-auto"
              >
                Inspect Option A (Canvas Scrubber) →
              </Link>
              <Link
                href="/"
                className="px-8 py-3.5 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-widest text-xs hover:border-gold hover:bg-burgundy/60 transition-all rounded text-center w-full sm:w-auto"
              >
                Return to Production Home
              </Link>
              <Link
                href="/contact?eventType=wedding-packages"
                className="px-8 py-3.5 border border-gold/40 text-gold font-sans font-bold uppercase tracking-widest text-xs hover:border-gold hover:bg-burgundy/60 transition-all rounded text-center w-full sm:w-auto"
              >
                Enquire for Wedding Mandaps
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
