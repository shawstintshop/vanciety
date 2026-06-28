/**
 * AdminDashboard — Vanciety Admin Control Panel
 * Password: PassWordWall
 * Admin: SHAW
 * Shows: members list, invite requests, approve/deny, site stats
 */

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Shield, Users, Mail, Check, X, Eye, EyeOff,
  RefreshCw, Clock, ChevronDown, LogOut, Loader2,
  UserCheck, UserX, Inbox, BarChart3
} from "lucide-react";

// ── Admin credentials (client-side gate — real security via Supabase RLS) ──
const ADMIN_PASSWORD = "PassWordWall";
const ADMIN_NAME = "SHAW";

const gold = "#c9a96e";
const parchment = "#e8dcc8";
const muted = "#9a8f7e";
const dark = "#0d0d0d";
const panel = "#111111";
const border = "#2e2e2e";
const red = "#e05c5c";
const green = "#5cb85c";

type WaitlistEntry = {
  id: string;
  email: string;
  status: string;
  source_page: string;
  interest: string[] | null;
  user_agent: string | null;
  created_at: string;
};

type Member = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: { display_name?: string };
};

type Tab = "overview" | "requests" | "members" | "vendors";

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [requests, setRequests] = useState<WaitlistEntry[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalRequests: 0, approved: 0, pending: 0, members: 0 });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError("");
      loadData();
    } else {
      setPwError("Incorrect password.");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load waitlist/invite requests
      const { data: reqs } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (reqs) {
        setRequests(reqs);
        setStats(prev => ({
          ...prev,
          totalRequests: reqs.length,
          approved: reqs.filter(r => r.status === "approved").length,
          pending: reqs.filter(r => r.status === "waitlist" || r.status === "pending").length,
        }));
      }

      // Load auth users via profiles table
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (profiles) {
        setMembers(profiles as unknown as Member[]);
        setStats(prev => ({ ...prev, members: profiles.length }));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const updateRequestStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Request ${status}`);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      setStats(prev => ({
        ...prev,
        approved: status === "approved" ? prev.approved + 1 : prev.approved,
        pending: status === "approved" ? prev.pending - 1 : prev.pending,
      }));
    }
  };

  const parseUserAgent = (ua: string | null) => {
    if (!ua) return { name: "—", van: "—", why: "—" };
    const name = ua.match(/name:([^|]*)/)?.[1] || "—";
    const van = ua.match(/van:([^|]*)/)?.[1] || "—";
    const why = ua.match(/why:(.*)/)?.[1] || "—";
    return { name, van, why };
  };

  const statusColor = (s: string) => {
    if (s === "approved") return green;
    if (s === "denied" || s === "rejected") return red;
    return gold;
  };

  // ── Login Gate ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ background: dark, minHeight: "100vh", color: parchment }}>
        <Header />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20 }}>
          <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 12, padding: 40, width: "100%", maxWidth: 400 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, background: "#1a1600", border: `2px solid ${gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Shield size={24} color={gold} />
              </div>
              <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Admin Access</div>
              <h1 style={{ color: parchment, fontSize: 22, fontWeight: 800, margin: 0 }}>Vanciety Control Panel</h1>
              <p style={{ color: muted, fontSize: 13, margin: "6px 0 0" }}>Authorized personnel only</p>
            </div>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Admin Name</label>
                <div style={{ background: "#1a1a1a", border: `1px solid ${border}`, borderRadius: 6, padding: "10px 14px", color: gold, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em" }}>{ADMIN_NAME}</div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={pw}
                    onChange={e => { setPw(e.target.value); setPwError(""); }}
                    placeholder="Enter admin password"
                    autoFocus
                    style={{ background: "#1a1a1a", border: `1px solid ${pwError ? red : border}`, borderRadius: 6, padding: "10px 40px 10px 14px", color: parchment, fontSize: 14, width: "100%", outline: "none", boxSizing: "border-box" }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: muted, padding: 0 }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {pwError && <div style={{ color: red, fontSize: 12, marginTop: 6 }}>{pwError}</div>}
              </div>
              <button type="submit" style={{ width: "100%", background: gold, color: dark, border: "none", borderRadius: 6, padding: "12px", fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: "0.08em" }}>
                ACCESS CONTROL PANEL
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ─────────────────────────────────────────────────────────
  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={14} /> },
    { id: "requests", label: `Invite Requests (${stats.pending})`, icon: <Inbox size={14} /> },
    { id: "members", label: `Members (${stats.members})`, icon: <Users size={14} /> },
    { id: "vendors", label: "Vendors", icon: <UserCheck size={14} /> },
  ];

  return (
    <div style={{ background: dark, minHeight: "100vh", color: parchment }}>
      <Header />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 16px 40px" }}>

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>
              <Shield size={12} style={{ display: "inline", marginRight: 6 }} />Admin Panel
            </div>
            <h1 style={{ color: parchment, fontSize: 26, fontWeight: 800, margin: 0 }}>Vanciety Control Panel</h1>
            <p style={{ color: muted, fontSize: 13, margin: "4px 0 0" }}>Logged in as <span style={{ color: gold, fontWeight: 700 }}>{ADMIN_NAME}</span></p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={loadData} style={{ background: "#1a1a1a", border: `1px solid ${border}`, color: muted, padding: "8px 14px", fontSize: 12, cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button onClick={() => setAuthed(false)} style={{ background: "#1a1a1a", border: `1px solid ${border}`, color: red, padding: "8px 14px", fontSize: 12, cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total Requests", val: stats.totalRequests, color: parchment },
            { label: "Pending", val: stats.pending, color: gold },
            { label: "Approved", val: stats.approved, color: green },
            { label: "Members", val: stats.members, color: "#8ab4c9" },
          ].map(s => (
            <div key={s.label} style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ color: muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: 28, fontWeight: 800, fontFamily: "monospace" }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, borderBottom: `1px solid ${border}`, marginBottom: 20 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "10px 16px",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              color: tab === t.id ? gold : muted,
              borderBottom: tab === t.id ? `2px solid ${gold}` : "2px solid transparent",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 40, color: muted }}>
            <Loader2 size={24} style={{ animation: "spin 1s linear infinite", display: "inline" }} />
            <div style={{ marginTop: 8, fontSize: 13 }}>Loading data...</div>
          </div>
        )}

        {/* Overview */}
        {!loading && tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
              <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Recent Invite Requests</div>
              {requests.slice(0, 5).map(r => {
                const { name } = parseUserAgent(r.user_agent);
                return (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${border}22` }}>
                    <div>
                      <div style={{ color: parchment, fontSize: 13, fontWeight: 600 }}>{name !== "—" ? name : r.email}</div>
                      <div style={{ color: muted, fontSize: 11 }}>{r.email}</div>
                    </div>
                    <div style={{ color: statusColor(r.status), fontSize: 11, fontWeight: 700, textTransform: "uppercase", background: `${statusColor(r.status)}15`, padding: "2px 8px", borderRadius: 4 }}>{r.status}</div>
                  </div>
                );
              })}
              {requests.length === 0 && <div style={{ color: muted, fontSize: 13 }}>No requests yet.</div>}
            </div>
            <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
              <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Quick Links</div>
              {[
                { label: "View Sign Up Page", url: "/auth" },
                { label: "View Waitlist Page", url: "/waitlist" },
                { label: "View Member Dashboard", url: "/dashboard" },
                { label: "Admin Vendors Page", url: "/admin-vendors" },
                { label: "Vendor Signup", url: "/vendor-signup" },
              ].map(link => (
                <a key={link.url} href={link.url} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${border}22`, color: parchment, textDecoration: "none", fontSize: 13 }}>
                  {link.label} <span style={{ color: gold }}>→</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Invite Requests */}
        {!loading && tab === "requests" && (
          <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
            <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
              Invite Requests — {requests.length} total
            </div>
            {requests.length === 0 && <div style={{ color: muted, fontSize: 13 }}>No invite requests yet. Share the waitlist link: <a href="/waitlist" style={{ color: gold }}>vanciety.com/waitlist</a></div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {requests.map(r => {
                const { name, van, why } = parseUserAgent(r.user_agent);
                return (
                  <div key={r.id} style={{ background: dark, border: `1px solid ${border}`, borderRadius: 8, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ color: parchment, fontSize: 15, fontWeight: 700 }}>{name !== "—" ? name : "Anonymous"}</div>
                        <div style={{ color: gold, fontSize: 13, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                          <Mail size={12} /> {r.email}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ color: statusColor(r.status), fontSize: 11, fontWeight: 700, textTransform: "uppercase", background: `${statusColor(r.status)}15`, padding: "3px 10px", borderRadius: 4 }}>{r.status}</div>
                        <div style={{ color: muted, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} /> {new Date(r.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 12 }}>
                      <div>
                        <div style={{ color: muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>Van Model</div>
                        <div style={{ color: parchment, fontSize: 13 }}>{van !== "—" ? van : "Not specified"}</div>
                      </div>
                      <div>
                        <div style={{ color: muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>Why They Want to Join</div>
                        <div style={{ color: parchment, fontSize: 13, lineHeight: 1.5 }}>{why !== "—" ? why : "Not provided"}</div>
                      </div>
                    </div>
                    {r.status !== "approved" && r.status !== "denied" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => updateRequestStatus(r.id, "approved")} style={{ background: "#0d1f0d", border: `1px solid ${green}`, color: green, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", borderRadius: 4, display: "flex", alignItems: "center", gap: 6 }}>
                          <Check size={13} /> Approve
                        </button>
                        <button onClick={() => updateRequestStatus(r.id, "denied")} style={{ background: "#1f0d0d", border: `1px solid ${red}`, color: red, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", borderRadius: 4, display: "flex", alignItems: "center", gap: 6 }}>
                          <X size={13} /> Deny
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Members */}
        {!loading && tab === "members" && (
          <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
            <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
              Registered Members — {members.length} total
            </div>
            {members.length === 0 && (
              <div style={{ color: muted, fontSize: 13 }}>
                No members yet, or profiles table is empty. Members register at <a href="/auth" style={{ color: gold }}>vanciety.com/auth</a>
              </div>
            )}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "monospace" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {["Name", "Email / ID", "Joined", "Last Sign In"].map(h => (
                      <th key={h} style={{ color: muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 12px", textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, i) => (
                    <tr key={m.id} style={{ borderBottom: `1px solid ${border}22`, background: i % 2 === 0 ? "transparent" : "#0d0d0d" }}>
                      <td style={{ padding: "8px 12px", color: parchment, fontWeight: 600 }}>
                        {(m as any).display_name || (m as any).username || "—"}
                      </td>
                      <td style={{ padding: "8px 12px", color: muted }}>
                        {(m as any).email || m.id?.substring(0, 8) + "..."}
                      </td>
                      <td style={{ padding: "8px 12px", color: muted }}>
                        {m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td style={{ padding: "8px 12px", color: muted }}>
                        {m.last_sign_in_at ? new Date(m.last_sign_in_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vendors tab */}
        {!loading && tab === "vendors" && (
          <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
            <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Vendor Management</div>
            <p style={{ color: muted, fontSize: 13, marginBottom: 16 }}>Full vendor approval and management is on the dedicated vendor admin page.</p>
            <a href="/admin-vendors" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: gold, color: dark, padding: "10px 20px", borderRadius: 6, fontWeight: 800, fontSize: 13, textDecoration: "none", letterSpacing: "0.08em" }}>
              Open Vendor Admin →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
