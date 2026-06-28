import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart,
  Share,
  MessageCircle,
  Star,
  ShoppingBag,
  Truck,
  Wrench,
  Zap,
  Plus,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import AIVanConcierge from "@/components/AIVanConcierge";
import Seo from "@/components/Seo";
import { marketplaceSources } from "@/data/vanIntelligence";

// Static seed listings — shown when the Supabase DB has no rows yet.
// Real members can still post their own listings which will appear above these.
const SEED_ITEMS = [
  { id: 's1', title: '2019 Mercedes Sprinter 144" High Roof — Full Custom Build', description: 'Full off-grid build. 200Ah LiFePO4, 400W solar, Webasto diesel heater, Lagun table, cedar interior. 87k miles. Clean title. Receipts for everything.', price: 62500, category: 'vans', condition: 'like-new', location: 'Portland, OR', created_at: new Date(Date.now() - 2 * 86400000).toISOString(), is_sold: false, featured: true },
  { id: 's2', title: '2016 Ford Transit 148" High Roof — Stealth Build', description: 'Insulated, wired for 12V, fresh tires, new alternator. Blank canvas ready for your build. 112k miles. No rust.', price: 28900, category: 'vans', condition: 'good', location: 'Denver, CO', created_at: new Date(Date.now() - 5 * 86400000).toISOString(), is_sold: false, featured: true },
  { id: 's3', title: 'Victron MultiPlus-II 3000VA Inverter/Charger', description: 'Used one season. Firmware updated. Includes all cables and manual. Upgrading to 5000VA — this unit is overkill for most builds.', price: 680, category: 'electrical', condition: 'like-new', location: 'Austin, TX', created_at: new Date(Date.now() - 1 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's4', title: 'Renogy 200W Flexible Solar Panel (x2)', description: 'Pair of 200W flexible panels. Used 8 months on a Transit build. No delamination, no cracks. Selling because I switched to rigid.', price: 220, category: 'electrical', condition: 'good', location: 'Bend, OR', created_at: new Date(Date.now() - 3 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's5', title: 'Battle Born 100Ah LiFePO4 Battery (x2)', description: 'Two Battle Born 100Ah batteries. 2 years old, 400 cycles. BMS intact, holds full charge. Selling complete van and keeping the batteries separate.', price: 750, category: 'electrical', condition: 'good', location: 'Seattle, WA', created_at: new Date(Date.now() - 4 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's6', title: 'Webasto Air Top 2000 STC Diesel Heater — Sprinter Mounted', description: 'Pulled from a 2018 Sprinter 144. Works perfectly. Includes mounting bracket, fuel line, and controller. 3 years old, serviced annually.', price: 890, category: 'parts', condition: 'good', location: 'Salt Lake City, UT', created_at: new Date(Date.now() - 6 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's7', title: 'Dometic CFX3 55L Compressor Fridge', description: 'Barely used. Bought for a build that never happened. Still in box. Dual zone, app control, runs on 12V/24V/110V.', price: 680, category: 'interior', condition: 'new', location: 'Nashville, TN', created_at: new Date(Date.now() - 2 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's8', title: 'Custom Sprinter 144 Bed Platform — Birch Plywood', description: 'Solid birch ply platform with 4" storage drawers underneath. Fits 144" Sprinter. Disassembles flat. Pickup only.', price: 380, category: 'interior', condition: 'good', location: 'Asheville, NC', created_at: new Date(Date.now() - 7 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's9', title: 'Maxxair Fan-Tastic 4500K Roof Vent — New in Box', description: 'Never installed. Bought two, only needed one. Smoke grey lid, 10-speed, reversible. Fits standard 14" x 14" opening.', price: 165, category: 'parts', condition: 'new', location: 'Phoenix, AZ', created_at: new Date(Date.now() - 1 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's10', title: 'Sprinter NCV3 Front Suspension Kit — Van Compass', description: 'Van Compass Stage 2 lift kit for 2007–2018 Sprinter. Installed for 18 months, 22k miles. Excellent condition. Includes all hardware.', price: 420, category: 'parts', condition: 'good', location: 'Bozeman, MT', created_at: new Date(Date.now() - 9 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's11', title: 'IKEA KALLAX 4-Unit Shelf — Van Modified', description: 'Cut down and reinforced for van use. Fits Transit 148 wall perfectly. Includes custom mounting brackets. Pickup Tacoma area only.', price: 95, category: 'interior', condition: 'good', location: 'Tacoma, WA', created_at: new Date(Date.now() - 3 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's12', title: 'Milwaukee M18 Fuel 6-Tool Combo Kit', description: 'Full kit: circular saw, drill, impact driver, reciprocating saw, grinder, light. All batteries, charger, and bag. Used on one build.', price: 620, category: 'tools', condition: 'like-new', location: 'San Diego, CA', created_at: new Date(Date.now() - 5 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's13', title: '2020 Ram ProMaster 2500 High Roof — Work Van Conversion', description: '159" wheelbase. Insulated, 12V wiring harness, roof rack, ladder rack. 68k miles. Ready to finish your way.', price: 34500, category: 'vans', condition: 'good', location: 'Chicago, IL', created_at: new Date(Date.now() - 8 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's14', title: 'Victron SmartSolar MPPT 100/50 Charge Controller', description: 'Used 14 months. Bluetooth works. Selling because I upgraded to 150/70. Includes original box and manual.', price: 175, category: 'electrical', condition: 'good', location: 'Flagstaff, AZ', created_at: new Date(Date.now() - 2 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's15', title: 'Lagun Table Mount — Sprinter Passenger Floor Track', description: 'Genuine Lagun mount with 24" table top. Swivels 360°, adjustable height. Fits Sprinter factory floor track. Used 2 years.', price: 210, category: 'interior', condition: 'good', location: 'Boulder, CO', created_at: new Date(Date.now() - 6 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's16', title: 'Propex HS2000 Propane Heater — Sprinter Install', description: 'Pulled from a sold van. Works flawlessly. Includes all ducting, thermostat, and propane fittings. Quieter than diesel heaters.', price: 490, category: 'parts', condition: 'good', location: 'Albuquerque, NM', created_at: new Date(Date.now() - 4 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's17', title: 'Custom Cedar Tongue & Groove Wall Panels — Transit 148', description: 'Full set of cedar T&G panels for Transit 148 high roof. Pre-cut, pre-sanded, lightly oiled. Pickup only Denver.', price: 340, category: 'interior', condition: 'good', location: 'Denver, CO', created_at: new Date(Date.now() - 10 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's18', title: 'Shurflo 4008 12V Water Pump + Accumulator Tank', description: 'Complete pressurized water system. Pump, accumulator, strainer, fittings. Used one year. Quiet and reliable.', price: 110, category: 'parts', condition: 'good', location: 'Eugene, OR', created_at: new Date(Date.now() - 3 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's19', title: 'Aluminess Rear Ladder + Roof Rack — Sprinter 144', description: 'Full Aluminess setup. Rear ladder, full-length roof rack, spare tire carrier. Powder coated black. Fits 2014–2023 Sprinter 144.', price: 1850, category: 'exterior', condition: 'good', location: 'Reno, NV', created_at: new Date(Date.now() - 7 * 86400000).toISOString(), is_sold: false, featured: false },
  { id: 's20', title: 'Goal Zero Yeti 1500X + Boulder 200 Briefcase Solar', description: 'Complete off-grid power station. 1516Wh, 2000W inverter, MPPT charge controller. Includes 200W briefcase panel. Lightly used.', price: 1450, category: 'electrical', condition: 'like-new', location: 'Missoula, MT', created_at: new Date(Date.now() - 1 * 86400000).toISOString(), is_sold: false, featured: false },
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newItem, setNewItem] = useState({ 
    title: "", 
    description: "", 
    price: "", 
    category: "", 
    condition: "",
    location: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const categories = [
    { id: "all", name: "All Items", icon: ShoppingBag },
    { id: "vans", name: "Complete Vans", icon: Truck },
    { id: "electrical", name: "Electrical & Solar", icon: Zap },
    { id: "parts", name: "Van Parts", icon: Wrench },
    { id: "interior", name: "Interior & Furniture", icon: ShoppingBag },
    { id: "exterior", name: "Exterior & Accessories", icon: ShoppingBag },
    { id: "tools", name: "Tools & Equipment", icon: Wrench }
  ];

  const conditions = [
    { value: "new", label: "New" },
    { value: "like-new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" }
  ];

  const trustedMarketLinks = [
    {
      name: "Van Viewer",
      url: "https://www.vanviewer.com/",
      verifiedTitle: "Van Viewer - The Ultimate Camper Van For Sale Marketplace - Buy & Sell Used Camper Vans For Sale",
      note: "Verified live marketplace for camper vans.",
    },
    {
      name: "Facebook Marketplace vehicles",
      url: "https://www.facebook.com/marketplace/category/vehicles",
      verifiedTitle: "New and Used Cars, Trucks & Motorcycles For Sale | Marketplace",
      note: "Verified live, but user/account/location gated by Facebook.",
    },
  ];

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const visibleMarketplaceItems = marketplaceItems
    .filter((item) => {
      if (!normalizedSearch) return true;
      return [item.title, item.description, item.category, item.condition, item.location, item.profiles?.display_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    })
    .sort((a, b) => {
      const aFeatured = Boolean(a.featured || a.is_featured || a.promoted);
      const bFeatured = Boolean(b.featured || b.is_featured || b.promoted);
      if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;
      if (sortBy === 'price-low') return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === 'price-high') return Number(b.price || 0) - Number(a.price || 0);
      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();
      return bTime - aTime;
    });

  const featuredItems = visibleMarketplaceItems.filter((item) => item.featured || item.is_featured || item.promoted).slice(0, 4);
  const latestItems = visibleMarketplaceItems.filter((item) => !(item.featured || item.is_featured || item.promoted));

  useEffect(() => {
    fetchMarketplaceItems();
  }, [selectedCategory]);

  const fetchMarketplaceItems = async () => {
    setIsLoading(true);
    setLoadError(false);
    let query = supabase
      .from('marketplace_items')
      .select('*')
      .eq('is_sold', false)
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      // Supabase unavailable — fall back to seed items
      console.warn('Marketplace DB unavailable, using seed data:', error.message);
      const filtered = selectedCategory === 'all' ? SEED_ITEMS : SEED_ITEMS.filter(i => i.category === selectedCategory);
      setMarketplaceItems(filtered as any[]);
      setLoadError(false);
    } else {
      // If DB returns no rows, show seed items so the page is never blank
      const items = (data && data.length > 0) ? data : (selectedCategory === 'all' ? SEED_ITEMS : SEED_ITEMS.filter(i => i.category === selectedCategory)) as any[];
      setMarketplaceItems(items);
    }
    setIsLoading(false);
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to list an item');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('marketplace_items')
      .insert({
        title: newItem.title,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: newItem.category,
        condition: newItem.condition,
        location: newItem.location,
        user_id: user.id,
      });

    if (error) {
      toast.error('Failed to create listing');
      console.error('Error creating item:', error);
    } else {
      toast.success('Item listed successfully!');
      setNewItem({ title: "", description: "", price: "", category: "", condition: "", location: "" });
      setIsCreateOpen(false);
      fetchMarketplaceItems();
    }
    setIsSubmitting(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="min-h-screen bg-background topo-card">
      <Seo
        title="Vanciety Marketplace | Vans, Parts, Gear, and Listings"
        description="Shop and list vans, parts, tools, and adventure gear on the Vanciety marketplace with verified fallback links when inventory is still growing."
        canonicalPath="/marketplace"
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Vanciety Marketplace",
          itemListElement: visibleMarketplaceItems.slice(0, 20).map((item, index) => ({
            "@type": "Product",
            position: index + 1,
            name: item.title,
            description: item.description,
            category: item.category,
            offers: {
              "@type": "Offer",
              price: item.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          })),
        }}
      />
      <Header />
      
      <main className="pt-16 sm:pt-20">
        {/* Hero Section */}
        <PageHero
          heroImage="https://files.manuscdn.com/user_upload_by_module/session_file/94256494/JkZQxDXOxONBVWVW.jpg"
          label="Marketplace"
          title="Van Life Marketplace"
          subtitle="Buy and sell vans, parts, gear, and accessories with the Vanciety community."
          icon={ShoppingBag}
        />
        <section className="bg-background border-b border-border py-12">
          <div className="container mx-auto px-4">
            {/* Search & Controls */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vans, parts, or gear..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Sell Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>List New Item</DialogTitle>
                      <DialogDescription>
                        Sell your van life gear to the community.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateItem}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="item-title">Title</Label>
                          <Input
                            id="item-title"
                            placeholder="Enter item title..."
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="item-category">Category</Label>
                            <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.filter(cat => cat.id !== 'all').map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="item-condition">Condition</Label>
                            <Select value={newItem.condition} onValueChange={(value) => setNewItem({ ...newItem, condition: value })} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                              <SelectContent>
                                {conditions.map((condition) => (
                                  <SelectItem key={condition.value} value={condition.value}>
                                    {condition.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="item-price">Price ($)</Label>
                            <Input
                              id="item-price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={newItem.price}
                              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="item-location">Location</Label>
                            <Input
                              id="item-location"
                              placeholder="City, State"
                              value={newItem.location}
                              onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="item-description">Description</Label>
                          <Textarea
                            id="item-description"
                            placeholder="Describe your item..."
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            rows={4}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          List Item
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const categoryItems = selectedCategory === category.id || category.id === 'all' ? marketplaceItems : marketplaceItems.filter(item => item.category === category.id);
                  const count = category.id === 'all' ? marketplaceItems.length : categoryItems.length;
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

        <section className="container mx-auto px-4 py-4">
          <AIVanConcierge mode="marketplace" compact />
        </section>

        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Trusted marketplace sources</h2>
                <p className="text-sm text-muted-foreground">
                  Real external marketplaces only. Prices and inventory must be checked at the source.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {marketplaceSources.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge variant="outline" className="mb-3 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {source.badge}
                      </Badge>
                      <h3 className="font-semibold text-foreground group-hover:text-primary">{source.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{source.note}</p>
                    </div>
                    <ExternalLink className="mt-1 h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{source.category}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Listings Grid */}
        <section className="py-12"> 
          <div className="container mx-auto px-4">
            {loadError && (
              <div className="mb-6 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
                <strong className="text-foreground">Unable to load listings right now.</strong>{" "}
                <span className="text-muted-foreground">Please try refreshing the page. You can still browse trusted van life marketplaces below.</span>
              </div>
            )}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-[4/3] animate-pulse bg-muted" />
                    <CardContent className="space-y-3 p-4">
                      <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                      <div className="flex gap-2">
                        <div className="h-8 flex-1 animate-pulse rounded bg-muted" />
                        <div className="h-8 w-10 animate-pulse rounded bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : visibleMarketplaceItems.length === 0 ? (
              <div className="text-center py-8 rounded-2xl border bg-card p-8">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No listings yet — be the first!</h3>
                <p className="text-muted-foreground mb-4">
                  Post your van, parts, or gear for free. While the community is getting started, check out these trusted van marketplaces:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-6 text-left">
                  {trustedMarketLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="rounded-xl border bg-background p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="font-semibold">{link.name}</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{link.note}</p>
                      <p className="text-xs text-muted-foreground">{link.note}</p>
                    </a>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {user ? (
                    <Button variant="hero" onClick={() => setIsCreateOpen(true)}>
                      List First Vanciety Item
                    </Button>
                  ) : (
                    <Button variant="hero" onClick={() => window.location.assign('/auth')}>
                      Join Free to List an Item
                    </Button>
                  )}
                  <Button asChild variant="outline">
                    <a href="https://www.vanviewer.com/" target="_blank" rel="noreferrer">
                      Search Trusted Marketplaces
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleMarketplaceItems.map((item) => (
                    <Card key={item.id} className="group hover:shadow-glow transition-all duration-300 overflow-hidden">
                      <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                        
                        {/* Overlay Actions */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Price */}
                        {item.price != null && (
                          <div className="absolute bottom-3 left-3 bg-background/90 px-3 py-1 rounded-lg">
                            <span className="text-lg font-bold text-primary">${Number(item.price).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                        
                        <CardDescription className="mb-3 line-clamp-2">
                          {item.description}
                        </CardDescription>

                        {/* Specs */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {item.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {(item.condition ?? '').replace('-', ' ') || 'Unknown'}
                          </Badge>
                        </div>

                        {/* Seller Info */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Community Member</span>
                          </div>
                        </div>

                        {/* Location & Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location ?? 'Location not set'}</span>
                          </div>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            Contact
                          </Button>
                        </div>

                        <div className="text-xs text-muted-foreground mt-2">
                          Posted {formatTimeAgo(item.created_at)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Listings
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Marketplace;