import { Suspense } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site } from "@/lib/site";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata = {
  title: `Contact Us — ${site.name}`,
  description: "Enquire about your upcoming event with Vintage Vibe Events in Hyderabad.",
  alternates: {
    canonical: "https://vintagevibeevents.in/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col items-center py-32 px-6 lg:px-12 bg-ivory text-burgundy-deep">
        <div className="w-full max-w-5xl flex flex-col gap-16 mt-8">
          <div className="text-center space-y-6">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold-ink block">Get In Touch</span>
            <h1 className="font-serif text-4xl md:text-6xl text-burgundy-deep leading-tight">
              Plan Your Event
            </h1>
            <div className="h-px w-24 bg-gold mx-auto" />
            <p className="font-sans text-lg text-burgundy-deep/70 max-w-2xl mx-auto leading-relaxed">
              Tell us about your upcoming event. Our team will get in touch with you shortly to discuss your plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="md:col-span-5 flex flex-col gap-8 bg-burgundy-deep/85 backdrop-blur-xl text-ivory p-8 md:p-12 rounded-2xl shadow-[0_12px_45px_rgba(15,1,2,0.8),_inset_0_1px_0_rgba(227,201,133,0.15)] border border-gold/30 hover:border-gold/50 transition-all duration-500">
              <div>
                <h3 className="font-serif text-3xl text-gold-light mb-4">Direct Contact</h3>
                <p className="text-sm opacity-80 mb-10 font-sans leading-relaxed">Contact us directly for quick questions or event enquiries.</p>
                <div className="space-y-8 font-sans">
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-gold opacity-90">Phone</span>
                    <div className="flex flex-col gap-2">
                      <a href={site.telLinks[0]} className="text-lg leading-snug text-ivory hover:text-gold-light hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.4)] transition-all w-fit">{site.phones[0]}</a>
                      <a href={site.telLinks[1]} className="text-lg leading-snug text-ivory hover:text-gold-light hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.4)] transition-all w-fit">{site.phones[1]}</a>
                    </div>
                  </div>
                  {Boolean(site.whatsappNumber && site.whatsappNumber.replace(/\D/g, "")) && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-gold opacity-90">WhatsApp</span>
                      <a
                        href={`https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hello, I'd like to enquire about your event services.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-ivory hover:bg-[#25D366]/30 hover:border-[#25D366] transition-all text-sm font-semibold w-fit group shadow-[0_0_15px_rgba(37,211,102,0.2)]"
                        aria-label="Chat with Vintage Vibe Events on WhatsApp"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse shadow-[0_0_8px_#25D366]" />
                        <span>Chat on WhatsApp (+91 9652961775)</span>
                        <span className="text-[#25D366] group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-gold opacity-90">Email</span>
                    <a href={`mailto:${site.email}`} className="text-lg text-ivory hover:text-gold-light hover:drop-shadow-[0_0_8px_rgba(201,161,90,0.4)] transition-all w-fit">{site.email}</a>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-gold opacity-90">Location</span>
                    <span className="text-base sm:text-lg text-ivory/90 leading-relaxed">{site.serviceArea}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <Suspense fallback={<div className="md:col-span-7 p-8 text-burgundy-deep font-sans">Loading enquiry form...</div>}>
              <EnquiryForm />
            </Suspense>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
