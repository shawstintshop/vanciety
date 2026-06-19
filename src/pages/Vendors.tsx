import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, MapPin, Globe, ShoppingBag, ExternalLink, Verified, Wrench, Zap, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import AIVanConcierge from "@/components/AIVanConcierge";
import VancietyConceptVisual from "@/components/VancietyConceptVisual";
import { verifiedVendors, sourceBadgeClass } from "@/data/vancietyVerified";

const Vendors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const vendorCategories = useMemo(() => {
    const categories = Array.from(new Set(verifiedVendors.map((vendor) => vendor.category)));
    const iconFor = (category: string) => {
      if (category.toLowerCase().includes("electrical")) return Zap;
      if (category.toLowerCase().includes("builder") || category.toLowerCase().includes("adventure")) return Truck;
      return Wrench;
    };
    return [
      { id: "all", name: "All verified vendors", count: verifiedVendors.length, icon: ShoppingBag },
      ...categories.map((category) => ({
        id: category,
        name: category,
        count: verifiedVendors.filter((vendor) => vendor.category === category).length,
        icon: iconFor(category),
      })),
    ];
  }, []);

  const filteredVendors = verifiedVendors.filter((vendor) => {
    const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || [vendor.name, vendor.category, vendor.location, vendor.description, vendor.services.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="vanciety-page vanciety-page--vendors min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <section className="vanciety-hero-topo py-14">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-8 mb-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="text-center lg:text-left">
                <Badge className="mb-4 bg-blue-600 text-white">
                  <Verified className="w-3 h-3 mr-1" />
                  Verified official links
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    Real Van Vendors
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto lg:mx-0">
                  Explore builders, upfitters, service shops, and van-life resources with direct links to the business site for current services, locations, and contact details.
                </p>
              </div>
              <VancietyConceptVisual
                compact
                src="/images/vanciety-van-tech-mechanics.jpg"
                alt="Vanciety van help and mechanics visual with Sprinter-style vans at a service shop and people discussing repair parts"
                title="Van Help + Mechanics"
                caption="A visual direction for finding repair help, mobile mechanics, trusted shops, upfitters, suspension parts, van troubleshooting, and better questions before booking work."
                badge="Van help / mechanics"
              />
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search verified vendors, services, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Live filters
                </Button>
                <Button asChild variant="hero" className="flex items-center gap-2">
                  <a href="mailto:hello@vanciety.com?subject=Vanciety%20vendor%20listing">
                    <ShoppingBag className="w-4 h-4" />
                    Request listing
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {vendorCategories.map((category) => {
                  const Icon = category.icon;
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
                      <span className="text-xs opacity-75">({category.count})</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <AIVanConcierge mode="mechanic" compact />
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6 rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Before you book:</strong> Open the business site for current services, location, contact options, availability, and warranty details. Use AI to prepare better questions before calling.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="group hover:shadow-glow transition-all duration-300 overflow-hidden">
                  <div className="relative h-56">
                    <img
                      src={vendor.imageUrl}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <Badge className={sourceBadgeClass(vendor.sourceBadge)}>{vendor.sourceBadge}</Badge>
                      <Badge variant="secondary">{vendor.category}</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-2xl font-bold">{vendor.name}</h3>
                      <div className="mt-2 flex items-center gap-2 text-sm text-white/85">
                        <MapPin className="w-4 h-4" />
                        {vendor.location}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <CardDescription className="text-base mb-4">{vendor.description}</CardDescription>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {vendor.services.map((service) => (
                        <Badge key={service} variant="outline">{service}</Badge>
                      ))}
                    </div>

                    <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground mb-4">
                      Verified page title: <span className="text-foreground">{vendor.titleVerified}</span>
                    </div>

                    <Button asChild variant="hero" className="w-full">
                      <a href={vendor.url} target="_blank" rel="noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Open official site <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredVendors.length === 0 && (
              <div className="text-center py-16 rounded-2xl border bg-card mt-8">
                <p className="text-muted-foreground">No verified vendors match that search yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Vendors;
