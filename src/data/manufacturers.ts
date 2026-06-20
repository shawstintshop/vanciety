// Real Sprinter / vanlife / overland manufacturers — seed data for the
// Manufacturer Platform MVP. Phase 2 moves this to Supabase (manufacturer_profiles).
// Each record powers the directory, the detail page, and the map layer (lat/lng).

export type ManufacturerCategory =
  | "conversion" // full van conversions / camper vans
  | "overland" // 4x4 / expedition rigs
  | "components" // parts, electrical, gear makers
  | "oem"; // OEM / factory adventure vans

export interface ManufacturerProduct {
  name: string;
  price?: string; // display string, e.g. "$189,000" or "Starting at $4,500"
  description?: string;
}

export interface ManufacturerComment {
  author: string;
  rating: number; // 1-5
  date: string; // ISO
  body: string;
}

export interface Manufacturer {
  slug: string;
  name: string;
  category: ManufacturerCategory;
  tagline: string;
  description: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  website: string;
  social: { instagram?: string; youtube?: string; facebook?: string };
  specialties: string[];
  founded?: number;
  rating: number; // aggregate 1-5
  reviewsCount: number;
  verified: boolean;
  featured: boolean;
  products: ManufacturerProduct[];
  comments: ManufacturerComment[];
}

export const MANUFACTURERS: Manufacturer[] = [
  {
    slug: "winnebago",
    name: "Winnebago",
    category: "oem",
    tagline: "Iconic American adventure vans — Revel, Solis, Ekko.",
    description:
      "Winnebago is one of the most recognized RV and camper van manufacturers in North America. Their Class B lineup — the 4x4 Revel, the pop-top Solis, and the Ekko — are built on Mercedes Sprinter and Ram ProMaster platforms for off-grid adventure.",
    city: "Forest City",
    state: "IA",
    latitude: 43.2633,
    longitude: -93.6377,
    website: "https://www.winnebago.com",
    social: { instagram: "https://instagram.com/winnebago", youtube: "https://youtube.com/winnebago" },
    specialties: ["4x4 Sprinter (Revel)", "Pop-top (Solis)", "Class B"],
    founded: 1958,
    rating: 4.7,
    reviewsCount: 892,
    verified: true,
    featured: true,
    products: [
      { name: "Revel 44E", price: "From $228,000", description: "4x4 Sprinter with power lift bed and gear garage." },
      { name: "Solis 59P", price: "From $138,000", description: "Pop-top ProMaster sleeps four." },
      { name: "Ekko", price: "From $198,000", description: "Ford Transit AWD with wet bath." },
    ],
    comments: [
      { author: "TrailRunnerJess", rating: 5, date: "2026-04-12", body: "Revel has been bombproof for 2 years of full-time travel." },
      { author: "DesertNomad", rating: 4, date: "2026-03-02", body: "Love the build quality, wish the water tank were bigger." },
    ],
  },
  {
    slug: "storyteller-overland",
    name: "Storyteller Overland",
    category: "overland",
    tagline: "Adventure vans for the modally free.",
    description:
      "Storyteller Overland builds premium 4x4 adventure vans on the Mercedes Sprinter chassis, known for their MODE power system and rugged, design-forward interiors.",
    city: "Birmingham",
    state: "AL",
    latitude: 33.5186,
    longitude: -86.8104,
    website: "https://storytelleroverland.com",
    social: { instagram: "https://instagram.com/storytelleroverland", youtube: "https://youtube.com/storytelleroverland" },
    specialties: ["4x4 Sprinter", "MODE power system", "Off-grid"],
    founded: 2018,
    rating: 4.8,
    reviewsCount: 412,
    verified: true,
    featured: true,
    products: [
      { name: "Stealth MODE", price: "From $235,000", description: "4x4 Sprinter with the MODE 2.0 power system." },
      { name: "Beast MODE", price: "From $265,000", description: "Maximum off-grid capability." },
    ],
    comments: [
      { author: "OverlandOllie", rating: 5, date: "2026-05-01", body: "The MODE system is a game changer for boondocking." },
    ],
  },
  {
    slug: "outside-van",
    name: "Outside Van",
    category: "conversion",
    tagline: "Custom-built Sprinter adventure vehicles.",
    description:
      "Outside Van designs and builds fully custom Mercedes Sprinter conversions in Portland, Oregon. Each rig is engineered for the owner's specific adventures, from ski touring to remote expeditions.",
    city: "Portland",
    state: "OR",
    latitude: 45.5152,
    longitude: -122.6784,
    website: "https://www.outsidevan.com",
    social: { instagram: "https://instagram.com/outsidevan", youtube: "https://youtube.com/outsidevan" },
    specialties: ["Custom Sprinter", "4x4", "Ski/Expedition builds"],
    founded: 2008,
    rating: 4.9,
    reviewsCount: 268,
    verified: true,
    featured: true,
    products: [
      { name: "Approach Series", price: "From $215,000", description: "Production-line custom Sprinter." },
      { name: "Full Custom Build", price: "Quote", description: "Ground-up bespoke conversion." },
    ],
    comments: [
      { author: "PowderHound", rating: 5, date: "2026-02-18", body: "Best ski van builder, period. Worth the wait." },
    ],
  },
  {
    slug: "sportsmobile",
    name: "Sportsmobile",
    category: "conversion",
    tagline: "The original American adventure van.",
    description:
      "Sportsmobile has been building custom camper vans since the 1960s, famous for their penthouse pop-top and 4x4 conversions on Sprinter, Transit, and Ford E-Series platforms.",
    city: "Fresno",
    state: "CA",
    latitude: 36.7378,
    longitude: -119.7871,
    website: "https://sportsmobile.com",
    social: { instagram: "https://instagram.com/sportsmobile" },
    specialties: ["Penthouse top", "4x4 conversion", "Custom layouts"],
    founded: 1961,
    rating: 4.5,
    reviewsCount: 540,
    verified: true,
    featured: false,
    products: [
      { name: "Sprinter 4x4 Custom", price: "Quote", description: "Custom layout on Sprinter 4x4." },
      { name: "Penthouse Top Conversion", price: "Add-on", description: "Signature pop-top." },
    ],
    comments: [
      { author: "VanOG", rating: 4, date: "2026-01-22", body: "Old school quality. The pop-top is iconic." },
    ],
  },
  {
    slug: "antero-adventure-vans",
    name: "Antero Adventure Vans",
    category: "conversion",
    tagline: "Colorado-built luxury Sprinter vans.",
    description:
      "Antero Adventure Vans builds high-end Mercedes Sprinter conversions in Colorado with a focus on lithium power systems, premium finishes, and four-season capability.",
    city: "Johnstown",
    state: "CO",
    latitude: 40.3372,
    longitude: -104.9119,
    website: "https://anteroadventurevans.com",
    social: { instagram: "https://instagram.com/anteroadventurevans" },
    specialties: ["Luxury Sprinter", "Lithium power", "Four-season"],
    founded: 2016,
    rating: 4.8,
    reviewsCount: 156,
    verified: true,
    featured: false,
    products: [{ name: "Antero Custom Sprinter", price: "From $210,000", description: "Four-season luxury build." }],
    comments: [
      { author: "RockyMtnRoamer", rating: 5, date: "2026-03-15", body: "Heated floors + lithium = winter van life sorted." },
    ],
  },
  {
    slug: "texino",
    name: "Texino",
    category: "conversion",
    tagline: "Design-forward camper vans from LA.",
    description:
      "Texino builds modern, minimalist camper vans and the Switchback flat-pack camper system, blending architecture and adventure out of Los Angeles.",
    city: "Los Angeles",
    state: "CA",
    latitude: 34.0522,
    longitude: -118.2437,
    website: "https://texino.co",
    social: { instagram: "https://instagram.com/texino" },
    specialties: ["Modern design", "Switchback camper", "Sprinter & Transit"],
    founded: 2017,
    rating: 4.6,
    reviewsCount: 98,
    verified: true,
    featured: false,
    products: [
      { name: "Switchback", price: "From $14,500", description: "Flat-pack modular camper kit." },
      { name: "Custom Conversion", price: "Quote", description: "Full design-build van." },
    ],
    comments: [
      { author: "MinimalMiles", rating: 5, date: "2026-04-09", body: "The Switchback is brilliant for a weekend rig." },
    ],
  },
  {
    slug: "vanlife-customs",
    name: "Vanlife Customs",
    category: "conversion",
    tagline: "Denver's custom van conversion shop.",
    description:
      "Vanlife Customs offers full custom conversions, DIY kits, and consultations out of Denver, Colorado — popular with first-time van builders.",
    city: "Denver",
    state: "CO",
    latitude: 39.7392,
    longitude: -104.9903,
    website: "https://www.vanlifecustoms.com",
    social: { instagram: "https://instagram.com/vanlifecustoms", youtube: "https://youtube.com/vanlifecustoms" },
    specialties: ["Custom builds", "DIY kits", "Consultations"],
    founded: 2015,
    rating: 4.4,
    reviewsCount: 210,
    verified: true,
    featured: false,
    products: [
      { name: "Full Custom Van", price: "Quote" },
      { name: "Electrical Kit", price: "From $3,200" },
    ],
    comments: [
      { author: "DIYDan", rating: 4, date: "2026-02-28", body: "Their electrical kit + guide saved my build." },
    ],
  },
  {
    slug: "boho-camper-vans",
    name: "Boho Camper Vans",
    category: "conversion",
    tagline: "Boho-style vans and rentals from Arizona.",
    description:
      "Boho Camper Vans builds and rents characterful camper vans out of Phoenix, Arizona, with a distinct bohemian aesthetic.",
    city: "Phoenix",
    state: "AZ",
    latitude: 33.4484,
    longitude: -112.074,
    website: "https://www.bohocampervans.com",
    social: { instagram: "https://instagram.com/bohocampervans" },
    specialties: ["Boho interiors", "Builds & rentals"],
    founded: 2017,
    rating: 4.3,
    reviewsCount: 187,
    verified: true,
    featured: false,
    products: [
      { name: "Custom Boho Build", price: "Quote" },
      { name: "Van Rental", price: "From $150/night" },
    ],
    comments: [
      { author: "WanderWillow", rating: 5, date: "2026-05-11", body: "Rented before buying — loved the vibe." },
    ],
  },
  {
    slug: "victron-energy",
    name: "Victron Energy",
    category: "components",
    tagline: "Off-grid power: inverters, controllers, monitors.",
    description:
      "Victron Energy makes premium solar charge controllers, inverter/chargers, and battery monitors that are a staple of serious off-grid van electrical systems worldwide.",
    city: "Almere",
    state: "NL",
    latitude: 52.3508,
    longitude: 5.2647,
    website: "https://www.victronenergy.com",
    social: { instagram: "https://instagram.com/victronenergy", youtube: "https://youtube.com/victronenergy" },
    specialties: ["MPPT controllers", "Inverter/chargers", "Battery monitors"],
    founded: 1975,
    rating: 4.8,
    reviewsCount: 2341,
    verified: true,
    featured: true,
    products: [
      { name: "SmartSolar MPPT 100/50", price: "$310" },
      { name: "MultiPlus 12/3000", price: "$915" },
      { name: "SmartShunt 500A", price: "$135" },
    ],
    comments: [
      { author: "AmpHour", rating: 5, date: "2026-03-30", body: "Bluetooth monitoring on everything. Bulletproof." },
    ],
  },
  {
    slug: "goal-zero",
    name: "Goal Zero",
    category: "components",
    tagline: "Portable power stations and solar.",
    description:
      "Goal Zero builds portable power stations (Yeti) and solar panels popular with DIY van builders who want plug-and-play power without a hardwired system.",
    city: "Bluffdale",
    state: "UT",
    latitude: 40.4894,
    longitude: -111.9388,
    website: "https://www.goalzero.com",
    social: { instagram: "https://instagram.com/goalzero", youtube: "https://youtube.com/goalzero" },
    specialties: ["Power stations", "Portable solar"],
    founded: 2009,
    rating: 4.4,
    reviewsCount: 1620,
    verified: true,
    featured: false,
    products: [
      { name: "Yeti 1500X", price: "$1,999" },
      { name: "Boulder 200 Briefcase", price: "$549" },
    ],
    comments: [
      { author: "PlugAndPlay", rating: 4, date: "2026-01-15", body: "Great for a no-wiring setup, a bit pricey." },
    ],
  },
  {
    slug: "advanced-rv",
    name: "Advanced RV",
    category: "conversion",
    tagline: "Hand-built luxury Sprinter motorhomes.",
    description:
      "Advanced RV builds fully custom, hand-crafted luxury Sprinter Class B motorhomes in Ohio, known for engineering depth and lightweight construction.",
    city: "Willoughby",
    state: "OH",
    latitude: 41.6638,
    longitude: -81.4067,
    website: "https://advanced-rv.com",
    social: { instagram: "https://instagram.com/advancedrv" },
    specialties: ["Luxury Sprinter", "Custom engineering", "Lightweight"],
    founded: 2012,
    rating: 4.9,
    reviewsCount: 142,
    verified: true,
    featured: false,
    products: [{ name: "Custom Sprinter Motorhome", price: "From $360,000" }],
    comments: [
      { author: "EngineerEd", rating: 5, date: "2026-04-20", body: "The attention to engineering detail is unmatched." },
    ],
  },
  {
    slug: "tourig",
    name: "Tourig",
    category: "conversion",
    tagline: "Bespoke adventure vans from Golden, CO.",
    description:
      "Tourig builds custom Sprinter and Revel-based adventure vans in Golden, Colorado, with a focus on clean design and reliable off-grid systems.",
    city: "Golden",
    state: "CO",
    latitude: 39.7555,
    longitude: -105.2211,
    website: "https://tourig.com",
    social: { instagram: "https://instagram.com/tourig" },
    specialties: ["Custom Sprinter", "Revel upfits", "Off-grid"],
    founded: 2012,
    rating: 4.7,
    reviewsCount: 119,
    verified: true,
    featured: false,
    products: [{ name: "Custom Adventure Van", price: "Quote" }],
    comments: [
      { author: "AspenAdventurer", rating: 5, date: "2026-03-07", body: "Clean builds and great service." },
    ],
  },
];

export const MANUFACTURER_CATEGORIES: { id: ManufacturerCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "conversion", label: "Conversions" },
  { id: "overland", label: "Overland 4x4" },
  { id: "oem", label: "OEM / Factory" },
  { id: "components", label: "Components & Gear" },
];

export const getManufacturerBySlug = (slug: string): Manufacturer | undefined =>
  MANUFACTURERS.find((m) => m.slug === slug);
