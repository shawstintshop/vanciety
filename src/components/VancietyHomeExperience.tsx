import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VancietyConceptVisual from "@/components/VancietyConceptVisual";
import { Bot, CalendarDays, Compass, Home, MapPinned, MessageCircle, Mountain, Navigation, ShoppingBag, Sparkles, Sun, Users, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const regions = [
  {
    title: "Northwest rivers + forests",
    copy: "Wet roads, ferry towns, mountain passes, public-land research, coastal weekends, coffee stops, and van friends near Oregon/Washington events.",
    icon: Mountain,
    tone: "from-emerald-500/18 to-cyan-500/10",
  },
  {
    title: "Southwest desert + winter routes",
    copy: "Desert camps, red-rock drives, dry-weather meetups, gear checks, solar questions, and event loops from Arizona to Southern California.",
    icon: Sun,
    tone: "from-orange-500/18 to-amber-500/10",
  },
];

const completeSystem = [
  { title: "AI guide", copy: "Ask for routes, parts, vendors, how-to help, event ideas, or what section to open first.", icon: Bot, to: "#vanciety-ai-helper" },
  { title: "Find me app", copy: "Members-only approximate-area friend finder for meetups, food, camping, and van help.", icon: Users, to: "/friend-finder" },
  { title: "Driveway surfing", copy: "Member-to-member driveway meetups and safe local help without public exact address exposure.", icon: Home, to: "/friend-finder" },
  { title: "Large events", copy: "Official source links for van shows, overland expos, Northwest gatherings, and trip planning.", icon: CalendarDays, to: "/news" },
  { title: "Van help + mechanics", copy: "Find trusted shops, upfitters, mobile mechanics, dealer prep, and questions to ask before booking.", icon: Wrench, to: "/vendors" },
  { title: "Latest gear", copy: "High-end Sprinter equipment, power systems, racks, heaters, tires, marketplace leads, and buying checklists.", icon: ShoppingBag, to: "/van-intelligence" },
  { title: "How-to + videos", copy: "Build videos, tours, power systems, maintenance, camping tips, and topic-based watch paths.", icon: Sparkles, to: "/videos" },
  { title: "Map everything", copy: "Official public-land and campground anchors, event sources, and opt-in member areas when accounts are active.", icon: MapPinned, to: "/map" },
];

const quickPrompts = [
  "Where should I camp this weekend?",
  "Find van help near me",
  "What event should I go to?",
  "Help me compare power upgrades",
  "Draft a meetup message",
  "Show me latest van gear",
];

const VancietyHomeExperience = () => {
  return (
    <section className="vanciety-home-experience py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <Badge className="mb-4 bg-secondary text-secondary-foreground">
            <Navigation className="mr-2 h-4 w-4" />
            Northwest to Southwest flow
          </Badge>
          <h2 className="mb-4 text-3xl font-black tracking-tight md:text-5xl">
            A high-tech van society that still feels like pulling into camp.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Vanciety should feel like a clean command center for the whole vanlife world: rivers, forests, desert routes, driveway projects, premium shops, massive events, member meetups, how-to help, and AI guidance that makes everything easy to find.
          </p>
        </div>

        <div className="mb-12 grid gap-5 lg:grid-cols-2">
          {regions.map((region) => {
            const Icon = region.icon;
            return (
              <Card key={region.title} className="vanciety-region-card overflow-hidden border-border/80 bg-card/85">
                <CardHeader className={`bg-gradient-to-br ${region.tone}`}>
                  <Icon className="mb-4 h-8 w-8 text-primary-glow" />
                  <CardTitle className="text-2xl">{region.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-foreground/76">{region.copy}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="mb-12 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <VancietyConceptVisual
            src="/images/vana/vana-friendly-welcome.jpg"
            alt="Vana friendly welcome image"
            title="Ask Vana first"
            caption="The home page should start with Vana as the route guide, then send people to the right van repair, events, videos, or help page."
            badge="Home assistant"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <VancietyConceptVisual
              compact
              src="/images/vana/vana-route-guidance.jpg"
              alt="Vana route guidance image"
              title="Route guidance"
              caption="Help visitors get to the correct guide immediately instead of wandering around the site."
              badge="Guidance"
            />
            <VancietyConceptVisual
              compact
              src="/images/vana/vana-tech-support.jpg"
              alt="Vana tech support image"
              title="Van help + mechanics"
              caption="Find repair help, trusted shops, upfitters, parts questions, and service prep in one clean help flow."
              badge="Van help"
            />
          </div>
        </div>

        <div className="mb-12 rounded-[2rem] border border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 p-5 shadow-hero md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge className="mb-4 bg-primary text-primary-foreground">
                <Bot className="mr-2 h-4 w-4" />
                AI helper on the home page
              </Badge>
              <h3 className="mb-4 text-3xl font-bold md:text-4xl">Users should never feel lost.</h3>
              <p className="mb-5 text-muted-foreground">
                The homepage points people straight to Vanciety AI. They type what they want — camping, mechanics, meetups, gear, news, how-to, vendors, events — and the helper sends them to the right Vanciety section and source links.
              </p>
              <Button asChild variant="hero" size="lg">
                <a href="#vanciety-ai-helper">Ask the AI helper</a>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickPrompts.map((prompt) => (
                <a
                  key={prompt}
                  href="#vanciety-ai-helper"
                  className="rounded-2xl border border-border/80 bg-background/62 p-4 text-sm font-medium transition hover:border-primary/70 hover:bg-primary/10"
                >
                  <MessageCircle className="mb-2 h-4 w-4 text-primary-glow" />
                  {prompt}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {completeSystem.map((item) => {
            const Icon = item.icon;
            const content = (
              <Card className="h-full border-border/80 bg-card/82 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow">
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.copy}</CardDescription>
                </CardHeader>
              </Card>
            );
            return item.to.startsWith("#") ? (
              <a key={item.title} href={item.to} className="block h-full">{content}</a>
            ) : (
              <Link key={item.title} to={item.to} className="block h-full">{content}</Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VancietyHomeExperience;
