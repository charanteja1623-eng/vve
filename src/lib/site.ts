/**
 * Central site configuration — single source of truth for confirmed business facts,
 * verified event categories, add-on services, and factual media assets.
 *
 * Strict safeguard: No unverified capacities, named venues, equipment specs, or
 * location-associated placeholder claims.
 */

export const site = {
  name: "Vintage Vibe Events",
  alternateName: "Vintage Vibe",
  tagline: "Creating moments. Designing memories.",
  url: "https://vintagevibeevents.in",
  serviceArea: "Hyderabad, Andhra Pradesh, and Telangana.",

  // Confirmed contact details — displayed separately with proper spacing
  phones: ["8886882608", "9652961775"],
  telLinks: ["tel:8886882608", "tel:+919652961775"],
  email: "vintagevibeevents12@gmail.com",
  instagram: {
    handle: "@vintage_vibe_events",
    url: "https://instagram.com/vintage_vibe_events",
  },

  // Canonical WhatsApp business number configuration.
  // Single source of truth: when empty/unconfigured, all WhatsApp actions are hidden globally.
  // Overridable via NEXT_PUBLIC_WHATSAPP_NUMBER environment variable.
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER !== undefined
      ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.trim()
      : "919652961775",

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
    tag: "Wedding Packages",
    description: "Full wedding planning and coordination for traditional and modern ceremonies. Stage design, mandap decor, and complete management for your special celebrations.",
    overview: "Our complete wedding planning service brings together traditional rituals and modern design. From floor plan layout to the final ceremony, Vintage Vibe Events manages stage decoration, floral setups, seating arrangements, and vendor coordination across Hyderabad, Andhra Pradesh, and Telangana.",
    image: "/images/events/wedding-packages.jpg",
    imageAlt: "Wedding mandap setup with floral decoration and warm lighting",
    features: [
      "Complete Ritual Coordination",
      "Stage & Mandap Decoration",
      "Hospitality & Guest Seating",
      "Complete Vendor Management",
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
    tag: "Birthday Parties",
    description: "Fun and memorable birthday parties for all ages, from first birthdays to milestone celebrations. Custom themes, balloon decor, stage backdrops, and entertainment.",
    overview: "From first birthday celebrations to special family milestones, our birthday planning brings fun themes and smooth hospitality together. We coordinate stage backdrops, cake tables, lighting, music, and activities tailored to the birthday person.",
    image: "/images/events/birthday-parties.jpg",
    imageAlt: "Birthday party setup with balloon arches, cake displays, and warm lighting",
    features: [
      "Theme-Based Styling & Decor",
      "Custom Dessert & Cake Tables",
      "Party Games & Entertainment",
      "Sound, Music & Lighting Setup",
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
    tag: "Surprise Parties",
    description: "Carefully planned surprise parties, proposals, and anniversary celebrations. Secret setup, romantic lighting, decor, and photography to create genuine moments.",
    overview: "A great surprise needs careful timing and complete secrecy. We manage secret venue setup, beautiful candlelight and flowers, hidden photo and video coverage, and exact timing to make your surprise unforgettable.",
    image: "/images/events/surprise-parties.jpg",
    imageAlt: "Intimate surprise celebration setup with candlelight, draped fabrics, and floral arrangements in an illuminated pavilion",
    features: [
      "Secret Timeline Coordination",
      "Candlelight & Floral Decoration",
      "Custom Reveal Moments",
      "Photo & Video Coverage",
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
    tag: "Venue Events",
    description: "Event planning and setup for banquet halls, open lawns, farmhouses, and outdoor spaces. Layout planning, weather-ready tents, seating, and lighting.",
    overview: "Whether you are hosting an event inside a banquet hall or on a large open lawn, our team manages space planning, weather-proof tents, perimeter lighting, sound, and seating across venues in Hyderabad and Telangana.",
    image: "/images/events/indoor-outdoor-events.jpg",
    imageAlt: "Expansive indoor-outdoor event production featuring glass marquee, dining tables, and canopy lighting",
    features: [
      "Venue Layout & Guest Flow",
      "Open-Air Tents & Canopy Setup",
      "Stage & Ambient Lighting",
      "Weather-Ready Setup",
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
    tag: "Campus Events",
    description: "Complete stage, sound, and lighting for annual days, college fests, farewells, and campus cultural events with clear schedules and crowd safety.",
    overview: "Campus events require dependable stages and strong sound and lighting equipment. Vintage Vibe Events provides concert stages, clear sound systems, LED display walls, and structured schedules for schools and colleges.",
    image: "/images/events/school-college-events.jpg",
    imageAlt: "Campus cultural festival stage production with professional lighting trusses and live concert audience",
    features: [
      "Main Stage & Truss Setup",
      "Sound Systems & Lighting Setup",
      "Event Schedule Management",
      "Entry & Crowd Flow Management",
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
    tag: "New Year Celebrations",
    description: "High-energy New Year celebrations and parties for communities and private groups. Sound systems, DJ setups, dance floors, countdown effects, and decor.",
    overview: "Welcome the new year with an exciting party. We set up DJ stages, dance floors, vibrant lighting, LED video screens, and midnight countdown confetti effects to keep guests celebrating all night.",
    image: "/images/events/new-year-parties.jpg",
    imageAlt: "Festive New Year celebration gala ballroom with golden confetti, chandelier illumination, and stage lighting",
    features: [
      "Party Theme & Decoration",
      "DJ Setup & Dance Floor",
      "Midnight Countdown Effects",
      "Guest Seating & Food Counters",
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
    description: "Delicious multi-cuisine food and drink options tailored to your event, from traditional South and North Indian meals to live snack counters.",
    image: "/images/addons/catering.jpg",
    imageAlt: "Buffet table spread with hot dishes, fresh food, and floral accents",
    highlights: [
      "Custom Menu Planning",
      "Live Food Counters & Buffets",
      "Helpful Serving Staff",
      "Clean & Hygienic Preparation",
    ],
  },
  {
    number: "02",
    id: "decoration",
    title: "Decoration",
    description: "Beautiful fresh flower setups, stage backdrops, entry arches, and warm lighting designed to match your theme and venue.",
    image: "/images/addons/decoration.jpg",
    imageAlt: "Floral stage decoration with flowers, pillars, and warm lighting",
    highlights: [
      "Floral Stages & Backdrops",
      "Entrance & Pathway Decor",
      "Custom Themed Setups",
      "Seating & Table Styling",
    ],
  },
  {
    number: "03",
    id: "tent-house",
    title: "Tent House",
    description: "Sturdy waterproof tents, shamianas, chairs, sofas, banquet tables, and cooling setups for lawns, courtyards, and open grounds.",
    image: "/images/addons/tent-house.jpg",
    imageAlt: "Outdoor event tent setup with fabric draping and chandeliers",
    highlights: [
      "All-Weather Tents & Canopies",
      "Carpets & Wooden Flooring",
      "Chairs, Sofas & Banquet Tables",
      "Fans & Cooling Systems",
    ],
  },
  {
    number: "04",
    id: "dj-screens",
    title: "DJ & Screens",
    description: "Quality sound systems, stage lighting, and bright LED display screens for speeches, videos, and party music.",
    image: "/images/addons/dj-screens.jpg",
    imageAlt: "LED video wall and stage lighting setup for live event",
    highlights: [
      "Clear Sound Systems",
      "High-Definition LED Screens",
      "Stage & Dance Floor Lights",
      "Experienced DJ & Technicians",
    ],
  },
  {
    number: "05",
    id: "photo-videography",
    title: "Photo & Videography",
    description: "Photographers and videographers capturing candid smiles, ceremony rituals, and family moments throughout your event.",
    image: "/images/addons/photo-videography.jpg",
    imageAlt: "Event photographer capturing candid family moments during a celebration",
    highlights: [
      "Candid & Traditional Photos",
      "Event Highlight Videos",
      "Drone Aerial Video Coverage",
      "High-Resolution Photo Albums",
    ],
  },
  {
    number: "06",
    id: "customized-gifts",
    title: "Customized Gifts",
    description: "Thoughtful return gifts, welcome boxes, and personalized hampers to thank your guests with beautiful packaging.",
    image: "/images/addons/customized-gifts.jpg",
    imageAlt: "Gift boxes and return gift hampers with personalized tags",
    highlights: [
      "Personalized Welcome Hampers",
      "Handcrafted Return Gifts",
      "Custom Gift Packaging",
      "Gifts for Every Budget",
    ],
  },
  {
    number: "07",
    id: "resin-3d-molds",
    title: "Resin & 3D Molds",
    description: "Handmade keepsakes preserving wedding flower garlands and 3D hand impressions of couples or babies to treasure forever.",
    image: "/images/addons/resin-3d-molds.jpg",
    imageAlt: "Handcrafted resin keepsake and 3D couple hand casting display",
    highlights: [
      "Wedding Garland Preservation",
      "3D Couple & Baby Hand Casts",
      "Custom Resin Photo Frames",
      "Durable, Long-Lasting Keepsakes",
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
 * Portfolio showcase cards across our 6 confirmed event categories.
 * All cards feature authentic, full-bleed photography.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "wedding-packages-showcase",
    title: "Grand Telugu Wedding Mandap",
    category: "wedding-packages",
    categoryLabel: "Wedding Packages",
    statusLabel: "Featured Event",
    image: "/images/portfolio/wedding-packages.jpg",
    imageAlt: "Traditional Telugu wedding mandap in Hyderabad with golden temple pillars and fresh jasmine flowers",
    description: "A traditional Telugu wedding mandap featuring carved gold pillars, fresh jasmine floral arrangements, and warm ceremony lighting.",
    highlights: ["Temple Pillar Mandap", "Fresh Jasmine Flowers", "Warm Ceremony Lighting"],
  },
  {
    id: "birthday-parties-showcase",
    title: "Enchanted Safari Birthday Gala",
    category: "birthday-parties",
    categoryLabel: "Birthday Parties",
    statusLabel: "Featured Event",
    image: "/images/portfolio/birthday-parties.jpg",
    imageAlt: "1st birthday party with safari animal displays, pastel balloon arches, and marquee lights",
    description: "A fun safari-themed first birthday party featuring animal displays, pastel balloon arches, and custom lighted name signs.",
    highlights: ["Themed Backdrops", "Balloon Arches", "Warm Ambient Lighting"],
  },
  {
    id: "surprise-parties-showcase",
    title: "Romantic Rooftop Marriage Proposal",
    category: "surprise-parties",
    categoryLabel: "Surprise Parties",
    statusLabel: "Featured Event",
    image: "/images/portfolio/surprise-parties.jpg",
    imageAlt: "Rooftop marriage proposal setup at night in Hyderabad with neon sign, rose petals, and lanterns",
    description: "A secret rooftop proposal overlooking Hyderabad city lights, with an illuminated neon sign, red rose petal pathways, and lanterns.",
    highlights: ["Secret Setup", "Candlelight Pathway", "City Skyline Views"],
  },
  {
    id: "indoor-outdoor-events-showcase",
    title: "Lawn Gala & Fairytale Canopy Banquet",
    category: "indoor-outdoor-events",
    categoryLabel: "Indoor & Outdoor Events",
    statusLabel: "Featured Event",
    image: "/images/portfolio/indoor-outdoor-events.jpg",
    imageAlt: "Open lawn evening gala banquet with fairytale canopy lighting and circular lounge seating",
    description: "An open lawn evening celebration with fairy light canopy draping, banquet dining tables, and comfortable lounge seating.",
    highlights: ["Fairy Light Canopy", "Spacious Dining Area", "Garden Lighting"],
  },
  {
    id: "school-college-events-showcase",
    title: "Campus Cultural Fest Concert Stage",
    category: "school-college-events",
    categoryLabel: "School & College Events",
    statusLabel: "Featured Event",
    image: "/images/portfolio/school-college-events.jpg",
    imageAlt: "Campus cultural festival concert stage with lighting trusses and audience",
    description: "A campus festival stage with heavy-duty metal trussing, moving stage lights, high-power sound systems, and crowd safety barriers.",
    highlights: ["Concert Stage Setup", "High-Power Audio", "Crowd Safety Barriers"],
  },
  {
    id: "new-year-parties-showcase",
    title: "Royal Countdown Gala Ballroom",
    category: "new-year-parties",
    categoryLabel: "New Year Parties",
    statusLabel: "Featured Event",
    image: "/images/portfolio/new-year-parties.jpg",
    imageAlt: "New Year countdown celebration with golden confetti, neon lights, and live stage",
    description: "A lively New Year countdown party with golden confetti cannons, bright neon lighting, and an energetic dance floor stage.",
    highlights: ["Midnight Confetti", "Dance Floor Setup", "Stage Lighting Show"],
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
    description: "Complete planning and decoration for traditional home rituals, arranged according to your family customs, timings, and home layout.",
    image: "/images/wedding-services/home-events-pujas.jpg",
    imageAlt: "South Indian traditional puja stage with fresh marigold flowers, brass lamps, and traditional backdrop",
    customizationNote: "Every family has unique traditions and timings. We arrange every ceremony to match your family's customs and preferences.",
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
        description: "Pre-wedding and post-wedding pujas, Satyanarayana Swamy Vratham, housewarming blessings, and custom family rituals.",
      },
    ],
  },

  brideAndGroomServices: {
    id: "bride-groom-services",
    title: "Bride & Groom Services",
    tag: "Styling & Preparation",
    description: "Complete coordination for bridal beauty, grooming, hairstyling, and getting-ready schedules so you look and feel your best for every function.",
    image: "/images/wedding-services/bride-groom-services.jpg",
    imageAlt: "Bride in traditional kanjeevaram saree and jewelry on decorated swing",
    customizationNote: "We coordinate with experienced makeup artists and hairstylists according to your preferred style, timeline, and outfit changes.",
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
      tag: "Daytime Celebration",
      description: "Bright and joyful haldi celebrations with fresh yellow marigolds, traditional brass urlis, flower swings, and colorful photo backdrops.",
      image: "/images/wedding-services/haldi.jpg",
      imageAlt: "Haldi ceremony decor with yellow marigold curtains, brass urli bowls with rose petals, and custom swing",
      focusAreas: [
        "Yellow Marigold Backdrop Decor",
        "Brass Urli & Flower Seating",
        "Haldi Splash & Petal Toss Setup",
        "Photo & Video Lighting Setup",
      ],
      selectableOptions: [
        "Marigold & Flower Curtain Backdrop",
        "Brass Urli Seating Setup",
        "Decorated Flower Swing",
        "Yellow Theme Guest Favors & Floral Jewelry",
        "Outdoor Lawn / Courtyard Setup",
      ],
    },
    {
      id: "sangeet" as const,
      title: "Sangeet Musical Evening",
      tag: "Music & Dance Night",
      description: "Exciting sangeet evening with high-quality sound, stage lighting, bright LED backdrops, dance floors, and stage setups for family performances.",
      image: "/images/wedding-services/sangeet.jpg",
      imageAlt: "Sangeet musical evening stage with LED video backdrop and dance floor",
      focusAreas: [
        "Quality Sound & Stage Lighting",
        "High-Definition LED Video Screen",
        "Dance Floor & Stage Sparklers",
        "Family Performance Stage Timing",
      ],
      selectableOptions: [
        "Performance Stage & Truss Setup",
        "LED Screen Video Visuals",
        "Glossy Dance Floor",
        "Cold Sparklers & Stage Effects",
        "Lounge & Table Seating",
      ],
    },
    {
      id: "reception" as const,
      title: "Wedding Reception",
      tag: "Grand Reception Gala",
      description: "Grand reception stage decoration, beautiful flower backdrops, comfortable guest seating, warm mood lighting, and welcoming hospitality.",
      image: "/images/wedding-services/reception.jpg",
      imageAlt: "Fairy-light canopy wedding reception garden under trees with warm lighting",
      focusAreas: [
        "Grand Stage & Couple Seating Setup",
        "Flower Canopy & Chandelier Decor",
        "Guest Welcome & Photo Area",
        "Banquet Dining & Ambient Lighting",
      ],
      selectableOptions: [
        "Grand Floral Stage Backdrop",
        "Fairytale Canopy & Warm Lighting",
        "VIP Banquet Seating & Table Decor",
        "Welcome Walkway & Photo Backdrop",
        "Guest Welcome & Stage Coordination",
      ],
    },
  ],
};
