/**
 * VanBuilder — Galley Kitchen Configurator
 * Zero external 3D dependencies — pure React + CSS isometric SVG preview
 * Tabs: 3D Preview | Cut Sheet | Buy List | Assembly | CNC/CAD
 */

import { useState, useMemo } from "react";
import Header from "@/components/Header";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GalleyConfig {
  galleyL: number; galleyW: number; galleyH: number;
  fridgeL: number; fridgeW: number; fridgeH: number;
  sinkL: number; sinkW: number; sinkD: number;
  drawerCount: number; drawerH: number;
  material: "plywood" | "mdf" | "alum";
  thickness: number;
}

interface CutPart {
  name: string; qty: number; length: number; width: number; thickness: number; notes: string;
}

interface BOMItem {
  item: string; qty: number; unit: string; unitCost: number; link: string;
}

// ─── Defaults (Shaw's measurements) ──────────────────────────────────────────
const DEFAULT: GalleyConfig = {
  galleyL: 50, galleyW: 20, galleyH: 40,
  fridgeL: 22, fridgeW: 20, fridgeH: 30,
  sinkL: 11, sinkW: 11, sinkD: 9,
  drawerCount: 4, drawerH: 6,
  material: "plywood", thickness: 0.75,
};

// ─── Compute cut list ─────────────────────────────────────────────────────────
function computeCutList(c: GalleyConfig): CutPart[] {
  const t = c.thickness;
  const drawerZoneL = c.galleyL - c.fridgeL - c.sinkL;
  const parts: CutPart[] = [
    // Carcass
    { name: "Bottom Panel", qty: 1, length: c.galleyL, width: c.galleyW, thickness: t, notes: "Full galley base" },
    { name: "Back Panel", qty: 1, length: c.galleyL, width: c.galleyH, thickness: t, notes: "Full height back" },
    { name: "Left End Panel", qty: 1, length: c.galleyW, width: c.galleyH, thickness: t, notes: "Left end" },
    { name: "Right End Panel", qty: 1, length: c.galleyW, width: c.galleyH, thickness: t, notes: "Right end" },
    { name: "Countertop", qty: 1, length: c.galleyL, width: c.galleyW, thickness: t, notes: "Full length top" },
    // Fridge section
    { name: "Fridge Divider Panel", qty: 1, length: c.fridgeW, width: c.fridgeH, thickness: t, notes: "Right side of fridge bay" },
    { name: "Fridge Bottom Shelf", qty: 1, length: c.fridgeL - t, width: c.fridgeW - t, thickness: t, notes: "Fridge bay floor" },
    // Sink section
    { name: "Sink Divider Panel", qty: 1, length: c.sinkW, width: c.galleyH - t, thickness: t, notes: "Left side of sink bay" },
    { name: "Sink Deck Panel", qty: 1, length: c.sinkL, width: c.sinkW, thickness: t, notes: "Countertop around sink cutout" },
    // Drawer section
    { name: "Drawer Bay Vertical Divider", qty: Math.max(0, Math.floor(drawerZoneL / 14) - 1), length: c.galleyW - t * 2, width: c.galleyH - t, thickness: t, notes: "Vertical dividers between drawer stacks" },
    { name: "Drawer Horizontal Rail", qty: c.drawerCount + 1, length: drawerZoneL, width: c.galleyW - t * 2, thickness: t, notes: "Drawer slides mount to these" },
    // Drawers
    { name: "Drawer Front", qty: c.drawerCount, length: drawerZoneL / 2 - 0.125, width: c.drawerH - 0.125, thickness: t, notes: "Overlay drawer fronts" },
    { name: "Drawer Box Side", qty: c.drawerCount * 2, length: c.galleyW - 3, width: c.drawerH - 1, thickness: 0.5, notes: "Baltic birch drawer box sides" },
    { name: "Drawer Box Front/Back", qty: c.drawerCount * 2, length: drawerZoneL / 2 - 2.5, width: c.drawerH - 1, thickness: 0.5, notes: "Drawer box front and back" },
    { name: "Drawer Box Bottom", qty: c.drawerCount, length: drawerZoneL / 2 - 2, width: c.galleyW - 3.5, thickness: 0.25, notes: "1/4\" drawer box bottom" },
    // Toe kick
    { name: "Toe Kick", qty: 1, length: c.galleyL, width: 3.5, thickness: t, notes: "4\" toe kick at base" },
    // Misc
    { name: "Mounting Cleat (wall)", qty: 2, length: c.galleyL - t * 2, width: 3, thickness: t, notes: "French cleat for van wall mount" },
  ];
  return parts.filter(p => p.qty > 0);
}

