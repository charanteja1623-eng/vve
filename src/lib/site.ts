/**
 * Central site configuration — single source of truth for confirmed business facts,
 * verified event categories, add-on services, and factual media assets.
 *
 * Strict safeguard: No unverified capacities, named venues, equipment specs, or
 * location-associated placeholder claims.
 */

export const site = {
  name: "Vintage Vibe Events",
  tagline: "Creating moments. Designing memories.",
  serviceArea: "Hyderabad & Secunderabad, Telangana",

  // Confirmed contact details
  phones: ["8886882608", "9032880528"],
  email: "vintagevibeevents12@gmail.com",
  instagram: {
    handle: "@vintage_vibe_events",
    url: "https://instagram.com/vintage_vibe_events",
  },

  // Canonical WhatsApp business number configuration.
  // UNCONFIRMED: Kept empty by default until officially confirmed by the client.
  // Single source of truth: when empty/unconfirmed, all WhatsApp actions are hidden globally.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "",

  // Confirmed operating hours
  businessHours: "Mon – Sat: 10:00 AM – 8:00 PM IST",
} as const;

export type ConfirmedCategorySlug =
  | "wedding-packages"
  | "birthday-parties"
  | "surprise-parties"
  | "indoor-outdoor-events"
  | "school-college-events"
  | "new-year-parties";

export interface EventDiscipline {
  id: ConfirmedCategorySlug;
  slug: ConfirmedCategorySlug;
  title: string;
  tag: string;
  description: string;
  overview: string;
  features: string[];
  planningConsiderations: string[];
  recommendedAddons: ConfirmedAddonId[];
  image: string;
  imageAlt: string;
  subtitle?: string;
  capacity?: string;
}

/**
 * The 6 confirmed visiting-card event categories.
 * Factual, neutral descriptions of VVE planning and coordination.
 */
