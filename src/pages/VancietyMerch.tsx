/**
 * VancietyMerch — Official Vanciety Merch Store
 * Powered by Fourthwall: vanciety-shop.fourthwall.com
 *
 * Fetches live products from Fourthwall via Supabase edge function.
 * Falls back to static catalog if API is unavailable or store has no products yet.
 *
 * Aesthetic: Matte black everything, gold/tan badge logo, rugged overland brand
 * Colors: #0f0f0f background, #c9a96e gold accent, #1c1c1c card bg
 * Tagline: Community · Gear · Connect · Knowledge
 * "Build Experiences Not Things"
 */

import { useState, useEffect } from "react";
import {
  ShoppingBag, Star, Shirt, ExternalLink,
  ChevronRight, BadgeCheck, Truck, RotateCcw, Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const FOURTHWALL_URL = "https://vanciety-shop.fourthwall.com";
const GOLD = "#c9a96e";
const GOLD_LIGHT = "#e2c896";

// ─── Static fallback catalog ─────────────────────────────────────────────────
const FALLBACK_PRODUCTS = [
  { id: "f1", name: "Vanciety Badge Tee", category: "Clothing", price: "$34", thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", colors: ["Black", "Olive"], sizes: ["S","M","L","XL","2XL"], tag: "Best Seller", productUrl: FOURTHWALL_URL },
  { id: "f2", name: "Vanciety Pullover Hoodie", category: "Clothing", price: "$68", thumbnail: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", colors: ["Black"], sizes: ["S","M","L","XL","2XL"], tag: null, productUrl: FOURTHWALL_URL },
  { id: "f3", name: "Vanciety Trucker Hat", category: "Headwear", price: "$36", thumbnail: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80", colors: ["Black/Tan","All Black"], sizes: ["One Size"], tag: "New", productUrl: FOURTHWALL_URL },
  { id: "f4", name: "Vanciety Snapback", category: "Headwear", price: "$32", thumbnail: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&q=80", colors: ["Black","Olive"], sizes: ["One Size"], tag: null, productUrl: FOURTHWALL_URL },
  { id: "f5", name: "Matte Black Tumbler 20oz", category: "Drinkware", price: "$42", thumbnail: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80", colors: ["Matte Black"], sizes: ["20oz"], tag: null, productUrl: FOURTHWALL_URL },
  { id: "f6", name: "Vanciety Camp Mug", category: "Drinkware", price: "$24", thumbnail: "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600&q=80", colors: ["Matte Black"], sizes: ["11oz","15oz"], tag: null, productUrl: FOURTHWALL_URL },
  { id: "f7", name: "Vanciety Duffel Bag", category: "Bags", price: "$78", thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", colors: ["Black"], sizes: ["30L"], tag: null, productUrl: FOURTHWALL_URL },
  { id: "f8", name: "Vanciety Canvas Tote", category: "Bags", price: "$28", thumbnail: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", colors: ["Black"], sizes: ["One Size"], tag: null, productUrl: FOURTHWALL_URL },
  { id: "f9", name: "Vanciety Badge Patch", category: "Accessories", price: "$12", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", colors: ["Black/Gold"], sizes: ['4"'], tag: null, productUrl: FOURTHWALL_URL },
  { id: "f10", name: "Carabiner Keychain", category: "Accessories", price: "$14", thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", colors: ["Black"], sizes: ["One Size"], tag: null, productUrl: FOURTHWALL_URL },
  { id: "f11", name: "Vanciety Sticker Pack", category: "Accessories", price: "$8", thumbnail: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=80", colors: ["Gold/Black"], sizes: ["5-pack"], tag: null, productUrl: FOURTHWALL_URL },
  { id: "f12", name: "Vanciety Bomber Jacket", category: "Clothing", price: "$128", thumbnail: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", colors: ["Black"], sizes: ["S","M","L","XL"], tag: "Premium", productUrl: FOURTHWALL_URL },
];

const CATEGORIES = ["All", "Clothing", "Headwear", "Drinkware", "Bags", "Accessories"];

// ─── Normalize Fourthwall API product to display shape ────────────────────────
function normalizeFWProduct(p: Record<string, unknown>) {
  const colors = Array.isArray(p.colors) ? (p.colors as string[]) : [];
  const sizes = Array.isArray(p.sizes) ? (p.sizes as string[]) : [];
  // Infer category from product name
  const name = typeof p.name === "string" ? p.name : String(p.name || "");
  let category = "Accessories";
  if (/tee|shirt|hoodie|jacket|sweatshirt/i.test(name)) category = "Clothing";
  else if (/hat|cap|beanie/i.test(name)) category = "Headwear";
  else if (/mug|tumbler|bottle|cup|drinkware/i.test(name)) category = "Drinkware";
  else if (/bag|tote|duffel|backpack/i.test(name)) category = "Bags";

  return {
    id: p.id as string,
    name,
    category,
    price: p.price as string,
    thumbnail: (p.thumbnail as string) || "",
    colors,
    sizes,
    tag: null as string | null,
    productUrl: (p.productUrl as string) || FOURTHWALL_URL,
    available: p.available !== false,
  };
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: ReturnType<typeof normalizeFWProduct> | typeof FALLBACK_PRODUCTS[0] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-1 no-underline"
      style={{ background: "#1c1c1c", borderColor: "#2e2e2e", textDecoration: "none" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = GOLD + "60";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 32px ${GOLD}18`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2e2e2e";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square" style={{ background: "#141414" }}>
        {product.thumbnail && !imgError ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Shirt className="w-16 h-16 opacity-20" style={{ color: GOLD }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Tag badge */}
        {product.tag && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ background: GOLD, color: "#0a0a0a" }}>
              {product.tag}
            </span>
          </div>
        )}

        {/* Color chips */}
        {product.colors.length > 0 && (
          <div className="absolute bottom-3 right-3 flex gap-1.5 flex-wrap justify-end max-w-[80%]">
            {product.colors.slice(0, 2).map((c) => (
              <span key={c} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,0,0,0.75)", color: GOLD_LIGHT, border: `1px solid ${GOLD}40` }}>
                {c}
              </span>
            ))}
            {product.colors.length > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,0,0,0.75)", color: "#888", border: "1px solid #333" }}>
                +{product.colors.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#666" }}>{product.category}</p>
          <h3 className="font-bold text-white leading-snug">{product.name}</h3>
          {product.sizes.length > 0 && (
            <p className="text-xs mt-1" style={{ color: "#555" }}>
              {product.sizes.slice(0, 4).join(" · ")}{product.sizes.length > 4 ? " ···" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: "1px solid #2e2e2e" }}>
          <span className="text-xl font-bold" style={{ color: GOLD }}>
            {product.price}
          </span>
          <span
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150"
            style={{ background: GOLD, color: "#0a0a0a" }}
          >
            Shop Now <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VancietyMerch() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<ReturnType<typeof normalizeFWProduct>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase.functions.invoke("fourthwall-products");
        if (!error && data?.products && data.products.length > 0) {
          setProducts(data.products.map(normalizeFWProduct));
          setIsLive(true);
        } else {
          // Fall back to static catalog
          setProducts(FALLBACK_PRODUCTS.map(normalizeFWProduct));
          setIsLive(false);
        }
      } catch {
        setProducts(FALLBACK_PRODUCTS.map(normalizeFWProduct));
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const displayProducts = loading ? [] : products;
  const filtered = activeCategory === "All"
    ? displayProducts
    : displayProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: "#0f0f0f", color: "#fff" }}>
      <Header />

      <PageHero
        label="Vanciety Merch"
        title="Build Experiences Not Things"
        subtitle="Official Vanciety gear. Matte black everything. Gold badge. Built for the road."
        icon={ShoppingBag}
      />

      {/* Store banner */}
      <div className="py-3 text-center text-sm font-medium" style={{ background: GOLD, color: "#0a0a0a" }}>
        <a
          href={FOURTHWALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 font-bold hover:opacity-80 transition-opacity"
          style={{ color: "#0a0a0a" }}
        >
          <ExternalLink className="w-4 h-4" />
          Shop the official Vanciety store at vanciety-shop.fourthwall.com
        </a>
      </div>

      {/* Trust badges */}
      <div className="border-b" style={{ borderColor: "#222" }}>
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-6">
          {[
            { icon: <Truck className="w-4 h-4" />, text: "Free shipping over $75" },
            { icon: <BadgeCheck className="w-4 h-4" />, text: "Premium quality guaranteed" },
            { icon: <RotateCcw className="w-4 h-4" />, text: "30-day returns" },
            { icon: <Star className="w-4 h-4" />, text: "Powered by Fourthwall" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm" style={{ color: "#aaa" }}>
              <span style={{ color: GOLD }}>{icon}</span>{text}
            </div>
          ))}
        </div>
      </div>

      {/* Featured CTA */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-4">
        <div
          className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: "#1a1a1a", border: `1px solid ${GOLD}30` }}
        >
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
              Community · Gear · Connect · Knowledge
            </p>
            <h2 className="text-2xl font-bold text-white mb-2">The Official Vanciety Store</h2>
            <p className="text-sm" style={{ color: "#888" }}>
              {isLive
                ? `${products.length} products available — ships direct, no middleman.`
                : "Premium print-on-demand gear. Every item ships direct. No middleman."}
            </p>
          </div>
          <a
            href={FOURTHWALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all active:scale-95 hover:opacity-90"
            style={{ background: GOLD, color: "#0a0a0a" }}
          >
            <ShoppingBag className="w-5 h-5" />
            Shop All Gear
          </a>
        </div>
      </div>

      {/* Category filter */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150"
              style={activeCategory === cat
                ? { background: GOLD, color: "#0a0a0a" }
                : { background: "#1c1c1c", color: "#888", border: "1px solid #2e2e2e" }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
              {activeCategory === "All" ? "All Products" : activeCategory}
            </span>
            <div className="flex-1 h-px w-16" style={{ background: "#2e2e2e" }} />
            {isLive && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "#1c1c1c", color: "#5a5", border: "1px solid #2e2e2e" }}>
                Live from store
              </span>
            )}
          </div>
          <Badge variant="outline" className="text-xs" style={{ borderColor: GOLD + "40", color: GOLD }}>
            {loading ? "…" : `${filtered.length} items`}
          </Badge>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
          </div>
        )}

        {/* Products */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && (
          <div className="mt-14 text-center">
            <p className="text-sm mb-4" style={{ color: "#666" }}>
              All products available at the official Vanciety Fourthwall store
            </p>
            <a
              href={FOURTHWALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all active:scale-95 hover:opacity-90"
              style={{ background: GOLD, color: "#0a0a0a" }}
            >
              <ExternalLink className="w-5 h-5" />
              Visit the Full Store
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
