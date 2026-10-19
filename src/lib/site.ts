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
  serviceArea: "Hyderabad, Andhra Pradesh, and Telangana.",

  // Confirmed contact details — displayed separately with proper spacing
  phones: ["8886882608", "96529 61775"],
  telLinks: ["tel:8886882608", "tel:+919652961775"],
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
    overview: "Our signature wedding planning service harmonizes traditional ceremony protocols with contemporary design sensibilities. From preliminary floor plan conception to the final sacred ritual, Vintage Vibe Events oversees stage architecture, floral installations, seating arrangements, and vendor synchronization across Hyderabad, Andhra Pradesh, and Telangana.",
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
  | "resin-3d-molds";

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
 * The 7 confirmed add-on service offerings.
 * Neutral, factual descriptions with authentic photography and verified capabilities.
 */
export const artisanalServices: ArtisanalService[] = [
  {
    number: "01",
    id: "catering",
    title: "Catering",
    description: "Curated multi-cuisine food and beverage services tailored to your event requirements, from traditional spreads to contemporary live counters.",
    image: "/images/addons/catering.jpg",
    imageAlt: "Curated multi-cuisine royal buffet table spread with floral accents and traditional chafing dishes",
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
    image: "/images/addons/decoration.jpg",
    imageAlt: "Extravagant floral stage decoration with thousands of orchids, gilded pedestals, and warm ambient illumination",
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
    image: "/images/addons/tent-house.jpg",
    imageAlt: "Majestic German hangar event structure with luxury fabric drapery and crystal chandeliers",
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
    image: "/images/addons/dj-screens.jpg",
    imageAlt: "Curved high-definition LED video wall and concert-grade stage lighting truss setup",
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
    image: "/images/addons/photo-videography.jpg",
    imageAlt: "Cinematic portrait photography capturing authentic wedding emotions and ritual moments",
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
    image: "/images/addons/customized-gifts.jpg",
    imageAlt: "Artisan-crafted brass trinket keepsake boxes and curated wedding welcome hampers",
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
    image: "/images/addons/resin-3d-molds.jpg",
    imageAlt: "Handcrafted crystal botanical resin keepsake preserving wedding varmala garland florals",
    highlights: [
      "Wedding Garland Resin Preservation",
      "3D Couple Hand Castings",
      "Custom Resin Keepsakes",
      "Long-Lasting Craftsmanship",
    ],
  },
];

export interface PortfolioProject {
  id: string;
  title: string;
  category: ConfirmedCategorySlug;
  categoryLabel: string;
  isPlaceholder?: boolean;
  statusLabel: string;
  image: string;
  imageAlt: string;
  description: string;
  highlights: string[];
}

