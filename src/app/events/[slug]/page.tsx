import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import {
  site,
  eventDisciplines,
  artisanalServices,
} from "@/lib/site";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return eventDisciplines.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = eventDisciplines.find((cat) => cat.slug === slug);
  if (!category) return {};

  return {
    title: `${category.title} — ${site.name}`,
    description: `${category.description} Bespoke planning, staging, and vendor coordination across ${site.serviceArea}.`,
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const category = eventDisciplines.find((cat) => cat.slug === slug);

  if (!category) {
    notFound();
  }

  // Filter recommended add-ons tailored to this category
  const relevantAddons = artisanalServices.filter((addon) =>
    category.recommendedAddons.includes(addon.id)
  );

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-24">

        {/* Breadcrumb Navigation & Back Link */}
        <div className="max-w-7xl mx-auto w-full px-6 pt-6 pb-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-xs text-ivory/60">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/events" className="hover:text-gold transition-colors">
              Events
            </Link>
            <span>/</span>
            <span className="text-gold font-medium" aria-current="page">
              {category.title}
            </span>
          </nav>
        </div>

        {/* 1. Category Hero Banner */}
        <section className="relative py-16 sm:py-24 px-6 overflow-hidden border-b border-gold/20">
          {/* Background Ambient Backdrop */}
          <div className="absolute inset-0 z-0">
            <Image
              src={category.image}
              alt={category.imageAlt}
              fill
              priority
              className="object-cover object-center scale-105 opacity-25 filter blur-sm"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep via-burgundy-deep/90 to-burgundy-deep" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#150102_100%)]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-gold mb-3 px-3.5 py-1 rounded-full bg-burgundy/80 border border-gold/30">
              {category.tag}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ivory mb-6 leading-tight">
              {category.title}
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-sans text-base sm:text-lg text-ivory/85 max-w-3xl leading-relaxed mb-8">
              {category.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/contact?eventType=${category.slug}`}
                className="px-8 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs rounded hover:bg-gold-light transition-all shadow-lg"
              >
                Enquire for {category.title} →
              </Link>
              <Link
                href="/events"
                className="px-6 py-3.5 border border-gold/40 text-ivory font-sans text-xs font-bold uppercase tracking-wider rounded hover:border-gold hover:bg-burgundy/60 transition-colors"
              >
                ← Back to Unified Catalogue
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Visual Scenography & Overview Section */}
        <section className="py-20 px-6 lg:px-12 bg-burgundy border-b border-gold/20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Primary Category Photograph */}
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/30 shadow-2xl bg-burgundy-deep">
              <Image
                src={category.image}
                alt={category.imageAlt}
                fill
                priority
                className="object-cover object-center"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-sans text-[11px] text-ivory/90 bg-burgundy-deep/80 px-3 py-1.5 rounded backdrop-blur-sm border border-gold/25 block text-center">
                  Representative Scenography for {category.title}
                </span>
              </div>
            </div>

            {/* Overview & Production Highlights */}
            <div className="lg:col-span-6 flex flex-col gap-6 text-left">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-2">
                  Atelier Planning Approach
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-ivory leading-snug">
                  Curated Scenography & Coordination
                </h2>
              </div>

              <p className="font-sans text-base text-ivory/85 leading-relaxed">
                {category.overview}
              </p>

              {/* Inclusions / Highlights */}
              <div className="pt-4 border-t border-gold/20">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold block mb-3">
                  Verified Planning Inclusions:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-start gap-2.5 font-sans text-xs text-ivory/85 bg-burgundy-deep/60 p-3 rounded border border-gold/15"
                    >
                      <span className="text-gold text-xs">✦</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Planning & Logistical Considerations */}
        <section className="py-20 px-6 lg:px-12 bg-burgundy-deep border-b border-gold/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-2">
                Execution Discipline
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
                Planning & Logistical Protocols
              </h2>
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.planningConsiderations.map((consideration, cIdx) => (
                <div
                  key={cIdx}
                  className="rounded-xl border border-gold/20 bg-burgundy/40 p-6 backdrop-blur-sm flex items-start gap-4"
                >
                  <span className="font-serif text-2xl text-gold font-light leading-none">
                    {String(cIdx + 1).padStart(2, "0")}
                  </span>
                  <p className="font-sans text-sm text-ivory/85 leading-relaxed">
                    {consideration}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-xl border border-gold/15 bg-burgundy/30 text-center max-w-3xl mx-auto">
              <p className="font-sans text-xs text-ivory/70 italic">
                * Note: Venue capacity, stage dimensions, and detailed schedules are structured specifically to your selected venue and guest count upon consultation.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Relevant Add-On Services */}
        {relevantAddons.length > 0 && (
          <section className="py-20 px-6 lg:px-12 bg-burgundy border-b border-gold/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-2">
                  Tailored Add-On Integrations
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
                  Recommended Services for this Package
                </h2>
                <p className="font-sans text-sm text-ivory/75 mt-3">
                  Complement your event with our verified add-on capabilities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relevantAddons.map((addon) => (
                  <div
                    key={addon.id}
                    className="rounded-xl border border-gold/25 bg-burgundy-deep/80 p-6 flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-serif text-xl text-gold font-light">{addon.number}</span>
                        <span className="font-sans text-[10px] uppercase tracking-wider text-gold-light px-2 py-0.5 rounded bg-burgundy border border-gold/20">
                          Add-On
                        </span>
                      </div>
                      <h3 className="font-serif text-xl text-ivory mb-2">
                        {addon.title}
                      </h3>
                      <p className="font-sans text-xs text-ivory/75 leading-relaxed mb-4">
                        {addon.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gold/15 flex items-center justify-between">
                      <Link
                        href={`/events#${addon.id}`}
                        className="font-sans text-xs text-gold hover:text-gold-light transition-colors"
                      >
                        Service Details →
                      </Link>
                      <Link
                        href={`/contact?eventType=${category.slug}&addon=${addon.id}`}
                        className="px-3 py-1.5 bg-gold/20 hover:bg-gold text-gold hover:text-burgundy-deep border border-gold/30 rounded font-sans text-[11px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Enquire Both
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Direct Consultation CTA Bridge */}
        <section className="py-20 px-6 text-center bg-burgundy-deep">
          <div className="max-w-3xl mx-auto rounded-2xl border border-gold/30 bg-burgundy/60 p-8 sm:p-14 shadow-2xl backdrop-blur-md">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-gold block mb-3">
              Begin Your Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory mb-4">
              Plan Your {category.title}
            </h2>
            <p className="font-sans text-base text-ivory/80 leading-relaxed mb-8">
              Discuss dates, guest requirements, and bespoke design possibilities with our planning team across Hyderabad and Secunderabad.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/contact?eventType=${category.slug}`}
                className="w-full sm:w-auto px-8 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs rounded hover:bg-gold-light transition-all shadow-lg text-center"
              >
                Schedule Consultation →
              </Link>
              <WhatsAppLink
                message={`Hello Vintage Vibe Events, I would like to plan a ${category.title}.`}
                className="w-full sm:w-auto px-6 py-3.5 border border-gold/40 text-gold font-sans font-semibold text-xs rounded hover:bg-gold/15 transition-colors text-center"
              >
                WhatsApp Atelier
              </WhatsAppLink>
              <Link
                href="/events"
                className="w-full sm:w-auto px-6 py-3.5 border border-gold/20 text-ivory/80 font-sans text-xs uppercase tracking-wider rounded hover:border-gold/50 transition-colors text-center"
              >
                All Event Packages
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
