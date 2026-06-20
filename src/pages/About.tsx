import Header from "@/components/Header";
import AIVanConcierge from "@/components/AIVanConcierge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { verifiedEvents, verifiedLocations, verifiedVideos, verifiedVendors } from "@/data/vancietyVerified";
import { ArrowRight, Camera, CheckCircle2, Compass, MapPin, ShieldCheck, Users, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const ABOUT_IMAGE = "/images/vanciety-about-image-library.jpg";

const pillars = [
  {
    title: "Find the route",
    copy: "Use official map anchors, event pages, and public-land sources as starting points before you drive.",
    icon: Compass,
  },
  {
    title: "Build the van",
    copy: "Collect videos, vendor links, product research, and real-world questions before spending money.",
    icon: Wrench,
  },
  {
    title: "Meet people safely",
    copy: "Friend Finder is designed around opt-in, members-only, approximate city/area sharing — never exact public location.",
    icon: Users,
  },
  {
    title: "Verify at the source",
    copy: "Vanciety links out to official pages instead of inventing dates, inventory, prices, bookings, or activity.",
    icon: ShieldCheck,
  },
];

const sourceStats = [
  { label: "Verified videos", value: verifiedVideos.length, icon: Camera },
  { label: "Official map anchors", value: verifiedLocations.length, icon: MapPin },
  { label: "Official events", value: verifiedEvents.length, icon: Compass },
  { label: "Verified vendors", value: verifiedVendors.length, icon: Wrench },
];

const About = () => {
  return (
    <div className="vanciety-page vanciety-page--home min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <section className="vanciety-hero-topo py-14 md:py-18">
          <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Badge className="mb-5 bg-primary text-primary-foreground">
                <Users className="mr-2 h-4 w-4" />
                About Vanciety
              </Badge>
              <h1 className="mb-5 text-4xl font-black tracking-tight md:text-6xl">
                Built for van people who need the whole picture.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Vanciety is a van-life hub for trips, builds, events, vendors, marketplace research, member tools, and AI-assisted planning — organized around real source links and safe community features.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero" size="lg">
                  <Link to="/friend-finder">
                    Find van friends <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/van-intelligence">Open Van Intelligence</Link>
                </Button>
              </div>
            </div>

            <figure className="vanciety-topo-card overflow-hidden rounded-3xl border border-border/80 bg-card shadow-hero">
              <img
                src={ABOUT_IMAGE}
                alt="Vanciety vans camping image library collage showing campfire meetups, vans at campsites, interiors, materials, maps, tools, trails, portraits, and van-life details"
                className="h-[360px] w-full origin-center -translate-y-10 scale-[1.14] object-cover object-center md:h-[430px] md:-translate-y-12"
              />
              <figcaption className="border-t border-border/70 bg-background/86 p-4 text-sm text-muted-foreground backdrop-blur">
                Vanciety vans-camping visual library / community concept image. Used as brand direction, not as a claim of verified live member attendance.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <Badge variant="outline" className="mb-3 border-primary/30 text-primary-glow">
                Real source policy
              </Badge>
              <h2 className="text-3xl font-bold md:text-4xl">What Vanciety is for</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <Card key={pillar.title} className="vanciety-topo-card border-border/80 bg-card/90">
                    <CardHeader>
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary-glow">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{pillar.title}</CardTitle>
                      <CardDescription>{pillar.copy}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr]">
            <Card className="vanciety-map-grid border-border/80 bg-card/85">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary-glow" />
                  What is real today
                </CardTitle>
                <CardDescription>
                  These counts come from the Vanciety verified source data layer, not invented marketing numbers.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {sourceStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                      <Icon className="mb-2 h-5 w-5 text-secondary" />
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/85">
              <CardHeader>
                <CardTitle>The Vanciety standard</CardTitle>
                <CardDescription>
                  The site should feel useful, visual, safe, and real — not like a fake community mockup.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Public pages use official links and verified source anchors. If a feature requires member accounts, live Supabase access, Google Maps, or AI server setup, the UI should say that naturally instead of pretending the feature is already populated.
                </p>
                <p>
                  The topo-map design system gives every page a route/adventure feel, while the vans-camping image library adds the human side: campfires, build work, interiors, maps, tools, tires, trail days, and the people behind the rigs.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <AIVanConcierge mode="home" compact />
        </section>
      </main>
    </div>
  );
};

export default About;
