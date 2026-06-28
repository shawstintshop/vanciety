/**
 * Makers.tsx — Vanciety Maker Marketplace
 * Etsy-style space for independent van life creators.
 * Small batch, handmade, custom van goods from real people.
 * Design: matte black (#0d0d0d) + gold (#c9a96e) + warm white (#e8dcc8)
 */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Heart, Star, ExternalLink, Package, Hammer,
  Sparkles, ArrowRight, BadgeCheck, ShoppingBag, Filter,
  ChevronRight, Paintbrush, Wrench, Scissors, Layers,
  Cpu, Sofa, Sun, Utensils, Tag,
} from "lucide-react";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// ─── Category definitions ─────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All Makers", icon: Package },
  { id: "Furniture & Storage", label: "Furniture & Storage", icon: Sofa },
  { id: "Electrical & Solar", label: "Electrical & Solar", icon: Cpu },
  { id: "Textiles & Soft Goods", label: "Textiles & Soft Goods", icon: Scissors },
  { id: "Kitchen & Cooking", label: "Kitchen & Cooking", icon: Utensils },
  { id: "Art & Decor", label: "Art & Decor", icon: Paintbrush },
  { id: "Custom Parts", label: "Custom Parts", icon: Wrench },
  { id: "Lighting", label: "Lighting", icon: Sun },
  { id: "Kits & Plans", label: "Kits & Plans", icon: Layers },
];

