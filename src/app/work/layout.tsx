import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Archive",
  description:
    "Curated portfolio archive of weddings, birthday galas, surprise parties, and luxury celebrations managed by Vintage Vibe Events in Hyderabad.",
  alternates: {
    canonical: "https://vintagevibeevents.in/work",
  },
  openGraph: {
    title: "Portfolio Archive | Vintage Vibe Events",
    description:
      "Curated portfolio archive of luxury weddings, birthday galas, and bespoke celebrations in Hyderabad.",
    url: "https://vintagevibeevents.in/work",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
