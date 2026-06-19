import {
  BadgeCheck,
  BedDouble,
  Camera,
  Car,
  Compass,
  Dog,
  Flame,
  Map,
  Mountain,
  PlugZap,
  Shirt,
  ShoppingBag,
  Sparkles,
  TentTree,
  ThermometerSun,
  Utensils,
  Wrench,
} from "lucide-react";

export type StorefrontCategory = {
  id: string;
  title: string;
  description: string;
  icon: typeof Shirt;
  collectionType: "print_on_demand" | "affiliate" | "digital";
};

export type DesignDrop = {
  id: string;
  name: string;
  theme: string;
  products: string[];
  palette: string;
  prompt: string;
  artDirection: string;
  tags: string[];
};

export type AffiliateCollection = {
  id: string;
  title: string;
  buyerIntent: string;
  categories: string[];
  affiliateSlot: string;
  status: "needs_affiliate_id" | "ready_for_links";
  note: string;
};

export type StorefrontVideo = {
  id: string;
  title: string;
  use: string;
  videoSlot: string;
};

export const storefrontCategories: StorefrontCategory[] = [
  {
    id: "shirts-hoodies",
    title: "Topo shirts & hoodies",
    description: "Premium vanlife shirts, heavyweight hoodies, event drops, and limited regional artwork.",
    icon: Shirt,
    collectionType: "print_on_demand",
  },
  {
    id: "stickers-patches",
    title: "Stickers, patches & decals",
    description: "Sprinter silhouettes, topo badges, trail stickers, campground patches, and van-window decals.",
    icon: BadgeCheck,
    collectionType: "print_on_demand",
  },
  {
    id: "camp-kitchen",
    title: "Camp kitchen gear",
    description: "Cook kits, mugs, recovery snacks, utensils, compact storage, and road meal accessories.",
    icon: Utensils,
    collectionType: "affiliate",
  },
  {
    id: "electrical-power",
    title: "Power, solar & charging",
    description: "Victron-style electrical research, battery accessories, chargers, monitors, fuses, and cable management.",
    icon: PlugZap,
    collectionType: "affiliate",
  },
  {
    id: "sleep-comfort",
    title: "Sleep & comfort",
    description: "Bedding, blackout, fans, heaters, insulation helpers, bug screens, and dog-friendly comfort gear.",
    icon: BedDouble,
    collectionType: "affiliate",
  },
  {
    id: "navigation-safety",
    title: "Navigation & safety",
    description: "Offline maps, recovery gear, first-aid, comms, lighting, weather, and campsite safety tools.",
    icon: Compass,
    collectionType: "affiliate",
  },
  {
    id: "van-dogs",
    title: "Van dogs",
    description: "Dog bed systems, leashes, bowls, cooling, muddy-paw cleanup, and pet-safe camp setup.",
    icon: Dog,
    collectionType: "affiliate",
  },
  {
    id: "digital-guides",
    title: "Digital guides",
    description: "Checklists, packing systems, campsite planners, build worksheets, and Oregon event packs.",
    icon: Map,
    collectionType: "digital",
  },
];

export const designDrops: DesignDrop[] = [
  {
    id: "cascade-topo-runner",
    name: "Cascade Topo Runner",
    theme: "PNW mountain contour lines over a clean 144 Sprinter side profile.",
    products: ["heavy tee", "hoodie", "sticker sheet", "embroidered patch"],
    palette: "evergreen / sand / bone / bronze",
    prompt:
      "Premium vector shirt graphic: Mercedes Sprinter 144 camper van silhouette, Pacific Northwest topo contour lines, subtle pine ridge, minimal badge layout, no fake brand logos, screen print ready, evergreen sand bone bronze palette.",
    artDirection: "Clean enough for BMW/Patagonia-level merch. No cartoon van. No AI clutter.",
    tags: ["Sprinter", "Topo", "PNW", "Event drop"],
  },
  {
    id: "desert-camp-signal",
    name: "Desert Camp Signal",
    theme: "Warm desert camp scene with antenna signal arcs, recovery boards, and campfire geometry.",
    products: ["sun hoodie", "camp mug", "hat", "window decal"],
    palette: "charcoal / clay / sand / sunset orange",
    prompt:
      "Sophisticated vanlife merch design: desert campsite, camper van silhouette, subtle signal arcs, campfire icon, topo ridge line, clay charcoal sand orange palette, premium outdoor brand style, print-ready vector.",
    artDirection: "Feels like a real overland brand capsule, not tourist gift-shop art.",
    tags: ["Desert", "Camp", "Overland", "Signal"],
  },
  {
    id: "van-dog-co-pilot",
    name: "Van Dog Co-Pilot",
    theme: "Dog passenger badge for van owners who travel with a co-pilot.",
    products: ["tee", "dog bandana", "sticker", "patch"],
    palette: "black / cream / alpine blue / amber",
    prompt:
      "Premium badge logo for camper van dog co-pilot: dog profile in passenger window, Sprinter van line art, alpine blue amber accent, circular patch layout, clean vector, embroidered patch ready.",
    artDirection: "Friendly but not cute-cheap. Outdoor gear badge quality.",
    tags: ["Dogs", "Patch", "Family", "Gift"],
  },
  {
    id: "oregon-rally-field-kit",
    name: "Oregon Rally Field Kit",
    theme: "Event-weekend capsule for Oregon van meets: rain, forest, coffee, camp, repair.",
    products: ["event tee", "weatherproof sticker", "camp tote", "field checklist PDF"],
    palette: "rain navy / moss / fog / copper",
    prompt:
      "Oregon camper van event merch design: rain forest topo map, Sprinter van parked near pines, coffee mug, wrench, camp marker pins, premium rally badge, rain navy moss fog copper palette, vector screenprint.",
    artDirection: "Limited drop energy. Useful for event launch and member identity.",
    tags: ["Oregon", "Event", "Limited drop", "Field kit"],
  },
];