// ─── Compute BOM ──────────────────────────────────────────────────────────────
function computeBOM(c: GalleyConfig): BOMItem[] {
  const sheets = Math.ceil(
    (c.galleyL * c.galleyW + c.galleyL * c.galleyH + c.galleyL * c.galleyW * 2 + c.galleyW * c.galleyH * 2) / (48 * 96)
  ) + 2;
  const items: BOMItem[] = [
    { item: c.material === "alum" ? "80/20 T-slot 1530 (15-series)" : c.material === "mdf" ? '3/4" MDF Sheet (4x8)' : '3/4" Baltic Birch Plywood (4x8)', qty: sheets, unit: "sheet", unitCost: c.material === "alum" ? 0 : c.material === "mdf" ? 42 : 68, link: c.material === "alum" ? "https://8020.net/1530.html" : "https://www.homedepot.com/b/Lumber-Composites-Plywood/N-5yc1vZbqmh" },
    { item: '1/2" Baltic Birch (drawer boxes)', qty: 2, unit: "sheet", unitCost: 55, link: "https://www.homedepot.com/b/Lumber-Composites-Plywood/N-5yc1vZbqmh" },
    { item: '1/4" Birch (drawer bottoms)', qty: 1, unit: "sheet", unitCost: 35, link: "https://www.homedepot.com/b/Lumber-Composites-Plywood/N-5yc1vZbqmh" },
    { item: "Undermount Drawer Slides (18\")", qty: c.drawerCount, unit: "pair", unitCost: 22, link: "https://www.amazon.com/s?k=undermount+drawer+slides+18+inch" },
    { item: "Soft-Close Drawer Slides (18\")", qty: c.drawerCount, unit: "pair", unitCost: 28, link: "https://www.amazon.com/s?k=soft+close+drawer+slides+18+inch" },
    { item: "Drawer Pulls (bar handle)", qty: c.drawerCount, unit: "ea", unitCost: 8, link: "https://www.amazon.com/s?k=drawer+pulls+bar+handle+black" },
    { item: "Stainless RV Sink (11x11)", qty: 1, unit: "ea", unitCost: 65, link: "https://www.amazon.com/s?k=rv+stainless+sink+11x11" },
    { item: "Compact Faucet (single hole)", qty: 1, unit: "ea", unitCost: 45, link: "https://www.amazon.com/s?k=rv+compact+faucet+single+hole" },
    { item: "Wood Glue (Titebond III)", qty: 1, unit: "bottle", unitCost: 18, link: "https://www.amazon.com/s?k=titebond+III+wood+glue" },
    { item: "#8 x 1-1/4\" Pocket Screws (500ct)", qty: 1, unit: "box", unitCost: 22, link: "https://www.amazon.com/s?k=kreg+pocket+screws+500" },
    { item: "Pocket Hole Jig (Kreg K4)", qty: 1, unit: "ea", unitCost: 45, link: "https://www.amazon.com/s?k=kreg+k4+pocket+hole+jig" },
    { item: "Iron-on Edge Banding (25ft)", qty: 2, unit: "roll", unitCost: 14, link: "https://www.amazon.com/s?k=iron+on+edge+banding+birch+25ft" },
    { item: "Sandpaper Assortment (80/120/220)", qty: 1, unit: "pack", unitCost: 12, link: "https://www.amazon.com/s?k=sandpaper+assortment+80+120+220" },
    { item: "Van Floor Mounting Brackets (L-bracket)", qty: 8, unit: "ea", unitCost: 4, link: "https://www.amazon.com/s?k=heavy+duty+L+bracket+3+inch" },
    { item: "Wood Finish / Hardwax Oil", qty: 1, unit: "qt", unitCost: 38, link: "https://www.amazon.com/s?k=rubio+monocoat+hardwax+oil" },
  ];
  return items;
}

