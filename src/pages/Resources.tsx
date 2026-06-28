/**
 * Resources.tsx — Vanciety Build Guides & Resources Hub
 * Design: matte black (#0d0d0d) + gold (#c9a96e) + parchment (#e8dcc8)
 * Central hub for all van build guides, slide decks, and reference materials.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Printer, Layers, Wrench, ExternalLink, Download,
  ChevronRight, Play, FileText, BarChart2, Package, Zap,
  Ruler, DollarSign, Hammer, Globe, ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";

// ── Guide cards ───────────────────────────────────────────────────────────────
const GUIDES = [
  {
    id: "extrusion",
    title: "Aluminum Extrusion Build System",
    desc: "Complete size guide, supplier comparison (US + EU), real build examples with cut lists, fastener specs, and tool list. The definitive van build reference.",
    tags: ["Size Guide", "Suppliers", "Build Examples", "Fasteners", "Tools"],
    link: "/extrusion",
    icon: Ruler,
    badge: "GUIDE",
    badgeColor: "#c9a96e",
    stats: [
      { val: "8", lbl: "Profiles" },
      { val: "11", lbl: "Suppliers" },
      { val: "10", lbl: "Builds" },
    ],
  },
  {
    id: "3d-files",
    title: "3D Print Files Library",
    desc: "The world's most organized van life 3D printable file library. Every STL/3MF file for Sprinter, Transit, Ducato, Crafter, ProMaster, and more — fully categorized.",
    tags: ["STL", "3MF", "STEP", "All Vans", "Free + Paid"],
    link: "/3d-files",
    icon: Printer,
    badge: "LIBRARY",
    badgeColor: "#c9a96e",
    stats: [
      { val: "847+", lbl: "Files" },
      { val: "16",   lbl: "Categories" },
      { val: "10",   lbl: "Van Models" },
    ],
  },
];

// ── Slide decks ───────────────────────────────────────────────────────────────
const SLIDE_DECKS = [
  {
    id: "extrusion-guide",
    title: "Aluminum Extrusion Guide",
    desc: "12-slide deck covering size guide, supplier comparison, build examples, fasteners, and tools. All real data.",
    slides: 12,
    embedId: "EsFZ57AlBCpKGZxFfy6Cij",
    tags: ["Size Guide", "Suppliers", "Builds"],
  },
];

// ── Reference tables ──────────────────────────────────────────────────────────
const QUICK_REFS = [
  {
    title: "Profile Quick Pick",
    icon: Ruler,
    rows: [
      { key: "Interior cabinet (any)",  val: "1515" },
      { key: "Bed rail < 48\"",         val: "1515" },
      { key: "Bed rail 48–72\"",        val: "1530" },
      { key: "Bed rail > 72\"",         val: "1545" },
      { key: "Roof rack cross",         val: "2525" },
      { key: "Roof rack long rail",     val: "2550" },
    ],
  },
  {
    title: "US Supplier Savings",
    icon: DollarSign,
    rows: [
      { key: "Tnutz vs 80/20",          val: "−15 to −30%" },
      { key: "Misumi vs 80/20",         val: "+10 to +20%" },
      { key: "Amazon metric",           val: "−40 to −60%" },
      { key: "McMaster (hardware)",     val: "+20 to +30%" },
      { key: "Faztek vs 80/20",         val: "−10%" },
    ],
  },
  {
    title: "Fastener Torque",
    icon: Wrench,
    rows: [
      { key: "3/8-16 (15-series)",      val: "50–60 in-lb" },
      { key: "1/4-20 (15-series)",      val: "25–30 in-lb" },
      { key: "M5 (20mm metric)",        val: "4–5 Nm" },
      { key: "M6 (30mm metric)",        val: "8–10 Nm" },
      { key: "M8 (40mm metric)",        val: "18–20 Nm" },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
const Resources = () => {
  const [activeSlide, setActiveSlide] = useState<string | null>(null);

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8" }}>
      <Header />

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #111 60%, #1a150a 100%)", borderBottom: "1px solid #2e2e2e" }} className="pt-16 sm:pt-20">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-14">
          <div className="mb-2 flex items-center gap-2">
            <span style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)", color: "#c9a96e" }} className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">Resources</span>
            <span style={{ color: "#5a5248" }} className="text-[10px] font-bold uppercase tracking-widest">Guides · Slides · References</span>
          </div>
          <h1 style={{ fontFamily: "monospace", color: "#e8dcc8" }} className="text-3xl font-black sm:text-4xl">
            BUILD GUIDES &<br />
            <span style={{ color: "#c9a96e" }}>RESOURCES HUB</span>
          </h1>
          <p style={{ color: "#9a8f7e" }} className="mt-2 max-w-xl text-sm leading-relaxed">
            Every guide, slide deck, and reference table for van life builds. Aluminum extrusion, 3D print files, electrical, and more — all in one place.
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { val: "2",    lbl: "Build Guides" },
              { val: "1",    lbl: "Slide Deck" },
              { val: "847+", lbl: "3D Print Files" },
              { val: "10",   lbl: "Van Platforms" },
            ].map(({ val, lbl }) => (
              <div key={lbl} style={{ background: "#141414", border: "1px solid #2e2e2e" }} className="rounded p-4 text-center">
                <div style={{ fontFamily: "monospace", color: "#c9a96e" }} className="text-2xl font-black">{val}</div>
                <div style={{ color: "#5a5248" }} className="mt-1 text-[11px] font-bold uppercase tracking-wider">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-10">

        {/* ── Guide cards ── */}
        <section className="mb-12">
          <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>Interactive Guides</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {GUIDES.map((g) => {
              const Icon = g.icon;
              return (
                <Link
                  key={g.id}
                  to={g.link}
                  style={{ background: "#141414", border: "1px solid #2e2e2e", display: "block", textDecoration: "none", transition: "border-color 0.15s" }}
                  className="group rounded p-6 hover:border-[#c9a96e]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", padding: "10px", borderRadius: "4px", flexShrink: 0 }}>
                        <Icon className="h-5 w-5 text-[#c9a96e]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)", color: "#c9a96e", fontSize: "9px", fontWeight: 700, padding: "1px 6px", fontFamily: "monospace", letterSpacing: "1px" }}>{g.badge}</span>
                        </div>
                        <h3 style={{ fontFamily: "monospace", color: "#e8dcc8", fontWeight: 800, fontSize: "15px" }} className="group-hover:text-[#c9a96e] transition-colors">{g.title}</h3>
                        <p style={{ color: "#9a8f7e", fontSize: "12px", lineHeight: 1.6, marginTop: "6px" }}>{g.desc}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {g.tags.map((t) => (
                            <span key={t} style={{ background: "#1f1f1f", border: "1px solid #2e2e2e", color: "#5a5248", fontSize: "10px", fontWeight: 600, padding: "2px 7px", fontFamily: "monospace" }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#5a5248] shrink-0 mt-1 group-hover:text-[#c9a96e] transition-colors" />
                  </div>

                  {/* Stats row */}
                  <div style={{ borderTop: "1px solid #2e2e2e", marginTop: "16px", paddingTop: "12px" }} className="flex gap-6">
                    {g.stats.map(({ val, lbl }) => (
                      <div key={lbl}>
                        <div style={{ fontFamily: "monospace", fontWeight: 800, color: "#c9a96e", fontSize: "18px" }}>{val}</div>
                        <div style={{ color: "#5a5248", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{lbl}</div>
                      </div>
                    ))}
                    <div className="ml-auto flex items-center gap-1.5">
                      <span style={{ color: "#c9a96e", fontSize: "11px", fontWeight: 700, fontFamily: "monospace" }}>Open Guide</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#c9a96e]" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Slide decks ── */}
        <section className="mb-12">
          <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>Slide Decks</div>
          <div className="grid grid-cols-1 gap-4">
            {SLIDE_DECKS.map((deck) => (
              <div key={deck.id} style={{ background: "#141414", border: "1px solid #2e2e2e" }} className="rounded overflow-hidden">
                {/* Header row */}
                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <div style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", padding: "10px", borderRadius: "4px" }}>
                      <BarChart2 className="h-5 w-5 text-[#c9a96e]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)", color: "#c9a96e", fontSize: "9px", fontWeight: 700, padding: "1px 6px", fontFamily: "monospace", letterSpacing: "1px" }}>SLIDES</span>
                        <span style={{ color: "#5a5248", fontSize: "10px", fontFamily: "monospace" }}>{deck.slides} slides</span>
                      </div>
                      <h3 style={{ fontFamily: "monospace", color: "#e8dcc8", fontWeight: 800, fontSize: "15px" }}>{deck.title}</h3>
                      <p style={{ color: "#9a8f7e", fontSize: "12px", marginTop: "4px" }}>{deck.desc}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {deck.tags.map((t) => (
                          <span key={t} style={{ background: "#1f1f1f", border: "1px solid #2e2e2e", color: "#5a5248", fontSize: "10px", fontWeight: 600, padding: "2px 7px", fontFamily: "monospace" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSlide(activeSlide === deck.id ? null : deck.id)}
                    style={{ background: activeSlide === deck.id ? "#c9a96e" : "transparent", border: "1px solid", borderColor: activeSlide === deck.id ? "#c9a96e" : "#2e2e2e", color: activeSlide === deck.id ? "#0d0d0d" : "#9a8f7e", fontFamily: "monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, transition: "all 0.15s" }}
                  >
                    <Play className="h-3.5 w-3.5" />
                    {activeSlide === deck.id ? "Close" : "View Slides"}
                  </button>
                </div>

                {/* Slide embed */}
                {activeSlide === deck.id && (
                  <div style={{ borderTop: "1px solid #2e2e2e", background: "#0d0d0d" }}>
                    <iframe
                      src={`https://slides.manus.im/${deck.embedId}`}
                      style={{ width: "100%", height: "520px", border: "none", display: "block" }}
                      title={deck.title}
                      allowFullScreen
                    />
                    <div style={{ borderTop: "1px solid #2e2e2e", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ color: "#5a5248", fontSize: "11px", fontFamily: "monospace" }}>Use fullscreen button in viewer for best experience</span>
                      <a
                        href={`https://slides.manus.im/${deck.embedId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#c9a96e", fontSize: "11px", fontFamily: "monospace", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}
                      >
                        Open Full Screen <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick reference tables ── */}
        <section className="mb-12">
          <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>Quick Reference</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {QUICK_REFS.map(({ title, icon: Icon, rows }) => (
              <div key={title} style={{ background: "#141414", border: "1px solid #2e2e2e" }} className="rounded overflow-hidden">
                <div style={{ background: "#1f1f1f", borderBottom: "1px solid #2e2e2e", padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icon className="h-4 w-4 text-[#c9a96e]" />
                  <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.1em", textTransform: "uppercase" }}>{title}</span>
                </div>
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {rows.map(({ key, val }, i) => (
                      <tr key={key} style={{ background: i % 2 === 0 ? "#141414" : "#111", borderBottom: "1px solid #1f1f1f" }}>
                        <td style={{ padding: "8px 14px", color: "#9a8f7e", fontSize: "12px" }}>{key}</td>
                        <td style={{ padding: "8px 14px", fontFamily: "monospace", fontWeight: 700, color: "#c9a96e", fontSize: "12px", textAlign: "right" }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>

        {/* ── Coming soon ── */}
        <section>
          <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#5a5248", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>Coming Soon</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Zap,      label: "Electrical Guide" },
              { icon: Package,  label: "Insulation Guide" },
              { icon: Globe,    label: "Solar Sizing Guide" },
              { icon: Hammer,   label: "Flooring Guide" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ background: "#0d0d0d", border: "1px dashed #2e2e2e", padding: "16px", display: "flex", alignItems: "center", gap: "10px", opacity: 0.5 }}>
                <Icon className="h-4 w-4 text-[#5a5248] shrink-0" />
                <span style={{ color: "#5a5248", fontSize: "12px", fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Resources;