// ─── Static maker data — real-style independent van life creators ─────────────
const MAKERS = [
  {
    id: "1",
    seller: "VeritasVans",
    handle: "@veritasvans",
    location: "Asheville, NC",
    category: "Furniture & Storage",
    title: "Modular Sprinter Bed Frame Kit",
    description: "Hand-built white oak bed frame system for 144\" Sprinter. Flat-pack ships in 2 boxes. No welding, all hardware included. Fits 3\" memory foam mattress.",
    price_range: "$380–$520",
    shop_url: "https://www.etsy.com/shop/VeritasVans",
    shop_type: "Etsy",
    rating: 4.9,
    sales: 312,
    tags: ["Sprinter", "Bed Frame", "White Oak", "Flat Pack"],
    verified: true,
    featured: true,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: "2",
    seller: "BettyandBabs",
    handle: "@bettyandbabs",
    location: "Portland, OR",
    category: "Textiles & Soft Goods",
    title: "Custom Van Window Curtain Sets",
    description: "Handmade blackout curtain sets for all major van models. Magnetic attachment system, no drilling. Choose from 40+ fabric patterns. Ships in 5–7 days.",
    price_range: "$85–$160",
    shop_url: "https://www.etsy.com/in-en/shop/BettyandBabs",
    shop_type: "Etsy",
    rating: 4.8,
    sales: 876,
    tags: ["Curtains", "Blackout", "Magnetic", "Custom"],
    verified: true,
    featured: true,
    badge: "Top Seller",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  },
  {
    id: "3",
    seller: "Sparky Van Builds",
    handle: "@sparkyvanbuilds",
    location: "Austin, TX",
    category: "Electrical & Solar",
    title: "Pre-Wired 400Ah LiFePO4 Battery Box",
    description: "Fully assembled, tested, and ready-to-install lithium battery system. 400Ah, BMS included, Anderson connectors, bus bars, fuse block. Plug and play.",
    price_range: "$1,100–$1,400",
    shop_url: "https://www.etsy.com/market/van_electrical_kit",
    shop_type: "Etsy",
    rating: 4.9,
    sales: 143,
    tags: ["LiFePO4", "400Ah", "Pre-Wired", "BMS"],
    verified: true,
    featured: false,
    badge: "Handmade",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
  },
  {
    id: "4",
    seller: "The Roaming Kitchen",
    handle: "@roamingkitchen",
    location: "Boulder, CO",
    category: "Kitchen & Cooking",
    title: "Folding Butcher Block Countertop",
    description: "Solid maple folding countertop extension. Mounts to any van wall. Folds flat when not in use. Adds 18\" of prep space. Oiled and food-safe finish.",
    price_range: "$195–$265",
    shop_url: "https://www.etsy.com/market/van_countertop",
    shop_type: "Etsy",
    rating: 4.7,
    sales: 228,
    tags: ["Maple", "Countertop", "Folding", "Food Safe"],
    verified: false,
    featured: false,
    badge: "Handmade",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  },
  {
    id: "5",
    seller: "Desert Pixel Art",
    handle: "@desertpixelart",
    location: "Tucson, AZ",
    category: "Art & Decor",
    title: "Van Life Topographic Map Print",
    description: "Hand-illustrated topo map prints of iconic van life destinations. Printed on 100lb matte cardstock. Sizes: 8x10, 11x14, 16x20. Unframed.",
    price_range: "$18–$45",
    shop_url: "https://www.etsy.com/market/van_life_art_print",
    shop_type: "Etsy",
    rating: 4.8,
    sales: 1204,
    tags: ["Art Print", "Topo Map", "Wall Art", "Van Life"],
    verified: true,
    featured: false,
    badge: "1000+ Sales",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80",
  },
  {
    id: "6",
    seller: "Glow Nomad",
    handle: "@glownomad",
    location: "Flagstaff, AZ",
    category: "Lighting",
    title: "Recessed LED Puck Light Kit (6-pack)",
    description: "Low-profile 12V LED puck lights for van ceilings. Warm white 3000K, dimmable, surface-mount or flush. Includes wiring harness and switch. 6-pack.",
    price_range: "$65–$95",
    shop_url: "https://www.etsy.com/market/van_led_lighting",
    shop_type: "Etsy",
    rating: 4.6,
    sales: 567,
    tags: ["LED", "12V", "Dimmable", "Ceiling Lights"],
    verified: false,
    featured: false,
    badge: "Handmade",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80",
  },
  {
    id: "7",
    seller: "Fab & Weld Co.",
    handle: "@fabweldco",
    location: "Bozeman, MT",
    category: "Custom Parts",
    title: "Sprinter High-Top Roof Vent Surround",
    description: "Laser-cut steel vent surround for Fan-Tastic and Maxxair vents. Powder coated matte black. Includes mounting hardware. Fits 144\" and 170\" Sprinters.",
    price_range: "$120–$155",
    shop_url: "https://www.etsy.com/market/van_custom_parts",
    shop_type: "Etsy",
    rating: 4.9,
    sales: 189,
    tags: ["Steel", "Powder Coated", "Fan-Tastic", "Maxxair"],
    verified: true,
    featured: false,
    badge: "Handmade",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80",
  },
  {
    id: "8",
    seller: "Van Blueprint Studio",
    handle: "@vanblueprintstudio",
    location: "Remote",
    category: "Kits & Plans",
    title: "Complete Sprinter 144 Build Plans PDF",
    description: "Professional CAD-drawn build plans for a 144\" Sprinter conversion. 47 pages, electrical diagrams, cut lists, materials list, step-by-step instructions.",
    price_range: "$35–$75",
    shop_url: "https://www.etsy.com/market/van_build_plans",
    shop_type: "Etsy",
    rating: 4.8,
    sales: 2341,
    tags: ["PDF Plans", "CAD", "Sprinter 144", "DIY"],
    verified: true,
    featured: true,
    badge: "Digital Download",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
  },
  {
    id: "9",
    seller: "Woven Roads",
    handle: "@wovenroads",
    location: "Santa Fe, NM",
    category: "Textiles & Soft Goods",
    title: "Handwoven Van Hammock",
    description: "Hand-knotted macramé hammock sized for van interiors. Mounts to D-rings or ceiling anchors. Natural cotton rope, holds 300 lbs. Ships in 2 weeks.",
    price_range: "$95–$140",
    shop_url: "https://www.etsy.com/market/van_hammock",
    shop_type: "Etsy",
    rating: 4.7,
    sales: 445,
    tags: ["Macramé", "Hammock", "Handmade", "Cotton"],
    verified: false,
    featured: false,
    badge: "Handmade",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    id: "10",
    seller: "Stealth Panels",
    handle: "@stealthpanels",
    location: "Denver, CO",
    category: "Furniture & Storage",
    title: "Transit High Roof Wall Panel Kit",
    description: "Pre-cut birch plywood wall panel kit for Ford Transit 148\" High Roof. Includes all panels, trim pieces, and installation guide. No measuring required.",
    price_range: "$280–$360",
    shop_url: "https://www.etsy.com/market/van_wall_panels",
    shop_type: "Etsy",
    rating: 4.6,
    sales: 334,
    tags: ["Transit", "Wall Panels", "Birch Plywood", "Pre-Cut"],
    verified: true,
    featured: false,
    badge: "Handmade",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: "11",
    seller: "Solar Shed Builds",
    handle: "@solarshedbuilds",
    location: "Bend, OR",
    category: "Electrical & Solar",
    title: "DIY Solar Wiring Harness Kit",
    description: "Pre-made solar wiring harness for 2–4 panel systems. Includes MC4 connectors, fused leads, labeled wires. Sized for 200–600W systems. Ships same day.",
    price_range: "$45–$85",
    shop_url: "https://www.etsy.com/market/solar_wiring_harness",
    shop_type: "Etsy",
    rating: 4.8,
    sales: 678,
    tags: ["Solar", "Wiring Harness", "MC4", "DIY"],
    verified: false,
    featured: false,
    badge: "Handmade",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
  },
  {
    id: "12",
    seller: "Camp Kitchen Co.",
    handle: "@campkitchenco",
    location: "Missoula, MT",
    category: "Kitchen & Cooking",
    title: "Magnetic Spice Rack for Van Walls",
    description: "Laser-cut steel magnetic spice rack. Holds 12 standard spice jars. Mounts to any metal surface. Powder coated matte black. Includes 12 magnetic jars.",
    price_range: "$55–$75",
    shop_url: "https://www.etsy.com/market/van_spice_rack",
    shop_type: "Etsy",
    rating: 4.9,
    sales: 892,
    tags: ["Magnetic", "Spice Rack", "Steel", "Matte Black"],
    verified: true,
    featured: false,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  },
];

