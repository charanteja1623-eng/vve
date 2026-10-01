import Image from "next/image";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site } from "@/lib/site";

/**
 * P0 placeholder home — proves the token system, fonts, logo asset and layout
 * shell render. The real homepage (loader → hero → sections) arrives in later phases.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-burgundy px-6 py-24 text-center text-ivory">
        <Image
          src="/vintage-vibe-events-logo.png"
          alt={site.name}
          width={230}
          height={192}
          priority
          className="h-auto w-40 rounded-full"
        />
        <div className="space-y-3">
          <h1 className="font-serif text-4xl tracking-wide text-gold-light sm:text-5xl">
            {site.name}
          </h1>
          <p className="font-serif text-lg tracking-widest text-gold uppercase">
            {site.tagline}
          </p>
        </div>
        <p className="max-w-md text-sm text-ivory/60">
          Foundation scaffold (P0). Brand tokens, self-hosted fonts and the real
          logo asset are wired. Loader and hero follow in P1.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
