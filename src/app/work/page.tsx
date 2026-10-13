"use client";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site, portfolioProjects, type PortfolioProject } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type FilterCategory = "all" | "weddings" | "birthdays" | "corporate" | "surprises";

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const filteredProjects = activeCategory === "all"
    ? portfolioProjects
    : portfolioProjects.filter((p) => p.category === activeCategory);

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory pt-24">
        
        {/* Hero */}
        <section className="relative py-24 px-6 text-center border-b border-gold/20 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXkFVb3CdXgTAahe_LMDwsjdToFAWYuEYENkqJ79YZKhEUzBZhN5rY_cEYPCkFetz-ndVMXiPJ9LkrIE8R49ulzHwo2nkzHUGYSFUV04h8_UCFAQTXFP23JiHHPg_n79u8auF0L0bQj1Kd9jxqmbNqB3cCMhbm6DzFxNtGCZn11jwEHnx-jpLtLSYYWaSLxSrcx0tJkpDUUHhS2sIEir1yQzCbik9bVbvIf_V7l7RMRSyW4KdRoGVn"
              alt="Luxury wedding portfolio archive backdrop"
              fill
              priority
              className="object-cover"
            />
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
              Explore an archive of royal wedding mandaps, opulent milestone galas, and enterprise productions curated across Hyderabad.
            </p>
          </div>
        </section>

        {/* Interactive Filter Bar */}
        <section className="sticky top-20 z-30 py-4 px-6 bg-burgundy/95 backdrop-blur-md border-b border-gold/20">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6 overflow-x-auto py-2 no-scrollbar font-sans text-xs font-bold uppercase tracking-widest">
            {[
              { id: "all", label: "All Commissions" },
              { id: "weddings", label: "Royal Weddings" },
              { id: "birthdays", label: "Milestone Soirées" },
              { id: "corporate", label: "Corporate Summits" },
              { id: "surprises", label: "Intimate & Proposals" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as FilterCategory)}
                className={`px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
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
                  onClick={() => setSelectedProject(project)}
                  className="group relative h-[440px] rounded-2xl overflow-hidden border border-gold/25 bg-plum flex flex-col justify-end p-8 shadow-xl cursor-pointer hover:border-gold/60 transition-all duration-500"
                >
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
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
                    <span className="font-sans text-xs text-gold/90 mb-1.5 block">
                      {project.venue} • {project.location}
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl text-ivory mb-2 group-hover:text-gold transition-colors">
                      {project.title}
                    </h2>
                    <p className="font-sans text-xs text-ivory/80 line-clamp-2 mb-4 leading-relaxed">
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
                <p className="font-serif text-2xl text-ivory/70">No commissions found in this discipline.</p>
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
            aria-label={selectedProject.title}
          >
            <div className="relative w-full max-w-3xl bg-burgundy border border-gold/40 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-burgundy-deep/90 text-gold hover:text-white flex items-center justify-center border border-gold/30 text-xl font-bold focus:outline-none"
              >
                ✕
              </button>

              <div className="relative h-72 sm:h-96 w-full flex-shrink-0">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.imageAlt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-transparent to-transparent" />
              </div>

              <div className="p-8 sm:p-10 overflow-y-auto space-y-6">
                <div>
                  <span className="text-gold font-sans text-xs font-bold uppercase tracking-widest">
                    {selectedProject.categoryLabel} — {selectedProject.venue}, {selectedProject.location}
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl text-ivory mt-1">
                    {selectedProject.title}
                  </h3>
                </div>

                <p className="font-sans text-base text-ivory/85 leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="pt-4 border-t border-gold/20">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold block mb-3">
                    Project Architectural Highlights:
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
                    onClick={() => setSelectedProject(null)}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-all rounded text-center shadow-lg"
                  >
                    Enquire for Similar Event
                  </Link>
                  <a
                    href={`https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello Vintage Vibe Events, I am interested in designing a concept similar to "${selectedProject.title}".`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 border border-gold/40 text-ivory font-sans text-xs hover:bg-gold/15 transition-colors rounded text-center"
                  >
                    Inquire on WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

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
