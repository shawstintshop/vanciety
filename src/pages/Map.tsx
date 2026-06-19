import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, MapPin, Navigation, Users, Calendar, Star,
  Locate, Share2, Eye, EyeOff, Sparkles, Truck, Filter,
  ChevronDown, ChevronUp, X, Compass, Tent, Wrench
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { VAN_MARKERS, EVENT_PINS, eventCategoryToMarker } from "@/components/map/VanMarkers";
import EventDetailPanel, { type MapEvent } from "@/components/map/EventDetailPanel";

// ── Demo Data (shown until DB has real events) ───────────────
const DEMO_EVENTS: MapEvent[] = [
  {
    id: "demo-1", name: "Descend on Bend", description: "The Pacific Northwest's biggest van life gathering. 3 days of workshops, van tours, live music, and community. Hundreds of van lifers descend on Bend for this annual tradition. Workshops cover solar, plumbing, insulation, and more. Open van tours let you peek inside dozens of unique builds.",
    short_description: "PNW's biggest van life gathering — workshops, van tours, music",
    start_date: "2026-07-15T10:00:00", end_date: "2026-07-17T18:00:00", city: "Bend", state: "OR",
    venue_name: "Deschutes County Fairgrounds", latitude: 44.0582, longitude: -121.3153,
    category: "gathering", cost_info: "Free", expected_attendance: 2000, rsvp_count: 847,
    tags: ["van life", "camping", "workshops", "community"], contact_name: "Descend on Bend Crew",
  },
  {
    id: "demo-2", name: "Overland Expo West", description: "The premier overland and vehicle-based travel event in North America. Classes, product demos, and the largest gathering of overland vehicles and equipment. Over 400 exhibitors, 300+ classes, and thousands of adventure enthusiasts.",
    short_description: "Premier overland expo — 400+ exhibitors, 300+ classes",
    start_date: "2026-08-22T08:00:00", end_date: "2026-08-24T17:00:00", city: "Flagstaff", state: "AZ",
    venue_name: "Fort Tuthill County Park", latitude: 35.1614, longitude: -111.6822,
    category: "expo", cost_info: "$25-$75", expected_attendance: 15000, rsvp_count: 3421,
    tags: ["overland", "expo", "4x4", "camping"], contact_name: "Overland Expo",
    registration_url: "https://www.overlandexpo.com",
  },
  {
    id: "demo-3", name: "Van Life Rally", description: "Southern California's monthly van life meetup. Potluck dinner, campfire stories, van tours, and good vibes. All builds welcome — Sprinters, Transits, Promasters, school buses, you name it. Dog friendly!",
    short_description: "Monthly SoCal van meetup — potluck, campfire, van tours",
    start_date: "2026-07-05T16:00:00", city: "Joshua Tree", state: "CA",
    venue_name: "BLM Land", latitude: 34.1347, longitude: -116.3131,
    category: "meetup", cost_info: "Free", expected_attendance: 150, rsvp_count: 89,
    tags: ["meetup", "potluck", "dog friendly"],
  },
  {
    id: "demo-4", name: "Midwest Vanlife Fest", description: "The heartland's annual van life festival celebrating the growing community in the Midwest. Featuring build workshops, DIY classes, vendor marketplace, and group camping under the stars.",
    short_description: "Heartland's annual van fest — workshops, vendors, camping",
    start_date: "2026-09-12T10:00:00", end_date: "2026-09-14T12:00:00", city: "Bloomington", state: "IN",
    venue_name: "Lake Monroe", latitude: 39.1653, longitude: -86.5264,
    category: "rally", cost_info: "$20", expected_attendance: 500, rsvp_count: 234,
    tags: ["midwest", "festival", "workshops", "camping"],
  },
  {
    id: "demo-5", name: "Solar Workshop — DIY Install", description: "Hands-on workshop teaching you to design and install a complete solar system for your van. Covers panel sizing, charge controllers, battery banks, wiring, and safety. Bring your van for a real install!",
    short_description: "Hands-on solar install workshop — bring your van!",
    start_date: "2026-07-20T09:00:00", city: "Austin", state: "TX",
    venue_name: "East Austin Makerspace", latitude: 30.2672, longitude: -97.7431,
    category: "workshop", cost_info: "$45", expected_attendance: 30, rsvp_count: 22,
    tags: ["solar", "DIY", "electrical", "workshop"],
  },
  {
    id: "demo-6", name: "New England Van Gathering", description: "Fall foliage and van life — the perfect combo. Join van lifers from across New England for a weekend of leaf peeping, hiking, campfires, and community. Beautiful campsite with lake access.",
    short_description: "Fall foliage van gathering — hiking, campfires, lake access",
    start_date: "2026-10-03T14:00:00", end_date: "2026-10-05T11:00:00", city: "Stowe", state: "VT",
    latitude: 44.4654, longitude: -72.6874,
    category: "gathering", cost_info: "Free", expected_attendance: 200, rsvp_count: 156,
    tags: ["fall foliage", "new england", "camping", "hiking"],
  },
  {
    id: "demo-7", name: "Southeast Van Meetup", description: "Monthly meetup for the growing Southeast van life scene. Beach camping, seafood cookout, and laid-back vibes on the coast. Perfect for snowbirds and full-timers passing through.",
    short_description: "Beach camping meetup — seafood cookout, chill vibes",
    start_date: "2026-08-09T15:00:00", city: "Savannah", state: "GA",
    latitude: 32.0809, longitude: -81.0912,
    category: "meetup", cost_info: "Free", expected_attendance: 75, rsvp_count: 41,
    tags: ["beach", "seafood", "southeast"],
  },
  {
    id: "demo-8", name: "Rocky Mountain Rendezvous", description: "High altitude van life gathering in the Colorado Rockies. Challenging 4x4 trails, mountain biking, fishing, and stargazing at 9,000 feet. Van build showcase with prizes for Best Build, Most Creative, and Best Budget Build.",
    short_description: "High-altitude gathering — 4x4 trails, build showcase, stargazing",
    start_date: "2026-08-01T10:00:00", end_date: "2026-08-03T14:00:00", city: "Buena Vista", state: "CO",
    latitude: 38.8422, longitude: -106.1311,
    category: "rally", cost_info: "$30", expected_attendance: 350, rsvp_count: 203,
    tags: ["4x4", "mountain", "stargazing", "build showcase"],
  },
];

