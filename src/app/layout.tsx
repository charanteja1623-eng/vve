import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

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

// The logo wordmark's exact typeface (verified from the Canva PDF master:
// BaseFont CinzelDecorative-Bold). Used only by the logo mark — preloaded so the
// loader's text-assembly renders in the correct face immediately.
const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vintage Vibe Events — Creating moments. Designing memories.",
  description:
    "Vintage Vibe Events is a premium event organizer in Hyderabad — weddings, celebrations and corporate events, with coordinated design, decoration and services under one team.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${cinzelDecorative.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-burgundy-deep">
        {children}
      </body>
    </html>
  );
}