export const eventDisciplines: EventDiscipline[] = [
  {
    id: "wedding-packages",
    slug: "wedding-packages",
    title: "Wedding Packages",
    tag: "Signature Planning",
    description: "Comprehensive wedding planning and coordination across traditional and contemporary ceremonies. Full stage design, ritual staging, and curated vendor management for your sacred celebrations.",
    overview: "Our signature wedding planning service harmonizes traditional ceremony protocols with contemporary design sensibilities. From preliminary floor plan conception to the final sacred ritual, Vintage Vibe Events oversees stage architecture, floral installations, seating arrangements, and vendor synchronization across Hyderabad and Secunderabad.",
    image: "/images/events/wedding-packages.jpg",
    imageAlt: "Grand wedding mandap setup with floral architecture and warm ambient illumination",
    features: [
      "Complete Ritual Coordination",
      "Bespoke Stage & Mandap Décor",
      "Hospitality & Guest Coordination",
      "End-to-End Vendor Management",
    ],
    planningConsiderations: [
      "Timeline sequencing for multi-day pre-wedding and wedding rituals",
      "Stage load-in and floral preservation schedules according to venue access",
      "Electrical load distribution for mandap spotlights and ambient lighting",
      "Designated guest movement corridors between ceremony and dining pavilions",
    ],
    recommendedAddons: [
      "decoration",
      "tent-house",
      "catering",
      "photo-videography",
      "dj-screens",
      "resin-3d-molds",
      "customized-gifts",
    ],
  },
  {
    id: "birthday-parties",
    slug: "birthday-parties",
    title: "Birthday Parties",
    tag: "Curated Celebrations",
    description: "Thoughtfully designed birthday gatherings from intimate milestones to vibrant themed parties. Custom backdrops, dessert styling, and entertainment coordination tailored to your vision.",
    overview: "From first birthday milestones to elegant silver jubilee galas, our birthday planning brings thoughtful thematic styling and seamless hospitality together. We coordinate custom stage backdrops, confectionery tables, mood lighting, and entertainment schedules tailored to the guest of honor.",
    image: "/images/events/birthday-parties.jpg",
    imageAlt: "Luxury birthday party setup with balloon arches, dessert displays, and ambient warm lighting",
    features: [
      "Theme-Based Styling & Décor",
      "Custom Dessert & Cake Tables",
      "Interactive Entertainment Planning",
      "Audio-Visual & Lighting Setup",
    ],
    planningConsiderations: [
      "Age-appropriate spatial planning for activities, seating, and dessert staging",
      "Sound level balancing between background music and interactive host announcements",
      "Cake cutting focal point lighting and candid photography sightlines",
      "Structured entry and welcome hamper distribution flow",
    ],
    recommendedAddons: [
      "decoration",
      "catering",
      "dj-screens",
      "photo-videography",
      "customized-gifts",
    ],
  },
  {
    id: "surprise-parties",
    slug: "surprise-parties",
    title: "Surprise Parties",
    tag: "Discreet Coordination",
    description: "Secretly planned proposals, anniversaries, and celebratory reveals executed with seamless precision. Coordinated timing, ambient décor, and venue styling to ensure flawless surprises.",
    overview: "Flawless surprises demand rigorous secrecy and split-second logistical timing. We manage covert vendor ingress, atmospheric candlelight and floral styling, hidden photography setups, and cue-to-cue timing to create genuine, breathtaking reveal moments.",
    image: "/images/events/surprise-parties.jpg",
    imageAlt: "Intimate surprise celebration setup with candlelight, draped fabrics, and floral arrangements in an illuminated pavilion",
    features: [
      "Discreet Timeline Coordination",
      "Ambient Floral & Candlelight Staging",
      "Custom Reveal Elements",
      "Photography & Videography Sync",
    ],
    planningConsiderations: [
      "Strict confidentiality protocols with venue staff and technical crews",
      "Precise guest arrival coordination ahead of the guest of honor",
      "Audio and illumination cue management for the reveal moment",
      "Covert camera placement to capture authentic first reactions",
    ],
    recommendedAddons: [
      "decoration",
      "photo-videography",
      "catering",
      "customized-gifts",
      "resin-3d-molds",
    ],
  },
  {
    id: "indoor-outdoor-events",
    slug: "indoor-outdoor-events",
    title: "Indoor & Outdoor Events",
    tag: "Versatile Production",
    description: "Production and logistical planning for banquet halls, open lawns, terraces, and farmhouses. Layout design, weather contingencies, lighting, and ambient styling for all gathering sizes.",
    overview: "Whether hosting a gala inside a heritage banquet hall or staging a grand lawn celebration under open skies, our team handles spatial zoning, structural canopies, ambient perimeter illumination, and weather-ready contingencies across venues in Telangana.",
    image: "/images/events/indoor-outdoor-events.jpg",
    imageAlt: "Expansive indoor-outdoor event production featuring glass marquee, imperial dining tables, and canopy lighting",
    features: [
      "Venue Layout & Flow Planning",
      "Open-Air & Banquet Canopy Styling",
      "Ambient Illumination",
      "Weather-Ready Coordination",
    ],
    planningConsiderations: [
      "Ground levelling, flooring requirements, and weather protection assessments",
      "High-output electrical cabling and backup power generator synchronization",
      "Zoning separation for arrival foyers, banquet seating, and buffet spreads",
      "Egress and pathway lighting for night-time open ground venues",
    ],
    recommendedAddons: [
      "tent-house",
      "decoration",
      "catering",
      "dj-screens",
      "photo-videography",
      "corporate-gifting",
    ],
  },
  {
    id: "school-college-events",
    slug: "school-college-events",
    title: "School & College Events",
    tag: "Campus Productions",
    description: "Structured management for annual day functions, fests, farewells, and campus cultural gatherings. Staging, robust sound and light rigging, and safe crowd logistics.",
    overview: "Institutional gatherings require disciplined stage operations and dependable technical infrastructure. Vintage Vibe Events coordinates heavy-duty aluminum trussing, concert-grade acoustic audio rigs, LED visual walls, and structured run-of-show protocols for academic institutions.",
    image: "/images/events/school-college-events.jpg",
    imageAlt: "Campus cultural festival stage production with professional lighting trusses and live concert audience",
    features: [
      "Main Stage & Trussing Setup",
      "Professional Sound & Light Infrastructure",
      "Event Schedule & Run-of-Show",
      "Safety & Entry Flow Logistics",
    ],
    planningConsiderations: [
      "Strict backstage access control and performer green room coordination",
      "Acoustic calibration for auditorium or open amphitheater resonance",
      "Heavy equipment rigging inspection and load safety certification",
      "Perimeter barricading and rapid crowd dispersal planning",
    ],
    recommendedAddons: [
      "dj-screens",
      "tent-house",
      "photo-videography",
      "catering",
      "customized-gifts",
    ],
  },
  {
    id: "new-year-parties",
    slug: "new-year-parties",
    title: "New Year Parties",
    tag: "Seasonal Celebrations",
    description: "High-energy New Year celebrations and seasonal gatherings for private groups and communities. Dynamic lighting, DJ staging, countdown effects, and themed décor.",
    overview: "Welcome the year ahead with immersive festive production. We engineer dynamic sound and lighting stages, dancefloor infrastructure, midnight countdown special effects, and curated hospitality zones for high-energy year-end celebrations.",
    image: "/images/events/new-year-parties.jpg",
    imageAlt: "Festive New Year celebration gala ballroom with golden confetti, chandelier illumination, and stage lighting",
    features: [
      "Themed Atmosphere & Décor",
      "DJ & Dancefloor Infrastructure",
      "Midnight Countdown Coordination",
      "Crowd & Hospitality Management",
    ],
    planningConsiderations: [
      "Midnight countdown cue synchronization across DJ audio and visual screens",
      "High-density dancefloor safety and slip-resistant structural surfacing",
      "Continuous beverage and buffet replenishment logistics throughout peak hours",
      "Security coordination and entry wristband verification management",
    ],
    recommendedAddons: [
      "dj-screens",
      "decoration",
      "catering",
      "photo-videography",
      "tent-house",
      "corporate-gifting",
    ],
  },
];

