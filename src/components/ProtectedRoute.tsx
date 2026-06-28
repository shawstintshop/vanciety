/**
 * ProtectedRoute — Members-only wall
 * Wraps any page that requires authentication.
 * If not logged in → shows a branded gate with sign in / join options.
 */

import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Shield, Lock, Users, ArrowRight, Loader2 } from "lucide-react";

const gold = "#c9a96e";
const parchment = "#e8dcc8";
const muted = "#9a8f7e";
const dark = "#0d0d0d";
const panel = "#111111";
const border = "#2e2e2e";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Optional label shown on the gate (e.g. "Member Dashboard") */
  label?: string;
}

export default function ProtectedRoute({ children, label = "Members Only" }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Still resolving session
  if (loading) {
    return (
      <div style={{ background: dark, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={28} color={gold} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // Authenticated — render the page
  if (user) return <>{children}</>;

  // Not authenticated — show the members wall
  return (
    <div style={{ background: dark, minHeight: "100vh", color: parchment, fontFamily: "system-ui, sans-serif" }}>
      {/* Topo grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `radial-gradient(circle at 50% 50%, #1a1600 0%, ${dark} 70%)`,
        backgroundSize: "cover",
      }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, #c9a96e 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #c9a96e 0px, transparent 1px, transparent 40px)", backgroundSize: "40px 40px" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>

          {/* Lock icon */}
          <div style={{ width: 72, height: 72, background: "#1a1600", border: `2px solid ${gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Lock size={28} color={gold} />
          </div>

          {/* Label */}
          <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
            <Shield size={11} style={{ display: "inline", marginRight: 6 }} />
            {label}
          </div>

          <h1 style={{ color: parchment, fontSize: 28, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Members Only
          </h1>
          <p style={{ color: muted, fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
            This area is for Vanciety members. Sign in to your account or request an invite to join the community.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            <Link to="/auth" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: gold, color: dark, padding: "14px 24px", borderRadius: 8,
              fontWeight: 800, fontSize: 15, textDecoration: "none", letterSpacing: "0.05em",
            }}>
              Sign In to Your Account <ArrowRight size={16} />
            </Link>
            <Link to="/waitlist" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "transparent", color: parchment, padding: "13px 24px", borderRadius: 8,
              fontWeight: 700, fontSize: 15, textDecoration: "none", letterSpacing: "0.05em",
              border: `1px solid ${border}`,
            }}>
              <Users size={16} /> Request an Invite
            </Link>
          </div>

          {/* Member benefits */}
          <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: "20px 24px", textAlign: "left" }}>
            <div style={{ color: muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Member Benefits</div>
            {[
              "Van Cards — your digital van identity",
              "Member dashboard & personalized feed",
              "GPS opt-in & friend finder",
              "Post in forums & community boards",
              "Exclusive vendor deals & early access",
              "AI Concierge — van life assistant",
            ].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", color: parchment, fontSize: 13 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: gold, flexShrink: 0 }} />
                {b}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, color: muted, fontSize: 12 }}>
            Already have an account? <Link to="/auth" style={{ color: gold, textDecoration: "none", fontWeight: 700 }}>Sign in here →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