/**
 * Curated portfolio showcase cards across our 6 confirmed event categories.
 * All cards feature authentic, full-bleed photography.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "wedding-packages-showcase",
    title: "Grand Telugu Wedding Mandap",
    category: "wedding-packages",
    categoryLabel: "Wedding Packages",
    statusLabel: "Curated Showcase",
    image: "/images/portfolio/wedding-packages.jpg",
    imageAlt: "Panoramic view of a grand royal Telugu wedding mandap in Hyderabad featuring traditional gold carved temple pillars, thousands of jasmine and lotus flowers, and radiant ceremonial fire",
    description: "Traditional Telugu wedding mandap staging featuring intricately carved gold temple pillars, sacred altar ceremonial fire, and lavish jasmine floral architecture.",
    highlights: ["Temple Pillar Mandap", "Sacred Altar Floral Work", "Ceremonial Warm Lighting"],
  },
  {
    id: "birthday-parties-showcase",
    title: "Enchanted Safari Birthday Gala",
    category: "birthday-parties",
    categoryLabel: "Birthday Parties",
    statusLabel: "Curated Showcase",
    image: "/images/portfolio/birthday-parties.jpg",
    imageAlt: "Grand luxury 1st birthday gala, Enchanted Royal Safari theme with life-size golden giraffes and lions, organic pastel balloon installations, custom illuminated marquee",
    description: "Immersive safari-themed milestone birthday production featuring life-size golden wildlife sculptures, organic pastel balloon installations, and custom illuminated name marquees.",
    highlights: ["Thematic Backdrops", "Organic Balloon Art", "Ambient Illuminations"],
  },
  {
    id: "surprise-parties-showcase",
    title: "Romantic Rooftop Marriage Proposal",
    category: "surprise-parties",
    categoryLabel: "Surprise Parties",
    statusLabel: "Curated Showcase",
    image: "/images/portfolio/surprise-parties.jpg",
    imageAlt: "Stunning rooftop romantic marriage proposal setup at night in Hyderabad, neon Marry Me illuminated sign, thousands of red rose petals, glass hurricane lanterns",
    description: "Secretly staged rooftop proposal overlooking Hyderabad city lights, featuring an illuminated neon sign, cascading red rose petal pathways, and glass hurricane lanterns.",
    highlights: ["Discreet Coordination", "Candlelight Pathway", "City Skyline Views"],
  },
  {
    id: "indoor-outdoor-events-showcase",
    title: "Lawn Gala & Fairytale Canopy Banquet",
    category: "indoor-outdoor-events",
    categoryLabel: "Indoor & Outdoor Events",
    statusLabel: "Curated Showcase",
    image: "/images/portfolio/indoor-outdoor-events.jpg",
    imageAlt: "Open lawn evening gala banquet with fairytale canopy lighting and illuminated circular cocktail lounge",
    description: "Expansive open-lawn celebration under ancient trees draped in cascading fairy lights, imperial dining arrangements, and an illuminated circular lounge.",
    highlights: ["Fairytale Canopy", "Zoned Banquet Layout", "Architectural Illumination"],
  },
  {
    id: "school-college-events-showcase",
    title: "Campus Cultural Fest Concert Stage",
    category: "school-college-events",
    categoryLabel: "School & College Events",
    statusLabel: "Curated Showcase",
    image: "/images/portfolio/school-college-events.jpg",
    imageAlt: "Vibrant campus cultural festival concert stage with massive truss lighting systems, synchronized laser show, and high-energy crowd",
    description: "Full-scale campus festival stage featuring heavy-duty aluminum trussing, synchronized moving-head beam lights, concert line-array audio, and structured crowd barricades.",
    highlights: ["Concert Truss Rig", "High-Fidelity Audio", "Crowd Safety Barriers"],
  },
  {
    id: "new-year-parties-showcase",
    title: "Royal Countdown Gala Ballroom",
    category: "new-year-parties",
    categoryLabel: "New Year Parties",
    statusLabel: "Curated Showcase",
    image: "/images/portfolio/new-year-parties.jpg",
    imageAlt: "Spectacular New Year luxury countdown celebration featuring golden confetti drops, neon light sculptures, champagne towers, and live orchestra stage",
    description: "High-octane New Year midnight countdown celebration featuring golden confetti cannons, architectural neon light installations, and dancefloor staging.",
    highlights: ["Midnight Special Effects", "Dancefloor Infrastructure", "Dynamic Light Shows"],
  },
];

/**
 * Agreed Wedding Packages taxonomy & service structure.
 * 
 * 1. Home Events & Pujas (combined category)
 *    - Bride-side traditional ceremonies & pujas
 *    - Groom-side traditional ceremonies & pujas
 *    - Family-requested traditional rituals
 * 
 * 2. Bride & Groom Services
 *    - Styling/coordination services & beauty/grooming professionals
 * 
 * 3. Wedding Functions (3 independent selectable functions)
 *    - Haldi (ceremony requirements, preferred date, venue, decor preferences, special instructions)
 *    - Sangeet (entertainment requirements, music/performance, stage setup, venue, coordination)
 *    - Reception (stage & seating requirements, decor preferences, venue, guest count, reception coordination)
 * 
 * 4. 7 Reusable Add-On Services
 */
export interface WeddingCategoryStructure {
  id: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  imageAlt: string;
  items: {
    id: string;
    label: string;
    description: string;
  }[];
  customizationNote: string;
}

export interface WeddingFunctionStructure {
  id: "haldi" | "sangeet" | "reception";
  title: string;
  tag: string;
  description: string;
  image: string;
  imageAlt: string;
  focusAreas: string[];
  selectableOptions: string[];
}

