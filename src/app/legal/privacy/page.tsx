import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site } from "@/lib/site";

export const metadata = {
  title: `Privacy Policy — ${site.name}`,
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center py-32 px-6 lg:px-12 bg-ivory text-burgundy-deep">
        <div className="w-full max-w-3xl flex flex-col gap-8 mt-8">
          <h1 className="font-serif text-4xl md:text-5xl text-burgundy-deep">Privacy Policy</h1>
          <p className="font-sans text-sm text-burgundy/60 uppercase tracking-widest font-bold">Pending Legal Review</p>
          
          <div className="space-y-6 font-sans text-burgundy-deep/80 leading-relaxed border-t border-burgundy/20 pt-8 mt-4">
            <p>
              This Privacy Policy is currently under review by our legal counsel. It will be updated shortly to reflect our data collection, usage, and protection practices in compliance with applicable laws.
            </p>
            <h2 className="font-serif text-2xl text-burgundy-deep mt-8">Data Collection</h2>
            <p>
              [Policy details regarding the collection of personal information, including names, contact details, and event requirements submitted through our enquiry forms, will be provided here.]
            </p>
            <h2 className="font-serif text-2xl text-burgundy-deep mt-8">Data Usage</h2>
            <p>
              [Policy details regarding how collected data is used to provide our event management services and communicate with clients will be provided here.]
            </p>
            <h2 className="font-serif text-2xl text-burgundy-deep mt-8">Contact Us</h2>
            <p>
              For any privacy-related inquiries, please contact us at <a href={`mailto:${site.email}`} className="text-gold hover:text-gold-light transition-colors">{site.email}</a>.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
