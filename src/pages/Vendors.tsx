import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search, Filter, MapPin, Globe, ShoppingBag, ExternalLink,
  Verified, Wrench, Zap, Truck, Star, Camera, Compass,
  Package, Link2, Users, Tent, Hammer, ShoppingCart,
  ArrowRight, Sparkles, Plus, Eye, Phone
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import AIVanConcierge from "@/components/AIVanConcierge";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";

// ── All Van Life Categories ──────────────────────────────────
const VENDOR_CATEGORIES = [
  { id: "all",            name: "All Vendors",          icon: ShoppingBag, color: "bg-primary" },
  { id: "builders",       name: "Van Builders",         icon: Hammer,      color: "bg-primary" },
  { id: "manufacturers",  name: "Manufacturers",        icon: Truck,       color: "bg-primary" },
  { id: "parts",          name: "Parts & Components",   icon: Wrench,      color: "bg-primary" },
  { id: "electrical",     name: "Electrical & Solar",   icon: Zap,         color: "bg-primary" },
  { id: "tours",          name: "Tours & Experiences",  icon: Compass,     color: "bg-primary" },
  { id: "rentals",        name: "Van Rentals",          icon: Tent,        color: "bg-primary" },
  { id: "gear",           name: "Accessories & Gear",   icon: Package,     color: "bg-primary" },
  { id: "services",       name: "Services",             icon: Star,        color: "bg-primary" },
  { id: "affiliate",      name: "Top Picks (Affiliate)",icon: Link2,       color: "bg-primary" },
  { id: "dealerships",    name: "Dealerships",          icon: ShoppingCart, color: "bg-primary" },
];

// ── Seed vendors (shown until DB has real data) ──────────────
const SEED_VENDORS = [
  {
    id: "seed-1", business_name: "Vancraft Customs", category: "builders",
    description: "Full custom Sprinter & Transit conversions. Off-grid solar, plumbing, and luxury interiors.",
    location: "Portland, OR", website_url: "https://vancraftcustoms.com",
    logo_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop&auto=format",
    banner_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=200&fit=crop&auto=format",
    images: [], services: ["Custom Builds", "Solar Install", "Plumbing"],
    rating: 4.9, reviews_count: 127, verified: true, featured: true, status: "active",
  },
  {
    id: "seed-2", business_name: "Winnebago", category: "manufacturers",
    description: "Iconic American RV & camper van manufacturer. Revel, Solis, and Ekko models.",
    location: "Forest City, IA", website_url: "https://www.winnebago.com",
    logo_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop&auto=format",
    banner_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=200&fit=crop&auto=format",
    images: [], services: ["Class B Vans", "Adventure Vehicles"],
    rating: 4.7, reviews_count: 892, verified: true, featured: true, status: "active",
  },
  {
    id: "seed-3", business_name: "Victron Energy", category: "electrical",
    description: "Premium solar charge controllers, inverters, and battery monitors for off-grid living.",
    location: "Global", website_url: "https://www.victronenergy.com",
    logo_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=80&h=80&fit=crop&auto=format",
    banner_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=200&fit=crop&auto=format",
    images: [], services: ["Solar Controllers", "Inverters", "Battery Monitors"],
    rating: 4.8, reviews_count: 2341, verified: true, featured: true, status: "active",
  },
  {
    id: "seed-4", business_name: "Escape Campervans", category: "rentals",
    description: "Colorful campervan rentals across the US. Pick up and drop off at major cities.",
    location: "Multiple US Locations", website_url: "https://www.escapecampervans.com",
    logo_url: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=80&h=80&fit=crop&auto=format",
    banner_url: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&h=200&fit=crop&auto=format",
    images: [], services: ["Van Rentals", "One-Way Trips", "Festival Vans"],
    rating: 4.5, reviews_count: 3200, verified: true, featured: false, status: "active",
  },
  {
    id: "seed-5", business_name: "Overland Expo", category: "tours",
    description: "Premier overland and van life events with classes, demos, and community gathering.",
    location: "Nationwide", website_url: "https://www.overlandexpo.com",
    logo_url: "https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b?w=80&h=80&fit=crop&auto=format",
    banner_url: "https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b?w=600&h=200&fit=crop&auto=format",
    images: [], services: ["Events", "Classes", "Community"],
    rating: 4.6, reviews_count: 1500, verified: true, featured: false, status: "active",
  },
  {
    id: "seed-6", business_name: "Amazon Van Life Essentials", category: "affiliate",
    description: "Curated van life gear, solar panels, kitchen setups, and must-have accessories — all available on Amazon.",
    location: "Online", website_url: "https://amazon.com",
    logo_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=80&h=80&fit=crop&auto=format",
    banner_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=200&fit=crop&auto=format",
    images: [], services: ["Solar Panels", "Kitchen Gear", "Storage", "Bedding"],
    rating: 4.4, reviews_count: 50000, verified: true, featured: true, status: "active",
  },
];

