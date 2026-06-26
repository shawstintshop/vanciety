/**
 * VancietyMerch — Official Vanciety Merch Store
 * Powered by Printful print-on-demand
 *
 * Aesthetic: Matte black everything, gold/tan badge logo, rugged overland brand
 * Colors: #0f0f0f background, #c9a96e gold accent, #1c1c1c card bg
 * Tagline: Community · Gear · Connect · Knowledge
 * "Build Experiences Not Things"
 *
 * Data flow:
 *   Frontend → supabase.functions.invoke("printful-products") → Printful API
 *   Checkout → supabase.functions.invoke("printful-checkout") → Printful order
 */

import { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag, Star, Package, Shirt, Coffee, Zap, Shield,
  ChevronRight, BadgeCheck, Truck, RotateCcw, X, Plus, Minus,
  ShoppingCart, Loader2, AlertCircle, ChevronLeft,
} from "lucide-react";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ─── Brand colors ──────────────────────────────────────────────────────────────
const GOLD = "#c9a96e";
const GOLD_LIGHT = "#e2c896";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface PrintfulProduct {
  id: number;
  external_id: string;
  name: string;
  thumbnail_url: string | null;
  images: string[];
  variants_count: number;
  min_price: number;
  max_price: number;
  price_display: string;
  sizes: string[];
  colors: string[];
  is_ignored: boolean;
}

interface PrintfulVariant {
  id: number;
  sync_product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  retail_price: string;
  sku: string;
  files: { type: string; preview_url?: string }[];
}