// ─── Badge color map ──────────────────────────────────────────────────────────
const BADGE_STYLE: Record<string, string> = {
  "Bestseller": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Top Seller": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "1000+ Sales": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Digital Download": "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "Handmade": "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

// ─── Component ────────────────────────────────────────────────────────────────
const Makers = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return MAKERS.filter((m) => {
      const matchesCat = category === "all" || m.category === category;
      const matchesQ = !q || [m.seller, m.title, m.description, m.location, ...m.tags].join(" ").toLowerCase().includes(q);
      return matchesCat && matchesQ;
    }).sort((a, b) => Number(b.featured) - Number(a.featured) || b.sales - a.sales);
  }, [query, category]);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="vanciety-page min-h-screen bg-background">
      <Header />
      <main className="pt-16 sm:pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-[#0d0d0d]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,169,110,0.08)_0%,_transparent_60%)]" />
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/10 px-4 py-1.5">
                <Hammer className="h-3.5 w-3.5 text-[#c9a96e]" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a96e]">Maker Marketplace</span>
              </div>
              <h1 className="mb-4 text-4xl font-black leading-tight text-[#e8dcc8] md:text-5xl lg:text-6xl">
                Built by Real People.<br />
                <span className="text-[#c9a96e]">For Van Life.</span>
              </h1>
              <p className="mb-8 max-w-xl text-lg text-muted-foreground">
                Independent makers, small shops, and passionate builders selling handmade van goods. No big brands — just real people making cool things.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search makers, products, materials…"
                    className="h-12 pl-10 text-base bg-card/60 border-border/60"
                  />
                </div>
                <a
                  href="https://etsy.com/sell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c9a96e] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#0d0d0d] transition-colors hover:bg-[#d4b87a]"
                >
                  <ShoppingBag className="h-4 w-4" /> Sell Your Creations
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="border-b border-border bg-card/40">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-8 overflow-x-auto py-4 scrollbar-none">
              {[
                { label: "Active Makers", value: "240+" },
                { label: "Products Listed", value: "1,800+" },
                { label: "Van Models Covered", value: "12" },
                { label: "Avg. Rating", value: "4.8★" },
              ].map((s) => (
                <div key={s.label} className="shrink-0 text-center">
                  <div className="text-xl font-black text-[#c9a96e]">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
              <div className="ml-auto shrink-0 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-[#c9a96e]" />
                New listings added daily
              </div>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="border-b border-border bg-background/80 sticky top-16 z-30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-none">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      category === c.id
                        ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e]"
                        : "border-border/60 bg-card/60 text-muted-foreground hover:border-[#c9a96e]/40 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product grid */}
        <section className="container mx-auto px-4 py-10">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {results.length} listing{results.length === 1 ? "" : "s"}
              {category !== "all" && ` in ${category}`}
            </p>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Filter className="h-4 w-4" /> Sort & Filter
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition-all hover:border-[#c9a96e]/40 hover:shadow-xl hover:shadow-black/30"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Like button */}
                  <button
                    onClick={() => toggleLike(item.id)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70"
                    aria-label="Save"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${liked.has(item.id) ? "fill-rose-500 text-rose-500" : "text-white"}`}
                    />
                  </button>
                  {/* Badge */}
                  <div className="absolute left-3 top-3">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${BADGE_STYLE[item.badge] || "bg-muted/50 text-muted-foreground border-border/40"}`}>
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1 flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#c9a96e]">{item.seller}</span>
                    {item.verified && <BadgeCheck className="h-3.5 w-3.5 text-[#c9a96e]" />}
                    <span className="ml-auto text-xs text-muted-foreground">{item.location}</span>
                  </div>
                  <h3 className="mb-1.5 font-bold leading-snug text-foreground">{item.title}</h3>
                  <p className="mb-3 flex-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>

                  {/* Tags */}
                  <div className="mb-3 flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((t) => (
                      <span key={t} className="flex items-center gap-0.5 rounded-full bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                        <Tag className="h-2.5 w-2.5" /> {t}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border/40 pt-3">
                    <div>
                      <div className="text-base font-black text-[#c9a96e]">{item.price_range}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-[#c9a96e] text-[#c9a96e]" />
                        {item.rating} · {item.sales.toLocaleString()} sales
                      </div>
                    </div>
                    <a
                      href={item.shop_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 px-3 py-1.5 text-xs font-bold text-[#c9a96e] transition-colors hover:bg-[#c9a96e]/20"
                    >
                      Shop <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="py-20 text-center">
              <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-40" />
              <p className="text-muted-foreground">No listings match your search.</p>
            </div>
          )}
        </section>

        {/* Become a maker CTA */}
        <section className="border-t border-border bg-card/40 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/10 px-4 py-1.5">
                <Hammer className="h-3.5 w-3.5 text-[#c9a96e]" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a96e]">Sell on Vanciety</span>
              </div>
              <h2 className="mb-3 text-3xl font-black text-foreground">You make it. We'll help you sell it.</h2>
              <p className="mb-8 text-muted-foreground">
                Whether you're selling on Etsy, your own site, or just starting out — list your van life products here and get in front of thousands of builders and travelers.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/vendor-signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a96e] px-8 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#0d0d0d] transition-colors hover:bg-[#d4b87a]"
                >
                  List Your Products <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/directory"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 px-8 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-[#c9a96e]/40 hover:text-foreground"
                >
                  Browse Full Directory <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Makers;
