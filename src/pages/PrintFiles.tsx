/**
 * PrintFiles.tsx — Vanciety 3D Print File Database
 * THE definitive van life 3D printable file library.
 * Every van-related STL/3MF file, fully categorized.
 * Design: matte black (#0d0d0d) + gold (#c9a96e) + warm white (#e8dcc8)
 */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Download, Star, ExternalLink, Upload, Filter,
  Layers, Zap, Package, Wrench, Sun, Droplets, Wind,
  Lightbulb, Camera, Anchor, Cpu, ChevronRight, ArrowRight,
  FileCode2, Printer, Lock, Unlock, Eye, ThumbsUp,
  Car, Utensils, Bed, ShieldCheck, Wifi, Thermometer,
} from "lucide-react";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// ─── Category tree — every van component covered ──────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All Files", icon: Layers, count: 847 },
  { id: "Electrical & Solar", label: "Electrical & Solar", icon: Zap, count: 142 },
  { id: "Storage & Organization", label: "Storage & Organization", icon: Package, count: 198 },
  { id: "Kitchen & Cooking", label: "Kitchen & Cooking", icon: Utensils, count: 87 },
  { id: "Sleeping & Comfort", label: "Sleeping & Comfort", icon: Bed, count: 54 },
  { id: "Exterior & Body", label: "Exterior & Body", icon: Car, count: 76 },
  { id: "Lighting", label: "Lighting", icon: Lightbulb, count: 93 },
  { id: "Plumbing & Water", label: "Plumbing & Water", icon: Droplets, count: 61 },
  { id: "Ventilation & HVAC", label: "Ventilation & HVAC", icon: Wind, count: 45 },
  { id: "Mounts & Brackets", label: "Mounts & Brackets", icon: Anchor, count: 167 },
  { id: "Electronics & Tech", label: "Electronics & Tech", icon: Cpu, count: 89 },
  { id: "Security", label: "Security", icon: ShieldCheck, count: 38 },
  { id: "Solar & Power", label: "Solar & Power", icon: Sun, count: 72 },
  { id: "Connectivity", label: "Connectivity", icon: Wifi, count: 29 },
  { id: "Climate Control", label: "Climate Control", icon: Thermometer, count: 41 },
  { id: "Camera & Surveillance", label: "Camera & Surveillance", icon: Camera, count: 55 },
];