// Demo van location (your Sprinter at the show)
const DEMO_VAN = {
  id: "demo-van",
  latitude: 45.5152,
  longitude: -122.6784,
  name: "Vanciety HQ 🚐",
  status: "At the Van Show!",
};

// ── Category filter config ──────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All Events", icon: MapPin, color: "text-orange-500" },
  { id: "rally", label: "Rallies", icon: Truck, color: "text-red-500" },
  { id: "expo", label: "Expos", icon: Star, color: "text-blue-500" },
  { id: "meetup", label: "Meetups", icon: Users, color: "text-teal-500" },
  { id: "workshop", label: "Workshops", icon: Wrench, color: "text-yellow-600" },
  { id: "gathering", label: "Gatherings", icon: Tent, color: "text-orange-500" },
];

const Map = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [events, setEvents] = useState<MapEvent[]>(DEMO_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationSharing, setShowLocationSharing] = useState(false);

  // Try loading real events from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "active")
          .gte("start_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order("start_date", { ascending: true });

        if (!error && data && data.length > 0) {
          setEvents(data.map((e: any) => ({
            id: e.id,
            name: e.name,
            description: e.description,
            short_description: e.short_description,
            start_date: e.start_date,
            end_date: e.end_date,
            city: e.city,
            state: e.state,
            venue_name: e.venue_name,
            latitude: parseFloat(e.latitude),
            longitude: parseFloat(e.longitude),
            category: e.category,
            cost_info: e.cost_info,
            registration_url: e.registration_url,
            expected_attendance: e.expected_attendance,
            tags: e.tags,
            contact_name: e.contact_name,
            contact_email: e.contact_email,
            image_url: e.image_url,
          })));
        }
      } catch {
        // Keep demo data
      }
    };
    loadEvents();
  }, []);

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesCat = selectedCategory === "all" || event.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || [event.name, event.city, event.state, event.category, ...(event.tags || [])]
      .join(" ").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [39.5, -98.5], // Center of USA
      zoom: 4,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    // CartoDB Voyager tiles — free, clean, beautiful
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    // Custom zoom control position
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Attribution (required but styled)
    L.control.attribution({ position: "bottomleft", prefix: false })
      .addAttribution('© <a href="https://carto.com">CARTO</a> © <a href="https://osm.org">OSM</a>')
      .addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when events or filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add event markers
    filteredEvents.forEach((event) => {
      if (!event.latitude || !event.longitude) return;

      const markerType = eventCategoryToMarker(event.category);
      const svgHtml = VAN_MARKERS[markerType](36);

      const icon = L.divIcon({
        html: svgHtml,
        className: "vanciety-map-marker",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([event.latitude, event.longitude], { icon })
        .addTo(map)
        .on("click", () => {
          setSelectedEvent(event);
          map.flyTo([event.latitude, event.longitude], Math.max(map.getZoom(), 7), { duration: 0.8 });
        });

      // Tooltip on hover
      marker.bindTooltip(
        `<div style="font-weight:600;font-size:13px">${event.name}</div>
         <div style="font-size:11px;color:#666">${event.city}, ${event.state}</div>
         <div style="font-size:11px;color:#888">${new Date(event.start_date).toLocaleDateString()}</div>`,
        { direction: "top", offset: [0, -10], className: "vanciety-tooltip" }
      );

      markersRef.current.push(marker);
    });

    // Add demo van marker
    const demoVanSvg = VAN_MARKERS.demo(48);
    const demoIcon = L.divIcon({
      html: demoVanSvg,
      className: "vanciety-map-marker vanciety-van-demo",
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    const demoMarker = L.marker([DEMO_VAN.latitude, DEMO_VAN.longitude], { icon: demoIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindTooltip(
        `<div style="font-weight:700;font-size:14px">🚐 ${DEMO_VAN.name}</div>
         <div style="font-size:12px;color:#E8722A;font-weight:600">${DEMO_VAN.status}</div>`,
        { direction: "top", offset: [0, -20], className: "vanciety-tooltip", permanent: false }
      );
    markersRef.current.push(demoMarker);
  }, [filteredEvents]);

  // Fly to user location
  const handleLocateMe = useCallback(() => {
    if (!mapInstanceRef.current) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstanceRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 10, { duration: 1.2 });
        setIsLocating(false);
      },
      () => {
        toast({ title: "Location unavailable", description: "Enable location services to find events near you." });
        setIsLocating(false);
      }
    );
  }, [toast]);

  // Fly to event from sidebar
  const handleEventClick = (event: MapEvent) => {
    setSelectedEvent(event);
    mapInstanceRef.current?.flyTo([event.latitude, event.longitude], Math.max(mapInstanceRef.current.getZoom(), 8), { duration: 0.8 });
  };

  // Category counts
  const catCounts: Record<string, number> = { all: events.length };
  events.forEach((e) => { catCounts[e.category] = (catCounts[e.category] || 0) + 1; });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Full-screen map layout */}
      <div className="flex-1 relative pt-16">
        
        {/* ── Map Container ─────────────────────────────── */}
        <div ref={mapContainerRef} className="absolute inset-0 top-16 z-0" />

        {/* ── Top Bar (floating over map) ────────────────── */}
        <div className="absolute top-20 left-4 right-4 z-[500] pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="bg-background/90 backdrop-blur-xl rounded-2xl shadow-xl border border-border/60 p-3">
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events, cities, or states..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Action buttons */}
                <Button variant="outline" size="sm" onClick={handleLocateMe} disabled={isLocating}>
                  <Locate className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline ml-2">Near Me</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="sm:hidden"
                >
                  {showSidebar ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </Button>
              </div>

              {/* Category filter pills */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const count = catCounts[cat.id] || 0;
                  const active = selectedCategory === cat.id;
                  return (
                    <Button
                      key={cat.id}
                      variant={active ? "hero" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex-shrink-0 text-xs ${active ? "" : "hover:bg-muted"}`}
                    >
                      <Icon className={`w-3.5 h-3.5 mr-1 ${active ? "" : cat.color}`} />
                      {cat.label}
                      <span className="ml-1 opacity-60">({count})</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Event Count Badge (floating) ───────────────── */}
        <div className="absolute bottom-24 left-4 z-[500]">
          <Badge className="bg-background/90 backdrop-blur-xl text-foreground shadow-lg border border-border/60 text-sm px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
            {filteredEvents.length} events across the USA
          </Badge>
        </div>

        {/* ── Sidebar Event List ─────────────────────────── */}
        {showSidebar && (
          <div className="absolute top-44 sm:top-48 bottom-4 right-4 w-80 z-[500] hidden sm:flex flex-col">
            <div className="bg-background/92 backdrop-blur-xl rounded-2xl shadow-xl border border-border/60 overflow-hidden flex flex-col max-h-full">
              <div className="p-3 border-b border-border/40 flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  Upcoming Events
                </h3>
                <Badge variant="secondary" className="text-xs">{filteredEvents.length}</Badge>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {filteredEvents.map((event) => {
                  const isSelected = selectedEvent?.id === event.id;
                  return (
                    <button
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                        isSelected
                          ? "bg-orange-500/10 border border-orange-500/30 ring-1 ring-orange-500/20"
                          : "hover:bg-muted/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl mt-0.5">
                          {{ rally: "🚐", expo: "🎪", meetup: "🤝", workshop: "🔧", gathering: "🏕️" }[event.category] || "📍"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{event.name}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {event.city}, {event.state}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(event.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            {event.cost_info && ` · ${event.cost_info}`}
                          </p>
                          {event.rsvp_count !== undefined && event.rsvp_count > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Users className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">{event.rsvp_count} going</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No events match your search</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Event Detail Panel (slides in from right) ──── */}
        <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />

        {/* ── Location Sharing FAB ────────────────────────── */}
        <div className="absolute bottom-24 right-4 z-[500] flex flex-col gap-3">
          <Button
            variant="hero"
            size="lg"
            className="rounded-full shadow-xl w-14 h-14 p-0"
            onClick={() => {
              if (!user) {
                toast({ title: "Sign in to share location", description: "Create a free account to show your van on the map." });
                navigate("/auth");
                return;
              }
              setShowLocationSharing(!showLocationSharing);
              toast({
                title: showLocationSharing ? "Location sharing off" : "📍 Sharing your location!",
                description: showLocationSharing ? "Your van is hidden from the map." : "Other van lifers can see your van on the map now.",
              });
            }}
            title={showLocationSharing ? "Stop sharing location" : "Share your location"}
          >
            {showLocationSharing ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* ── Custom CSS for map markers ────────────────────── */}
      <style>{`
        .vanciety-map-marker {
          background: none !important;
          border: none !important;
        }
        .vanciety-tooltip {
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 12px !important;
          padding: 8px 12px !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
          font-family: inherit !important;
        }
        .vanciety-tooltip::before {
          border-top-color: hsl(var(--border)) !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:hover {
          background: hsl(var(--muted)) !important;
        }
        .leaflet-control-attribution {
          background: hsl(var(--background) / 0.7) !important;
          backdrop-filter: blur(8px);
          border-radius: 8px !important;
          padding: 2px 8px !important;
          font-size: 10px !important;
          color: hsl(var(--muted-foreground)) !important;
        }
        .leaflet-control-attribution a {
          color: hsl(var(--primary)) !important;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Smooth van marker animation */
        .vanciety-van-demo {
          animation: vanBounce 3s ease-in-out infinite;
        }
        @keyframes vanBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default Map;
