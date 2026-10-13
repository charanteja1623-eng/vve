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

  // Configurable WhatsApp business number (defaults to primary atelier phone)
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918886882608",

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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASjUPo6L5BBZUhIfrLNQhKDY22yivrPXGJP00nb6maefMTosPa5cvCPW11LrvwkbpYaTQwlkrAJpBx7GmyVt9Hrbhc0BM_81R5fSLnstB2JgGCBh45v4qVC2PcZFkuuUN9kqNyqBpoDmdgbdfqH_FyVVYTQsm6ukFT6SuKh0eX5gq5PlRs9qXRtLKGhVg8-5W80nHC4gu6gCSSPeSs-uLTNOAUPMoIyvzdRfv7k79tcQrJwAyWwwgF",
    imageAlt: "Extravagant royal palace wedding stage in Hyderabad with fresh orchids, gypsophila, antique gilded pedestals, and velvet divans",
    features: ["Bespoke Floral Mandaps", "Royal Sangeet & Reception Staging", "Curated Cold-Pyro & Low-Fog Entries", "Full Bridal & Groom Hospitality"],
    capacity: "300 to 5,000+ Guests"
  },
  {
    id: "birthdays",
    title: "Milestone Birthdays & Celebrations",
    subtitle: "Immersive Thematic Soirées & Enchanted Galas",
    tag: "Bespoke Soirées",
    description: "Tailored birthday celebrations crafted with cinematic detail. Whether a Great Gatsby 50th gala with crystal chandeliers or a whimsical fairytale wonderland for children with 3D sculpted installations.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDG7MJeZ7aT2qOIioNiqAl4AthgC-E8qkEASL8Ub0TzgP97s9NoUfWpvAVTe3fURUOw2beG_hfXVJyseomhq783bDN5aMHtnOehKU9r7T1YrDgBFSlZ19deTga6wnfNyyJl8GAZcKbrrHUsvOs39na4DszL8d7cy9g2RgsZlNuVua9JpMYaax5Ta4e4bJBnCAqNOVg6ZJeymfxPLJmBBne1gBPbGHPJEFr3uZ4mcPGF95AwHdqC9Esa",
    imageAlt: "Lavish black and gold Great Gatsby themed birthday milestone gala with geometric backdrops and crystal chandeliers in Hyderabad",
    features: ["Custom Thematic Scenography", "Multi-tier Fondant Sculptures & Dessert Bars", "Interactive Live Entertainment", "Photobooths with Custom Props"],
    capacity: "50 to 500 Guests"
  },
  {
    id: "surprises",
    title: "Romantic Proposals & Surprise Parties",
    subtitle: "Private Skylines, Candlelit Pavilions & Secret Unveilings",
    tag: "Intimate Atelier",
    description: "Discreetly engineered romantic proposals and anniversary surprises. High-altitude rooftop setups with illuminated marquis letters, thousands of red roses, and personal violinists.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAED09w8LSYAdsXHJNJnMRCxEBtOchloCP76rCigHUThJ9uPn5OpC0sqU_lHp9yb4oxhOez_R1_H_cV1r89dEZX0uSepDTft33Kh-SCmoTA8v-Y3Ax9s6p3mv0JwZtTUP5V9O2i4yZc-0g4xusqk-uuibzFpRuitAJ7t_H5cGT9935SN3mWB3weRWZkTbrByod_Lw23ivfdRUuP5PWqzQokBc8lOy5OfJMLcAuVcRbQaXYXTqa7htK-",
    imageAlt: "Stunning rooftop romantic marriage proposal setup at night in Hyderabad with illuminated Marry Me letters and glass lanterns",
    features: ["Discreet Coordination & Concealment", "Neon Typography & Glass Hurricane Lanterns", "Acoustic Musicians & Photography Crews", "Champagne & Fine Dining Table Setting"],
    capacity: "Intimate (2 to 40 Guests)"
  },
  {
    id: "corporate",
    title: "Executive Corporate Galas & Summits",
    subtitle: "Product Unveilings, Leadership Galas & Award Nights",
    tag: "Enterprise Production",
    description: "Flawless technical precision for premier corporate summits and brand unveilings. Featuring concert-grade audio-visuals, seamless curved LED backdrops, and executive dining at landmark convention venues.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0yfl1kwjk7lWyfd07UYECz4Ede6AWwZmayY1iaxkRFRvXKmVqTmYcC1H7A79JDR6T5SnX0YxfDjGvba4DM6gHJlLrd8gwMWYYrbfKJVuQY6dO6YXpvBBrPsdG5cWA-3oa42c_fPrksDVZtxXwLjtUaIli1UfNPLkgyt_ZQ-MKU7w7XaDB-yIcZ2WoUk29V1ARvXc8qmkRxx6MJEQw7jUJzvgZEfDaE-iejzS4c_yTtXjSBLh_drrK",
    imageAlt: "Prestigious corporate awards night stage at HICC Hyderabad with dynamic LED pillars and antique gold podium",
    features: ["P2.5 High-Definition Curved LED Screens", "Digital Stage Management & Run-of-Show", "VIP Lounging & Branded Photo Walls", "Turnkey Registration & Gifting Concierge"],
    capacity: "200 to 2,500+ Guests"
  },
  {
    id: "campus",
    title: "School & College Concert Productions",
    subtitle: "Concert Rigs, Annual Galas & Youth Festivals",
    tag: "Large-Scale Staging",
    description: "High-voltage festival environments engineered with safety-first structural standards. Concert line-array speaker rigs, intelligent beam lighting arrays, and artist hospitality management.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcwOwjKX9XZoH_L7xlZr0sLZrxPe9wHBWD5qy0H3DK-qfalhavhxiwPyIrSQuhdbOhk0PXwJkoF7Q4N65eRXck7qPbmN_mV4JHQw2VSA_IzX3H_FOmtcvZ4A3x6-dh9ytwZQTSB1Lhj5WE0bqMMGa4Lhq9cAEgU8LdzPtgTC3UAj6v8UYz7AaUeYswFPTKny-S3qbCfnsq_f1zKz9Kk-tbQ9oLopihF0-aI31OizFjfD3QXCIDhlPc",
    imageAlt: "High-end concert sound speaker rig flown from royal gold trussing at luxury youth concert event in Hyderabad",
    features: ["Heavy-Duty German Trussing & Stages", "Tour-Grade Sound Systems & Line Arrays", "Crowd Control & Safety Barrier Planning", "Celebrity Artist & DJ Curation"],
    capacity: "1,000 to 10,000+ Attendees"
  },
  {
    id: "outdoor",
    title: "Indoor Banquets & Palatial Lawn Gatherings",
    subtitle: "Open-Air Fairy-Lit Soirées & Courtyard Dinners",
    tag: "Atmospheric Scenography",
    description: "Transforming vast open lawns and heritage courtyards into magical nocturnal landscapes. Complete with custom canopy draping, circular lit bars, and fireworks spectacles under the stars.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXkFVb3CdXgTAahe_LMDwsjdToFAWYuEYENkqJ79YZKhEUzBZhN5rY_cEYPCkFetz-ndVMXiPJ9LkrIE8R49ulzHwo2nkzHUGYSFUV04h8_UCFAQTXFP23JiHHPg_n79u8auF0L0bQj1Kd9jxqmbNqB3cCMhbm6DzFxNtGCZn11jwEHnx-jpLtLSYYWaSLxSrcx0tJkpDUUHhS2sIEir1yQzCbik9bVbvIf_V7l7RMRSyW4KdRoGVn",
    imageAlt: "Dazzling night drone shot of open lawn luxury wedding dinner in Hyderabad with fairy lighting and illuminated circular bar",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6uhY-rtg83mvB4Yzwug2grTV9aPhxeXw16A2vXARh4nk4NZapZNlcpxq7sqGwwZDghqhWHujVSpJs9dNRAYzhcjbz66Keay2Ae0-VfpBRMP2pD-rIEo1xmWNbs4N-5OgeFgUQfR0ncpgsPhmpVLy-nASrsjc-gbPUjQA6qG-Zi5IpmHou4UlWn-fJZmh5R5WyNjKMOJmaZcyGI3_D313pmpMKsbCZTkfkquDyqWVLGrN06KNe48vM",
    imageAlt: "Opulent Indian wedding royal buffet table setting with brass chafing dishes, silver samovars, and fresh marigolds",
    highlights: ["Shahi Dastarkhwan Heritage Menus", "FSSAI-Certified Five-Star Hygiene", "Live Saffron Jalebi & Halwa Boutique", "Liquid Nitrogen Mocktail Bar"]
  },
  {
    number: "02",
    id: "decoration",
    title: "Couture Decoration & Floral Architecture",
    subtitle: "Exotic Florals, Carved Mandaps & Heritage Dividers",
    tagline: "Scenography of Royal Emotion",
    description: "Every bloom and fabric fold is curated to reflect palatial elegance. Hand-strung fresh marigold chandeliers, imported Dutch hydrangeas and orchids, brass urlis, and bespoke antique mirror accents.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAafXBIyny0XOrRunW_Xsm0zgxEskrmgDi_I8fK-yOf4gHhCv6r4sbHReD0_dVQ8HXujnuUQAVf7r3ZeKD3XOUNbag4RIBVnXuGHaR6CxbzHs0fO_X2L6yupm_D2Ir7gDwfbgjdf4_WP4bQUxQDSSN7lQdGpteYuhoyGnQnf-zq8vPL9fgt2xcacHl32NTZ_Q-V3hZqNvQbNAdDXHQ2ouRF40Je-Nm9Jir8zhHbAV-99HAqPsOB-sec",
    imageAlt: "South Indian traditional floral stage with marigolds, brass lamps, and Tanjore artwork backdrop in Hyderabad",
    highlights: ["Imported & Indigenous Floral Scenography", "3D Architectural Stage Renderings", "Antique Brass Urli & Diya Installations", "Luxury Velvet & Silk Fabric Draping"]
  },
  {
    number: "03",
    id: "tent-house",
    title: "German Hangar & Luxury Tent House",
    subtitle: "Climate-Controlled Royal Pavilions",
    tagline: "All-Weather Palatial Infrastructure",
    description: "German-engineered waterproof hangar structures transformed into palace ballrooms. Pleated champagne silk ceilings, crystal chandeliers, air-conditioning tunnels, and polished wooden ballroom flooring.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDpGUj60xxcQXQuDnuViyUx77z06O9XEhEnLxUlmYnTQj8tHndvQ4sP022gAE7AeXcxw6TMdN3jaID8ZCC731ykVlu5FWQWSHfdNds8TAKvEMEchZml8DhFGHVtYKrI4h2RZsH7x2xTsbZdFRkozPPMw4vzQjI3QDK3q4uI_0LGbaV-Gv-3hv9Wb-oxlyTKyZxgywlQ8e9w4sujwTJ5Rg1gxEIvRbrJ9KIF-WGxX4G7r8sD44PsIwI",
    imageAlt: "Majestic German hangar wedding venue in Hyderabad with pleated burgundy silk ceilings and massive crystal chandeliers",
    highlights: ["Clear-Span German Modular Hangars", "Industrial HVAC & Climate Control", "Bespoke Pleated Ceilings & Crystal Lighting", "Acoustic Wall Paneling"]
  },
  {
    number: "04",
    id: "audio-visuals",
    title: "Concert Audio, Curved LED & Special Effects",
    subtitle: "P2.5 Video Walls, Cold Pyro & Low-Fog Clouds",
    tagline: "Theatrical Audio-Visual Engineering",
    description: "Immersive sound and cinematic visual walls for unforgettable sangeets and corporate reveals. High-definition curved LED walls displaying custom golden mandala graphics and smoke-free cold spark jets.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCudf5Huom5TNDuJW4xbLlYFCQRV57YhBZqZ3HGBe240yggSiHWnsyPHQBUpi7t-Gs9hZqN10ZF7fnmsX8ivxnCiV4dM_ZlGCecps3Od5FOAfLx5tM_QNMXjKK5v2tmeF_Zrsbj3L9wo7kbdD-pzxl5OcJ_vcRckJ9KNkBIRLgFmWBx_pKYFawwMeA__EDo2vIFhHF6uHLmlQZUwb8jM2mfrIM5met9TJYD4YRtX_gwvEOmQyxfeN1Z",
    imageAlt: "Massive curved P2.5 LED backdrop screen displaying custom royal Rajasthani animations on a grand wedding stage",
    highlights: ["Curved P2.5 Pixel Pitch LED Screens", "Touring Grade Sound Engineering", "Smoke-Free Indoor Cold Pyro Fountains", "Heavy Dry-Ice Low Fog for Bridal Walks"]
  },
  {
    number: "05",
    id: "photography",
    title: "Heirloom Photography & Cinematic Film",
    subtitle: "4K Drone, Candid Portfolios & Teaser Reels",
    tagline: "Timeless Visual Memories",
    description: "Capturing the emotional cadence of your celebration through editorial lenses. Master cinematographers specializing in natural light, candid glances, royal portraits, and same-day teaser trailers.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2n0btJUArmFaKNRjZqExqllPrKEYFwQm62E68BVVeAze4cn5mFVjk9NCRVKoK4dbhP5WqJVXLEanwcASOpZ4Fkg4Ov9K1bmEjlWB8pQ6ieVkLlfiWjp-3rrLpqJdUg5F0gY1D1BqD9vNkA6X2LyRjXjTMWm6Apmeab_EAvQKDfG7wQ0c1wmEJAqXsrIgt-1piObqLjsEztnlpl_Z6eiwsXUqQWOWI4lLAurEA1-kUPWY21N-FKslf",
    imageAlt: "Cinematic portrait of an Indian bride in polki diamonds and crimson lehenga with soft dramatic rim lighting",
    highlights: ["Candid & Editorial Fine-Art Photography", "4K Drone Aerial Cinematography", "Same-Day Wedding Teaser Reels", "Handcrafted Leather-Bound Albums"]
  },
  {
    number: "06",
    id: "gifts",
    title: "Bespoke Welcome Favors & Customized Gifts",
    subtitle: "Artisanal Hampers & Handcrafted Keepsakes",
    tagline: "Thoughtful Gestures of Gratitude",
    description: "Customized welcome hampers and guest favors that leave an indelible impression. Hand-poured scented soy candle boxes, royal brass diyas, gourmet pistachio baklava, and personalized wax-sealed notes.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCymGQGC7cqfGcmUBqvh4dlsQCa-3HmJxJUcsuO-hOuUH6CfGtUXBPIc01VvgaKpibX-h313drTjuZTiYQwV-RCzl9Mq0EfGH9h_nS7vH9TPQuxiKQbDqLTkC8D3Bvx5LmjL-TF1Y_0zfinCyikFsbg2UPzpyw-GggltCGxvM5vsIe3YcVyr0eEGjHCA14_SeIkWfstNvOZw0V1cq_6qE_rr9qCIlHlWUixORqJHRWocg964B2ltOV2",
    imageAlt: "Personalized royal wedding stationery with gold wax seal, calligraphy welcome sign, and velvet seating cards in Hyderabad",
    highlights: ["Hand-Poured Scented Soy Candles", "Gourmet Dry Fruit & Artisan Mithai Jars", "Custom Calligraphy & Wax-Sealed Monograms", "Turnkey Room Drop Delivery"]
  },
  {
    number: "07",
    id: "resin-moulds",
    title: "Preservation Resin & 3D Memorial Moulds",
    subtitle: "Everlasting Floral Keepsakes & Castings",
    tagline: "Preserving Sacred Moments Forever",
    description: "Immortalize sacred wedding Varmala garlands, bridal flowers, and milestone memories in crystal-clear epoxy resin. From luminous gold-leaf clocks to 3D hand castings of couples.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8bQDr5xlpx2FcDFRmSLPhoGJDUZIp27nxZswOLyS5NwjiwOtzJtl9JYBLEi71jmKPCnPqkejpD_IFqw_p6ZDhHzk0mxjI-meHfiUK6d0SLsmZqApzKrQBHx-tcDwXVMCgURKFRR0nA8avqs1iGnC5YSaUl1W2sWnxYCpDDG2JP4XJWxqyanCxWm-vBsPPg1ecH7-PiSV5lEmAJF07D_mIMtmd_KAqAYDepk21IHnvSYLihuVHVvh6",
    imageAlt: "Artisanal floral arrangement details and resin cast keepsakes for high-end celebrations",
    highlights: ["Varmala & Bridal Garland Resin Encasement", "3D Couple Hand & Foot Keepsake Castings", "UV-Stabilized Archival Optical Resin", "Gold Foil Lettering & Custom Bases"]
  },
  {
    number: "08",
    id: "corporate-gifting",
    title: "Executive Corporate Gifting",
    subtitle: "Luxury Branded Packaging & Curations",
    tagline: "Distinguished Professional Appreciation",
    description: "Premium gifting packages engineered for corporate summits, holiday seasons, and VIP partners. Handcrafted leather desk organizers, artisanal teas, and gold-embossed bespoke packaging.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfx84Gs3f1E4ZWwwiLXf5rM7NBt7UQQtmYoJU_fDB8Wt8c5njCspppZ42fmZqgcNTQu9Rli6ZyF9IrAVagO4KXJ6B3PczPLejRiTSclPSJtNK387jYp4mFgaW8L5izQgU4Uk7m4XdZSp3PwU5kp4Qpf-jbwyOyGzyGalw9_klUTHoJQ9E1kA2eDuY86Gu2qcKrciJ2xjYAUszAPvcV1xBKpaDkEey-J0TgrWERc4JzmQ_bg7FKnu1u",
    imageAlt: "Corporate gala and luxury presentation setup with dark velvet and gold accents in Hyderabad",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASjUPo6L5BBZUhIfrLNQhKDY22yivrPXGJP00nb6maefMTosPa5cvCPW11LrvwkbpYaTQwlkrAJpBx7GmyVt9Hrbhc0BM_81R5fSLnstB2JgGCBh45v4qVC2PcZFkuuUN9kqNyqBpoDmdgbdfqH_FyVVYTQsm6ukFT6SuKh0eX5gq5PlRs9qXRtLKGhVg8-5W80nHC4gu6gCSSPeSs-uLTNOAUPMoIyvzdRfv7k79tcQrJwAyWwwgF",
    imageAlt: "Extravagant royal palace wedding stage in Hyderabad with fresh orchids, gypsophila, antique gilded pedestals, and velvet divans",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDG7MJeZ7aT2qOIioNiqAl4AthgC-E8qkEASL8Ub0TzgP97s9NoUfWpvAVTe3fURUOw2beG_hfXVJyseomhq783bDN5aMHtnOehKU9r7T1YrDgBFSlZ19deTga6wnfNyyJl8GAZcKbrrHUsvOs39na4DszL8d7cy9g2RgsZlNuVua9JpMYaax5Ta4e4bJBnCAqNOVg6ZJeymfxPLJmBBne1gBPbGHPJEFr3uZ4mcPGF95AwHdqC9Esa",
    imageAlt: "Lavish black and gold Great Gatsby themed 50th birthday gala at luxury private club in Hyderabad",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAED09w8LSYAdsXHJNJnMRCxEBtOchloCP76rCigHUThJ9uPn5OpC0sqU_lHp9yb4oxhOez_R1_H_cV1r89dEZX0uSepDTft33Kh-SCmoTA8v-Y3Ax9s6p3mv0JwZtTUP5V9O2i4yZc-0g4xusqk-uuibzFpRuitAJ7t_H5cGT9935SN3mWB3weRWZkTbrByod_Lw23ivfdRUuP5PWqzQokBc8lOy5OfJMLcAuVcRbQaXYXTqa7htK-",
    imageAlt: "Rooftop romantic marriage proposal setup at night in Hyderabad with neon Marry Me letters and glass lanterns",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0yfl1kwjk7lWyfd07UYECz4Ede6AWwZmayY1iaxkRFRvXKmVqTmYcC1H7A79JDR6T5SnX0YxfDjGvba4DM6gHJlLrd8gwMWYYrbfKJVuQY6dO6YXpvBBrPsdG5cWA-3oa42c_fPrksDVZtxXwLjtUaIli1UfNPLkgyt_ZQ-MKU7w7XaDB-yIcZ2WoUk29V1ARvXc8qmkRxx6MJEQw7jUJzvgZEfDaE-iejzS4c_yTtXjSBLh_drrK",
    imageAlt: "Corporate gala awards night stage at HICC Hyderabad with dynamic LED pillars and gold trophy podium",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXkFVb3CdXgTAahe_LMDwsjdToFAWYuEYENkqJ79YZKhEUzBZhN5rY_cEYPCkFetz-ndVMXiPJ9LkrIE8R49ulzHwo2nkzHUGYSFUV04h8_UCFAQTXFP23JiHHPg_n79u8auF0L0bQj1Kd9jxqmbNqB3cCMhbm6DzFxNtGCZn11jwEHnx-jpLtLSYYWaSLxSrcx0tJkpDUUHhS2sIEir1yQzCbik9bVbvIf_V7l7RMRSyW4KdRoGVn",
    imageAlt: "Dazzling night drone shot of open lawn luxury wedding dinner in Hyderabad with fairytale tree fairy lighting and circular cocktail bar",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAafXBIyny0XOrRunW_Xsm0zgxEskrmgDi_I8fK-yOf4gHhCv6r4sbHReD0_dVQ8HXujnuUQAVf7r3ZeKD3XOUNbag4RIBVnXuGHaR6CxbzHs0fO_X2L6yupm_D2Ir7gDwfbgjdf4_WP4bQUxQDSSN7lQdGpteYuhoyGnQnf-zq8vPL9fgt2xcacHl32NTZ_Q-V3hZqNvQbNAdDXHQ2ouRF40Je-Nm9Jir8zhHbAV-99HAqPsOB-sec",
    imageAlt: "South Indian traditional floral stage with marigolds, brass lamps, and Tanjore artwork backdrop in Hyderabad",
    description: "Auspicious golden marigolds, antique brass vilakkus, and woven tender coconut leaf partitions celebrating classic South Indian traditions.",
    highlights: ["Hand-strung Marigold Bells", "Tanjore Gold Artwork Backdrop", "Pure Brass Kuthuvilakku Lighting"]
  }
];
