/**
 * VancietyMerch — Official Vanciety Merch Store
 * Aesthetic: Matte black everything, gold/tan badge logo, rugged overland brand
 * Colors: #1a1a1a background, #c9a96e gold accent, #2a2a2a card bg
 * Tagline: Community · Gear · Connect · Knowledge
 * "Build Experiences Not Things"
 */

import { useState } from "react";
import { ShoppingBag, Star, Tag, Package, Shirt, Coffee, Backpack, Zap, Shield, ChevronRight, BadgeCheck, Truck, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ─── Brand colors ──────────────────────────────────────────────────────────────
const GOLD = "#c9a96e";
const GOLD_LIGHT = "#e2c896";

// ─── Product catalog ───────────────────────────────────────────────────────────
type MerchCategory =
  | "all"
  | "clothing"
  | "headwear"
  | "drinkware"
  | "bags"
  | "accessories"
  | "patches"
  | "camping";

interface MerchProduct {
  id: string;
  name: string;
  tagline: string;
  price: string;
  category: Exclude<MerchCategory, "all">;
  badge?: string;
  colors: string[];
  description: string;
  image: string; // Unsplash placeholder — replace with real product photos
  featured?: boolean;
  new?: boolean;
  soldOut?: boolean;
}

const PRODUCTS: MerchProduct[] = [
  // ── Clothing ──────────────────────────────────────────────────────────────
  {
    id: "badge-tee-black",
    name: "Vanciety Badge Tee",
    tagline: "Build Experiences Not Things",
    price: "$34",
    category: "clothing",
    badge: "BESTSELLER",
    colors: ["Black", "Olive"],
    description: "Heavy 6oz cotton tee with the full Vanciety badge logo. Garment-dyed matte black. Oversized fit.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    featured: true,
  },
  {
    id: "badge-hoodie-black",
    name: "Vanciety Pullover Hoodie",
    tagline: "Community · Gear · Connect · Knowledge",
    price: "$68",
    category: "clothing",
    badge: "NEW DROP",
    colors: ["Black"],
    description: "12oz fleece hoodie with embroidered badge on chest and sleeve text. Heavyweight and warm.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    featured: true,
    new: true,
  },
  {
    id: "road-jacket",
    name: "Overland Zip Jacket",
    tagline: "Built for the road",
    price: "$89",
    category: "clothing",
    colors: ["Black", "Charcoal"],
    description: "Lightweight zip-up with Vanciety badge embroidered on left chest. Wind-resistant shell.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  },
  {
    id: "camp-tee-olive",
    name: "Camp Tee — Olive",
    tagline: "Van life never looked this good",
    price: "$32",
    category: "clothing",
    colors: ["Olive", "Desert Tan"],
    description: "Soft-washed tee in military olive with tonal Vanciety badge print. Relaxed fit.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
  },
  {
    id: "long-sleeve-tee",
    name: "Long Sleeve Badge Tee",
    tagline: "For the cold mornings",
    price: "$42",
    category: "clothing",
    colors: ["Black"],
    description: "Long sleeve tee with full badge on chest and 'VANCIETY.COM' along the sleeve.",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
  },
  // ── Headwear ──────────────────────────────────────────────────────────────
  {
    id: "trucker-hat-black-tan",
    name: "Vanciety Trucker Hat",
    tagline: "Black front, tan mesh",
    price: "$36",
    category: "headwear",
    badge: "BESTSELLER",
    colors: ["Black/Tan", "All Black"],
    description: "Structured trucker with embroidered Vanciety badge. Snapback. Foam front, mesh back.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    featured: true,
  },
  {
    id: "dad-hat-black",
    name: "Dad Hat — Black",
    tagline: "Low profile, high standards",
    price: "$32",
    category: "headwear",
    colors: ["Black", "Olive"],
    description: "Unstructured 6-panel dad hat with embroidered badge. Adjustable brass buckle.",
    image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&q=80",
  },
  {
    id: "beanie-black",
    name: "Vanciety Beanie",
    tagline: "For the cold nights",
    price: "$28",
    category: "headwear",
    colors: ["Black", "Charcoal"],
    description: "Ribbed knit beanie with woven Vanciety patch on cuff. One size fits all.",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
  },
  // ── Drinkware ─────────────────────────────────────────────────────────────
  {
    id: "tumbler-20oz",
    name: "Matte Black Tumbler 20oz",
    tagline: "Coffee at 6am. Anywhere.",
    price: "$42",
    category: "drinkware",
    badge: "NEW DROP",
    colors: ["Matte Black"],
    description: "Double-wall vacuum insulated. Matte black powder coat with laser-etched Vanciety badge. Fits most cup holders.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    featured: true,
    new: true,
  },
  {
    id: "camp-mug",
    name: "Camp Mug — Black",
    tagline: "Campfire approved",
    price: "$28",
    category: "drinkware",
    colors: ["Matte Black"],
    description: "Ceramic camp mug with Vanciety badge. 15oz. Dishwasher safe. Microwave safe.",
    image: "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600&q=80",
  },
  {
    id: "water-bottle-32oz",
    name: "Hydro Bottle 32oz",
    tagline: "Stay hydrated. Stay moving.",
    price: "$38",
    category: "drinkware",
    colors: ["Matte Black"],
    description: "Wide-mouth vacuum insulated bottle. Matte black with badge etching. Leak-proof lid.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
  },
  {
    id: "can-koozie",
    name: "Koozie 2-Pack",
    tagline: "Community · Gear · Connect · Knowledge",
    price: "$16",
    category: "drinkware",
    colors: ["Black"],
    description: "Foam can koozie with full Vanciety badge on one side, tagline on the other. Set of 2.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  // ── Bags ──────────────────────────────────────────────────────────────────
  {
    id: "duffel-bag",
    name: "Vanciety Duffel Bag",
    tagline: "Pack light. Go far.",
    price: "$78",
    category: "bags",
    badge: "NEW DROP",
    colors: ["Black"],
    description: "30L waxed canvas duffel with leather handles and Vanciety badge patch. Fits in any van.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    featured: true,
    new: true,
  },
  {
    id: "tote-bag",
    name: "Heavy Canvas Tote",
    tagline: "Carry everything",
    price: "$32",
    category: "bags",
    colors: ["Black", "Natural"],
    description: "12oz canvas tote with Vanciety badge screenprint. Reinforced handles. 15L capacity.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
  },
  {
    id: "backpack",
    name: "Trail Backpack 25L",
    tagline: "Day hikes. Base camps. Everything.",
    price: "$95",
    category: "bags",
    colors: ["Black"],
    description: "25L technical backpack with Vanciety badge embroidery. Padded laptop sleeve, hip belt, hydration compatible.",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80",
  },
  // ── Accessories ───────────────────────────────────────────────────────────
  {
    id: "carabiner-clip",
    name: "Carabiner Keychain",
    tagline: "Clip it. Go.",
    price: "$14",
    category: "accessories",
    colors: ["Black/Gold"],
    description: "Heavy-duty aluminum carabiner with Vanciety badge laser engraving. Holds keys, gear, anything.",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
    featured: true,
  },
  {
    id: "sticker-pack",
    name: "Sticker Pack — 5pc",
    tagline: "Mark your territory",
    price: "$12",
    category: "accessories",
    colors: ["Black/Gold"],
    description: "5 premium vinyl stickers. Weatherproof. UV resistant. Vanciety badge, mountain van, and tagline designs.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: "phone-case",
    name: "Phone Case — Matte Black",
    tagline: "Protect your lifeline",
    price: "$28",
    category: "accessories",
    colors: ["Matte Black"],
    description: "Slim matte black case with Vanciety badge. Available for iPhone 14/15/16 and Samsung S23/S24.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80",
  },
  // ── Patches ───────────────────────────────────────────────────────────────
  {
    id: "badge-patch-iron-on",
    name: "Vanciety Badge Patch",
    tagline: "Iron-on or sew-on",
    price: "$12",
    category: "patches",
    badge: "BESTSELLER",
    colors: ["Black/Gold"],
    description: "4\" embroidered badge patch. Iron-on backing. Sew-on compatible. Put it on everything.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    featured: true,
  },
  {
    id: "leather-patch",
    name: "Leather Badge Patch",
    tagline: "Premium leather. Laser etched.",
    price: "$18",
    category: "patches",
    colors: ["Tan Leather"],
    description: "3\" genuine leather patch with laser-etched Vanciety badge. Sew-on. Looks incredible on hats and bags.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: "morale-patch",
    name: "Morale Patch Set — 3pc",
    tagline: "For the velcro crowd",
    price: "$22",
    category: "patches",
    colors: ["Black/Gold"],
    description: "3-pack of PVC morale patches with velcro backing. Vanciety badge, mountain van, and 'Build Experiences' designs.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  // ── Camping ───────────────────────────────────────────────────────────────
  {
    id: "camp-towel",
    name: "Microfiber Camp Towel",
    tagline: "Dry fast. Pack small.",
    price: "$24",
    category: "camping",
    colors: ["Black", "Olive"],
    description: "XL microfiber towel with Vanciety badge corner print. Folds to the size of a water bottle.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: "camp-chair-bag",
    name: "Camp Chair Carry Bag",
    tagline: "Protect your chair",
    price: "$28",
    category: "camping",
    colors: ["Black"],
    description: "Heavy canvas carry bag for camp chairs. Fits most folding chairs. Vanciety badge patch on front.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: "cooking-apron",
    name: "Camp Cook Apron",
    tagline: "Van kitchen approved",
    price: "$36",
    category: "camping",
    colors: ["Black", "Waxed Canvas"],
    description: "Heavy waxed canvas apron with Vanciety badge. Adjustable neck strap, two pockets. Built for outdoor cooking.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
];

const CATEGORIES: { id: MerchCategory; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All Products", icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "clothing", label: "Clothing", icon: <Shirt className="w-4 h-4" /> },
  { id: "headwear", label: "Headwear", icon: <Tag className="w-4 h-4" /> },
  { id: "drinkware", label: "Drinkware", icon: <Coffee className="w-4 h-4" /> },
  { id: "bags", label: "Bags", icon: <Backpack className="w-4 h-4" /> },
  { id: "accessories", label: "Accessories", icon: <Zap className="w-4 h-4" /> },
  { id: "patches", label: "Patches", icon: <Shield className="w-4 h-4" /> },
  { id: "camping", label: "Camping", icon: <Package className="w-4 h-4" /> },
];

function ProductCard({ product }: { product: MerchProduct }) {
  const handleNotify = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success(`You'll be notified when ${product.name} is available!`, {
      description: "We'll email you when the store launches.",
    });
  };

  return (
    <div
      className="group flex flex-col rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "#1c1c1c",
        borderColor: "#2e2e2e",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = GOLD + "60";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${GOLD}18`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#2e2e2e";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square" style={{ background: "#141414" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full tracking-wide"
              style={{ background: GOLD, color: "#0a0a0a" }}
            >
              {product.badge}
            </span>
          )}
          {product.new && !product.badge && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full tracking-wide"
              style={{ background: GOLD, color: "#0a0a0a" }}
            >
              NEW
            </span>
          )}
        </div>

        {/* Color dots */}
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {product.colors.slice(0, 3).map((c) => (
            <span key={c} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.7)", color: GOLD_LIGHT, border: `1px solid ${GOLD}40` }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: GOLD }}>
            {product.category}
          </p>
          <h3 className="font-bold text-white leading-snug group-hover:text-opacity-90 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#888" }}>{product.tagline}</p>
        </div>

        <p className="text-sm leading-relaxed flex-1" style={{ color: "#aaa" }}>
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #2e2e2e" }}>
          <span className="text-xl font-bold" style={{ color: GOLD }}>
            {product.price}
          </span>
          <button
            onClick={handleNotify}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 active:scale-95"
            style={{
              background: GOLD,
              color: "#0a0a0a",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = GOLD_LIGHT;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = GOLD;
            }}
          >
            Notify Me <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VancietyMerch() {
  const [activeCategory, setActiveCategory] = useState<MerchCategory>("all");

  const displayed =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const featured = PRODUCTS.filter((p) => p.featured);

  return (
    <div className="min-h-screen" style={{ background: "#0f0f0f", color: "#fff" }}>
      <Header />

      <PageHero
        label="Vanciety Merch"
        title="Build Experiences Not Things"
        subtitle="Official Vanciety gear. Matte black everything. Gold badge. Built for the road."
        icon={ShoppingBag}
      />

      {/* Launch banner */}
      <div className="py-4 text-center text-sm font-medium" style={{ background: GOLD, color: "#0a0a0a" }}>
        <span className="font-bold">Merch store launching soon</span> — click any product to get notified when it drops
      </div>

      {/* Trust badges */}
      <div className="border-b" style={{ borderColor: "#222" }}>
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-6">
          {[
            { icon: <Truck className="w-4 h-4" />, text: "Free shipping over $75" },
            { icon: <BadgeCheck className="w-4 h-4" />, text: "Premium quality guaranteed" },
            { icon: <RotateCcw className="w-4 h-4" />, text: "30-day returns" },
            { icon: <Star className="w-4 h-4" />, text: "Community designed" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm" style={{ color: "#aaa" }}>
              <span style={{ color: GOLD }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Featured products */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>Featured Drops</span>
          <div className="flex-1 h-px" style={{ background: "#2e2e2e" }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div
        className="sticky top-0 z-20 border-b"
        style={{ background: "rgba(15,15,15,0.97)", backdropFilter: "blur(12px)", borderColor: "#222" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150"
                style={
                  activeCategory === id
                    ? { background: GOLD, color: "#0a0a0a" }
                    : { background: "#1e1e1e", color: "#888", border: "1px solid #2e2e2e" }
                }
                onMouseEnter={(e) => {
                  if (activeCategory !== id) {
                    (e.currentTarget as HTMLButtonElement).style.color = GOLD;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD + "60";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== id) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#888";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#2e2e2e";
                  }
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* All products grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: "#666" }}>
            {displayed.length} product{displayed.length !== 1 ? "s" : ""}
            {activeCategory !== "all" && ` in ${CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
          </p>
          <Badge variant="outline" className="text-xs" style={{ borderColor: GOLD + "40", color: GOLD }}>
            Community · Gear · Connect · Knowledge
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayed.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-16 rounded-2xl p-10 text-center"
          style={{ background: "#1a1a1a", border: `1px solid ${GOLD}30` }}
        >
          {/* Badge logo placeholder */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: GOLD + "18", border: `2px solid ${GOLD}40` }}
          >
            <ShoppingBag className="w-9 h-9" style={{ color: GOLD }} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Want to see something specific?</h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: "#888" }}>
            Tell the community what gear you want. Post in Campfire and vote on the next drop.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => (window.location.href = "/campfire")}
              className="font-semibold"
              style={{ background: GOLD, color: "#0a0a0a" }}
            >
              Request a product
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/shop")}
              style={{ borderColor: "#2e2e2e", color: "#aaa" }}
            >
              Browse van gear instead
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
