import { site } from "@/lib/site";

/**
 * P0 layout shell — skeletal header.
 * Full mobile nav (overlay menu + sticky bottom bar) is built in a later phase.
 */
export default function SiteHeader() {
  return (
    <header className="w-full border-b border-gold/20 bg-burgundy text-ivory">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <span className="font-serif text-xl tracking-wide text-gold-light">
          {site.name}
        </span>
        {/* nav placeholder — built in a later phase */}
        <nav aria-label="Primary" className="hidden sm:block text-sm text-ivory/70">
          <span className="opacity-60">Navigation — coming in a later phase</span>
        </nav>
      </div>
    </header>
  );
}
