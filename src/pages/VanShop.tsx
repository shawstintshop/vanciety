import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
/**
 * VanShop — Curated Amazon affiliate product page
 * Affiliate tag: a2wz7k05xdigc-20
 * Design: Dark, editorial, gear-focused. Warm amber accents on deep charcoal.
 */

import { useState } from "react";
import { ExternalLink, Star, ShoppingBag, Zap, Sun, Wind, Thermometer, Shield, Package, Lightbulb, Flame, ChefHat, BedDouble } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
              ? "fill-primary text-primary"
              : "fill-muted text-muted"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
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
      className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
    >
      {/* Product image */}
      <div className="relative bg-muted aspect-square overflow-hidden">
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
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
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
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.brand}</p>
          <h3 className="text-sm font-semibold text-foreground leading-snug mt-0.5 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed flex-1">{product.shortDesc}</p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mt-1">
          {product.highlights.slice(0, 3).map((h) => (
            <span key={h} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border/60">
              {h}
            </span>
          ))}
        </div>

        {/* Rating */}
        <StarRating rating={product.rating} />
        <p className="text-xs text-muted-foreground">{product.reviewCount} reviews on Amazon</p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60">
          <span className="text-lg font-bold text-primary">{product.price}</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-primary/80">
            View on Amazon <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function VanShop() {
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
      <PageHero
        label="Van Shop"
        title="Gear That Actually Works"
        subtitle="Hand-picked by van lifers, for van lifers. Every product below is battle-tested on the road."
        icon={ShoppingBag}
      >
        <div className="inline-flex items-center gap-2 bg-card/60 border border-border/60 rounded-lg px-4 py-2">
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Affiliate disclosure:</span> Vanciety earns a small commission on qualifying Amazon purchases. Prices shown are approximate and may vary.
          </span>
        </div>
      </PageHero>

      {/* Category filters */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("featured")}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === "featured"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              ⭐ Featured
            </button>
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
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
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
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
          <p className="text-muted-foreground text-sm">
            {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
            {activeCategory !== "all" && activeCategory !== "featured" && (
              <span> in {CATEGORY_META[activeCategory as ProductCategory].label}</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground/60">All links open Amazon with your cart ready</p>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
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
        <div className="mt-12 bg-card border border-border rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Have a product recommendation?</h2>
          <p className="text-muted-foreground mb-4">
            Tell the community about gear that changed your van life. Post in the Campfire boards.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/campfire"}
          >
            Share in Campfire
          </Button>
        </div>
      </div>
    </div>
  );
}