export type ConfirmedAddonId =
  | "catering"
  | "decoration"
  | "tent-house"
  | "dj-screens"
  | "photo-videography"
  | "customized-gifts"
  | "resin-3d-molds"
  | "corporate-gifting";

export interface ArtisanalService {
  number: string;
  id: ConfirmedAddonId;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
}

/**
 * The 8 confirmed add-on service offerings.
 * Neutral, factual descriptions without unverified equipment specs or certifications.
 */
export const artisanalServices: ArtisanalService[] = [
  {
    number: "01",
    id: "catering",
    title: "Catering",
    description: "Curated multi-cuisine food and beverage services tailored to your event requirements, from traditional spreads to contemporary live counters.",
    image: "",
    imageAlt: "Placeholder block for Catering — authentic VVE event photography pending",
    highlights: [
      "Multi-Cuisine Menu Planning",
      "Live Food Counters & Buffets",
      "Trained Service Staff",
      "Hygienic Food Preparation",
    ],
  },
  {
    number: "02",
    id: "decoration",
    title: "Decoration",
    description: "Artistic floral arrangements, custom backdrops, ambient fabric draping, and thematic stage décor designed to harmonize with your venue.",
    image: "",
    imageAlt: "Placeholder block for Decoration — authentic VVE event photography pending",
    highlights: [
      "Floral Architecture & Backdrop Design",
      "Entrance & Walkway Décor",
      "Custom Theme Installations",
      "Stage & Seating Styling",
    ],
  },
  {
    number: "03",
    id: "tent-house",
    title: "Tent House",
    description: "Reliable structural setups, marquees, shamianas, and furniture rentals suited for open lawns, courtyards, and outdoor grounds.",
    image: "",
    imageAlt: "Placeholder block for Tent House — authentic VVE event photography pending",
    highlights: [
      "All-Weather Canopy Structures",
      "Carpet & Wooden Flooring",
      "Seating & Banquet Furniture",
      "Ventilation & Ambience Setup",
    ],
  },
  {
    number: "04",
    id: "dj-screens",
    title: "DJ & Screens",
    description: "Professional sound systems, stage lighting, and digital LED display screens for crystal-clear presentations and high-energy music.",
    image: "",
    imageAlt: "Placeholder block for DJ & Screens — authentic VVE event photography pending",
    highlights: [
      "High-Fidelity Audio Rigs",
      "High-Resolution LED Video Walls",
      "Intelligent Stage Lighting",
      "Experienced DJ & Sound Technicians",
    ],
  },
  {
    number: "05",
    id: "photo-videography",
    title: "Photo & Videography",
    description: "Dedicated photography and cinematography teams capturing genuine moments, candid interactions, and ritual highlights throughout your event.",
    image: "",
    imageAlt: "Placeholder block for Photo & Videography — authentic VVE event photography pending",
    highlights: [
      "Candid & Traditional Coverage",
      "Cinematic Highlight Films",
      "Professional Drone Visuals",
      "High-Resolution Digital Albums",
    ],
  },
  {
    number: "06",
    id: "customized-gifts",
    title: "Customized Gifts",
    description: "Bespoke return gifts and welcome hampers designed to express gratitude to your guests with personalized packaging and keepsakes.",
    image: "",
    imageAlt: "Placeholder block for Customized Gifts — authentic VVE event photography pending",
    highlights: [
      "Personalized Welcome Hampers",
      "Handcrafted Keepsakes",
      "Custom Monogram Packaging",
      "Return Gift Curation",
    ],
  },
  {
    number: "07",
    id: "resin-3d-molds",
    title: "Resin & 3D Molds",
    description: "Specialized keepsake craftsmanship preserving floral garlands, wedding tokens, and 3D family or couple hand impressions into lasting art.",
    image: "",
    imageAlt: "Placeholder block for Resin & 3D Molds — authentic VVE event photography pending",
    highlights: [
      "Wedding Garland Resin Preservation",
      "3D Couple Hand Castings",
      "Custom Resin Keepsakes",
      "Long-Lasting Craftsmanship",
    ],
  },
  {
    number: "08",
    id: "corporate-gifting",
    title: "Corporate Gifting",
    description: "Professional corporate gifting solutions for summits, annual festivals, client appreciation, and employee recognition programs.",
    image: "",
    imageAlt: "Placeholder block for Corporate Gifting — authentic VVE event photography pending",
    highlights: [
      "Branded Corporate Hampers",
      "Executive Gift Sets",
      "Bulk Custom Packaging",
      "Scheduled Delivery Logistics",
    ],
  },
];

