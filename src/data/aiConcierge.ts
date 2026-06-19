import {
  verifiedEvents,
  verifiedVideos,
  verifiedVendors,
  marketplaceSources,
  productCategories,
  forumSources,
  mechanicDealerSources,
} from "@/data/vanIntelligence";

export type AiConciergeMode =
  | "home"
  | "trip"
  | "build"
  | "marketplace"
  | "video"
  | "community"
  | "mechanic";

export interface AiQuickAction {
  label: string;
  prompt: string;
}

export interface AiSourceLink {
  label: string;
  href: string;
  type: "event" | "video" | "vendor" | "marketplace" | "forum" | "gear" | "mechanic";
}

export interface AiModeConfig {
  title: string;
  eyebrow: string;
  description: string;
  placeholder: string;
  quickActions: AiQuickAction[];
}

export const aiModeConfig: Record<AiConciergeMode, AiModeConfig> = {
  home: {
    eyebrow: "Vanciety AI",
    title: "Ask anything about vans — Vanciety will point you there",
    description:
      "Use the home-page helper for camping, events, driveway meetups, mechanics, gear, build how-to, marketplace checks, Northwest routes, Southwest desert trips, and which Vanciety section to open first.",
    placeholder: "Example: I need van help this weekend — camping ideas, a mechanic checklist, and a safe way to meet nearby Vanciety members.",
    quickActions: [
      { label: "Find what I need", prompt: "I am new to Vanciety. Help me find the right section for camping, events, van help, build videos, gear, and member meetups." },
      { label: "Plan a weekend", prompt: "Help me plan a 3-day Northwest van weekend with camping, local food, member meetup etiquette, and one van project to research." },
      { label: "Van help", prompt: "I need help with my van. Give me a simple path for finding mechanics, asking good questions, and checking how-to resources on Vanciety." },
      { label: "Meet members", prompt: "Help me safely meet nearby van owners through Vanciety without sharing exact location publicly." },
    ],
  },
  trip: {
    eyebrow: "AI Trip Helper",
    title: "Turn map links into a safer trip plan",
    description:
      "Ask for public-land research, official booking links, meetup ideas, and what to verify before driving out.",
    placeholder: "Example: Build a safe Oregon coast van weekend checklist with public camp research and meetup etiquette.",
    quickActions: [
      { label: "Camping checklist", prompt: "Make a van camping research checklist using official public-land and campground sources." },
      { label: "Meetup safety", prompt: "Give me a safe meetup plan for meeting another van owner in a new town." },
      { label: "Food + camp", prompt: "Help me plan a route around camping, local food, and van-friendly stops." },
    ],
  },
  build: {
    eyebrow: "AI Build Helper",
    title: "Compare upgrades before you buy parts",
    description:
      "Get a research path for power, solar, heaters, tires, racks, audio, recovery gear, and other van upgrades.",
    placeholder: "Example: I want to upgrade power and internet for my van. What should I compare first?",
    quickActions: [
      { label: "Power upgrade", prompt: "Make a comparison checklist for van power upgrades: battery, inverter, solar, alternator charging, and safety questions." },
      { label: "Tires", prompt: "Help me compare all-terrain tire research for a van used in the Northwest." },
      { label: "Audio", prompt: "Give me a simple research path for upgrading van stereo, speakers, and road-noise comfort." },
    ],
  },
  marketplace: {
    eyebrow: "AI Deal Helper",
    title: "Know what to check before opening marketplace links",
    description:
      "Use AI to make a quick buying checklist for vans, parts, tires, heaters, batteries, racks, and accessories.",
    placeholder: "Example: I found a used diesel heater and roof rack. What should I verify before buying?",
    quickActions: [
      { label: "Used part checklist", prompt: "Create a used van part buying checklist: compatibility, condition, scam checks, and questions to ask." },
      { label: "Compare listings", prompt: "What details should I compare across eBay, Facebook Marketplace, VanViewer, and Conversion Trader?" },
      { label: "Avoid scams", prompt: "Give me a quick safety checklist for buying van parts or a converted van from a private seller." },
    ],
  },
  video: {
    eyebrow: "AI Video Guide",
    title: "Find the right build video faster",
    description:
      "Ask for a viewing path by topic: electrical, plumbing, heaters, tires, van tours, off-road mods, storage, or trip tips.",
    placeholder: "Example: Build me a watch list for learning solar, batteries, and Starlink in a van.",
    quickActions: [
      { label: "Electrical playlist", prompt: "Recommend a beginner-friendly watch path for van electrical, solar, batteries, and safety basics." },
      { label: "Tour inspiration", prompt: "Help me pick van tour videos to watch for layout ideas, storage, and Northwest adventure use." },
      { label: "Maintenance", prompt: "What maintenance and repair video topics should a van owner keep handy?" },
    ],
  },
  community: {
    eyebrow: "AI Community Helper",
    title: "Ask better questions and meet safer people",
    description:
      "Draft forum questions, meetup messages, mechanic questions, and build-summary posts before sharing with the community.",
    placeholder: "Example: Draft a polite message asking another member about camping nearby and grabbing food.",
    quickActions: [
      { label: "Forum question", prompt: "Draft a clear forum question about diagnosing a van electrical issue, including what details I should provide." },
      { label: "Meetup message", prompt: "Draft a friendly and safe message to another van owner about meeting for coffee, camping, or van work." },
      { label: "Build post", prompt: "Help me outline a member build post with photos, parts list, lessons learned, and fire-rating categories." },
    ],
  },
  mechanic: {
    eyebrow: "AI Service Helper",
    title: "Prepare before calling a shop or dealer",
    description:
      "Turn symptoms into questions, organize service notes, and compare what a mechanic, dealer, or upfitter should answer.",
    placeholder: "Example: My van has warning lights and a rough idle. What should I ask a mechanic before booking?",
    quickActions: [
      { label: "Mechanic call script", prompt: "Make a short call script for asking a van mechanic about availability, diagnostics, labor rate, and platform experience." },
      { label: "Dealer prep", prompt: "Help me prepare questions for a van dealer service visit." },
      { label: "Upfitter estimate", prompt: "What should I ask an upfitter before getting a quote for electrical, roof rack, suspension, or heater work?" },
    ],
  },
};

