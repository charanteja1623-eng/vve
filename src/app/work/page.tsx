"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { portfolioProjects, type PortfolioProject, type ConfirmedCategorySlug } from "@/lib/site";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import Link from "next/link";

type FilterCategory = "all" | ConfirmedCategorySlug;

const CATEGORY_TABS: { id: FilterCategory; label: string }[] = [
  { id: "all", label: "All Commissions" },
  { id: "wedding-packages", label: "Wedding Packages" },
  { id: "birthday-parties", label: "Birthday Parties" },
  { id: "surprise-parties", label: "Surprise Parties" },
  { id: "indoor-outdoor-events", label: "Indoor & Outdoor Events" },
  { id: "school-college-events", label: "School & College Events" },
  { id: "new-year-parties", label: "New Year Parties" },
];

function WorkGallery() {
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get("category");

  const fallbackCategory: FilterCategory =
    queryCategory && CATEGORY_TABS.some((tab) => tab.id === queryCategory)
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
      <section className="sticky top-20 z-30 py-4 px-6 bg-burgundy/95 backdrop-blur-md border-b border-gold/20">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto py-2 no-scrollbar font-sans text-xs font-bold uppercase tracking-wider">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setUserCategory(cat.id)}
              className={`px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gold ${
                activeCategory === cat.id
                  ? "bg-gold text-burgundy-deep shadow-md font-extrabold"
                  : "text-ivory/70 hover:text-gold hover:bg-burgundy-deep/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 px-6 lg:px-12 bg-burgundy-deep">
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
                className="group relative h-[440px] rounded-2xl overflow-hidden border border-gold/25 bg-plum flex flex-col justify-end p-8 shadow-xl cursor-pointer hover:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-500"
              >
                <ImagePlaceholder
                  title={project.title}
                  category={project.categoryLabel}
                  aspectRatio="16/10"
                  className="absolute inset-0 w-full h-full"
                  alt={`Placeholder block for ${project.title} — authentic event photography pending`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/50 to-transparent z-10" />

                {/* Category Pill */}
                <div className="absolute top-5 left-5 z-20">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-burgundy-deep/90 text-gold border border-gold/30 rounded-full backdrop-blur-md">
                    {project.categoryLabel}
                  </span>
                </div>

                {/* Card Info */}
                <div className="relative z-20 transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="font-sans text-xs text-gold/80 mb-1.5 block">
                    {project.statusLabel}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-ivory mb-2 group-hover:text-gold transition-colors">
                    {project.title}
                  </h2>
                  <p className="font-sans text-xs text-ivory/80 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 text-gold font-sans text-xs font-bold uppercase tracking-wider group-hover:text-gold-light">
                    <span>View Slot Details</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-serif text-2xl text-ivory/70">No commissions found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal Lightbox for Project Details */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-deep/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-3xl bg-burgundy border border-gold/40 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            <button
              ref={closeButtonRef}
              onClick={handleCloseProject}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-burgundy-deep/90 text-gold hover:text-white flex items-center justify-center border border-gold/30 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-gold"
            >
              ✕
            </button>

            <div className="relative h-72 sm:h-96 w-full flex-shrink-0">
              <ImagePlaceholder
                title={selectedProject.title}
                category={selectedProject.categoryLabel}
                aspectRatio="16/9"
                className="w-full h-full"
                alt={`Placeholder block for ${selectedProject.title}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="p-8 sm:p-10 overflow-y-auto space-y-6">
              <div>
                <span className="text-gold font-sans text-xs font-bold uppercase tracking-widest block mb-1">
                  {selectedProject.categoryLabel} — {selectedProject.statusLabel}
                </span>
                <span className="text-ivory/60 font-sans text-xs italic block">
                  Placeholder Slot — Authentic VVE Event Photography Pending
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
                  Category Planning Focus:
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
                  Enquire for This Event Type
                </Link>
                <WhatsAppLink
                  message={`Hello Vintage Vibe Events, I am interested in planning an event in the ${selectedProject.categoryLabel} category.`}
                  className="w-full sm:w-auto px-6 py-3.5 border border-gold/40 text-ivory font-sans text-xs hover:bg-gold/15 transition-colors rounded text-center"
                >
                  Inquire on WhatsApp →
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
      <main id="main-content" className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-24">
        
        {/* Hero */}
        <section className="relative py-24 px-6 text-center border-b border-gold/20 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#3a0507_0%,_#210304_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(#c9a15a_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep via-burgundy-deep/90 to-burgundy-deep" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">
              The Palatial Archive
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6 leading-tight">
              Curated Portfolio
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-2xl leading-relaxed">
              Explore portfolio preview slots across our confirmed event categories. Authentic VVE event photography will be published here upon verification.
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
              Commission Your Celebration
            </h2>
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-xl leading-relaxed">
              Every production is created anew. Let us craft an original heirloom concept for your special date.
            </p>
            <Link
              href="/contact"
              className="px-12 py-5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all rounded shadow-xl"
            >
              Book a Consultation
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
