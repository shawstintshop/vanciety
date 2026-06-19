import Header from "@/components/Header";
import AIVanConcierge from "@/components/AIVanConcierge";
import VoiceVanny from "@/components/VoiceVanny";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Map, MessageSquare, Mic, ShieldCheck, ShoppingBag, Wrench } from "lucide-react";

const AIConcierge = () => {
  const areas = [
    {
      icon: Map,
      title: "Trip planning",
      copy: "Turn event links, map anchors, public-land sources, and member meetup etiquette into a practical weekend plan.",
    },
    {
      icon: Wrench,
      title: "Build research",
      copy: "Compare power, solar, heaters, tires, racks, audio, storage, and internet upgrades before you start buying parts.",
    },
    {
      icon: ShoppingBag,
      title: "Marketplace checks",
      copy: "Prepare questions for sellers, verify compatibility, and avoid common scams before opening live marketplace listings.",
    },
    {
      icon: MessageSquare,
      title: "Community help",
      copy: "Draft better forum posts, member messages, mechanic questions, and build-summary uploads.",
    },
  ];

  return (
    <div className="vanciety-page vanciety-page--ai min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="vanciety-hero-topo py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-white/15 text-white hover:bg-white/20">
                <Brain className="mr-1 h-3 w-3" />
                Vanciety AI Concierge
              </Badge>
              <h1 className="text-4xl font-bold md:text-6xl">Ask smarter van-life questions</h1>
              <p className="mt-4 text-lg text-white/75">
                Get help choosing what to watch, where to research, what to ask a seller, how to prepare for a shop call, and how to plan a safer van meetup or trip.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/80">
                <span className="rounded-full bg-white/10 px-3 py-1">Source links included</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Page-aware guidance</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Private by design</span>
              </div>
            </div>
          </div>
        </section>

        {/* Voice Vanny — realtime voice AI */}
        <section className="container mx-auto px-4 pt-10">
          <div className="mb-4 flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary-glow" />
            <h2 className="text-xl font-bold">Talk to Vanny</h2>
            <span className="rounded-full border border-primary/30 bg-primary/8 px-2.5 py-0.5 text-xs text-primary-glow">
              Voice · Realtime
            </span>
          </div>
          <p className="mb-5 max-w-xl text-sm text-muted-foreground">
            Live voice conversation — ask about camps, builds, parts, events, or anything vanlife. Vanny hears you and talks back in real time.
          </p>
          <VoiceVanny />
        </section>

        <section className="container mx-auto px-4 pt-8">
          <div className="mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Or type your question</span>
          </div>
          <AIVanConcierge mode="home" />
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="mb-6 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Where AI helps on Vanciety</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => {
              const Icon = area.icon;
              return (
                <Card key={area.title}>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{area.title}</CardTitle>
                    <CardDescription>{area.copy}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      AI gives planning help; Vanciety still sends you to the original source for final prices, dates, bookings, road rules, warranties, and seller details.
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AIConcierge;
