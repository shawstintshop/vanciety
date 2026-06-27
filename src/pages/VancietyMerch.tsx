/**
 * VancietyMerch — Official Vanciety Merch Store
 * Layout matches reference: announcement bar → nav → hero → trust bar → category grid → featured carousel → footer
 * Colors: #0d0d0d bg, #c9a96e gold, #e8dcc8 warm white
 * Fourthwall Storefront API: live products + cart + checkout redirect
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Search, User, ChevronLeft, ChevronRight,
  Shield, Mountain, Leaf, Users, Truck, RotateCcw, Lock,
  Instagram, Youtube, X, Plus, Minus, Loader2, CheckCircle,
} from "lucide-react";

// ─── Fourthwall Storefront API ────────────────────────────────────────────────
const FW_API = "https://storefront-api.fourthwall.com/v1";
// Public storefront token — read-only, safe to expose
const FW_TOKEN = (import.meta as any).env?.VITE_FOURTHWALL_TOKEN || "";

interface FWVariant { id: string; name: string; unitPrice: { value: number; currency: string }; price?: { value: number; currency: string }; }
interface FWProduct { id: string; slug: string; name: string; description?: string; images?: { url: string }[]; variants: FWVariant[]; tags?: string[]; }
interface CartItem { variantId: string; productId: string; productName: string; variantName: string; price: number; currency: string; quantity: number; image?: string; }

function formatPrice(amount: number, currency = "USD") {
  // Fourthwall API returns dollar amounts (e.g. 21.89), not cents
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

async function apiFetchProducts(): Promise<FWProduct[]> {
  if (!FW_TOKEN) return [];
  try {
    const res = await fetch(`${FW_API}/collections/all/products?storefront_token=${FW_TOKEN}&size=50`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch { return []; }
}

async function apiCreateCart(variantId: string, quantity: number): Promise<string | null> {
  if (!FW_TOKEN) return `https://vanciety-shop.fourthwall.com`;
  try {
    const res = await fetch(`${FW_API}/carts?storefront_token=${FW_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ variantId, quantity }] }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.checkoutUrl || null;
  } catch { return null; }
}

const FW = "https://vanciety-shop.fourthwall.com";

// Fallback static featured products (shown when API token not configured)
const STATIC_FEATURED = [
  { id: "s1", slug: "peaks-tee", name: "PEAKS TEE", description: "Premium heavyweight cotton.", images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" }], variants: [{ id: "sv1", name: "Black / M", price: { value: 2999, currency: "USD" } }], tags: ["Tees"] },
  { id: "s2", slug: "campfire-tee", name: "CAMPFIRE TEE", description: "Soft ringspun cotton.", images: [{ url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80" }], variants: [{ id: "sv2", name: "Black / M", price: { value: 2999, currency: "USD" } }], tags: ["Tees"] },
  { id: "s3", slug: "pines-tee", name: "PINES TEE", description: "Relaxed fit.", images: [{ url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80" }], variants: [{ id: "sv3", name: "Black / M", price: { value: 2999, currency: "USD" } }], tags: ["Tees"] },
  { id: "s4", slug: "explore-tee", name: "EXPLORE MORE TEE", description: "Adventure ready.", images: [{ url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80" }], variants: [{ id: "sv4", name: "Black / M", price: { value: 2999, currency: "USD" } }], tags: ["Tees"] },
  { id: "s5", slug: "van-life-hoodie", name: "VAN LIFE HOODIE", description: "12oz fleece.", images: [{ url: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80" }], variants: [{ id: "sv5", name: "Black / M", price: { value: 5999, currency: "USD" } }], tags: ["Hoodies"] },
  { id: "s6", slug: "crewneck", name: "CREWNECK", description: "Heavyweight fleece.", images: [{ url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" }], variants: [{ id: "sv6", name: "Black / M", price: { value: 5999, currency: "USD" } }], tags: ["Hoodies"] },
  { id: "s7", slug: "vanciety-hat", name: "VANCIETY HAT", description: "Structured snapback.", images: [{ url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80" }], variants: [{ id: "sv7", name: "Black / One Size", price: { value: 3499, currency: "USD" } }], tags: ["Hats"] },
  { id: "s8", slug: "travel-mug", name: "TRAVEL MUG", description: "20oz insulated.", images: [{ url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80" }], variants: [{ id: "sv8", name: "Matte Black", price: { value: 2999, currency: "USD" } }], tags: ["Accessories"] },
] as FWProduct[];

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/94256494/JRiSVZqcQng3CprwFxMAGR/merch-hero-aiUTgQUQy5yTcTuk8bRj8R.png";

const CATS = [
  { name: "TEES", sub: "30+ DESIGNS", img: "https://d2xsxph8kpxj0f.cloudfront.net/94256494/JRiSVZqcQng3CprwFxMAGR/merch-cat-tees-2pLrow5cFrYw9HFhTwU2qo.png", href: `${FW}/collections/tees` },
  { name: "HOODIES & CREWS", sub: "PREMIUM COMFORT", img: "https://d2xsxph8kpxj0f.cloudfront.net/94256494/JRiSVZqcQng3CprwFxMAGR/merch-cat-hoodies-GRsQoX7RRmnjx6qiXwPehH.png", href: `${FW}/collections/hoodies` },
  { name: "HATS", sub: "TOP IT OFF", img: "https://d2xsxph8kpxj0f.cloudfront.net/94256494/JRiSVZqcQng3CprwFxMAGR/merch-cat-hats-P6Nie5YNVzH9p36XJrNBaN.png", href: `${FW}/collections/hats` },
  { name: "ACCESSORIES", sub: "GEAR FOR THE JOURNEY", img: "https://d2xsxph8kpxj0f.cloudfront.net/94256494/JRiSVZqcQng3CprwFxMAGR/merch-cat-accessories-dNVRCjvtbEDT6DAWuZKpAc.png", href: `${FW}/collections/accessories` },
  { name: "STICKERS & DECALS", sub: "REP YOUR LIFESTYLE", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", href: `${FW}/collections/stickers` },
  { name: "CAMP & VAN GEAR", sub: "ADVENTURE READY", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80", href: `${FW}/collections/gear` },
];

const FEATURED = [
  { name: "PEAKS TEE", price: "$29.99", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
  { name: "CAMPFIRE TEE", price: "$29.99", img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80" },
  { name: "PINES TEE", price: "$29.99", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80" },
  { name: "EXPLORE MORE TEE", price: "$29.99", img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80" },
  { name: "VAN LIFE HOODIE", price: "$59.99", img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80" },
  { name: "CREWNECK", price: "$59.99", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" },
  { name: "VANCIETY HAT", price: "$34.99", img: "https://d2xsxph8kpxj0f.cloudfront.net/94256494/JRiSVZqcQng3CprwFxMAGR/merch-cat-hats-P6Nie5YNVzH9p36XJrNBaN.png" },
  { name: "TRAVEL MUG", price: "$29.99", img: "https://d2xsxph8kpxj0f.cloudfront.net/94256494/JRiSVZqcQng3CprwFxMAGR/merch-cat-accessories-dNVRCjvtbEDT6DAWuZKpAc.png" },
];

const TRUST = [
  { icon: Shield, title: "PREMIUM QUALITY", sub: "Top tier materials & prints" },
  { icon: Mountain, title: "BUILT TO LAST", sub: "For every adventure" },
  { icon: Leaf, title: "DESIGNED IN CANADA", sub: "For van life & beyond" },
  { icon: Users, title: "COMMUNITY DRIVEN", sub: "You're not just a customer" },
];

export default function VancietyMerch() {
  const [email, setEmail] = useState("");
  const carousel = useRef<HTMLDivElement>(null);
  const [liveProducts, setLiveProducts] = useState<FWProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Try to load live products from Fourthwall API
  useEffect(() => {
    apiFetchProducts().then((products) => {
      if (products.length > 0) setLiveProducts(products);
    });
  }, []);

  const displayProducts = liveProducts.length > 0 ? liveProducts : STATIC_FEATURED;
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCurrency = cart[0]?.currency || "USD";

  const addToCart = (product: FWProduct) => {
    const variant = product.variants[0];
    if (!variant) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.variantId === variant.id);
      const priceObj = variant.unitPrice || variant.price || { value: 0, currency: "USD" };
      if (existing) return prev.map((i) => i.variantId === variant.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { variantId: variant.id, productId: product.id, productName: product.name, variantName: variant.name, price: priceObj.value, currency: priceObj.currency, quantity: 1, image: product.images?.[0]?.url }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const removeFromCart = (variantId: string) => setCart((prev) => prev.filter((i) => i.variantId !== variantId));
  const updateQty = (variantId: string, qty: number) => {
    if (qty <= 0) removeFromCart(variantId);
    else setCart((prev) => prev.map((i) => i.variantId === variantId ? { ...i, quantity: qty } : i));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    const url = await apiCreateCart(cart[0].variantId, cart[0].quantity);
    setCheckingOut(false);
    window.open(url || FW, "_blank");
  };

  const scroll = (dir: "left" | "right") => {
    carousel.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <div style={{ background: "#0d0d0d", color: "#e8dcc8", fontFamily: "sans-serif", minHeight: "100vh" }}>

      {/* Announcement bar */}
      <div style={{ background: "#1a1408", borderBottom: "1px solid #c9a96e44", padding: "10px 16px", textAlign: "center" }}>
        <span style={{ color: "#c9a96e", fontSize: "13px", letterSpacing: "0.1em", fontWeight: 700 }}>
          ⚡ FREE SHIPPING ON ORDERS $75+ ⚡
        </span>
      </div>

      {/* Nav */}
      <nav style={{ background: "#0d0d0d", borderBottom: "1px solid #2e2e2e", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", position: "sticky", top: 0, zIndex: 50 }}>
        <Link to="/">
          <img src="/images/vanciety-logo-badge.png" alt="Vanciety" style={{ height: "40px", cursor: "pointer" }} />
        </Link>
        <div style={{ display: "flex", gap: "28px" }} className="hidden md:flex">
          {[
            { label: "SHOP", href: FW },
            { label: "COLLECTIONS", href: `${FW}/collections` },
            { label: "ABOUT", href: "/about" },
            { label: "JOIN THE CREW", href: "/join" },
            { label: "CONTACT", href: "/contact" },
          ].map((item) => (
            <a key={item.label} href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{ color: "#e8dcc8", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 700, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#e8dcc8")}
            >{item.label}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Search size={18} style={{ color: "#e8dcc8", cursor: "pointer" }} />
          <User size={18} style={{ color: "#e8dcc8", cursor: "pointer" }} />
          <a href={FW} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "4px", color: "#e8dcc8", textDecoration: "none" }}>
            <ShoppingCart size={18} />
            <span style={{ fontSize: "13px" }}>0</span>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", width: "100%", height: "clamp(400px, 58vw, 660px)", overflow: "hidden" }}>
        <img src={HERO_IMG} alt="Vanciety — Built for the Road" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,13,13,0.6) 0%, rgba(13,13,13,0.2) 50%, rgba(13,13,13,0.5) 100%)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "90%", maxWidth: "700px" }}>
          <p style={{ color: "#c9a96e", fontSize: "clamp(10px, 1.4vw, 13px)", letterSpacing: "0.25em", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase" }}>
            COMMUNITY · GEAR · CONNECT · KNOWLEDGE
          </p>
          <h1 style={{ color: "#fff", fontSize: "clamp(28px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.05, textTransform: "uppercase", textShadow: "0 2px 24px rgba(0,0,0,0.9)", marginBottom: "28px", letterSpacing: "-0.01em", fontFamily: "Georgia, serif" }}>
            BUILT FOR THE ROAD.<br />MADE FOR THE LIFESTYLE.
          </h1>
          <a href={FW} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#c9a96e", color: "#0d0d0d", padding: "14px 40px", fontSize: "13px", fontWeight: 800, letterSpacing: "0.14em", textDecoration: "none", textTransform: "uppercase", transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#d4b87a"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.03)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#c9a96e"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
          >
            SHOP THE COLLECTION
          </a>
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ background: "#111", borderTop: "1px solid #2e2e2e", borderBottom: "1px solid #2e2e2e", padding: "20px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {TRUST.map((b) => (
            <div key={b.title} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <b.icon size={22} style={{ color: "#c9a96e", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#e8dcc8" }}>{b.title}</div>
                <div style={{ fontSize: "11px", color: "#777", marginTop: "2px" }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category grid — 6 tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "2px" }} className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {CATS.map((cat) => (
          <a key={cat.name} href={cat.href} target="_blank" rel="noopener noreferrer"
            style={{ position: "relative", display: "block", aspectRatio: "3/4", overflow: "hidden", textDecoration: "none" }}
          >
            <img src={cat.img} alt={cat.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.05) 60%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 12px" }}>
              <div style={{ color: "#fff", fontSize: "clamp(10px, 1.1vw, 13px)", fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase" }}>{cat.name}</div>
              <div style={{ color: "#c9a96e", fontSize: "clamp(8px, 0.85vw, 10px)", fontWeight: 600, letterSpacing: "0.1em", marginTop: "2px" }}>{cat.sub}</div>
              <div style={{ marginTop: "10px", display: "inline-block", background: "rgba(13,13,13,0.85)", border: "1px solid #c9a96e", color: "#c9a96e", padding: "5px 12px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em" }}>
                SHOP NOW
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Featured Collections — Live from Fourthwall API or static fallback */}
      <div style={{ padding: "56px 24px 40px", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
          <span style={{ color: "#c9a96e" }}>✦</span>
          <h2 style={{ color: "#e8dcc8", fontSize: "clamp(13px, 1.8vw, 17px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" }}>FEATURED COLLECTIONS</h2>
          <span style={{ color: "#c9a96e" }}>✦</span>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => scroll("left")} style={{ position: "absolute", left: "-20px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "#1a1a1a", border: "1px solid #2e2e2e", color: "#e8dcc8", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} />
          </button>
          <div ref={carousel} style={{ display: "flex", gap: "12px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "4px" }}>
            {displayProducts.map((p) => {
              const isAdded = addedId === p.id;
              const priceObj = p.variants[0]?.unitPrice || p.variants[0]?.price;
              return (
                <div key={p.id} style={{ flexShrink: 0, width: "180px" }}>
                  <div style={{ width: "180px", height: "180px", overflow: "hidden", background: "#1a1a1a", marginBottom: "10px", position: "relative", cursor: "pointer" }}
                    onClick={() => window.open(liveProducts.length > 0 ? `${FW}/products/${p.slug}` : FW, "_blank")}>
                    <img src={p.images?.[0]?.url || ""} alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "#e8dcc8", textTransform: "uppercase" }}>{p.name}</div>
                  {priceObj && <div style={{ fontSize: "12px", color: "#c9a96e", marginTop: "3px" }}>{formatPrice(priceObj.value, priceObj.currency)}</div>}
                  <button
                    onClick={() => addToCart(p)}
                    style={{ marginTop: "8px", width: "100%", background: isAdded ? "#22c55e" : "#c9a96e", color: "#0d0d0d", border: "none", padding: "7px 0", fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", cursor: "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
                  >
                    {isAdded ? <><CheckCircle size={12} /> ADDED</> : <><ShoppingCart size={12} /> ADD TO CART</>}
                  </button>
                </div>
              );
            })}
          </div>
          <button onClick={() => scroll("right")} style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "#1a1a1a", border: "1px solid #2e2e2e", color: "#e8dcc8", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 100, background: "#c9a96e", color: "#0d0d0d", border: "none", borderRadius: "50px", padding: "14px 22px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 24px rgba(201,169,110,0.4)" }}
        >
          <ShoppingCart size={18} />
          Cart ({cartCount}) — {formatPrice(cartTotal, cartCurrency)}
        </button>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }} onClick={() => setCartOpen(false)} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(380px, 100vw)", background: "#0d0d0d", borderLeft: "1px solid #2e2e2e", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", borderBottom: "1px solid #2e2e2e" }}>
              <span style={{ color: "#e8dcc8", fontWeight: 800, fontSize: "15px", letterSpacing: "0.08em" }}>YOUR CART ({cartCount})</span>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "#777", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#555" }}>
                  <ShoppingCart size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                  <p>Your cart is empty</p>
                </div>
              ) : cart.map((item) => (
                <div key={item.variantId} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #1e1e1e" }}>
                  {item.image && <img src={item.image} alt={item.productName} style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "6px" }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e8dcc8", fontSize: "12px", fontWeight: 700 }}>{item.productName}</div>
                    <div style={{ color: "#777", fontSize: "11px", marginTop: "2px" }}>{item.variantName}</div>
                    <div style={{ color: "#c9a96e", fontSize: "13px", fontWeight: 700, marginTop: "4px" }}>{formatPrice(item.price, item.currency)}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                    <button onClick={() => removeFromCart(item.variantId)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}><X size={14} /></button>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #2e2e2e", borderRadius: "20px", padding: "4px 10px" }}>
                      <button onClick={() => updateQty(item.variantId, item.quantity - 1)} style={{ background: "none", border: "none", color: "#e8dcc8", cursor: "pointer" }}><Minus size={12} /></button>
                      <span style={{ color: "#e8dcc8", fontSize: "12px", fontWeight: 700, minWidth: "16px", textAlign: "center" }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.variantId, item.quantity + 1)} style={{ background: "none", border: "none", color: "#e8dcc8", cursor: "pointer" }}><Plus size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: "16px 20px", borderTop: "1px solid #2e2e2e" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ color: "#777", fontSize: "13px" }}>Subtotal</span>
                  <span style={{ color: "#e8dcc8", fontWeight: 800 }}>{formatPrice(cartTotal, cartCurrency)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  style={{ width: "100%", background: "#c9a96e", color: "#0d0d0d", border: "none", padding: "14px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.12em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {checkingOut ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> LOADING…</> : <>CHECKOUT → FOURTHWALL</>}
                </button>
                <p style={{ textAlign: "center", fontSize: "10px", color: "#555", marginTop: "8px" }}>Secure checkout powered by Fourthwall</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
