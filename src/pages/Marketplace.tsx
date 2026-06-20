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
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import AIVanConcierge from "@/components/AIVanConcierge";

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const visibleMarketplaceItems = marketplaceItems.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [item.title, item.description, item.category, item.condition, item.location, item.profiles?.display_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  useEffect(() => {
    fetchMarketplaceItems();
  }, [selectedCategory]);

  const fetchMarketplaceItems = async () => {
    setIsLoading(true);
    let query = supabase
      .from('marketplace_items')
      .select(`
        *,
        profiles!marketplace_items_user_id_fkey (
          display_name
        )
      `)
      .eq('is_sold', false)
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Failed to load marketplace items');
      console.error('Error fetching items:', error);
    } else {
      setMarketplaceItems(data || []);
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
    <div className="vanciety-page vanciety-page--marketplace min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="vanciety-hero-topo py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Van Life Marketplace
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Live community listings through Supabase, with verified external marketplace links when local inventory is empty
              </p>
            </div>

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

        <section className="container mx-auto px-4">
          <AIVanConcierge mode="marketplace" compact />
        </section>

        {/* Listings Grid */}
        <section className="py-12"> 
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading items...</p>
              </div>
            ) : visibleMarketplaceItems.length === 0 ? (
              <div className="text-center py-8 rounded-2xl border bg-card p-8">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No matching Vanciety listings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Member listings will appear here as the community adds vans, parts, and gear. Until then, use these marketplace links to keep searching.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-6 text-left">
                  {trustedMarketLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border bg-background p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="font-semibold">{link.name}</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{link.note}</p>
                      <p className="text-xs text-muted-foreground">Verified title: {link.verifiedTitle}</p>
                    </a>
                  ))}
                </div>
                {user && (
                  <Button variant="hero" onClick={() => setIsCreateOpen(true)}>
                    List First Vanciety Item
                  </Button>
                )}
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
                        <div className="absolute bottom-3 left-3 bg-background/90 px-3 py-1 rounded-lg">
                          <span className="text-lg font-bold text-primary">${item.price}</span>
                        </div>
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
                            {item.condition.replace('-', ' ')}
                          </Badge>
                        </div>

                        {/* Seller Info */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {item.profiles?.display_name || 'Anonymous'}
                            </span>
                          </div>
                        </div>

                        {/* Location & Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
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