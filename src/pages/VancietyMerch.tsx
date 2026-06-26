/**
 * VancietyMerch — Official Vanciety Merch Store
 * Layout matches reference: announcement bar → nav → hero → trust bar → category grid → featured carousel → footer
 * Colors: #0d0d0d bg, #c9a96e gold, #e8dcc8 warm white
 * All purchases redirect to vanciety-shop.fourthwall.com
 */

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Search, User, ChevronLeft, ChevronRight,
  Shield, Mountain, Leaf, Users, Truck, RotateCcw, Lock,
  Instagram, Youtube,
} from "lucide-react";

const FW = "https://vanciety-shop.fourthwall.com";

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

      {/* Featured Collections */}
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
            {FEATURED.map((p) => (
              <a key={p.name} href={FW} target="_blank" rel="noopener noreferrer"
                style={{ flexShrink: 0, width: "180px", textDecoration: "none" }}>
                <div style={{ width: "180px", height: "180px", overflow: "hidden", background: "#1a1a1a", marginBottom: "10px" }}>
                  <img src={p.img} alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "#e8dcc8", textTransform: "uppercase" }}>{p.name}</div>
                <div style={{ fontSize: "12px", color: "#c9a96e", marginTop: "3px" }}>{p.price}</div>
              </a>
            ))}
          </div>
          <button onClick={() => scroll("right")} style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "#1a1a1a", border: "1px solid #2e2e2e", color: "#e8dcc8", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#0a0a0a", borderTop: "1px solid #2e2e2e", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
            <div>
              <img src="/images/vanciety-logo-badge.png" alt="Vanciety" style={{ height: "56px", marginBottom: "12px" }} />
              <p style={{ fontSize: "12px", color: "#777", lineHeight: 1.6 }}>More than a brand.<br />It's a way of life.</p>
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "#e8dcc8", marginBottom: "8px", textTransform: "uppercase" }}>JOIN THE CREW</div>
              <p style={{ fontSize: "12px", color: "#777", marginBottom: "12px", lineHeight: 1.5 }}>Get early access to drops, exclusive offers & more.</p>
              <div style={{ display: "flex" }}>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ flex: 1, background: "#1a1a1a", border: "1px solid #2e2e2e", borderRight: "none", color: "#e8dcc8", padding: "10px 12px", fontSize: "12px", outline: "none" }} />
                <button onClick={() => { if (email) { alert("You're in! Welcome to the crew."); setEmail(""); } }}
                  style={{ background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "10px 16px", cursor: "pointer", fontWeight: 800, fontSize: "14px" }}>→</button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "#e8dcc8", marginBottom: "12px", textTransform: "uppercase" }}>FOLLOW THE JOURNEY</div>
              <p style={{ fontSize: "12px", color: "#777", marginBottom: "12px" }}>@vanciety.co</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href="https://instagram.com/vanciety.co" target="_blank" rel="noopener noreferrer" style={{ color: "#777" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}><Instagram size={20} /></a>
                <a href="https://youtube.com/@vanciety" target="_blank" rel="noopener noreferrer" style={{ color: "#777" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}><Youtube size={20} /></a>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { icon: Lock, label: "SECURE CHECKOUT", sub: "Safe, fast & encrypted." },
                { icon: RotateCcw, label: "HASSLE FREE RETURNS", sub: "30 day returns on all orders." },
                { icon: Truck, label: "FAST SHIPPING", sub: "Ships within 3-5 business days." },
              ].map((b) => (
                <div key={b.label} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <b.icon size={15} style={{ color: "#c9a96e", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "#e8dcc8" }}>{b.label}</div>
                    <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "11px", color: "#444" }}>© 2025 Vanciety. All rights reserved.</p>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Privacy Policy", "Terms of Service", "Shipping Policy"].map((label) => (
                <a key={label} href="#" style={{ fontSize: "11px", color: "#444", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}>{label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
