/**
 * VanBuilder — Galley Kitchen Configurator
 * Vanciety palette: #0d0d0d bg | #c9a96e gold | #e8dcc8 parchment | #141414 card | #2e2e2e border
 *
 * Sections:
 *  1. Measurement panel (real-time inputs)
 *  2. 3D preview (Three.js / React Three Fiber)
 *  3. Tabs: Cut Sheet | BOM | Assembly | CNC Export
 */

import { useState, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Header from "@/components/Header";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GalleyConfig {
  // Overall galley
  galleyLength: number;
  galleyWidth: number;
  galleyHeight: number;
  materialThickness: number;
  // Fridge
  fridgeWidth: number;
  fridgeDepth: number;
  fridgeHeight: number;
  // Sink
  sinkWidth: number;
  sinkDepth: number;
  sinkHeight: number;
  // Drawer column
  drawerCount: number;
  // Material
  material: "plywood" | "mdf" | "aluminum" | "cnc-plywood";
}

// ─── Default config (your exact measurements) ─────────────────────────────────
const DEFAULT_CONFIG: GalleyConfig = {
  galleyLength: 50,
  galleyWidth: 20,
  galleyHeight: 40,
  materialThickness: 0.75,
  fridgeWidth: 22,
  fridgeDepth: 20,
  fridgeHeight: 30,
  sinkWidth: 11,
  sinkDepth: 11,
  sinkHeight: 9,
  drawerCount: 4,
  material: "plywood",
};

// ─── 3D Scene ─────────────────────────────────────────────────────────────────
const SCALE = 0.04; // inches → Three.js units

function GalleyModel({ cfg }: { cfg: GalleyConfig }) {
  const t = cfg.materialThickness;
  const gold = "#c9a96e";
  const dark = "#1a1a1a";
  const mid = "#2e2e2e";
  const light = "#3a3a3a";
  const counterTop = "#c9a96e";

  const s = (v: number) => v * SCALE;

  // Derived dimensions
  const drawerColWidth = cfg.galleyLength - cfg.fridgeWidth - cfg.sinkWidth - t * 3;
  const counterHeight = cfg.galleyHeight - t; // counter sits on top of carcass

  const meshes: JSX.Element[] = [];

  // Helper: box mesh
  const box = (
    key: string,
    w: number, h: number, d: number,
    x: number, y: number, z: number,
    color: string,
    opacity = 1
  ) => (
    <mesh key={key} position={[s(x), s(y), s(z)]} castShadow receiveShadow>
      <boxGeometry args={[s(w), s(h), s(d)]} />
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.7}
        metalness={0.05}
      />
    </mesh>
  );

  // ── Floor panel
  meshes.push(box("floor", cfg.galleyLength, t, cfg.galleyWidth, cfg.galleyLength / 2, t / 2, cfg.galleyWidth / 2, mid));

  // ── Left wall (fridge side)
  meshes.push(box("leftWall", t, cfg.galleyHeight, cfg.galleyWidth, t / 2, cfg.galleyHeight / 2, cfg.galleyWidth / 2, mid));

  // ── Right wall (sink side)
  meshes.push(box("rightWall", t, cfg.galleyHeight, cfg.galleyWidth, cfg.galleyLength - t / 2, cfg.galleyHeight / 2, cfg.galleyWidth / 2, mid));

  // ── Back wall
  meshes.push(box("backWall", cfg.galleyLength, cfg.galleyHeight, t, cfg.galleyLength / 2, cfg.galleyHeight / 2, t / 2, dark));

  // ── Counter top
  meshes.push(box("counter", cfg.galleyLength, t, cfg.galleyWidth, cfg.galleyLength / 2, cfg.galleyHeight - t / 2, cfg.galleyWidth / 2, counterTop));

  // ── Fridge box (left end)
  const fridgeX = t + cfg.fridgeWidth / 2;
  meshes.push(box("fridgeFill", cfg.fridgeWidth - t, cfg.fridgeHeight, cfg.fridgeDepth - t, fridgeX, cfg.fridgeHeight / 2, cfg.fridgeDepth / 2 + t, "#1c1c1c"));
  // fridge door
  meshes.push(box("fridgeDoor", cfg.fridgeWidth - t, cfg.fridgeHeight - t * 2, t * 0.5, fridgeX, cfg.fridgeHeight / 2, cfg.fridgeDepth + t * 0.25, "#252525"));
  // fridge handle
  meshes.push(box("fridgeHandle", t * 0.5, cfg.fridgeHeight * 0.4, t * 0.5, fridgeX + cfg.fridgeWidth * 0.3, cfg.fridgeHeight * 0.55, cfg.fridgeDepth + t * 0.6, gold));

  // ── Drawer column (right of fridge, left of sink)
  const drawerColX = t + cfg.fridgeWidth + t;
  const drawerColH = cfg.galleyHeight - t * 2; // floor to counter underside
  const drawerH = drawerColH / cfg.drawerCount;

  // drawer column side panels
  meshes.push(box("dcLeft", t, drawerColH, cfg.galleyWidth - t, drawerColX + t / 2, t + drawerColH / 2, cfg.galleyWidth / 2, mid));
  meshes.push(box("dcRight", t, drawerColH, cfg.galleyWidth - t, drawerColX + drawerColWidth - t / 2, t + drawerColH / 2, cfg.galleyWidth / 2, mid));

  // drawers
  for (let i = 0; i < cfg.drawerCount; i++) {
    const dy = t + drawerH * i + drawerH / 2;
    const dw = drawerColWidth - t * 2;
    // drawer face
    meshes.push(box(`df${i}`, dw, drawerH - t * 0.5, t * 0.6, drawerColX + drawerColWidth / 2, dy, cfg.galleyWidth - t * 0.3, light));
    // drawer handle
    meshes.push(box(`dh${i}`, dw * 0.4, t * 0.4, t * 0.3, drawerColX + drawerColWidth / 2, dy, cfg.galleyWidth - t * 0.1, gold));
  }

  // ── Sink area (right end)
  const sinkX = cfg.galleyLength - t - cfg.sinkWidth;
  // sink cabinet carcass
  meshes.push(box("sinkLeft", t, cfg.galleyHeight - t, cfg.galleyWidth - t, sinkX - t / 2, (cfg.galleyHeight - t) / 2, cfg.galleyWidth / 2, mid));
  // sink basin (inset into counter)
  meshes.push(box("sinkBasin", cfg.sinkWidth - t, cfg.sinkHeight, cfg.sinkDepth - t, sinkX + cfg.sinkWidth / 2, cfg.galleyHeight - t - cfg.sinkHeight / 2, cfg.sinkDepth / 2 + t, "#111"));
  // sink faucet
  meshes.push(box("faucetBase", t * 0.6, t * 3, t * 0.6, sinkX + cfg.sinkWidth / 2, cfg.galleyHeight - t + t * 1.5, cfg.galleyWidth * 0.3, "#888"));
  meshes.push(box("faucetArm", t * 3, t * 0.4, t * 0.4, sinkX + cfg.sinkWidth / 2 + t * 1, cfg.galleyHeight - t + t * 3, cfg.galleyWidth * 0.3, "#888"));

  // ── Toe kick
  meshes.push(box("toeKick", cfg.galleyLength - t * 2, t * 4, t, cfg.galleyLength / 2, t * 2, cfg.galleyWidth - t / 2, "#111"));

  return <>{meshes}</>;
}

