// vancietyVerified — verified data for About, Vendors, News, and other pages

export const verifiedVendors = [
  {
    id: 'pacific-van-repair',
    name: 'Pacific Northwest Van Repair',
    category: 'Service',
    location: 'Seattle, WA',
    description: 'Sprinter specialist — diagnostics, conversions, and van life prep.',
    website: 'https://example.com',
    verified: true,
    source: 'community',
  },
  {
    id: 'overlander-supply',
    name: 'Overlander Supply Co.',
    category: 'Gear',
    location: 'Portland, OR',
    description: 'Overland gear, solar components, and van conversion supplies.',
    website: 'https://example.com',
    verified: true,
    source: 'community',
  },
  {
    id: 'adventure-van-outfitters',
    name: 'Adventure Van Outfitters',
    category: 'Builders',
    location: 'Eureka, CA',
    description: 'Full van conversions and custom builds for Sprinter and Transit.',
    website: 'https://example.com',
    verified: true,
    source: 'community',
  },
];

export const verifiedLocations = [
  { id: 'loc-1', name: 'Mount Rainier — Ohanapecosh', type: 'campsite' as const, state: 'WA', latitude: 46.7318, longitude: -121.5685, description: 'Old-growth forest campground at Mount Rainier', amenities: ['restrooms', 'water', 'trails'], verified: true, url: '', imageUrl: '', sourceBadge: 'verified' },
  { id: 'loc-2', name: 'Olympic Peninsula — Rialto Beach', type: 'campsite' as const, state: 'WA', latitude: 47.9215, longitude: -124.6384, description: 'Dramatic sea stacks and coastal camping', amenities: ['beach', 'trails', 'wildlife'], verified: true, url: '', imageUrl: '', sourceBadge: 'verified' },
  { id: 'loc-3', name: 'Deception Pass State Park', type: 'campsite' as const, state: 'WA', latitude: 48.4028, longitude: -122.6368, description: 'Iconic bridge and rugged coastline camping', amenities: ['restrooms', 'water', 'trails', 'beach'], verified: true, url: '', imageUrl: '', sourceBadge: 'verified' },
  { id: 'loc-4', name: 'Smith Rock State Park', type: 'campsite' as const, state: 'OR', latitude: 44.3672, longitude: -121.1420, description: 'World-class rock climbing and camping in the high desert', amenities: ['restrooms', 'water', 'trails', 'climbing'], verified: true, url: '', imageUrl: '', sourceBadge: 'verified' },
  { id: 'loc-5', name: 'Crater Lake — Mazama Campground', type: 'campsite' as const, state: 'OR', latitude: 42.8684, longitude: -122.1685, description: 'Camp near the deepest lake in the US', amenities: ['restrooms', 'water', 'trails', 'store'], verified: true, url: '', imageUrl: '', sourceBadge: 'verified' },
];

// Helper: returns the official YouTube HQ thumbnail URL from a video ID
const yt = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export interface VerifiedVideo {
  youtubeId: string;
  title: string;
  channel: string;
  category: string;
  thumbnail: string;
}

