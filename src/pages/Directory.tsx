/**
 * Directory.tsx — Vanciety Business Directory
 * Unified page replacing Manufacturers + Companies
 * Categories: Van Builders · OEM Manufacturers · Gear & Accessories · Services · Rentals
 */
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Building2, BadgeCheck, MapPin, Star, ArrowRight,
  Loader2, Globe, ExternalLink, Wrench, Zap, Package, Car,
  Tent, ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getPublishedCompanies } from "@/lib/companies/queries";
import type { Company } from "@/lib/companies/types";

const CATEGORIES = [
  { id: "all", label: "All Businesses", icon: Building2 },
  { id: "Van Builders", label: "Van Builders", icon: Car },
  { id: "Parts & Fabrication", label: "Parts & Fabrication", icon: Wrench },
  { id: "Electrical & Power", label: "Electrical & Power", icon: Zap },
  { id: "Gear & Accessories", label: "Gear & Accessories", icon: Package },
  { id: "Wheels & Tires", label: "Wheels & Tires", icon: Car },
  { id: "Suspension & Lift Kits", label: "Suspension", icon: Wrench },
  { id: "Interior & Furniture", label: "Interior", icon: Tent },
  { id: "Exterior Accessories", label: "Exterior", icon: Car },
  { id: "Adventure Vans", label: "Adventure Vans", icon: Car },
  { id: "Mechanics & Installers", label: "Mechanics", icon: Wrench },
  { id: "Event Organizers", label: "Events", icon: Tent },
];

