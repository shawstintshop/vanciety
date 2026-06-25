import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
/**
 * VanShop — Curated Amazon affiliate product page
 * Affiliate tag: a2wz7k05xdigc-20
 * Design: Dark, editorial, gear-focused. Warm amber accents on deep charcoal.
 */

import { useState } from "react";
import { ExternalLink, Star, ShoppingBag, Zap, Sun, Wind, Shield, Package, Lightbulb, Flame, ChefHat, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AFFILIATE_PRODUCTS,
  CATEGORY_META,
  amazonLink,
  getFeaturedProducts,
  type ProductCategory,
  type AffiliateProduct,
} from "@/data/affiliateProducts";

const ALL_CATEGORIES: ProductCategory[] = [
  "power", "solar", "ventilation", "kitchen", "sleeping",
  "toilet", "safety", "storage", "lighting", "heating",
];

const CATEGORY_ICONS: Record<ProductCategory, React.ReactNode> = {
  power:       <Zap className="w-4 h-4" />,
  solar:       <Sun className="w-4 h-4" />,
  ventilation: <Wind className="w-4 h-4" />,
  kitchen:     <ChefHat className="w-4 h-4" />,
  sleeping:    <BedDouble className="w-4 h-4" />,
  toilet:      <Shield className="w-4 h-4" />,
  safety:      <Shield className="w-4 h-4" />,
  storage:     <Package className="w-4 h-4" />,
  lighting:    <Lightbulb className="w-4 h-4" />,
  heating:     <Flame className="w-4 h-4" />,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-700 text-zinc-700"
          }`}
        />
      ))}
      <span className="text-xs text-zinc-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ProductCard({ product }: { product: AffiliateProduct }) {
  const meta = CATEGORY_META[product.category];
  const link = amazonLink(product.asin);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-amber-600/60 hover:shadow-lg hover:shadow-amber-900/20 transition-all duration-200"
    >
      {/* Product image */}
      <div className="relative bg-zinc-800 aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";
          }}
        />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            {product.badge}
          </span>
        )}
        <span className={`absolute top-2 right-2 ${meta.color} text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1`}>
          {CATEGORY_ICONS[product.category]}
          {meta.label}
        </span>
      </div>

      {/* Product info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{product.brand}</p>
          <h3 className="text-sm font-semibold text-zinc-100 leading-snug mt-0.5 group-hover:text-amber-300 transition-colors">
            {product.name}
          </h3>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed flex-1">{product.shortDesc}</p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mt-1">
          {product.highlights.slice(0, 3).map((h) => (
            <span key={h} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
              {h}
            </span>
          ))}
        </div>

        {/* Rating */}
        <StarRating rating={product.rating} />
        <p className="text-xs text-zinc-500">{product.reviewCount} reviews on Amazon</p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800">
          <span className="text-lg font-bold text-amber-400">{product.price}</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
            View on Amazon <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function VancietyShop() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all" | "featured">("featured");

  const displayedProducts =
    activeCategory === "all"
      ? AFFILIATE_PRODUCTS
      : activeCategory === "featured"
      ? getFeaturedProducts()
      : AFFILIATE_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground topo-card">
      <Header />
      {/* Hero */}
      <HeroSection
        image="/images/sprinter-desert-camping.png"
        badge="Van Life Shop"
        title="Gear that"
        accent="actually works."
        subtitle="Hand-picked by van lifers. Battle-tested on the road."
      />

      {/* Affiliate disclosure */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto inline-flex items-center gap-2 bg-zinc-800/60 border border-zinc-700 rounded-lg px-4 py-2">
          <span className="text-xs text-zinc-400">
            <span className="text-amber-400 font-semibold">Affiliate disclosure:</span> Vanciety earns a small commission on qualifying Amazon purchases. Prices shown are approximate and may vary.
          </span>
        </div>
      </div>

      {/* Category filters */}
      <div className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("featured")}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === "featured"
                  ? "bg-amber-500 text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
              }`}
            >
              ⭐ Featured
            </button>
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-amber-500 text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
              }`}
            >
              All Gear
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-amber-500 text-black"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {meta.emoji} {meta.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-zinc-400 text-sm">
            {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
            {activeCategory !== "all" && activeCategory !== "featured" && (
              <span> in {CATEGORY_META[activeCategory as ProductCategory].label}</span>
            )}
          </p>
          <p className="text-xs text-zinc-600">All links open Amazon with your cart ready</p>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.asin} product={product} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Have a product recommendation?</h2>
          <p className="text-zinc-400 mb-4">
            Tell the community about gear that changed your van life. Post in the Campfire boards.
          </p>
          <Button
            variant="outline"
            className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black"
            onClick={() => window.location.href = "/campfire"}
          >
            Share in Campfire
          </Button>
        </div>
      </div>
    </div>
  );
}