const first = <T,>(items: T[], count: number): T[] => items.slice(0, count);

export const aiSourceLinks: AiSourceLink[] = [
  ...first(verifiedEvents, 4).map((event) => ({ label: event.name, href: event.url, type: "event" as const })),
  ...first(verifiedVideos, 4).map((video) => ({ label: video.title, href: `https://www.youtube.com/watch?v=${video.youtubeId}`, type: "video" as const })),
  ...first(verifiedVendors, 4).map((vendor) => ({ label: vendor.name, href: vendor.url, type: "vendor" as const })),
  ...first(marketplaceSources, 4).map((source) => ({ label: source.name, href: source.url, type: "marketplace" as const })),
  ...first(productCategories, 4).map((cat) => ({ label: cat.label, href: cat.searchUrl, type: "gear" as const })),
  ...first(forumSources, 3).map((source) => ({ label: source.name, href: source.url, type: "forum" as const })),
  ...first(mechanicDealerSources, 2).map((source) => ({ label: source.name, href: source.url, type: "mechanic" as const })),
];

export const buildConciergeContext = (mode: AiConciergeMode): string => {
  const eventNames = first(verifiedEvents, 5).map((event) => `${event.name} (${event.location})`).join("; ");
  const videoNames = first(verifiedVideos, 6).map((video) => `${video.title} by ${video.channel}`).join("; ");
  const vendorNames = first(verifiedVendors, 5).map((vendor) => `${vendor.name} — ${vendor.services.join(", ")}`).join("; ");
  const categories = productCategories.map((cat) => cat.label).join(", ");
  return [
    `Mode: ${mode}`,
    `Events: ${eventNames}`,
    `Videos: ${videoNames}`,
    `Vendors: ${vendorNames}`,
    `Gear categories: ${categories}`,
    "Rules: be useful, concise, safety-minded, and tell the visitor to verify prices, dates, fitment, access rules, and bookings on the source links before acting.",
  ].join("\n");
};

export const fallbackSuggestions = (mode: AiConciergeMode, question: string): string[] => {
  const q = question.toLowerCase();
  if (mode === "trip" || q.includes("camp") || q.includes("trip") || q.includes("oregon")) {
    return [
      "Start with the Adventure Map for public-land and campground source links.",
      "Check official event pages before planning around show dates or meetup times.",
      "Use Friend Finder only for approximate areas and move details into one-to-one messages.",
    ];
  }
  if (mode === "build" || q.includes("battery") || q.includes("solar") || q.includes("heater") || q.includes("tire")) {
    return [
      "Open Products & Accessories and compare fitment, warranty, install difficulty, and safety requirements.",
      "Watch the relevant build videos before buying parts so you know the tools and tradeoffs.",
      "Ask vendors or upfitters for written estimates before committing to electrical, suspension, heater, or roof work.",
    ];
  }
  if (mode === "marketplace" || q.includes("buy") || q.includes("sale") || q.includes("listing")) {
    return [
      "Use marketplace links for live inventory, then verify seller identity, fitment, condition, and return options.",
      "For eBay/Facebook links, confirm price and availability on the source because listings change quickly.",
      "Avoid wiring money or sending deposits until the seller, item, and pickup/shipping details are verified.",
    ];
  }
  return [
    "Open Van Intelligence for events, marketplace links, vendors, forums, videos, and gear categories.",
    "Use the AI prompts as a planning guide, then confirm details on the official source links.",
    "For personal safety, keep exact camp or location details out of public posts.",
  ];
};