export const weddingStructure = {
  homeEventsAndPujas: {
    id: "home-events-pujas",
    title: "Home Events & Pujas",
    tag: "Traditional Ceremonies",
    description: "Dedicated planning and ceremonial staging for traditional home rituals, tailored precisely to your family customs, sacred timings, and residence layout.",
    image: "/images/wedding-services/home-events-pujas.jpg",
    imageAlt: "Auspicious South Indian traditional puja and ceremony stage with fresh marigold floral bells, brass lamps, and Tanjore artwork backdrop",
    customizationNote: "Every family observes distinct ritual sequences and auspicious timings. We arrange the ceremony flow to capture your exact family customs and requirements.",
    services: [
      {
        id: "bride-side-rituals",
        label: "Bride-Side Ceremonies & Pujas",
        description: "Pellikuthuru ceremony, Gowri Puja, Mangala Snanam ritual setup, Mehendi home staging, and traditional floral decor.",
      },
      {
        id: "groom-side-rituals",
        label: "Groom-Side Ceremonies & Pujas",
        description: "Pellikoduku ceremony, Snathakam rituals, sacred Vratham coordination, traditional entrance toranams, and priest stage setup.",
      },
      {
        id: "family-rituals",
        label: "Family-Requested Custom Rituals",
        description: "Custom pre-wedding and post-wedding pujas, Satyanarayana Swamy Vratham, house blessing rituals, and bespoke cultural ceremonies.",
      },
    ],
  },

  brideAndGroomServices: {
    id: "bride-groom-services",
    title: "Bride & Groom Services",
    tag: "Styling & Preparation",
    description: "End-to-end coordination for bridal beauty, grooming, bespoke styling, and preparation schedules to ensure seamless readiness across all functions.",
    image: "/images/wedding-services/bride-groom-services.jpg",
    imageAlt: "Royal bride in traditional kanjeevaram sari and heirloom jewelry on decorated swing",
    customizationNote: "We coordinate with top-tier beauty and grooming professionals according to your preferred styling direction, ceremony timeline, and attire changes.",
    services: [
      {
        id: "bridal-makeup",
        label: "Bridal Makeup",
        description: "High-definition bridal makeup tailored to morning ceremony rituals, evening receptions, and photography lighting.",
      },
      {
        id: "bridal-hairstyling",
        label: "Bridal Hairstyling & Draping",
        description: "Traditional floral poola jada, contemporary updos, hair accessories, and precise saree/dupatta draping.",
      },
      {
        id: "groom-styling",
        label: "Groom Grooming & Styling",
        description: "Hair styling, beard grooming, safa/turban tying, and traditional attire coordination for all wedding functions.",
      },
      {
        id: "look-coordination",
        label: "Outfit & Look Coordination",
        description: "Color palette coordination between bride and groom, accessory matching, and ceremony attire schedules.",
      },
      {
        id: "prep-schedules",
        label: "Preparation & Call-Time Schedules",
        description: "Structured preparation timelines and room coordination ensuring timely arrival for auspicious muhurtham moments.",
      },
    ],
  },

  functions: [
    {
      id: "haldi" as const,
      title: "Haldi Ceremony",
      tag: "Vibrant Day Ritual",
      description: "Sunlit yellow celebrations featuring fresh marigold floral installations, brass urlis, personalized floral swings, and celebratory splash-ready decor.",
      image: "/images/wedding-services/haldi.jpg",
      imageAlt: "Vibrant luxury Haldi ceremony decor with traditional yellow marigold curtains, brass urli bowls filled with rose petals, custom swing with floral upholstery",
      focusAreas: [
        "Traditional Yellow & Marigold Staging",
        "Brass Urli & Floral Seating Arrangements",
        "Celebratory Splash & Petal Toss Logistics",
        "Daylight Photo & Video Sightlines",
      ],
      selectableOptions: [
        "Marigold & Floral Curtain Backdrop",
        "Carved Brass Urli Seating Setup",
        "Custom Floral Upholstery Swing",
        "Guest Yellow Theme Favors & Floral Jewelry",
        "Outdoor Lawn / Courtyard Staging",
      ],
    },
    {
      id: "sangeet" as const,
      title: "Sangeet Musical Evening",
      tag: "High-Energy Evening",
      description: "Spectacular musical production with concert-grade sound, dynamic moving-head lighting, LED starfields, glossy dance floor, and choreographed performance staging.",
      image: "/images/wedding-services/sangeet.jpg",
      imageAlt: "Dazzling Sangeet musical evening stage in banquet palace with cascading LED starfields and grand dance floor",
      focusAreas: [
        "Concert Line-Array Audio & Stage Lighting",
        "Curved P2.5 High-Definition LED Backdrop",
        "Glossy Acrylic Dancefloor & Sparkler Pyro",
        "Choreography & Run-of-Show Stage Timing",
      ],
      selectableOptions: [
        "Grand Performance Stage & Truss Rig",
        "High-Definition LED Screen Visuals",
        "Glossy Mirror Dance Floor",
        "Cold Pyro & Atmospheric Sparklers",
        "Cocktail & Velvet Lounge Seating",
      ],
    },
    {
      id: "reception" as const,
      title: "Wedding Reception",
      tag: "Grand Evening Gala",
      description: "Palatial stage architecture, bespoke floral chandeliers, imperial banquet seating, ambient mood lighting, and coordinated guest hospitality.",
      image: "/images/wedding-services/reception.jpg",
      imageAlt: "Fairy-light canopy wedding reception garden under centuries-old banyan trees with hanging glass baubles and warm Edison illumination",
      focusAreas: [
        "Imperial Stage & Couple Seating Architecture",
        "Floral Canopy & Chandelier Installations",
        "Guest Greeting Flow & Photography Corridor",
        "Banquet Table Zoning & Ambient Lighting",
      ],
      selectableOptions: [
        "Grand Palatial Floral Stage Backdrop",
        "Fairytale Tree Canopy & Edison Bulb Glow",
        "VIP Mirror Banquet Tables & Crystal Candelabras",
        "Welcome Walkway & Photo Opportunity Foyer",
        "Host & Guest Movement Coordination",
      ],
    },
  ],
};
