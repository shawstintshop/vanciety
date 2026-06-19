// Van Intelligence Hub data layer.
//
// Derived from the verified source registry and content taxonomy in /docs:
//   - VANCIETY_VAN_SOURCE_REGISTRY.json
//   - VANCIETY_VAN_CONTENT_TAXONOMY.json
//   - VANCIETY_VAN_INTELLIGENCE_SYSTEM.md
//
// TRUTH RULES (non-negotiable, from the spec):
//   - No fake prices, dates, ratings, reviews, or listings.
//   - Marketplace/forum entries are LIVE SEARCH/INDEX links, not verified individual
//     listings — we never invent a price or condition for them.
//   - Login-only sources are marked AUTH_REQUIRED. Private groups are PRIVATE_SOURCE.
//   - Anything we cannot verify stays UNKNOWN. Source links are always preserved.
//
// Verified seed content (videos / events / vendors) is reused from vancietyVerified.ts
// so the Hub stays consistent with the rest of the site.

import {
  verifiedVideos,
  verifiedEvents,
  verifiedVendors,
  type VerifiedVideo,
  type VerifiedEvent,
  type VerifiedVendor,
} from "@/data/vancietyVerified";

export { verifiedVideos, verifiedEvents, verifiedVendors };
export type { VerifiedVideo, VerifiedEvent, VerifiedVendor };

/**
 * Honest source badges used across the Hub. Each one describes *what kind of access
 * the link actually has* — never an endorsement or a verified price/rating.
 */
export type VanSourceBadge =
  | "OFFICIAL"        // official site / event organizer page, fetched live
  | "LIVE_SEARCH"     // a live search/index URL; results change and are NOT individually verified
  | "PUBLIC_FORUM"    // publicly readable community forum
  | "PUBLIC_SOCIAL"   // public social/forum source, often rate-limited (API preferred)
  | "AUTH_REQUIRED"   // login/session required before any data is available
  | "PRIVATE_SOURCE"  // private group — indexed only with explicit member permission
  | "MEMBER_SUBMITTED"// community-contributed, pending moderation
  | "UNKNOWN";        // availability/details not yet verified

export const vanSourceBadgeClass = (badge: VanSourceBadge): string => {
  switch (badge) {
    case "OFFICIAL":
      return "bg-blue-600 text-white";
    case "LIVE_SEARCH":
      return "bg-emerald-600 text-white";
    case "PUBLIC_FORUM":
      return "bg-teal-600 text-white";
    case "PUBLIC_SOCIAL":
      return "bg-cyan-700 text-white";
    case "AUTH_REQUIRED":
      return "bg-amber-500 text-black";
    case "PRIVATE_SOURCE":
      return "bg-rose-700 text-white";
    case "MEMBER_SUBMITTED":
      return "bg-violet-600 text-white";
    default:
      return "bg-slate-600 text-white";
  }
};

export const vanSourceBadgeHelp: Record<VanSourceBadge, string> = {
  OFFICIAL: "Official organizer/site, link fetched live.",
  LIVE_SEARCH: "Live search/index link — results change and individual listings are not verified here.",
  PUBLIC_FORUM: "Publicly readable community forum.",
  PUBLIC_SOCIAL: "Public social/forum source, often rate-limited (API preferred for monitoring).",
  AUTH_REQUIRED: "Requires login/session before any data is available.",
  PRIVATE_SOURCE: "Private group — indexed only with explicit member permission.",
  MEMBER_SUBMITTED: "Community-contributed, pending moderation.",
  UNKNOWN: "Availability or details not yet verified.",
};

/** Generic link-out source card. Used for marketplaces, forums, dealers, etc. */
export interface VanSource {
  id: string;
  name: string;
  url: string;
  badge: VanSourceBadge;
  category: string;
  /** Honest, non-invented description of what the link is and its limits. */
  note: string;
}

