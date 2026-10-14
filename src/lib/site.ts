/**
 * Central site configuration — single source of truth for business facts,
 * curated Indian luxury event offerings, and media assets.
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

export interface EventDiscipline {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  image: string;
  imageAlt: string;
  features: string[];
  capacity: string;
}

export const eventDisciplines: EventDiscipline[] = [
  {
    id: "weddings",
    title: "Royal Weddings & Ceremonies",
    subtitle: "Sacred Mandaps, Varmala Theatrics & Grand Sangeet Galas",
    tag: "Signature Discipline",
    description: "Palatial wedding productions blending timeless Vedic traditions with bespoke architectural scenography. From 25-foot floral lotus domes to opulent Rajasthani jharokhas and grand bridal entries.",
    image: "",
    imageAlt: "Placeholder block for Royal Weddings & Ceremonies — authentic event photography pending",
    features: ["Bespoke Floral Mandaps", "Royal Sangeet & Reception Staging", "Curated Cold-Pyro & Low-Fog Entries", "Full Bridal & Groom Hospitality"],
    capacity: "300 to 5,000+ Guests"
  },
  {
    id: "birthdays",
    title: "Milestone Birthdays & Celebrations",
    subtitle: "Immersive Thematic Soirées & Enchanted Galas",
    tag: "Bespoke Soirées",
    description: "Tailored birthday celebrations crafted with cinematic detail. Whether a Great Gatsby 50th gala with crystal chandeliers or a whimsical fairytale wonderland for children with 3D sculpted installations.",
    image: "",
    imageAlt: "Placeholder block for Milestone Birthdays & Celebrations — authentic event photography pending",
    features: ["Custom Thematic Scenography", "Multi-tier Fondant Sculptures & Dessert Bars", "Interactive Live Entertainment", "Photobooths with Custom Props"],
    capacity: "50 to 500 Guests"
  },
  {
    id: "surprises",
    title: "Romantic Proposals & Surprise Parties",
    subtitle: "Private Skylines, Candlelit Pavilions & Secret Unveilings",
    tag: "Intimate Atelier",
    description: "Discreetly engineered romantic proposals and anniversary surprises. High-altitude rooftop setups with illuminated marquis letters, thousands of red roses, and personal violinists.",
    image: "",
    imageAlt: "Placeholder block for Romantic Proposals & Surprise Parties — authentic event photography pending",
    features: ["Discreet Coordination & Concealment", "Neon Typography & Glass Hurricane Lanterns", "Acoustic Musicians & Photography Crews", "Champagne & Fine Dining Table Setting"],
    capacity: "Intimate (2 to 40 Guests)"
  },
  {
    id: "corporate",
    title: "Executive Corporate Galas & Summits",
    subtitle: "Product Unveilings, Leadership Galas & Award Nights",
    tag: "Enterprise Production",
    description: "Flawless technical precision for premier corporate summits and brand unveilings. Featuring concert-grade audio-visuals, seamless curved LED backdrops, and executive dining at landmark convention venues.",
    image: "",
    imageAlt: "Placeholder block for Executive Corporate Galas & Summits — authentic event photography pending",
    features: ["P2.5 High-Definition Curved LED Screens", "Digital Stage Management & Run-of-Show", "VIP Lounging & Branded Photo Walls", "Turnkey Registration & Gifting Concierge"],
    capacity: "200 to 2,500+ Guests"
  },
  {
    id: "campus",
    title: "School & College Concert Productions",
    subtitle: "Concert Rigs, Annual Galas & Youth Festivals",
    tag: "Large-Scale Staging",
    description: "High-voltage festival environments engineered with safety-first structural standards. Concert line-array speaker rigs, intelligent beam lighting arrays, and artist hospitality management.",
    image: "",
    imageAlt: "Placeholder block for School & College Concert Productions — authentic event photography pending",
    features: ["Heavy-Duty German Trussing & Stages", "Tour-Grade Sound Systems & Line Arrays", "Crowd Control & Safety Barrier Planning", "Celebrity Artist & DJ Curation"],
    capacity: "1,000 to 10,000+ Attendees"
  },
  {
    id: "outdoor",
    title: "Indoor Banquets & Palatial Lawn Gatherings",
    subtitle: "Open-Air Fairy-Lit Soirées & Courtyard Dinners",
    tag: "Atmospheric Scenography",
    description: "Transforming vast open lawns and heritage courtyards into magical nocturnal landscapes. Complete with custom canopy draping, circular lit bars, and fireworks spectacles under the stars.",
    image: "",
    imageAlt: "Placeholder block for Indoor Banquets & Palatial Lawn Gatherings — authentic event photography pending",
    features: ["Fairytale Canopy & Tree Lighting", "Architectural Façade Uplighting", "Waterproof Luxury Flooring", "Acoustic Zoning for Multi-Area Venues"],
    capacity: "150 to 3,000+ Guests"
  }
];

export interface ArtisanalService {
  number: string;
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
}

export const artisanalServices: ArtisanalService[] = [
  {
    number: "01",
    id: "catering",
    title: "Royal Live Catering & Gastronomic Curation",
    subtitle: "Awadhi, Nizami & Coastal Regional Feasts",
    tagline: "Shahi Dastarkhwan & Theatrical Live Stations",
    description: "Crafting legendary banquets worthy of Nizami courtyards. Authentic Dum Biryani simmered in clay handis, live stone-griddled Chettinad stations, saffron jalebis in desi ghee, and dry-ice misted mocktail bars.",
    image: "",
    imageAlt: "Placeholder block for Royal Live Catering — authentic event photography pending",
    highlights: ["Shahi Dastarkhwan Heritage Menus", "FSSAI-Certified Five-Star Hygiene", "Live Saffron Jalebi & Halwa Boutique", "Liquid Nitrogen Mocktail Bar"]
  },
  {
    number: "02",
    id: "decoration",
    title: "Couture Decoration & Floral Architecture",
    subtitle: "Exotic Florals, Carved Mandaps & Heritage Dividers",
    tagline: "Scenography of Royal Emotion",
    description: "Every bloom and fabric fold is curated to reflect palatial elegance. Hand-strung fresh marigold chandeliers, imported Dutch hydrangeas and orchids, brass urlis, and bespoke antique mirror accents.",
    image: "",
    imageAlt: "Placeholder block for Couture Decoration & Floral Architecture — authentic event photography pending",
    highlights: ["Imported & Indigenous Floral Scenography", "3D Architectural Stage Renderings", "Antique Brass Urli & Diya Installations", "Luxury Velvet & Silk Fabric Draping"]
  },
  {
    number: "03",
    id: "tent-house",
    title: "German Hangar & Luxury Tent House",
    subtitle: "Climate-Controlled Royal Pavilions",
    tagline: "All-Weather Palatial Infrastructure",
    description: "German-engineered waterproof hangar structures transformed into palace ballrooms. Pleated champagne silk ceilings, crystal chandeliers, air-conditioning tunnels, and polished wooden ballroom flooring.",
    image: "",
    imageAlt: "Placeholder block for German Hangar & Luxury Tent House — authentic event photography pending",
    highlights: ["Clear-Span German Modular Hangars", "Industrial HVAC & Climate Control", "Bespoke Pleated Ceilings & Crystal Lighting", "Acoustic Wall Paneling"]
  },
  {
    number: "04",
    id: "audio-visuals",
    title: "Concert Audio, Curved LED & Special Effects",
    subtitle: "P2.5 Video Walls, Cold Pyro & Low-Fog Clouds",
    tagline: "Theatrical Audio-Visual Engineering",
    description: "Immersive sound and cinematic visual walls for unforgettable sangeets and corporate reveals. High-definition curved LED walls displaying custom golden mandala graphics and smoke-free cold spark jets.",
    image: "",
    imageAlt: "Placeholder block for Concert Audio, Curved LED & Special Effects — authentic event photography pending",
    highlights: ["Curved P2.5 Pixel Pitch LED Screens", "Touring Grade Sound Engineering", "Smoke-Free Indoor Cold Pyro Fountains", "Heavy Dry-Ice Low Fog for Bridal Walks"]
  },
  {
    number: "05",
    id: "photography",
    title: "Heirloom Photography & Cinematic Film",
    subtitle: "4K Drone, Candid Portfolios & Teaser Reels",
    tagline: "Timeless Visual Memories",
    description: "Capturing the emotional cadence of your celebration through editorial lenses. Master cinematographers specializing in natural light, candid glances, royal portraits, and same-day teaser trailers.",
    image: "",
    imageAlt: "Placeholder block for Heirloom Photography & Cinematic Film — authentic event photography pending",
    highlights: ["Candid & Editorial Fine-Art Photography", "4K Drone Aerial Cinematography", "Same-Day Wedding Teaser Reels", "Handcrafted Leather-Bound Albums"]
  },
  {
    number: "06",
    id: "gifts",
    title: "Bespoke Welcome Favors & Customized Gifts",
    subtitle: "Artisanal Hampers & Handcrafted Keepsakes",
    tagline: "Thoughtful Gestures of Gratitude",
    description: "Customized welcome hampers and guest favors that leave an indelible impression. Hand-poured scented soy candle boxes, royal brass diyas, gourmet pistachio baklava, and personalized wax-sealed notes.",
    image: "",
    imageAlt: "Placeholder block for Bespoke Welcome Favors & Customized Gifts — authentic event photography pending",
    highlights: ["Hand-Poured Scented Soy Candles", "Gourmet Dry Fruit & Artisan Mithai Jars", "Custom Calligraphy & Wax-Sealed Monograms", "Turnkey Room Drop Delivery"]
  },
  {
    number: "07",
    id: "resin-moulds",
    title: "Preservation Resin & 3D Memorial Moulds",
    subtitle: "Everlasting Floral Keepsakes & Castings",
    tagline: "Preserving Sacred Moments Forever",
    description: "Immortalize sacred wedding Varmala garlands, bridal flowers, and milestone memories in crystal-clear epoxy resin. From luminous gold-leaf clocks to 3D hand castings of couples.",
    image: "",
    imageAlt: "Placeholder block for Preservation Resin & 3D Memorial Moulds — authentic event photography pending",
    highlights: ["Varmala & Bridal Garland Resin Encasement", "3D Couple Hand & Foot Keepsake Castings", "UV-Stabilized Archival Optical Resin", "Gold Foil Lettering & Custom Bases"]
  },
  {
    number: "08",
    id: "corporate-gifting",
    title: "Executive Corporate Gifting",
    subtitle: "Luxury Branded Packaging & Curations",
    tagline: "Distinguished Professional Appreciation",
    description: "Premium gifting packages engineered for corporate summits, holiday seasons, and VIP partners. Handcrafted leather desk organizers, artisanal teas, and gold-embossed bespoke packaging.",
    image: "",
    imageAlt: "Placeholder block for Executive Corporate Gifting — authentic event photography pending",
    highlights: ["Custom Embossed Company Monograms", "Gourmet Artisanal Tea & Honey Sets", "Eco-Friendly Vegan Leather Accessories", "Pan-India Executive White-Glove Dispatch"]
  }
];

export interface PortfolioProject {
  id: string;
  title: string;
  category: "weddings" | "birthdays" | "corporate" | "surprises";
  categoryLabel: string;
  venue: string;
  location: string;
  image: string;
  imageAlt: string;
  description: string;
  highlights: string[];
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "nizami-palace-mandap",
    title: "The Nizami Lotus Mandap",
    category: "weddings",
    categoryLabel: "Weddings",
    venue: "Taj Falaknuma Palace",
    location: "Hyderabad",
    image: "",
    imageAlt: "Placeholder block for The Nizami Lotus Mandap — authentic event photography pending",
    description: "A breathtaking wedding production featuring a 25-foot carved lotus dome, over 30,000 Dutch orchids, and candlelit courtyard water bodies.",
    highlights: ["Lotus Dome Floral Architecture", "Brass Urli Floating Diyas", "Heritage Sitar Ensemble"]
  },
  {
    id: "great-gatsby-gala",
    title: "The Great Gatsby 50th Milestone",
    category: "birthdays",
    categoryLabel: "Milestone Celebrations",
    venue: "Jubilee Hills Club",
    location: "Hyderabad",
    image: "",
    imageAlt: "Placeholder block for The Great Gatsby 50th Milestone — authentic event photography pending",
    description: "Metallic black and antique gold geometric motifs, cascading crystal chandeliers, custom champagne towers, and retro big-band staging.",
    highlights: ["Art Deco Geometric Backdrops", "Crystal Chandelier Canopy", "Live Saxophone Performance"]
  },
  {
    id: "skyline-proposal",
    title: "Starry Skyline Romantic Proposal",
    category: "surprises",
    categoryLabel: "Surprises & Proposals",
    venue: "Private Penthouse Terrace",
    location: "Banjara Hills",
    image: "",
    imageAlt: "Placeholder block for Starry Skyline Romantic Proposal — authentic event photography pending",
    description: "A secret rooftop transformation with 5,000 crimson Dutch roses, flickering hurricane lanterns, cold spark fountains, and private chef dining.",
    highlights: ["Illuminated Marquis Letters", "Acoustic Violin Serenades", "Cold-Pyro Sparkler Reveal"]
  },
  {
    id: "executive-tech-summit",
    title: "Tech Leadership Summit & Gala",
    category: "corporate",
    categoryLabel: "Corporate Events",
    venue: "Hyderabad International Convention Centre (HICC)",
    location: "HITEC City",
    image: "",
    imageAlt: "Placeholder block for Tech Leadership Summit & Gala — authentic event photography pending",
    description: "A 1,200-executive international leadership conference featuring curved P2.5 digital stages, synchronized lighting, and white-glove catering.",
    highlights: ["P2.5 Panoramic LED Stage", "Executive Networking Lounge", "Digital Award Ceremonies"]
  },
  {
    id: "fairytale-lawn-reception",
    title: "Fairytale Open Lawn Reception",
    category: "weddings",
    categoryLabel: "Weddings",
    venue: "Boulder Hills Golf & Country Club",
    location: "Gachibowli",
    image: "",
    imageAlt: "Placeholder block for Fairytale Open Lawn Reception — authentic event photography pending",
    description: "A canopy of 100,000 warm fairy lights draped through natural ancient trees, surrounding an illuminated circular cocktail rotunda and dance floor.",
    highlights: ["Overhead Fairy Light Canopy", "Illuminated Circular Bar", "Synchronized Midnight Fireworks"]
  },
  {
    id: "pellikuthuru-haldi",
    title: "Traditional Pellikuthuru Haldi Courtyard",
    category: "weddings",
    categoryLabel: "Weddings",
    venue: "Heritage Haveli",
    location: "Banjara Hills",
    image: "",
    imageAlt: "Placeholder block for Traditional Pellikuthuru Haldi Courtyard — authentic event photography pending",
    description: "Auspicious golden marigolds, antique brass vilakkus, and woven tender coconut leaf partitions celebrating classic South Indian traditions.",
    highlights: ["Hand-strung Marigold Bells", "Tanjore Gold Artwork Backdrop", "Pure Brass Kuthuvilakku Lighting"]
  }
];