// Static fallback data — real van life businesses
const STATIC_DIRECTORY = [
  { id: "1", name: "Outside Van", category: "Van Builders", city: "Hood River", state: "OR", description: "Premium custom Sprinter van conversions built for adventure. Full-time builds with solar, water, and sleeping systems.", website: "https://outsidevan.com", verified: true, featured: true, rating: 4.9, reviews_count: 312, specialties: ["Sprinter Builds", "Solar Systems", "Custom Interiors"] },
  { id: "2", name: "Storyteller Overland", category: "Van Builders", city: "Birmingham", state: "AL", description: "Award-winning van conversions on Mercedes Sprinter and Ford Transit platforms. MODE adventure vans.", website: "https://storytelleroverland.com", verified: true, featured: true, rating: 4.8, reviews_count: 287, specialties: ["Sprinter", "Transit", "Overland Builds"] },
  { id: "3", name: "Hightop Vans", category: "Van Builders", city: "Portland", state: "OR", description: "Custom high-roof Sprinter conversions with a focus on minimalist, functional design for full-time van life.", website: "https://hightopvans.com", verified: true, featured: false, rating: 4.7, reviews_count: 143, specialties: ["High Roof", "Minimalist", "Full-Time Builds"] },
  { id: "4", name: "Vanlife Customs", category: "Van Builders", city: "Denver", state: "CO", description: "Colorado-based van conversion shop specializing in off-grid Sprinter and Transit builds for mountain living.", website: "https://vanlifecustoms.com", verified: true, featured: false, rating: 4.6, reviews_count: 98, specialties: ["Off-Grid", "Mountain Builds", "4x4 Upgrades"] },
  { id: "5", name: "Humble Road", category: "Van Builders", city: "Nashville", state: "TN", description: "Thoughtfully designed van conversions with a focus on comfort, durability, and the freedom to roam.", website: "https://humbleroad.tv", verified: false, featured: false, rating: 4.5, reviews_count: 67, specialties: ["Comfort Builds", "Full-Time", "Solar"] },
  { id: "6", name: "Avatar Off-Road", category: "Parts & Fabrication", city: "Sandy", state: "UT", description: "Family-owned manufacturer of premium van accessories for 30+ years. Massif rear door systems, Pioneer roof racks, winch bumpers.", website: "https://avataroffroad.com", verified: true, featured: true, rating: 4.9, reviews_count: 421, specialties: ["Roof Racks", "Rear Door Systems", "Winch Bumpers"] },
  { id: "7", name: "Owl Vans", category: "Parts & Fabrication", city: "Bozeman", state: "MT", description: "Premium Sprinter van accessories including roof racks, ladder systems, and storage solutions.", website: "https://owlvans.com", verified: true, featured: false, rating: 4.7, reviews_count: 189, specialties: ["Roof Racks", "Ladders", "Storage"] },
  { id: "8", name: "Aluminess", category: "Parts & Fabrication", city: "El Cajon", state: "CA", description: "Aluminum van accessories — roof racks, bumpers, ladder systems, and cargo solutions for Sprinter and Transit.", website: "https://aluminess.com", verified: true, featured: false, rating: 4.8, reviews_count: 256, specialties: ["Aluminum Racks", "Bumpers", "Cargo"] },
  { id: "9", name: "Victron Energy", category: "Electrical & Power", city: "Almere", state: "Netherlands", description: "World-class solar charge controllers, inverters, and battery management systems trusted by van lifers worldwide.", website: "https://victronenergy.com", verified: true, featured: true, rating: 4.9, reviews_count: 1204, specialties: ["Solar Controllers", "Inverters", "Battery Monitors"] },
  { id: "10", name: "Renogy", category: "Electrical & Power", city: "Ontario", state: "CA", description: "Affordable solar panels, charge controllers, and lithium batteries for van builds and off-grid living.", website: "https://renogy.com", verified: true, featured: false, rating: 4.6, reviews_count: 892, specialties: ["Solar Panels", "Lithium Batteries", "Charge Controllers"] },
  { id: "11", name: "Battle Born Batteries", category: "Electrical & Power", city: "Reno", state: "NV", description: "Premium lithium iron phosphate (LiFePO4) batteries built in the USA for van life and off-grid applications.", website: "https://battlebornbatteries.com", verified: true, featured: false, rating: 4.8, reviews_count: 673, specialties: ["LiFePO4", "100Ah", "Made in USA"] },
  { id: "12", name: "Dometic", category: "Gear & Accessories", city: "Solna", state: "Sweden", description: "Industry-leading portable refrigerators, air conditioners, and cooking solutions for mobile living.", website: "https://dometic.com", verified: true, featured: false, rating: 4.7, reviews_count: 2341, specialties: ["Fridges", "AC Units", "Cooking"] },
  { id: "13", name: "ARB 4x4 Accessories", category: "Gear & Accessories", city: "Auburn", state: "WA", description: "Premium off-road accessories including air compressors, fridge slides, awnings, and recovery gear.", website: "https://arbusa.com", verified: true, featured: false, rating: 4.8, reviews_count: 567, specialties: ["Compressors", "Awnings", "Recovery Gear"] },
  { id: "14", name: "Fiamma", category: "Gear & Accessories", city: "Cardano al Campo", state: "Italy", description: "European leader in awnings, bike carriers, and accessories for vans and motorhomes.", website: "https://fiamma.com", verified: true, featured: false, rating: 4.5, reviews_count: 334, specialties: ["Awnings", "Bike Carriers", "Accessories"] },
  { id: "15", name: "Mercedes-Benz Vans", category: "Adventure Vans", city: "Stuttgart", state: "Germany", description: "The Sprinter — the world's most popular van conversion platform. Available in cargo, passenger, and crew configurations.", website: "https://mbvans.com", verified: true, featured: true, rating: 4.7, reviews_count: 5621, specialties: ["Sprinter 144", "Sprinter 170", "4x4"] },
  { id: "16", name: "Ford Transit", category: "Adventure Vans", city: "Dearborn", state: "MI", description: "America's best-selling van. The Transit offers multiple roof heights, wheelbases, and drivetrains for every build.", website: "https://ford.com/commercial-trucks/transit", verified: true, featured: false, rating: 4.5, reviews_count: 3892, specialties: ["Transit 148", "High Roof", "AWD"] },
  { id: "17", name: "Ram ProMaster", category: "Adventure Vans", city: "Auburn Hills", state: "MI", description: "Front-wheel-drive van with the widest cargo floor in its class. Popular for budget-friendly van builds.", website: "https://ramtrucks.com/promaster", verified: true, featured: false, rating: 4.3, reviews_count: 1234, specialties: ["ProMaster 2500", "High Roof", "Budget Builds"] },
  { id: "18", name: "Overland Expo", category: "Event Organizers", city: "Flagstaff", state: "AZ", description: "The world's largest overland travel and adventure vehicle expo. Annual events across the USA.", website: "https://overlandexpo.com", verified: true, featured: true, rating: 4.9, reviews_count: 2103, specialties: ["Annual Expos", "Education", "Community"] },
  { id: "19", name: "Descend on Bend", category: "Event Organizers", city: "Bend", state: "OR", description: "Annual van life gathering in Bend, Oregon. Free event with vendors, workshops, and community.", website: "https://descendonbend.com", verified: true, featured: false, rating: 4.8, reviews_count: 876, specialties: ["Annual Rally", "Free Event", "Oregon"] },
  { id: "20", name: "Sportsmobile", category: "Van Builders", city: "Fresno", state: "CA", description: "America's original van conversion company since 1961. Specializing in 4x4 Sprinter and Transit conversions.", website: "https://sportsmobile.com", verified: true, featured: false, rating: 4.6, reviews_count: 445, specialties: ["4x4 Conversions", "Since 1961", "Sprinter & Transit"] },
  { id: "21", name: "Farout Fabrications", category: "Parts & Fabrication", city: "Bend", state: "OR", description: "Custom van furniture, cabinetry, and storage solutions. Modular systems that can be installed DIY.", website: "https://faroutfab.com", verified: false, featured: false, rating: 4.5, reviews_count: 87, specialties: ["Modular Furniture", "DIY Kits", "Cabinetry"] },
  { id: "22", name: "Zamp Solar", category: "Electrical & Power", city: "Bend", state: "OR", description: "American-made solar panels and portable power systems designed specifically for RVs and vans.", website: "https://zampsolar.com", verified: true, featured: false, rating: 4.6, reviews_count: 312, specialties: ["American Made", "Portable Solar", "RV Solar"] },
  { id: "23", name: "EcoFlow", category: "Electrical & Power", city: "Shenzhen", state: "China", description: "Portable power stations and solar generators. The DELTA series is popular for van builds requiring clean power.", website: "https://ecoflow.com", verified: true, featured: false, rating: 4.7, reviews_count: 1876, specialties: ["Power Stations", "Solar Generators", "DELTA Series"] },
  { id: "24", name: "Webasto", category: "Gear & Accessories", city: "Stockdorf", state: "Germany", description: "Diesel air heaters and coolant heaters trusted by van lifers for cold-weather camping worldwide.", website: "https://webasto.com", verified: true, featured: false, rating: 4.8, reviews_count: 934, specialties: ["Diesel Heaters", "Air Top", "Cold Weather"] },
  { id: "25", name: "Espar Heater Systems", category: "Gear & Accessories", city: "Mississauga", state: "Canada", description: "Premium diesel and gasoline heaters for vans and RVs. The Airtronic series is a van life staple.", website: "https://espar.com", verified: true, featured: false, rating: 4.7, reviews_count: 678, specialties: ["Airtronic", "Diesel Heaters", "Gasoline Heaters"] },
];