function Scene({ cfg }: { cfg: GalleyConfig }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <Suspense fallback={null}>
        <GalleyModel cfg={cfg} />
      </Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40, 20, 20]} />
        <meshStandardMaterial color="#111111" wireframe opacity={0.3} transparent />
      </mesh>
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={20}
        target={[cfg.galleyLength * SCALE * 0.5, cfg.galleyHeight * SCALE * 0.5, cfg.galleyWidth * SCALE * 0.5]}
      />
    </>
  );
}

// ─── Cut Sheet Generator ───────────────────────────────────────────────────────
function generateCutSheet(cfg: GalleyConfig) {
  const t = cfg.materialThickness;
  const drawerColWidth = cfg.galleyLength - cfg.fridgeWidth - cfg.sinkWidth - t * 3;
  const drawerColH = cfg.galleyHeight - t * 2;
  const drawerH = drawerColH / cfg.drawerCount;

  return [
    { part: "Floor Panel", qty: 1, l: cfg.galleyLength, w: cfg.galleyWidth, thick: t, notes: "Main base" },
    { part: "Counter Top", qty: 1, l: cfg.galleyLength, w: cfg.galleyWidth, thick: t, notes: "Top surface" },
    { part: "Left Wall (Fridge Side)", qty: 1, l: cfg.galleyHeight, w: cfg.galleyWidth, thick: t, notes: "Left end panel" },
    { part: "Right Wall (Sink Side)", qty: 1, l: cfg.galleyHeight, w: cfg.galleyWidth, thick: t, notes: "Right end panel" },
    { part: "Back Wall", qty: 1, l: cfg.galleyLength, w: cfg.galleyHeight, thick: t, notes: "Full back panel" },
    { part: "Fridge Surround — Top", qty: 1, l: cfg.fridgeWidth, w: cfg.galleyWidth, thick: t, notes: "Above fridge" },
    { part: "Fridge Surround — Side", qty: 1, l: cfg.fridgeHeight, w: cfg.galleyWidth, thick: t, notes: "Right side of fridge opening" },
    { part: "Drawer Col — Left Panel", qty: 1, l: drawerColH, w: cfg.galleyWidth - t, thick: t, notes: "Left side of drawer column" },
    { part: "Drawer Col — Right Panel", qty: 1, l: drawerColH, w: cfg.galleyWidth - t, thick: t, notes: "Right side of drawer column" },
    ...Array.from({ length: cfg.drawerCount }, (_, i) => ({
      part: `Drawer Face ${i + 1}`,
      qty: 1,
      l: parseFloat((drawerColWidth - t * 2).toFixed(3)),
      w: parseFloat((drawerH - t * 0.5).toFixed(3)),
      thick: t * 0.75,
      notes: `Drawer ${i + 1} of ${cfg.drawerCount}`,
    })),
    ...Array.from({ length: cfg.drawerCount }, (_, i) => ({
      part: `Drawer Box — Front/Back ${i + 1}`,
      qty: 2,
      l: parseFloat((drawerColWidth - t * 4).toFixed(3)),
      w: parseFloat((drawerH - t * 2).toFixed(3)),
      thick: t * 0.5,
      notes: `Drawer ${i + 1} front & back`,
    })),
    ...Array.from({ length: cfg.drawerCount }, (_, i) => ({
      part: `Drawer Box — Sides ${i + 1}`,
      qty: 2,
      l: parseFloat((cfg.galleyWidth - t * 4).toFixed(3)),
      w: parseFloat((drawerH - t * 2).toFixed(3)),
      thick: t * 0.5,
      notes: `Drawer ${i + 1} left & right sides`,
    })),
    ...Array.from({ length: cfg.drawerCount }, (_, i) => ({
      part: `Drawer Bottom ${i + 1}`,
      qty: 1,
      l: parseFloat((drawerColWidth - t * 4).toFixed(3)),
      w: parseFloat((cfg.galleyWidth - t * 4).toFixed(3)),
      thick: t * 0.25,
      notes: `Drawer ${i + 1} bottom (1/4" ply)`,
    })),
    { part: "Sink Cabinet — Left Panel", qty: 1, l: cfg.galleyHeight - t, w: cfg.galleyWidth - t, thick: t, notes: "Left side of sink cabinet" },
    { part: "Sink Cabinet — Shelf", qty: 1, l: cfg.sinkWidth - t, w: cfg.galleyWidth - t * 2, thick: t, notes: "Under-sink shelf" },
    { part: "Toe Kick", qty: 1, l: cfg.galleyLength - t * 2, w: t * 4, thick: t, notes: "Front toe kick" },
  ];
}

