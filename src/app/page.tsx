import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import LogoLoader from "@/components/loader/LogoLoader";
import LogoMark from "@/components/brand/LogoMark";
import { site } from "@/lib/site";

/**
 * P1 — homepage hero. The §7 shatter-and-reassemble loader (LogoLoader) plays
 * over the page on first load, converging into the exact LogoMark shown here as
 * the hero centerpiece. Sections, navigation and CTAs arrive in later phases.
 */
export default function Home() {
  return (
    <>
      <LogoLoader />
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-burgundy px-6 py-20 text-center text-ivory">
        <h1 className="m-0">
          <LogoMark className="w-[min(86vw,620px)]" priority />
        </h1>
        <div className="space-y-4">
          <p className="font-serif text-xl uppercase tracking-[0.3em] text-gold sm:text-2xl">
            {site.tagline}
          </p>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-ivory/70">
            Premium event design and coordination in {site.serviceArea} —
            weddings, celebrations and corporate occasions, crafted end to end by
            one team.
          </p>
        </div>
        <span className="mt-2 text-xs uppercase tracking-[0.3em] text-gold/60">
          Scroll to explore
        </span>
      </main>
      <SiteFooter />
    </>
  );
}