// ---------------------------------------------------------------------------
// Marketplace / Deals — registry "marketplaces" (no invented prices)
// ---------------------------------------------------------------------------
export const marketplaceSources: VanSource[] = [
  {
    id: "ebay-sprinter-parts",
    name: "eBay — Sprinter Van Parts",
    url: "https://www.ebay.com/sch/i.html?_nkw=mercedes+sprinter+van+parts",
    badge: "LIVE_SEARCH",
    category: "Parts & accessories",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "ebay-revel",
    name: "eBay — Winnebago Revel",
    url: "https://www.ebay.com/sch/i.html?_nkw=winnebago+revel",
    badge: "LIVE_SEARCH",
    category: "Vehicles & accessories",
    note: "Browser-opened eBay search for Revel vehicles and parts. Automated checks may hit anti-bot protection; open eBay to confirm seller, fitment, price, and availability.",
  },
  {
    id: "craigslist",
    name: "Craigslist — RVs + Auto Parts",
    url: "https://www.craigslist.org/about/sites",
    badge: "LIVE_SEARCH",
    category: "Regional listings",
    note: "Regional classifieds index. Choose your region, then search. Listings are unverified and change constantly.",
  },
  {
    id: "vanviewer",
    name: "VanViewer",
    url: "https://vanviewer.com/",
    badge: "OFFICIAL",
    category: "Van listings",
    note: "Public van listings marketplace. Open the site for current inventory and prices.",
  },
  {
    id: "conversion-trader",
    name: "Conversion Trader",
    url: "https://conversiontrader.com/",
    badge: "OFFICIAL",
    category: "Converted vans",
    note: "Public marketplace for converted/custom vans. Open the site for current inventory and prices.",
  },
  {
    id: "facebook-marketplace",
    name: "Facebook Marketplace",
    url: "https://www.facebook.com/marketplace/",
    badge: "AUTH_REQUIRED",
    category: "Local listings",
    note: "Requires a Facebook login/session. We do not scrape private data — connect access to enable monitoring.",
  },
];

// ---------------------------------------------------------------------------
// Forums & Groups — registry "forums_groups"
// ---------------------------------------------------------------------------
export const forumSources: VanSource[] = [
  {
    id: "sprinter-source",
    name: "Sprinter Source",
    url: "https://sprinter-source.com/forums/",
    badge: "PUBLIC_FORUM",
    category: "Sprinter owners",
    note: "Core Sprinter owner forum. Reading is public; some posting/search may require an account.",
  },
  {
    id: "class-b-forum",
    name: "Class B Forum",
    url: "https://www.classbforum.com/forums/",
    badge: "PUBLIC_FORUM",
    category: "Class B / RV",
    note: "Public Class B / RV owner discussions.",
  },
  {
    id: "irv2",
    name: "iRV2 Forums",
    url: "https://www.irv2.com/forums/",
    badge: "PUBLIC_FORUM",
    category: "RV community",
    note: "Large RV community with van/RV threads.",
  },
  {
    id: "reddit-vandwellers",
    name: "Reddit — r/vandwellers",
    url: "https://www.reddit.com/r/vandwellers/",
    badge: "PUBLIC_SOCIAL",
    category: "Van living",
    note: "Public subreddit. Rate-limited; the Reddit API is preferred for reliable monitoring.",
  },
  {
    id: "reddit-vanlife",
    name: "Reddit — r/VanLife",
    url: "https://www.reddit.com/r/VanLife/",
    badge: "PUBLIC_SOCIAL",
    category: "Van life",
    note: "Public subreddit. Rate-limited; API preferred for monitoring.",
  },
  {
    id: "reddit-sprintervans",
    name: "Reddit — r/SprinterVans",
    url: "https://www.reddit.com/r/SprinterVans/",
    badge: "PUBLIC_SOCIAL",
    category: "Sprinter-focused",
    note: "Sprinter-focused subreddit (activity varies). Rate-limited; API preferred.",
  },
  {
    id: "facebook-groups",
    name: "Facebook — Revel / Sprinter / Van groups",
    url: "https://www.facebook.com/groups/",
    badge: "PRIVATE_SOURCE",
    category: "Private groups",
    note: "Most relevant groups are private. Indexed only with explicit member permission and authenticated access.",
  },
];

// ---------------------------------------------------------------------------
// Vendors / Mechanics / Dealers — registry "mechanics_and_dealers"
// (Builder/vendor cards come from verifiedVendors)
// ---------------------------------------------------------------------------
export const mechanicDealerSources: VanSource[] = [
  {
    id: "mb-dealer-locator",
    name: "Mercedes-Benz Vans — Official Site",
    url: "https://www.mbvans.com/",
    badge: "OFFICIAL",
    category: "Official service",
    note: "Official Mercedes-Benz Vans site. The old direct dealer-locator URL returned 404 in verification, so this uses the verified official landing page plus the live Google Maps mechanic search below.",
  },
  {
    id: "google-maps-sprinter-mechanic",
    name: "Google Maps — “Sprinter mechanic near me”",
    url: "https://www.google.com/maps/search/sprinter+mechanic/",
    badge: "LIVE_SEARCH",
    category: "Local mechanics",
    note: "Live local search. Results are location-specific and must be verified before any rating or contact info is shown.",
  },
];

// ---------------------------------------------------------------------------
// YouTube discovery queries (registry "youtube_queries") — discovery, not content
// ---------------------------------------------------------------------------
export const youtubeQueries: string[] = [
  "newest sprinter van build",
  "Mercedes Sprinter van tour",
  "Winnebago Revel build mods",
  "van life tips Sprinter",
  "Sprinter van electrical solar",
  "Sprinter van stereo upgrade",
  "Sprinter van tires wheels",
  "van build accessories",
  "overland van adventure",
  "van expo recap",
];

