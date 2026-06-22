import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Bookmark, Bell, CreditCard, Package, PlusCircle, Sprout, Sparkles, Truck, Wrench } from "lucide-react";
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

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const displayName = user?.user_metadata?.display_name || user?.email || "Member";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="vanciety-hero-topo border-b border-border/60 py-12">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-primary text-primary-foreground">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Mission control
            </Badge>
            <div className="max-w-4xl">
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">Welcome back, {displayName}</h1>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
                This is your member home: van details, bills, saved research, wish lists, and alerts for the products you care about.
              </p>
            </div>
          </div>
        </section>

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
