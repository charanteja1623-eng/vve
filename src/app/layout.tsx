import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import "@/styles/scroll-experience.css";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import JsonLd from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

// next/font self-hosts these at build time — no runtime Google Fonts request.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// The logo wordmark's exact typeface (Cinzel Decorative Regular 400).
// Configured in regular weight to eliminate excessive bold thickness and match the canonical reference wordmark.
const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Vintage Vibe Events | Wedding & Event Planners",
    template: `%s | ${site.name}`,
  },
  description:
    "Vintage Vibe Events is a premier wedding and event planning company in Hyderabad, specializing in weddings, milestone birthdays, surprise parties, and special celebrations across Telangana and Andhra Pradesh.",
  alternates: {
    canonical: "https://vintagevibeevents.in/",
  },
  openGraph: {
    title: "Vintage Vibe Events | Wedding & Event Planners",
    description:
      "Premier wedding and event planners in Hyderabad. Complete decor, mandap setups, birthdays, and celebrations across Telangana and Andhra Pradesh.",
    url: "https://vintagevibeevents.in/",
    siteName: site.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/hero/palace-courtyard.jpg",
        width: 1200,
        height: 630,
        alt: "Vintage Vibe Events | Wedding & Event Planners",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vintage Vibe Events | Wedding & Event Planners",
    description:
      "Premier wedding and event planners in Hyderabad. Complete decor, mandap setups, birthdays, and celebrations across Telangana and Andhra Pradesh.",
    images: ["/images/hero/palace-courtyard.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${cinzelDecorative.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-ivory text-burgundy-deep" suppressHydrationWarning>
        <JsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-burgundy-deep focus:font-bold focus:rounded focus:outline-none focus:ring-2 focus:ring-burgundy-deep shadow-lg"
        >
          Skip to main content
        </a>
        {children}
        <WhatsAppFab />
      </body>
    </html>
  );
}
