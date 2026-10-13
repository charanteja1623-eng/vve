import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import LogoLoader from "@/components/loader/LogoLoader";
import LogoMark from "@/components/brand/LogoMark";
import Link from "next/link";
import Image from "next/image";
import { eventDisciplines, artisanalServices, portfolioProjects, site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <LogoLoader />
      <SiteHeader />
      <main className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory">
        
        {/* 1. Hero */}
        <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
          {/* Background Image with Cinematic Luxury Gradient */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuASjUPo6L5BBZUhIfrLNQhKDY22yivrPXGJP00nb6maefMTosPa5cvCPW11LrvwkbpYaTQwlkrAJpBx7GmyVt9Hrbhc0BM_81R5fSLnstB2JgGCBh45v4qVC2PcZFkuuUN9kqNyqBpoDmdgbdfqH_FyVVYTQsm6ukFT6SuKh0eX5gq5PlRs9qXRtLKGhVg8-5W80nHC4gu6gCSSPeSs-uLTNOAUPMoIyvzdRfv7k79tcQrJwAyWwwgF"
              alt="Palatial Indian wedding floral stage and royal mandap celebration in Hyderabad"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-40 mix-blend-luminosity scale-105 animate-fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep/90 via-burgundy-deep/65 to-burgundy-deep" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-burgundy-deep/40 to-burgundy-deep" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-8 mt-12">
            <div className="hero-brand-lockup flex flex-col items-center text-center gap-8 w-full">
              <h1 className="m-0">
                <LogoMark className="w-[min(84vw,540px)]" priority />
              </h1>
              <p className="font-serif text-xl md:text-2xl lg:text-3xl text-ivory tracking-wide max-w-2xl leading-snug">
                <span className="inline-block">Creating moments.</span>{" "}
                <span className="inline-block text-gold italic">Designing memories.</span>
              </p>
            </div>
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-xl leading-relaxed">
              Palatial event scenography, royal catering, and turnkey productions in Hyderabad.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 w-full">
              <Link
                href="/contact"
                className="px-10 py-4 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-[0_4px_25px_rgba(201,161,90,0.35)] hover:shadow-[0_4px_35px_rgba(201,161,90,0.6)] hover:-translate-y-0.5 transform w-full sm:w-auto rounded"
              >
                Book a Consultation
              </Link>
              <Link
                href="#work"
                className="px-10 py-4 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-widest text-sm hover:border-gold hover:bg-burgundy/60 transition-all bg-burgundy-deep/60 backdrop-blur-md w-full sm:w-auto rounded"
              >
                Explore The Archive
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Brand Story / The Atelier Creed */}
        <section className="py-24 px-6 lg:px-12 bg-burgundy border-t border-gold/15">
          <div className="max-w-6xl mx-auto border border-gold/25 bg-burgundy-deep/85 p-8 md:p-16 lg:p-24 relative rounded-xl shadow-2xl backdrop-blur-sm">
            <div className="flex justify-center mb-12">
               <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/50" />
               <div className="w-2.5 h-2.5 rounded-full bg-gold mx-4" />
               <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/50" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-5 text-center lg:text-left">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-4">The Atelier Creed</span>
                <h2 className="font-serif text-4xl md:text-5xl text-ivory leading-tight">
                  The Architecture<br className="hidden lg:block"/>of Royal Emotion
                </h2>
              </div>
              <div className="lg:col-span-7 font-sans text-base md:text-lg text-ivory/80 leading-relaxed space-y-6 lg:border-l border-gold/20 lg:pl-16 text-center lg:text-left">
                <p>
                  Born in Hyderabad, the city of Nizami splendor and timeless architectural majesty, <strong className="text-ivory font-semibold">{site.name}</strong> was founded with a singular conviction: luxury is not simply excess—it is the harmony of heritage proportions, evocative floral choreography, and unblemished execution.
                </p>
                <p>
                  From sacred Vedic mandaps to high-concept contemporary celebrations, our artisanal scenographers and production maestros sculpt environments where each moment unfolds naturally into an heirloom memory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Approved Event Disciplines */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-burgundy-deep" id="events">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-16 lg:mb-20">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">Signature Offerings</span>
              <h2 className="font-serif text-4xl md:text-5xl text-ivory">Curated Event Disciplines</h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {eventDisciplines.map((event) => (
                <div
                  key={event.id}
                  className="group border border-gold/20 bg-burgundy/60 hover:border-gold/60 transition-all duration-500 flex flex-col h-full rounded-xl overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(201,161,90,0.15)]"
                >
                  <div className="h-64 relative overflow-hidden bg-plum border-b border-gold/20">
                    <Image
                      src={event.image}
                      alt={event.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/90 via-burgundy-deep/20 to-transparent" />
                    <span className="absolute top-4 left-4 font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-burgundy-deep/90 text-gold border border-gold/30 rounded backdrop-blur-md">
                      {event.tag}
                    </span>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="font-serif text-2xl text-ivory mb-2 group-hover:text-gold transition-colors">{event.title}</h3>
                    <p className="font-sans text-xs text-gold/80 mb-4">{event.subtitle}</p>
                    <p className="font-sans text-sm text-ivory/70 leading-relaxed mb-6 flex-1">{event.description}</p>
                    <Link
                      href={`/events#${event.id}`}
                      className="flex items-center justify-between text-gold font-sans text-xs font-bold uppercase tracking-widest pt-4 border-t border-gold/15 group-hover:text-gold-light transition-colors"
                    >
                      <span>Explore Discipline</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Artisanal Services Showcase */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-burgundy border-y border-gold/20" id="services">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-4">Artisanal Guild</span>
                <h2 className="font-serif text-3xl md:text-5xl text-ivory">Comprehensive Event Services</h2>
              </div>
              <p className="font-sans text-sm md:text-base text-ivory/75 max-w-md md:text-right leading-relaxed">
                Seamlessly integrated artisanal services executed under one unified master production team.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {artisanalServices.map((service) => (
                <div
                  key={service.id}
                  className="p-6 border border-gold/20 bg-burgundy-deep/75 hover:border-gold hover:bg-burgundy-deep transition-all duration-300 flex flex-col justify-between group rounded-xl shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-2xl text-gold/60 group-hover:text-gold transition-colors">{service.number}</span>
                    <span className="w-2 h-2 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-ivory group-hover:text-gold transition-colors mb-2">{service.title}</h3>
                    <p className="font-sans text-xs text-gold/75 mb-3">{service.tagline}</p>
                    <p className="font-sans text-xs text-ivory/70 line-clamp-3 leading-relaxed mb-6">{service.description}</p>
                  </div>
                  <Link
                    href={`/services#${service.id}`}
                    className="font-sans text-[11px] font-bold uppercase tracking-wider text-gold/80 group-hover:text-gold-light flex items-center gap-1.5 pt-4 border-t border-gold/15"
                  >
                    <span>View Specifications</span>
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Portfolio Preview Bento Grid */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-burgundy-deep" id="work">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-4">Curated Archive</span>
                <h2 className="font-serif text-4xl md:text-5xl text-ivory">Recent Palatial Work</h2>
              </div>
              <Link
                href="/work"
                className="text-gold font-sans text-xs font-bold uppercase tracking-widest hover:text-gold-light transition-colors border-b border-gold/30 hover:border-gold pb-1 w-fit"
              >
                Browse Full Portfolio Archive →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
              {portfolioProjects.slice(0, 4).map((project, idx) => {
                const spanClass = idx === 0 ? "md:col-span-8 min-h-[420px]" : idx === 1 ? "md:col-span-4 min-h-[420px]" : idx === 2 ? "md:col-span-5 min-h-[360px]" : "md:col-span-7 min-h-[360px]";
                return (
                  <div
                    key={project.id}
                    className={`${spanClass} relative border border-gold/25 bg-plum flex flex-col justify-end p-8 group overflow-hidden rounded-xl shadow-xl`}
                  >
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/95 via-burgundy-deep/40 to-transparent z-10" />
                    <div className="relative z-20 text-left transition-transform duration-500 group-hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold">{project.categoryLabel}</span>
                        <span className="text-gold/40 text-xs">•</span>
                        <span className="font-sans text-xs text-ivory/70">{project.venue}, {project.location}</span>
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl text-ivory mb-2">{project.title}</h3>
                      <p className="font-sans text-xs text-ivory/75 max-w-lg line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Royal Consultation CTA */}
        <section className="py-32 lg:py-40 px-6 bg-burgundy text-center relative overflow-hidden border-t border-gold/20">
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 to-transparent pointer-events-none" />
          <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold">Begin The Journey</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory leading-tight">
              Plan Your Extraordinary Event
            </h2>
            <p className="font-sans text-base md:text-lg text-ivory/80 leading-relaxed max-w-2xl">
              Whether curating a royal wedding or an exclusive private soirée in Hyderabad, our atelier directors are at your service.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-5 mt-4 w-full sm:w-auto">
              <Link
                href="/contact"
                className="px-12 py-5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-[0_4px_25px_rgba(201,161,90,0.35)] hover:-translate-y-0.5 rounded w-full sm:w-auto text-center"
              >
                Schedule Consultation
              </Link>
              <a
                href={`https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 border border-gold/50 text-ivory font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold/15 transition-all rounded w-full sm:w-auto text-center"
              >
                WhatsApp Direct →
              </a>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