export interface PortfolioProject {
  id: string;
  title: string;
  category: ConfirmedCategorySlug;
  categoryLabel: string;
  isPlaceholder: true;
  statusLabel: string;
  image: string;
  imageAlt: string;
  description: string;
  highlights: string[];
}

/**
 * 6 explicitly marked placeholder portfolio slots (one per confirmed event category).
 * Strictly zero implied real venues, real locations, client names, dates, or testimonials.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "wedding-packages-placeholder",
    title: "Wedding Packages — Portfolio Slot",
    category: "wedding-packages",
    categoryLabel: "Wedding Packages",
    isPlaceholder: true,
    statusLabel: "Photography Pending",
    image: "",
    imageAlt: "Placeholder block for Wedding Packages — authentic VVE event photography pending",
    description: "Placeholder preview slot. Authentic VVE event photography will be published here once confirmed.",
    highlights: ["Ritual Scenography", "Stage Coordination", "Floral Concepts"],
  },
  {
    id: "birthday-parties-placeholder",
    title: "Birthday Parties — Portfolio Slot",
    category: "birthday-parties",
    categoryLabel: "Birthday Parties",
    isPlaceholder: true,
    statusLabel: "Photography Pending",
    image: "",
    imageAlt: "Placeholder block for Birthday Parties — authentic VVE event photography pending",
    description: "Placeholder preview slot. Authentic VVE event photography will be published here once confirmed.",
    highlights: ["Thematic Backdrops", "Dessert Styling", "Ambient Lighting"],
  },
  {
    id: "surprise-parties-placeholder",
    title: "Surprise Parties — Portfolio Slot",
    category: "surprise-parties",
    categoryLabel: "Surprise Parties",
    isPlaceholder: true,
    statusLabel: "Photography Pending",
    image: "",
    imageAlt: "Placeholder block for Surprise Parties — authentic VVE event photography pending",
    description: "Placeholder preview slot. Authentic VVE event photography will be published here once confirmed.",
    highlights: ["Ambient Floral Details", "Surprise Reveal Flow", "Coordinated Lighting"],
  },
  {
    id: "indoor-outdoor-events-placeholder",
    title: "Indoor & Outdoor Events — Portfolio Slot",
    category: "indoor-outdoor-events",
    categoryLabel: "Indoor & Outdoor Events",
    isPlaceholder: true,
    statusLabel: "Photography Pending",
    image: "",
    imageAlt: "Placeholder block for Indoor & Outdoor Events — authentic VVE event photography pending",
    description: "Placeholder preview slot. Authentic VVE event photography will be published here once confirmed.",
    highlights: ["Canopy & Tent Staging", "Venue Layout Planning", "Lighting Arrays"],
  },
  {
    id: "school-college-events-placeholder",
    title: "School & College Events — Portfolio Slot",
    category: "school-college-events",
    categoryLabel: "School & College Events",
    isPlaceholder: true,
    statusLabel: "Photography Pending",
    image: "",
    imageAlt: "Placeholder block for School & College Events — authentic VVE event photography pending",
    description: "Placeholder preview slot. Authentic VVE event photography will be published here once confirmed.",
    highlights: ["Stage Trussing Infrastructure", "Acoustic Audio Setup", "Crowd Entry Management"],
  },
  {
    id: "new-year-parties-placeholder",
    title: "New Year Parties — Portfolio Slot",
    category: "new-year-parties",
    categoryLabel: "New Year Parties",
    isPlaceholder: true,
    statusLabel: "Photography Pending",
    image: "",
    imageAlt: "Placeholder block for New Year Parties — authentic VVE event photography pending",
    description: "Placeholder preview slot. Authentic VVE event photography will be published here once confirmed.",
    highlights: ["Dancefloor Setup", "Themed Atmosphere", "Midnight Celebration"],
  },
];