// ─── BOM Generator ─────────────────────────────────────────────────────────────
function generateBOM(cfg: GalleyConfig) {
  const sheetArea = cfg.galleyLength * cfg.galleyWidth / 144; // rough sq ft
  const sheets = Math.ceil(sheetArea / 32 * 1.2); // 4x8 sheet = 32sqft, +20% waste

  const items = [
    {
      item: `3/4" Baltic Birch Plywood (4×8 sheet)`,
      qty: sheets,
      unit: "sheet",
      estCost: sheets * 85,
      supplier: "Home Depot / Menards / Local Lumber",
      link: "https://www.homedepot.com/s/baltic%20birch%20plywood",
      notes: "Main carcass material",
    },
    {
      item: `1/4" Plywood (4×8 sheet)`,
      qty: cfg.drawerCount,
      unit: "sheet",
      estCost: cfg.drawerCount * 28,
      supplier: "Home Depot",
      link: "https://www.homedepot.com/s/1%2F4%20plywood",
      notes: "Drawer bottoms",
    },
    {
      item: "Undermount Drawer Slides (pair)",
      qty: cfg.drawerCount,
      unit: "pair",
      estCost: cfg.drawerCount * 22,
      supplier: "Amazon / Rockler",
      link: "https://www.amazon.com/s?k=undermount+drawer+slides+soft+close",
      notes: "Soft-close, full extension",
    },
    {
      item: "Drawer Pulls / Handles",
      qty: cfg.drawerCount,
      unit: "ea",
      estCost: cfg.drawerCount * 8,
      supplier: "Amazon",
      link: "https://www.amazon.com/s?k=cabinet+drawer+pulls",
      notes: "Match your style",
    },
    {
      item: "Pocket Hole Screws (box)",
      qty: 2,
      unit: "box",
      estCost: 18,
      supplier: "Amazon / Rockler",
      link: "https://www.amazon.com/s?k=kreg+pocket+hole+screws",
      notes: "1-1/4\" and 1-1/2\" assortment",
    },
    {
      item: "Wood Glue (16oz)",
      qty: 1,
      unit: "bottle",
      estCost: 12,
      supplier: "Home Depot",
      link: "https://www.homedepot.com/s/titebond+wood+glue",
      notes: "Titebond II or III",
    },
    {
      item: "Countertop Material",
      qty: 1,
      unit: "slab",
      estCost: 120,
      supplier: "IKEA / Home Depot / Custom",
      link: "https://www.homedepot.com/s/butcher+block+countertop",
      notes: "Butcher block or laminate",
    },
    {
      item: "RV Sink (stainless)",
      qty: 1,
      unit: "ea",
      estCost: 65,
      supplier: "Amazon",
      link: "https://www.amazon.com/s?k=rv+van+sink+stainless+small",
      notes: `Fits ${cfg.sinkWidth}×${cfg.sinkDepth} cutout`,
    },
    {
      item: "RV Faucet",
      qty: 1,
      unit: "ea",
      estCost: 45,
      supplier: "Amazon",
      link: "https://www.amazon.com/s?k=rv+faucet+kitchen",
      notes: "Low-profile for van clearance",
    },
    {
      item: "Iron-on Edge Banding (25ft roll)",
      qty: 2,
      unit: "roll",
      estCost: 28,
      supplier: "Amazon / Rockler",
      link: "https://www.amazon.com/s?k=iron+on+edge+banding+birch",
      notes: "Finish exposed plywood edges",
    },
    {
      item: "Sandpaper Assortment",
      qty: 1,
      unit: "pack",
      estCost: 15,
      supplier: "Home Depot",
      link: "https://www.homedepot.com/s/sandpaper+assortment",
      notes: "80/120/180/220 grit",
    },
    {
      item: "Finish (Danish Oil or Polyurethane)",
      qty: 1,
      unit: "quart",
      estCost: 22,
      supplier: "Home Depot",
      link: "https://www.homedepot.com/s/danish+oil+finish",
      notes: "Food-safe if near sink",
    },
  ];

  const total = items.reduce((sum, i) => sum + i.estCost, 0);
  return { items, total };
}

