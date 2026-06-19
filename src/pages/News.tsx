import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, MapPin, ShieldCheck, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import VancietyConceptVisual from "@/components/VancietyConceptVisual";
import { verifiedEvents, liveSourceNotes, sourceBadgeClass } from "@/data/vancietyVerified";

const News = () => {
  const topEvents = verifiedEvents.slice(0, 3);
  const remainingEvents = verifiedEvents.slice(3);
  const categories = ["Official Events", "Adventure Van Expo", "Overland", "Northwest", "Oregon", "Colorado", "Arizona"];

  return (
    <div className="vanciety-page vanciety-page--news min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <section className="vanciety-hero-topo py-14">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-8 mb-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="text-center lg:text-left">
                <Badge className="mb-4 bg-green-600 text-white">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Real source links only
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    Real Van Events & Updates
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto lg:mx-0">
                  Official van-life and overland event pages, source links, dates, locations, and planning notes for the next trip or show.
                </p>
              </div>
              <VancietyConceptVisual
                compact
                src="/images/vanciety-large-van-event.jpg"
                alt="Vanciety large van event visual with vans, vendor tents, trees, and people gathering around an outdoor expo-style meetup"
                title="Large van event energy"
                caption="A visual direction for Vanciety event discovery: big van meetups, vendor tents, member rigs, forest venues, and trip planning around official event sources."
                badge="Large van event"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {categories.map((category, index) => (
                <Badge key={category} variant={index === 0 ? "default" : "outline"} className="px-3 py-1">
                  {category}
                </Badge>
              ))}
            </div>

            <div className="max-w-4xl mx-auto rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Source policy:</strong> {liveSourceNotes.events} Dates that could not be cleanly extracted are labeled as official-page verification instead of guessed.
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold">Featured verified events</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {topEvents.map((event, index) => (
                <Card key={event.id} className={`group hover:shadow-glow transition-all duration-300 overflow-hidden ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}>
                  <div className="relative aspect-video lg:aspect-auto">
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${index === 0 ? "h-64 lg:h-96" : "h-52"}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <Badge className={sourceBadgeClass(event.sourceBadge)}>{event.sourceBadge}</Badge>
                      <Badge variant="secondary">{event.category}</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className={`font-bold leading-tight ${index === 0 ? "text-2xl md:text-3xl" : "text-lg"}`}>{event.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/85">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{event.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <CardDescription className="mb-4 text-base leading-relaxed">
                      {event.summary}
                    </CardDescription>
                    <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground mb-4">
                      Verified page title: <span className="text-foreground">{event.titleVerified}</span>
                    </div>
                    <Button asChild variant="hero" className="w-full">
                      <a href={event.url} target="_blank" rel="noreferrer">
                        Open official source <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">More verified event sources</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-glow transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-video">
                    <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <Badge className={`absolute top-3 left-3 ${sourceBadgeClass(event.sourceBadge)}`}>{event.sourceBadge}</Badge>
                  </div>

                  <CardContent className="p-5">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">{event.name}</CardTitle>
                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{event.date}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location}</div>
                    </div>
                    <CardDescription className="mb-4 line-clamp-3">{event.summary}</CardDescription>
                    <Button asChild variant="outline" className="w-full">
                      <a href={event.url} target="_blank" rel="noreferrer">Official page <ExternalLink className="w-4 h-4 ml-2" /></a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default News;