// ─── Assembly steps ───────────────────────────────────────────────────────────
const ASSEMBLY_STEPS = [
  { step: 1, title: "Cut all panels", detail: "Cut all pieces per the cut sheet. Label each panel with masking tape. Stack by section: carcass, fridge bay, drawer bay, sink bay." },
  { step: 2, title: "Apply edge banding", detail: "Iron edge banding on all exposed edges. Trim flush with a router or edge trimmer. Sand 220 grit." },
  { step: 3, title: "Drill pocket holes", detail: "Use Kreg K4 jig on all joining edges. Set depth collar for 3/4\" material. Drill every 6\" along long edges." },
  { step: 4, title: "Assemble carcass box", detail: "Attach bottom panel to left and right end panels with pocket screws + glue. Square with a framing square before glue sets. Attach back panel." },
  { step: 5, title: "Install fridge bay", detail: "Attach fridge divider panel at 22\" from left end. Install fridge bottom shelf at correct height for your fridge model. Leave 1/2\" clearance on all sides of fridge." },
  { step: 6, title: "Install drawer bay", detail: "Mark drawer rail positions from bottom: rail at 0\", then every (drawerH + 1\") up. Attach horizontal rails with pocket screws. Install vertical dividers if needed." },
  { step: 7, title: "Install sink bay", detail: "Attach sink divider panel at correct position from right end. Install sink deck panel. Cut sink hole: trace sink rim, cut 1/4\" inside line with jigsaw." },
  { step: 8, title: "Build drawer boxes", detail: "Assemble drawer box sides/front/back with glue + brad nails. Nail 1/4\" bottom into rabbet. Check square. Finish sand 220 grit." },
  { step: 9, title: "Mount drawer slides", detail: "Clamp slides to rails at correct height. Drill pilot holes. Screw slides to rails. Mount drawer box side to slide. Test full extension and soft-close." },
  { step: 10, title: "Attach countertop", detail: "Set countertop on carcass. Attach from below with pocket screws — do not glue (allows removal). Caulk seam at back wall with silicone." },
  { step: 11, title: "Install sink and faucet", detail: "Drop sink into cutout. Attach mounting clips from below. Connect water supply lines. Test for leaks before final install." },
  { step: 12, title: "Mount in van", detail: "Attach L-brackets to van floor ribs. Set galley in position. Level with shims. Bolt through L-brackets. Attach wall cleats to van ribs at top. Attach drawer fronts with adjustable clips." },
];

// ─── CNC resources ────────────────────────────────────────────────────────────
const CNC_RESOURCES = [
  { name: "Printables — Van Life Cabinet Files", url: "https://www.printables.com/search/models?q=van+cabinet", desc: "Free STL/DXF files for van cabinet parts" },
  { name: "GrabCAD — Van Interior Models", url: "https://grabcad.com/library?query=van+interior", desc: "Full CAD models for van builds" },
  { name: "OpenDesk — Flat-Pack Furniture", url: "https://www.opendesk.cc", desc: "CNC-ready flat-pack furniture DXF files" },
  { name: "Fusion 360 (free for personal use)", url: "https://www.autodesk.com/products/fusion-360/personal", desc: "Full parametric CAD + CAM for CNC routing" },
  { name: "VCarve Pro", url: "https://www.vectric.com/products/vcarve-pro", desc: "CNC toolpath software, imports DXF/SVG" },
  { name: "Easel by Inventables", url: "https://easel.inventables.com", desc: "Browser-based CNC design + toolpath, free tier" },
  { name: "CutList Plus (cabinet optimizer)", url: "https://www.cutlistplus.com", desc: "Optimizes sheet cuts to minimize waste" },
  { name: "r/hobbycnc", url: "https://www.reddit.com/r/hobbycnc", desc: "CNC community — bit selection, feeds & speeds" },
];