// ─── Assembly Steps ────────────────────────────────────────────────────────────
const ASSEMBLY_STEPS = [
  {
    step: 1,
    title: "Cut all panels",
    detail:
      "Using your cut sheet, rip all panels to width on a table saw, then cross-cut to length. Label each piece with a pencil on the inside face. Stack by assembly group.",
    tip: "Cut the floor panel and back wall first — they set the reference dimensions for everything else.",
  },
  {
    step: 2,
    title: "Apply edge banding",
    detail:
      "Iron edge banding onto all exposed front edges of the carcass panels. Trim flush with a router or sharp chisel. Sand with 180 grit.",
    tip: "Do this before assembly — it's much easier on flat panels.",
  },
  {
    step: 3,
    title: "Drill pocket holes",
    detail:
      "Set your Kreg jig to 3/4\" material. Drill pocket holes on the inside faces of the floor panel, top panel, and all dividers. Use 1-1/4\" screws for face-to-face joints.",
    tip: "Clamp panels to your workbench when drilling — movement causes misaligned holes.",
  },
  {
    step: 4,
    title: "Assemble fridge surround",
    detail:
      "Glue and screw the left wall, fridge top panel, and fridge right divider together. Square up with a framing square. Let glue cure 30 min before moving.",
    tip: "Check diagonal measurements — they should be equal if the box is square.",
  },
  {
    step: 5,
    title: "Build drawer column",
    detail:
      "Attach the drawer column left and right panels to the floor panel. Install horizontal shelf dividers at equal spacing based on your drawer height calculation. Glue + pocket screws.",
    tip: "Clamp a straight board across the front to keep panels plumb while glue dries.",
  },
  {
    step: 6,
    title: "Build drawer boxes",
    detail:
      "Assemble each drawer box with pocket screws. Attach the 1/4\" bottom with brad nails and glue. Test fit in the column before attaching drawer slides.",
    tip: "Drawer boxes should be 1\" narrower than the opening for slide clearance.",
  },
  {
    step: 7,
    title: "Install drawer slides",
    detail:
      "Mount the cabinet member of each slide to the column side panels. Mount the drawer member to the drawer box. Test fit and adjust until drawers slide smoothly.",
    tip: "Use a spacer block cut to the exact height to position each slide consistently.",
  },
  {
    step: 8,
    title: "Build sink cabinet",
    detail:
      "Assemble the sink cabinet carcass. Cut the sink hole in the counter top using a jigsaw — trace the sink template first. Test fit the sink before gluing.",
    tip: "Apply silicone sealant around the sink rim before final installation.",
  },
  {
    step: 9,
    title: "Join all sections",
    detail:
      "Connect the fridge surround, drawer column, and sink cabinet with pocket screws through the back wall and floor panel. Check that the front faces are flush.",
    tip: "Do a dry fit (no glue) first to confirm alignment before final assembly.",
  },
  {
    step: 10,
    title: "Install counter top",
    detail:
      "Attach the counter top with screws from below (through the top rail of each cabinet section). Do not glue — allows removal for van access.",
    tip: "Leave a 1/16\" gap at the back wall for expansion.",
  },
  {
    step: 11,
    title: "Attach drawer faces",
    detail:
      "With drawers installed, use double-sided tape to temporarily position each drawer face. Open the drawer and drive 2 screws from inside to lock the face in place. Drill and install handles.",
    tip: "Use playing cards as spacers between drawer faces for consistent gaps.",
  },
  {
    step: 12,
    title: "Install in van",
    detail:
      "Secure the galley to the van floor using L-brackets through the floor panel into the van floor ribs. Attach to the wall studs or extrusion rails at the back. Connect plumbing.",
    tip: "Use Loctite on all van-mounting hardware — vibration will loosen anything without thread-lock.",
  },
];

