import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { site } from "@/lib/site";

export const metadata = {
  title: `Terms of Service — ${site.name}`,
};

export default function TermsOfServicePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col items-center py-32 px-6 lg:px-12 bg-ivory text-burgundy-deep">
        <div className="w-full max-w-3xl flex flex-col gap-8 mt-8">
          <h1 className="font-serif text-4xl md:text-5xl text-burgundy-deep">Terms of Service</h1>
          <p className="font-sans text-sm text-burgundy/60 uppercase tracking-widest font-bold">Pending Legal Review</p>
          
          <div className="space-y-6 font-sans text-burgundy-deep/80 leading-relaxed border-t border-burgundy/20 pt-8 mt-4">
            <p>
              These Terms of Service are currently under review by our legal counsel. They will be updated shortly to outline the terms and conditions governing the use of our services and website.
            </p>
            <h2 className="font-serif text-2xl text-burgundy-deep mt-8">Service Agreement</h2>
            <p>
              [Terms detailing our event design, coordination, and production services, including booking procedures, payments, and cancellations, will be provided here.]
            </p>
            <h2 className="font-serif text-2xl text-burgundy-deep mt-8">User Responsibilities</h2>
            <p>
              [Terms outlining the responsibilities of users interacting with our website and submitting enquiries will be provided here.]
            </p>
            <h2 className="font-serif text-2xl text-burgundy-deep mt-8">Contact Us</h2>
            <p>
              For any questions regarding our terms, please contact us at <a href={`mailto:${site.email}`} className="text-burgundy-wine font-semibold underline hover:text-burgundy transition-colors">{site.email}</a>.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
