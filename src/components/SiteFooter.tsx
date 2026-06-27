/**
 * SiteFooter — Matches reference merch page footer
 * - Matte black background
 * - Logo + tagline left
 * - Join the Crew email signup
 * - Follow the Journey social links
 * - Trust badges: Secure Checkout, Hassle Free Returns, Fast Shipping
 * - Bottom bar: copyright + policy links
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube, Lock, RotateCcw, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subDone, setSubDone] = useState(false);

  const handleSubscribe = async () => {
    if (!email || subLoading || subDone) return;
    setSubLoading(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email,
        source_page: 'footer',
        status: 'active',
        email_opt_in: true,
      });
      if (error && error.code !== '23505') throw error;
      setSubDone(true);
      setEmail('');
    } catch {
      // silently ignore
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <footer style={{ background: "#0a0a0a", borderTop: "1px solid #2e2e2e" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 32px" }}>
        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>

          {/* Logo + tagline */}
          <div>
            <img src="/images/vanciety-logo-badge.png" alt="Vanciety" style={{ height: "56px", marginBottom: "12px" }} />
            <p style={{ fontSize: "12px", color: "#777", lineHeight: 1.6 }}>
              More than a brand.<br />It's a way of life.
            </p>
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { label: "Forum", to: "/forum" },
                { label: "Events", to: "/events" },
                { label: "Marketplace", to: "/marketplace" },
                { label: "Merch Store", to: "/merch" },
              ].map(({ label, to }) => (
                <Link key={label} to={to} style={{ fontSize: "12px", color: "#555", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >{label}</Link>
              ))}
            </div>
          </div>

          {/* Join the Crew */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "#e8dcc8", marginBottom: "8px", textTransform: "uppercase" }}>
              JOIN THE CREW
            </div>
            <p style={{ fontSize: "12px", color: "#777", marginBottom: "12px", lineHeight: 1.5 }}>
              Get early access to drops, exclusive offers & more.
            </p>
            <div style={{ display: "flex" }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, background: "#1a1a1a", border: "1px solid #2e2e2e", borderRight: "none", color: "#e8dcc8", padding: "10px 12px", fontSize: "12px", outline: "none" }}
              />
              <button
                onClick={handleSubscribe}
                disabled={subLoading || subDone}
                style={{ background: subDone ? "#2e7d32" : "#c9a96e", border: "none", color: subDone ? "#fff" : "#0d0d0d", padding: "10px 16px", cursor: subDone ? "default" : "pointer", fontWeight: 800, fontSize: "14px", minWidth: "40px" }}
              >{subDone ? "✓" : subLoading ? "…" : "→"}</button>
            </div>
          </div>

          {/* Follow the Journey */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "#e8dcc8", marginBottom: "12px", textTransform: "uppercase" }}>
              FOLLOW THE JOURNEY
            </div>
            <p style={{ fontSize: "12px", color: "#777", marginBottom: "12px" }}>@vanciety.co</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <a href="https://instagram.com/vanciety.co" target="_blank" rel="noopener noreferrer" style={{ color: "#777" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
              ><Instagram size={20} /></a>
              <a href="https://youtube.com/@vanciety" target="_blank" rel="noopener noreferrer" style={{ color: "#777" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
              ><Youtube size={20} /></a>
              <a href="https://tiktok.com/@vanciety" target="_blank" rel="noopener noreferrer" style={{ color: "#777", fontSize: "14px", fontWeight: 700 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
              >TK</a>
              <a href="https://facebook.com/vanciety" target="_blank" rel="noopener noreferrer" style={{ color: "#777", fontSize: "14px", fontWeight: 700 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
              >FB</a>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { icon: Lock, label: "SECURE CHECKOUT", sub: "Safe, fast & encrypted." },
              { icon: RotateCcw, label: "HASSLE FREE RETURNS", sub: "30 day returns on all orders." },
              { icon: Truck, label: "FAST SHIPPING", sub: "Ships within 3-5 business days." },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <Icon size={15} style={{ color: "#c9a96e", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "#e8dcc8" }}>{label}</div>
                  <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "11px", color: "#444" }}>© 2025 Vanciety. All rights reserved.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Service", "Shipping Policy"].map((label) => (
              <a key={label} href="#" style={{ fontSize: "11px", color: "#444", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
