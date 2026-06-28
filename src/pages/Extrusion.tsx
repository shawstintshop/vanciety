/**
 * Extrusion.tsx — Vanciety Aluminum Extrusion Build Guide
 * Design: matte black (#0d0d0d) + gold (#c9a96e) + parchment (#e8dcc8)
 * The definitive van life aluminum extrusion reference.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Ruler, Package, Wrench, DollarSign, ChevronRight, ExternalLink,
  Layers, AlertTriangle, CheckCircle, Info, Hammer, Zap, Globe,
  BarChart2, BookOpen, Printer, ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: "size",      label: "Size Guide",      icon: Ruler },
  { id: "supplier",  label: "Supplier Guide",  icon: DollarSign },
  { id: "builds",    label: "Build Examples",  icon: Layers },
  { id: "tools",     label: "Tool List",       icon: Wrench },
  { id: "fasteners", label: "Fasteners",       icon: Package },
];

// ── Size guide data ───────────────────────────────────────────────────────────
const SIZE_GUIDE = [
  { app: "Cabinet corner post",        profile: "1515",         why: "Best all-around; 350 lb rating, most accessories available",         recommended: true },
  { app: "Horizontal span under 48\"", profile: "1515",         why: "Sufficient stiffness for most cabinet spans",                         recommended: true },
  { app: "Horizontal span 48–72\"",    profile: "1530",         why: "2× bending stiffness of 1515; use for bed rails and long shelves",    recommended: false },
  { app: "Horizontal span over 72\"",  profile: "1545",         why: "3× bending stiffness; required for full-length bed rails",            recommended: false },
  { app: "Heavy corner post (>100 lb)","profile": "3030",       why: "Equivalent to two 1515 bonded; 900 lb rating",                        recommended: false },
  { app: "Roof rack cross member",     profile: "2525",         why: "1,200 lb rating; standard for all roof rack cross members",           recommended: false },
  { app: "Roof rack longitudinal rail","profile": "2550",       why: "2,800 lb rating; maximum roof rack structural strength",              recommended: false },
  { app: "Light accessories",          profile: "1010",         why: "120 lb rating; saves weight on small non-structural items",           recommended: false },
  { app: "European van interior",      profile: "20×40mm metric", why: "Compatible with European hardware ecosystem (Ducato, Crafter, Master)", recommended: false },
  { app: "Budget build",               profile: "Generic 20×20mm", why: "60% cheaper than 80/20; verify slot dimensions before ordering hardware", recommended: false },
];

// ── Profile specs ─────────────────────────────────────────────────────────────
const PROFILES = [
  { name: "1515-Lite", size: "1.5\"×1.5\"", weight: "0.28", load: "180",   cost: "$3.20", use: "Light shelves, overhead accessories",    recommended: false },
  { name: "1515",      size: "1.5\"×1.5\"", weight: "0.48", load: "350",   cost: "$4.50", use: "All interior cabinets — the standard",   recommended: true  },
  { name: "1515-S",    size: "1.5\"×1.5\"", weight: "0.48", load: "350",   cost: "$5.20", use: "Smooth finish for visible surfaces",     recommended: false },
  { name: "1530",      size: "1.5\"×3.0\"", weight: "0.72", load: "650",   cost: "$6.80", use: "Bed rails, long horizontal spans",       recommended: false },
  { name: "1545",      size: "1.5\"×4.5\"", weight: "1.08", load: "1,100", cost: "$9.50", use: "Very long bed rails (>72\")",            recommended: false },
  { name: "3030",      size: "3.0\"×3.0\"", weight: "0.96", load: "900",   cost: "$12.50",use: "Heavy cabinet corner posts",             recommended: false },
  { name: "2525",      size: "2.5\"×2.5\"", weight: "0.84", load: "1,200", cost: "$14.50",use: "Roof rack cross members",                recommended: false },
  { name: "2550",      size: "2.5\"×5.0\"", weight: "1.48", load: "2,800", cost: "$22.00",use: "Roof rack longitudinal rails",           recommended: false },
];

// ── US Suppliers ──────────────────────────────────────────────────────────────
const US_SUPPLIERS = [
  { name: "Tnutz",        price: "−15 to −30%", cut: true,  cad: true,  best: "Best value US builds",              url: "https://www.tnutz.com",        recommended: true  },
  { name: "80/20 Inc.",   price: "Baseline",    cut: true,  cad: true,  best: "Premium builds, widest selection",  url: "https://8020.net",             recommended: false },
  { name: "Misumi USA",   price: "+10 to +20%", cut: true,  cad: true,  best: "Precision, free CAD downloads",     url: "https://us.misumi-ec.com",     recommended: false },
  { name: "McMaster-Carr",price: "+20 to +30%", cut: false, cad: true,  best: "Hardware, T-nuts, next-day ship",   url: "https://www.mcmaster.com",     recommended: false },
  { name: "Faztek",       price: "−10%",        cut: true,  cad: true,  best: "Mid-range 15-series builds",        url: "https://www.faztek.net",       recommended: false },
  { name: "Grainger",     price: "+20%",        cut: false, cad: false, best: "Urgent orders, local pickup",       url: "https://www.grainger.com",     recommended: false },
  { name: "Amazon",       price: "−40 to −60%", cut: false, cad: false, best: "Budget metric extrusion, tools",    url: "https://www.amazon.com",       recommended: false },
];

// ── EU Suppliers ──────────────────────────────────────────────────────────────
const EU_SUPPLIERS = [
  { name: "Bosch Rexroth", country: "Germany", series: "30/45/60/90mm", tier: "Premium",  best: "Best industrial quality; full CAD library", url: "https://www.boschrexroth.com" },
  { name: "item24",        country: "Germany", series: "item 6/8",      tier: "Premium",  best: "API available; excellent online CAD configurator", url: "https://www.item24.com" },
  { name: "MiniTec",       country: "Germany", series: "Metric 20–60mm",tier: "Premium",  best: "Precision German manufacturing; strong CAD support", url: "https://www.minitec.de" },
  { name: "AliExpress",    country: "China",   series: "20/30/40mm",    tier: "Budget",   best: "Cheapest option; 3–4 week shipping; variable quality", url: "https://www.aliexpress.com" },
];

// ── Build examples ────────────────────────────────────────────────────────────
const BUILDS = [
  { name: "Sprinter 144 Galley Cabinet",   series: "15-series", cost: "$680",   hours: "24", weight: "45 lb", category: "Interior" },
  { name: "Sprinter 144 Roof Rack",        series: "25-series", cost: "$1,200", hours: "40", weight: "85 lb", category: "Exterior" },
  { name: "Ford Transit 148 Bed Frame",    series: "15-series", cost: "$420",   hours: "16", weight: "38 lb", category: "Interior" },
  { name: "ProMaster 136 Electrical Cabinet",series:"15-series",cost: "$380",   hours: "20", weight: "22 lb", category: "Interior" },
  { name: "Universal Solar Panel Mount",   series: "15-series", cost: "$180",   hours: "8",  weight: "12 lb", category: "Universal" },
  { name: "Sprinter 170 Upper Cabinet",    series: "15-series", cost: "$320",   hours: "14", weight: "28 lb", category: "Interior" },
  { name: "Universal Fridge Slide",        series: "15-series", cost: "$145",   hours: "6",  weight: "14 lb", category: "Universal" },
  { name: "Transit 148 Wheel Well Boxes",  series: "15-series", cost: "$280",   hours: "12", weight: "24 lb", category: "Interior" },
  { name: "Universal 3-Drawer System",     series: "15-series", cost: "$320",   hours: "14", weight: "26 lb", category: "Universal" },
  { name: "Sprinter 144 Battery Cabinet",  series: "15-series", cost: "$220",   hours: "10", weight: "18 lb", category: "Interior" },
];

// ── Must-have tools ───────────────────────────────────────────────────────────
const MUST_HAVE_TOOLS = [
  { tool: "12\" Sliding Miter Saw",  model: "DEWALT DWS779",        price: "$499", why: "Cuts extrusion to length accurately; handles all profile widths", critical: false },
  { tool: "Non-Ferrous Blade",       model: "Freud LU77M012",       price: "$89",  why: "Standard blades grab aluminum — this blade is mandatory for safe cuts", critical: true },
  { tool: "Deburring Tool",          model: "Irwin 2077704",        price: "$18",  why: "Cut ends are razor-sharp without deburring; prevents injury and panel damage", critical: false },
  { tool: "Hex Key Sets",            model: "Bondhus Metric + Imp", price: "$50",  why: "Assembly of all T-slot fasteners — need both metric and imperial sets", critical: false },
  { tool: "Blue Loctite 243",        model: "Loctite 243",          price: "$8",   why: "Prevents vibration loosening — apply to every fastener in the build", critical: true },
  { tool: "Safety Glasses",          model: "DEWALT DPG82-11C",     price: "$15",  why: "Aluminum chips fly at high speed — always wear when cutting", critical: false },
];

const NICE_TOOLS = [
  { tool: "Digital Calipers",   model: "Mitutoyo 500-196-30",      price: "$85"  },
  { tool: "Laser Level",        model: "Bosch GLL3-330CG",         price: "$199" },
  { tool: "Torque Wrench",      model: "TEKTON 24320",             price: "$38"  },
  { tool: "Corner Clamps",      model: "Milescraft 1406",          price: "$35"  },
  { tool: "Rivnut Tool",        model: "Astro Pneumatic 1442",     price: "$65"  },
];

// ── Fastener reference ────────────────────────────────────────────────────────
const FASTENERS_IMPERIAL = [
  { type: "T-nut",          size: "3/8-16",       use: "Standard 15-series T-nut",    pn: "McMaster 3259T17" },
  { type: "Cap Screw",      size: "3/8-16 × 1\"", use: "Standard bracket fastener",   pn: "91251A625" },
  { type: "Cap Screw",      size: "3/8-16 × 3/4\"",use:"Thin bracket attachment",     pn: "91251A621" },
  { type: "Anchor Fastener",size: "3/8-16",       use: "End-load attachment",          pn: "80/20 #3320" },
  { type: "Double Anchor",  size: "3/8-16",       use: "High-load end attachment",     pn: "80/20 #3321" },
];

const FASTENERS_METRIC = [
  { type: "T-nut",     size: "M5",        use: "Standard 20mm metric T-nut",  pn: "Most common" },
  { type: "Cap Screw", size: "M5 × 10mm", use: "Standard bracket attachment", pn: "ISO 4762" },
  { type: "Cap Screw", size: "M5 × 12mm", use: "Thicker bracket attachment",  pn: "ISO 4762" },
  { type: "T-nut",     size: "M4",        use: "Light-duty 20mm metric",      pn: "Less common" },
  { type: "T-nut",     size: "M6",        use: "Bosch Rexroth 30mm series",   pn: "ISO standard" },
];

// ── Component ─────────────────────────────────────────────────────────────────
const Extrusion = () => {
  const [activeTab, setActiveTab] = useState("size");
  const [search, setSearch] = useState("");
  const [supplierRegion, setSupplierRegion] = useState<"us" | "eu">("us");

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8" }}>
      <Header />

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #111 60%, #1a150a 100%)", borderBottom: "1px solid #2e2e2e" }} className="pt-16 sm:pt-20">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)", color: "#c9a96e" }} className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">Build Guide</span>
                <span style={{ color: "#5a5248" }} className="text-[10px] font-bold uppercase tracking-widest">Aluminum Extrusion</span>
              </div>
              <h1 style={{ fontFamily: "monospace", color: "#e8dcc8" }} className="text-3xl font-black sm:text-4xl">
                ALUMINUM EXTRUSION<br />
                <span style={{ color: "#c9a96e" }}>BUILD SYSTEM</span>
              </h1>
              <p style={{ color: "#9a8f7e" }} className="mt-2 max-w-xl text-sm leading-relaxed">
                The definitive van life extrusion reference — size guide, supplier comparison, real build examples, fastener specs, and tool list. Everything you need to build right the first time.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/3d-files" style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)", color: "#c9a96e" }} className="flex items-center gap-2 rounded px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[rgba(201,169,110,0.2)]">
                <Printer className="h-4 w-4" /> 3D Print Files
              </Link>
              <Link to="/resources" style={{ background: "#c9a96e", color: "#0d0d0d" }} className="flex items-center gap-2 rounded px-4 py-2 text-xs font-black uppercase tracking-wider">
                <BookOpen className="h-4 w-4" /> All Guides
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { val: "8",   lbl: "Profile Specs" },
              { val: "11",  lbl: "US + EU Suppliers" },
              { val: "10",  lbl: "Build Templates" },
              { val: "50+", lbl: "Cut List Items" },
            ].map(({ val, lbl }) => (
              <div key={lbl} style={{ background: "#141414", border: "1px solid #2e2e2e" }} className="rounded p-4 text-center">
                <div style={{ fontFamily: "monospace", color: "#c9a96e" }} className="text-2xl font-black">{val}</div>
                <div style={{ color: "#5a5248" }} className="mt-1 text-[11px] font-bold uppercase tracking-wider">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tab bar ── */}
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid #2e2e2e", position: "sticky", top: "64px", zIndex: 30 }}>
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === id ? "2px solid #c9a96e" : "2px solid transparent",
                  color: activeTab === id ? "#c9a96e" : "#5a5248",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "14px 20px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "color 0.15s",
                }}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="mx-auto max-w-[1400px] px-4 py-8">

        {/* SIZE GUIDE */}
        {activeTab === "size" && (
          <div className="flex flex-col gap-8">
            <div>
              <h2 style={{ fontFamily: "monospace", color: "#e8dcc8" }} className="text-xl font-black">MATCH THE SERIES TO THE LOAD</h2>
              <p style={{ color: "#9a8f7e" }} className="mt-1 text-sm">Oversizing wastes money. Undersizing fails. Use this table to pick the right profile for every application.</p>
            </div>

            {/* Application → Profile table */}
            <div style={{ border: "1px solid #2e2e2e", overflow: "hidden" }}>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={{ background: "#1f1f1f", borderBottom: "2px solid #c9a96e" }}>
                    <th style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 16px", textAlign: "left" }}>Application</th>
                    <th style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 16px", textAlign: "left" }}>Recommended Profile</th>
                    <th style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 16px", textAlign: "left" }}>Why</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map((row, i) => (
                    <tr key={i} style={{ background: row.recommended ? "rgba(201,169,110,0.07)" : i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #2e2e2e", borderTop: row.recommended ? "1px solid rgba(201,169,110,0.3)" : undefined }}>
                      <td style={{ padding: "10px 16px", color: "#e8dcc8", fontWeight: 500 }}>{row.app}</td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, color: row.recommended ? "#c9a96e" : "#d4b87a" }}>
                        {row.profile}
                        {row.recommended && <span style={{ marginLeft: "8px", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)", color: "#c9a96e", fontSize: "9px", fontWeight: 700, padding: "1px 6px", letterSpacing: "1px" }}>★ START HERE</span>}
                      </td>
                      <td style={{ padding: "10px 16px", color: "#9a8f7e", fontSize: "12px" }}>{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Profile specs table */}
            <div>
              <h3 style={{ fontFamily: "monospace", color: "#e8dcc8" }} className="mb-4 text-base font-black">PROFILE SPECS AT A GLANCE</h3>
              <div style={{ border: "1px solid #2e2e2e", overflow: "hidden" }}>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr style={{ background: "#1f1f1f", borderBottom: "2px solid #c9a96e" }}>
                      {["Profile", "Size", "lb/ft", "Max Load", "$/ft", "Van Use Case"].map((h, i) => (
                        <th key={h} style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 14px", textAlign: i >= 2 && i <= 4 ? "right" : "left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PROFILES.map((p, i) => (
                      <tr key={p.name} style={{ background: p.recommended ? "rgba(201,169,110,0.07)" : i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #2e2e2e", borderTop: p.recommended ? "1px solid rgba(201,169,110,0.3)" : undefined }}>
                        <td style={{ padding: "9px 14px", fontFamily: "monospace", fontWeight: 700, color: p.recommended ? "#c9a96e" : "#d4b87a" }}>
                          {p.name}{p.recommended && <span style={{ marginLeft: "6px", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)", color: "#c9a96e", fontSize: "9px", fontWeight: 700, padding: "1px 5px" }}>★</span>}
                        </td>
                        <td style={{ padding: "9px 14px", color: "#e8dcc8" }}>{p.size}</td>
                        <td style={{ padding: "9px 14px", fontFamily: "monospace", fontWeight: 700, color: "#9a8f7e", textAlign: "right" }}>{p.weight}</td>
                        <td style={{ padding: "9px 14px", fontFamily: "monospace", fontWeight: 700, color: p.recommended ? "#c9a96e" : "#9a8f7e", textAlign: "right" }}>{p.load} lb</td>
                        <td style={{ padding: "9px 14px", fontFamily: "monospace", fontWeight: 700, color: "#9a8f7e", textAlign: "right" }}>{p.cost}</td>
                        <td style={{ padding: "9px 14px", color: "#9a8f7e", fontSize: "12px" }}>{p.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rules */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.3)", borderLeft: "3px solid #c9a96e" }} className="flex gap-3 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a96e]" />
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Rule</div>
                  <p style={{ color: "#9a8f7e", fontSize: "13px", lineHeight: 1.6 }}>For any interior cabinet, <strong style={{ color: "#e8dcc8" }}>start with 1515</strong>. Only upgrade to 1530 or heavier when spans exceed 48" or loads exceed 400 lb.</p>
                </div>
              </div>
              <div style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.3)", borderLeft: "3px solid #c9a96e" }} className="flex gap-3 p-4">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a96e]" />
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Tip</div>
                  <p style={{ color: "#9a8f7e", fontSize: "13px", lineHeight: 1.6 }}><strong style={{ color: "#e8dcc8" }}>1515 is the most popular US van build profile</strong> — largest accessory ecosystem, most tutorials, best resale value on used extrusion.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUPPLIER GUIDE */}
        {activeTab === "supplier" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 style={{ fontFamily: "monospace", color: "#e8dcc8" }} className="text-xl font-black">SUPPLIER GUIDE</h2>
                <p style={{ color: "#9a8f7e" }} className="mt-1 text-sm">Hardware is NOT cross-compatible between ecosystems. Choose your supplier before ordering anything.</p>
              </div>
              <div className="flex gap-2">
                {(["us", "eu"] as const).map((r) => (
                  <button key={r} onClick={() => setSupplierRegion(r)} style={{ background: supplierRegion === r ? "#c9a96e" : "transparent", color: supplierRegion === r ? "#0d0d0d" : "#9a8f7e", border: "1px solid", borderColor: supplierRegion === r ? "#c9a96e" : "#2e2e2e", fontFamily: "monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 16px", cursor: "pointer" }}>
                    {r === "us" ? "🇺🇸 US" : "🇪🇺 EU"}
                  </button>
                ))}
              </div>
            </div>

            {/* Ecosystem warning */}
            <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.3)", borderLeft: "3px solid #ef4444" }} className="flex gap-3 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p style={{ color: "#9a8f7e", fontSize: "13px", lineHeight: 1.6 }}><strong style={{ color: "#e8dcc8" }}>T-nuts, brackets, and connectors are NOT interchangeable between ecosystems.</strong> A 15-series 80/20 T-nut will not fit a 20mm metric slot. Decide your ecosystem before ordering any hardware.</p>
            </div>

            {supplierRegion === "us" ? (
              <div className="flex flex-col gap-6">
                {/* Savings callout */}
                <div style={{ background: "#141414", border: "1px solid #2e2e2e" }} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
                  <div className="text-center">
                    <div style={{ fontFamily: "monospace", fontSize: "42px", fontWeight: 800, color: "#c9a96e", lineHeight: 1 }}>$200</div>
                    <div style={{ color: "#9a8f7e", fontSize: "12px", marginTop: "4px" }}>Saved on a typical Sprinter galley build (~$680 in extrusion) by choosing Tnutz over 80/20</div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontFamily: "monospace", fontSize: "42px", fontWeight: 800, color: "#c9a96e", lineHeight: 1 }}>100%</div>
                    <div style={{ color: "#9a8f7e", fontSize: "12px", marginTop: "4px" }}>Compatible — Tnutz and 80/20 15-series profiles use identical slot dimensions and hardware</div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontFamily: "monospace", fontSize: "42px", fontWeight: 800, color: "#c9a96e", lineHeight: 1 }}>±0.010"</div>
                    <div style={{ color: "#9a8f7e", fontSize: "12px", marginTop: "4px" }}>Cut tolerance across all major US suppliers — sufficient for all van build applications</div>
                  </div>
                </div>

                <div style={{ border: "1px solid #2e2e2e", overflow: "hidden" }}>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr style={{ background: "#1f1f1f", borderBottom: "2px solid #c9a96e" }}>
                        {["Supplier", "Price vs 80/20", "Cut Svc", "CAD", "Best For"].map((h) => (
                          <th key={h} style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 14px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {US_SUPPLIERS.map((s, i) => (
                        <tr key={s.name} style={{ background: s.recommended ? "rgba(201,169,110,0.07)" : i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #2e2e2e", borderTop: s.recommended ? "1px solid rgba(201,169,110,0.3)" : undefined }}>
                          <td style={{ padding: "10px 14px" }}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "monospace", fontWeight: 700, color: s.recommended ? "#c9a96e" : "#e8dcc8", display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
                              {s.name}
                              {s.recommended && <span style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)", color: "#c9a96e", fontSize: "9px", fontWeight: 700, padding: "1px 6px", letterSpacing: "1px" }}>★ BEST VALUE</span>}
                              <ExternalLink className="h-3 w-3 opacity-40" />
                            </a>
                          </td>
                          <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: s.price.startsWith("−") ? "#c9a96e" : s.price === "Baseline" ? "#9a8f7e" : "#ef4444" }}>{s.price}</td>
                          <td style={{ padding: "10px 14px", textAlign: "center", color: s.cut ? "#c9a96e" : "#4a4038", fontWeight: 700 }}>{s.cut ? "✓" : "—"}</td>
                          <td style={{ padding: "10px 14px", textAlign: "center", color: s.cad ? "#c9a96e" : "#4a4038", fontWeight: 700 }}>{s.cad ? "✓" : "—"}</td>
                          <td style={{ padding: "10px 14px", color: "#9a8f7e", fontSize: "12px" }}>{s.best}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.3)" }} className="p-4">
                  <p style={{ color: "#9a8f7e", fontSize: "13px", lineHeight: 1.6 }}>For <strong style={{ color: "#e8dcc8" }}>Ducato, Crafter, Master, Daily, and Boxer</strong> builds, the 20×40mm metric ecosystem is the natural choice — hardware is locally available across Europe and Australia at 40–60% less than importing 80/20.</p>
                </div>
                <div style={{ border: "1px solid #2e2e2e", overflow: "hidden" }}>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr style={{ background: "#1f1f1f", borderBottom: "2px solid #c9a96e" }}>
                        {["Supplier", "Country", "Series", "Tier", "Standout Feature"].map((h) => (
                          <th key={h} style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 14px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {EU_SUPPLIERS.map((s, i) => (
                        <tr key={s.name} style={{ background: i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #2e2e2e" }}>
                          <td style={{ padding: "10px 14px" }}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "monospace", fontWeight: 700, color: "#e8dcc8", display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
                              {s.name} <ExternalLink className="h-3 w-3 opacity-40" />
                            </a>
                          </td>
                          <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: "12px", color: "#5a5248" }}>{s.country}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", fontSize: "12px" }}>{s.series}</td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ background: s.tier === "Premium" ? "rgba(201,169,110,0.12)" : "rgba(74,64,56,0.3)", border: "1px solid", borderColor: s.tier === "Premium" ? "rgba(201,169,110,0.3)" : "#2e2e2e", color: s.tier === "Premium" ? "#c9a96e" : "#5a5248", fontSize: "10px", fontWeight: 700, padding: "2px 8px", fontFamily: "monospace", letterSpacing: "1px" }}>{s.tier.toUpperCase()}</span>
                          </td>
                          <td style={{ padding: "10px 14px", color: "#9a8f7e", fontSize: "12px" }}>{s.best}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BUILD EXAMPLES */}
        {activeTab === "builds" && (
          <div className="flex flex-col gap-8">
            <div>
              <h2 style={{ fontFamily: "monospace", color: "#e8dcc8" }} className="text-xl font-black">REAL BUILD EXAMPLES</h2>
              <p style={{ color: "#9a8f7e" }} className="mt-1 text-sm">Ten real builds with exact cut dimensions, full BOM, cost estimate, and weight. All use 15-series unless noted.</p>
            </div>

            <div style={{ border: "1px solid #2e2e2e", overflow: "hidden" }}>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={{ background: "#1f1f1f", borderBottom: "2px solid #c9a96e" }}>
                    {["Build Name", "Series", "Category", "Est. Cost", "Hours", "Weight"].map((h, i) => (
                      <th key={h} style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 14px", textAlign: i >= 3 ? "right" : "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BUILDS.map((b, i) => (
                    <tr key={b.name} style={{ background: i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #2e2e2e" }}>
                      <td style={{ padding: "10px 14px", color: "#e8dcc8", fontWeight: 600 }}>{b.name}</td>
                      <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", fontSize: "12px" }}>{b.series}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ background: b.category === "Interior" ? "rgba(201,169,110,0.1)" : b.category === "Exterior" ? "rgba(212,133,74,0.1)" : "rgba(74,64,56,0.3)", border: "1px solid", borderColor: b.category === "Interior" ? "rgba(201,169,110,0.3)" : b.category === "Exterior" ? "rgba(212,133,74,0.3)" : "#2e2e2e", color: b.category === "Interior" ? "#c9a96e" : b.category === "Exterior" ? "#d4854a" : "#9a8f7e", fontSize: "10px", fontWeight: 700, padding: "2px 8px", fontFamily: "monospace", letterSpacing: "1px" }}>{b.category.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", textAlign: "right" }}>{b.cost}</td>
                      <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "#9a8f7e", textAlign: "right" }}>{b.hours} hrs</td>
                      <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "#9a8f7e", textAlign: "right" }}>{b.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { val: "10",   lbl: "Build Templates" },
                { val: "50",   lbl: "Cut List Items" },
                { val: "$394", lbl: "Avg Build Cost" },
                { val: "16.4", lbl: "Avg Hours" },
              ].map(({ val, lbl }) => (
                <div key={lbl} style={{ background: "#141414", border: "1px solid #2e2e2e" }} className="p-4 text-center">
                  <div style={{ fontFamily: "monospace", fontSize: "24px", fontWeight: 800, color: "#c9a96e" }}>{val}</div>
                  <div style={{ color: "#5a5248", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOOL LIST */}
        {activeTab === "tools" && (
          <div className="flex flex-col gap-8">
            <div>
              <h2 style={{ fontFamily: "monospace", color: "#e8dcc8" }} className="text-xl font-black">TOOL LIST</h2>
              <p style={{ color: "#9a8f7e" }} className="mt-1 text-sm">Six tools are non-negotiable. Everything else is optional.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Must-have */}
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>Must Have</div>
                <div style={{ border: "1px solid #2e2e2e", overflow: "hidden" }}>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr style={{ background: "#1f1f1f", borderBottom: "2px solid #c9a96e" }}>
                        {["Tool", "Model", "Price"].map((h, i) => (
                          <th key={h} style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "9px 12px", textAlign: i === 2 ? "right" : "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MUST_HAVE_TOOLS.map((t, i) => (
                        <tr key={t.tool} style={{ background: t.critical ? "rgba(251,191,36,0.05)" : i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #2e2e2e", borderTop: t.critical ? "1px solid rgba(251,191,36,0.25)" : undefined }}>
                          <td style={{ padding: "9px 12px" }}>
                            <div style={{ color: "#e8dcc8", fontWeight: 600 }}>{t.tool}{t.critical && <span style={{ marginLeft: "6px", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.35)", color: "#f59e0b", fontSize: "9px", fontWeight: 700, padding: "1px 5px", fontFamily: "monospace", letterSpacing: "1px" }}>REQUIRED</span>}</div>
                            <div style={{ color: "#5a5248", fontSize: "11px", marginTop: "2px" }}>{t.why}</div>
                          </td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: "11px", color: "#5a5248" }}>{t.model}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", textAlign: "right" }}>{t.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Nice to have + CAD */}
              <div className="flex flex-col gap-6">
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#9a8f7e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>Nice to Have</div>
                  <div style={{ border: "1px solid #2e2e2e", overflow: "hidden" }}>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr style={{ background: "#1f1f1f", borderBottom: "1px solid #c9a96e" }}>
                          <th style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "9px 12px", textAlign: "left" }}>Tool</th>
                          <th style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "9px 12px", textAlign: "right" }}>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {NICE_TOOLS.map((t, i) => (
                          <tr key={t.tool} style={{ background: i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #2e2e2e" }}>
                            <td style={{ padding: "9px 12px" }}>
                              <div style={{ color: "#e8dcc8", fontWeight: 500 }}>{t.tool}</div>
                              <div style={{ color: "#5a5248", fontSize: "11px" }}>{t.model}</div>
                            </td>
                            <td style={{ padding: "9px 12px", fontFamily: "monospace", fontWeight: 700, color: "#9a8f7e", textAlign: "right" }}>{t.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#9a8f7e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>Free CAD Software</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "Fusion 360",         desc: "Free for hobbyists. Best overall for van builds." },
                      { name: "OpenBuilds CAD",      desc: "Browser-based. Best for beginners." },
                      { name: "CutList Optimizer",   desc: "Free. Minimizes material waste." },
                      { name: "SketchUp Free",       desc: "Browser-based. Good for layout planning." },
                    ].map(({ name, desc }) => (
                      <div key={name} style={{ background: "#141414", border: "1px solid #2e2e2e", padding: "12px" }}>
                        <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", fontSize: "12px" }}>{name}</div>
                        <div style={{ color: "#5a5248", fontSize: "11px", marginTop: "3px" }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FASTENERS */}
        {activeTab === "fasteners" && (
          <div className="flex flex-col gap-8">
            <div>
              <h2 style={{ fontFamily: "monospace", color: "#e8dcc8" }} className="text-xl font-black">FASTENER QUICK REFERENCE</h2>
              <p style={{ color: "#9a8f7e" }} className="mt-1 text-sm">Wrong T-nuts are the #1 beginner mistake. Match thread to series exactly.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Imperial */}
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>15-Series (80/20 Imperial)</div>
                <div style={{ border: "1px solid #2e2e2e", overflow: "hidden" }}>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr style={{ background: "#1f1f1f", borderBottom: "2px solid #c9a96e" }}>
                        {["Fastener", "Size", "Use Case", "McMaster P/N"].map((h) => (
                          <th key={h} style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "9px 12px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {FASTENERS_IMPERIAL.map((f, i) => (
                        <tr key={f.type + f.size} style={{ background: i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #2e2e2e" }}>
                          <td style={{ padding: "9px 12px", color: "#e8dcc8", fontWeight: 500 }}>{f.type}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontWeight: 700, color: "#c9a96e" }}>{f.size}</td>
                          <td style={{ padding: "9px 12px", color: "#9a8f7e", fontSize: "12px" }}>{f.use}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: "11px", color: "#5a5248" }}>{f.pn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ background: "#141414", border: "1px solid #2e2e2e", padding: "12px 14px", marginTop: "8px" }}>
                  <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#5a5248", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}>Torque Specs</div>
                  <div className="flex gap-6">
                    <div><div style={{ fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", fontSize: "18px" }}>50–60</div><div style={{ color: "#5a5248", fontSize: "11px" }}>in-lb · 3/8-16</div></div>
                    <div><div style={{ fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", fontSize: "18px" }}>25–30</div><div style={{ color: "#5a5248", fontSize: "11px" }}>in-lb · 1/4-20</div></div>
                  </div>
                </div>
              </div>

              {/* Metric */}
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>20mm Metric T-slot</div>
                <div style={{ border: "1px solid #2e2e2e", overflow: "hidden" }}>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr style={{ background: "#1f1f1f", borderBottom: "2px solid #c9a96e" }}>
                        {["Fastener", "Size", "Use Case", "Notes"].map((h) => (
                          <th key={h} style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase", padding: "9px 12px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {FASTENERS_METRIC.map((f, i) => (
                        <tr key={f.type + f.size} style={{ background: i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #2e2e2e" }}>
                          <td style={{ padding: "9px 12px", color: "#e8dcc8", fontWeight: 500 }}>{f.type}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontWeight: 700, color: "#c9a96e" }}>{f.size}</td>
                          <td style={{ padding: "9px 12px", color: "#9a8f7e", fontSize: "12px" }}>{f.use}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: "11px", color: "#5a5248" }}>{f.pn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ background: "#141414", border: "1px solid #2e2e2e", padding: "12px 14px", marginTop: "8px" }}>
                  <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#5a5248", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}>Torque Specs</div>
                  <div className="flex gap-6">
                    <div><div style={{ fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", fontSize: "18px" }}>4–5</div><div style={{ color: "#5a5248", fontSize: "11px" }}>Nm · M5</div></div>
                    <div><div style={{ fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", fontSize: "18px" }}>8–10</div><div style={{ color: "#5a5248", fontSize: "11px" }}>Nm · M6</div></div>
                    <div><div style={{ fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", fontSize: "18px" }}>18–20</div><div style={{ color: "#5a5248", fontSize: "11px" }}>Nm · M8</div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical rules */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.25)", borderLeft: "3px solid #f59e0b" }} className="flex gap-3 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div><div style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, color: "#f59e0b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Critical</div><p style={{ color: "#9a8f7e", fontSize: "12px", lineHeight: 1.6 }}>Always use <strong style={{ color: "#e8dcc8" }}>blue Loctite 243</strong> on every T-slot fastener. Van road vibration will loosen every unfastened connection within weeks.</p></div>
              </div>
              <div style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.3)", borderLeft: "3px solid #c9a96e" }} className="flex gap-3 p-4">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a96e]" />
                <div><div style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Tip</div><p style={{ color: "#9a8f7e", fontSize: "12px", lineHeight: 1.6 }}>Apply <strong style={{ color: "#e8dcc8" }}>Permatex anti-seize</strong> to all aluminum-to-aluminum thread connections to prevent galling and allow future disassembly.</p></div>
              </div>
              <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.25)", borderLeft: "3px solid #ef4444" }} className="flex gap-3 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div><div style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Warning</div><p style={{ color: "#9a8f7e", fontSize: "12px", lineHeight: 1.6 }}><strong style={{ color: "#e8dcc8" }}>15-series and 20mm metric T-nuts are NOT interchangeable.</strong> The slot widths differ — always verify before ordering hardware.</p></div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Footer CTA ── */}
      <div style={{ background: "#141414", borderTop: "1px solid #2e2e2e" }} className="mt-8">
        <div className="mx-auto max-w-[1400px] px-4 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div style={{ fontFamily: "monospace", color: "#e8dcc8", fontWeight: 800, fontSize: "16px" }}>READY TO BUILD?</div>
              <div style={{ color: "#9a8f7e", fontSize: "13px", marginTop: "2px" }}>Download the full seed package with SQL schema, 300+ file entries, and BOM generator scripts.</div>
            </div>
            <div className="flex gap-3">
              <Link to="/3d-files" style={{ background: "transparent", border: "1px solid #2e2e2e", color: "#9a8f7e" }} className="flex items-center gap-2 rounded px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e]">
                <Printer className="h-4 w-4" /> 3D Print Files
              </Link>
              <Link to="/resources" style={{ background: "#c9a96e", color: "#0d0d0d" }} className="flex items-center gap-2 rounded px-4 py-2 text-xs font-black uppercase tracking-wider">
                <ArrowRight className="h-4 w-4" /> View All Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extrusion;
