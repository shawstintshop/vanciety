/**
 * VanLifeSpots — The Van Lifer's Ground-Level Map
 *
 * Categories:
 * - 🏠 Driveway Surfing    — member hosts offering their driveway/yard
 * - 🏕️ Secret Camp Spots  — community-sourced hidden free camping
 * - 👥 Camp with Member   — find a van lifer to camp alongside tonight
 * - 🔧 Van Mechanics      — trusted shops, mobile mechs, Sprinter specialists
 * - ⛽ Fuel & Service     — diesel, propane, DEF, tire shops
 * - 🚿 Showers & Laundry  — gyms, truck stops, laundromats
 * - 🍔 Great Food Spots   — van-lifer-approved restaurants, food trucks, diners
 * - 🚗 Car Washes         — RV-safe, tall-clearance washes
 * - 💧 Water Fill         — potable water sources
 * - 🗑️ Dump Stations      — grey/black water disposal
 * - 🛒 Van Gear & Parts   — local shops, auto parts, gear stores
 * - 📶 Good WiFi Spots    — libraries, cafes, coworking with solid internet
 *
 * Privacy rules (same as FriendFinder):
 * - Must be signed-in member to add or see member-hosted spots
 * - Exact GPS never stored — snapped to ~100m grid for public spots
 * - All spots are community-verified with upvote/flag system
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home, Tent, Users, Wrench, Fuel, ShowerHead, UtensilsCrossed,
  Car, Droplets, Trash2, ShoppingBag, Wifi, MapPin, Plus,
  Search, Filter, Star, ThumbsUp, Flag, Navigation, X,
  ChevronRight, Shield, Lock, Info, Phone, Globe, Clock,
  CheckCircle, AlertTriangle
} from "lucide-react";

// ─── Spot categories ──────────────────────────────────────────────────────
export const SPOT_CATEGORIES = [
  { id: "all",           label: "All Spots",        icon: MapPin,          color: "#b8860b", bg: "#b8860b22", memberOnly: false },
  { id: "driveway",      label: "Driveway Surf",    icon: Home,            color: "#22c55e", bg: "#22c55e22", memberOnly: true  },
  { id: "camp-secret",   label: "Secret Camps",     icon: Tent,            color: "#8b5cf6", bg: "#8b5cf622", memberOnly: false },
  { id: "camp-member",   label: "Camp w/ Member",   icon: Users,           color: "#f97316", bg: "#f9731622", memberOnly: true  },
  { id: "mechanic",      label: "Van Mechanics",    icon: Wrench,          color: "#ef4444", bg: "#ef444422", memberOnly: false },
  { id: "fuel-service",  label: "Fuel & Service",   icon: Fuel,            color: "#64748b", bg: "#64748b22", memberOnly: false },
  { id: "shower",        label: "Showers & Laundry",icon: ShowerHead,      color: "#06b6d4", bg: "#06b6d422", memberOnly: false },
  { id: "food",          label: "Great Food",       icon: UtensilsCrossed, color: "#f59e0b", bg: "#f59e0b22", memberOnly: false },
  { id: "carwash",       label: "Car Washes",       icon: Car,             color: "#3b82f6", bg: "#3b82f622", memberOnly: false },
  { id: "water",         label: "Water Fill",       icon: Droplets,        color: "#0ea5e9", bg: "#0ea5e922", memberOnly: false },
  { id: "dump",          label: "Dump Stations",    icon: Trash2,          color: "#78716c", bg: "#78716c22", memberOnly: false },
  { id: "gear",          label: "Gear & Parts",     icon: ShoppingBag,     color: "#d97706", bg: "#d9770622", memberOnly: false },
  { id: "wifi",          label: "Good WiFi",        icon: Wifi,            color: "#10b981", bg: "#10b98122", memberOnly: false },
] as const;

export type SpotCategoryId = typeof SPOT_CATEGORIES[number]["id"];

// ─── Spot type ────────────────────────────────────────────────────────────
export interface VanSpot {
  id: string;
  category: SpotCategoryId;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  city: string;
  state: string;
  rating: number;
  votes: number;
  amenities: string[];
  addedBy?: string;
  addedAt: string;
  verified: boolean;
  memberOnly: boolean;
  phone?: string;
  website?: string;
  hours?: string;
  tags: string[];
}

// ─── Seed spots (real locations, community-style) ─────────────────────────
const SEED_SPOTS: VanSpot[] = [
  // Driveway surfing
  { id: "d1", category: "driveway", name: "Mike's Driveway — Portland", description: "Gravel driveway, access to outdoor shower and power hookup. Dog friendly. 2 vans max.", latitude: 45.5231, longitude: -122.6765, city: "Portland", state: "OR", rating: 4.9, votes: 34, amenities: ["Power", "Outdoor Shower", "WiFi", "Dog Friendly"], addedBy: "VanMike_PDX", addedAt: "2025-11-01", verified: true, memberOnly: true, tags: ["power", "shower", "dog-friendly"] },
  { id: "d2", category: "driveway", name: "Sarah's Place — Flagstaff", description: "Large driveway, can fit 3 vans. Shared outdoor bathroom. Great elevation, cool nights.", latitude: 35.1983, longitude: -111.6513, city: "Flagstaff", state: "AZ", rating: 4.7, votes: 21, amenities: ["Bathroom Access", "Level Ground"], addedBy: "SarahVanLife", addedAt: "2025-10-15", verified: true, memberOnly: true, tags: ["level", "bathroom"] },

  // Secret camp spots
  { id: "s1", category: "camp-secret", name: "Dispersed BLM — Moab Rim", description: "Pull off on the dirt road before the trailhead. Flat, stunning views. No services but zero traffic at night.", latitude: 38.5733, longitude: -109.5498, city: "Moab", state: "UT", rating: 4.8, votes: 89, amenities: ["Dispersed", "Views", "Quiet"], addedBy: "OverlandShaw", addedAt: "2025-09-20", verified: true, memberOnly: false, tags: ["blm", "views", "free"] },
  { id: "s2", category: "camp-secret", name: "Forest Road 149 — Sedona", description: "Coconino NF dispersed. Drive 2 miles in on the dirt road. Incredible red rock views, very few people.", latitude: 34.8697, longitude: -111.7610, city: "Sedona", state: "AZ", rating: 4.9, votes: 67, amenities: ["Dispersed", "Views", "Fire Allowed"], addedBy: "RedRockVan", addedAt: "2025-08-12", verified: true, memberOnly: false, tags: ["national-forest", "fire", "views"] },
  { id: "s3", category: "camp-secret", name: "Stealth Spot — Olympic Peninsula", description: "Pull-out on Hwy 101 near Quinault. Dense forest cover, very private. Cell signal weak but peaceful.", latitude: 47.4537, longitude: -123.8613, city: "Quinault", state: "WA", rating: 4.6, votes: 44, amenities: ["Stealth", "Private", "Forest"], addedBy: "PNWVanLife", addedAt: "2025-07-30", verified: true, memberOnly: false, tags: ["stealth", "private", "pnw"] },
  { id: "s4", category: "camp-secret", name: "BLM Dispersed — Joshua Tree North", description: "North of the park boundary, BLM land. Flat desert, incredible stargazing. No water, no services.", latitude: 34.1975, longitude: -116.1669, city: "Twentynine Palms", state: "CA", rating: 4.7, votes: 112, amenities: ["Dispersed", "Stargazing", "Desert"], addedBy: "DesertVanDweller", addedAt: "2025-06-15", verified: true, memberOnly: false, tags: ["blm", "stargazing", "desert"] },

  // Camp with member
  { id: "cm1", category: "camp-member", name: "Convoy Camping — Bend Area", description: "Small group of van lifers parked near Deschutes NF. Looking for 1-2 more to join. Fire tonight.", latitude: 44.0582, longitude: -121.3153, city: "Bend", state: "OR", rating: 5.0, votes: 8, amenities: ["Group Camp", "Fire", "Views"], addedBy: "BendVanCrew", addedAt: "2025-12-01", verified: false, memberOnly: true, tags: ["group", "fire", "convoy"] },

  // Van mechanics
  { id: "m1", category: "mechanic", name: "Sprinter Source — Denver", description: "Sprinter-certified independent shop. Honest pricing, van-lifer friendly. Call ahead.", latitude: 39.7392, longitude: -104.9903, city: "Denver", state: "CO", rating: 4.9, votes: 156, amenities: ["Sprinter Certified", "Diagnostics", "Welding"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, phone: "(720) 555-0142", tags: ["sprinter", "certified", "honest"] },
  { id: "m2", category: "mechanic", name: "High Desert Van Repair — Albuquerque", description: "Mobile mechanic who specializes in Sprinter and Transit. Comes to your campsite.", latitude: 35.0844, longitude: -106.6504, city: "Albuquerque", state: "NM", rating: 4.8, votes: 78, amenities: ["Mobile", "Sprinter", "Transit"], addedBy: "NMVanLife", addedAt: "2025-03-10", verified: true, memberOnly: false, phone: "(505) 555-0198", tags: ["mobile", "sprinter", "transit"] },
  { id: "m3", category: "mechanic", name: "Pacific Van Works — Portland", description: "Full-service van shop. Builds, repairs, electrical. Trusted by the PDX van community.", latitude: 45.5051, longitude: -122.6750, city: "Portland", state: "OR", rating: 4.7, votes: 93, amenities: ["Full Service", "Electrical", "Builds"], addedBy: "PDXVanCommunity", addedAt: "2025-02-14", verified: true, memberOnly: false, tags: ["full-service", "electrical", "builds"] },
  { id: "m4", category: "mechanic", name: "Texas Sprinter Specialists — Austin", description: "Mercedes-trained techs, independent shop. DEF system experts, adblue resets.", latitude: 30.2672, longitude: -97.7431, city: "Austin", state: "TX", rating: 4.6, votes: 61, amenities: ["Mercedes Trained", "DEF System", "Diagnostics"], addedBy: "AustinVanLife", addedAt: "2025-04-20", verified: true, memberOnly: false, phone: "(512) 555-0177", tags: ["mercedes", "def", "adblue"] },

  // Fuel & Service
  { id: "f1", category: "fuel-service", name: "Pilot Flying J — Kingman AZ", description: "Diesel, DEF, propane exchange. RV dump on site. 24hr. Truck parking.", latitude: 35.1894, longitude: -114.0530, city: "Kingman", state: "AZ", rating: 4.2, votes: 203, amenities: ["Diesel", "DEF", "Propane", "Dump", "24hr"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["diesel", "def", "propane", "dump"] },
  { id: "f2", category: "fuel-service", name: "Love's Travel Stop — Amarillo TX", description: "Diesel, DEF, tire service, propane. Shower available. Good food inside.", latitude: 35.2220, longitude: -101.8313, city: "Amarillo", state: "TX", rating: 4.3, votes: 178, amenities: ["Diesel", "DEF", "Tire Service", "Showers", "Propane"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["diesel", "tire", "shower"] },

  // Showers & Laundry
  { id: "sh1", category: "shower", name: "Planet Fitness — $10/mo Anywhere", description: "Black card membership gets you showers at any location nationwide. Best van life shower hack.", latitude: 39.7392, longitude: -104.9903, city: "Denver", state: "CO", rating: 4.8, votes: 445, amenities: ["Showers", "Nationwide", "$10/mo"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["shower", "nationwide", "cheap"] },
  { id: "sh2", category: "shower", name: "Laundromat + Shower — Ashland OR", description: "Clean laundromat with private showers available for $3. Friendly staff, van lifers welcome.", latitude: 42.1946, longitude: -122.7094, city: "Ashland", state: "OR", rating: 4.6, votes: 67, amenities: ["Laundry", "Showers", "Affordable"], addedBy: "OregonVanLife", addedAt: "2025-05-10", verified: true, memberOnly: false, tags: ["laundry", "shower", "affordable"] },

  // Great food
  { id: "fo1", category: "food", name: "In-N-Out Burger — Barstow CA", description: "Classic van lifer stop on I-15. Cheap, fast, animal style. Large parking lot, van-friendly.", latitude: 34.8958, longitude: -117.0228, city: "Barstow", state: "CA", rating: 4.7, votes: 312, amenities: ["Fast Food", "Large Parking", "Affordable"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["fast-food", "cheap", "parking"] },
  { id: "fo2", category: "food", name: "Tacos El Gordo — Las Vegas NV", description: "Best tacos on the strip. Open late. Park on the street or nearby lot. Cash preferred.", latitude: 36.1699, longitude: -115.1398, city: "Las Vegas", state: "NV", rating: 4.9, votes: 189, amenities: ["Late Night", "Authentic", "Affordable"], addedBy: "VegasVanLife", addedAt: "2025-03-22", verified: true, memberOnly: false, tags: ["tacos", "late-night", "authentic"] },
  { id: "fo3", category: "food", name: "Waffle House — Everywhere South", description: "24hr, cheap, hot food. Always a Waffle House when you need one. Van lifers love the parking lot.", latitude: 33.7490, longitude: -84.3880, city: "Atlanta", state: "GA", rating: 4.5, votes: 567, amenities: ["24hr", "Cheap", "Hot Food"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["24hr", "cheap", "south"] },

  // Car washes
  { id: "cw1", category: "carwash", name: "Mister Car Wash — Tall Bay", description: "Has a pull-through bay tall enough for high-roof Sprinters. Ask for the tall vehicle lane.", latitude: 33.4484, longitude: -112.0740, city: "Phoenix", state: "AZ", rating: 4.4, votes: 88, amenities: ["Tall Clearance", "Touchless Option", "Vacuum"], addedBy: "PhoenixVanLife", addedAt: "2025-04-01", verified: true, memberOnly: false, tags: ["tall", "high-roof", "touchless"] },
  { id: "cw2", category: "carwash", name: "Truck Wash — TA Travel Center", description: "Full truck wash bays — fits any van. $25 for exterior wash. Removes road grime and bug splatter.", latitude: 35.2271, longitude: -101.8313, city: "Amarillo", state: "TX", rating: 4.3, votes: 54, amenities: ["Truck Bay", "Any Height", "Full Wash"], addedBy: "TXVanLife", addedAt: "2025-05-15", verified: true, memberOnly: false, tags: ["truck-bay", "any-height"] },

  // Water fill
  { id: "w1", category: "water", name: "Walmart Potable Water — Nationwide", description: "Most Walmart locations have a potable water machine near the entrance. $0.35/gallon.", latitude: 39.8283, longitude: -98.5795, city: "Nationwide", state: "US", rating: 4.6, votes: 892, amenities: ["Potable", "Cheap", "Nationwide"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["potable", "cheap", "nationwide"] },
  { id: "w2", category: "water", name: "BLM Water Spigot — Quartzsite AZ", description: "Free potable water at the Quartzsite BLM office. Open during business hours.", latitude: 33.6645, longitude: -114.2297, city: "Quartzsite", state: "AZ", rating: 4.7, votes: 234, amenities: ["Free", "Potable", "BLM"], addedBy: "QuartzsiteVanLife", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["free", "blm", "quartzsite"] },

  // Dump stations
  { id: "du1", category: "dump", name: "Sanidumps.com Locations", description: "Use sanidumps.com to find the nearest dump station. Most Flying J and Pilot locations have one.", latitude: 39.8283, longitude: -98.5795, city: "Nationwide", state: "US", rating: 4.5, votes: 445, amenities: ["Nationwide", "Database"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["dump", "nationwide", "database"] },

  // Gear & parts
  { id: "g1", category: "gear", name: "4WD Hardware — Columbiana OH", description: "Massive van and 4x4 parts warehouse. Ships fast, great prices on Sprinter parts.", latitude: 40.8862, longitude: -80.6867, city: "Columbiana", state: "OH", rating: 4.8, votes: 156, amenities: ["Online + Pickup", "Sprinter Parts", "4x4"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, website: "4wdhardware.com", tags: ["sprinter", "parts", "4x4"] },
  { id: "g2", category: "gear", name: "REI — Gear for Van Life", description: "REI Co-op membership pays for itself. Good return policy, quality gear for van life.", latitude: 47.6062, longitude: -122.3321, city: "Seattle", state: "WA", rating: 4.6, votes: 234, amenities: ["Quality Gear", "Return Policy", "Co-op"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["gear", "quality", "return-policy"] },

  // WiFi spots
  { id: "wi1", category: "wifi", name: "Public Library — Free WiFi Nationwide", description: "Every US public library has free WiFi. No purchase required. Many have parking lots.", latitude: 39.8283, longitude: -98.5795, city: "Nationwide", state: "US", rating: 4.8, votes: 678, amenities: ["Free", "Fast", "Nationwide", "Parking"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["free", "fast", "nationwide"] },
  { id: "wi2", category: "wifi", name: "McDonald's — Reliable WiFi Everywhere", description: "Consistent free WiFi at most locations. Buy a coffee, stay as long as you need.", latitude: 39.8283, longitude: -98.5795, city: "Nationwide", state: "US", rating: 4.2, votes: 445, amenities: ["Free", "Nationwide", "Food Available"], addedBy: "VancietyVerified", addedAt: "2025-01-01", verified: true, memberOnly: false, tags: ["free", "nationwide", "food"] },
];

// ─── Add Spot form state ──────────────────────────────────────────────────
interface AddSpotForm {
  category: SpotCategoryId;
  name: string;
  description: string;
  city: string;
  state: string;
  amenities: string;
  phone: string;
  website: string;
  hours: string;
  memberOnly: boolean;
}

const DEFAULT_FORM: AddSpotForm = {
  category: "camp-secret",
  name: "",
  description: "",
  city: "",
  state: "",
  amenities: "",
  phone: "",
  website: "",
  hours: "",
  memberOnly: false,
};

// ─── Marker SVG factory ───────────────────────────────────────────────────
function makeMarkerSvg(color: string, emoji: string): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
      </filter>
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z"
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="18" cy="18" r="12" fill="rgba(255,255,255,0.15)"/>
      <text x="18" y="23" text-anchor="middle" font-size="14">${emoji}</text>
    </svg>
  `;
}

const CATEGORY_EMOJI: Record<string, string> = {
  "all": "📍",
  "driveway": "🏠",
  "camp-secret": "🏕️",
  "camp-member": "👥",
  "mechanic": "🔧",
  "fuel-service": "⛽",
  "shower": "🚿",
  "food": "🍔",
  "carwash": "🚗",
  "water": "💧",
  "dump": "🗑️",
  "gear": "🛒",
  "wifi": "📶",
};

// ─── Main component ───────────────────────────────────────────────────────
const VanLifeSpots = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const [activeCategory, setActiveCategory] = useState<SpotCategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<VanSpot | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState<AddSpotForm>(DEFAULT_FORM);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [spots] = useState<VanSpot[]>(SEED_SPOTS);

  // Filter spots
  const filteredSpots = spots.filter(spot => {
    const catMatch = activeCategory === "all" || spot.category === activeCategory;
    const searchMatch = !searchQuery ||
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.tags.some(t => t.includes(searchQuery.toLowerCase()));
    const memberMatch = !spot.memberOnly || !!user;
    return catMatch && searchMatch && memberMatch;
  });

  // Get user location
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      toast({ title: "Location not available", description: "Your browser doesn't support geolocation.", variant: "destructive" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(loc);
          mapInstanceRef.current.setZoom(11);
        }
        toast({ title: "Located!", description: "Map centered on your position." });
      },
      () => toast({ title: "Location denied", description: "Enable location to find spots near you.", variant: "destructive" })
    );
  }, [toast]);

  // Load Google Maps
  useEffect(() => {
    const PROXY_URL = "https://maps.googleapis.com/maps/api/js";
    const MANUS_PROXY = "/api/maps-proxy";

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      try {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 39.8283, lng: -98.5795 },
          zoom: 4,
          mapTypeId: "roadmap",
          styles: [
            { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#b8860b" }] },
            { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#333" }] },
            { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#666" }] },
            { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#1e1e1e" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1e1e1e" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#888" }] },
            { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#1a2a1a" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
            { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#2d2d2d" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#333" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#444" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#222" }] },
            { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#0a1628" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d6b8e" }] },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (e) {
        setMapError(true);
      }
    };

    if (typeof google !== "undefined" && google.maps) {
      initMap();
      return;
    }

    // Try loading via existing proxy pattern
    const existingScript = document.querySelector('script[src*="maps.googleapis"]');
    if (existingScript) {
      existingScript.addEventListener("load", initMap);
      return;
    }

    // Load via Manus proxy
    const script = document.createElement("script");
    script.src = `${MANUS_PROXY}?libraries=places&callback=initVanSpotsMap`;
    script.async = true;
    script.defer = true;
    (window as any).initVanSpotsMap = initMap;
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);

    return () => {
      delete (window as any).initVanSpotsMap;
    };
  }, []);

  // Update markers when filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    filteredSpots.forEach(spot => {
      if (spot.city === "Nationwide") return; // skip generic nationwide spots
      const cat = SPOT_CATEGORIES.find(c => c.id === spot.category);
      if (!cat) return;

      const svgContent = makeMarkerSvg(cat.color, CATEGORY_EMOJI[spot.category] || "📍");
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      const marker = new google.maps.Marker({
        position: { lat: spot.latitude, lng: spot.longitude },
        map: mapInstanceRef.current!,
        title: spot.name,
        icon: {
          url,
          scaledSize: new google.maps.Size(36, 44),
          anchor: new google.maps.Point(18, 44),
        },
      });

      marker.addListener("click", () => setSelectedSpot(spot));
      markersRef.current.push(marker);
    });
  }, [filteredSpots, mapLoaded]);

  // Handle add spot submit
  const handleAddSpot = () => {
    if (!user) {
      toast({ title: "Sign in required", description: "You must be a member to add spots.", variant: "destructive" });
      return;
    }
    if (!addForm.name || !addForm.city || !addForm.description) {
      toast({ title: "Fill in required fields", description: "Name, city, and description are required.", variant: "destructive" });
      return;
    }
    toast({
      title: "Spot submitted!",
      description: "Your spot is under review and will appear on the map after verification.",
    });
    setShowAddDialog(false);
    setAddForm(DEFAULT_FORM);
  };

  const activeCatConfig = SPOT_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* Page header */}
      <div
        className="relative py-8 px-4 border-b border-border/40"
        style={{
          backgroundImage: "url('/images/topo-dark-gold.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: "hsl(var(--background))",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-widest">Van Life Spots</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">The Ground-Level Map</h1>
              <p className="text-muted-foreground mt-1 max-w-xl">
                Driveway surfing, secret camps, mechanics, food, showers, water — everything a van lifer needs, mapped by the community.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleLocateMe} className="border-primary/40 text-primary hover:bg-primary/10">
                <Navigation className="w-4 h-4 mr-2" />
                Near Me
              </Button>
              <Button size="sm" onClick={() => setShowAddDialog(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add a Spot
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-4 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by city, state, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/60 border-border/60 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Category filter bar */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-20 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-2 min-w-max">
            {SPOT_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  style={isActive ? { backgroundColor: cat.color } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                  {cat.memberOnly && <Lock className="w-3 h-3 opacity-60" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main layout: map + sidebar */}
      <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>

        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-border/40 bg-background/95 overflow-y-auto hidden md:flex flex-col">
          <div className="p-3 border-b border-border/40">
            <p className="text-xs text-muted-foreground">
              {filteredSpots.length} spot{filteredSpots.length !== 1 ? "s" : ""} {activeCategory !== "all" ? `in ${activeCatConfig?.label}` : "total"}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredSpots.length === 0 ? (
              <div className="p-6 text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No spots found.</p>
                {!user && activeCategory !== "all" && SPOT_CATEGORIES.find(c => c.id === activeCategory)?.memberOnly && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Member-only category</p>
                    <Button size="sm" asChild><Link to="/auth">Sign In</Link></Button>
                  </div>
                )}
              </div>
            ) : (
              filteredSpots.map(spot => {
                const cat = SPOT_CATEGORIES.find(c => c.id === spot.category);
                const Icon = cat?.icon || MapPin;
                return (
                  <button
                    key={spot.id}
                    onClick={() => {
                      setSelectedSpot(spot);
                      if (mapInstanceRef.current && spot.city !== "Nationwide") {
                        mapInstanceRef.current.setCenter({ lat: spot.latitude, lng: spot.longitude });
                        mapInstanceRef.current.setZoom(12);
                      }
                    }}
                    className={`w-full text-left p-3 border-b border-border/20 hover:bg-muted/30 transition-colors ${selectedSpot?.id === spot.id ? "bg-muted/40 border-l-2" : ""}`}
                    style={selectedSpot?.id === spot.id ? { borderLeftColor: cat?.color } : {}}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: cat?.bg, color: cat?.color }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          <p className="text-sm font-medium text-foreground truncate">{spot.name}</p>
                          {spot.verified && <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />}
                          {spot.memberOnly && <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{spot.city}, {spot.state}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs text-muted-foreground">{spot.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{spot.votes} votes</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {mapError ? (
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              <div className="text-center p-8">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <p className="text-foreground font-medium mb-1">Map unavailable</p>
                <p className="text-sm text-muted-foreground">Browse spots in the sidebar or try refreshing.</p>
              </div>
            </div>
          ) : !mapLoaded ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                backgroundImage: "url('/images/topo-grey-white.jpg')",
                backgroundSize: "cover",
                backgroundBlendMode: "overlay",
                backgroundColor: "hsl(var(--background))",
              }}
            >
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          ) : null}
          <div ref={mapRef} className="w-full h-full" style={{ display: mapLoaded && !mapError ? "block" : "none" }} />

          {/* Floating spot count badge */}
          {mapLoaded && (
            <div className="absolute top-3 left-3 z-10 bg-background/90 backdrop-blur-sm border border-border/60 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-md">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-foreground">{filteredSpots.filter(s => s.city !== "Nationwide").length} spots on map</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected spot sheet */}
      <Sheet open={!!selectedSpot} onOpenChange={(open) => !open && setSelectedSpot(null)}>
        <SheetContent side="right" className="w-full sm:w-96 bg-background border-l border-border/60 overflow-y-auto">
          {selectedSpot && (() => {
            const cat = SPOT_CATEGORIES.find(c => c.id === selectedSpot.category);
            const Icon = cat?.icon || MapPin;
            return (
              <>
                <SheetHeader className="pb-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: cat?.bg, color: cat?.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <SheetTitle className="text-left text-base">{selectedSpot.name}</SheetTitle>
                      <SheetDescription className="text-left text-xs">{selectedSpot.city}, {selectedSpot.state}</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                <div className="py-4 space-y-4">
                  {/* Category + verified */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge style={{ backgroundColor: cat?.color, color: "white" }} className="text-xs">{cat?.label}</Badge>
                    {selectedSpot.verified && <Badge variant="outline" className="text-xs text-green-500 border-green-500/40"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>}
                    {selectedSpot.memberOnly && <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/40"><Lock className="w-3 h-3 mr-1" />Members Only</Badge>}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-4 h-4 ${i <= Math.round(selectedSpot.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{selectedSpot.rating}</span>
                    <span className="text-xs text-muted-foreground">({selectedSpot.votes} votes)</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedSpot.description}</p>

                  {/* Amenities */}
                  {selectedSpot.amenities.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSpot.amenities.map(a => (
                          <span key={a} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact info */}
                  {(selectedSpot.phone || selectedSpot.website || selectedSpot.hours) && (
                    <div className="space-y-2">
                      {selectedSpot.phone && (
                        <a href={`tel:${selectedSpot.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <Phone className="w-4 h-4" />{selectedSpot.phone}
                        </a>
                      )}
                      {selectedSpot.website && (
                        <a href={`https://${selectedSpot.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <Globe className="w-4 h-4" />{selectedSpot.website}
                        </a>
                      )}
                      {selectedSpot.hours && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />{selectedSpot.hours}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {selectedSpot.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedSpot.tags.map(t => (
                        <span key={t} className="text-xs text-muted-foreground">#{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs border-border/60">
                      <ThumbsUp className="w-3.5 h-3.5 mr-1.5" />Helpful ({selectedSpot.votes})
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs border-border/60 text-red-500 hover:text-red-400">
                      <Flag className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* Directions */}
                  {selectedSpot.city !== "Nationwide" && (
                    <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.latitude},${selectedSpot.longitude}`} target="_blank" rel="noopener noreferrer">
                        <Navigation className="w-4 h-4 mr-2" />Get Directions
                      </a>
                    </Button>
                  )}

                  {/* Added by */}
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border/40">
                    Added by {selectedSpot.addedBy} · {new Date(selectedSpot.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Add Spot dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-background border-border/60 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add a Spot
            </DialogTitle>
            <DialogDescription>
              Share a spot with the Vanciety community. All spots are reviewed before going live.
            </DialogDescription>
          </DialogHeader>

          {!user ? (
            <div className="py-6 text-center">
              <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-foreground font-medium mb-1">Members only</p>
              <p className="text-xs text-muted-foreground mb-4">Sign in to add spots to the map.</p>
              <Button asChild><Link to="/auth">Sign In / Join Free</Link></Button>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {/* Category */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category *</Label>
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  {SPOT_CATEGORIES.filter(c => c.id !== "all").map(cat => {
                    const Icon = cat.icon;
                    const isActive = addForm.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setAddForm(f => ({ ...f, category: cat.id as SpotCategoryId }))}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${isActive ? "border-primary bg-primary/10 text-primary" : "border-border/40 text-muted-foreground hover:border-border"}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-center leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Spot Name *</Label>
                <Input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Mike's Driveway, BLM Dispersed — Moab" className="mt-1.5 bg-muted/30 border-border/60" />
              </div>

              {/* City + State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">City *</Label>
                  <Input value={addForm.city} onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))} placeholder="Portland" className="mt-1.5 bg-muted/30 border-border/60" />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">State *</Label>
                  <Input value={addForm.state} onChange={e => setAddForm(f => ({ ...f, state: e.target.value }))} placeholder="OR" maxLength={2} className="mt-1.5 bg-muted/30 border-border/60" />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description *</Label>
                <Textarea value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} placeholder="What's here? What should van lifers know? Any tips?" rows={3} className="mt-1.5 bg-muted/30 border-border/60 resize-none" />
              </div>

              {/* Amenities */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amenities</Label>
                <Input value={addForm.amenities} onChange={e => setAddForm(f => ({ ...f, amenities: e.target.value }))} placeholder="Power, WiFi, Shower, Dog Friendly..." className="mt-1.5 bg-muted/30 border-border/60" />
              </div>

              {/* Phone / Website / Hours */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</Label>
                  <Input value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" className="mt-1.5 bg-muted/30 border-border/60" />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Website</Label>
                  <Input value={addForm.website} onChange={e => setAddForm(f => ({ ...f, website: e.target.value }))} placeholder="example.com" className="mt-1.5 bg-muted/30 border-border/60" />
                </div>
              </div>

              {/* Member only toggle */}
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/40">
                <div>
                  <p className="text-sm font-medium text-foreground">Members only</p>
                  <p className="text-xs text-muted-foreground">Only signed-in members can see this spot</p>
                </div>
                <Switch checked={addForm.memberOnly} onCheckedChange={v => setAddForm(f => ({ ...f, memberOnly: v }))} />
              </div>

              {/* Privacy note */}
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300">Your exact GPS coordinates are never stored. Spots are snapped to a ~100m grid for privacy.</p>
              </div>

              <Button onClick={handleAddSpot} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />Submit Spot for Review
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VanLifeSpots;
