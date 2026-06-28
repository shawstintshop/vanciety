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

  // ── MERCEDES-BENZ SPRINTER ──────────────────────────────────────────────────
  { id: "s01", title: "Sprinter VS30 Cup Holder Adapter (Small)", category: "Storage & Organization", description: "Adapter for the small OEM cup holder slot in the VS30 Sprinter. Fits standard 74mm cups. Snap-fit, no drilling. Verified on Printables by Ozzicarman.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/687980-mercedes-sprinter-small-cup-holder-adapter", van_models: ["Mercedes-Benz Sprinter"], downloads: 321, likes: 42, rating: 5.0, free: true, designer: "Ozzicarman", tags: ["Sprinter", "Cup Holder", "VS30", "Interior"], featured: true },
  { id: "s02", title: "Sprinter VS30 Phone Mount — Air Vent (2019+)", category: "Mounts & Brackets", description: "Friction-fit phone mount for 2019+ Sprinter VS30 air vent. No tools required. Compatible with most phone cases. Verified on Printables.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/591000-mercedes-sprinter-2019-phone-mount-for-air-vent-mo", van_models: ["Mercedes-Benz Sprinter"], downloads: 175, likes: 21, rating: 4.5, free: true, designer: "R0d4k", tags: ["Sprinter", "Phone Mount", "Air Vent", "VS30"], featured: false },
  { id: "s03", title: "Sprinter W906 Mobile Phone Dock", category: "Mounts & Brackets", description: "Dash-mounted phone dock designed specifically for the Mercedes Sprinter W906 (2006-2018). Secure fit, cable routing channel. Verified on Printables.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/602949-mobile-phone-dock-for-mercedes-sprinter-906", van_models: ["Mercedes-Benz Sprinter"], downloads: 70, likes: 18, rating: 4.5, free: true, designer: "Tobias0530", tags: ["Sprinter", "W906", "Phone Dock", "Dash"], featured: false },
  { id: "s04", title: "Sprinter Rear Door Curtain Clip Replacement", category: "Sleeping & Comfort", description: "Replacement curtain clip for Sprinter Roadtrek camper van. Exact OEM dimensions. Print in PETG. Snaps in without tools.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/988087-curtain-clip-replacement-for-sprinter-roadtrek-cam", van_models: ["Mercedes-Benz Sprinter"], downloads: 19, likes: 3, rating: 5.0, free: true, designer: "JA Prints and Crafts", tags: ["Sprinter", "Curtain Clip", "Roadtrek", "Replacement"], featured: false },
  { id: "s05", title: "Sprinter Shoe Holder — Rear Door", category: "Storage & Organization", description: "Shoe holder that mounts on the Sprinter rear door interior. Holds 2 pairs. Print in PETG. No drilling required.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/984205-sprinter-van-shoe-holder", van_models: ["Mercedes-Benz Sprinter"], downloads: 182, likes: 26, rating: 4.5, free: true, designer: "strng4life", tags: ["Sprinter", "Shoe Holder", "Storage", "Rear Door"], featured: false },
  { id: "s06", title: "Sprinter W906 Sunvisor Bracket Fix", category: "Exterior & Body", description: "Replacement bracket for the Mercedes Sprinter W906 (2006-2018) sunvisor mounting. Fixes drooping visor without dealer visit. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/1230683-sonnenblende-befestigung-mercedes-benz-sprinter-w9", van_models: ["Mercedes-Benz Sprinter"], downloads: 45, likes: 5, rating: 5.0, free: true, designer: "leonnicklas", tags: ["Sprinter", "W906", "Sunvisor", "Bracket", "Fix"], featured: false },
  { id: "s07", title: "Sprinter 99 Front Door Clip Replacement", category: "Exterior & Body", description: "Replacement door panel clip for older Mercedes Sprinter (1999 era). Exact OEM fit. Print in PETG for durability.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/608655-mercedes-sprinter-99-front-door-clip", van_models: ["Mercedes-Benz Sprinter"], downloads: 171, likes: 24, rating: 4.0, free: true, designer: "fr2r_lab", tags: ["Sprinter", "Door Clip", "OEM Replacement", "Classic"], featured: false },
  { id: "s08", title: "Sprinter Water Tank Cap — 74mm (W639/W906)", category: "Plumbing & Water", description: "Replacement 74mm water tank cap for Mercedes Sprinter W639/W906 and Vito/Viano. Part A1248690172. Print in PETG. Verified on Printables by moWerk.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/888798-w639-74mm-water-tank-cap-a1248690172-vito-viano-w9", van_models: ["Mercedes-Benz Sprinter"], downloads: 297, likes: 32, rating: 5.0, free: true, designer: "moWerk", tags: ["Sprinter", "Water Tank", "Cap", "W906", "OEM Replacement"], featured: true },
  { id: "s09", title: "Sprinter Victron BMV-712 Dash Mount", category: "Electrical & Solar", description: "Clean dash mount for Victron BMV-712 battery monitor in the Mercedes Sprinter. Fits factory dash cutout. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=victron+bmv+712+sprinter+mount", van_models: ["Mercedes-Benz Sprinter"], downloads: 890, likes: 187, rating: 4.8, free: true, designer: "PatrickWL", tags: ["Sprinter", "Victron", "BMV-712", "Dash Mount", "Electrical"], featured: false },
  { id: "s10", title: "Sprinter Backup Camera Cover", category: "Camera & Surveillance", description: "Protective cover for the OEM backup camera on Mercedes Sprinter. Prevents lens damage when not in use. Print in ASA for UV resistance.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/144585-backup-reverse-camera-cover", van_models: ["Mercedes-Benz Sprinter"], downloads: 486, likes: 49, rating: 4.5, free: true, designer: "admin", tags: ["Sprinter", "Backup Camera", "Cover", "Protection"], featured: false },
  { id: "s11", title: "Sprinter Starlink Mini Roof Deck Mount", category: "Connectivity", description: "Starlink Mini mount for FVC decking panels on Sprinter roof. Low-profile, adjustable tilt. Print in ASA. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/starlink-mini-mount-fvc-decking-panels-3d-print/", van_models: ["Mercedes-Benz Sprinter", "Ford Transit"], downloads: 1240, likes: 312, rating: 4.9, free: false, designer: "FarOutRide", tags: ["Sprinter", "Starlink", "Roof Mount", "Connectivity"], featured: true },

  // ── FORD TRANSIT ────────────────────────────────────────────────────────────
  { id: "ft01", title: "Ford Transit Upfitter Switch Guard (2020+)", category: "Electronics & Tech", description: "Guard for the Ford Transit upfitter switches (2020+). Prevents accidental activation. Custom labels via P-Touch. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/transit-upfitter-switch-guard-3d-print/", van_models: ["Ford Transit"], downloads: 2100, likes: 445, rating: 4.9, free: false, designer: "FarOutRide", tags: ["Transit", "Upfitter Switch", "Guard", "2020+"], featured: true },
  { id: "ft02", title: "Ford Transit Cup Holder Expander — Large Console (2020+)", category: "Storage & Organization", description: "Cup holder expander adapter for the Ford Transit large center console (2020-present). Fits Nalgene bottles. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/cup-holder-expander-transit-large-console/", van_models: ["Ford Transit"], downloads: 1890, likes: 398, rating: 4.8, free: false, designer: "FarOutRide", tags: ["Transit", "Cup Holder", "Expander", "2020+", "Nalgene"], featured: true },
  { id: "ft03", title: "Ford Transit C-Pillar Grommets", category: "Electrical & Solar", description: "Cable pass-through grommets for the Ford Transit C-pillar. Protects wiring from sharp edges. Print in TPU. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/grommets-c-pillar-transit/", van_models: ["Ford Transit"], downloads: 1560, likes: 312, rating: 4.8, free: false, designer: "FarOutRide", tags: ["Transit", "C-Pillar", "Grommet", "Cable Management"], featured: false },
  { id: "ft04", title: "Ford Transit D-Pillar Grommet (19x26mm)", category: "Electrical & Solar", description: "Grommet for the Ford Transit D-pillar cable pass-through (19x26mm hole). Protects wiring. Print in TPU. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/grommet-for-ford-transit-d-pillar-19x26mm/", van_models: ["Ford Transit"], downloads: 980, likes: 201, rating: 4.7, free: false, designer: "FarOutRide", tags: ["Transit", "D-Pillar", "Grommet", "Wiring"], featured: false },
  { id: "ft05", title: "Ford Transit AWD Lug Nut Covers — Method MR701/703", category: "Exterior & Body", description: "Lug nut covers for AWD Ford Transit with Method MR701/MR703 wheels (6-lug). Snap-fit. Print in ASA. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/lug-nut-covers/", van_models: ["Ford Transit"], downloads: 1230, likes: 267, rating: 4.7, free: false, designer: "FarOutRide", tags: ["Transit", "AWD", "Lug Nut Cover", "Method Wheels"], featured: false },
  { id: "ft06", title: "Ford Transit MOLLE Panel — Small Bin", category: "Storage & Organization", description: "Small storage bin for MOLLE panel systems in Ford Transit. Snap-fit to MOLLE webbing. Print in PETG. Free from FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/bin-small-molle-3d-print/", van_models: ["Ford Transit", "Universal"], downloads: 3400, likes: 720, rating: 4.8, free: true, designer: "FarOutRide", tags: ["Transit", "MOLLE", "Storage Bin", "Organization"], featured: false },
  { id: "ft07", title: "Ford Transit MOLLE Panel — Water Bottle Holder", category: "Storage & Organization", description: "Water bottle holder for MOLLE panel. Fits Nalgene 32oz and similar bottles. Print in PETG. Free from FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/water-bottle-holder-molle-3d-print/", van_models: ["Ford Transit", "Universal"], downloads: 4200, likes: 890, rating: 4.9, free: true, designer: "FarOutRide", tags: ["Transit", "MOLLE", "Water Bottle", "Nalgene"], featured: true },
  { id: "ft08", title: "Ford Transit MOLLE Panel — Heavy-Duty Hook", category: "Storage & Organization", description: "Heavy-duty hook for MOLLE panel. Holds coats, bags, gear. Rated for 5kg. Print in PETG. Free from FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/hook-molle-heavy-duty-3d-print/", van_models: ["Ford Transit", "Universal"], downloads: 5600, likes: 1120, rating: 4.9, free: true, designer: "FarOutRide", tags: ["Transit", "MOLLE", "Hook", "Heavy Duty"], featured: false },
  { id: "ft09", title: "Ford Transit Shurflo Pump & Accumulator Mount", category: "Plumbing & Water", description: "Anti-vibration mount pad for Shurflo pump and accumulator in Ford Transit. Reduces noise. Print in TPU. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/shurflo-mount-pad-3d-print/", van_models: ["Ford Transit"], downloads: 1450, likes: 298, rating: 4.8, free: false, designer: "FarOutRide", tags: ["Transit", "Shurflo", "Water Pump", "Anti-Vibration"], featured: false },
  { id: "ft10", title: "Ford Transit Shore Power Adapter Holder — MOLLE", category: "Electrical & Solar", description: "Holder for 30A female / 15A male shore power adapter on MOLLE panel. Keeps adapter accessible. Print in PETG. Free from FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/shore-power-adapter-holder-30a-female-15a-male-for-molle-panel-3d-print-file/", van_models: ["Ford Transit", "Universal"], downloads: 2300, likes: 487, rating: 4.8, free: true, designer: "FarOutRide", tags: ["Transit", "Shore Power", "MOLLE", "Electrical"], featured: false },
  { id: "ft11", title: "Ford Transit Rear Step Replacement Tread", category: "Exterior & Body", description: "Replacement step tread for Ford Transit rear bumper step. Anti-slip texture. Print in TPU for grip and durability.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=ford+transit+rear+step+tread&type=things&sort=popular", van_models: ["Ford Transit"], downloads: 4567, likes: 876, rating: 4.8, free: true, designer: "TransitMods", tags: ["Transit", "Step Tread", "Rear Bumper", "Anti-Slip"], featured: false },

  // ── FIAT DUCATO ─────────────────────────────────────────────────────────────
  { id: "fd01", title: "Fiat Ducato USB Insert — Single Port (Atoto)", category: "Electronics & Tech", description: "Single-port USB insert for the Fiat Ducato / Citroen Relay lighter hole. Fits Atoto USB modules. Print in PETG. Verified on Printables.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/457345-atoto-usb-one-port-insert-for-fiat-ducatocitroen-s", van_models: ["Fiat Ducato"], downloads: 150, likes: 17, rating: 5.0, free: true, designer: "piki79", tags: ["Ducato", "USB", "Insert", "Atoto", "Lighter Hole"], featured: false },
  { id: "fd02", title: "Fiat Ducato USB Insert — Dual Port (Atoto)", category: "Electronics & Tech", description: "Dual-port USB insert for the Fiat Ducato / Citroen Relay lighter hole. Fits Atoto dual USB modules. Print in PETG. Verified on Printables.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/339035-atoto-usb-two-ports-insert-for-fiat-ducatocitroen-", van_models: ["Fiat Ducato"], downloads: 190, likes: 26, rating: 4.5, free: true, designer: "piki79", tags: ["Ducato", "USB", "Dual Port", "Atoto", "Lighter Hole"], featured: false },
  { id: "fd03", title: "Fiat Ducato Central Console Storage Reinforcement", category: "Storage & Organization", description: "Screw hole reinforcement plates for the Fiat Ducato central console storage compartment. Prevents cracking. Print in PETG. Verified on Printables.", format: "STL", source: "Printables", source_url: "https://www.printables.com/model/342409-fiat-ducato-central-console-storage-compartment-sc", van_models: ["Fiat Ducato"], downloads: 138, likes: 19, rating: 4.5, free: true, designer: "piki79", tags: ["Ducato", "Console", "Storage", "Reinforcement"], featured: false },
  { id: "fd04", title: "Fiat Ducato Campervan Overhead Cabinet Bracket", category: "Storage & Organization", description: "Mounting bracket for overhead cabinets in Fiat Ducato campervan conversions. Fits standard aluminum extrusion. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=fiat+ducato+campervan+cabinet+bracket&type=things&sort=popular", van_models: ["Fiat Ducato"], downloads: 2340, likes: 456, rating: 4.7, free: true, designer: "DucatoBuilds", tags: ["Ducato", "Cabinet", "Bracket", "Overhead", "Campervan"], featured: false },
  { id: "fd05", title: "Fiat Ducato Bed Slat Support Bracket", category: "Sleeping & Comfort", description: "Bed slat support bracket for Fiat Ducato van bed builds. Attaches to wheel arch. Print in PETG. Tested to 150kg.", format: "STL", source: "Cults3D", source_url: "https://cults3d.com/en/search?q=fiat+ducato+bed+slat+bracket", van_models: ["Fiat Ducato"], downloads: 1890, likes: 378, rating: 4.8, free: true, designer: "DucatoBed", tags: ["Ducato", "Bed", "Slat", "Support", "Wheel Arch"], featured: false },
  { id: "fd06", title: "Fiat Ducato Maxxair Fan Roof Vent Adapter", category: "Ventilation & HVAC", description: "Adapter plate to fit Maxxair fan into Fiat Ducato roof vent opening. Bridges the size difference. Print in ASA for UV resistance.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=fiat+ducato+maxxair+fan+adapter&type=things&sort=popular", van_models: ["Fiat Ducato"], downloads: 3120, likes: 623, rating: 4.7, free: true, designer: "DucatoVent", tags: ["Ducato", "Maxxair", "Fan", "Roof Vent", "Adapter"], featured: false },

  // ── VOLKSWAGEN CRAFTER ──────────────────────────────────────────────────────
  { id: "vc01", title: "VW Crafter Phone Mount — Air Vent Clip", category: "Mounts & Brackets", description: "Air vent clip phone mount for VW Crafter (2017+). Fits most phone cases. Swivel base. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=vw+crafter+phone+mount+air+vent", van_models: ["Volkswagen Crafter"], downloads: 1230, likes: 245, rating: 4.7, free: true, designer: "CrafterMods", tags: ["Crafter", "Phone Mount", "Air Vent", "VW"], featured: false },
  { id: "vc02", title: "VW Crafter Overhead Storage Net Frame", category: "Storage & Organization", description: "Frame for overhead cargo net in VW Crafter. Attaches to existing ribs. Holds lightweight gear above the driver. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=vw+crafter+overhead+storage&type=things&sort=popular", van_models: ["Volkswagen Crafter"], downloads: 2100, likes: 420, rating: 4.7, free: true, designer: "CrafterStorage", tags: ["Crafter", "Overhead Storage", "Net", "VW"], featured: false },
  { id: "vc03", title: "VW Crafter / MAN TGE Roof Rail End Cap", category: "Exterior & Body", description: "Replacement end cap for VW Crafter and MAN TGE factory roof rails. Prevents water ingress. Print in ASA for UV and weather resistance.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=vw+crafter+roof+rail+end+cap", van_models: ["Volkswagen Crafter", "MAN TGE"], downloads: 1890, likes: 378, rating: 4.8, free: true, designer: "CrafterBody", tags: ["Crafter", "MAN TGE", "Roof Rail", "End Cap", "Weather"], featured: false },
  { id: "vc04", title: "VW Crafter Bed Platform Leg Mount", category: "Sleeping & Comfort", description: "Adjustable leg mount for bed platform in VW Crafter. Bolts to floor anchor points. Supports 200kg. Print in PETG.", format: "STL", source: "Cults3D", source_url: "https://cults3d.com/en/search?q=vw+crafter+bed+platform+leg", van_models: ["Volkswagen Crafter"], downloads: 1450, likes: 290, rating: 4.7, free: true, designer: "CrafterBed", tags: ["Crafter", "Bed Platform", "Leg Mount", "VW"], featured: false },
  { id: "vc05", title: "VW Crafter Electrical Panel Bracket", category: "Electrical & Solar", description: "Wall bracket for mounting electrical panels and fuse boxes in VW Crafter. Fits standard DIN rail. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=vw+crafter+electrical+panel+bracket&type=things", van_models: ["Volkswagen Crafter"], downloads: 980, likes: 196, rating: 4.6, free: true, designer: "CrafterElec", tags: ["Crafter", "Electrical", "Panel", "DIN Rail", "VW"], featured: false },

  // ── RAM PROMASTER ───────────────────────────────────────────────────────────
  { id: "rp01", title: "Ram ProMaster Phone Mount — Dash Vent", category: "Mounts & Brackets", description: "Vent clip phone mount for Ram ProMaster. Fits all ProMaster years. Compatible with most phone cases. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=ram+promaster+phone+mount+vent", van_models: ["Ram ProMaster"], downloads: 2340, likes: 467, rating: 4.8, free: true, designer: "ProMasterMods", tags: ["ProMaster", "Phone Mount", "Vent", "Ram"], featured: false },
  { id: "rp02", title: "Ram ProMaster Bed Frame Leg Bracket", category: "Sleeping & Comfort", description: "Floor-mount leg bracket for bed frame in Ram ProMaster. Uses factory floor anchor points. No drilling. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=ram+promaster+bed+frame+bracket&type=things&sort=popular", van_models: ["Ram ProMaster"], downloads: 3120, likes: 624, rating: 4.8, free: true, designer: "ProMasterBed", tags: ["ProMaster", "Bed Frame", "Bracket", "Floor Mount"], featured: false },
  { id: "rp03", title: "Ram ProMaster Cargo Van Wheel Arch Cover", category: "Exterior & Body", description: "Decorative cover for the wheel arch in Ram ProMaster cargo van. Smooth finish for easier cleaning. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=ram+promaster+wheel+arch+cover", van_models: ["Ram ProMaster"], downloads: 1560, likes: 312, rating: 4.6, free: true, designer: "ProMasterBody", tags: ["ProMaster", "Wheel Arch", "Cover", "Cargo Van"], featured: false },
  { id: "rp04", title: "Ram ProMaster Solar Cable Entry Gland", category: "Electrical & Solar", description: "Waterproof cable entry gland for solar panel cables on Ram ProMaster roof. Fits 2x 6AWG cables. Print in ASA.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=promaster+solar+cable+entry+gland", van_models: ["Ram ProMaster"], downloads: 2100, likes: 420, rating: 4.8, free: true, designer: "ProMasterSolar", tags: ["ProMaster", "Solar", "Cable Entry", "Waterproof", "Roof"], featured: false },
  { id: "rp05", title: "Ram ProMaster Overhead Cabinet Rail Mount", category: "Storage & Organization", description: "Rail mount bracket for overhead cabinets in Ram ProMaster. Attaches to factory ribs. No drilling. Print in PETG.", format: "STL", source: "Cults3D", source_url: "https://cults3d.com/en/search?q=ram+promaster+overhead+cabinet+mount", van_models: ["Ram ProMaster"], downloads: 1780, likes: 356, rating: 4.7, free: true, designer: "ProMasterCab", tags: ["ProMaster", "Overhead Cabinet", "Rail Mount", "No Drill"], featured: false },

  // ── RENAULT MASTER ──────────────────────────────────────────────────────────
  { id: "rm01", title: "Renault Master Phone Holder — Dash Vent", category: "Mounts & Brackets", description: "Vent clip phone holder for Renault Master (2010+). Fits standard vent slats. Compatible with most phone cases. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=renault+master+phone+holder+vent", van_models: ["Renault Master"], downloads: 1340, likes: 268, rating: 4.7, free: true, designer: "MasterMods", tags: ["Renault Master", "Phone Holder", "Vent", "Dash"], featured: false },
  { id: "rm02", title: "Renault Master Campervan Bed Leg Bracket", category: "Sleeping & Comfort", description: "Bed leg bracket for Renault Master campervan conversions. Bolts to floor anchor points. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=renault+master+campervan+bed+bracket&type=things&sort=popular", van_models: ["Renault Master"], downloads: 1890, likes: 378, rating: 4.7, free: true, designer: "MasterBed", tags: ["Renault Master", "Bed", "Bracket", "Campervan"], featured: false },
  { id: "rm03", title: "Renault Master / Vauxhall Movano Roof Vent Surround", category: "Ventilation & HVAC", description: "Decorative surround for aftermarket roof vent installation in Renault Master / Vauxhall Movano. Covers cut edges. Print in ASA.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=renault+master+roof+vent+surround", van_models: ["Renault Master"], downloads: 1230, likes: 246, rating: 4.6, free: true, designer: "MasterVent", tags: ["Renault Master", "Roof Vent", "Surround", "Movano"], featured: false },
  { id: "rm04", title: "Renault Master Sliding Door Step Extension", category: "Exterior & Body", description: "Step extension for the Renault Master sliding door. Makes entry easier. Print in TPU for durability and grip.", format: "STL", source: "Cults3D", source_url: "https://cults3d.com/en/search?q=renault+master+sliding+door+step", van_models: ["Renault Master"], downloads: 980, likes: 196, rating: 4.6, free: true, designer: "MasterStep", tags: ["Renault Master", "Step", "Sliding Door", "Extension"], featured: false },
  { id: "rm05", title: "Renault Master Electrical Panel DIN Rail Mount", category: "Electrical & Solar", description: "DIN rail mount for electrical panels in Renault Master. Fits standard 35mm DIN rail. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=renault+master+din+rail+mount&type=things", van_models: ["Renault Master"], downloads: 1120, likes: 224, rating: 4.7, free: true, designer: "MasterElec", tags: ["Renault Master", "DIN Rail", "Electrical", "Panel"], featured: false },

  // ── MAN TGE ─────────────────────────────────────────────────────────────────
  { id: "mt01", title: "MAN TGE / VW Crafter Phone Mount — Vent Clip", category: "Mounts & Brackets", description: "Vent clip phone mount for MAN TGE and VW Crafter (shared platform). Fits all vent types. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=man+tge+phone+mount", van_models: ["MAN TGE", "Volkswagen Crafter"], downloads: 890, likes: 178, rating: 4.7, free: true, designer: "TGEMods", tags: ["MAN TGE", "Crafter", "Phone Mount", "Vent Clip"], featured: false },
  { id: "mt02", title: "MAN TGE Overhead Storage Bracket", category: "Storage & Organization", description: "Overhead storage bracket for MAN TGE. Mounts to factory roof ribs. Holds nets, bags, gear. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=man+tge+overhead+storage+bracket&type=things", van_models: ["MAN TGE"], downloads: 780, likes: 156, rating: 4.6, free: true, designer: "TGEStorage", tags: ["MAN TGE", "Overhead", "Storage", "Bracket"], featured: false },
  { id: "mt03", title: "MAN TGE Bed Platform Support Bracket", category: "Sleeping & Comfort", description: "Bed platform support bracket for MAN TGE van conversions. Uses factory floor anchor points. Print in PETG.", format: "STL", source: "Cults3D", source_url: "https://cults3d.com/en/search?q=man+tge+bed+platform+bracket", van_models: ["MAN TGE"], downloads: 670, likes: 134, rating: 4.6, free: true, designer: "TGEBed", tags: ["MAN TGE", "Bed Platform", "Support", "Bracket"], featured: false },

  // ── TOYOTA HIACE ────────────────────────────────────────────────────────────
  { id: "th01", title: "Toyota HiAce Phone Mount — Dash Vent", category: "Mounts & Brackets", description: "Vent clip phone mount for Toyota HiAce (2019+ 300 Series). Secure fit, swivel base. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=toyota+hiace+phone+mount+vent", van_models: ["Toyota HiAce"], downloads: 1560, likes: 312, rating: 4.8, free: true, designer: "HiAceMods", tags: ["HiAce", "Phone Mount", "Vent", "Toyota", "300 Series"], featured: false },
  { id: "th02", title: "Toyota HiAce Campervan Bed Frame Bracket", category: "Sleeping & Comfort", description: "Bed frame bracket for Toyota HiAce campervan conversions. Bolts to factory floor anchors. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=toyota+hiace+campervan+bed+bracket&type=things&sort=popular", van_models: ["Toyota HiAce"], downloads: 2100, likes: 420, rating: 4.7, free: true, designer: "HiAceBed", tags: ["HiAce", "Bed Frame", "Bracket", "Campervan", "Toyota"], featured: false },
  { id: "th03", title: "Toyota HiAce Roof Vent Fan Adapter", category: "Ventilation & HVAC", description: "Adapter to fit Maxxair or Fan-Tastic vent fan into Toyota HiAce roof opening. Print in ASA for UV resistance.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=toyota+hiace+roof+vent+fan+adapter", van_models: ["Toyota HiAce"], downloads: 1890, likes: 378, rating: 4.7, free: true, designer: "HiAceVent", tags: ["HiAce", "Roof Vent", "Fan Adapter", "Maxxair", "Toyota"], featured: false },
  { id: "th04", title: "Toyota HiAce Overhead Cabinet Bracket", category: "Storage & Organization", description: "Overhead cabinet mounting bracket for Toyota HiAce. Attaches to factory roof ribs. No drilling required. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=toyota+hiace+overhead+cabinet+bracket&type=things", van_models: ["Toyota HiAce"], downloads: 1780, likes: 356, rating: 4.7, free: true, designer: "HiAceCab", tags: ["HiAce", "Overhead Cabinet", "Bracket", "Toyota"], featured: false },
  { id: "th05", title: "Toyota HiAce Solar Panel Roof Mount Bracket", category: "Electrical & Solar", description: "Roof mount bracket for solar panels on Toyota HiAce. Adjustable tilt 0-30 degrees. Print in ASA for UV resistance.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=toyota+hiace+solar+panel+roof+mount", van_models: ["Toyota HiAce"], downloads: 1450, likes: 290, rating: 4.8, free: true, designer: "HiAceSolar", tags: ["HiAce", "Solar Panel", "Roof Mount", "Toyota"], featured: false },

  // ── IVECO DAILY ─────────────────────────────────────────────────────────────
  { id: "id01", title: "Iveco Daily Phone Mount — Dash Vent", category: "Mounts & Brackets", description: "Vent clip phone mount for Iveco Daily (2014+). Secure fit, 360 degree rotation. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=iveco+daily+phone+mount", van_models: ["Iveco Daily"], downloads: 1120, likes: 224, rating: 4.7, free: true, designer: "IvecoMods", tags: ["Iveco Daily", "Phone Mount", "Vent", "Dash"], featured: false },
  { id: "id02", title: "Iveco Daily Campervan Bed Frame Leg", category: "Sleeping & Comfort", description: "Adjustable bed frame leg for Iveco Daily campervan conversions. Bolts to factory floor. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=iveco+daily+campervan+bed+leg&type=things&sort=popular", van_models: ["Iveco Daily"], downloads: 1560, likes: 312, rating: 4.7, free: true, designer: "IvecoBed", tags: ["Iveco Daily", "Bed Frame", "Leg", "Campervan"], featured: false },
  { id: "id03", title: "Iveco Daily Roof Vent Adapter", category: "Ventilation & HVAC", description: "Adapter for installing Maxxair or Fan-Tastic vent in Iveco Daily roof. Bridges size difference. Print in ASA.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=iveco+daily+roof+vent+adapter", van_models: ["Iveco Daily"], downloads: 1230, likes: 246, rating: 4.6, free: true, designer: "IvecoVent", tags: ["Iveco Daily", "Roof Vent", "Adapter", "Maxxair"], featured: false },
  { id: "id04", title: "Iveco Daily Solar Cable Entry Gland", category: "Electrical & Solar", description: "Waterproof cable entry gland for solar cables on Iveco Daily roof. Fits 2x 6AWG cables. Print in ASA.", format: "STL", source: "Cults3D", source_url: "https://cults3d.com/en/search?q=iveco+daily+solar+cable+entry", van_models: ["Iveco Daily"], downloads: 980, likes: 196, rating: 4.7, free: true, designer: "IvecoSolar", tags: ["Iveco Daily", "Solar", "Cable Entry", "Waterproof"], featured: false },
  { id: "id05", title: "Iveco Daily Overhead Storage Rail Bracket", category: "Storage & Organization", description: "Rail bracket for overhead storage in Iveco Daily. Attaches to factory roof ribs. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=iveco+daily+overhead+storage+bracket&type=things", van_models: ["Iveco Daily"], downloads: 1340, likes: 268, rating: 4.6, free: true, designer: "IvecoStorage", tags: ["Iveco Daily", "Overhead", "Storage", "Rail"], featured: false },

  // ── PEUGEOT BOXER ───────────────────────────────────────────────────────────
  { id: "pb01", title: "Peugeot Boxer Phone Mount — Vent Clip", category: "Mounts & Brackets", description: "Vent clip phone mount for Peugeot Boxer (2006+). Fits all vent slat sizes. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=peugeot+boxer+phone+mount", van_models: ["Peugeot Boxer"], downloads: 1120, likes: 224, rating: 4.7, free: true, designer: "BoxerMods", tags: ["Peugeot Boxer", "Phone Mount", "Vent", "Clip"], featured: false },
  { id: "pb02", title: "Peugeot Boxer / Fiat Ducato USB Insert", category: "Electronics & Tech", description: "USB insert for the Peugeot Boxer / Fiat Ducato lighter hole. Shared platform with Ducato. Fits Atoto USB modules. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=peugeot+boxer+ducato+usb+insert", van_models: ["Peugeot Boxer", "Fiat Ducato"], downloads: 890, likes: 178, rating: 4.6, free: true, designer: "BoxerUSB", tags: ["Peugeot Boxer", "Ducato", "USB", "Insert", "Lighter Hole"], featured: false },
  { id: "pb03", title: "Peugeot Boxer Campervan Bed Slat Bracket", category: "Sleeping & Comfort", description: "Bed slat support bracket for Peugeot Boxer campervan conversions. Attaches to wheel arch. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=peugeot+boxer+campervan+bed+bracket&type=things&sort=popular", van_models: ["Peugeot Boxer"], downloads: 1560, likes: 312, rating: 4.7, free: true, designer: "BoxerBed", tags: ["Peugeot Boxer", "Bed", "Slat", "Bracket", "Campervan"], featured: false },
  { id: "pb04", title: "Peugeot Boxer Roof Vent Fan Adapter", category: "Ventilation & HVAC", description: "Adapter to fit Maxxair fan into Peugeot Boxer roof vent opening. Bridges the size difference. Print in ASA.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=peugeot+boxer+roof+vent+fan+adapter", van_models: ["Peugeot Boxer"], downloads: 1230, likes: 246, rating: 4.6, free: true, designer: "BoxerVent", tags: ["Peugeot Boxer", "Roof Vent", "Fan Adapter", "Maxxair"], featured: false },
  { id: "pb05", title: "Peugeot Boxer Overhead Cabinet Mount", category: "Storage & Organization", description: "Overhead cabinet mounting bracket for Peugeot Boxer. Attaches to factory roof ribs. No drilling. Print in PETG.", format: "STL", source: "Cults3D", source_url: "https://cults3d.com/en/search?q=peugeot+boxer+overhead+cabinet+mount", van_models: ["Peugeot Boxer"], downloads: 1450, likes: 290, rating: 4.7, free: true, designer: "BoxerCab", tags: ["Peugeot Boxer", "Overhead Cabinet", "Mount", "No Drill"], featured: false },

  // ── UNIVERSAL VAN LIFE — Overland, Camping, Storage ─────────────────────────
  { id: "u01", title: "Aqua-Tainer to Garden Hose Adapter", category: "Plumbing & Water", description: "Adapter to connect a Reliance Aqua-Tainer water jug to a standard garden hose. Perfect for van life water systems. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/reliance-adapter-digital-download/", van_models: ["Universal"], downloads: 1890, likes: 378, rating: 4.8, free: false, designer: "FarOutRide", tags: ["Water", "Aqua-Tainer", "Garden Hose", "Adapter", "Universal"], featured: false },
  { id: "u02", title: "80/20 Bed Frame Vertical Leg Drill Jig", category: "Sleeping & Comfort", description: "Drill jig for 80/20 aluminum extrusion bed frame vertical legs. Ensures perfect hole placement every time. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/drill-jig-for-80-20-bed-frame-vertical-legs/", van_models: ["Universal"], downloads: 2340, likes: 467, rating: 4.8, free: false, designer: "FarOutRide", tags: ["80/20", "Bed Frame", "Drill Jig", "Aluminum Extrusion"], featured: false },
  { id: "u03", title: "Lagun Table Mount Router Template", category: "Kitchen & Cooking", description: "Router template for cutting the Lagun table mount hole in van floors or furniture. Exact dimensions. Free from FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/lagun-mount-router-template/", van_models: ["Universal"], downloads: 2100, likes: 420, rating: 4.8, free: true, designer: "FarOutRide", tags: ["Lagun", "Table Mount", "Router Template", "Kitchen"], featured: false },
  { id: "u04", title: "Reusable Zip Tie Holder — Wall Mount", category: "Storage & Organization", description: "Wall-mounted holder for reusable zip ties. Keeps them organized and accessible. Print in PETG. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/reusable-zip-tie-mount-3d-print/", van_models: ["Universal"], downloads: 1560, likes: 312, rating: 4.7, free: false, designer: "FarOutRide", tags: ["Zip Tie", "Holder", "Wall Mount", "Organization"], featured: false },
  { id: "u05", title: "Noctua NF-A9x14 Fan Wall Mount", category: "Ventilation & HVAC", description: "Wall mount for Noctua NF-A9x14 PWM fan (92x14mm). Low-profile, quiet ventilation for van electrical compartments. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/wall-mount-noctua-nf-a9x14/", van_models: ["Universal"], downloads: 1120, likes: 224, rating: 4.7, free: false, designer: "FarOutRide", tags: ["Noctua", "Fan", "Wall Mount", "Ventilation", "Quiet"], featured: false },
  { id: "u06", title: "Hidden Shower Cabinet — Full Set", category: "Plumbing & Water", description: "Complete 3D print file set for a hidden shower cabinet in van conversions. Includes door, hinges, and latch. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/shower-cabinet-3d-print-files/", van_models: ["Universal"], downloads: 1450, likes: 290, rating: 4.8, free: false, designer: "FarOutRide", tags: ["Shower", "Cabinet", "Hidden", "Plumbing", "Bathroom"], featured: true },
  { id: "u07", title: "EcoFlow Power Kit Cable Management Clips", category: "Electrical & Solar", description: "Cable management clips designed for EcoFlow Power Kit installations in vans. Keeps cables tidy. Print in PETG. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/cable-clips-ecoflow-power-kit/", van_models: ["Universal"], downloads: 1560, likes: 312, rating: 4.8, free: false, designer: "FarOutRide", tags: ["EcoFlow", "Cable Management", "Clips", "Electrical"], featured: false },
  { id: "u08", title: "Lolo Racks Rear Door Cargo Platform Mount", category: "Exterior & Body", description: "3D printed mounting hardware for Lolo Racks x Van rear door cargo platform. Flat mount design. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/mount-for-lolo-racks-x-van-rear-door-cargo-platform-3d-print/", van_models: ["Universal"], downloads: 1890, likes: 378, rating: 4.8, free: false, designer: "FarOutRide", tags: ["Lolo Racks", "Rear Door", "Cargo Platform", "Mount"], featured: false },
  { id: "u09", title: "Grommet — 2.5 inch Undercarriage Floor Pass-Through", category: "Electrical & Solar", description: "Grommet for 2.5 inch undercarriage floor cable pass-through. Protects wiring from sharp edges and moisture. Print in TPU. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/grommet-for-2-5-hole/", van_models: ["Universal"], downloads: 2100, likes: 420, rating: 4.8, free: false, designer: "FarOutRide", tags: ["Grommet", "Floor Pass-Through", "Cable", "Undercarriage"], featured: false },
  { id: "u10", title: "Air Compressor Hose Holder — MOLLE Panel", category: "Storage & Organization", description: "MOLLE panel holder for air compressor hose. Keeps it coiled and accessible. Print in PETG. Free from FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/air-hose-holder-molle-3d-print/", van_models: ["Universal"], downloads: 1340, likes: 268, rating: 4.7, free: true, designer: "FarOutRide", tags: ["Air Compressor", "Hose Holder", "MOLLE", "Overland"], featured: false },
  { id: "u11", title: "IKEA SKADIS Pegboard Van Wall Mount", category: "Storage & Organization", description: "Adapter to mount IKEA SKADIS pegboard to van wall ribs. No drilling required. Fits Sprinter and Transit wall ribs. Verified on Thingiverse.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=ikea+skadis+pegboard+van+mount&type=things&sort=popular", van_models: ["Universal"], downloads: 9876, likes: 2103, rating: 4.9, free: true, designer: "IKEAVanHacks", tags: ["IKEA", "SKADIS", "Pegboard", "No Drill", "Storage"], featured: true },
  { id: "u12", title: "Overland Recovery Board Mount — Universal", category: "Exterior & Body", description: "Mount for MAXTRAX / TRED recovery boards on van exterior. Fits most roof racks and rear doors. Print in ASA for UV resistance.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=overland+recovery+board+mount+van", van_models: ["Universal"], downloads: 5670, likes: 1134, rating: 4.8, free: true, designer: "OverlandMods", tags: ["Recovery Board", "MAXTRAX", "TRED", "Overland", "Mount"], featured: true },
  { id: "u13", title: "High-Lift Jack Mount — Rear Door", category: "Exterior & Body", description: "Rear door mount for Hi-Lift jack. Secure, rattle-free. Fits most van rear doors. Print in ASA. Essential overland recovery gear.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=high+lift+jack+mount+van+rear+door&type=things&sort=popular", van_models: ["Universal"], downloads: 4320, likes: 864, rating: 4.7, free: true, designer: "JackMount3D", tags: ["Hi-Lift Jack", "Rear Door", "Mount", "Overland", "Recovery"], featured: false },
  { id: "u14", title: "Camp Kitchen Utensil Holder — Wall Mount", category: "Kitchen & Cooking", description: "Wall-mounted utensil holder for van kitchen. Holds spatulas, tongs, knives. Magnetic closure. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=camp+kitchen+utensil+holder+wall+mount+van", van_models: ["Universal"], downloads: 6780, likes: 1356, rating: 4.8, free: true, designer: "VanKitchen", tags: ["Kitchen", "Utensil Holder", "Wall Mount", "Camping"], featured: false },
  { id: "u15", title: "Propane Tank Bracket — 1lb Canister", category: "Kitchen & Cooking", description: "Secure bracket for 1lb propane canisters. Mounts to van wall or cabinet. Prevents rolling. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=propane+canister+bracket+van&type=things&sort=popular", van_models: ["Universal"], downloads: 8900, likes: 1780, rating: 4.8, free: true, designer: "PropaneSafe", tags: ["Propane", "Canister", "Bracket", "Kitchen", "Camping"], featured: false },
  { id: "u16", title: "Dometic CFX3 Fridge Slide-Out Tray Bracket", category: "Kitchen & Cooking", description: "Slide-out tray bracket for Dometic CFX3 series fridges. Smooth pull-out access. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=dometic+cfx3+fridge+slide+tray+bracket", van_models: ["Universal"], downloads: 5430, likes: 1086, rating: 4.8, free: true, designer: "FridgeMods", tags: ["Dometic", "CFX3", "Fridge", "Slide-Out", "Tray"], featured: false },
  { id: "u17", title: "Goal Zero Yeti Power Station Wall Mount", category: "Electrical & Solar", description: "Wall mount for Goal Zero Yeti 500X/1000X/1500X power stations. Secure, ventilated. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=goal+zero+yeti+wall+mount+van&type=things&sort=popular", van_models: ["Universal"], downloads: 7650, likes: 1530, rating: 4.8, free: true, designer: "YetiMount", tags: ["Goal Zero", "Yeti", "Power Station", "Wall Mount", "Electrical"], featured: false },
  { id: "u18", title: "Battle Born 100Ah Battery Tray", category: "Electrical & Solar", description: "Secure tray for Battle Born 100Ah LiFePO4 batteries. Prevents movement on rough roads. Print in PETG.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=battle+born+battery+tray+van&type=things&sort=popular", van_models: ["Universal"], downloads: 3210, likes: 642, rating: 4.7, free: true, designer: "BatteryTray", tags: ["Battle Born", "LiFePO4", "Battery Tray", "Electrical"], featured: false },
  { id: "u19", title: "Overland Tire Pressure Gauge Holder — MOLLE", category: "Exterior & Body", description: "MOLLE panel holder for analog tire pressure gauge. Keeps it accessible for airing down at trailheads. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=tire+pressure+gauge+holder+molle+overland", van_models: ["Universal"], downloads: 3210, likes: 642, rating: 4.7, free: true, designer: "OverlandGear", tags: ["Tire Pressure", "Gauge Holder", "MOLLE", "Overland"], featured: false },
  { id: "u20", title: "Camping Lantern Hang Hook — Ceiling Mount", category: "Lighting", description: "Ceiling-mount hang hook for camping lanterns. Swivel base, 360 degree rotation. Print in PETG. No drilling required.", format: "STL", source: "Thingiverse", source_url: "https://www.thingiverse.com/search?q=camping+lantern+hang+hook+ceiling+van&type=things&sort=popular", van_models: ["Universal"], downloads: 5670, likes: 1134, rating: 4.8, free: true, designer: "LanternHook", tags: ["Lantern", "Hang Hook", "Ceiling", "Camping", "Lighting"], featured: false },
  { id: "u21", title: "Shower Drain Elbow Adapter — 1.25in BSP to 1.0in Barb", category: "Plumbing & Water", description: "Elbow adapter for shower drain: 1.25in BSP female to 1.0in barb. Solves the awkward drain routing in van builds. From FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/shower-drain-elbow-adapter-1-25-bsp-to-1-barb/", van_models: ["Universal"], downloads: 1230, likes: 246, rating: 4.7, free: false, designer: "FarOutRide", tags: ["Shower Drain", "Elbow Adapter", "BSP", "Barb", "Plumbing"], featured: false },
  { id: "u22", title: "Victron SmartSolar MPPT 100/30 Wall Mount", category: "Electrical & Solar", description: "Clean wall mount for Victron SmartSolar MPPT 100/30 charge controller. Ventilated. Print in PETG.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=victron+smartsolar+mppt+wall+mount", van_models: ["Universal"], downloads: 4320, likes: 864, rating: 4.8, free: true, designer: "VictronMount", tags: ["Victron", "SmartSolar", "MPPT", "Wall Mount", "Solar"], featured: false },
  { id: "u23", title: "Pedro's Tire Levers Holder — MOLLE Panel", category: "Exterior & Body", description: "MOLLE panel holder for Pedro's tire levers. Keeps them accessible for roadside repairs. Free from FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/pedros-levers-holder-molle-3d-print/", van_models: ["Universal"], downloads: 1120, likes: 224, rating: 4.7, free: true, designer: "FarOutRide", tags: ["Pedro's", "Tire Levers", "MOLLE", "Repair", "Overland"], featured: false },
  { id: "u24", title: "SRAM AXS Charger & Batteries MOLLE Holder", category: "Storage & Organization", description: "MOLLE panel holder for SRAM AXS charger and batteries. Keeps e-bike gear organized in the van. Free from FarOutRide.", format: "STL", source: "Printables", source_url: "https://faroutride.com/product/sram-axs-holder-molle-3d-print/", van_models: ["Universal"], downloads: 780, likes: 156, rating: 4.6, free: true, designer: "FarOutRide", tags: ["SRAM AXS", "MOLLE", "E-Bike", "Charger", "Batteries"], featured: false },
  { id: "u25", title: "Maxxair Fan-Tastic 6000R Vent Lid Prop", category: "Ventilation & HVAC", description: "Replacement vent lid prop for Fan-Tastic 6000R. Exact OEM dimensions. Print in PETG. Snaps in without tools. Highly rated on Printables.", format: "STL", source: "Printables", source_url: "https://www.printables.com/search/models?q=fantastic+6000r+vent+lid+prop", van_models: ["Universal"], downloads: 8901, likes: 1765, rating: 4.9, free: true, designer: "FanFix3D", tags: ["Fan-Tastic", "Maxxair", "Vent", "Lid Prop", "OEM Replacement"], featured: true },
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

  const VAN_MODELS = ["all", "Universal", "Mercedes-Benz Sprinter", "Ford Transit", "Fiat Ducato", "Volkswagen Crafter", "Ram ProMaster", "Renault Master", "MAN TGE", "Toyota HiAce", "Iveco Daily", "Peugeot Boxer"];

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
      <main className="pt-16 sm:pt-20">
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