// ─── CNC Export ────────────────────────────────────────────────────────────────
function generateDXFContent(cfg: GalleyConfig): string {
  const cuts = generateCutSheet(cfg);
  let dxf = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;

  let offsetY = 0;
  cuts.forEach((cut) => {
    const w = cut.l;
    const h = cut.w;
    // Draw rectangle for each cut piece
    dxf += `0\nLWPOLYLINE\n8\n0\n90\n4\n70\n1\n`;
    dxf += `10\n0\n20\n${offsetY}\n`;
    dxf += `10\n${w}\n20\n${offsetY}\n`;
    dxf += `10\n${w}\n20\n${offsetY + h}\n`;
    dxf += `10\n0\n20\n${offsetY + h}\n`;
    // Label
    dxf += `0\nTEXT\n8\n0\n10\n2\n20\n${offsetY + h / 2}\n40\n1.5\n1\n${cut.part} (${cut.l}"×${cut.w}")\n`;
    offsetY += h + 4;
  });

  dxf += `0\nENDSEC\n0\nEOF`;
  return dxf;
}

function downloadDXF(cfg: GalleyConfig) {
  const content = generateDXFContent(cfg);
  const blob = new Blob([content], { type: "application/dxf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vanciety-galley-cutsheet.dxf";
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(cfg: GalleyConfig) {
  const cuts = generateCutSheet(cfg);
  const header = "Part,Qty,Length (in),Width (in),Thickness (in),Notes\n";
  const rows = cuts.map((c) => `"${c.part}",${c.qty},${c.l},${c.w},${c.thick},"${c.notes}"`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vanciety-galley-cutsheet.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Input component ──────────────────────────────────────────────────────────
function MeasInput({
  label, value, onChange, unit = "in", min = 1, max = 200,
}: {
  label: string; value: number; onChange: (v: number) => void; unit?: string; min?: number; max?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label style={{ color: "#9a8f7e", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={0.25}
          onChange={(e) => onChange(parseFloat(e.target.value) || min)}
          style={{
            background: "#0d0d0d",
            border: "1px solid #2e2e2e",
            color: "#e8dcc8",
            borderRadius: "4px",
            padding: "4px 8px",
            width: "80px",
            fontSize: "0.85rem",
            fontFamily: "monospace",
          }}
        />
        <span style={{ color: "#9a8f7e", fontSize: "0.75rem" }}>{unit}</span>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function VanBuilder() {
  const [cfg, setCfg] = useState<GalleyConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<"3d" | "cutsheet" | "bom" | "assembly" | "cnc">("3d");

  const set = (key: keyof GalleyConfig, val: number | string) =>
    setCfg((prev) => ({ ...prev, [key]: val }));

  const cutSheet = useMemo(() => generateCutSheet(cfg), [cfg]);
  const { items: bomItems, total: bomTotal } = useMemo(() => generateBOM(cfg), [cfg]);

  const drawerColWidth = cfg.galleyLength - cfg.fridgeWidth - cfg.sinkWidth - cfg.materialThickness * 3;

  const TABS = [
    { id: "3d", label: "3D Preview" },
    { id: "cutsheet", label: "Cut Sheet" },
    { id: "bom", label: "Buy List" },
    { id: "assembly", label: "Assembly" },
    { id: "cnc", label: "CNC / CAD" },
  ] as const;

  const gold = "#c9a96e";
  const parchment = "#e8dcc8";
  const muted = "#9a8f7e";
  const card = "#141414";
  const border = "#2e2e2e";

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", color: parchment }}>
      <Header />

      {/* Hero */}
      <div style={{ paddingTop: "80px", borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span style={{ color: gold, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace" }}>
              VAN BUILD CONFIGURATOR
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, color: parchment, marginBottom: "8px" }}>
            Galley Kitchen Builder
          </h1>
          <p style={{ color: muted, fontSize: "0.9rem", maxWidth: "600px" }}>
            Set your measurements, preview in 3D, then generate a cut sheet, buy list, and assembly guide. Export to DXF for CNC routing.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>

        {/* ── Left: Measurement Panel ── */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "8px", padding: "20px", height: "fit-content", position: "sticky", top: "90px" }}>
          <div style={{ color: gold, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", fontFamily: "monospace" }}>
            MEASUREMENTS
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ color: muted, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", borderBottom: `1px solid ${border}`, paddingBottom: "6px" }}>
              Overall Galley
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <MeasInput label="Length" value={cfg.galleyLength} onChange={(v) => set("galleyLength", v)} />
              <MeasInput label="Width (Depth)" value={cfg.galleyWidth} onChange={(v) => set("galleyWidth", v)} />
              <MeasInput label="Height" value={cfg.galleyHeight} onChange={(v) => set("galleyHeight", v)} />
              <MeasInput label="Material Thickness" value={cfg.materialThickness} onChange={(v) => set("materialThickness", v)} min={0.25} max={2} />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ color: muted, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", borderBottom: `1px solid ${border}`, paddingBottom: "6px" }}>
              Fridge (Left End)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <MeasInput label="Width" value={cfg.fridgeWidth} onChange={(v) => set("fridgeWidth", v)} />
              <MeasInput label="Depth" value={cfg.fridgeDepth} onChange={(v) => set("fridgeDepth", v)} />
              <MeasInput label="Height" value={cfg.fridgeHeight} onChange={(v) => set("fridgeHeight", v)} />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ color: muted, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", borderBottom: `1px solid ${border}`, paddingBottom: "6px" }}>
              Sink (Right End)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <MeasInput label="Width" value={cfg.sinkWidth} onChange={(v) => set("sinkWidth", v)} />
              <MeasInput label="Depth" value={cfg.sinkDepth} onChange={(v) => set("sinkDepth", v)} />
              <MeasInput label="Basin Depth" value={cfg.sinkHeight} onChange={(v) => set("sinkHeight", v)} />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ color: muted, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", borderBottom: `1px solid ${border}`, paddingBottom: "6px" }}>
              Drawers (Middle Column)
            </div>
            <MeasInput label="Number of Drawers" value={cfg.drawerCount} onChange={(v) => set("drawerCount", Math.round(v))} min={1} max={8} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ color: muted, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", borderBottom: `1px solid ${border}`, paddingBottom: "6px" }}>
              Material
            </div>
            <select
              value={cfg.material}
              onChange={(e) => set("material", e.target.value)}
              style={{ background: "#0d0d0d", border: `1px solid ${border}`, color: parchment, borderRadius: "4px", padding: "6px 10px", width: "100%", fontSize: "0.85rem" }}
            >
              <option value="plywood">Baltic Birch Plywood</option>
              <option value="mdf">MDF</option>
              <option value="aluminum">Aluminum Sheet</option>
              <option value="cnc-plywood">CNC Plywood (Nested)</option>
            </select>
          </div>

          {/* Derived dimensions callout */}
          <div style={{ background: "#0d0d0d", border: `1px solid ${border}`, borderRadius: "6px", padding: "12px", fontSize: "0.75rem", fontFamily: "monospace" }}>
            <div style={{ color: gold, marginBottom: "6px", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Derived</div>
            <div style={{ color: muted }}>Drawer col width: <span style={{ color: parchment }}>{drawerColWidth.toFixed(2)}"</span></div>
            <div style={{ color: muted }}>Drawer height ea: <span style={{ color: parchment }}>{((cfg.galleyHeight - cfg.materialThickness * 2) / cfg.drawerCount).toFixed(2)}"</span></div>
            <div style={{ color: muted }}>Counter overhang: <span style={{ color: parchment }}>0"</span></div>
            <div style={{ color: muted }}>Total parts: <span style={{ color: parchment }}>{cutSheet.length}</span></div>
          </div>

          <button
            onClick={() => setCfg(DEFAULT_CONFIG)}
            style={{ marginTop: "16px", width: "100%", padding: "8px", background: "transparent", border: `1px solid ${border}`, color: muted, borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}
          >
            Reset to Defaults
          </button>
        </div>

        {/* ── Right: Tabs ── */}
        <div>
          {/* Tab bar */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "16px", borderBottom: `1px solid ${border}`, paddingBottom: "0" }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "10px 18px",
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab.id ? `2px solid ${gold}` : "2px solid transparent",
                  color: activeTab === tab.id ? gold : muted,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  transition: "color 0.15s",
                  marginBottom: "-1px",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── 3D Preview ── */}
          {activeTab === "3d" && (
            <div style={{ background: "#0a0a0a", border: `1px solid ${border}`, borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ height: "520px" }}>
                <Canvas
                  shadows
                  camera={{
                    position: [cfg.galleyLength * SCALE * 1.8, cfg.galleyHeight * SCALE * 1.5, cfg.galleyWidth * SCALE * 3],
                    fov: 45,
                  }}
                  style={{ background: "#0a0a0a" }}
                >
                  <Scene cfg={cfg} />
                </Canvas>
              </div>
              <div style={{ padding: "12px 16px", borderTop: `1px solid ${border}`, display: "flex", gap: "24px", fontSize: "0.75rem", color: muted }}>
                <span>🖱 Left drag: rotate</span>
                <span>🖱 Right drag: pan</span>
                <span>🖱 Scroll: zoom</span>
                <span style={{ marginLeft: "auto", color: gold }}>
                  {cfg.galleyLength}" × {cfg.galleyWidth}" × {cfg.galleyHeight}"
                </span>
              </div>
            </div>
          )}

          {/* ── Cut Sheet ── */}
          {activeTab === "cutsheet" && (
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: gold, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>CUT SHEET</div>
                  <div style={{ color: muted, fontSize: "0.8rem" }}>{cutSheet.length} pieces · {cfg.material}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => downloadCSV(cfg)} style={{ padding: "8px 14px", background: "transparent", border: `1px solid ${border}`, color: parchment, borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
                    ↓ CSV
                  </button>
                  <button onClick={() => downloadDXF(cfg)} style={{ padding: "8px 14px", background: gold, border: "none", color: "#0d0d0d", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                    ↓ DXF (CNC)
                  </button>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                      {["#", "Part", "Qty", "Length", "Width", "Thick", "Notes"].map((h) => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: muted, fontWeight: 500, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cutSheet.map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${border}22`, background: i % 2 === 0 ? "transparent" : "#0d0d0d11" }}>
                        <td style={{ padding: "9px 14px", color: muted, fontFamily: "monospace" }}>{i + 1}</td>
                        <td style={{ padding: "9px 14px", color: parchment, fontWeight: 500 }}>{row.part}</td>
                        <td style={{ padding: "9px 14px", color: gold, fontFamily: "monospace" }}>{row.qty}</td>
                        <td style={{ padding: "9px 14px", color: parchment, fontFamily: "monospace" }}>{row.l}"</td>
                        <td style={{ padding: "9px 14px", color: parchment, fontFamily: "monospace" }}>{row.w}"</td>
                        <td style={{ padding: "9px 14px", color: muted, fontFamily: "monospace" }}>{row.thick}"</td>
                        <td style={{ padding: "9px 14px", color: muted, fontSize: "0.78rem" }}>{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── BOM ── */}
          {activeTab === "bom" && (
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: gold, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>BUY LIST</div>
                  <div style={{ color: muted, fontSize: "0.8rem" }}>{bomItems.length} items · Est. total: <span style={{ color: gold }}>${bomTotal.toLocaleString()}</span></div>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                      {["Item", "Qty", "Unit", "Est. Cost", "Supplier", "Notes"].map((h) => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: muted, fontWeight: 500, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bomItems.map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${border}22`, background: i % 2 === 0 ? "transparent" : "#0d0d0d11" }}>
                        <td style={{ padding: "9px 14px", color: parchment, fontWeight: 500 }}>{row.item}</td>
                        <td style={{ padding: "9px 14px", color: gold, fontFamily: "monospace" }}>{row.qty}</td>
                        <td style={{ padding: "9px 14px", color: muted }}>{row.unit}</td>
                        <td style={{ padding: "9px 14px", color: gold, fontFamily: "monospace" }}>${row.estCost}</td>
                        <td style={{ padding: "9px 14px" }}>
                          <a href={row.link} target="_blank" rel="noopener noreferrer" style={{ color: gold, textDecoration: "none", fontSize: "0.78rem" }}>
                            {row.supplier} ↗
                          </a>
                        </td>
                        <td style={{ padding: "9px 14px", color: muted, fontSize: "0.78rem" }}>{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: `1px solid ${border}` }}>
                      <td colSpan={3} style={{ padding: "12px 14px", color: muted, fontSize: "0.8rem" }}>Estimated total (materials only)</td>
                      <td style={{ padding: "12px 14px", color: gold, fontFamily: "monospace", fontWeight: 700, fontSize: "1rem" }}>${bomTotal.toLocaleString()}</td>
                      <td colSpan={2} style={{ padding: "12px 14px", color: muted, fontSize: "0.75rem" }}>Prices are estimates. Verify before ordering.</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ── Assembly ── */}
          {activeTab === "assembly" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {ASSEMBLY_STEPS.map((s) => (
                <div key={s.step} style={{ background: card, border: `1px solid ${border}`, borderRadius: "8px", padding: "18px 20px", display: "flex", gap: "16px" }}>
                  <div style={{ flexShrink: 0, width: "36px", height: "36px", background: "#0d0d0d", border: `1px solid ${gold}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: gold, fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem" }}>
                    {s.step}
                  </div>
                  <div>
                    <div style={{ color: parchment, fontWeight: 600, marginBottom: "6px" }}>{s.title}</div>
                    <div style={{ color: muted, fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "8px" }}>{s.detail}</div>
                    <div style={{ background: "#0d0d0d", border: `1px solid ${gold}33`, borderLeft: `3px solid ${gold}`, borderRadius: "0 4px 4px 0", padding: "8px 12px", fontSize: "0.8rem", color: gold }}>
                      💡 {s.tip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CNC / CAD ── */}
          {activeTab === "cnc" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Export options */}
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "8px", padding: "20px" }}>
                <div style={{ color: gold, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>EXPORT FOR CNC</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <button onClick={() => downloadDXF(cfg)} style={{ padding: "14px", background: gold, border: "none", color: "#0d0d0d", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}>
                    ↓ Download DXF
                    <div style={{ fontSize: "0.72rem", fontWeight: 400, marginTop: "2px" }}>AutoCAD / Fusion 360 / VCarve</div>
                  </button>
                  <button onClick={() => downloadCSV(cfg)} style={{ padding: "14px", background: "transparent", border: `1px solid ${gold}`, color: gold, borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                    ↓ Download CSV
                    <div style={{ fontSize: "0.72rem", fontWeight: 400, marginTop: "2px" }}>Import into any CAM software</div>
                  </button>
                </div>
                <div style={{ color: muted, fontSize: "0.8rem", lineHeight: 1.6 }}>
                  The DXF file contains all panel outlines as 2D rectangles, labeled with part names and dimensions, ready to import into VCarve Pro, Fusion 360, or any CAM software. Arrange on your sheet stock and add tabs before sending to your router.
                </div>
              </div>

              {/* CNC resources */}
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "8px", padding: "20px" }}>
                <div style={{ color: gold, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>FIND PRE-MADE CAD FILES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { name: "Printables — Van Life CNC Files", url: "https://www.printables.com/search/models?q=van+life+cabinet+cnc", desc: "Free CNC-ready cabinet and storage files for van builds" },
                    { name: "Cults3D — Van Interior Files", url: "https://cults3d.com/en/search?q=van+interior+cnc", desc: "Paid and free van interior CNC files" },
                    { name: "GrabCAD — Van Cabinet Models", url: "https://grabcad.com/library?query=van+cabinet", desc: "Professional CAD models, many free to download" },
                    { name: "Thingiverse — Van Life", url: "https://www.thingiverse.com/search?q=van+life+cabinet&type=things", desc: "Community-made van storage and cabinet files" },
                    { name: "VCarve Pro (Vectric)", url: "https://www.vectric.com/products/vcarve-pro", desc: "Industry standard CAM software for CNC routing" },
                    { name: "Fusion 360 (Free for hobbyists)", url: "https://www.autodesk.com/products/fusion-360/personal", desc: "Full parametric CAD + CAM, free personal license" },
                    { name: "OpenDesk — Open Source Furniture", url: "https://www.opendesk.cc", desc: "CNC-ready flat-pack furniture, fully open source" },
                    { name: "CutList Plus (Sheet optimization)", url: "https://www.cutlistplus.com", desc: "Optimize panel cuts to minimize waste" },
                  ].map((r) => (
                    <a
                      key={r.name}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#0d0d0d", border: `1px solid ${border}`, borderRadius: "6px", textDecoration: "none", transition: "border-color 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = gold)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
                    >
                      <div>
                        <div style={{ color: parchment, fontWeight: 500, fontSize: "0.85rem" }}>{r.name}</div>
                        <div style={{ color: muted, fontSize: "0.75rem", marginTop: "2px" }}>{r.desc}</div>
                      </div>
                      <span style={{ color: gold, fontSize: "0.85rem", flexShrink: 0, marginLeft: "12px" }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* CNC tips */}
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "8px", padding: "20px" }}>
                <div style={{ color: gold, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>CNC ROUTING TIPS FOR VAN CABINETS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    ["Bit size", "Use a 1/4\" upcut spiral bit for plywood. Downcut for cleaner top surfaces on visible faces."],
                    ["Feed rate", "~80 IPM at 18,000 RPM for 3/4\" Baltic birch. Reduce to 60 IPM for the first pass."],
                    ["Depth of cut", "No more than 1/2 the bit diameter per pass. For 1/4\" bit: max 0.125\" per pass."],
                    ["Tabs", "Add 0.25\" tabs every 8–12\" on long cuts to prevent parts from shifting during routing."],
                    ["Nesting", "Use CutList Plus or VCarve's nesting feature to arrange all parts on 4×8 sheets — saves 15–20% material."],
                    ["Dogbone fillets", "Add dogbone fillets at all inside corners so parts fit together without manual chiseling."],
                    ["Finishing", "Sand CNC-cut edges with 120 then 180 grit. Apply iron-on edge banding to all visible edges."],
                  ].map(([title, detail]) => (
                    <div key={title} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${border}22` }}>
                      <div style={{ color: gold, fontFamily: "monospace", fontSize: "0.8rem", minWidth: "110px", flexShrink: 0 }}>{title}</div>
                      <div style={{ color: muted, fontSize: "0.82rem", lineHeight: 1.5 }}>{detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
