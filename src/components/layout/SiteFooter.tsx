import { site } from "@/lib/site";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t border-gold/20 bg-burgundy-deep text-ivory/80">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-12 gap-12 font-sans">
        <div className="md:col-span-4 flex flex-col gap-4">
          <Link href="/" className="font-serif text-2xl text-gold-light">
            {site.name}
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">{site.tagline}</p>
        </div>
        
        <div className="md:col-span-3 flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">Explore</span>
          <nav className="flex flex-col gap-3 text-sm">
            <Link href="/" className="hover:text-gold transition-colors w-fit">Home</Link>
            <Link href="/events" className="hover:text-gold transition-colors w-fit">Events</Link>
            <Link href="/services" className="hover:text-gold transition-colors w-fit">Services</Link>
            <Link href="/work" className="hover:text-gold transition-colors w-fit">Work</Link>
          </nav>
        </div>

        <div className="md:col-span-5 flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">Contact Atelier</span>
          <div className="flex flex-col gap-3 text-sm">
            <a href={`tel:${site.phones[0].replace(/\s+/g, '')}`} className="hover:text-gold transition-colors w-fit">{site.phones[0]}</a>
            <a href={`mailto:${site.email}`} className="hover:text-gold transition-colors w-fit">{site.email}</a>
            <span>Based in {site.serviceArea}</span>
            <Link href="/contact" className="mt-4 inline-block font-sans text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-light transition-colors border-b border-gold/30 hover:border-gold pb-1 w-fit">
              Plan Your Event →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gold/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-ivory/50">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-ivory transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-ivory transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