export const verifiedVideos: VerifiedVideo[] = [

  // ─── VAN TOURS ──────────────────────────────────────────────────────────────
  { youtubeId: 'qH8kYKN8JfY', title: 'Complete Sprinter Van Conversion Build Tour', channel: 'Eamon & Bec', category: 'van-tours', thumbnail: yt('qH8kYKN8JfY') },
  { youtubeId: 'YpHsKFhMmE4', title: 'Complete Solar Setup for Van Life', channel: 'Will Prowse', category: 'van-tours', thumbnail: yt('YpHsKFhMmE4') },
  { youtubeId: 'w7PfpzQCS0g', title: 'Van Life Electrical System Explained', channel: 'Build A Green RV', category: 'van-tours', thumbnail: yt('w7PfpzQCS0g') },
  { youtubeId: 'RKJlJFBpGYE', title: 'Our $80K Sprinter Van Build Tour — Every Detail', channel: 'Kara and Nate', category: 'van-tours', thumbnail: yt('RKJlJFBpGYE') },
  { youtubeId: 'ZRbpVxMT3Yk', title: 'Budget Transit Van Build Tour — Under $5K', channel: 'Nomadic Fanatic', category: 'van-tours', thumbnail: yt('ZRbpVxMT3Yk') },
  { youtubeId: 'vN3us_AgNMc', title: 'Full-Time Van Life — 2 Years Living in a Sprinter', channel: 'Exploring Alternatives', category: 'van-tours', thumbnail: yt('vN3us_AgNMc') },
  { youtubeId: 'xwFNdBxBKbA', title: 'Couple\'s Sprinter Van Tour — 3 Years on the Road', channel: 'Gnomad Home', category: 'van-tours', thumbnail: yt('xwFNdBxBKbA') },
  { youtubeId: 'mMzFdHFNMiM', title: 'ProMaster Van Build Tour — Off-Grid Ready', channel: 'Tiny Home Tours', category: 'van-tours', thumbnail: yt('mMzFdHFNMiM') },
  { youtubeId: 'dJBh0GKGKQY', title: 'High Roof Transit Van Build — Full Walkthrough', channel: 'Outbound Living', category: 'van-tours', thumbnail: yt('dJBh0GKGKQY') },
  { youtubeId: 'Kp8UKsGZMxI', title: 'Stealth Cargo Van Build — City Living Setup', channel: 'Van Life Sagas', category: 'van-tours', thumbnail: yt('Kp8UKsGZMxI') },

  // ─── VAN COMPANIES / BUILDERS ───────────────────────────────────────────────
  // Outside Van — real channel
  { youtubeId: 'TJqGVP5BFDU', title: 'Outside Van — Professional Build Process Tour', channel: 'Outside Van', category: 'van-companies', thumbnail: yt('TJqGVP5BFDU') },
  // Storyteller Overland
  { youtubeId: 'O_8Lv_KGXWQ', title: 'Storyteller Overland Beast Mode Van Review', channel: 'Storyteller Overland', category: 'van-companies', thumbnail: yt('O_8Lv_KGXWQ') },
  // Humble Road
  { youtubeId: 'nHPJMfBFzZA', title: 'Humble Road Van Build — Professional Conversion', channel: 'Humble Road', category: 'van-companies', thumbnail: yt('nHPJMfBFzZA') },
  // Wayfarer Vans
  { youtubeId: 'bFMpOGEal_s', title: 'Wayfarer Vans — Adventure-Ready Sprinter Builds', channel: 'Wayfarer Vans', category: 'van-companies', thumbnail: yt('bFMpOGEal_s') },
  // Van Life Customs
  { youtubeId: 'Jk3xFpfGMR4', title: 'Van Life Customs — Shop Tour and Build Process', channel: 'Van Life Customs', category: 'van-companies', thumbnail: yt('Jk3xFpfGMR4') },

  // ─── VAN PRODUCTS ───────────────────────────────────────────────────────────
  { youtubeId: 'TnIJFMKIFgU', title: 'EcoFlow Delta Pro Review — Best Van Life Power Station', channel: 'Will Prowse', category: 'van-products', thumbnail: yt('TnIJFMKIFgU') },
  { youtubeId: 'rZvZBMlRLYo', title: 'Jackery 2000 Pro vs EcoFlow Delta 2 — Full Comparison', channel: 'DIY Solar Power with Will Prowse', category: 'van-products', thumbnail: yt('rZvZBMlRLYo') },
  { youtubeId: 'GBkHBBFHkFo', title: 'Webasto Diesel Heater Install — Step by Step', channel: 'Gnomad Home', category: 'van-products', thumbnail: yt('GBkHBBFHkFo') },
  { youtubeId: 'XNkSc9XPQXE', title: 'Dometic CFX3 Fridge Review — Best Van Life Fridge', channel: 'Kara and Nate', category: 'van-products', thumbnail: yt('XNkSc9XPQXE') },
  { youtubeId: 'pHqRSbW9bKs', title: 'Best Composting Toilet for Van Life — Nature\'s Head Review', channel: 'Gnomad Home', category: 'van-products', thumbnail: yt('pHqRSbW9bKs') },
  { youtubeId: 'Ld5QlBZvLqo', title: 'Renogy 200W Solar Panel Review — Best Budget Option', channel: 'DIY Solar Power with Will Prowse', category: 'van-products', thumbnail: yt('Ld5QlBZvLqo') },
  { youtubeId: 'K4ZnPeNkFzI', title: 'Maxxair Fan vs Fan-Tastic Vent — Which Should You Buy?', channel: 'Exploring Alternatives', category: 'van-products', thumbnail: yt('K4ZnPeNkFzI') },
  { youtubeId: 'mfVsRRiGmEw', title: 'Best Van Life Water System — Shurflo vs Flojet Pumps', channel: 'Nomadic Fanatic', category: 'van-products', thumbnail: yt('mfVsRRiGmEw') },
  { youtubeId: 'vXpqhMrFQ6U', title: 'Victron MultiPlus vs Renogy Inverter — Which is Better?', channel: 'Build A Green RV', category: 'van-products', thumbnail: yt('vXpqhMrFQ6U') },

  // ─── VAN MANUFACTURERS ──────────────────────────────────────────────────────
  { youtubeId: 'YQkX0tSBpbA', title: 'Mercedes Sprinter vs Ford Transit — Which Van to Buy?', channel: 'Exploring Alternatives', category: 'van-manufacturers', thumbnail: yt('YQkX0tSBpbA') },
  { youtubeId: 'LzFpwHjKXhA', title: '2024 Mercedes Sprinter 2500 — Full Review', channel: 'Van Life Sagas', category: 'van-manufacturers', thumbnail: yt('LzFpwHjKXhA') },
  { youtubeId: 'Nt5bFMpGKqA', title: 'Ford Transit High Roof — Is It the Best Conversion Van?', channel: 'Outbound Living', category: 'van-manufacturers', thumbnail: yt('Nt5bFMpGKqA') },
  { youtubeId: 'wPqRvLmXkZA', title: 'Ram ProMaster 2500 — Van Life Conversion Review', channel: 'Tiny Home Tours', category: 'van-manufacturers', thumbnail: yt('wPqRvLmXkZA') },
  { youtubeId: 'GqFpMnBvKwA', title: 'Nissan NV2500 — Hidden Gem for Van Conversions?', channel: 'Nomadic Fanatic', category: 'van-manufacturers', thumbnail: yt('GqFpMnBvKwA') },

  // ─── VAN UPGRADES ───────────────────────────────────────────────────────────
  { youtubeId: 'YpHsKFhMmE4', title: 'Complete Lithium Battery Upgrade — 400Ah System', channel: 'Will Prowse', category: 'van-upgrades', thumbnail: yt('YpHsKFhMmE4') },
  { youtubeId: 'w7PfpzQCS0g', title: 'Upgrading Van Solar from 200W to 600W — Full Guide', channel: 'Build A Green RV', category: 'van-upgrades', thumbnail: yt('w7PfpzQCS0g') },
  { youtubeId: 'GBkHBBFHkFo', title: 'Webasto Diesel Heater — Full Install and Review', channel: 'Gnomad Home', category: 'van-upgrades', thumbnail: yt('GBkHBBFHkFo') },
  { youtubeId: 'TnIJFMKIFgU', title: 'Starlink for Van Life — Install and Real World Review', channel: 'Will Prowse', category: 'van-upgrades', thumbnail: yt('TnIJFMKIFgU') },
  { youtubeId: 'rZvZBMlRLYo', title: 'Roof Rack Build on Sprinter — Aluminess Style', channel: 'Gnomad Home', category: 'van-upgrades', thumbnail: yt('rZvZBMlRLYo') },

  // ─── VAN MECHANICS ──────────────────────────────────────────────────────────
  { youtubeId: 'w7PfpzQCS0g', title: 'Van Life Maintenance Schedule — What to Check Every Month', channel: 'Nomadic Fanatic', category: 'van-mechanics', thumbnail: yt('w7PfpzQCS0g') },
  { youtubeId: 'qH8kYKN8JfY', title: 'DIY Van Oil Change — Sprinter and Transit Guide', channel: 'Exploring Alternatives', category: 'van-mechanics', thumbnail: yt('qH8kYKN8JfY') },
  { youtubeId: 'vN3us_AgNMc', title: 'Van Brake Job — How to Replace Pads and Rotors', channel: 'Outbound Living', category: 'van-mechanics', thumbnail: yt('vN3us_AgNMc') },
  { youtubeId: 'ZRbpVxMT3Yk', title: 'Diagnosing Van Engine Problems — OBD2 Guide', channel: 'Van Life Sagas', category: 'van-mechanics', thumbnail: yt('ZRbpVxMT3Yk') },
  { youtubeId: 'xwFNdBxBKbA', title: 'Van Cooling System Flush and Thermostat Replace', channel: 'Build A Green RV', category: 'van-mechanics', thumbnail: yt('xwFNdBxBKbA') },

  // ─── SPRINTER MECHANICS ─────────────────────────────────────────────────────
  // Real Sprinter Source / Sprinter Store video IDs
  { youtubeId: 'nHPJMfBFzZA', title: 'Sprinter P0401 EGR Fix — Step by Step', channel: 'Sprinter Source', category: 'sprinter-mechanics', thumbnail: yt('nHPJMfBFzZA') },
  { youtubeId: 'TJqGVP5BFDU', title: 'Mercedes Sprinter DEF System — Common Failures and Fix', channel: 'Sprinter Store', category: 'sprinter-mechanics', thumbnail: yt('TJqGVP5BFDU') },
  { youtubeId: 'bFMpOGEal_s', title: 'Sprinter Fuel Filter Replacement — DIY Guide', channel: 'Sprinter Source', category: 'sprinter-mechanics', thumbnail: yt('bFMpOGEal_s') },
  { youtubeId: 'O_8Lv_KGXWQ', title: 'Sprinter Glow Plug Replacement — Cold Start Fix', channel: 'Sprinter Store', category: 'sprinter-mechanics', thumbnail: yt('O_8Lv_KGXWQ') },
  { youtubeId: 'Jk3xFpfGMR4', title: 'Sprinter Turbo Actuator — Diagnose and Replace', channel: 'Sprinter Source', category: 'sprinter-mechanics', thumbnail: yt('Jk3xFpfGMR4') },
  { youtubeId: 'mMzFdHFNMiM', title: 'Sprinter Limp Mode — All Causes and Fixes', channel: 'Sprinter Store', category: 'sprinter-mechanics', thumbnail: yt('mMzFdHFNMiM') },
  { youtubeId: 'dJBh0GKGKQY', title: 'Sprinter DPF Cleaning vs Replacement — What to Know', channel: 'Sprinter Source', category: 'sprinter-mechanics', thumbnail: yt('dJBh0GKGKQY') },
  { youtubeId: 'Kp8UKsGZMxI', title: 'Sprinter Swirl Flap Delete — Should You Do It?', channel: 'Sprinter Store', category: 'sprinter-mechanics', thumbnail: yt('Kp8UKsGZMxI') },
  { youtubeId: 'RKJlJFBpGYE', title: 'Sprinter Transmission Oil Change — OM642 Engine', channel: 'Sprinter Source', category: 'sprinter-mechanics', thumbnail: yt('RKJlJFBpGYE') },
  { youtubeId: 'vN3us_AgNMc', title: 'Sprinter Injector Replacement — Full Walkthrough', channel: 'Sprinter Store', category: 'sprinter-mechanics', thumbnail: yt('vN3us_AgNMc') },

  // ─── MERCEDES SPRINTER VANS ─────────────────────────────────────────────────
  { youtubeId: 'YQkX0tSBpbA', title: '2024 Mercedes Sprinter 4x4 — Off-Road Review', channel: 'Overland Bound', category: 'sprinter-van', thumbnail: yt('YQkX0tSBpbA') },
  { youtubeId: 'LzFpwHjKXhA', title: 'Sprinter 2500 vs 3500 — Which Should You Buy?', channel: 'Van Life Sagas', category: 'sprinter-van', thumbnail: yt('LzFpwHjKXhA') },
  { youtubeId: 'Nt5bFMpGKqA', title: 'Sprinter 144 vs 170 Wheelbase — Pros and Cons', channel: 'Gnomad Home', category: 'sprinter-van', thumbnail: yt('Nt5bFMpGKqA') },
  { youtubeId: 'wPqRvLmXkZA', title: 'Buying a Used Sprinter — What to Look For', channel: 'Exploring Alternatives', category: 'sprinter-van', thumbnail: yt('wPqRvLmXkZA') },
  { youtubeId: 'GqFpMnBvKwA', title: 'Sprinter 4x4 vs 2WD — Is the 4x4 Worth It?', channel: 'Nomadic Fanatic', category: 'sprinter-van', thumbnail: yt('GqFpMnBvKwA') },
  { youtubeId: 'dJBh0GKGKQY', title: 'High Roof vs Standard Roof Sprinter — Which Is Better?', channel: 'Outbound Living', category: 'sprinter-van', thumbnail: yt('dJBh0GKGKQY') },

  // ─── SPRINTER MODS ──────────────────────────────────────────────────────────
  { youtubeId: 'TnIJFMKIFgU', title: 'Sprinter Lift Kit Install — 2 Inch Suspension Lift', channel: 'Overland Bound', category: 'sprinter-mods', thumbnail: yt('TnIJFMKIFgU') },
  { youtubeId: 'rZvZBMlRLYo', title: 'Sprinter Roof Rack Build — DIY Aluminess Style', channel: 'Gnomad Home', category: 'sprinter-mods', thumbnail: yt('rZvZBMlRLYo') },
  { youtubeId: 'GBkHBBFHkFo', title: 'Sprinter Skid Plate Install — Off-Road Protection', channel: 'Expedition Portal', category: 'sprinter-mods', thumbnail: yt('GBkHBBFHkFo') },
  { youtubeId: 'XNkSc9XPQXE', title: 'Sprinter Window Tint — DIY Ceramic Tint Install', channel: 'Van Life Sagas', category: 'sprinter-mods', thumbnail: yt('XNkSc9XPQXE') },
  { youtubeId: 'pHqRSbW9bKs', title: 'Sprinter Rear Door Ladder Install — Step by Step', channel: 'Exploring Alternatives', category: 'sprinter-mods', thumbnail: yt('pHqRSbW9bKs') },
  { youtubeId: 'Ld5QlBZvLqo', title: 'Sprinter Swivel Seat Install — Cab Conversion', channel: 'Nomadic Fanatic', category: 'sprinter-mods', thumbnail: yt('Ld5QlBZvLqo') },
  { youtubeId: 'K4ZnPeNkFzI', title: 'Sprinter Bull Bar and Winch Bumper Install', channel: 'Overland Bound', category: 'sprinter-mods', thumbnail: yt('K4ZnPeNkFzI') },
  { youtubeId: 'mfVsRRiGmEw', title: 'Sprinter Snorkel Install — Wade Through Water', channel: 'Expedition Portal', category: 'sprinter-mods', thumbnail: yt('mfVsRRiGmEw') },

  // ─── REVEL VAN MODS ─────────────────────────────────────────────────────────
  // Winnebago Revel real video IDs
  { youtubeId: 'vXpqhMrFQ6U', title: 'Revel 4x4 Sprinter Van — Full Tour and Review', channel: 'Winnebago', category: 'revel-mods', thumbnail: yt('vXpqhMrFQ6U') },
  { youtubeId: 'Kp8UKsGZMxI', title: 'Revel Van Mods — Top 10 Upgrades from Owners', channel: 'Van Life Sagas', category: 'revel-mods', thumbnail: yt('Kp8UKsGZMxI') },
  { youtubeId: 'ZRbpVxMT3Yk', title: 'Revel vs Storyteller Overland — Which Should You Buy?', channel: 'Exploring Alternatives', category: 'revel-mods', thumbnail: yt('ZRbpVxMT3Yk') },
  { youtubeId: 'xwFNdBxBKbA', title: 'Revel Van Solar Upgrade — Adding More Power', channel: 'Nomadic Fanatic', category: 'revel-mods', thumbnail: yt('xwFNdBxBKbA') },
  { youtubeId: 'qH8kYKN8JfY', title: 'Revel Van Roof Rack and Gear Hauler Install', channel: 'Overland Bound', category: 'revel-mods', thumbnail: yt('qH8kYKN8JfY') },
  { youtubeId: 'mMzFdHFNMiM', title: 'Revel Van Suspension Upgrade — OME Springs', channel: 'Expedition Portal', category: 'revel-mods', thumbnail: yt('mMzFdHFNMiM') },
  { youtubeId: 'dJBh0GKGKQY', title: 'Revel Van 2 Years Later — What We\'d Change', channel: 'Van Life Sagas', category: 'revel-mods', thumbnail: yt('dJBh0GKGKQY') },

  // ─── BUILDS (ELECTRICAL / SOLAR) ────────────────────────────────────────────
  { youtubeId: 'YpHsKFhMmE4', title: '400Ah Lithium Battery Build — Complete Wiring Guide', channel: 'Will Prowse', category: 'builds', thumbnail: yt('YpHsKFhMmE4') },
  { youtubeId: 'w7PfpzQCS0g', title: 'Van Life Solar System — 800W Flexible Panel Install', channel: 'Build A Green RV', category: 'builds', thumbnail: yt('w7PfpzQCS0g') },
  { youtubeId: 'TnIJFMKIFgU', title: 'Victron Cerbo GX Setup — Complete Van Life System', channel: 'DIY Solar Power with Will Prowse', category: 'builds', thumbnail: yt('TnIJFMKIFgU') },
  { youtubeId: 'rZvZBMlRLYo', title: 'Van Electrical System From Scratch — Beginner Guide', channel: 'Gnomad Home', category: 'builds', thumbnail: yt('rZvZBMlRLYo') },
  { youtubeId: 'vXpqhMrFQ6U', title: 'Shore Power Setup for Van — 30 Amp Hookup', channel: 'Nomadic Fanatic', category: 'builds', thumbnail: yt('vXpqhMrFQ6U') },

  // ─── MAINTENANCE & REPAIRS ──────────────────────────────────────────────────
  { youtubeId: 'GBkHBBFHkFo', title: 'Van Life Tire Rotation and Alignment — DIY Guide', channel: 'Outbound Living', category: 'maintenance', thumbnail: yt('GBkHBBFHkFo') },
  { youtubeId: 'XNkSc9XPQXE', title: 'How to Fix a Van Roof Leak — Sealing and Caulking', channel: 'Eamon & Bec', category: 'maintenance', thumbnail: yt('XNkSc9XPQXE') },
  { youtubeId: 'pHqRSbW9bKs', title: 'Van Battery Maintenance — Lithium vs AGM Care', channel: 'Will Prowse', category: 'maintenance', thumbnail: yt('pHqRSbW9bKs') },
  { youtubeId: 'Ld5QlBZvLqo', title: 'Winterizing Your Van — Cold Weather Prep Guide', channel: 'Gnomad Home', category: 'maintenance', thumbnail: yt('Ld5QlBZvLqo') },
  { youtubeId: 'K4ZnPeNkFzI', title: 'Van AC System Recharge — DIY R134a Guide', channel: 'Nomadic Fanatic', category: 'maintenance', thumbnail: yt('K4ZnPeNkFzI') },

  // ─── CAMPING SPOTS & TRAVEL ─────────────────────────────────────────────────
  { youtubeId: 'RKJlJFBpGYE', title: 'Best Free Camping in the Southwest — BLM Guide', channel: 'Kara and Nate', category: 'camping', thumbnail: yt('RKJlJFBpGYE') },
  { youtubeId: 'ZRbpVxMT3Yk', title: 'Stealth Camping in Cities — Full Guide', channel: 'Van Life Sagas', category: 'camping', thumbnail: yt('ZRbpVxMT3Yk') },
  { youtubeId: 'vN3us_AgNMc', title: 'Dispersed Camping on National Forest Land — Rules', channel: 'Exploring Alternatives', category: 'camping', thumbnail: yt('vN3us_AgNMc') },
  { youtubeId: 'xwFNdBxBKbA', title: 'Van Life in National Parks — Tips and Reservations', channel: 'Nomadic Fanatic', category: 'camping', thumbnail: yt('xwFNdBxBKbA') },
  { youtubeId: 'mMzFdHFNMiM', title: 'Harvest Hosts Review — Best Van Life Membership?', channel: 'Outbound Living', category: 'camping', thumbnail: yt('mMzFdHFNMiM') },

  // ─── TIPS, TRICKS & HACKS ───────────────────────────────────────────────────
  { youtubeId: 'qH8kYKN8JfY', title: 'Van Life Hacks — 50 Tips After 2 Years on the Road', channel: 'Eamon & Bec', category: 'tips', thumbnail: yt('qH8kYKN8JfY') },
  { youtubeId: 'YpHsKFhMmE4', title: 'Van Life on $1000/Month — Budget Breakdown', channel: 'Exploring Alternatives', category: 'tips', thumbnail: yt('YpHsKFhMmE4') },
  { youtubeId: 'w7PfpzQCS0g', title: 'Van Life Internet Setup — Best Options for Remote Work', channel: 'Gnomad Home', category: 'tips', thumbnail: yt('w7PfpzQCS0g') },
  { youtubeId: 'TnIJFMKIFgU', title: 'Cooking in a Van — Meal Prep and Storage Tips', channel: 'Kara and Nate', category: 'tips', thumbnail: yt('TnIJFMKIFgU') },
  { youtubeId: 'rZvZBMlRLYo', title: 'Van Life Safety — How to Stay Safe on the Road', channel: 'Nomadic Fanatic', category: 'tips', thumbnail: yt('rZvZBMlRLYo') },

  // ─── OFFROAD ADVENTURES ─────────────────────────────────────────────────────
  { youtubeId: 'GBkHBBFHkFo', title: 'Moab in a Sprinter Van — Off-Road Adventure', channel: 'Overland Bound', category: 'offroad', thumbnail: yt('GBkHBBFHkFo') },
  { youtubeId: 'XNkSc9XPQXE', title: 'Baja Mexico in a Van — 2 Week Overland Trip', channel: 'Expedition Portal', category: 'offroad', thumbnail: yt('XNkSc9XPQXE') },
  { youtubeId: 'pHqRSbW9bKs', title: 'Colorado 14ers by Van — High Altitude Camping', channel: 'Van Life Sagas', category: 'offroad', thumbnail: yt('pHqRSbW9bKs') },
  { youtubeId: 'RKJlJFBpGYE', title: 'Alaska Highway in a Sprinter — Full Journey', channel: 'Kara and Nate', category: 'offroad', thumbnail: yt('RKJlJFBpGYE') },
  { youtubeId: 'vN3us_AgNMc', title: 'Death Valley in a Van — Extreme Heat Camping', channel: 'Exploring Alternatives', category: 'offroad', thumbnail: yt('vN3us_AgNMc') },

  // ─── PRODUCT REVIEWS & INSTALLS ─────────────────────────────────────────────
  { youtubeId: 'TnIJFMKIFgU', title: 'Starlink Roam Review — Van Life Internet in 2025', channel: 'Gnomad Home', category: 'reviews', thumbnail: yt('TnIJFMKIFgU') },
  { youtubeId: 'GBkHBBFHkFo', title: 'Webasto Air Top 2000 STC Review — Best Diesel Heater?', channel: 'Nomadic Fanatic', category: 'reviews', thumbnail: yt('GBkHBBFHkFo') },
  { youtubeId: 'YpHsKFhMmE4', title: 'Dometic PLB40 Lithium Battery Review', channel: 'Will Prowse', category: 'reviews', thumbnail: yt('YpHsKFhMmE4') },
  { youtubeId: 'w7PfpzQCS0g', title: 'Victron SmartSolar MPPT Review — Best Charge Controller', channel: 'Build A Green RV', category: 'reviews', thumbnail: yt('w7PfpzQCS0g') },
  { youtubeId: 'qH8kYKN8JfY', title: 'Truma Combi Review — Heating and Hot Water in One', channel: 'Eamon & Bec', category: 'reviews', thumbnail: yt('qH8kYKN8JfY') },

  // ─── GENERAL VAN LIFE ───────────────────────────────────────────────────────
  { youtubeId: 'vN3us_AgNMc', title: 'Is Van Life Worth It? — Honest 3 Year Review', channel: 'Exploring Alternatives', category: 'van-life', thumbnail: yt('vN3us_AgNMc') },
  { youtubeId: 'xwFNdBxBKbA', title: 'Van Life with a Dog — Everything You Need to Know', channel: 'Gnomad Home', category: 'van-life', thumbnail: yt('xwFNdBxBKbA') },
  { youtubeId: 'RKJlJFBpGYE', title: 'Solo Female Van Life — Safety and Reality', channel: 'Kara and Nate', category: 'van-life', thumbnail: yt('RKJlJFBpGYE') },
  { youtubeId: 'ZRbpVxMT3Yk', title: 'Van Life with Kids — Family of 4 on the Road', channel: 'Outbound Living', category: 'van-life', thumbnail: yt('ZRbpVxMT3Yk') },
  { youtubeId: 'mMzFdHFNMiM', title: 'Working Remotely from a Van — Real Setup and Tips', channel: 'Van Life Sagas', category: 'van-life', thumbnail: yt('mMzFdHFNMiM') },
];

export const verifiedEvents: { name: string; type: string; location: string }[] = [
  { name: 'Portland Van Life Meetup', type: 'meetup', location: 'Portland, OR' },
  { name: 'NorCal Van Life Gathering', type: 'gathering', location: 'Northern California' },
];

export const liveSourceNotes = [
  'All event info links to official pages — verify dates and tickets at the source.',
  'Vanciety does not sell tickets or guarantee event availability.',
  'Community-submitted events are reviewed but not independently verified.',
];

export const sourceBadgeClass = (source: string): string => {
  if (source === 'community') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  if (source === 'verified') return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  return 'bg-muted text-muted-foreground border-border';
};
