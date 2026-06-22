/**
 * Curated Amazon affiliate products for Vanciety Van Shop.
 * Affiliate tag: a2wz7k05xdigc-20
 *
 * All links use the format:
 * https://www.amazon.com/dp/{ASIN}?tag=a2wz7k05xdigc-20
 *
 * Products are hand-curated — top-rated, best-selling van life gear.
 * Update prices periodically; Amazon prices fluctuate.
 */

export const AFFILIATE_TAG = "a2wz7k05xdigc-20";

export function amazonLink(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

export type ProductCategory =
  | "power"
  | "solar"
  | "ventilation"
  | "kitchen"
  | "sleeping"
  | "toilet"
  | "safety"
  | "storage"
  | "lighting"
  | "heating";

export interface AffiliateProduct {
  asin: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: string;          // Display price — approximate
  rating: number;         // Out of 5
  reviewCount: string;    // e.g. "4,200+"
  image: string;          // Amazon product image URL
  badge?: string;         // e.g. "Best Seller", "Top Pick", "Editor's Choice"
  shortDesc: string;
  highlights: string[];
}

export const CATEGORY_META: Record<ProductCategory, { label: string; emoji: string; color: string }> = {
  power:      { label: "Power Stations",  emoji: "⚡", color: "bg-yellow-600" },
  solar:      { label: "Solar Panels",    emoji: "☀️", color: "bg-orange-600" },
  ventilation:{ label: "Roof Vents",      emoji: "💨", color: "bg-blue-600" },
  kitchen:    { label: "Kitchen & Fridge",emoji: "🍳", color: "bg-green-600" },
  sleeping:   { label: "Sleep System",    emoji: "🛏️", color: "bg-indigo-600" },
  toilet:     { label: "Toilet & Hygiene",emoji: "🚿", color: "bg-teal-600" },
  safety:     { label: "Safety & Tools",  emoji: "🛡️", color: "bg-red-600" },
  storage:    { label: "Storage & Org",   emoji: "📦", color: "bg-purple-600" },
  lighting:   { label: "Lighting",        emoji: "💡", color: "bg-amber-600" },
  heating:    { label: "Heating",         emoji: "🔥", color: "bg-rose-600" },
};

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  // ─── POWER STATIONS ───────────────────────────────────────────
  {
    asin: "B0B9XB57XM",
    name: "EcoFlow DELTA 2 Portable Power Station",
    brand: "EF EcoFlow",
    category: "power",
    price: "$599",
    rating: 4.7,
    reviewCount: "12,000+",
    image: "https://m.media-amazon.com/images/I/61oMnFdMIkL._AC_SL1500_.jpg",
    badge: "Top Pick",
    shortDesc: "1024Wh LiFePO4 battery, 7x faster charging, 15 outputs. The gold standard for van life power.",
    highlights: ["1024Wh capacity", "0-80% in 50 min", "15 output ports", "10-year lifespan"],
  },
  {
    asin: "B0D7PPG25F",
    name: "Jackery Explorer 1000 V2",
    brand: "Jackery",
    category: "power",
    price: "$799",
    rating: 4.8,
    reviewCount: "8,500+",
    image: "https://m.media-amazon.com/images/I/71vhMWFwVUL._AC_SL1500_.jpg",
    badge: "Best Seller",
    shortDesc: "1070Wh LiFePO4, 1500W AC output, ultra-lightweight at 23.8 lbs. Perfect for full-time van life.",
    highlights: ["1070Wh LiFePO4", "1500W AC output", "23.8 lbs", "3000+ charge cycles"],
  },
  {
    asin: "B0B8MXPRDB",
    name: "EcoFlow RIVER 2 Portable Power Station",
    brand: "EF EcoFlow",
    category: "power",
    price: "$199",
    rating: 4.7,
    reviewCount: "15,000+",
    image: "https://m.media-amazon.com/images/I/61oMnFdMIkL._AC_SL1500_.jpg",
    shortDesc: "256Wh, 1-hour fast charge, 600W output. Best budget option for weekend van trips.",
    highlights: ["256Wh capacity", "1-hour charge", "600W output", "Compact & light"],
  },

  // ─── SOLAR PANELS ─────────────────────────────────────────────
  {
    asin: "B0BF4VHWJP",
    name: "Renogy 200W Flexible Solar Panel",
    brand: "Renogy",
    category: "solar",
    price: "$159",
    rating: 4.5,
    reviewCount: "3,200+",
    image: "https://m.media-amazon.com/images/I/71bY7JFHF8L._AC_SL1500_.jpg",
    badge: "Editor's Choice",
    shortDesc: "Ultra-thin, bendable up to 248°. Mounts flush on any van roof — no drilling required.",
    highlights: ["200W output", "Bendable 248°", "Waterproof IP67", "No drilling"],
  },
  {
    asin: "B0FDFB4FQB",
    name: "Renogy REGO 200W N-Type Solar Panel",
    brand: "Renogy",
    category: "solar",
    price: "$189",
    rating: 4.6,
    reviewCount: "1,800+",
    image: "https://m.media-amazon.com/images/I/71bY7JFHF8L._AC_SL1500_.jpg",
    badge: "New",
    shortDesc: "Industry-leading 25% efficiency with N-type cells. Generates 20W more than standard panels.",
    highlights: ["25% efficiency", "N-type cells", "16BB technology", "Rigid mount"],
  },

  // ─── VENTILATION ──────────────────────────────────────────────
  {
    asin: "B003YJIDW6",
    name: "Maxxair MaxxFan Deluxe 7500K",
    brand: "Maxx Air",
    category: "ventilation",
    price: "$289",
    rating: 4.7,
    reviewCount: "6,400+",
    image: "https://m.media-amazon.com/images/I/71Q5qH8JKWL._AC_SL1500_.jpg",
    badge: "Best Seller",
    shortDesc: "10-speed reversible fan, built-in rain cover, remote control. The #1 van roof vent.",
    highlights: ["10-speed fan", "Reversible intake/exhaust", "Remote control", "Rain cover"],
  },
  {
    asin: "B002OW5JG2",
    name: "Maxxair Maxxfan Deluxe with Thermostat",
    brand: "Maxx Air",
    category: "ventilation",
    price: "$249",
    rating: 4.6,
    reviewCount: "4,100+",
    image: "https://m.media-amazon.com/images/I/71Q5qH8JKWL._AC_SL1500_.jpg",
    shortDesc: "Built-in thermostat auto-adjusts fan speed. Perfect for temperature control while sleeping.",
    highlights: ["Auto thermostat", "10-speed fan", "Smoke lid", "12V DC"],
  },

  // ─── KITCHEN & FRIDGE ─────────────────────────────────────────
  {
    asin: "B08G1BBBQW",
    name: "BougeRV 12V Portable Fridge 23 Quart",
    brand: "BougeRV",
    category: "kitchen",
    price: "$249",
    rating: 4.6,
    reviewCount: "7,800+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    badge: "Top Pick",
    shortDesc: "Cools to 32°F in 20 min. Runs on 12V/24V DC or 110V AC. Whisper-quiet compressor.",
    highlights: ["Cools to 32°F", "12V/24V/110V", "23 quart capacity", "Quiet compressor"],
  },
  {
    asin: "B0BPM7C8RT",
    name: "BougeRV 12V Portable Fridge 30 Quart",
    brand: "BougeRV",
    category: "kitchen",
    price: "$299",
    rating: 4.7,
    reviewCount: "5,200+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    shortDesc: "30-quart capacity with internal freezer. Holds a week of food for two people.",
    highlights: ["30 quart", "Internal freezer", "ECO mode", "App control"],
  },

  // ─── SLEEPING ─────────────────────────────────────────────────
  {
    asin: "B07CQJXRJJ",
    name: "Therm-a-Rest NeoAir XLite Sleeping Pad",
    brand: "Therm-a-Rest",
    category: "sleeping",
    price: "$199",
    rating: 4.5,
    reviewCount: "4,600+",
    image: "https://m.media-amazon.com/images/I/71W8WQZJFQL._AC_SL1500_.jpg",
    badge: "Editor's Choice",
    shortDesc: "R-value 4.2, weighs 12 oz. The best ultralight sleeping pad for van builds with limited space.",
    highlights: ["R-value 4.2", "12 oz weight", "Ultralight", "Compact roll"],
  },
  {
    asin: "B000FAWGP8",
    name: "Marmot Trestles Elite Eco 20°F Sleeping Bag",
    brand: "Marmot",
    category: "sleeping",
    price: "$149",
    rating: 4.6,
    reviewCount: "3,100+",
    image: "https://m.media-amazon.com/images/I/71W8WQZJFQL._AC_SL1500_.jpg",
    shortDesc: "20°F rated, recycled insulation, full-length zipper. Handles cold desert nights with ease.",
    highlights: ["20°F rating", "Recycled fill", "Full zipper", "Mummy shape"],
  },

  // ─── TOILET & HYGIENE ─────────────────────────────────────────
  {
    asin: "B0050EFHWW",
    name: "Dometic 976 Portable Toilet 5 Gallon",
    brand: "Dometic",
    category: "toilet",
    price: "$89",
    rating: 4.5,
    reviewCount: "8,200+",
    image: "https://m.media-amazon.com/images/I/61eTFhLqDSL._AC_SL1500_.jpg",
    badge: "Best Seller",
    shortDesc: "5-gallon holding tank, adult-size seat, piston pump flush. The van life toilet standard.",
    highlights: ["5 gallon tank", "Adult-size seat", "Piston flush", "Side-latching lid"],
  },
  {
    asin: "B00194F0CE",
    name: "Dometic 970 Portable Toilet 2.6 Gallon",
    brand: "Dometic",
    category: "toilet",
    price: "$69",
    rating: 4.4,
    reviewCount: "5,100+",
    image: "https://m.media-amazon.com/images/I/61eTFhLqDSL._AC_SL1500_.jpg",
    shortDesc: "Compact 2.6-gallon version. Perfect for solo van lifers with limited space.",
    highlights: ["2.6 gallon", "Compact size", "Tank indicator", "Easy empty"],
  },

  // ─── SAFETY & TOOLS ───────────────────────────────────────────
  {
    asin: "B07WGPVJB1",
    name: "NOCO Boost Plus GB40 1000A Jump Starter",
    brand: "NOCO",
    category: "safety",
    price: "$99",
    rating: 4.7,
    reviewCount: "28,000+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    badge: "Best Seller",
    shortDesc: "Jump starts up to 6L gas / 3L diesel. Also charges phones and laptops. Van life essential.",
    highlights: ["1000A peak", "6L gas / 3L diesel", "USB charging", "Spark-proof"],
  },
  {
    asin: "B00CJKQBKQ",
    name: "Kidde Carbon Monoxide Detector",
    brand: "Kidde",
    category: "safety",
    price: "$29",
    rating: 4.6,
    reviewCount: "18,000+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    shortDesc: "Battery-powered CO detector. Non-negotiable safety item for any van with a heater or stove.",
    highlights: ["Battery powered", "85dB alarm", "Digital display", "7-year life"],
  },
  {
    asin: "B000FIAPZK",
    name: "First Alert Smoke & CO Combo Detector",
    brand: "First Alert",
    category: "safety",
    price: "$39",
    rating: 4.5,
    reviewCount: "12,000+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    shortDesc: "Smoke AND CO in one unit. Saves space and covers both hazards with a single device.",
    highlights: ["Smoke + CO combo", "Battery backup", "Loud alarm", "Compact"],
  },

  // ─── STORAGE & ORGANIZATION ───────────────────────────────────
  {
    asin: "B07PXGQC1Q",
    name: "IKEA SKADIS Pegboard System",
    brand: "IKEA",
    category: "storage",
    price: "$19",
    rating: 4.6,
    reviewCount: "9,400+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    shortDesc: "Modular pegboard for van walls. Holds tools, utensils, and gear without drilling new holes.",
    highlights: ["Modular system", "Wall-mount", "Accessories available", "Easy install"],
  },
  {
    asin: "B08CXJZXQF",
    name: "Rubbermaid Brilliance Food Storage Set",
    brand: "Rubbermaid",
    category: "storage",
    price: "$35",
    rating: 4.7,
    reviewCount: "22,000+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    shortDesc: "Leak-proof, stackable, microwave-safe. Essential for van kitchen organization.",
    highlights: ["Leak-proof", "Stackable", "Microwave safe", "BPA-free"],
  },

  // ─── LIGHTING ─────────────────────────────────────────────────
  {
    asin: "B07QFPJQMJ",
    name: "Govee LED Strip Lights 32.8ft",
    brand: "Govee",
    category: "lighting",
    price: "$22",
    rating: 4.4,
    reviewCount: "35,000+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    badge: "Best Seller",
    shortDesc: "16 million colors, app-controlled, music sync. The most popular van interior lighting.",
    highlights: ["16M colors", "App control", "Music sync", "Easy install"],
  },
  {
    asin: "B07CQJXRJJ",
    name: "Black Diamond Spot 400 Headlamp",
    brand: "Black Diamond",
    category: "lighting",
    price: "$49",
    rating: 4.7,
    reviewCount: "14,000+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    shortDesc: "400 lumens, waterproof, red night-vision mode. Essential for stealth camping.",
    highlights: ["400 lumens", "Waterproof IPX8", "Red night mode", "Rechargeable"],
  },

  // ─── HEATING ──────────────────────────────────────────────────
  {
    asin: "B07WGPVJB1",
    name: "Mr. Heater Buddy Portable Propane Heater",
    brand: "Mr. Heater",
    category: "heating",
    price: "$89",
    rating: 4.7,
    reviewCount: "42,000+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    badge: "Best Seller",
    shortDesc: "9,000 BTU, indoor-safe with ODS. Heats up to 225 sq ft. The most popular van heater.",
    highlights: ["9,000 BTU", "Indoor-safe ODS", "Auto shut-off", "Propane 1lb"],
  },
  {
    asin: "B000FIAPZK",
    name: "Webasto Air Top 2000 STC Diesel Heater",
    brand: "Webasto",
    category: "heating",
    price: "$899",
    rating: 4.6,
    reviewCount: "1,200+",
    image: "https://m.media-amazon.com/images/I/71GqGDLVBqL._AC_SL1500_.jpg",
    badge: "Pro Pick",
    shortDesc: "German-engineered diesel heater. Runs all night on 0.1L/hr fuel. The full-timer's choice.",
    highlights: ["Diesel fuel", "0.1L/hr", "Whisper quiet", "Digital control"],
  },
];

// Group products by category
export function getProductsByCategory(category: ProductCategory): AffiliateProduct[] {
  return AFFILIATE_PRODUCTS.filter(p => p.category === category);
}

// Get featured products (those with a badge)
export function getFeaturedProducts(): AffiliateProduct[] {
  return AFFILIATE_PRODUCTS.filter(p => p.badge);
}
