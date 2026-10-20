"use client";

import Image from "next/image";
import { Suspense, useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { portfolioProjects, type PortfolioProject, type ConfirmedCategorySlug } from "@/lib/site";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import Link from "next/link";

type FilterCategory = "all" | ConfirmedCategorySlug;

const CATEGORY_TABS: { id: FilterCategory; label: string }[] = [
  { id: "all", label: "All Events" },
  { id: "wedding-packages", label: "Wedding Packages" },
  { id: "birthday-parties", label: "Birthday Parties" },
  { id: "surprise-parties", label: "Surprise Parties" },
  { id: "indoor-outdoor-events", label: "Indoor & Outdoor Events" },
  { id: "school-college-events", label: "School & College Events" },
  { id: "new-year-parties", label: "New Year Parties" },
];

const emptySubscribe = () => () => {};

function useIsHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function WorkGallery() {
  const isHydrated = useIsHydrated();
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get("category");

  // Keep fallbackCategory as 'all' during SSR and initial hydration to match server HTML.
  // Seamlessly transition to the requested category once hydrated.
  const fallbackCategory: FilterCategory =
    isHydrated && queryCategory && CATEGORY_TABS.some((tab) => tab.id === queryCategory)
      ? (queryCategory as FilterCategory)
      : "all";

  const [userCategory, setUserCategory] = useState<FilterCategory | null>(null);
  const activeCategory = userCategory ?? fallbackCategory;

  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleOpenProject = useCallback((project: PortfolioProject) => {
    lastFocusedElementRef.current = document.activeElement as HTMLElement | null;
    setSelectedProject(project);
    document.body.style.overflow = "hidden";
  }, []);

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null);
    document.body.style.overflow = "";
    lastFocusedElementRef.current?.focus();
  }, []);

  // Trap focus & handle Escape key for the modal lightbox
  useEffect(() => {
    if (!selectedProject) return;

    // Focus close button initially
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseProject();
        return;
      }

      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject, handleCloseProject]);

  const filteredProjects =
    activeCategory === "all"
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Interactive Filter Bar */}
      <section className="sticky top-[73px] md:top-[61px] z-40 py-3.5 sm:py-4 px-6 bg-burgundy-deep border-b border-gold/25 shadow-[0_4px_25px_rgba(15,1,2,0.85)]">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto py-2 no-scrollbar font-sans text-xs font-bold uppercase tracking-wider">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setUserCategory(cat.id)}
              className={`px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gold ${
                activeCategory === cat.id
                  ? "bg-gold text-burgundy-deep shadow-[0_0_16px_rgba(201,161,90,0.35)] font-extrabold border border-gold-light/40"
                  : "text-ivory/70 hover:text-gold hover:bg-burgundy-deep/60 border border-transparent hover:border-gold/30 hover:shadow-[0_0_12px_rgba(201,161,90,0.15)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 sm:py-16 md:py-20 px-6 lg:px-12 bg-burgundy-deep scroll-mt-36">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`View details for ${project.title}`}
                onClick={() => handleOpenProject(project)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenProject(project);
                  }
                }}
                className="group relative h-[440px] rounded-2xl overflow-hidden border border-gold/25 bg-gradient-to-br from-white/[0.06] via-burgundy-deep/40 to-[#120102]/60 backdrop-blur-xl flex flex-col justify-end p-8 shadow-[0_12px_36px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.16)] cursor-pointer hover:border-gold/45 hover:shadow-[0_16px_45px_rgba(0,0,0,0.65),_inset_0_1px_0_rgba(255,255,255,0.24),_0_0_20px_rgba(201,161,90,0.16)] focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-500"
              >
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/60 to-transparent z-10" />
                </div>

                {/* Category Pill */}
                <div className="absolute top-5 left-5 z-20">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-burgundy-deep/90 text-gold border border-gold/30 rounded-full backdrop-blur-md">
                    {project.categoryLabel}
                  </span>
                </div>

                {/* Card Info */}
                <div className="relative z-20 transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="font-sans text-xs text-gold/90 mb-1.5 block">
                    {project.statusLabel}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-ivory mb-2 group-hover:text-gold transition-colors">
                    {project.title}
                  </h2>
                  <p className="font-sans text-xs text-ivory/85 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 text-gold font-sans text-xs font-bold uppercase tracking-wider group-hover:text-gold-light">
                    <span>View Project Details</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-serif text-2xl text-ivory/70">No events found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal Lightbox for Project Details */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-burgundy-deep/85 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-3xl bg-gradient-to-br from-white/[0.08] via-burgundy-deep/80 to-[#120102]/95 border border-gold/35 rounded-2xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.9),_0_0_35px_rgba(201,161,90,0.2),_inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl max-h-[90vh] flex flex-col"
          >
            <button
              ref={closeButtonRef}
              onClick={handleCloseProject}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-burgundy-deep/90 text-gold hover:text-white hover:bg-gold/20 flex items-center justify-center border border-gold/40 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-gold transition-colors"
            >
              ✕
            </button>

            <div className="relative h-72 sm:h-96 w-full flex-shrink-0 overflow-hidden">
              <Image
                src={selectedProject.image}
                alt={selectedProject.imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="p-8 sm:p-10 overflow-y-auto space-y-6">
              <div>
                <span className="text-gold font-sans text-xs font-bold uppercase tracking-widest block mb-1">
                  {selectedProject.categoryLabel} — {selectedProject.statusLabel}
                </span>
                <span className="text-ivory/70 font-sans text-xs italic block">
                  Event Showcase & Production
                </span>
                <h3 id="modal-project-title" className="font-serif text-3xl md:text-4xl text-ivory mt-2">
                  {selectedProject.title}
                </h3>
              </div>

              <p className="font-sans text-base text-ivory/85 leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="pt-4 border-t border-gold/20">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold block mb-3">
                  Event Highlights:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-burgundy-deep/90 border border-gold/25 text-xs text-ivory/90 font-sans"
                    >
                      ✦ {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href={`/contact?eventType=${selectedProject.category}`}
                  onClick={handleCloseProject}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all rounded text-center shadow-lg"
                >
                  Enquire About This Event
                </Link>
                <WhatsAppLink
                  message={`Hello Vintage Vibe Events, I am interested in planning an event in the ${selectedProject.categoryLabel} category.`}
                  className="w-full sm:w-auto px-6 py-3.5 border border-gold/40 text-ivory font-sans text-xs hover:bg-gold/15 transition-colors rounded text-center"
                >
                  Chat on WhatsApp →
                </WhatsAppLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-[73px] md:pt-[61px]">
        
        {/* Hero */}
        <section className="relative py-14 sm:py-16 md:py-20 px-6 text-center border-b border-gold/20 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#3a0507_0%,_#210304_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep via-burgundy-deep/90 to-burgundy-deep" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">
              Our Work
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6 leading-tight">
              Our Portfolio
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-sans text-base md:text-lg text-ivory/85 max-w-2xl leading-relaxed">
              Explore our work across different event categories. Each event showcases our stage setup, flower decorations, lighting, and complete coordination across Hyderabad and nearby areas.
            </p>
          </div>
        </section>

        {/* Gallery wrapped in Suspense for useSearchParams */}
        <Suspense fallback={<div className="py-24 text-center text-ivory/60 font-sans">Loading portfolio archive...</div>}>
          <WorkGallery />
        </Suspense>

        {/* Global CTA */}
        <section className="py-24 px-6 bg-burgundy text-center border-t border-gold/20">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
            <h2 className="font-serif text-4xl md:text-5xl text-ivory">
              Plan Your Celebration With Us
            </h2>
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-xl leading-relaxed">
              Every celebration is unique. Tell us about your plans and let us help you create a memorable event.
            </p>
            <Link
              href="/contact"
              className="px-12 py-5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all rounded shadow-xl"
            >
              Plan Your Event
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
