import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, Users, MapPin, Calendar, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { verifiedEvents, verifiedLocations, verifiedVendors, verifiedVideos } from "@/data/vancietyVerified";
import VancietyGroupImage from "@/components/VancietyGroupImage";

const PremiumSection = () => {
  const betaCapabilities = [
    `Video library: ${verifiedVideos.length} van-life YouTube links`,
    `Adventure map: ${verifiedLocations.length} campground, public-land, and event source links`,
    `Event board: ${verifiedEvents.length} van and overland event links`,
    `Vendor directory: ${verifiedVendors.length} builder, upfitter, and resource links`,
    "Member sign-in for forum posts, marketplace listings, profiles, and opt-in location sharing",
    "AI concierge for trip planning, gear research, seller questions, and build ideas",
  ];

  const routeCards = [
    { label: "Videos", to: "/videos", icon: Star, note: "Verified YouTube content" },
    { label: "Map", to: "/map", icon: MapPin, note: "Official anchors + live GPS" },
    { label: "Events", to: "/news", icon: Calendar, note: "Official event source links" },
    { label: "Marketplace", to: "/marketplace", icon: ShoppingBag, note: "Member listings + marketplace links" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-green-600 text-white px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Member tools + AI help
          </Badge>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Plan the next </span>
            <span className="bg-gradient-sunset bg-clip-text text-transparent">
              trip, build, or meetup
            </span>
            <br />
            <span className="text-foreground">with everything in one place</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Use Vanciety to find van videos, events, map sources, vendors, marketplace links, member features, and AI planning help from one clean hub.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-sunset blur-lg opacity-20 rounded-2xl" />
            <div className="relative bg-gradient-card rounded-2xl p-8 shadow-hero border border-border/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-sunset rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Vanciety Beta Access</h3>
                <p className="text-muted-foreground">
                  Sign in to post, save, list gear, share approximate location, and help shape the Vanciety community.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {betaCapabilities.map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-gradient-forest rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild variant="hero" size="lg" className="w-full group">
                <Link to="/auth">
                  Sign in / create account
                  <Zap className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                <Shield className="w-3 h-3 inline mr-1" />
                Member-only features use your account and permissions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <VancietyGroupImage
              compact
              className="sm:col-span-2 min-h-[260px]"
              caption="The community direction: shared meals, build support, trail planning, events, and members helping members."
            />
            {routeCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.to} to={card.to} className="bg-gradient-card rounded-xl p-6 shadow-card hover:shadow-glow transition-all duration-300 border hover:border-primary">
                  <div className="w-12 h-12 bg-gradient-forest rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{card.label}</h4>
                  <p className="text-sm text-muted-foreground">{card.note}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-16 rounded-2xl border bg-card/70 p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-muted-foreground flex-wrap">
            <Users className="w-5 h-5" />
            <span className="font-semibold text-foreground">Use it for:</span>
            <span>events, maps, vendors, videos, gear research, member posts, and AI-assisted planning.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
