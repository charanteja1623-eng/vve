import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Archive",
  description:
    "Explore our portfolio of weddings, birthday parties, surprise celebrations, and special events managed by Vintage Vibe Events in Hyderabad.",
  alternates: {
    canonical: "https://vintagevibeevents.in/work",
  },
  openGraph: {
    title: "Portfolio Archive | Vintage Vibe Events",
    description:
      "Explore our portfolio of weddings, birthday parties, and celebrations in Hyderabad.",
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
