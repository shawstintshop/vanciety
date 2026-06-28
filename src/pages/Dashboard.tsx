import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Bookmark, Bell, CreditCard, Package, PlusCircle, Sprout, Sparkles, Truck, Wrench, Rss, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_META, type FeedCategory } from "@/hooks/useContentFeed";
import { Link, Navigate } from "react-router-dom";

const sampleAlerts = [
  {
    title: "Solar controller sale watcher",
    description: "AI will flag new discounts on the exact products in your wishlist once the wishlist pipeline is connected.",
  },
  {
    title: "EGR repair collection",
    description: "Your saved repair pages, videos, and parts stay together on one member page.",
  },
  {
    title: "Vendor specials",
    description: "Recommended products and service deals can be surfaced here when your saved items match a sale.",
  },
];

const ALL_FEED_CATEGORIES: FeedCategory[] = [
  "youtube", "news", "products", "how_to", "stealth", "overland", "builds", "camping"
];

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [feedCategories, setFeedCategories] = useState<FeedCategory[]>(ALL_FEED_CATEGORIES);
  const [savingFeed, setSavingFeed] = useState(false);
  const [feedSaved, setFeedSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("feed_categories")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if ((data as any)?.feed_categories?.length) {
          setFeedCategories((data as any).feed_categories as FeedCategory[]);
        }
      });
  }, [user]);

  const toggleCategory = (cat: FeedCategory) => {
    setFeedCategories((prev) =>
      prev.includes(cat)
        ? prev.length > 1 ? prev.filter((c) => c !== cat) : prev
        : [...prev, cat]
    );
  };

  const saveFeedPrefs = async () => {
    if (!user) return;
    setSavingFeed(true);
    await supabase
      .from("profiles")
      .update({ feed_categories: feedCategories } as any)
      .eq("id", user.id);
    setSavingFeed(false);
    setFeedSaved(true);
    setTimeout(() => setFeedSaved(false), 2500);
  };

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const displayName = user?.user_metadata?.display_name || user?.email || "Member";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 sm:pt-20">
        <HeroSection image="https://files.manuscdn.com/user_upload_by_module/session_file/94256494/OcYosgrzkDuEjVgs.jpg" badge="My Dashboard" title="Welcome back" accent="to Vanciety." subtitle="Your van life command center." />

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-border/80 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Truck className="h-5 w-5 text-primary" />
                  My van
                </CardTitle>
                <CardDescription>Specs, build status, service notes, and the stuff you’re actively working on.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">Current van details, year, model, and setup can live here.</div>
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">Recent service notes, maintenance reminders, and repair plans.</div>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/van-intelligence">
                    <Wrench className="h-4 w-4" />
                    Open repair research
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Bills and budget
                </CardTitle>
                <CardDescription>Track recurring bills, subscription renewals, and purchase budgets in one place.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">Fuel, insurance, storage, payment due dates, and other recurring costs.</div>
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">Flag what is due soon so the member home stays useful at a glance.</div>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/marketplace">
                    <Package className="h-4 w-4" />
                    Browse products
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-border/80 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bookmark className="h-5 w-5 text-primary" />
                  Saved research
                </CardTitle>
                <CardDescription>Your saved guides, topic pages, videos, and source links live here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">EGR cleaning guide</div>
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">Audio system research</div>
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">Solar and power upgrades</div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  Wish list
                </CardTitle>
                <CardDescription>Products you want to buy can be watched for price drops or sales.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">Victron Multiplus II</div>
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">Roof rack upgrade</div>
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">EGR cleaning kit</div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bell className="h-5 w-5 text-primary" />
                  Sale alerts
                </CardTitle>
                <CardDescription>When the wishlist pipeline is live, new sales can surface here automatically.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {sampleAlerts.map((alert) => (
                  <div key={alert.title} className="rounded-xl border border-border/60 bg-background/50 p-3">
                    <p className="font-medium">{alert.title}</p>
                    <p className="mt-1 text-muted-foreground">{alert.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feed preferences */}
        <section className="container mx-auto px-4 pb-12">
          <Card className="border-border/80 bg-card/90 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Rss className="h-5 w-5 text-primary" />
                My Feed Preferences
              </CardTitle>
              <CardDescription>
                Choose which content categories appear in your home page feed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {ALL_FEED_CATEGORIES.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  const active = feedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-3
                        text-sm font-medium transition-all duration-150
                        ${
                          active
                            ? "border-primary/60 bg-primary/10 text-foreground"
                            : "border-border/40 bg-muted/30 text-muted-foreground hover:border-border"
                        }`}
                    >
                      {active && (
                        <Check className="absolute top-2 right-2 w-3.5 h-3.5 text-primary" />
                      )}
                      <span className="text-xl">{meta.emoji}</span>
                      <span>{meta.label}</span>
                    </button>
                  );
                })}
              </div>
              <Button onClick={saveFeedPrefs} disabled={savingFeed} className="gap-2">
                {feedSaved ? (
                  <><Check className="h-4 w-4" /> Saved!</>
                ) : savingFeed ? "Saving..." : "Save preferences"}
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <Card className="border-border/80 bg-card/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">What this dashboard will keep growing into</CardTitle>
              <CardDescription>Keep the member home focused on the few things that matter most.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Saved collections that pull in related videos, tools, and forum help</p>
              <p>• Product wish list alerts when an item goes on sale</p>
              <p>• Van-specific reminders and build notes</p>
              <p>• Purchase planning, service planning, and budget visibility</p>
              <Separator className="my-4" />
              <Button asChild variant="hero" className="gap-2">
                <Link to="/van-intelligence">
                  <Sparkles className="h-4 w-4" />
                  Save more research
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
