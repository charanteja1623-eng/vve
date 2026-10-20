import { site } from "@/lib/site";

/**
 * Validated Schema.org Structured Data for Vintage Vibe Events.
 *
 * Implements:
 * 1. WebSite entity for Google Site Names and brand recognition.
 * 2. ProfessionalService / Event Planning business entity for Google Knowledge Graph.
 */
export default function JsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vintage Vibe Events",
    alternateName: "Vintage Vibe",
    url: "https://vintagevibeevents.in/",
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Vintage Vibe Events",
    alternateName: "Vintage Vibe",
    url: "https://vintagevibeevents.in/",
    logo: "https://vintagevibeevents.in/vve-frame.png",
    image: "https://vintagevibeevents.in/images/hero/palace-courtyard.jpg",
    description:
      "Vintage Vibe Events is a premier wedding and event planning company in Hyderabad, specializing in weddings, milestone birthdays, surprise celebrations, and complete event design across Telangana and Andhra Pradesh.",
    telephone: `+91${site.phones[0]}`,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Hyderabad",
      },
      {
        "@type": "AdministrativeArea",
        name: "Telangana",
      },
      {
        "@type": "AdministrativeArea",
        name: "Andhra Pradesh",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    sameAs: [site.instagram.url],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
    </>
  );
}