type Vendor = typeof SEED_VENDORS[number];

const Vendors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [vendors, setVendors] = useState<Vendor[]>(SEED_VENDORS);
  const [loading, setLoading] = useState(true);

  // Try loading from Supabase, fall back to seed data
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const { data, error } = await supabase
          .from("vendors")
          .select("*")
          .eq("status", "active")
          .order("featured", { ascending: false })
          .order("rating", { ascending: false });

        if (!error && data && data.length > 0) {
          setVendors(data.map((v: any) => ({
            ...v,
            services: v.services || [],
            images: v.images || [],
          })));
        }
        // If no data or error, keep seed vendors
      } catch {
        // Keep seed data on error
      } finally {
        setLoading(false);
      }
    };
    loadVendors();
  }, []);

  // Track vendor views
  const trackView = async (vendorId: string) => {
    try {
      await supabase.from("vendor_analytics").insert({
        vendor_id: vendorId,
        event_type: "view",
      });
    } catch {
      // Silent fail for analytics
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: vendors.length };
    vendors.forEach((v) => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        [vendor.business_name, vendor.category, vendor.location, vendor.description, ...(vendor.services || [])]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [vendors, selectedCategory, searchQuery]);

  const getCategoryIcon = (categoryId: string) => {
    const cat = VENDOR_CATEGORIES.find((c) => c.id === categoryId);
    return cat ? cat.icon : ShoppingBag;
  };

  const getCategoryColor = (categoryId: string) => {
    const cat = VENDOR_CATEGORIES.find((c) => c.id === categoryId);
    return cat ? cat.color : "bg-gray-500";
  };

  const getCategoryLabel = (categoryId: string) => {
    const cat = VENDOR_CATEGORIES.find((c) => c.id === categoryId);
    return cat ? cat.name : categoryId;
  };

  return (
    <div className="vanciety-page vanciety-page--vendors min-h-screen bg-background">
      <Seo
        title="Vanciety Vendors | Builders, Installers, Parts, and Van Services"
        description="Browse Vanciety vendors for van builders, electrical installers, parts suppliers, tours, rentals, and trusted services."
        canonicalPath="/vendors"
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Vanciety Vendor Directory",
          itemListElement: vendors.slice(0, 12).map((vendor, index) => ({
            "@type": "LocalBusiness",
            position: index + 1,
            name: vendor.business_name,
            description: vendor.description,
            url: vendor.website_url || "https://vanciety.com/vendors",
            areaServed: vendor.location,
          })),
        }}
      />
      <Header />

      <main className="pt-16">
        {/* ── Hero Section ───────────────────────────────────── */}
        <PageHero
          label="Vendor Directory"
          title="Find Your Build Partners"
          subtitle="Builders, manufacturers, parts suppliers, tours, rentals, gear — every vendor the van life community trusts, in one directory."
          icon={ShoppingBag}
        />
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">

            {/* ── Vendor Signup CTA ─────────────────────────── */}
            <div className="max-w-2xl mx-auto mb-10">
              <Card className="border-2 border-primary/30 bg-primary/5">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold mb-1">Are you a vendor?</h3>
                    <p className="text-sm text-muted-foreground">
                      List your business, upload photos & videos, and reach the van life community.
                      Free to start.
                    </p>
                  </div>
                  <Button asChild variant="hero" size="lg" className="whitespace-nowrap">
                    <Link to="/vendor-signup">
                      <Plus className="w-4 h-4 mr-2" />
                      List Your Business
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* ── Search & Filters ─────────────────────────── */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors, services, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button asChild variant="hero" className="flex items-center gap-2">
                  <Link to="/vendor-signup">
                    <Plus className="w-4 h-4" />
                    Add Your Business
                  </Link>
                </Button>
              </div>

              {/* ── Category Pills ─────────────────────────── */}
              <div className="flex flex-wrap gap-2 justify-center">
                {VENDOR_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const count = categoryCounts[category.id] || 0;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "hero" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                      <span className="text-xs opacity-75">({count})</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── AI Concierge ────────────────────────────────── */}
        <section className="container mx-auto px-4 py-4">
          <AIVanConcierge mode="mechanic" compact />
        </section>

        {/* ── Featured Vendors ────────────────────────────── */}
        {selectedCategory === "all" && filteredVendors.some((v) => v.featured) && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-primary" />
                Featured Vendors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors
                  .filter((v) => v.featured)
                  .map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      getCategoryLabel={getCategoryLabel}
                      getCategoryColor={getCategoryColor}
                      getCategoryIcon={getCategoryIcon}
                      onView={() => trackView(vendor.id)}
                      featured
                    />
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* ── All Vendors Grid ────────────────────────────── */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6 rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Before you book:</strong> Open the business site for current
              services, location, contact options, availability, and warranty details.
            </div>

            <h2 className="text-2xl font-bold mb-6">
              {selectedCategory === "all"
                ? `All Vendors (${filteredVendors.length})`
                : `${getCategoryLabel(selectedCategory)} (${filteredVendors.length})`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  getCategoryLabel={getCategoryLabel}
                  getCategoryColor={getCategoryColor}
                  getCategoryIcon={getCategoryIcon}
                  onView={() => trackView(vendor.id)}
                />
              ))}
            </div>

            {filteredVendors.length === 0 && (
              <div className="text-center py-16 rounded-2xl border bg-card mt-4">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No vendors in this category yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to list your business!</p>
                <Button asChild variant="hero">
                  <Link to="/vendor-signup">
                    <Plus className="w-4 h-4 mr-2" />
                    List Your Business
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* ── Bottom CTA ──────────────────────────────────── */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Vanciety Vendor Network</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Whether you build vans, sell parts, run tours, or have the perfect gear recommendation —
              list your business and connect with thousands of van lifers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/vendor-signup">
                  <Plus className="w-5 h-5 mr-2" />
                  List Your Business — Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/vendor-signup#pricing">
                  See Pricing Plans
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// ── Vendor Card Component ──────────────────────────────────
interface VendorCardProps {
  vendor: Vendor;
  getCategoryLabel: (id: string) => string;
  getCategoryColor: (id: string) => string;
  getCategoryIcon: (id: string) => React.ComponentType<any>;
  onView: () => void;
  featured?: boolean;
}

const VendorCard = ({ vendor, getCategoryLabel, getCategoryColor, getCategoryIcon, onView, featured }: VendorCardProps) => {
  const CategoryIcon = getCategoryIcon(vendor.category);

  return (
    <Card
      className={`group hover:shadow-glow transition-all duration-300 overflow-hidden ${
        featured ? "border-primary/40 ring-1 ring-primary/20" : ""
      }`}
    >
      {/* Card header — real image or gradient fallback */}
      <div className={`relative h-40 overflow-hidden ${(vendor as any).banner_url ? '' : getCategoryColor(vendor.category) + ' bg-opacity-90'}`}>
        {(vendor as any).banner_url ? (
          <img
            src={(vendor as any).banner_url}
            alt={vendor.business_name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {vendor.logo_url && !(vendor as any).banner_url && (
          <img src={vendor.logo_url} alt={vendor.business_name} className="absolute bottom-4 left-4 w-16 h-16 rounded-xl bg-white p-1 object-contain" />
        )}
        {!(vendor as any).banner_url && !vendor.logo_url && (
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-xl bg-white/90 flex items-center justify-center">
            <CategoryIcon className="w-8 h-8 text-gray-700" />
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          {featured && (
            <Badge className="bg-primary text-primary-foreground">
              <Star className="w-3 h-3 mr-1" /> Featured
            </Badge>
          )}
          {vendor.verified && (
            <Badge className="bg-secondary text-secondary-foreground">
              <Verified className="w-3 h-3 mr-1" /> Verified
            </Badge>
          )}
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="text-xs">
            {getCategoryLabel(vendor.category)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="mb-3">
          <CardTitle className="text-lg mb-1">{vendor.business_name}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            {vendor.location || "Location not set"}
          </div>
        </div>

        <CardDescription className="text-sm mb-4 line-clamp-2">{vendor.description}</CardDescription>

        {/* Services Tags */}
        {vendor.services && vendor.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {vendor.services.slice(0, 4).map((service: string) => (
              <Badge key={service} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
            {vendor.services.length > 4 && (
              <Badge variant="outline" className="text-xs">+{vendor.services.length - 4} more</Badge>
            )}
          </div>
        )}

        {/* Rating */}
        {vendor.rating && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="font-semibold">{vendor.rating}</span>
            </div>
            <span className="text-muted-foreground">
              ({vendor.reviews_count?.toLocaleString()} reviews)
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-col sm:flex-row">
          {vendor.website_url && (
            <Button
              asChild
              variant="hero"
              className="flex-1"
              onClick={onView}
            >
              <a href={vendor.website_url} target="_blank" rel="noreferrer">
                <Globe className="w-4 h-4 mr-2" />
                Visit Site
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </a>
            </Button>
          )}
          {(vendor as any).contact_phone && (
            <Button asChild variant="outline" className="flex-1 sm:flex-none">
              <a href={`tel:${(vendor as any).contact_phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Call
              </a>
            </Button>
          )}
          <Button variant="outline" size="icon" title="View details" className="sm:flex-none">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Vendors;
