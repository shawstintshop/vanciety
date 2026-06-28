/**
 * ExtrusionGuide.tsx — Vanciety Combined Extrusion Reference Page
 * Design: matte black (#0d0d0d) + gold (#c9a96e) + parchment (#e8dcc8)
 * Single scrolling page: Size Guide → Supplier Guide → Videos → External Resources
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Ruler, DollarSign, Play, ExternalLink, ChevronRight,
  AlertTriangle, CheckCircle, ArrowRight, Printer, BookOpen,
} from "lucide-react";
import Header from "@/components/Header";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_GUIDE = [
  { app: "Cabinet corner post",          profile: "1515",            why: "Best all-around; 350 lb rating, most accessories available",                recommended: true  },
  { app: "Horizontal span under 48\"",   profile: "1515",            why: "Sufficient stiffness for most cabinet spans",                                recommended: true  },
  { app: "Horizontal span 48–72\"",      profile: "1530",            why: "2× bending stiffness of 1515; use for bed rails and long shelves",          recommended: false },
  { app: "Horizontal span over 72\"",    profile: "1545",            why: "3× bending stiffness; required for full-length bed rails",                  recommended: false },
  { app: "Heavy corner post (>100 lb)",  profile: "3030",            why: "Equivalent to two 1515 bonded; 900 lb rating",                              recommended: false },
  { app: "Roof rack cross member",       profile: "2525",            why: "1,200 lb rating; standard for all roof rack cross members",                 recommended: false },
  { app: "Roof rack longitudinal rail",  profile: "2550",            why: "2,800 lb rating; maximum roof rack structural strength",                    recommended: false },
  { app: "Light accessories",            profile: "1010",            why: "120 lb rating; saves weight on small non-structural items",                 recommended: false },
  { app: "European van interior",        profile: "20×40mm metric",  why: "Compatible with European hardware ecosystem (Ducato, Crafter, Master)",     recommended: false },
  { app: "Budget build",                 profile: "Generic 20×20mm", why: "60% cheaper than 80/20; verify slot dimensions before ordering hardware",   recommended: false },
];

const PROFILES = [
  { name: "1515-Lite", size: "1.5\"×1.5\"", weight: "0.28", load: "180",   cost: "$3.20",  use: "Light shelves, overhead accessories",   recommended: false },
  { name: "1515",      size: "1.5\"×1.5\"", weight: "0.48", load: "350",   cost: "$4.50",  use: "All interior cabinets — the standard",  recommended: true  },
  { name: "1515-S",    size: "1.5\"×1.5\"", weight: "0.48", load: "350",   cost: "$5.20",  use: "Smooth finish for visible surfaces",    recommended: false },
  { name: "1530",      size: "1.5\"×3.0\"", weight: "0.72", load: "650",   cost: "$6.80",  use: "Bed rails, long horizontal spans",      recommended: false },
  { name: "1545",      size: "1.5\"×4.5\"", weight: "1.08", load: "1,100", cost: "$9.50",  use: "Very long bed rails (>72\")",           recommended: false },
  { name: "3030",      size: "3.0\"×3.0\"", weight: "0.96", load: "900",   cost: "$12.50", use: "Heavy cabinet corner posts",            recommended: false },
  { name: "2525",      size: "2.5\"×2.5\"", weight: "0.84", load: "1,200", cost: "$14.50", use: "Roof rack cross members",               recommended: false },
  { name: "2550",      size: "2.5\"×5.0\"", weight: "1.48", load: "2,800", cost: "$22.00", use: "Roof rack longitudinal rails",          recommended: false },
];

const US_SUPPLIERS = [
  { name: "Tnutz",         price: "−15 to −30%", cut: true,  cad: true,  best: "Best value US builds",             url: "https://www.tnutz.com",       recommended: true  },
  { name: "80/20 Inc.",    price: "Baseline",     cut: true,  cad: true,  best: "Premium builds, widest selection", url: "https://8020.net",            recommended: false },
  { name: "Misumi USA",    price: "+10 to +20%",  cut: true,  cad: true,  best: "Precision, free CAD downloads",    url: "https://us.misumi-ec.com",    recommended: false },
  { name: "McMaster-Carr", price: "+20 to +30%",  cut: false, cad: true,  best: "Hardware, T-nuts, next-day ship",  url: "https://www.mcmaster.com",    recommended: false },
  { name: "Faztek",        price: "−10%",         cut: true,  cad: true,  best: "Mid-range 15-series builds",       url: "https://www.faztek.net",      recommended: false },
  { name: "Grainger",      price: "+20%",         cut: false, cad: false, best: "Urgent orders, local pickup",      url: "https://www.grainger.com",    recommended: false },
  { name: "Amazon",        price: "−40 to −60%",  cut: false, cad: false, best: "Budget metric extrusion, tools",   url: "https://www.amazon.com",      recommended: false },
];

const EU_SUPPLIERS = [
  { name: "Bosch Rexroth", country: "Germany", series: "30/45/60/90mm",  tier: "Premium", best: "Best industrial quality; full CAD library",                    url: "https://www.boschrexroth.com" },
  { name: "item24",        country: "Germany", series: "item 6/8",       tier: "Premium", best: "API available; excellent online CAD configurator",              url: "https://www.item24.com"       },
  { name: "MiniTec",       country: "Germany", series: "Metric 20–60mm", tier: "Premium", best: "Precision German manufacturing; strong CAD support",            url: "https://www.minitec.de"       },
  { name: "AliExpress",    country: "China",   series: "20/30/40mm",     tier: "Budget",  best: "Cheapest option; 3–4 week shipping; variable quality",          url: "https://www.aliexpress.com"   },
];

const HOW_TO_STEPS = [
  { step: "01", title: "Plan Your Layout",            desc: "Measure your van interior precisely. Sketch your layout — bed, kitchen, storage, electrical. Decide which modules need to be removable. Use SketchUp Free or Fusion 360 to model before cutting.",                                                                                         link: "https://www.sketchup.com/plans-and-pricing/sketchup-free", linkLabel: "SketchUp Free" },
  { step: "02", title: "Choose Your Profile Series",  desc: "For most van builds: 1515 (1.5\"×1.5\") for interior cabinets, 1530 for bed rails over 48\", 2525 for roof rack cross members. See the Size Guide section above for the full application chart.",                                                                                        link: null, linkLabel: null },
  { step: "03", title: "Order Cut-to-Length",         desc: "Order from Tnutz or 80/20 with cut-to-length service. Provide exact dimensions in inches. Order 5–10% extra for mistakes. Get T-nuts, end caps, and corner brackets in the same order.",                                                                                                 link: "https://www.tnutz.com", linkLabel: "Order from Tnutz" },
  { step: "04", title: "Prep Your Cuts",              desc: "Use a miter saw with a non-ferrous metal blade (80-tooth carbide). Cut at 90° or 45° for corner joints. Deburr all cut ends with a file or deburring tool. Mark all pieces before assembly.",                                                                                            link: "https://www.amazon.com/s?k=non+ferrous+metal+blade+miter+saw", linkLabel: "Non-Ferrous Blades on Amazon" },
  { step: "05", title: "Drill and Tap End Holes",     desc: "For end-to-face connections, drill a pilot hole in the end of the extrusion and tap it for the appropriate thread (3/8-16 for 15-series, M8 for 30mm metric). Use a drill press for accuracy.",                                                                                         link: "https://www.amazon.com/s?k=hand+tap+set", linkLabel: "Tap Sets on Amazon" },
  { step: "06", title: "Assemble with T-Slot Hardware", desc: "Slide T-nuts into the slots before assembly — you cannot add them after. Use drop-in T-nuts for quick assembly. Apply blue Loctite 243 to every fastener. Torque to spec.",                                                                                                            link: "https://www.amazon.com/s?k=loctite+243+blue", linkLabel: "Loctite 243 on Amazon" },
  { step: "07", title: "Mount to Van Structure",      desc: "Attach extrusion frames to van ribs using L-brackets and self-tapping screws into the van's structural ribs. Never drill through the van floor without sealing. Use rubber isolation pads to prevent vibration noise.",                                                                   link: null, linkLabel: null },
  { step: "08", title: "Add Panels and Surfaces",     desc: "Attach plywood, aluminum composite panel, or bamboo to the extrusion frame using T-slot panel brackets or through-bolts. 1/2\" Baltic birch plywood is the standard for van builds.",                                                                                                   link: "https://www.amazon.com/s?k=t+slot+panel+bracket", linkLabel: "Panel Brackets on Amazon" },
];

const VIDEOS = [
  { id: "AKssPWSYZwg", title: "How to Use 8020 Extruded Aluminum in Your Van Build",          channel: "Engineers Who Van Life", desc: "Valuable tricks developed over years — smoother builds, stronger results.",                                                     tag: "Overview"    },
  { id: "XqiroMdqZ0Y", title: "How To Build A Van With 80/20 Aluminum (INSANELY STRONG)",     channel: "Van Build",              desc: "Complete van structure built entirely from 80/20 aluminum extrusions — modular, strong, removable.",                              tag: "Full Build"  },
  { id: "Exan1UkdiTg", title: "How to Frame Camper Van Upper Cabinets Using 80/20 Aluminum",  channel: "Van Build",              desc: "Step-by-step upper cabinet framing — strong, lightweight, clean finish.",                                                         tag: "Cabinets"    },
  { id: "PMhNgHJVwcc", title: "How to Use 80/20 Aluminum to Frame Bamboo Van Cabinets",       channel: "Van Build",              desc: "Profiles used, fastening methods, and what to consider when installing 8020.",                                                    tag: "Cabinets"    },
  { id: "7uO2mWpkNBg", title: "8020 Aluminum in Your Camper Van Build — Masterclass",         channel: "Van Build",              desc: "Deep dive into the most important considerations before using 8020 in a camper van build.",                                        tag: "Overview"    },
  { id: "vTV9USYrLI4", title: "How to Build an 80/20 Aluminum Solar Panel Rack for Your Van", channel: "Van Build",              desc: "Build a roof solar rack using 80/20 aluminum — includes product links and mounting details.",                                     tag: "Solar"       },
  { id: "SCSJsWFelAk", title: "Is Extruded Aluminum the Best Material for Van Building?",     channel: "Van Build",              desc: "Honest overview of extruded aluminum cabinetry — pros, cons, and real-world results.",                                             tag: "Overview"    },
  { id: "PrpBxLhH18Q", title: "How to Assemble T-Slot Frames Using 80/20 Fasteners",         channel: "80/20 Inc.",             desc: "Official 80/20 guide to assembling T-slot frames with the most popular fastener types.",                                           tag: "Fasteners"   },
];

const EXTERNAL_LINKS = [
  { label: "Engineers Who Van Life — Full 80/20 Guide",    url: "https://engineerswhovanlife.com/extruded-aluminum-van-build-guide/",                              desc: "The most comprehensive free extrusion guide on the internet."                      },
  { label: "FarOutRide — Transit Bed Platform Build",      url: "https://faroutride.com/bed-platform/",                                                            desc: "Step-by-step bed platform with 80/20. Ford Transit specific but universal concepts." },
  { label: "Engineers Who Van Life — Bed System Guide",    url: "https://engineerswhovanlife.com/8020-campervan-bed-system/",                                      desc: "Complete bed system with dimensions, cut lists, and hardware."                      },
  { label: "Engineers Who Van Life — Cabinet Build Guide", url: "https://engineerswhovanlife.com/8020-van-cabinets/",                                              desc: "Upper and lower cabinet builds with 80/20 — step-by-step."                         },
  { label: "The Wanderful — Cabinet Build Guide",          url: "https://thewanderful.co/blog/how-to-build-cabinets-in-your-van-using-extruded-aluminum-8020",    desc: "Profiles used, fastening methods, and installation tips."                          },
  { label: "80/20 Inc. — Official Store",                  url: "https://8020.net",                                                                                desc: "The original T-slot aluminum. Best selection, ships cut-to-length."                 },
  { label: "Tnutz — Best Value US Supplier",               url: "https://www.tnutz.com",                                                                           desc: "15–30% cheaper than 80/20. Same quality, excellent service."                       },
  { label: "CraftyAmigo — Free 80/20 Design Tool",         url: "https://craftyamigo.com/",                                                                        desc: "Free browser-based 80/20 design tool. Build and visualize before you cut."         },
  { label: "Printables — Van Life 3D Files",               url: "https://www.printables.com/tag/vanlife",                                                          desc: "3D print files for extrusion brackets, mounts, and accessories."                   },
  { label: "r/vandwellers — Reddit Community",             url: "https://www.reddit.com/r/vandwellers/",                                                           desc: "1M+ members. Best community for van build advice and inspiration."                  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER helper
// ─────────────────────────────────────────────────────────────────────────────
const SectionHeader = ({
  id, icon: Icon, label, subtitle,
}: { id: string; icon: React.ElementType; label: string; subtitle: string }) => (
  <div id={id} style={{ borderBottom: "2px solid #c9a96e", paddingBottom: "14px", marginBottom: "28px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Icon style={{ width: "20px", height: "20px", color: "#c9a96e", flexShrink: 0 }} />
      <h2 style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "20px", color: "#e8dcc8", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>{label}</h2>
    </div>
    <p style={{ color: "#9a8f7e", fontSize: "13px", marginTop: "6px", lineHeight: 1.6 }}>{subtitle}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO GRID
// ─────────────────────────────────────────────────────────────────────────────
const VideoGrid = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {VIDEOS.map((v) => (
        <div key={v.id} style={{ background: "#141414", border: "1px solid #2e2e2e", borderRadius: "6px", overflow: "hidden" }}>
          {playing === v.id ? (
            <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
              <iframe
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <button
              onClick={() => setPlaying(v.id)}
              style={{ position: "relative", display: "block", width: "100%", cursor: "pointer", background: "none", border: "none", padding: 0 }}
            >
              <img
                src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                alt={v.title}
                style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(201,169,110,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play style={{ width: "20px", height: "20px", color: "#0d0d0d", marginLeft: "3px" }} />
                </div>
              </div>
              <span style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(13,13,13,0.88)", border: "1px solid rgba(201,169,110,0.45)", color: "#c9a96e", fontSize: "9px", fontFamily: "monospace", fontWeight: 700, padding: "2px 7px", letterSpacing: "0.12em" }}>
                {v.tag.toUpperCase()}
              </span>
            </button>
          )}
          <div style={{ padding: "12px 14px" }}>
            <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "12px", color: "#e8dcc8", lineHeight: 1.4, marginBottom: "4px" }}>{v.title}</div>
            <div style={{ fontSize: "10px", color: "#c9a96e", fontFamily: "monospace", fontWeight: 700, marginBottom: "6px" }}>{v.channel}</div>
            <div style={{ fontSize: "11px", color: "#5a5248", lineHeight: 1.5 }}>{v.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
const ExtrusionGuide = () => {
  const [supplierRegion, setSupplierRegion] = useState<"us" | "eu">("us");

  const S = { // shared inline styles shorthand
    th: { fontFamily: "monospace", fontSize: "10px", color: "#9a8f7e", letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "10px 14px", textAlign: "left" as const },
    thead: { background: "#1f1f1f", borderBottom: "2px solid #c9a96e" },
    row: (i: number, highlight = false) => ({ background: highlight ? "rgba(201,169,110,0.06)" : i % 2 === 0 ? "#0d0d0d" : "#111", borderBottom: "1px solid #2e2e2e" }),
    td: { padding: "10px 14px", color: "#e8dcc8", fontSize: "13px" },
    mono: { fontFamily: "monospace", fontWeight: 700, color: "#c9a96e" },
    muted: { color: "#9a8f7e", fontSize: "12px" },
    table: { border: "1px solid #2e2e2e", overflow: "hidden" as const, borderRadius: "4px" },
  };

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8" }}>
      <Header />

      {/* ── HERO ── */}
      <section style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #111 55%, #1a150a 100%)", borderBottom: "1px solid #2e2e2e" }} className="pt-16 sm:pt-20">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)", color: "#c9a96e" }} className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">Vanciety Build Guide</span>
                <span style={{ color: "#5a5248" }} className="text-[10px] font-bold uppercase tracking-widest">Aluminum Extrusion</span>
              </div>
              <h1 style={{ fontFamily: "monospace", color: "#e8dcc8", lineHeight: 1.1 }} className="text-3xl font-black sm:text-4xl lg:text-5xl">
                ALUMINUM EXTRUSION<br />
                <span style={{ color: "#c9a96e" }}>COMPLETE REFERENCE</span>
              </h1>
              <p style={{ color: "#9a8f7e" }} className="mt-3 max-w-2xl text-sm leading-relaxed">
                Size guide, supplier comparison, step-by-step how-to, build videos, and curated external resources — everything you need to build right the first time.
              </p>
              {/* Jump links */}
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { href: "#size-guide",      label: "Size Guide" },
                  { href: "#supplier-guide",  label: "Supplier Guide" },
                  { href: "#how-to",          label: "How-To Guide" },
                  { href: "#videos",          label: "Build Videos" },
                  { href: "#resources",       label: "Resources" },
                ].map(({ href, label }) => (
                  <a key={href} href={href}
                    style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.25)", color: "#c9a96e", textDecoration: "none", fontSize: "11px", fontFamily: "monospace", fontWeight: 700, padding: "5px 12px", letterSpacing: "0.08em", borderRadius: "3px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,169,110,0.18)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(201,169,110,0.08)")}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link to="/3d-files" style={{ background: "transparent", border: "1px solid #2e2e2e", color: "#9a8f7e", textDecoration: "none" }} className="flex items-center gap-2 rounded px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e]">
                <Printer className="h-4 w-4" /> 3D Files
              </Link>
              <Link to="/extrusion" style={{ background: "#c9a96e", color: "#0d0d0d", textDecoration: "none" }} className="flex items-center gap-2 rounded px-4 py-2 text-xs font-black uppercase tracking-wider">
                <BookOpen className="h-4 w-4" /> Full Guide
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { val: "10",  lbl: "Applications" },
              { val: "8",   lbl: "Profiles" },
              { val: "11",  lbl: "Suppliers" },
              { val: "8",   lbl: "Build Videos" },
              { val: "10",  lbl: "Guides & Links" },
            ].map(({ val, lbl }) => (
              <div key={lbl} style={{ background: "#141414", border: "1px solid #2e2e2e", borderRadius: "4px" }} className="p-4 text-center">
                <div style={{ fontFamily: "monospace", color: "#c9a96e" }} className="text-2xl font-black">{val}</div>
                <div style={{ color: "#5a5248" }} className="mt-1 text-[10px] font-bold uppercase tracking-wider">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="mx-auto max-w-[1200px] px-4 py-12 flex flex-col gap-20">

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 — SIZE GUIDE
        ════════════════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader id="size-guide" icon={Ruler} label="Size Guide" subtitle="Match your application to the right profile. Using the wrong size is the most common and expensive van build mistake." />

          {/* Application → Profile table */}
          <div className="mb-8">
            <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#9a8f7e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>Application → Profile Selector</div>
            <div style={S.table}>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>Application</th>
                    <th style={S.th}>Recommended Profile</th>
                    <th style={{ ...S.th, display: "none" }} className="sm:table-cell">Why</th>
                    <th style={{ ...S.th, textAlign: "center" }}>Pick</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map((r, i) => (
                    <tr key={r.app} style={S.row(i, r.recommended)}>
                      <td style={S.td}>{r.app}</td>
                      <td style={{ ...S.td, ...S.mono }}>{r.profile}</td>
                      <td style={{ ...S.td, ...S.muted, display: "none" }} className="sm:table-cell">{r.why}</td>
                      <td style={{ ...S.td, textAlign: "center" }}>
                        {r.recommended
                          ? <span style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)", color: "#c9a96e", fontSize: "9px", fontFamily: "monospace", fontWeight: 700, padding: "2px 8px", letterSpacing: "1px" }}>BEST</span>
                          : <span style={{ color: "#2e2e2e", fontSize: "11px" }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Profile specs */}
          <div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#9a8f7e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>Profile Specifications</div>
            <div style={S.table}>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>Profile</th>
                    <th style={S.th}>Size</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Load (lb)</th>
                    <th style={{ ...S.th, textAlign: "right" }}>lb/ft</th>
                    <th style={{ ...S.th, textAlign: "right" }}>$/ft</th>
                    <th style={{ ...S.th, display: "none" }} className="lg:table-cell">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {PROFILES.map((p, i) => (
                    <tr key={p.name} style={S.row(i, p.recommended)}>
                      <td style={{ ...S.td, ...S.mono }}>
                        {p.name}
                        {p.recommended && <span style={{ marginLeft: "8px", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)", color: "#c9a96e", fontSize: "9px", fontFamily: "monospace", fontWeight: 700, padding: "1px 6px" }}>★ STD</span>}
                      </td>
                      <td style={{ ...S.td, ...S.muted }}>{p.size}</td>
                      <td style={{ ...S.td, ...S.mono, textAlign: "right" }}>{p.load}</td>
                      <td style={{ ...S.td, ...S.muted, textAlign: "right" }}>{p.weight}</td>
                      <td style={{ ...S.td, ...S.mono, textAlign: "right" }}>{p.cost}</td>
                      <td style={{ ...S.td, ...S.muted, display: "none" }} className="lg:table-cell">{p.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warning callouts */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.25)", borderLeft: "3px solid #f59e0b" }} className="flex gap-3 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, color: "#f59e0b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Critical</div>
                <p style={{ color: "#9a8f7e", fontSize: "12px", lineHeight: 1.6 }}><strong style={{ color: "#e8dcc8" }}>15-series and 20mm metric T-nuts are NOT interchangeable.</strong> The slot widths differ — always verify before ordering hardware.</p>
              </div>
            </div>
            <div style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.3)", borderLeft: "3px solid #c9a96e" }} className="flex gap-3 p-4">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a96e]" />
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Tip</div>
                <p style={{ color: "#9a8f7e", fontSize: "12px", lineHeight: 1.6 }}>Start with <strong style={{ color: "#e8dcc8" }}>1515 for everything</strong> until you have a reason to upsize. 90% of van builds use only 1515 for all interior work.</p>
              </div>
            </div>
            <div style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.3)", borderLeft: "3px solid #c9a96e" }} className="flex gap-3 p-4">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a96e]" />
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Tip</div>
                <p style={{ color: "#9a8f7e", fontSize: "12px", lineHeight: 1.6 }}>Order <strong style={{ color: "#e8dcc8" }}>cut-to-length</strong> from Tnutz or 80/20. The $0.25/cut fee saves hours of work and produces cleaner results than a hand saw.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2 — SUPPLIER GUIDE
        ════════════════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader id="supplier-guide" icon={DollarSign} label="Supplier Guide" subtitle="Where to buy, how much to pay, and what each supplier is best for. Prices relative to 80/20 baseline." />

          {/* Region toggle */}
          <div className="mb-6 flex gap-0" style={{ border: "1px solid #2e2e2e", borderRadius: "4px", overflow: "hidden", width: "fit-content" }}>
            {(["us", "eu"] as const).map((r) => (
              <button key={r} onClick={() => setSupplierRegion(r)}
                style={{ padding: "8px 24px", fontFamily: "monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", border: "none", background: supplierRegion === r ? "#c9a96e" : "#141414", color: supplierRegion === r ? "#0d0d0d" : "#5a5248", transition: "background 0.15s, color 0.15s" }}>
                {r === "us" ? "🇺🇸 United States" : "🇪🇺 Europe"}
              </button>
            ))}
          </div>

          {supplierRegion === "us" && (
            <div style={S.table}>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>Supplier</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Price vs 80/20</th>
                    <th style={{ ...S.th, textAlign: "center" }}>Cut-to-Length</th>
                    <th style={{ ...S.th, textAlign: "center" }}>Free CAD</th>
                    <th style={{ ...S.th, display: "none" }} className="lg:table-cell">Best For</th>
                    <th style={{ ...S.th, textAlign: "center" }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {US_SUPPLIERS.map((s, i) => (
                    <tr key={s.name} style={S.row(i, s.recommended)}>
                      <td style={S.td}>
                        <span style={{ ...S.mono }}>{s.name}</span>
                        {s.recommended && <span style={{ marginLeft: "8px", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)", color: "#c9a96e", fontSize: "9px", fontFamily: "monospace", fontWeight: 700, padding: "1px 6px" }}>BEST VALUE</span>}
                      </td>
                      <td style={{ ...S.td, ...S.mono, textAlign: "right", color: s.price.startsWith("−") ? "#4ade80" : s.price === "Baseline" ? "#c9a96e" : "#f87171" }}>{s.price}</td>
                      <td style={{ ...S.td, textAlign: "center" }}>{s.cut ? <CheckCircle className="inline h-4 w-4 text-[#c9a96e]" /> : <span style={{ color: "#2e2e2e" }}>—</span>}</td>
                      <td style={{ ...S.td, textAlign: "center" }}>{s.cad ? <CheckCircle className="inline h-4 w-4 text-[#c9a96e]" /> : <span style={{ color: "#2e2e2e" }}>—</span>}</td>
                      <td style={{ ...S.td, ...S.muted, display: "none" }} className="lg:table-cell">{s.best}</td>
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#c9a96e", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontFamily: "monospace", fontWeight: 700, textDecoration: "none" }}>
                          Visit <ExternalLink style={{ width: "10px", height: "10px" }} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {supplierRegion === "eu" && (
            <div style={S.table}>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>Supplier</th>
                    <th style={S.th}>Country</th>
                    <th style={S.th}>Series</th>
                    <th style={S.th}>Tier</th>
                    <th style={{ ...S.th, display: "none" }} className="lg:table-cell">Best For</th>
                    <th style={{ ...S.th, textAlign: "center" }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {EU_SUPPLIERS.map((s, i) => (
                    <tr key={s.name} style={S.row(i)}>
                      <td style={{ ...S.td, ...S.mono }}>{s.name}</td>
                      <td style={{ ...S.td, ...S.muted }}>{s.country}</td>
                      <td style={{ ...S.td, ...S.muted }}>{s.series}</td>
                      <td style={S.td}>
                        <span style={{ background: s.tier === "Premium" ? "rgba(201,169,110,0.1)" : "rgba(74,64,56,0.3)", border: "1px solid", borderColor: s.tier === "Premium" ? "rgba(201,169,110,0.3)" : "#2e2e2e", color: s.tier === "Premium" ? "#c9a96e" : "#9a8f7e", fontSize: "10px", fontWeight: 700, padding: "2px 8px", fontFamily: "monospace" }}>{s.tier}</span>
                      </td>
                      <td style={{ ...S.td, ...S.muted, display: "none" }} className="lg:table-cell">{s.best}</td>
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#c9a96e", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontFamily: "monospace", fontWeight: 700, textDecoration: "none" }}>
                          Visit <ExternalLink style={{ width: "10px", height: "10px" }} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Savings callout */}
          <div className="mt-6" style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.25)", borderLeft: "4px solid #c9a96e", padding: "16px 20px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#c9a96e", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>Tnutz Savings on a Typical Sprinter 144 Build</div>
            <p style={{ color: "#9a8f7e", fontSize: "13px", lineHeight: 1.7 }}>
              A typical Sprinter 144 interior uses ~180 ft of 1515 extrusion. At 80/20 baseline pricing (~$4.50/ft) that's <strong style={{ color: "#e8dcc8" }}>$810</strong>. At Tnutz (~$3.15/ft) that's <strong style={{ color: "#c9a96e" }}>$567 — saving $243 on extrusion alone</strong>, before hardware and accessories.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3 — HOW-TO GUIDE
        ════════════════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader id="how-to" icon={ChevronRight} label="How-To Guide" subtitle="8-step process from planning to finished build. Each step links to tools and resources." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HOW_TO_STEPS.map((s) => (
              <div key={s.step} style={{ background: "#141414", border: "1px solid #2e2e2e", padding: "20px", borderRadius: "6px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "30px", color: "rgba(201,169,110,0.22)", lineHeight: 1, flexShrink: 0, minWidth: "36px" }}>{s.step}</div>
                  <div>
                    <h3 style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "14px", color: "#c9a96e", marginBottom: "7px", marginTop: 0 }}>{s.title}</h3>
                    <p style={{ color: "#9a8f7e", fontSize: "12px", lineHeight: 1.75, marginBottom: s.link ? "10px" : 0, marginTop: 0 }}>{s.desc}</p>
                    {s.link && (
                      <a href={s.link} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#c9a96e", fontSize: "11px", fontFamily: "monospace", fontWeight: 700, textDecoration: "none" }}>
                        <ExternalLink style={{ width: "11px", height: "11px" }} />{s.linkLabel}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 4 — BUILD VIDEOS
        ════════════════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader id="videos" icon={Play} label="Build Videos" subtitle="Real builds, real techniques — click any thumbnail to watch inline. No redirects." />
          <VideoGrid />
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 5 — EXTERNAL RESOURCES
        ════════════════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader id="resources" icon={ExternalLink} label="Guides & Resources" subtitle="The best free extrusion guides, supplier links, and community resources on the internet." />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EXTERNAL_LINKS.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                style={{ background: "#141414", border: "1px solid #2e2e2e", borderRadius: "6px", padding: "14px 16px", textDecoration: "none", display: "flex", alignItems: "flex-start", gap: "10px", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c9a96e")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2e2e2e")}>
                <ExternalLink style={{ width: "13px", height: "13px", color: "#c9a96e", flexShrink: 0, marginTop: "3px" }} />
                <div>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "12px", color: "#e8dcc8", marginBottom: "4px" }}>{l.label}</div>
                  <div style={{ fontSize: "11px", color: "#9a8f7e", lineHeight: 1.55 }}>{l.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>

      {/* ── FOOTER CTA ── */}
      <div style={{ background: "#141414", borderTop: "1px solid #2e2e2e" }}>
        <div className="mx-auto max-w-[1200px] px-4 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div style={{ fontFamily: "monospace", color: "#e8dcc8", fontWeight: 800, fontSize: "16px" }}>READY TO BUILD?</div>
              <div style={{ color: "#9a8f7e", fontSize: "13px", marginTop: "2px" }}>Explore 3D print files for extrusion brackets, mounts, and van accessories.</div>
            </div>
            <div className="flex gap-3">
              <Link to="/3d-files" style={{ background: "transparent", border: "1px solid #2e2e2e", color: "#9a8f7e", textDecoration: "none" }} className="flex items-center gap-2 rounded px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e]">
                <Printer className="h-4 w-4" /> 3D Print Files
              </Link>
              <Link to="/extrusion" style={{ background: "#c9a96e", color: "#0d0d0d", textDecoration: "none" }} className="flex items-center gap-2 rounded px-4 py-2 text-xs font-black uppercase tracking-wider">
                <ArrowRight className="h-4 w-4" /> Full Extrusion Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtrusionGuide;
