import { site } from "@/lib/site";

/**
 * P0 layout shell — skeletal footer.
 * Full multi-column footer is built in a later phase; contact facts (§4a) wired now.
 */
export default function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t border-gold/20 bg-burgundy-deep text-ivory/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm">
        <span className="font-serif text-lg text-gold-light">{site.name}</span>
        <span>{site.tagline}</span>
        <span>Based in {site.serviceArea}</span>
        <span>
          {site.phones.join(" · ")} · {site.email}
        </span>
        <span className="text-ivory/50">
          © {new Date().getFullYear()} {site.name}
        </span>
      </div>
    </footer>
  );
}