// ─── Isometric SVG Preview ────────────────────────────────────────────────────
function IsometricPreview({ c }: { c: GalleyConfig }) {
  // Scale everything to fit in ~500x320 SVG
  const scale = Math.min(380 / c.galleyL, 200 / c.galleyH, 180 / c.galleyW);
  const L = c.galleyL * scale;
  const W = c.galleyW * scale;
  const H = c.galleyH * scale;
  const FL = c.fridgeL * scale;
  const FH = c.fridgeH * scale;
  const SL = c.sinkL * scale;
  const DL = L - FL - SL;

  // Isometric projection helpers
  const iso = (x: number, y: number, z: number) => ({
    x: 260 + (x - y) * 0.866,
    y: 60 + (x + y) * 0.5 - z,
  });

  // Draw a box face given 4 iso points
  const face = (pts: Array<{ x: number; y: number }>, fill: string, stroke = "#c9a96e", opacity = 1) =>
    `<polygon points="${pts.map(p => `${p.x},${p.y}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="0.8" opacity="${opacity}" />`;

  // Main carcass — top face
  const tfl = iso(0, 0, H); const tfr = iso(L, 0, H);
  const tbr = iso(L, W, H); const tbl = iso(0, W, H);
  // Front face
  const bfl = iso(0, 0, 0); const bfr = iso(L, 0, 0);
  // Right face
  const brr = iso(L, W, 0);

  // Countertop
  const ctTop = face([tfl, tfr, tbr, tbl], "#1e1e1e", "#c9a96e");
  const ctFront = face([tfl, tfr, bfr, bfl], "#161616", "#c9a96e");
  const ctRight = face([tfr, tbr, brr, bfr], "#141414", "#c9a96e");

  // Fridge bay (left end, gold tint)
  const ff_tfl = iso(0, 0, FH); const ff_tfr = iso(FL, 0, FH);
  const ff_tbr = iso(FL, W, FH); const ff_tbl = iso(0, W, FH);
  const ff_bfl = iso(0, 0, 0); const ff_bfr = iso(FL, 0, 0);
  const ff_brr = iso(FL, W, 0);
  const fridgeFront = face([ff_tfl, ff_tfr, ff_bfr, ff_bfl], "#1a1600", "#c9a96e", 0.9);
  const fridgeTop = face([ff_tfl, ff_tfr, ff_tbr, ff_tbl], "#221c00", "#c9a96e", 0.9);
  const fridgeRight = face([ff_tfr, ff_tbr, ff_brr, ff_bfr], "#181200", "#c9a96e", 0.9);

  // Sink bay (right end, blue tint)
  const sx = L - SL;
  const sk_tfl = iso(sx, 0, H); const sk_tfr = iso(L, 0, H);
  const sk_tbr = iso(L, W, H); const sk_tbl = iso(sx, W, H);
  const sk_bfl = iso(sx, 0, 0); const sk_bfr = iso(L, 0, 0);
  const sk_brr = iso(L, W, 0);
  const sinkFront = face([sk_tfl, sk_tfr, sk_bfr, sk_bfl], "#001018", "#8ab4c9", 0.9);
  const sinkTop = face([sk_tfl, sk_tfr, sk_tbr, sk_tbl], "#001520", "#8ab4c9", 0.9);
  const sinkRight = face([sk_tfr, sk_tbr, sk_brr, sk_bfr], "#000e16", "#8ab4c9", 0.9);

  // Drawer zone lines
  const drawerLines: string[] = [];
  const dh = (c.drawerH * scale);
  for (let i = 1; i <= c.drawerCount; i++) {
    const z = i * dh;
    if (z > H) break;
    const dl1 = iso(FL, 0, z); const dl2 = iso(FL + DL, 0, z);
    drawerLines.push(`<line x1="${dl1.x}" y1="${dl1.y}" x2="${dl2.x}" y2="${dl2.y}" stroke="#c9a96e" stroke-width="0.6" stroke-dasharray="3,2" />`);
  }

  // Labels
  const fridgeLabelPt = iso(FL / 2, 0, FH / 2);
  const drawerLabelPt = iso(FL + DL / 2, 0, H / 2);
  const sinkLabelPt = iso(sx + SL / 2, 0, H / 2);

  return (
    <svg viewBox="0 0 520 340" className="w-full h-full" style={{ maxHeight: 320 }}>
      <rect width="520" height="340" fill="#0d0d0d" />
      {/* Grid floor */}
      {Array.from({ length: 8 }, (_, i) => {
        const p1 = iso(i * L / 7, 0, 0); const p2 = iso(i * L / 7, W, 0);
        return <line key={`gx${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#2e2e2e" strokeWidth="0.5" />;
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const p1 = iso(0, i * W / 4, 0); const p2 = iso(L, i * W / 4, 0);
        return <line key={`gy${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#2e2e2e" strokeWidth="0.5" />;
      })}
      {/* Carcass shell */}
      <g dangerouslySetInnerHTML={{ __html: ctRight + ctFront + ctTop }} />
      {/* Fridge bay */}
      <g dangerouslySetInnerHTML={{ __html: fridgeRight + fridgeFront + fridgeTop }} />
      {/* Sink bay */}
      <g dangerouslySetInnerHTML={{ __html: sinkRight + sinkFront + sinkTop }} />
      {/* Drawer lines */}
      <g dangerouslySetInnerHTML={{ __html: drawerLines.join("") }} />
      {/* Labels */}
      <text x={fridgeLabelPt.x} y={fridgeLabelPt.y} fill="#c9a96e" fontSize="9" textAnchor="middle" fontFamily="monospace">FRIDGE</text>
      <text x={drawerLabelPt.x} y={drawerLabelPt.y} fill="#c9a96e" fontSize="9" textAnchor="middle" fontFamily="monospace">DRAWERS</text>
      <text x={sinkLabelPt.x} y={sinkLabelPt.y} fill="#8ab4c9" fontSize="9" textAnchor="middle" fontFamily="monospace">SINK</text>
      {/* Dimension annotations */}
      <text x="10" y="320" fill="#9a8f7e" fontSize="8" fontFamily="monospace">{c.galleyL}" L × {c.galleyW}" W × {c.galleyH}" H</text>
      <text x="10" y="330" fill="#9a8f7e" fontSize="8" fontFamily="monospace">Fridge: {c.fridgeL}" | Drawers: {(c.galleyL - c.fridgeL - c.sinkL).toFixed(1)}" | Sink: {c.sinkL}"</text>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TABS = ["3D Preview", "Cut Sheet", "Buy List", "Assembly", "CNC / CAD"] as const;
type Tab = typeof TABS[number];

const gold = "#c9a96e";
const parchment = "#e8dcc8";
const muted = "#9a8f7e";
const dark = "#0d0d0d";
const panel = "#111111";
const border = "#2e2e2e";

export default function VanBuilder() {
  const [cfg, setCfg] = useState<GalleyConfig>(DEFAULT);
  const [tab, setTab] = useState<Tab>("3D Preview");

  const cutList = useMemo(() => computeCutList(cfg), [cfg]);
  const bom = useMemo(() => computeBOM(cfg), [cfg]);
  const totalBOM = bom.reduce((s, i) => s + i.qty * i.unitCost, 0);

  const set = (key: keyof GalleyConfig, val: number | string) =>
    setCfg(prev => ({ ...prev, [key]: val }));

  const downloadCSV = () => {
    const rows = [
      ["Part", "Qty", "Length (in)", "Width (in)", "Thickness (in)", "Notes"],
      ...cutList.map(p => [p.name, p.qty, p.length.toFixed(3), p.width.toFixed(3), p.thickness, p.notes]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "galley-cut-sheet.csv"; a.click();
  };

  const downloadDXF = () => {
    let dxf = "0\nSECTION\n2\nENTITIES\n";
    let y = 0;
    cutList.forEach(p => {
      for (let i = 0; i < p.qty; i++) {
        dxf += `0\nLWPOLYLINE\n8\n0\n90\n4\n70\n1\n10\n0\n20\n${y}\n10\n${p.length}\n20\n${y}\n10\n${p.length}\n20\n${y + p.width}\n10\n0\n20\n${y + p.width}\n`;
        y += p.width + 2;
      }
    });
    dxf += "0\nENDSEC\n0\nEOF";
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([dxf], { type: "application/dxf" }));
    a.download = "galley-cut-sheet.dxf"; a.click();
  };

  const inputStyle = {
    background: "#1a1a1a", border: `1px solid ${border}`, color: parchment,
    padding: "6px 10px", fontSize: 13, width: "100%", borderRadius: 4,
    outline: "none", fontFamily: "monospace",
  };

  const labelStyle = { color: muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: 3 };

  return (
    <div style={{ background: dark, minHeight: "100vh", color: parchment, fontFamily: "system-ui, sans-serif" }}>
      <Header />
      <div style={{ paddingTop: 80, maxWidth: 1400, margin: "0 auto", padding: "80px 16px 40px" }}>

        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>VAN BUILD TOOLS</div>
          <h1 style={{ color: parchment, fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Galley Kitchen Builder</h1>
          <p style={{ color: muted, fontSize: 14, margin: "6px 0 0" }}>Enter your measurements → get a 3D preview, cut sheet, parts list, and assembly guide.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>

          {/* ── Left: Measurement Panel ── */}
          <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20, position: "sticky", top: 80 }}>
            <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Measurements (inches)</div>

            {/* Galley */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: parchment, fontSize: 12, fontWeight: 700, marginBottom: 8, borderBottom: `1px solid ${border}`, paddingBottom: 4 }}>Overall Galley</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {(["galleyL", "galleyW", "galleyH"] as const).map((k, i) => (
                  <div key={k}>
                    <label style={labelStyle}>{["Length", "Width", "Height"][i]}</label>
                    <input type="number" style={inputStyle} value={cfg[k]} min={1} step={0.25}
                      onChange={e => set(k, parseFloat(e.target.value) || 1)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Fridge */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: gold, fontSize: 12, fontWeight: 700, marginBottom: 8, borderBottom: `1px solid ${border}`, paddingBottom: 4 }}>Fridge Bay (left end)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {(["fridgeL", "fridgeW", "fridgeH"] as const).map((k, i) => (
                  <div key={k}>
                    <label style={labelStyle}>{["Length", "Width", "Height"][i]}</label>
                    <input type="number" style={inputStyle} value={cfg[k]} min={1} step={0.25}
                      onChange={e => set(k, parseFloat(e.target.value) || 1)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Sink */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "#8ab4c9", fontSize: 12, fontWeight: 700, marginBottom: 8, borderBottom: `1px solid ${border}`, paddingBottom: 4 }}>Sink (right end)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {(["sinkL", "sinkW", "sinkD"] as const).map((k, i) => (
                  <div key={k}>
                    <label style={labelStyle}>{["Length", "Width", "Depth"][i]}</label>
                    <input type="number" style={inputStyle} value={cfg[k]} min={1} step={0.25}
                      onChange={e => set(k, parseFloat(e.target.value) || 1)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Drawers */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: parchment, fontSize: 12, fontWeight: 700, marginBottom: 8, borderBottom: `1px solid ${border}`, paddingBottom: 4 }}>Drawers (middle zone)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <label style={labelStyle}>Count</label>
                  <input type="number" style={inputStyle} value={cfg.drawerCount} min={1} max={12} step={1}
                    onChange={e => set("drawerCount", parseInt(e.target.value) || 1)} />
                </div>
                <div>
                  <label style={labelStyle}>Each Height</label>
                  <input type="number" style={inputStyle} value={cfg.drawerH} min={3} step={0.25}
                    onChange={e => set("drawerH", parseFloat(e.target.value) || 3)} />
                </div>
              </div>
            </div>

            {/* Material */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Material</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={cfg.material}
                onChange={e => set("material", e.target.value)}>
                <option value="plywood">3/4" Baltic Birch Plywood</option>
                <option value="mdf">3/4" MDF</option>
                <option value="alum">Aluminum Extrusion (80/20)</option>
              </select>
            </div>

            {/* Zone summary */}
            <div style={{ background: "#0d0d0d", border: `1px solid ${border}`, borderRadius: 6, padding: 12, fontSize: 12, fontFamily: "monospace" }}>
              <div style={{ color: muted, marginBottom: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>ZONE BREAKDOWN</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ color: gold }}>Fridge</span><span>{cfg.fridgeL}"</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ color: parchment }}>Drawers</span><span>{(cfg.galleyL - cfg.fridgeL - cfg.sinkL).toFixed(2)}"</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#8ab4c9" }}>Sink</span><span>{cfg.sinkL}"</span>
              </div>
              <div style={{ borderTop: `1px solid ${border}`, paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: muted }}>Total</span>
                <span style={{ color: (cfg.fridgeL + cfg.sinkL) > cfg.galleyL ? "#ff6b6b" : gold }}>
                  {(cfg.fridgeL + (cfg.galleyL - cfg.fridgeL - cfg.sinkL) + cfg.sinkL).toFixed(2)}" / {cfg.galleyL}"
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Tabs ── */}
          <div>
            {/* Tab bar */}
            <div style={{ display: "flex", gap: 2, marginBottom: 16, borderBottom: `1px solid ${border}`, paddingBottom: 0 }}>
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: "none", border: "none", cursor: "pointer", padding: "10px 16px",
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: tab === t ? gold : muted,
                  borderBottom: tab === t ? `2px solid ${gold}` : "2px solid transparent",
                  transition: "color 0.15s",
                }}>{t}</button>
              ))}
            </div>

            {/* 3D Preview */}
            {tab === "3D Preview" && (
              <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
                <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Isometric Preview</div>
                <IsometricPreview c={cfg} />
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {[
                    { label: "Galley Volume", val: `${(cfg.galleyL * cfg.galleyW * cfg.galleyH / 1728).toFixed(2)} cu ft` },
                    { label: "Counter Area", val: `${(cfg.galleyL * cfg.galleyW / 144).toFixed(1)} sq ft` },
                    { label: "Drawer Zone", val: `${(cfg.galleyL - cfg.fridgeL - cfg.sinkL).toFixed(1)}"` },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ background: dark, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 12px", textAlign: "center" }}>
                      <div style={{ color: muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                      <div style={{ color: gold, fontSize: 18, fontWeight: 800, fontFamily: "monospace" }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cut Sheet */}
            {tab === "Cut Sheet" && (
              <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Cut Sheet — {cutList.reduce((s, p) => s + p.qty, 0)} pieces</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={downloadCSV} style={{ background: "#1a1a1a", border: `1px solid ${border}`, color: gold, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em" }}>↓ CSV</button>
                    <button onClick={downloadDXF} style={{ background: "#1a1a1a", border: `1px solid ${border}`, color: gold, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em" }}>↓ DXF</button>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${border}` }}>
                        {["Part Name", "Qty", "Length\"", "Width\"", "Thick\"", "Notes"].map(h => (
                          <th key={h} style={{ color: muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 10px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cutList.map((p, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${border}22`, background: i % 2 === 0 ? "transparent" : "#0d0d0d" }}>
                          <td style={{ padding: "7px 10px", color: parchment }}>{p.name}</td>
                          <td style={{ padding: "7px 10px", color: gold, fontWeight: 700 }}>{p.qty}</td>
                          <td style={{ padding: "7px 10px", color: parchment }}>{p.length.toFixed(3)}</td>
                          <td style={{ padding: "7px 10px", color: parchment }}>{p.width.toFixed(3)}</td>
                          <td style={{ padding: "7px 10px", color: muted }}>{p.thickness}</td>
                          <td style={{ padding: "7px 10px", color: muted, fontSize: 11 }}>{p.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Buy List */}
            {tab === "Buy List" && (
              <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Parts & Materials</div>
                  <div style={{ color: gold, fontSize: 18, fontWeight: 800, fontFamily: "monospace" }}>Est. ${totalBOM.toFixed(0)}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {bom.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: dark, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 14px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: parchment, fontSize: 13, fontWeight: 600 }}>{item.item}</div>
                        <div style={{ color: muted, fontSize: 11, marginTop: 2 }}>{item.qty} {item.unit} × ${item.unitCost}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ color: gold, fontWeight: 800, fontFamily: "monospace", fontSize: 14 }}>${(item.qty * item.unitCost).toFixed(0)}</div>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: gold, fontSize: 11, fontWeight: 700, textDecoration: "none", border: `1px solid ${border}`, padding: "4px 10px", borderRadius: 4 }}>Buy →</a>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, borderTop: `1px solid ${border}`, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: muted, fontSize: 13 }}>Estimated Total (materials only)</span>
                  <span style={{ color: gold, fontSize: 20, fontWeight: 800, fontFamily: "monospace" }}>${totalBOM.toFixed(0)}</span>
                </div>
              </div>
            )}

            {/* Assembly */}
            {tab === "Assembly" && (
              <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
                <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Assembly Guide — {ASSEMBLY_STEPS.length} Steps</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {ASSEMBLY_STEPS.map(s => (
                    <div key={s.step} style={{ display: "flex", gap: 14, background: dark, border: `1px solid ${border}`, borderRadius: 6, padding: "12px 14px" }}>
                      <div style={{ minWidth: 32, height: 32, background: "#1a1600", border: `1px solid ${gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: gold, fontSize: 13, fontWeight: 800, fontFamily: "monospace", flexShrink: 0 }}>{s.step}</div>
                      <div>
                        <div style={{ color: parchment, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                        <div style={{ color: muted, fontSize: 12, lineHeight: 1.6 }}>{s.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CNC / CAD */}
            {tab === "CNC / CAD" && (
              <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
                <div style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>CNC & CAD Resources</div>

                {/* DXF export */}
                <div style={{ background: dark, border: `1px solid ${gold}44`, borderRadius: 6, padding: 16, marginBottom: 20 }}>
                  <div style={{ color: parchment, fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Export Your Design</div>
                  <p style={{ color: muted, fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>
                    Download a DXF file of your cut sheet to open in VCarve Pro, Fusion 360, Easel, or any CNC software. All panels are laid out as flat rectangles ready for toolpath generation.
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={downloadDXF} style={{ background: gold, color: dark, border: "none", padding: "8px 20px", fontSize: 12, fontWeight: 800, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em" }}>↓ Download DXF</button>
                    <button onClick={downloadCSV} style={{ background: "#1a1a1a", border: `1px solid ${border}`, color: gold, padding: "8px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer", borderRadius: 4, letterSpacing: "0.08em" }}>↓ Download CSV</button>
                  </div>
                </div>

                {/* CNC tips */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ color: parchment, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>CNC Routing Tips</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { tip: "Bit", val: "1/4\" upcut spiral for plywood" },
                      { tip: "Feed rate", val: "80–120 IPM for 3/4\" ply" },
                      { tip: "Depth per pass", val: "1/4\" max (3 passes)" },
                      { tip: "Dogbone fillets", val: "Add to all inside corners" },
                      { tip: "Tabs", val: "4–6 tabs per panel, 0.2\" tall" },
                      { tip: "Climb cut", val: "Final pass conventional cut" },
                    ].map(({ tip, val }) => (
                      <div key={tip} style={{ background: dark, border: `1px solid ${border}`, borderRadius: 4, padding: "8px 12px" }}>
                        <div style={{ color: gold, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{tip}</div>
                        <div style={{ color: parchment, fontSize: 12, marginTop: 2 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* External resources */}
                <div>
                  <div style={{ color: parchment, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Pre-Made CAD Files & Software</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {CNC_RESOURCES.map(r => (
                      <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: dark, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 14px", textDecoration: "none", transition: "border-color 0.15s" }}>
                        <div>
                          <div style={{ color: parchment, fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                          <div style={{ color: muted, fontSize: 11, marginTop: 2 }}>{r.desc}</div>
                        </div>
                        <span style={{ color: gold, fontSize: 16, marginLeft: 12 }}>→</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