// ---------------------------------------------------------------------------
// Fire rating scale (taxonomy) — capability/demo only, NO ratings collected yet
// ---------------------------------------------------------------------------
export interface FireRatingLevel {
  score: number;
  label: string;
}

export const fireRatingScale: FireRatingLevel[] = [
  { score: 1, label: "Not recommended" },
  { score: 2, label: "Below average" },
  { score: 3, label: "Solid" },
  { score: 4, label: "Recommended" },
  { score: 5, label: "FIRE" },
];

// ---------------------------------------------------------------------------
// Login / API blockers (registry "blocked_or_needs_login") — surfaced honestly
// ---------------------------------------------------------------------------
export const blockedOrNeedsLogin: string[] = [
  "Facebook Groups and Marketplace",
  "eBay API / saved searches for reliable listing alerts",
  "YouTube Data API for newest-upload monitoring at scale",
  "Google Drive OAuth for private source files",
  "Supabase login/project access for production database persistence",
];

// ---------------------------------------------------------------------------
// Hub navigation sections (spec "Core navigation sections")
// ---------------------------------------------------------------------------
export interface HubSection {
  id: string;
  label: string;
}

export const hubSections: HubSection[] = [
  { id: "today", label: "Today" },
  { id: "events", label: "Events & Shows" },
  { id: "marketplace", label: "Deals & Marketplace" },
  { id: "videos", label: "Videos & Builds" },
  { id: "vendors", label: "Vendors & Mechanics" },
  { id: "forums", label: "Forums & Groups" },
  { id: "builds", label: "Member Builds" },
  { id: "newsletter", label: "Newsletter" },
];

/** Newest verified video drives the Home/Today "latest video" slot. */
export const newestVideo: VerifiedVideo = verifiedVideos[0];

// ---------------------------------------------------------------------------
// Products & Accessories taxonomy
// notableItems are brand/model names only — no prices, no ratings
// ---------------------------------------------------------------------------
export interface ProductCategory {
  id: string;
  label: string;
  emoji: string;
  description: string;
  notableItems: string[];
  searchUrl: string;
  badge: VanSourceBadge;
  note: string;
}