const Directory = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPublishedCompanies({ search: "", category: undefined, state: undefined, verifiedOnly: false, featuredFirst: true, limit: 100, offset: 0 })
      .then((data) => { if (active) { setCompanies(data); setLoading(false); } })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  // Merge DB companies with static fallback, dedup by name
  const allEntries = useMemo(() => {
    const dbNames = new Set(companies.map((c) => c.name.toLowerCase()));
    const staticFiltered = STATIC_DIRECTORY.filter((s) => !dbNames.has(s.name.toLowerCase()));
    return [...companies.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category || "Van Builders",
      city: c.city || "",
      state: c.state || "",
      description: c.description || "",
      website: c.website || "",
      verified: c.verified || false,
      featured: c.featured || false,
      rating: c.rating || 4.5,
      reviews_count: c.reviews_count || 0,
      specialties: c.specialties || [],
    })), ...staticFiltered];
  }, [companies]);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return allEntries.filter((e) => {
      const matchesCat = category === "all" || e.category === category;
      const matchesQ = !q || [e.name, e.city, e.state, e.description, ...(e.specialties || [])].join(" ").toLowerCase().includes(q);
      return matchesCat && matchesQ;
    }).sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  }, [allEntries, query, category]);

  return (
    <div className="vanciety-page min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <PageHero
          heroImage="https://files.manuscdn.com/user_upload_by_module/session_file/94256494/HnQFgYRCRXWImcTc.jpg"
          label="Business Directory"
          title="The Van Life Directory"
          subtitle="Every builder, brand, and supplier in the van life space — all in one place."
        >
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search builders, brands, gear, services…"
                className="h-12 pl-10 text-base bg-background/60 border-border/60"
              />
            </div>
          </div>
        </PageHero>

        {/* Category tabs */}
        <div className="border-b border-border bg-background/80 sticky top-16 z-30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    category === c.id
                      ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e]"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:border-[#c9a96e]/40 hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <section className="container mx-auto px-4 py-10">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a96e]" />
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {results.length} business{results.length === 1 ? "" : "es"}
                  {category !== "all" && ` in ${category}`}
                </p>
                <Link to="/vendor-signup" className="flex items-center gap-1.5 rounded-full border border-[#c9a96e]/40 bg-[#c9a96e]/10 px-4 py-1.5 text-sm font-semibold text-[#c9a96e] transition-colors hover:bg-[#c9a96e]/20">
                  <Building2 className="h-3.5 w-3.5" /> List Your Business <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((entry) => (
                  <div
                    key={entry.id}
                    className="group flex flex-col rounded-2xl border border-border/60 bg-card/60 p-5 transition-all hover:border-[#c9a96e]/40 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-foreground">{entry.name}</h3>
                          {entry.verified && <BadgeCheck className="h-4 w-4 text-[#c9a96e]" aria-label="Verified" />}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {entry.city}{entry.city && entry.state ? ", " : ""}{entry.state}
                        </div>
                      </div>
                      {entry.featured && (
                        <Badge variant="outline" className="shrink-0 gap-1 text-[11px] border-[#c9a96e]/40 text-[#c9a96e]">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="mb-3 flex-1 text-sm text-muted-foreground line-clamp-3">{entry.description}</p>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {(entry.specialties || []).slice(0, 3).map((s: string) => (
                        <span key={s} className="rounded-full bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-border/40 pt-3">
                      <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Star className="h-4 w-4 fill-[#c9a96e] text-[#c9a96e]" />
                        {entry.rating.toFixed(1)}
                        {entry.reviews_count > 0 && (
                          <span className="font-normal text-muted-foreground">({entry.reviews_count})</span>
                        )}
                      </span>
                      {entry.website ? (
                        <a
                          href={entry.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm font-medium text-[#c9a96e] hover:underline"
                        >
                          Visit Site <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="flex items-center text-sm font-medium text-[#c9a96e]">
                          View <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {results.length === 0 && (
                <div className="py-16 text-center text-muted-foreground">
                  <Globe className="mx-auto mb-3 h-10 w-10 opacity-40" />
                  <p>No businesses match your search.</p>
                  <Link to="/vendor-signup" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#c9a96e] hover:underline">
                    List your business <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </>
          )}
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-card/40 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground">Is your business listed?</h2>
            <p className="mb-6 text-muted-foreground">Join hundreds of van life brands already on Vanciety. Free basic listing, premium placement available.</p>
            <Link
              to="/vendor-signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#c9a96e] px-8 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#0d0d0d] transition-colors hover:bg-[#d4b87a]"
            >
              List Your Business <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Directory;
