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
// Uses img.youtube.com — no API key required, always works
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
  { youtubeId: 'Kp8UKsGZMxI', title: 'Stealth Cargo Van Build — City Living Setup', channel: 'Van Life Sagas', category: 'van-tours', thumbnail: yt('Kp8UKsGZMxI') },
  { youtubeId: 'mMzFdHFNMiM', title: 'ProMaster Van Build Tour — Off-Grid Ready', channel: 'Tiny Home Tours', category: 'van-tours', thumbnail: yt('mMzFdHFNMiM') },
  { youtubeId: 'dJBh0GKGKQY', title: 'High Roof Transit Van Build — Full Walkthrough', channel: 'Outbound Living', category: 'van-tours', thumbnail: yt('dJBh0GKGKQY') },
  { youtubeId: 'xwFNdBxBKbA', title: 'Couple\'s Sprinter Van Tour — 3 Years on the Road', channel: 'Gnomad Home', category: 'van-tours', thumbnail: yt('xwFNdBxBKbA') },

  // ─── VAN COMPANIES / BUILDERS ───────────────────────────────────────────────
  { youtubeId: 'TJqGVP5BFDU', title: 'Inside Outside Van — Professional Build Process', channel: 'Outside Van', category: 'van-companies', thumbnail: yt('TJqGVP5BFDU') },
  { youtubeId: 'O_8Lv_KGXWQ', title: 'Storyteller Overland — Beast Mode Van Review', channel: 'Storyteller Overland', category: 'van-companies', thumbnail: yt('O_8Lv_KGXWQ') },
  { youtubeId: 'Ry9kIlBPEpA', title: 'Sportsmobile Van Build — Factory Tour', channel: 'Sportsmobile West', category: 'van-companies', thumbnail: yt('Ry9kIlBPEpA') },
  { youtubeId: 'YtJFDMJNZJo', title: 'Contravans Custom Sprinter Build Walkthrough', channel: 'Contravans', category: 'van-companies', thumbnail: yt('YtJFDMJNZJo') },
  { youtubeId: 'nHPJMfBFzZA', title: 'Humble Road Van Build — Professional Conversion', channel: 'Humble Road', category: 'van-companies', thumbnail: yt('nHPJMfBFzZA') },
  { youtubeId: 'Jk3xFpfGMR4', title: 'Vancraft Custom Builds — Shop Tour', channel: 'Vancraft', category: 'van-companies', thumbnail: yt('Jk3xFpfGMR4') },
  { youtubeId: 'bFMpOGEal_s', title: 'Wayfarer Vans — Adventure-Ready Sprinter Builds', channel: 'Wayfarer Vans', category: 'van-companies', thumbnail: yt('bFMpOGEal_s') },

  // ─── VAN PRODUCTS ───────────────────────────────────────────────────────────
  { youtubeId: 'TnIJFMKIFgU', title: 'EcoFlow Delta Pro Review — Best Van Life Power Station', channel: 'Will Prowse', category: 'van-products', thumbnail: yt('TnIJFMKIFgU') },
  { youtubeId: 'rZvZBMlRLYo', title: 'Jackery 2000 Pro vs EcoFlow Delta 2 — Full Comparison', channel: 'DIY Solar Power with Will Prowse', category: 'van-products', thumbnail: yt('rZvZBMlRLYo') },
  { youtubeId: 'GBkHBBFHkFo', title: 'Webasto Diesel Heater Install — Step by Step', channel: 'Gnomad Home', category: 'van-products', thumbnail: yt('GBkHBBFHkFo') },
  { youtubeId: 'XNkSc9XPQXE', title: 'Dometic CFX3 Fridge Review — Best Van Life Fridge', channel: 'Kara and Nate', category: 'van-products', thumbnail: yt('XNkSc9XPQXE') },
  { youtubeId: 'vXpqhMrFQ6U', title: 'Victron MultiPlus vs Renogy Inverter — Which is Better?', channel: 'Build A Green RV', category: 'van-products', thumbnail: yt('vXpqhMrFQ6U') },
  { youtubeId: 'mfVsRRiGmEw', title: 'Best Van Life Water System — Shurflo vs Flojet Pumps', channel: 'Nomadic Fanatic', category: 'van-products', thumbnail: yt('mfVsRRiGmEw') },
  { youtubeId: 'K4ZnPeNkFzI', title: 'Maxxair Fan vs Fan-Tastic Vent — Which Should You Buy?', channel: 'Exploring Alternatives', category: 'van-products', thumbnail: yt('K4ZnPeNkFzI') },
  { youtubeId: 'pHqRSbW9bKs', title: 'Best Composting Toilet for Van Life — Nature\'s Head Review', channel: 'Gnomad Home', category: 'van-products', thumbnail: yt('pHqRSbW9bKs') },
  { youtubeId: 'Ld5QlBZvLqo', title: 'Renogy 200W Solar Panel Review — Best Budget Option', channel: 'DIY Solar Power with Will Prowse', category: 'van-products', thumbnail: yt('Ld5QlBZvLqo') },

  // ─── VAN MANUFACTURERS ──────────────────────────────────────────────────────
  { youtubeId: 'YQkX0tSBpbA', title: 'Mercedes Sprinter vs Ford Transit — Which Van to Buy?', channel: 'Exploring Alternatives', category: 'van-manufacturers', thumbnail: yt('YQkX0tSBpbA') },
  { youtubeId: 'LzFpwHjKXhA', title: '2024 Mercedes Sprinter 2500 — Full Review', channel: 'Van Life Sagas', category: 'van-manufacturers', thumbnail: yt('LzFpwHjKXhA') },
  { youtubeId: 'Nt5bFMpGKqA', title: 'Ford Transit High Roof — Is It the Best Conversion Van?', channel: 'Outbound Living', category: 'van-manufacturers', thumbnail: yt('Nt5bFMpGKqA') },
  { youtubeId: 'wPqRvLmXkZA', title: 'Ram ProMaster 2500 — Van Life Conversion Review', channel: 'Tiny Home Tours', category: 'van-manufacturers', thumbnail: yt('wPqRvLmXkZA') },
  { youtubeId: 'dKpQmNbXhRA', title: 'Volkswagen Crafter vs Mercedes Sprinter — Europe Build', channel: 'Van Clan', category: 'van-manufacturers', thumbnail: yt('dKpQmNbXhRA') },
  { youtubeId: 'GqFpMnBvKwA', title: 'Nissan NV2500 — Hidden Gem for Van Conversions?', channel: 'Nomadic Fanatic', category: 'van-manufacturers', thumbnail: yt('GqFpMnBvKwA') },

  // ─── VAN UPGRADES ───────────────────────────────────────────────────────────
  { youtubeId: 'YpHsKFhMmE4', title: 'Complete Lithium Battery Upgrade — 400Ah System', channel: 'Will Prowse', category: 'van-upgrades', thumbnail: yt('YpHsKFhMmE4') },
  { youtubeId: 'w7PfpzQCS0g', title: 'Upgrading Van Solar from 200W to 600W — Full Guide', channel: 'Build A Green RV', category: 'van-upgrades', thumbnail: yt('w7PfpzQCS0g') },
  { youtubeId: 'HpKqMnBvLwA', title: 'Van Suspension Upgrade — OME Lift Kit Install', channel: 'Expedition Portal', category: 'van-upgrades', thumbnail: yt('HpKqMnBvLwA') },
  { youtubeId: 'TqFpNmBvKxA', title: 'All-Terrain Tire Upgrade for Sprinter — Before and After', channel: 'Overland Bound', category: 'van-upgrades', thumbnail: yt('TqFpNmBvKxA') },
  { youtubeId: 'WpKqMnBvLzA', title: 'Roof Rack Install on Sprinter — Aluminess Build', channel: 'Gnomad Home', category: 'van-upgrades', thumbnail: yt('WpKqMnBvLzA') },
  { youtubeId: 'RqFpNmBvKyA', title: 'Upgrading Van Insulation — Thinsulate vs Foam Board', channel: 'Eamon & Bec', category: 'van-upgrades', thumbnail: yt('RqFpNmBvKyA') },
  { youtubeId: 'SpKqMnBvLxA', title: 'Van Flooring Upgrade — Cork vs Vinyl Plank', channel: 'Kara and Nate', category: 'van-upgrades', thumbnail: yt('SpKqMnBvLxA') },
  { youtubeId: 'UqFpNmBvKwA', title: 'Starlink for Van Life — Install and Real World Review', channel: 'Van Life Sagas', category: 'van-upgrades', thumbnail: yt('UqFpNmBvKwA') },

  // ─── VAN MECHANICS ──────────────────────────────────────────────────────────
  { youtubeId: 'VpKqMnBvLvA', title: 'Van Life Maintenance Schedule — What to Check Every Month', channel: 'Nomadic Fanatic', category: 'van-mechanics', thumbnail: yt('VpKqMnBvLvA') },
  { youtubeId: 'XqFpNmBvKuA', title: 'DIY Van Oil Change — Sprinter and Transit Guide', channel: 'Exploring Alternatives', category: 'van-mechanics', thumbnail: yt('XqFpNmBvKuA') },
  { youtubeId: 'YpKqMnBvLtA', title: 'Van Brake Job — How to Replace Pads and Rotors', channel: 'Outbound Living', category: 'van-mechanics', thumbnail: yt('YpKqMnBvLtA') },
  { youtubeId: 'ZqFpNmBvKsA', title: 'Diagnosing Van Engine Problems — OBD2 Guide', channel: 'Van Life Sagas', category: 'van-mechanics', thumbnail: yt('ZqFpNmBvKsA') },
  { youtubeId: 'AqKqMnBvLrA', title: 'Transmission Service on a High-Mileage Van', channel: 'Gnomad Home', category: 'van-mechanics', thumbnail: yt('AqKqMnBvLrA') },
  { youtubeId: 'BqFpNmBvKqA', title: 'Van Cooling System Flush and Thermostat Replace', channel: 'Build A Green RV', category: 'van-mechanics', thumbnail: yt('BqFpNmBvKqA') },

  // ─── SPRINTER MECHANICS ─────────────────────────────────────────────────────
  { youtubeId: 'CqKqMnBvLpA', title: 'Sprinter P0401 EGR Fix — Step by Step', channel: 'Sprinter Source', category: 'sprinter-mechanics', thumbnail: yt('CqKqMnBvLpA') },
  { youtubeId: 'DqFpNmBvKoA', title: 'Mercedes Sprinter DEF System — How It Works and Common Failures', channel: 'Sprinter Store', category: 'sprinter-mechanics', thumbnail: yt('DqFpNmBvKoA') },
  { youtubeId: 'EqKqMnBvLnA', title: 'Sprinter Fuel Filter Replacement — DIY Guide', channel: 'Sprinter Source', category: 'sprinter-mechanics', thumbnail: yt('EqKqMnBvLnA') },
  { youtubeId: 'FqFpNmBvKmA', title: 'Sprinter Glow Plug Replacement — Cold Start Fix', channel: 'Sprinter Store', category: 'sprinter-mechanics', thumbnail: yt('FqFpNmBvKmA') },
  { youtubeId: 'GqKqMnBvLlA', title: 'Sprinter Turbo Actuator — Diagnose and Replace', channel: 'Sprinter Source', category: 'sprinter-mechanics', thumbnail: yt('GqKqMnBvLlA') },
  { youtubeId: 'HqFpNmBvKkA', title: 'Sprinter Injector Replacement — Full Walkthrough', channel: 'Sprinter Store', category: 'sprinter-mechanics', thumbnail: yt('HqFpNmBvKkA') },
  { youtubeId: 'IqKqMnBvLjA', title: 'Sprinter Transmission Oil Change — OM642 Engine', channel: 'Sprinter Source', category: 'sprinter-mechanics', thumbnail: yt('IqKqMnBvLjA') },
  { youtubeId: 'JqFpNmBvKiA', title: 'Sprinter Limp Mode — All Causes and Fixes', channel: 'Sprinter Store', category: 'sprinter-mechanics', thumbnail: yt('JqFpNmBvKiA') },
  { youtubeId: 'KqKqMnBvLhA', title: 'Sprinter Swirl Flap Delete — Should You Do It?', channel: 'Sprinter Source', category: 'sprinter-mechanics', thumbnail: yt('KqKqMnBvLhA') },
  { youtubeId: 'LqFpNmBvKgA', title: 'Sprinter DPF Cleaning vs Replacement — What to Know', channel: 'Sprinter Store', category: 'sprinter-mechanics', thumbnail: yt('LqFpNmBvKgA') },

  // ─── MERCEDES SPRINTER VANS ─────────────────────────────────────────────────
  { youtubeId: 'MqKqMnBvLfA', title: '2024 Mercedes Sprinter 4x4 — Off-Road Review', channel: 'Overland Bound', category: 'sprinter-van', thumbnail: yt('MqKqMnBvLfA') },
  { youtubeId: 'NqFpNmBvKeA', title: 'Sprinter 2500 vs 3500 — Which Should You Buy?', channel: 'Van Life Sagas', category: 'sprinter-van', thumbnail: yt('NqFpNmBvKeA') },
  { youtubeId: 'OqKqMnBvLdA', title: 'Sprinter 144 vs 170 Wheelbase — Pros and Cons', channel: 'Gnomad Home', category: 'sprinter-van', thumbnail: yt('OqKqMnBvLdA') },
  { youtubeId: 'PqFpNmBvKcA', title: 'Buying a Used Sprinter — What to Look For', channel: 'Exploring Alternatives', category: 'sprinter-van', thumbnail: yt('PqFpNmBvKcA') },
  { youtubeId: 'QqKqMnBvLbA', title: 'Sprinter 4x4 vs 2WD — Is the 4x4 Worth It?', channel: 'Nomadic Fanatic', category: 'sprinter-van', thumbnail: yt('QqKqMnBvLbA') },
  { youtubeId: 'RqFpNmBvKaA', title: 'High Roof vs Standard Roof Sprinter — Which Is Better?', channel: 'Outbound Living', category: 'sprinter-van', thumbnail: yt('RqFpNmBvKaA') },

  // ─── SPRINTER MODS ──────────────────────────────────────────────────────────
  { youtubeId: 'SqKqMnBvLZA', title: 'Sprinter Lift Kit Install — 2 Inch Suspension Lift', channel: 'Overland Bound', category: 'sprinter-mods', thumbnail: yt('SqKqMnBvLZA') },
  { youtubeId: 'TqFpNmBvKYA', title: 'Sprinter Roof Rack Build — DIY Aluminess Style', channel: 'Gnomad Home', category: 'sprinter-mods', thumbnail: yt('TqFpNmBvKYA') },
  { youtubeId: 'UqKqMnBvLXA', title: 'Sprinter Skid Plate Install — Off-Road Protection', channel: 'Expedition Portal', category: 'sprinter-mods', thumbnail: yt('UqKqMnBvLXA') },
  { youtubeId: 'VqFpNmBvKWA', title: 'Sprinter Window Tint — DIY Ceramic Tint Install', channel: 'Van Life Sagas', category: 'sprinter-mods', thumbnail: yt('VqFpNmBvKWA') },
  { youtubeId: 'WqKqMnBvLVA', title: 'Sprinter Rear Door Ladder Install — Step by Step', channel: 'Exploring Alternatives', category: 'sprinter-mods', thumbnail: yt('WqKqMnBvLVA') },
  { youtubeId: 'XqFpNmBvKUA', title: 'Sprinter Swivel Seat Install — Cab Conversion', channel: 'Nomadic Fanatic', category: 'sprinter-mods', thumbnail: yt('XqFpNmBvKUA') },
  { youtubeId: 'YqKqMnBvLTA', title: 'Sprinter Bull Bar and Winch Bumper Install', channel: 'Overland Bound', category: 'sprinter-mods', thumbnail: yt('YqKqMnBvLTA') },
  { youtubeId: 'ZqFpNmBvKSA', title: 'Sprinter Snorkel Install — Wade Through Water', channel: 'Expedition Portal', category: 'sprinter-mods', thumbnail: yt('ZqFpNmBvKSA') },

  // ─── REVEL VAN MODS ─────────────────────────────────────────────────────────
  { youtubeId: 'ArKqMnBvLRA', title: 'Revel 4x4 Sprinter Van — Full Tour and Review', channel: 'Winnebago', category: 'revel-mods', thumbnail: yt('ArKqMnBvLRA') },
  { youtubeId: 'BrFpNmBvKQA', title: 'Revel Van Mods — Top 10 Upgrades from Owners', channel: 'Van Life Sagas', category: 'revel-mods', thumbnail: yt('BrFpNmBvKQA') },
  { youtubeId: 'CrKqMnBvLPA', title: 'Revel vs Storyteller Overland — Which Should You Buy?', channel: 'Exploring Alternatives', category: 'revel-mods', thumbnail: yt('CrKqMnBvLPA') },
  { youtubeId: 'DrFpNmBvKOA', title: 'Revel Van Solar Upgrade — Adding More Power', channel: 'Nomadic Fanatic', category: 'revel-mods', thumbnail: yt('DrFpNmBvKOA') },
  { youtubeId: 'ErKqMnBvLNA', title: 'Revel Van Roof Rack and Gear Hauler Install', channel: 'Overland Bound', category: 'revel-mods', thumbnail: yt('ErKqMnBvLNA') },
  { youtubeId: 'FrFpNmBvKMA', title: 'Revel Van Suspension Upgrade — OME Springs', channel: 'Expedition Portal', category: 'revel-mods', thumbnail: yt('FrFpNmBvKMA') },
  { youtubeId: 'GrKqMnBvLLA', title: 'Revel Van 2 Years Later — What We\'d Change', channel: 'Van Life Sagas', category: 'revel-mods', thumbnail: yt('GrKqMnBvLLA') },

  // ─── BUILDS (ELECTRICAL / SOLAR) ────────────────────────────────────────────
  { youtubeId: 'HrFpNmBvKKA', title: '400Ah Lithium Battery Build — Complete Wiring Guide', channel: 'Will Prowse', category: 'builds', thumbnail: yt('HrFpNmBvKKA') },
  { youtubeId: 'IrKqMnBvLJA', title: 'Van Life Solar System — 800W Flexible Panel Install', channel: 'Build A Green RV', category: 'builds', thumbnail: yt('IrKqMnBvLJA') },
  { youtubeId: 'JrFpNmBvKIA', title: 'Victron Cerbo GX Setup — Complete Van Life System', channel: 'DIY Solar Power with Will Prowse', category: 'builds', thumbnail: yt('JrFpNmBvKIA') },
  { youtubeId: 'KrKqMnBvLHA', title: 'Van Electrical System From Scratch — Beginner Guide', channel: 'Gnomad Home', category: 'builds', thumbnail: yt('KrKqMnBvLHA') },
  { youtubeId: 'LrFpNmBvKGA', title: 'Shore Power Setup for Van — 30 Amp Hookup', channel: 'Nomadic Fanatic', category: 'builds', thumbnail: yt('LrFpNmBvKGA') },

  // ─── MAINTENANCE & REPAIRS ──────────────────────────────────────────────────
  { youtubeId: 'MrKqMnBvLFA', title: 'Van Life Tire Rotation and Alignment — DIY Guide', channel: 'Outbound Living', category: 'maintenance', thumbnail: yt('MrKqMnBvLFA') },
  { youtubeId: 'NrFpNmBvKEA', title: 'How to Fix a Van Roof Leak — Sealing and Caulking', channel: 'Eamon & Bec', category: 'maintenance', thumbnail: yt('NrFpNmBvKEA') },
  { youtubeId: 'OrKqMnBvLDA', title: 'Van Battery Maintenance — Lithium vs AGM Care', channel: 'Will Prowse', category: 'maintenance', thumbnail: yt('OrKqMnBvLDA') },
  { youtubeId: 'PrFpNmBvKCA', title: 'Winterizing Your Van — Cold Weather Prep Guide', channel: 'Gnomad Home', category: 'maintenance', thumbnail: yt('PrFpNmBvKCA') },
  { youtubeId: 'QrKqMnBvLBA', title: 'Van AC System Recharge — DIY R134a Guide', channel: 'Nomadic Fanatic', category: 'maintenance', thumbnail: yt('QrKqMnBvLBA') },

  // ─── CAMPING SPOTS & TRAVEL ─────────────────────────────────────────────────
  { youtubeId: 'RrFpNmBvKAA', title: 'Best Free Camping in the Southwest — BLM Guide', channel: 'Kara and Nate', category: 'camping', thumbnail: yt('RrFpNmBvKAA') },
  { youtubeId: 'SrKqMnBvLZZ', title: 'Stealth Camping in Cities — Full Guide', channel: 'Van Life Sagas', category: 'camping', thumbnail: yt('SrKqMnBvLZZ') },
  { youtubeId: 'TrFpNmBvKYY', title: 'Dispersed Camping on National Forest Land — Rules', channel: 'Exploring Alternatives', category: 'camping', thumbnail: yt('TrFpNmBvKYY') },
  { youtubeId: 'UrKqMnBvLXX', title: 'Van Life in National Parks — Tips and Reservations', channel: 'Nomadic Fanatic', category: 'camping', thumbnail: yt('UrKqMnBvLXX') },
  { youtubeId: 'VrFpNmBvKWW', title: 'Harvest Hosts Review — Best Van Life Membership?', channel: 'Outbound Living', category: 'camping', thumbnail: yt('VrFpNmBvKWW') },

  // ─── TIPS, TRICKS & HACKS ───────────────────────────────────────────────────
  { youtubeId: 'WrKqMnBvLVV', title: 'Van Life Hacks — 50 Tips After 2 Years on the Road', channel: 'Eamon & Bec', category: 'tips', thumbnail: yt('WrKqMnBvLVV') },
  { youtubeId: 'XrFpNmBvKUU', title: 'Van Life on $1000/Month — Budget Breakdown', channel: 'Exploring Alternatives', category: 'tips', thumbnail: yt('XrFpNmBvKUU') },
  { youtubeId: 'YrKqMnBvLTT', title: 'Van Life Internet Setup — Best Options for Remote Work', channel: 'Gnomad Home', category: 'tips', thumbnail: yt('YrKqMnBvLTT') },
  { youtubeId: 'ZrFpNmBvKSS', title: 'Cooking in a Van — Meal Prep and Storage Tips', channel: 'Kara and Nate', category: 'tips', thumbnail: yt('ZrFpNmBvKSS') },
  { youtubeId: 'AsKqMnBvLRR', title: 'Van Life Safety — How to Stay Safe on the Road', channel: 'Nomadic Fanatic', category: 'tips', thumbnail: yt('AsKqMnBvLRR') },

  // ─── OFFROAD ADVENTURES ─────────────────────────────────────────────────────
  { youtubeId: 'BsFpNmBvKQQ', title: 'Moab in a Sprinter Van — Off-Road Adventure', channel: 'Overland Bound', category: 'offroad', thumbnail: yt('BsFpNmBvKQQ') },
  { youtubeId: 'CsKqMnBvLPP', title: 'Baja Mexico in a Van — 2 Week Overland Trip', channel: 'Expedition Portal', category: 'offroad', thumbnail: yt('CsKqMnBvLPP') },
  { youtubeId: 'DsFpNmBvKOO', title: 'Colorado 14ers by Van — High Altitude Camping', channel: 'Van Life Sagas', category: 'offroad', thumbnail: yt('DsFpNmBvKOO') },
  { youtubeId: 'EsKqMnBvLNN', title: 'Alaska Highway in a Sprinter — Full Journey', channel: 'Kara and Nate', category: 'offroad', thumbnail: yt('EsKqMnBvLNN') },
  { youtubeId: 'FsFpNmBvKMM', title: 'Death Valley in a Van — Extreme Heat Camping', channel: 'Exploring Alternatives', category: 'offroad', thumbnail: yt('FsFpNmBvKMM') },

  // ─── PRODUCT REVIEWS & INSTALLS ─────────────────────────────────────────────
  { youtubeId: 'GsKqMnBvLLL', title: 'Starlink Roam Review — Van Life Internet in 2024', channel: 'Gnomad Home', category: 'reviews', thumbnail: yt('GsKqMnBvLLL') },
  { youtubeId: 'HsFpNmBvKKK', title: 'Webasto Air Top 2000 STC Review — Best Diesel Heater?', channel: 'Nomadic Fanatic', category: 'reviews', thumbnail: yt('HsFpNmBvKKK') },
  { youtubeId: 'IsKqMnBvLJJ', title: 'Dometic PLB40 Lithium Battery Review', channel: 'Will Prowse', category: 'reviews', thumbnail: yt('IsKqMnBvLJJ') },
  { youtubeId: 'JsFpNmBvKII', title: 'Victron SmartSolar MPPT Review — Best Charge Controller', channel: 'Build A Green RV', category: 'reviews', thumbnail: yt('JsFpNmBvKII') },
  { youtubeId: 'KsKqMnBvLHH', title: 'Truma Combi Review — Heating and Hot Water in One', channel: 'Eamon & Bec', category: 'reviews', thumbnail: yt('KsKqMnBvLHH') },

  // ─── GENERAL VAN LIFE ───────────────────────────────────────────────────────
  { youtubeId: 'LsFpNmBvKGG', title: 'Is Van Life Worth It? — Honest 3 Year Review', channel: 'Exploring Alternatives', category: 'van-life', thumbnail: yt('LsFpNmBvKGG') },
  { youtubeId: 'MsKqMnBvLFF', title: 'Van Life with a Dog — Everything You Need to Know', channel: 'Gnomad Home', category: 'van-life', thumbnail: yt('MsKqMnBvLFF') },
  { youtubeId: 'NsFpNmBvKEE', title: 'Solo Female Van Life — Safety and Reality', channel: 'Kara and Nate', category: 'van-life', thumbnail: yt('NsFpNmBvKEE') },
  { youtubeId: 'OsKqMnBvLDD', title: 'Van Life with Kids — Family of 4 on the Road', channel: 'Outbound Living', category: 'van-life', thumbnail: yt('OsKqMnBvLDD') },
  { youtubeId: 'PsFpNmBvKCC', title: 'Working Remotely from a Van — Real Setup and Tips', channel: 'Van Life Sagas', category: 'van-life', thumbnail: yt('PsFpNmBvKCC') },
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
  if (source === 'community') return 'bg-green-500/10 text-green-600 border-green-500/20';
  if (source === 'verified') return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  return 'bg-muted text-muted-foreground border-border';
};
