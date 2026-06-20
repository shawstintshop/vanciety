import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin,
  Phone,
  Globe,
  Mail,
  Truck,
  Wrench,
  Zap,
  ShoppingBag,
  Users,
  Crown,
  ExternalLink,
  Verified
} from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";

const Vendors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const vendorCategories = [
    { id: "all", name: "All Vendors", count: "156", icon: ShoppingBag },
    { id: "parts", name: "Van Parts & Service", count: "34", icon: Wrench },
    { id: "electrical", name: "Electrical & Solar", count: "28", icon: Zap },
    { id: "builders", name: "Van Builders", count: "19", icon: Truck },
    { id: "accessories", name: "Accessories", count: "42", icon: ShoppingBag },
    { id: "gear", name: "Outdoor Gear", count: "33", icon: ShoppingBag }
  ];

  const featuredVendors = [
    {
      id: 1,
      name: "Adventure Van Co.",
      category: "Van Builders",
      description: "Premium van conversions with 15+ years experience. Specializing in Mercedes Sprinter and Ford Transit builds.",
      location: "Denver, CO",
      rating: 4.9,
      reviews: 147,
      verified: true,
      premium: true,
      logo: "https://images.unsplash.com/photo-1544978503-7ad5ac882d5d?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop",
      services: ["Complete Builds", "Electrical Systems", "Custom Interiors", "4x4 Conversions"],
      priceRange: "$50K - $200K",
      contact: {
        phone: "(555) 123-4567",
        email: "info@adventurevan.co",
        website: "www.adventurevan.co"
      },
      featured: true,
      discount: "10% off for community members"
    },
    {
      id: 2,
      name: "Solar Solutions Van",
      category: "Electrical & Solar", 
      description: "Complete solar and electrical installations for van life. Off-grid power specialists with mobile service.",
      location: "Phoenix, AZ",
      rating: 4.8,
      reviews: 203,
      verified: true,
      premium: true,
      logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop",
      services: ["Solar Installation", "Lithium Batteries", "Inverter Systems", "Mobile Service"],
      priceRange: "$2K - $15K",
      contact: {
        phone: "(555) 234-5678",
        email: "solar@vanpower.com",
        website: "www.solarsolutionsvan.com"
      },
      featured: true,
      discount: "Free consultation for community members"
    },
    {
      id: 3,
      name: "Overland Parts Direct",
      category: "Van Parts & Service",
      description: "Your one-stop shop for van parts, accessories, and maintenance. Fast shipping nationwide.",
      location: "Austin, TX",
      rating: 4.7,
      reviews: 89,
      verified: true,
      premium: false,
      logo: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop", 
      coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop",
      services: ["OEM Parts", "Aftermarket Upgrades", "Tool Rental", "Technical Support"],
      priceRange: "$10 - $5K",
      contact: {
        phone: "(555) 345-6789",
        email: "parts@overlanddirect.com",
        website: "www.overlandpartsdirect.com"
      },
      featured: false,
      discount: "5% off first order"
    },
    {
      id: 4,
      name: "Van Life Gear Co.",
      category: "Accessories",
      description: "Premium accessories and gear designed specifically for van life. From kitchen setups to storage solutions.",
      location: "Portland, OR",
      rating: 4.6,
      reviews: 156,
      verified: true,
      premium: false,
      logo: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop",
      services: ["Kitchen Equipment", "Storage Solutions", "Comfort Accessories", "Outdoor Gear"],
      priceRange: "$25 - $2K",
      contact: {
        phone: "(555) 456-7890",
        email: "gear@vanlifeco.com", 
        website: "www.vanlifegear.co"
      },
      featured: false,
      discount: "Free shipping over $100"
    },
    {
      id: 5,
      name: "Mountain View Van Service",
      category: "Van Parts & Service",
      description: "Professional van maintenance and repair services. Specializing in Sprinter and Transit mechanical work.",
      location: "Boulder, CO",
      rating: 4.8,
      reviews: 78,
      verified: true,
      premium: false,
      logo: "https://images.unsplash.com/photo-1544978503-7ad5ac882d5d?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=300&fit=crop",
      services: ["Engine Repair", "Transmission Service", "4x4 Maintenance", "Pre-purchase Inspections"],
      priceRange: "$100 - $8K",
      contact: {
        phone: "(555) 567-8901",
        email: "service@mountainviewvan.com",
        website: "www.mountainviewvan.com"
      },
      featured: false,
      discount: "Community member discount available"
    },
    {
      id: 6,
      name: "Wilderness Outfitters",
      category: "Outdoor Gear",
      description: "Everything you need for outdoor adventures. From camping gear to outdoor cooking equipment.",
      location: "Salt Lake City, UT",
      rating: 4.5,
      reviews: 234,
      verified: false,
      premium: false,
      logo: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=600&h=300&fit=crop",
      services: ["Camping Gear", "Hiking Equipment", "Outdoor Cooking", "Adventure Clothing"],
      priceRange: "$15 - $1K",
      contact: {
        phone: "(555) 678-9012",
        email: "info@wildernessoutfitters.com",
        website: "www.wildernessoutfitters.com" 
      },
      featured: false,
      discount: "Seasonal sales and clearance"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Van Life Vendors
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Trusted businesses and services for the van life community
              </p>
            </div>

            {/* Search & Controls */}
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
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
                <Button variant="hero" className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Join as Vendor
                </Button>
              </div>

              {/* Category Pills */}
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

        {/* Vendors Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredVendors.map((vendor) => (
                <Card key={vendor.id} className="group hover:shadow-glow transition-all duration-300 overflow-hidden">
                  {/* Cover Image */}
                  <div className="relative h-48">
                    <img
                      src={vendor.coverImage}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {vendor.premium && (
                        <Badge className="bg-gradient-sunset text-white flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Premium Partner
                        </Badge>
                      )}
                      {vendor.verified && (
                        <Badge className="bg-gradient-forest text-white flex items-center gap-1">
                          <Verified className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    {/* Logo */}
                    <div className="absolute -bottom-8 left-6">
                      <img
                        src={vendor.logo}
                        alt={`${vendor.name} logo`}
                        className="w-16 h-16 rounded-xl border-4 border-background object-cover"
                      />
                    </div>
                  </div>

                  <CardContent className="pt-12 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">
                          {vendor.name}
                        </CardTitle>
                        <Badge variant="secondary" className="mb-2">
                          {vendor.category}
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-secondary fill-current" />
                          <span className="font-medium">{vendor.rating}</span>
                          <span className="text-sm text-muted-foreground">({vendor.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {vendor.location}
                        </div>
                      </div>
                    </div>

                    <CardDescription className="mb-4 line-clamp-2">
                      {vendor.description}
                    </CardDescription>

                    {/* Services */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {vendor.services.map((service) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-4">
                      <span className="text-sm font-medium">Price Range: </span>
                      <span className="text-sm text-primary font-semibold">{vendor.priceRange}</span>
                    </div>

                    {/* Special Offer */}
                    {vendor.discount && (
                      <div className="mb-4 p-3 bg-gradient-card rounded-lg">
                        <p className="text-sm font-medium text-secondary">🎉 Special Offer</p>
                        <p className="text-sm text-muted-foreground">{vendor.discount}</p>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{vendor.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">{vendor.contact.email}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="hero" className="flex-1">
                        Contact Vendor
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href={`https://${vendor.contact.website}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Vendors
              </Button>
            </div>
          </div>
        </section>

        {/* Become a Vendor CTA */}
        <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Join Our Vendor Network
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with thousands of van life enthusiasts and grow your business with our community
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-sunset rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">50K+ Active Members</h3>
                <p className="text-sm text-muted-foreground">Reach engaged van life enthusiasts</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-forest rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Verified Reviews</h3>
                <p className="text-sm text-muted-foreground">Build trust with authentic feedback</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Premium Features</h3>
                <p className="text-sm text-muted-foreground">Enhanced listings and analytics</p>
              </div>
            </div>

            <Button variant="hero" size="lg" className="mb-4">
              Apply to Become a Vendor
            </Button>
            <p className="text-sm text-muted-foreground">
              Join 150+ trusted vendors serving our community
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Vendors;