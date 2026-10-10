import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import LogoLoader from "@/components/loader/LogoLoader";
import LogoMark from "@/components/brand/LogoMark";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <LogoLoader />
      <SiteHeader />
      <main className="flex flex-1 flex-col w-full bg-burgundy-deep text-ivory">
        
        {/* 1. Hero */}
        <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-burgundy/80 flex items-center justify-center z-0">
             <div className="text-gold/20 font-sans text-sm uppercase tracking-widest border border-gold/20 p-8 rounded">Hero Image Placeholder</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-burgundy-deep/70 via-burgundy-deep/40 to-burgundy-deep z-0" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-8 mt-12">
            <h1 className="m-0">
              <LogoMark className="w-[min(86vw,520px)]" priority />
            </h1>
            <p className="font-serif text-2xl md:text-4xl text-ivory tracking-wide max-w-3xl leading-tight">
              Creating moments. <span className="text-gold italic">Designing memories.</span>
            </p>
            <p className="font-sans text-base md:text-lg text-ivory/80 max-w-xl leading-relaxed">
              Premium event design and coordination in Hyderabad.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 w-full">
              <Link href="/contact" className="px-10 py-4 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-colors shadow-[0_4px_25px_rgba(201,161,90,0.35)] hover:shadow-[0_4px_35px_rgba(201,161,90,0.6)] hover:-translate-y-0.5 transform w-full sm:w-auto">
                Book a Consultation
              </Link>
              <Link href="#work" className="px-10 py-4 border border-gold/40 text-ivory font-sans font-bold uppercase tracking-widest text-sm hover:border-gold hover:bg-burgundy/60 transition-colors bg-burgundy-deep/60 backdrop-blur-md w-full sm:w-auto">
                Explore Our Work
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Brand Story / The Architecture of Royal Emotion */}
        <section className="py-24 px-6 lg:px-12 bg-burgundy">
          <div className="max-w-6xl mx-auto border border-gold/20 bg-burgundy-deep/80 p-8 md:p-16 lg:p-24 relative rounded-lg shadow-2xl">
            <div className="flex justify-center mb-12">
               <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/50" />
               <div className="w-2 h-2 rounded-full bg-gold mx-4" />
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
                  Born in Hyderabad, the city of Nizami splendor and timeless architectural majesty, <strong className="text-ivory font-semibold">Vintage Vibe Events</strong> was founded with a singular conviction: luxury is not simply excess—it is the harmony of heritage proportions, evocative floral choreography, and unblemished execution.
                </p>
                <p>
                  From royal palace weddings to high-concept contemporary celebrations, our artisanal scenographers and production maestros sculpt environments where each moment unfolds naturally into an heirloom memory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Approved Event Categories */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-burgundy-deep" id="events">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-16 lg:mb-20">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-4 block">Signature Offerings</span>
              <h2 className="font-serif text-4xl md:text-5xl text-ivory">Curated Event Disciplines</h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {[
                { title: "Weddings", desc: "Bespoke mandaps, grand entry arches, and lavish production." },
                { title: "Birthday Parties", desc: "Immersive thematic settings and personalized installations crafted for all ages." },
                { title: "Surprise Parties", desc: "Romantic setups, secret proposal installations, and anniversary celebrations." },
                { title: "Corporate Events", desc: "Executive unveilings, leadership summits, and awards galas engineered with precision." },
                { title: "School & College Events", desc: "Concert-grade outdoor stages, alumni galas, and safety-compliant setups." },
                { title: "Indoor & Outdoor Events", desc: "Adaptable scenography tailored for grand banquets, lush lawns, or intimate courtyards." }
              ].map((event, idx) => (
                <div key={idx} className="group border border-gold/20 bg-burgundy/60 hover:border-gold/60 transition-all duration-500 flex flex-col h-full rounded-xl overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(201,161,90,0.15)]">
                  <div className="h-64 bg-plum border-b border-gold/20 flex items-center justify-center relative overflow-hidden">
                    <span className="text-gold/30 font-sans text-xs uppercase tracking-widest z-10 px-4 text-center">Photography Placeholder</span>
                    <div className="absolute inset-0 bg-burgundy-deep/30 mix-blend-multiply group-hover:bg-transparent transition-colors z-0" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="font-serif text-2xl text-ivory mb-3 group-hover:text-gold transition-colors">{event.title}</h3>
                    <p className="font-sans text-sm text-ivory/70 leading-relaxed mb-8 flex-1">{event.desc}</p>
                    <div className="flex items-center gap-2 text-gold font-sans text-xs font-bold uppercase tracking-widest pt-4 border-t border-gold/15 hover:text-gold-light transition-colors cursor-not-allowed">
                      <span>Explore</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Services */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-burgundy border-y border-gold/20" id="services">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-4">Our Offerings</span>
                <h2 className="font-serif text-3xl md:text-4xl text-ivory">Services</h2>
              </div>
              <p className="font-sans text-sm text-ivory/70 max-w-md md:text-right">
                Integrate these exclusive artisanal services seamlessly into your core event production.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {[
                "Catering", "Decoration", "Tent House", "DJ & Screens", 
                "Photography & Videography", "Customized Gifts", "Resin & 3D Moulds", "Corporate Gifting"
              ].map((service, idx) => (
                <div key={idx} className="p-6 border border-gold/20 bg-burgundy-deep/60 hover:border-gold hover:bg-burgundy-deep transition-all duration-300 text-center flex flex-col items-center justify-center gap-4 group rounded">
                  <div className="w-12 h-12 rounded-full border border-gold/30 bg-plum flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-burgundy-deep transition-colors font-serif text-xl">
                    {idx + 1}
                  </div>
                  <span className="font-sans font-semibold text-sm text-ivory group-hover:text-gold transition-colors">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Portfolio Preview */}
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-burgundy-deep" id="work">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-4">Portfolio</span>
                <h2 className="font-serif text-4xl md:text-5xl text-ivory">Recent Work</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
              {[
                { span: "md:col-span-8", height: "min-h-[400px] lg:min-h-[480px]", title: "Development Placeholder", cat: "Placeholder" },
                { span: "md:col-span-4", height: "min-h-[400px] lg:min-h-[480px]", title: "Development Placeholder", cat: "Placeholder" },
                { span: "md:col-span-5", height: "min-h-[340px]", title: "Development Placeholder", cat: "Placeholder" },
                { span: "md:col-span-7", height: "min-h-[340px]", title: "Development Placeholder", cat: "Placeholder" }
              ].map((item, idx) => (
                <div key={idx} className={`${item.span} ${item.height} border border-gold/25 bg-plum flex flex-col justify-end p-8 relative group overflow-hidden rounded-xl`}>
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                     <span className="text-gold/30 font-sans text-xs uppercase tracking-widest text-center px-4">Portfolio Image<br/>Placeholder</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/40 to-transparent z-10" />
                  <div className="relative z-20 text-left transition-transform duration-500 group-hover:-translate-y-2">
                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-3 block">{item.cat}</span>
                    <h3 className="font-serif text-2xl md:text-3xl text-ivory">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Enquiry CTA */}
        <section className="py-32 lg:py-40 px-6 bg-burgundy text-center relative overflow-hidden border-t border-gold/20">
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/80 to-transparent pointer-events-none" />
          <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-10">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory leading-tight">Plan Your Event</h2>
            <p className="font-sans text-lg text-ivory/80 leading-relaxed max-w-2xl">
              Contact our team to begin the journey.
            </p>
            <Link href="/contact" className="px-12 py-5 bg-gold text-burgundy-deep font-sans font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all duration-300 mt-4 shadow-[0_4px_25px_rgba(201,161,90,0.35)] hover:-translate-y-1 rounded">
              Schedule a Consultation
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