interface CartItem {
  variant_id: number;
  product_name: string;
  variant_name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface CheckoutForm {
  name: string;
  email: string;
  address1: string;
  city: string;
  state_code: string;
  zip: string;
  country_code: string;
}

// ─── Fallback static products (shown when Printful key not yet configured) ────
const FALLBACK_PRODUCTS: PrintfulProduct[] = [
  {
    id: 1, external_id: "badge-tee", name: "Vanciety Badge Tee",
    thumbnail_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    images: [], variants_count: 4, min_price: 34, max_price: 34,
    price_display: "$34.00", sizes: ["S","M","L","XL","2XL"], colors: ["Black","Olive"],
    is_ignored: false,
  },
  {
    id: 2, external_id: "badge-hoodie", name: "Vanciety Pullover Hoodie",
    thumbnail_url: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    images: [], variants_count: 4, min_price: 68, max_price: 68,
    price_display: "$68.00", sizes: ["S","M","L","XL","2XL"], colors: ["Black"],
    is_ignored: false,
  },
  {
    id: 3, external_id: "trucker-hat", name: "Vanciety Trucker Hat",
    thumbnail_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    images: [], variants_count: 2, min_price: 36, max_price: 36,
    price_display: "$36.00", sizes: ["One Size"], colors: ["Black/Tan","All Black"],
    is_ignored: false,
  },
  {
    id: 4, external_id: "tumbler", name: "Matte Black Tumbler 20oz",
    thumbnail_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    images: [], variants_count: 1, min_price: 42, max_price: 42,
    price_display: "$42.00", sizes: ["20oz"], colors: ["Matte Black"],
    is_ignored: false,
  },
  {
    id: 5, external_id: "duffel", name: "Vanciety Duffel Bag",
    thumbnail_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    images: [], variants_count: 1, min_price: 78, max_price: 78,
    price_display: "$78.00", sizes: ["30L"], colors: ["Black"],
    is_ignored: false,
  },
  {
    id: 6, external_id: "patch", name: "Vanciety Badge Patch",
    thumbnail_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    images: [], variants_count: 1, min_price: 12, max_price: 12,
    price_display: "$12.00", sizes: ['4"'], colors: ["Black/Gold"],
    is_ignored: false,
  },
];

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onSelect,
  isFallback,
}: {
  product: PrintfulProduct;
  onSelect: (p: PrintfulProduct) => void;
  isFallback: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group flex flex-col rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: "#1c1c1c", borderColor: "#2e2e2e" }}
      onClick={() => onSelect(product)}
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
        {product.thumbnail_url && !imgError ? (
          <img
            src={product.thumbnail_url}
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
          <h3 className="font-bold text-white leading-snug">{product.name}</h3>
          {product.sizes.length > 0 && (
            <p className="text-xs mt-1" style={{ color: "#666" }}>
              {product.sizes.slice(0, 4).join(" · ")}{product.sizes.length > 4 ? " ···" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: "1px solid #2e2e2e" }}>
          <span className="text-xl font-bold" style={{ color: GOLD }}>
            {isFallback ? "Coming Soon" : product.price_display}
          </span>
          <button
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 active:scale-95"
            style={{ background: GOLD, color: "#0a0a0a" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD_LIGHT; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}
          >
            {isFallback ? "Preview" : "Add to Cart"} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────
function ProductModal({
  product,
  onClose,
  onAddToCart,
  isFallback,
}: {
  product: PrintfulProduct;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  isFallback: boolean;
}) {
  const [variants, setVariants] = useState<PrintfulVariant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(!isFallback);
  const [selectedVariant, setSelectedVariant] = useState<PrintfulVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (isFallback) return;
    setLoadingVariants(true);
    supabase.functions
      .invoke("printful-products", { body: { action: "get_product", product_id: product.id } })
      .then(({ data, error }) => {
        if (!error && data?.variants) {
          setVariants(data.variants);
          setSelectedVariant(data.variants[0] || null);
        }
      })
      .finally(() => setLoadingVariants(false));
  }, [product.id, isFallback]);

  const images = product.images.length > 0 ? product.images : [product.thumbnail_url].filter(Boolean) as string[];

  const handleAddToCart = () => {
    if (isFallback) {
      toast.info("Store launching soon! You'll be notified when products are available.");
      return;
    }
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    onAddToCart({
      variant_id: selectedVariant.id,
      product_name: product.name,
      variant_name: `${selectedVariant.color} / ${selectedVariant.size}`,
      price: parseFloat(selectedVariant.retail_price),
      quantity,
      image: product.thumbnail_url,
    });
    toast.success(`${product.name} added to cart!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: "#1a1a1a", border: `1px solid ${GOLD}30` }}>
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
          style={{ background: "#2a2a2a", color: "#888" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#888"; }}>
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Images */}
          <div className="relative aspect-square" style={{ background: "#141414" }}>
            {images.length > 0 ? (
              <>
                <img src={images[activeImage]} alt={product.name}
                  className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setActiveImage(i)}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{ background: i === activeImage ? GOLD : "#444" }} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Shirt className="w-24 h-24 opacity-20" style={{ color: GOLD }} />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>
                Vanciety Official
              </p>
              <h2 className="text-2xl font-bold text-white">{product.name}</h2>
              <p className="text-xl font-bold mt-1" style={{ color: GOLD }}>
                {isFallback ? "Coming Soon" : (selectedVariant ? `$${parseFloat(selectedVariant.retail_price).toFixed(2)}` : product.price_display)}
              </p>
            </div>

            {loadingVariants ? (
              <div className="flex items-center gap-2" style={{ color: "#666" }}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading variants...</span>
              </div>
            ) : variants.length > 0 ? (
              <>
                {/* Color selector */}
                {[...new Set(variants.map((v) => v.color))].length > 1 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#888" }}>Color</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(variants.map((v) => v.color))].map((color) => (
                        <button key={color}
                          onClick={() => {
                            const v = variants.find((v) => v.color === color && (selectedVariant ? v.size === selectedVariant.size : true));
                            if (v) setSelectedVariant(v);
                          }}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                          style={selectedVariant?.color === color
                            ? { background: GOLD, color: "#0a0a0a" }
                            : { background: "#2a2a2a", color: "#aaa", border: "1px solid #3a3a3a" }}>
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size selector */}
                {[...new Set(variants.map((v) => v.size))].length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#888" }}>Size</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(variants.map((v) => v.size))].map((size) => (
                        <button key={size}
                          onClick={() => {
                            const v = variants.find((v) => v.size === size && (selectedVariant ? v.color === selectedVariant.color : true));
                            if (v) setSelectedVariant(v);
                          }}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                          style={selectedVariant?.size === size
                            ? { background: GOLD, color: "#0a0a0a" }
                            : { background: "#2a2a2a", color: "#aaa", border: "1px solid #3a3a3a" }}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : isFallback ? (
              <p className="text-sm" style={{ color: "#666" }}>
                Connect Printful to see available variants and sizes.
              </p>
            ) : null}

            {/* Quantity */}
            {!isFallback && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#888" }}>Quantity</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "#2a2a2a", color: "#aaa" }}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-bold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "#2a2a2a", color: "#aaa" }}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <button onClick={handleAddToCart}
              className="w-full py-3 rounded-xl font-bold text-base transition-all duration-150 active:scale-98 mt-auto"
              style={{ background: GOLD, color: "#0a0a0a" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD_LIGHT; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}>
              {isFallback ? "Notify Me When Available" : "Add to Cart"}
            </button>

            <div className="flex items-center gap-4 text-xs" style={{ color: "#666" }}>
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Free ship $75+</span>
              <span className="flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> 30-day returns</span>
              <span className="flex items-center gap-1"><BadgeCheck className="w-3.5 h-3.5" /> Print-on-demand</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Sidebar ─────────────────────────────────────────────────────────────
function CartSidebar({
  cart,
  onClose,
  onRemove,
  onUpdateQty,
}: {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (variantId: number) => void;
  onUpdateQty: (variantId: number, qty: number) => void;
}) {
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [form, setForm] = useState<CheckoutForm>({
    name: "", email: "", address1: "", city: "",
    state_code: "", zip: "", country_code: "US",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 75 ? 0 : 7.99;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("printful-checkout", {
        body: {
          recipient: {
            name: form.name,
            email: form.email,
            address1: form.address1,
            city: form.city,
            state_code: form.state_code,
            zip: form.zip,
            country_code: form.country_code,
          },
          items: cart.map((item) => ({
            sync_variant_id: item.variant_id,
            quantity: item.quantity,
          })),
        },
      });

      if (error || data?.error) {
        toast.error(data?.error || "Order failed. Please try again.");
        return;
      }

      setOrderId(data.order_id);
      setStep("success");
    } catch (_e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md h-full overflow-y-auto flex flex-col"
        style={{ background: "#1a1a1a", borderLeft: `1px solid ${GOLD}20` }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid #2a2a2a" }}>
          <div className="flex items-center gap-2">
            {step === "checkout" && (
              <button onClick={() => setStep("cart")} className="mr-1" style={{ color: "#888" }}>
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <ShoppingCart className="w-5 h-5" style={{ color: GOLD }} />
            <h2 className="font-bold text-white">
              {step === "cart" ? "Your Cart" : step === "checkout" ? "Checkout" : "Order Confirmed"}
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "#888" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16" style={{ color: "#555" }}>
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.variant_id} className="flex gap-3 p-3 rounded-xl"
                    style={{ background: "#242424" }}>
                    {item.image ? (
                      <img src={item.image} alt={item.product_name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ background: "#1a1a1a" }}>
                        <Shirt className="w-7 h-7 opacity-30" style={{ color: GOLD }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{item.product_name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#888" }}>{item.variant_name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => onUpdateQty(item.variant_id, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{ background: "#333", color: "#aaa" }}>
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm text-white">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.variant_id, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{ background: "#333", color: "#aaa" }}>
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm" style={{ color: GOLD }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button onClick={() => onRemove(item.variant_id)} style={{ color: "#555" }}>
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 space-y-3" style={{ borderTop: "1px solid #2a2a2a" }}>
                <div className="flex justify-between text-sm" style={{ color: "#888" }}>
                  <span>Subtotal</span><span style={{ color: "#ccc" }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: "#888" }}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? GOLD : "#ccc" }}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2" style={{ borderTop: "1px solid #2a2a2a" }}>
                  <span className="text-white">Total</span>
                  <span style={{ color: GOLD }}>${total.toFixed(2)}</span>
                </div>
                <button onClick={() => setStep("checkout")}
                  className="w-full py-3 rounded-xl font-bold transition-all active:scale-98"
                  style={{ background: GOLD, color: "#0a0a0a" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD_LIGHT; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {step === "checkout" && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <p className="text-sm" style={{ color: "#888" }}>Shipping information</p>
            {(["name", "email", "address1", "city", "state_code", "zip"] as (keyof CheckoutForm)[]).map((field) => (
              <div key={field}>
                <label className="block text-xs font-medium mb-1 capitalize" style={{ color: "#888" }}>
                  {field === "state_code" ? "State" : field === "address1" ? "Address" : field}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none transition-colors"
                  style={{ background: "#242424", border: "1px solid #333" }}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = GOLD + "80"; }}
                  onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#333"; }}
                />
              </div>
            ))}
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-3" style={{ color: "#888" }}>
                <span>Order total</span>
                <span style={{ color: GOLD }}>${total.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} disabled={submitting}
                className="w-full py-3 rounded-xl font-bold transition-all active:scale-98 flex items-center justify-center gap-2"
                style={{ background: GOLD, color: "#0a0a0a", opacity: submitting ? 0.7 : 1 }}
                onMouseEnter={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = GOLD_LIGHT; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}>
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</> : "Place Order"}
              </button>
              <p className="text-xs text-center mt-3" style={{ color: "#555" }}>
                Orders are fulfilled by Printful. Payment processed securely.
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: GOLD + "20", border: `2px solid ${GOLD}` }}>
              <BadgeCheck className="w-8 h-8" style={{ color: GOLD }} />
            </div>
            <h3 className="text-xl font-bold text-white">Order Placed!</h3>
            {orderId && <p className="text-sm" style={{ color: "#888" }}>Order #{orderId}</p>}
            <p className="text-sm" style={{ color: "#888" }}>
              Your order has been submitted to Printful. You'll receive a confirmation email shortly.
              Production typically takes 2–5 business days.
            </p>
            <button onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl font-bold"
              style={{ background: GOLD, color: "#0a0a0a" }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VancietyMerch() {
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PrintfulProduct | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("printful-products", {
        body: { action: "list_products", limit: 50 },
      });

      if (fnError || data?.error) {
        // If PRINTFUL_API_KEY not configured, show fallback catalog
        if (data?.error?.includes("not configured") || fnError?.message?.includes("not configured")) {
          setIsFallback(true);
          setProducts(FALLBACK_PRODUCTS);
        } else {
          setError(data?.error || fnError?.message || "Failed to load products");
          setIsFallback(true);
          setProducts(FALLBACK_PRODUCTS);
        }
        return;
      }

      if (data?.products?.length > 0) {
        setProducts(data.products.filter((p: PrintfulProduct) => !p.is_ignored));
        setIsFallback(false);
      } else {
        // Printful store is empty — show fallback
        setIsFallback(true);
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (_e) {
      setIsFallback(true);
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.variant_id === item.variant_id);
      if (existing) {
        return prev.map((c) =>
          c.variant_id === item.variant_id ? { ...c, quantity: c.quantity + item.quantity } : c
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (variantId: number) => {
    setCart((prev) => prev.filter((c) => c.variant_id !== variantId));
  };

  const updateQty = (variantId: number, qty: number) => {
    setCart((prev) => prev.map((c) => c.variant_id === variantId ? { ...c, quantity: qty } : c));
  };

  return (
    <div className="min-h-screen" style={{ background: "#0f0f0f", color: "#fff" }}>
      <Header />

      <PageHero
        label="Vanciety Merch"
        title="Build Experiences Not Things"
        subtitle="Official Vanciety gear. Matte black everything. Gold badge. Built for the road."
        icon={ShoppingBag}
      />

      {/* Status banner */}
      {isFallback ? (
        <div className="py-3 text-center text-sm" style={{ background: "#1a1a1a", borderBottom: `1px solid ${GOLD}20` }}>
          <span className="flex items-center justify-center gap-2" style={{ color: "#888" }}>
            <AlertCircle className="w-4 h-4" style={{ color: GOLD }} />
            Printful not yet connected — showing preview catalog.
            <a href="#setup" className="underline" style={{ color: GOLD }}>Setup guide below ↓</a>
          </span>
        </div>
      ) : (
        <div className="py-3 text-center text-sm font-medium" style={{ background: GOLD, color: "#0a0a0a" }}>
          <span className="font-bold">Live store</span> — powered by Printful print-on-demand · Free shipping over $75
        </div>
      )}

      {/* Trust badges */}
      <div className="border-b" style={{ borderColor: "#222" }}>
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-6">
          {[
            { icon: <Truck className="w-4 h-4" />, text: "Free shipping over $75" },
            { icon: <BadgeCheck className="w-4 h-4" />, text: "Premium quality guaranteed" },
            { icon: <RotateCcw className="w-4 h-4" />, text: "30-day returns" },
            { icon: <Star className="w-4 h-4" />, text: "Print-on-demand by Printful" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm" style={{ color: "#aaa" }}>
              <span style={{ color: GOLD }}>{icon}</span>{text}
            </div>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3" style={{ color: "#555" }}>
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: GOLD }} />
            <span>Loading products from Printful...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                  {isFallback ? "Preview Catalog" : "Live Products"}
                </span>
                <div className="flex-1 h-px w-16" style={{ background: "#2e2e2e" }} />
              </div>
              <Badge variant="outline" className="text-xs" style={{ borderColor: GOLD + "40", color: GOLD }}>
                {products.length} products
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} isFallback={isFallback} />
              ))}
            </div>
          </>
        )}

        {/* Setup guide (shown when Printful not connected) */}
        {isFallback && (
          <div id="setup" className="mt-16 rounded-2xl p-8 space-y-6"
            style={{ background: "#1a1a1a", border: `1px solid ${GOLD}30` }}>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6" style={{ color: GOLD }} />
              <h2 className="text-xl font-bold text-white">Connect Printful in 3 Steps</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: "Create Printful Account",
                  desc: "Sign up free at printful.com. Create a store and upload your Vanciety badge design to products.",
                  link: "https://www.printful.com",
                  linkText: "Open Printful →",
                },
                {
                  step: "2",
                  title: "Get Your API Key",
                  desc: "In Printful: Settings → API → Generate API key. Copy the key.",
                  link: "https://www.printful.com/dashboard/settings/api",
                  linkText: "Printful API Settings →",
                },
                {
                  step: "3",
                  title: "Add to Supabase Secrets",
                  desc: "In your Supabase project: Edge Functions → Secrets → Add PRINTFUL_API_KEY with your key.",
                  link: "https://supabase.com/dashboard",
                  linkText: "Open Supabase →",
                },
              ].map(({ step, title, desc, link, linkText }) => (
                <div key={step} className="p-5 rounded-xl" style={{ background: "#242424" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-3"
                    style={{ background: GOLD, color: "#0a0a0a" }}>
                    {step}
                  </div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm mb-3" style={{ color: "#888" }}>{desc}</p>
                  <a href={link} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium" style={{ color: GOLD }}>
                    {linkText}
                  </a>
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: "#555" }}>
              Once the secret is set, refresh this page and your real Printful products will appear automatically.
            </p>
          </div>
        )}
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-2xl transition-all active:scale-95"
          style={{ background: GOLD, color: "#0a0a0a" }}>
          <ShoppingCart className="w-5 h-5" />
          Cart ({cartCount})
        </button>
      )}

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          isFallback={isFallback}
        />
      )}

      {/* Cart sidebar */}
      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
        />
      )}
    </div>
  );
}