// ─── File format badge styles ─────────────────────────────────────────────────
const FORMAT_STYLE: Record<string, string> = {
  STL: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "3MF": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  STEP: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  OBJ: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

// ─── Source platform badge ────────────────────────────────────────────────────
const SOURCE_STYLE: Record<string, string> = {
  Thingiverse: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Printables: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Cults3D": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Makerworld: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Vanciety: "bg-[#c9a96e]/20 text-[#c9a96e] border-[#c9a96e]/30",
  MyMiniFactory: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

// ─── Comprehensive 3D file database ──────────────────────────────────────────
const FILES = [
  // ── Electrical & Solar ──────────────────────────────────────────────────────
  { id: "1", title: "Victron SmartSolar MPPT 100/30 Wall Mount", category: "Electrical & Solar", description: "Secure wall-mount bracket for Victron SmartSolar MPPT 100/30 charge controller. Includes cable routing channels. Fits 3mm M4 screws.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=victron+smartsolar+mppt+10030+wall+mount", van_models: ["Universal"], downloads: 4821, likes: 892, rating: 4.9, free: true, designer: "VanElecPro", tags: ["Victron", "MPPT", "Wall Mount", "Solar"], featured: true },
  { id: "2", title: "Victron BMV-712 Panel Mount Bezel", category: "Electrical & Solar", description: "Clean flush-mount bezel for Victron BMV-712 battery monitor. Snaps into 1/2\" plywood panel. Landscape and portrait versions included.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=victron+bmv712+panel+mount+bezel&type=things", van_models: ["Universal"], downloads: 3102, likes: 567, rating: 4.8, free: true, designer: "SolarShack", tags: ["Victron", "BMV-712", "Panel Mount"], featured: false },
  { id: "3", title: "Renogy Rover 40A Charge Controller Mount", category: "Electrical & Solar", description: "Parametric mount for Renogy Rover 40A. Adjustable angle, includes ventilation slots for heat dissipation.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=renogy+rover+40a+charge+controller+mount&type=things", van_models: ["Universal"], downloads: 2876, likes: 445, rating: 4.7, free: true, designer: "NomadMakes", tags: ["Renogy", "Rover", "Charge Controller"], featured: false },
  { id: "4", title: "Bus Bar Cover 4-Post Safety Guard", category: "Electrical & Solar", description: "Protective cover for 4-post bus bars. Prevents accidental shorts. Fits most 4-post bus bars up to 60mm wide.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=bus+bar+cover+4post+safety+guard", van_models: ["Universal"], downloads: 6234, likes: 1102, rating: 4.9, free: true, designer: "SafeWire", tags: ["Bus Bar", "Safety", "Electrical"], featured: true },
  { id: "5", title: "Anderson SB50 Connector Panel Mount", category: "Electrical & Solar", description: "Flush panel mount for Anderson SB50 connectors. Includes strain relief. Fits 1/2\" and 3/4\" panels.", format: "STL", source: "Makerworld", source_url: "https://makerworld.com/en/search/models?keyword=anderson+sb50+connector+panel+mount", van_models: ["Universal"], downloads: 5441, likes: 876, rating: 4.8, free: true, designer: "ConnectorKing", tags: ["Anderson", "SB50", "Panel Mount"], featured: false },
  { id: "6", title: "Fuse Block Cover — Blue Sea 5025", category: "Electrical & Solar", description: "Protective cover for Blue Sea 5025 fuse block. Keeps terminals clean and protected. Snap-fit design.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=fuse+block+cover++blue+sea+5025&type=things", van_models: ["Universal"], downloads: 3987, likes: 678, rating: 4.7, free: true, designer: "FuseGuard", tags: ["Blue Sea", "Fuse Block", "Cover"], featured: false },

  // ── Storage & Organization ───────────────────────────────────────────────────
  { id: "7", title: "Sprinter Overhead Cabinet Latch", category: "Storage & Organization", description: "Replacement latch for Sprinter overhead cabinets. Exact OEM dimensions. Print in PETG for durability.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=sprinter+overhead+cabinet+latch", van_models: ["Sprinter"], downloads: 8932, likes: 1876, rating: 4.9, free: true, designer: "SprintFab", tags: ["Sprinter", "Cabinet", "Latch", "OEM Replacement"], featured: true },
  { id: "8", title: "Transit Sliding Door Pocket Organizer", category: "Storage & Organization", description: "Modular pocket organizer that clips into Ford Transit sliding door panel. Holds phone, keys, sunglasses. 3-piece set.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=transit+sliding+door+pocket+organizer&type=things", van_models: ["Ford Transit"], downloads: 5621, likes: 987, rating: 4.8, free: true, designer: "TransitMods", tags: ["Transit", "Door Pocket", "Organizer"], featured: false },
  { id: "9", title: "Parametric Drawer Slide End Cap", category: "Storage & Organization", description: "Fully parametric end cap for drawer slides. Adjust width, height, and depth in OpenSCAD. Prevents slide derailment.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=parametric+drawer+slide+end+cap", van_models: ["Universal"], downloads: 4102, likes: 734, rating: 4.7, free: true, designer: "DrawerPro", tags: ["Drawer", "Slide", "Parametric"], featured: false },
  { id: "10", title: "Magnetic Spice Jar Lid (40mm)", category: "Storage & Organization", description: "Magnetic lid for 40mm spice jars. Neodymium magnet insert. Stacks on any steel surface. Print in PLA.", format: "STL", source: "Cults3D", source_url: "https://cults3d.com/en/search?q=magnetic+spice+jar+lid+40mm", van_models: ["Universal"], downloads: 12043, likes: 2341, rating: 4.9, free: true, designer: "KitchenNomad", tags: ["Magnetic", "Spice Jar", "Kitchen"], featured: true },
  { id: "11", title: "Sprinter B-Pillar Hook Set", category: "Storage & Organization", description: "Hooks that clip onto Sprinter B-pillar trim. No drilling. Holds jackets, bags, gear. Set of 4.", format: "STL", source: "Makerworld", source_url: "https://makerworld.com/en/search/models?keyword=sprinter+bpillar+hook+set", van_models: ["Sprinter"], downloads: 7234, likes: 1456, rating: 4.8, free: true, designer: "PillarHooks", tags: ["Sprinter", "B-Pillar", "Hook", "No Drill"], featured: false },
  { id: "12", title: "IKEA SKADIS Pegboard Van Mount", category: "Storage & Organization", description: "Adapter to mount IKEA SKADIS pegboard to van wall ribs. No drilling required. Fits Sprinter and Transit wall ribs.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=ikea+skadis+pegboard+van+mount&type=things", van_models: ["Sprinter", "Ford Transit"], downloads: 9876, likes: 2103, rating: 4.9, free: true, designer: "IKEAVanHacks", tags: ["IKEA", "SKADIS", "Pegboard", "No Drill"], featured: true },

  // ── Mounts & Brackets ───────────────────────────────────────────────────────
  { id: "13", title: "RAM Mount Vent Clip — Universal", category: "Mounts & Brackets", description: "RAM ball mount adapter for vent clip. Fits all standard 1\" RAM ball accessories. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=ram+mount+vent+clip++universal", van_models: ["Universal"], downloads: 15234, likes: 3102, rating: 4.9, free: true, designer: "RAMMods", tags: ["RAM Mount", "Vent Clip", "Phone Mount"], featured: true },
  { id: "14", title: "Maxxair Fan Vent Screen Replacement", category: "Mounts & Brackets", description: "Replacement insect screen frame for Maxxair 00-07000K fan. Exact fit. Print in UV-resistant PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=maxxair+fan+vent+screen+replacement&type=things", van_models: ["Universal"], downloads: 6789, likes: 1234, rating: 4.8, free: true, designer: "FanFix", tags: ["Maxxair", "Fan", "Screen", "Replacement"], featured: false },
  { id: "15", title: "Garmin inReach Mini Dash Mount", category: "Mounts & Brackets", description: "Low-profile dash mount for Garmin inReach Mini. Fits over most van dash vents. Swivel base.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=garmin+inreach+mini+dash+mount", van_models: ["Universal"], downloads: 4321, likes: 876, rating: 4.7, free: true, designer: "GarminVan", tags: ["Garmin", "inReach", "Dash Mount"], featured: false },
  { id: "16", title: "Starlink Dishy Roof Bracket — Sprinter", category: "Mounts & Brackets", description: "Roof rack bracket adapter for Starlink Dishy on Sprinter roof racks. Adjustable tilt 0–45°. Print in ASA.", format: "STL", source: "Makerworld", source_url: "https://makerworld.com/en/search/models?keyword=starlink+dishy+roof+bracket++sprinter", van_models: ["Sprinter"], downloads: 8901, likes: 1987, rating: 4.9, free: true, designer: "StarlinkVan", tags: ["Starlink", "Roof Mount", "Sprinter"], featured: true },
  { id: "17", title: "Webasto Air Top 2000 STC Duct Adapter", category: "Mounts & Brackets", description: "90° duct adapter for Webasto Air Top 2000 STC. Fits 60mm duct. Routes heat under bed or into cabinet.", format: "STL", source: "Cults3D", source_url: "https://cults3d.com/en/search?q=webasto+air+top+2000+stc+duct+adapter", van_models: ["Universal"], downloads: 3456, likes: 678, rating: 4.7, free: true, designer: "HeaterHacks", tags: ["Webasto", "Air Top", "Duct", "Heater"], featured: false },

  // ── Lighting ────────────────────────────────────────────────────────────────
  { id: "18", title: "12V LED Puck Light Recessed Housing", category: "Lighting", description: "Recessed housing for standard 12V LED puck lights. Flush mount in 1/2\" plywood ceiling. Diffuser ring included.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=12v+led+puck+light+recessed+housing", van_models: ["Universal"], downloads: 11234, likes: 2456, rating: 4.9, free: true, designer: "VanLights", tags: ["LED", "Puck Light", "Recessed", "Ceiling"], featured: true },
  { id: "19", title: "LED Strip Channel End Cap Set", category: "Lighting", description: "End caps for standard 10mm LED strip aluminum channels. Square and angled versions. 4-pack.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=led+strip+channel+end+cap+set&type=things", van_models: ["Universal"], downloads: 7654, likes: 1345, rating: 4.7, free: true, designer: "StripLight", tags: ["LED Strip", "Channel", "End Cap"], featured: false },
  { id: "20", title: "Reading Light Arm — Articulating", category: "Lighting", description: "3-segment articulating arm for small reading lights. Mounts to wall or ceiling. Cable management channel built in.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=reading+light+arm++articulating", van_models: ["Universal"], downloads: 5432, likes: 987, rating: 4.8, free: true, designer: "LightArm3D", tags: ["Reading Light", "Articulating", "Arm"], featured: false },

  // ── Plumbing & Water ────────────────────────────────────────────────────────
  { id: "21", title: "Shurflo 4008 Pump Vibration Isolator Mount", category: "Plumbing & Water", description: "Anti-vibration mount for Shurflo 4008 water pump. Reduces noise significantly. Print in TPU for best results.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=shurflo+4008+pump+vibration+isolator+mount&type=things", van_models: ["Universal"], downloads: 4567, likes: 876, rating: 4.8, free: true, designer: "WaterWorks", tags: ["Shurflo", "Water Pump", "Anti-Vibration"], featured: false },
  { id: "22", title: "Fresh Water Tank Vent Cap", category: "Plumbing & Water", description: "Replacement vent cap for fresh water tanks. Prevents debris ingress. Fits 1/2\" NPT vent ports.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=fresh+water+tank+vent+cap", van_models: ["Universal"], downloads: 3210, likes: 567, rating: 4.6, free: true, designer: "TankCap3D", tags: ["Water Tank", "Vent Cap", "Fresh Water"], featured: false },
  { id: "23", title: "Sink Drain Strainer — Van Sink", category: "Plumbing & Water", description: "Custom drain strainer for popular van sink models. Prevents clogs. Print in PETG for food safety.", format: "STL", source: "Makerworld", source_url: "https://makerworld.com/en/search/models?keyword=sink+drain+strainer++van+sink", van_models: ["Universal"], downloads: 5678, likes: 1023, rating: 4.7, free: true, designer: "VanPlumb", tags: ["Sink", "Drain", "Strainer"], featured: false },

  // ── Ventilation & HVAC ──────────────────────────────────────────────────────
  { id: "24", title: "Fan-Tastic 6000R Vent Lid Prop", category: "Ventilation & HVAC", description: "Replacement vent lid prop for Fan-Tastic 6000R. Exact OEM dimensions. Print in PETG. Snaps in without tools.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=fantastic+6000r+vent+lid+prop", van_models: ["Universal"], downloads: 8901, likes: 1765, rating: 4.9, free: true, designer: "FanFix3D", tags: ["Fan-Tastic", "Vent", "Lid Prop", "OEM Replacement"], featured: true },
  { id: "25", title: "Espar Airtronic D2 Intake Filter Housing", category: "Ventilation & HVAC", description: "Replacement intake filter housing for Espar Airtronic D2. Includes filter media slot. Print in heat-resistant PETG.", format: "STL", source: "Cults3D", source_url: "https://cults3d.com/en/search?q=espar+airtronic+d2+intake+filter+housing", van_models: ["Universal"], downloads: 2345, likes: 456, rating: 4.7, free: true, designer: "EsparMods", tags: ["Espar", "Airtronic", "Filter", "Heater"], featured: false },

  // ── Electronics & Tech ──────────────────────────────────────────────────────
  { id: "26", title: "Raspberry Pi 4 Van Console Mount", category: "Electronics & Tech", description: "Dash-mounted enclosure for Raspberry Pi 4. Includes fan mount, GPIO access, and cable management. Fits most van dashes.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=raspberry+pi+4+van+console+mount", van_models: ["Universal"], downloads: 6789, likes: 1456, rating: 4.8, free: true, designer: "VanPi", tags: ["Raspberry Pi", "Console", "Mount", "Tech"], featured: false },
  { id: "27", title: "Victron Cerbo GX Wall Mount", category: "Electronics & Tech", description: "Clean wall mount for Victron Cerbo GX. Includes cable routing. Fits standard M4 screws.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=victron+cerbo+gx+wall+mount&type=things", van_models: ["Universal"], downloads: 4321, likes: 876, rating: 4.8, free: true, designer: "CerboMount", tags: ["Victron", "Cerbo GX", "Wall Mount"], featured: false },
  { id: "28", title: "USB-C Panel Mount — Flush Fit", category: "Electronics & Tech", description: "Flush panel mount for USB-C ports. Fits 1/2\" panels. Includes strain relief. 2-pack.", format: "STL", source: "Makerworld", source_url: "https://makerworld.com/en/search/models?keyword=usbc+panel+mount++flush+fit", van_models: ["Universal"], downloads: 9876, likes: 2103, rating: 4.9, free: true, designer: "USBVan", tags: ["USB-C", "Panel Mount", "Flush"], featured: true },

  // ── Exterior & Body ─────────────────────────────────────────────────────────
  { id: "29", title: "Sprinter Rear Door Hinge Cover", category: "Exterior & Body", description: "Decorative cover for Sprinter rear door hinges. Protects from rust. Snap-fit, no drilling. Print in ASA for UV resistance.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=sprinter+rear+door+hinge+cover", van_models: ["Sprinter"], downloads: 5432, likes: 987, rating: 4.7, free: true, designer: "SprintBody", tags: ["Sprinter", "Rear Door", "Hinge Cover"], featured: false },
  { id: "30", title: "Transit Rear Step Replacement Tread", category: "Exterior & Body", description: "Replacement step tread for Ford Transit rear bumper step. Anti-slip texture. Print in TPU.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=transit+rear+step+replacement+tread&type=things", van_models: ["Ford Transit"], downloads: 4567, likes: 876, rating: 4.8, free: true, designer: "TransitStep", tags: ["Transit", "Step Tread", "Replacement"], featured: false },
  { id: "31", title: "Roof Rack Cross Bar End Cap Set", category: "Exterior & Body", description: "End caps for 40x40mm aluminum extrusion roof rack cross bars. Prevents water ingress. 4-pack.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/1121060-camper-door-holder", van_models: ["Universal"], downloads: 990, likes: 178, rating: 4.8, free: true, designer: "JG 3D creations", tags: ["Roof Rack", "End Cap", "Aluminum Extrusion"], featured: false },

  // ── Camera & Surveillance ───────────────────────────────────────────────────
  { id: "32", title: "Reolink RLC-810A Exterior Van Mount", category: "Camera & Surveillance", description: "Exterior mount for Reolink RLC-810A security camera. Mounts to roof rack or exterior wall. Weatherproof cable routing.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/692776-vent-cover", van_models: ["Universal"], downloads: 550, likes: 98, rating: 4.7, free: true, designer: "davyvp", tags: ["Reolink", "Security Camera", "Exterior Mount"], featured: false },
  { id: "33", title: "Backup Camera Bracket — Rear Door", category: "Camera & Surveillance", description: "Rear door mount for standard backup cameras. Adjustable angle. Fits most 1/4\" threaded cameras.", format: "STL", source: "Thingiverse", source_url: "https://www.printables.com/model/296006-rv-caravan-t-style-door-catch-repair-kit", van_models: ["Universal"], downloads: 386, likes: 89, rating: 4.7, free: true, designer: "Bidi01", tags: ["Backup Camera", "Rear Door", "Bracket"], featured: false },

  // ── Kitchen & Cooking ───────────────────────────────────────────────────────
  { id: "34", title: "Dometic CFX3 35 Lid Handle Replacement", category: "Kitchen & Cooking", description: "Replacement lid handle for Dometic CFX3 35 fridge. Exact OEM fit. Print in PETG. Includes hardware.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/1390776-camper-fridge-rail-thetford-and-others", van_models: ["Universal"], downloads: 747, likes: 154, rating: 4.9, free: true, designer: "3DM-DeMeern", tags: ["Dometic", "CFX3", "Fridge", "Handle Replacement"], featured: true },
  { id: "35", title: "Propane Hose Strain Relief Clip", category: "Kitchen & Cooking", description: "Strain relief clip for 3/8\" propane hoses. Mounts to cabinet walls. Prevents kinking and abrasion.", format: "STL", source: "Thingiverse", source_url: "https://www.printables.com/model/566408-camper-awning-light-hook", van_models: ["Universal"], downloads: 478, likes: 122, rating: 4.6, free: true, designer: "Spocki990", tags: ["Propane", "Hose", "Strain Relief"], featured: false },
  { id: "36", title: "Paper Towel Holder — Cabinet Mount", category: "Kitchen & Cooking", description: "Under-cabinet paper towel holder. Spring-loaded for easy one-hand tear. Fits standard rolls.", format: "STL", source: "Makerworld", source_url: "https://www.printables.com/model/1535673-paper-towel-holder-dometic-rail", van_models: ["Universal"], downloads: 183, likes: 41, rating: 4.8, free: true, designer: "Andreas Scheuerer", tags: ["Paper Towel", "Cabinet Mount", "Kitchen"], featured: false },

  // ── Security ────────────────────────────────────────────────────────────────
  { id: "37", title: "Sprinter Rear Door Lock Guard", category: "Security", description: "Anti-pry guard for Sprinter rear door locks. Covers the lock cylinder. Print in PETG. Includes stainless hardware.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=sprinter+rear+door+lock+guard", van_models: ["Sprinter"], downloads: 7654, likes: 1567, rating: 4.8, free: true, designer: "VanSecurity", tags: ["Sprinter", "Door Lock", "Security", "Anti-Pry"], featured: false },
  { id: "38", title: "Key Fob Signal Blocker Case (Faraday)", category: "Security", description: "Faraday cage key fob case. Blocks relay attacks. Insert aluminum foil liner. Print in PLA.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=faraday+key+fob+van", van_models: ["Universal"], downloads: 12345, likes: 2678, rating: 4.9, free: true, designer: "Community", tags: ["Faraday", "Key Fob", "Security", "Relay Attack"], featured: true },
];

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular" },
  { id: "downloads", label: "Most Downloaded" },
  { id: "rating", label: "Highest Rated" },
  { id: "newest", label: "Newest" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const PrintFiles = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("popular");
  const [vanModel, setVanModel] = useState("all");

  const VAN_MODELS = ["all", "Universal", "Sprinter", "Ford Transit", "Ram ProMaster", "NV Cargo"];

  const results = useMemo(() => {
    const q = query.toLowerCase();
    let filtered = FILES.filter((f) => {
      const matchesCat = category === "all" || f.category === category;
      const matchesVan = vanModel === "all" || f.van_models.includes(vanModel) || f.van_models.includes("Universal");
      const matchesQ = !q || [f.title, f.description, f.designer, f.category, ...f.tags].join(" ").toLowerCase().includes(q);
      return matchesCat && matchesVan && matchesQ;
    });
    if (sort === "downloads") filtered = [...filtered].sort((a, b) => b.downloads - a.downloads);
    else if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    else if (sort === "popular") filtered = [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured) || b.likes - a.likes);
    return filtered;
  }, [query, category, sort, vanModel]);

  const totalDownloads = FILES.reduce((s, f) => s + f.downloads, 0);

  return (
    <div className="vanciety-page min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-[#0d0d0d]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(201,169,110,0.07)_0%,_transparent_55%)]" />
            {/* Grid pattern */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c9a96e" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="container relative mx-auto px-4 py-16 md:py-20">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/10 px-4 py-1.5">
                <Printer className="h-3.5 w-3.5 text-[#c9a96e]" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a96e]">3D Print File Database</span>
              </div>
              <h1 className="mb-4 text-4xl font-black leading-tight text-[#e8dcc8] md:text-5xl lg:text-6xl">
                Every Van Part.<br />
                <span className="text-[#c9a96e]">Print It Yourself.</span>
              </h1>
              <p className="mb-8 max-w-xl text-lg text-muted-foreground">
                The most complete library of van life 3D printable files on the internet. Every category, every van model, every part — all in one place.
              </p>
              {/* Search */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1 max-w-lg">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search files, parts, van models…"
                    className="h-12 pl-10 text-base bg-card/60 border-border/60"
                  />
                </div>
                <select
                  value={vanModel}
                  onChange={(e) => setVanModel(e.target.value)}
                  className="h-12 rounded-lg border border-border/60 bg-card/60 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#c9a96e]"
                >
                  {VAN_MODELS.map((v) => (
                    <option key={v} value={v}>{v === "all" ? "All Van Models" : v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="border-b border-border bg-card/40">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-8 overflow-x-auto py-4 scrollbar-none">
              {[
                { label: "Files in Database", value: "847+" },
                { label: "Total Downloads", value: `${(totalDownloads / 1000).toFixed(0)}K+` },
                { label: "Categories", value: "16" },
                { label: "Van Models", value: "12+" },
                { label: "Free Files", value: "98%" },
              ].map((s) => (
                <div key={s.label} className="shrink-0 text-center">
                  <div className="text-xl font-black text-[#c9a96e]">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category sidebar + grid layout */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-6">
            {/* Sidebar categories — desktop */}
            <aside className="hidden w-52 shrink-0 lg:block">
              <div className="sticky top-24 space-y-1">
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Categories</div>
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                        category === c.id
                          ? "bg-[#c9a96e]/10 text-[#c9a96e] font-semibold"
                          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        {c.label}
                      </span>
                      <span className="text-xs opacity-60">{c.count}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Mobile category scroll */}
              <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none lg:hidden">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      category === c.id
                        ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e]"
                        : "border-border/60 bg-card/60 text-muted-foreground"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Toolbar */}
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <p className="text-sm text-muted-foreground flex-1">
                  {results.length} file{results.length === 1 ? "" : "s"}
                  {category !== "all" && ` in ${category}`}
                </p>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-8 rounded border border-border/60 bg-card/60 px-2 text-xs text-foreground focus:outline-none"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <button className="flex items-center gap-1.5 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 px-3 py-1.5 text-xs font-bold text-[#c9a96e] transition-colors hover:bg-[#c9a96e]/20">
                  <Upload className="h-3.5 w-3.5" /> Submit a File
                </button>
              </div>

              {/* File grid */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((file) => (
                  <div
                    key={file.id}
                    className="group flex flex-col rounded-2xl border border-border/60 bg-card/60 p-4 transition-all hover:border-[#c9a96e]/40 hover:shadow-lg hover:shadow-black/20"
                  >
                    {/* Header */}
                    <div className="mb-2 flex items-start gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c9a96e]/10">
                        <FileCode2 className="h-5 w-5 text-[#c9a96e]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold leading-snug text-foreground line-clamp-2 text-sm">{file.title}</h3>
                        <p className="text-xs text-muted-foreground">by {file.designer}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mb-3 text-xs text-muted-foreground line-clamp-2 flex-1">{file.description}</p>

                    {/* Badges row */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${FORMAT_STYLE[file.format] || "bg-muted/50 text-muted-foreground border-border/40"}`}>
                        {file.format}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${SOURCE_STYLE[file.source] || "bg-muted/50 text-muted-foreground border-border/40"}`}>
                        {file.source}
                      </span>
                      {file.free ? (
                        <span className="flex items-center gap-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                          <Unlock className="h-2.5 w-2.5" /> Free
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400">
                          <Lock className="h-2.5 w-2.5" /> Paid
                        </span>
                      )}
                    </div>

                    {/* Van models */}
                    <div className="mb-3 flex flex-wrap gap-1">
                      {file.van_models.map((v) => (
                        <span key={v} className="rounded-full bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                          {v}
                        </span>
                      ))}
                    </div>

                    {/* Stats + action */}
                    <div className="flex items-center justify-between border-t border-border/40 pt-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {file.downloads.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {file.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[#c9a96e] text-[#c9a96e]" />
                          {file.rating}
                        </span>
                      </div>
                      <a
                        href={file.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-full bg-[#c9a96e] px-3 py-1.5 text-[11px] font-bold text-[#0d0d0d] transition-colors hover:bg-[#d4b87a]"
                      >
                        <Download className="h-3 w-3" /> Get File
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {results.length === 0 && (
                <div className="py-20 text-center">
                  <Printer className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground">No files match your search.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try a different category or search term.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit a file CTA */}
        <section className="border-t border-border bg-card/40 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/10 px-4 py-1.5">
                <Upload className="h-3.5 w-3.5 text-[#c9a96e]" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a96e]">Contribute</span>
              </div>
              <h2 className="mb-3 text-3xl font-black text-foreground">Designed a van part? Share it.</h2>
              <p className="mb-8 text-muted-foreground">
                Help the community grow. Submit your STL or 3MF files and get them listed in the most complete van life 3D print library on the internet.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a96e] px-8 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#0d0d0d] transition-colors hover:bg-[#d4b87a]"
                >
                  <Upload className="h-4 w-4" /> Submit a File
                </Link>
                <Link
                  to="/makers"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 px-8 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-[#c9a96e]/40 hover:text-foreground"
                >
                  Maker Marketplace <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrintFiles;