export const productCategories: ProductCategory[] = [
  {
    id: "tires",
    label: "Tires & Wheels",
    emoji: "🛞",
    description: "All-terrain and overland tires for Sprinter-sized vans",
    notableItems: ["BFGoodrich KO2", "Falken Wildpeak AT3W", "Cooper Discoverer AT3", "Nitto Ridge Grappler"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=sprinter+van+tires+all+terrain",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "audio",
    label: "Stereo & Audio",
    emoji: "🔊",
    description: "Head units, speakers, amplifiers, and subwoofers for van builds",
    notableItems: ["Pioneer AVH series", "Alpine Halo", "JBL Stage speakers", "Kenwood DMX"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=sprinter+van+stereo+head+unit",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "power",
    label: "Power & Electrical",
    emoji: "⚡",
    description: "Lithium batteries, inverters, DC-DC chargers, and shore power systems",
    notableItems: ["Victron Energy", "Battle Born Batteries", "Renogy", "EcoFlow"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=van+life+lithium+battery+system",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "solar",
    label: "Solar & Charging",
    emoji: "☀️",
    description: "Solar panels, MPPT controllers, and complete solar kits",
    notableItems: ["Renogy panels", "Victron MPPT", "Go Power!", "BougeRV"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=van+solar+panel+kit",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "suspension",
    label: "Suspension & Lift",
    emoji: "🚐",
    description: "Lift kits, upgraded springs, sway bars, and air suspension for load leveling",
    notableItems: ["Agile Offroad", "Roadmaster Active Suspension", "Ride-Rite air bags", "Sprinter Store"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=sprinter+van+lift+kit+suspension",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "racks",
    label: "Roof Racks & Cargo",
    emoji: "📦",
    description: "Roof racks, cargo baskets, ladder mounts, and external storage",
    notableItems: ["Aluminess", "Owl Vans", "VanEssa", "Thule", "Yakima"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=sprinter+van+roof+rack",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "windows",
    label: "Windows & Vents",
    emoji: "🪟",
    description: "Side windows, roof vents, fans, and skylight additions",
    notableItems: ["Maxxair fan", "Fan-Tastic Vent", "Weathertech", "RV awnings"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=sprinter+van+windows+roof+vent",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "interior",
    label: "Interior & Furniture",
    emoji: "🛋️",
    description: "Tables, seating, storage systems, flooring, and interior finishing",
    notableItems: ["Lagun table mount", "VanEssa modular", "DIY platform builds", "Ikea hack kits"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=van+conversion+interior+furniture",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "refrigerators",
    label: "Fridges & Coolers",
    emoji: "❄️",
    description: "12V compressor fridges, portable freezers, and coolers for van life",
    notableItems: ["Dometic CFX series", "ARB Elements fridge", "BougeRV Polar", "Engel MR040"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=12v+van+life+refrigerator+compressor",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "heaters",
    label: "Heaters",
    emoji: "♨️",
    description: "Diesel and propane heaters for four-season van life",
    notableItems: ["Espar Airtronic", "Webasto Air Top", "Propex HS2000", "Vevor diesel heater"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=van+diesel+heater+espar",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "recovery",
    label: "Recovery Gear",
    emoji: "⛏️",
    description: "Traction boards, hi-lift jacks, kinetic ropes, and recovery tools",
    notableItems: ["MAXTRAX", "Hi-Lift Jack", "ARB kinetic rope", "Warn winch"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=overland+van+recovery+gear",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
  {
    id: "internet",
    label: "Starlink & Internet",
    emoji: "📡",
    description: "Satellite, cellular, and mobile internet solutions for remote van life",
    notableItems: ["Starlink Mini", "weBoost Drive 4G-X", "Pepwave MAX BR1", "hotspot plans"],
    searchUrl: "https://www.starlink.com/",
    badge: "OFFICIAL",
    note: "Links to official Starlink site for current plans and hardware pricing.",
  },
  {
    id: "security",
    label: "Security & Anti-theft",
    emoji: "🔒",
    description: "Alarms, GPS trackers, door locks, and van-specific security hardware",
    notableItems: ["Viper 5906V", "Fortress Security", "van cam locks", "Club Pro"],
    searchUrl: "https://www.ebay.com/sch/i.html?_nkw=sprinter+van+security+system",
    badge: "LIVE_SEARCH",
    note: "Browser-opened eBay search. Automated checks may hit anti-bot protection; open eBay to review current prices, photos, seller notes, condition, and availability.",
  },
];

// ---------------------------------------------------------------------------
// Manufacturer / dealer / builder directory
// ---------------------------------------------------------------------------
export interface ManufacturerEntry {
  id: string;
  name: string;
  url: string;
  badge: VanSourceBadge;
  type: "manufacturer" | "dealer" | "builder" | "upfitter";
  vehicles: string[];
  note: string;
}

export const manufacturerEntries: ManufacturerEntry[] = [
  {
    id: "mercedes-benz-vans",
    name: "Mercedes-Benz Vans",
    url: "https://www.mbvans.com/",
    badge: "OFFICIAL",
    type: "manufacturer",
    vehicles: ["Sprinter 1500", "Sprinter 2500", "Sprinter 3500", "Metris"],
    note: "Official Sprinter manufacturer site. Dealer locator, specs, and MBUX system info.",
  },
  {
    id: "ram-promaster",
    name: "Ram ProMaster",
    url: "https://www.ramtrucks.com/promaster.html",
    badge: "OFFICIAL",
    type: "manufacturer",
    vehicles: ["ProMaster 1500", "ProMaster 2500", "ProMaster 3500"],
    note: "Official Ram ProMaster van page.",
  },
  {
    id: "ford-transit",
    name: "Ford Transit",
    url: "https://www.ford.com/",
    badge: "OFFICIAL",
    type: "manufacturer",
    vehicles: ["Transit 130 WB", "Transit 148 WB", "Transit AWD"],
    note: "Official Ford site. The previous Transit deep link returned 404 in verification; use Ford site search/navigation for current Transit pages.",
  },
  {
    id: "winnebago-revel",
    name: "Winnebago Revel",
    url: "https://www.winnebago.com/",
    badge: "OFFICIAL",
    type: "manufacturer",
    vehicles: ["Revel 44E (Sprinter 4x4 based)"],
    note: "Official Winnebago site. The old Revel deep link returned 404 in verification; use Winnebago site search/navigation for the current Revel product page.",
  },
  {
    id: "sportsmobile",
    name: "Sportsmobile",
    url: "https://www.sportsmobile.com/",
    badge: "OFFICIAL",
    type: "builder",
    vehicles: ["Sprinter", "Transit", "E-Series"],
    note: "Long-running adventure van builder with dealer and service network.",
  },
  {
    id: "ujoint-offroad",
    name: "Ujoint Offroad",
    url: "https://www.ujointoffroad.com/",
    badge: "OFFICIAL",
    type: "upfitter",
    vehicles: ["Sprinter 4x4"],
    note: "Sprinter 4x4 lift kits, suspension, and upfitting.",
  },
];