export const affiliateCollections: AffiliateCollection[] = [
  {
    id: "electrical-core",
    title: "Electrical core kit",
    buyerIntent: "Owners researching batteries, fuses, charging, monitoring, and safer 12V upgrades.",
    categories: ["battery monitors", "DC-DC chargers", "solar controllers", "fuses", "wire tools"],
    affiliateSlot: "VANCIETY_AFFILIATE_ELECTRICAL",
    status: "needs_affiliate_id",
    note: "Use reputable vendors only. Avoid gray-market power gear.",
  },
  {
    id: "camp-comfort",
    title: "Camp comfort kit",
    buyerIntent: "People getting ready for a weekend trip who need immediate useful gear.",
    categories: ["chairs", "awnings", "blankets", "bug screens", "portable fans"],
    affiliateSlot: "VANCIETY_AFFILIATE_CAMP",
    status: "needs_affiliate_id",
    note: "Best fit for broad outdoor affiliate networks and direct vendor programs.",
  },
  {
    id: "recovery-safety",
    title: "Recovery & safety kit",
    buyerIntent: "Owners heading off pavement who need trustworthy basics before getting stuck.",
    categories: ["recovery boards", "air compressors", "first-aid", "comms", "lights"],
    affiliateSlot: "VANCIETY_AFFILIATE_RECOVERY",
    status: "needs_affiliate_id",
    note: "Clearly separate proven safety gear from cosmetic accessories.",
  },
  {
    id: "storage-build",
    title: "Storage & build kit",
    buyerIntent: "DIY owners organizing tools, clothes, food, bikes, dogs, and repair gear.",
    categories: ["molle panels", "bins", "roof storage", "bike mounts", "tool rolls"],
    affiliateSlot: "VANCIETY_AFFILIATE_STORAGE",
    status: "needs_affiliate_id",
    note: "Good category for vendor partnerships and member review videos.",
  },
];

export const storefrontVideos: StorefrontVideo[] = [
  {
    id: "drop-preview",
    title: "Design drop preview",
    use: "Short video showing the shirt, hoodie, sticker, patch, and van-window decal as one capsule.",
    videoSlot: "VANCIETY_VIDEO_DROP_PREVIEW",
  },
  {
    id: "gear-buyers-guide",
    title: "Gear buyer guide",
    use: "Affiliate product video: what to buy first for a weekend van trip without wasting money.",
    videoSlot: "VANCIETY_VIDEO_GEAR_GUIDE",
  },
  {
    id: "ai-design-lab",
    title: "AI design lab",
    use: "Member-facing demo: generate a van shirt idea, refine prompt, choose product types, send to print queue.",
    videoSlot: "VANCIETY_VIDEO_AI_DESIGN_LAB",
  },
];

export const storefrontStats = [
  { label: "Launch collections", value: designDrops.length.toString(), detail: "POD design drops ready for provider connection." },
  { label: "Shop categories", value: storefrontCategories.length.toString(), detail: "Merch, gear, digital guides, and affiliate lanes." },
  { label: "Affiliate slots", value: affiliateCollections.length.toString(), detail: "Structured placeholders awaiting verified IDs." },
];

export const storefrontIcons = {
  Car,
  Camera,
  Flame,
  Mountain,
  ShoppingBag,
  Sparkles,
  TentTree,
  ThermometerSun,
  Wrench,
};
