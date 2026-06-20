import Header from "@/components/Header";
import FallbackMap from "@/components/FallbackMap";
import AIVanConcierge from "@/components/AIVanConcierge";
import VancietyGroupImage from "@/components/VancietyGroupImage";
import VancietyConceptVisual from "@/components/VancietyConceptVisual";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtimeVanLocations } from "@/hooks/useRealtimeVanLocations";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CalendarDays,
  Coffee,
  HandHeart,
  Lock,
  MapPin,
  MessageCircle,
  Navigation,
  Search,
  Shield,
  Tent,
  Users,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";

type FriendFinderLocation = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  type: "live_van";
  status?: string;
};

const connectionNeeds = [
  { label: "Meet nearby van people", icon: Users },
  { label: "Find a safe camp lead", icon: Tent },
  { label: "Ask for van help", icon: Wrench },
  { label: "Local food + places to go", icon: Coffee },
  { label: "Oregon event coordination", icon: CalendarDays },
  { label: "Roadside community support", icon: HandHeart },
];

const privacyRules = [
  "Members only — not a public map.",
  "City/area level only — never exact coordinates in the UI.",
  "Opt-in sharing with stop/emergency controls.",
  "Use messaging to ask before meeting up.",
  "Private camp/help details should be shared one-to-one, not posted publicly.",
];

const FriendFinder = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { liveVans, loading } = useRealtimeVanLocations(Boolean(user));

  const friendLocations: FriendFinderLocation[] = useMemo(
    () =>
      liveVans.map((van) => ({
        id: van.id,
        name: van.display_name || "Vanciety member",
        description:
          van.message ||
          `${van.status === "traveling" ? "Traveling" : "Parked / nearby"} — approximate area only`,
        latitude: van.latitude,
        longitude: van.longitude,
        type: "live_van",
        status: van.status,
      })),
    [liveVans]
  );

  const filteredLocations = friendLocations.filter((location) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return `${location.name} ${location.description} ${location.status || ""}`
      .toLowerCase()
      .includes(query);
  });

  const { mapRef, isLoaded, error } = useGoogleMaps({
    center: { lat: 39.8283, lng: -98.5795 },
    zoom: 4,
    locations: filteredLocations,
  });

  return (
    <div className="vanciety-page vanciety-page--friends min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="vanciety-hero-topo py-12">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_20%_20%,hsl(var(--primary))_1px,transparent_1px),radial-gradient(circle_at_80%_40%,hsl(var(--accent))_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="container relative mx-auto px-4">
            <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/10 text-primary">
                <Shield className="h-3.5 w-3.5" />
                Members-only secure map
              </Badge>
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
                Van Friend Finder
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl lg:mx-0">
                A private Vanciety map for finding nearby van friends across the USA — city/area only, never exact location. Meet up, ask for help, find safe camp leads, and coordinate around events.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Button asChild variant="hero" size="lg">
                  <Link to={user ? "/gps" : "/auth"}>
                    {user ? "Turn on approximate sharing" : "Sign in to use Friend Finder"}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/news">Oregon event updates</Link>
                </Button>
              </div>
              </div>
              <VancietyConceptVisual
                compact
                src="/images/vanciety-driveway-meetup.jpg"
                alt="Vanciety driveway meetup visual with vans parked at a suburban home and small groups of people meeting safely in a driveway"
                title="Driveway van meetups"
                caption="For opt-in member meetups: approximate area first, message before arriving, and keep private addresses one-to-one."
                badge="Driveway meetup"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <AIVanConcierge mode="community" compact />
        </section>

        <section className="container mx-auto px-4 pt-8">
          <VancietyGroupImage compact className="min-h-[240px]" />
        </section>

        <section className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-[1.5fr_1fr]">
          <Card className="overflow-hidden border-border/80 bg-card/95 shadow-sm">
            <CardHeader className="border-b border-border/70">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <MapPin className="h-6 w-6 text-primary" />
                    USA member map
                  </CardTitle>
                  <CardDescription>
                    Shows only opt-in members at approximate city/area precision.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {filteredLocations.length} sharing now
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!user ? (
                <div className="flex min-h-[460px] flex-col items-center justify-center p-8 text-center">
                  <Lock className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h2 className="mb-2 text-2xl font-semibold">Members only</h2>
                  <p className="mb-6 max-w-xl text-muted-foreground">
                    Friend Finder is hidden from public visitors. Sign in to see approximate nearby member areas and message people safely.
                  </p>
                  <Button asChild variant="hero">
                    <Link to="/auth">Sign in / join beta</Link>
                  </Button>
                </div>
              ) : error ? (
                <div className="min-h-[460px] p-4">
                  <FallbackMap
                    locations={filteredLocations}
                    onLocationClick={() => undefined}
                  />
                  <div className="border-t border-border p-4 text-sm text-muted-foreground">
                    Google Maps is unavailable: {error}. Approximate member list remains available below.
                  </div>
                </div>
              ) : (
                <div className="relative min-h-[520px]">
                  <div ref={mapRef} className="h-[520px] w-full" />
                  {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/90">
                      <p className="text-muted-foreground">Loading secure member map...</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacy rules
                </CardTitle>
                <CardDescription>Designed for safety before social features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {privacyRules.map((rule) => (
                  <div key={rule} className="flex gap-3 text-sm">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{rule}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  What members can ask nearby
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {connectionNeeds.map(({ label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 rounded-lg border border-border/70 p-3 text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {user && (
          <section className="container mx-auto px-4 pb-12">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Nearby member areas
                    </CardTitle>
                    <CardDescription>
                      No exact coordinates are shown. Message before meeting.
                    </CardDescription>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="pl-9"
                      placeholder="Search status or area notes..."
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading member areas...</p>
                ) : filteredLocations.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center">
                    <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">No members are sharing right now</h3>
                    <p className="mx-auto mb-4 max-w-2xl text-sm text-muted-foreground">
                      This becomes useful as soon as members opt in from GPS settings. Until then, the map stays quiet instead of showing made-up activity.
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/gps">Open sharing controls</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredLocations.map((member) => (
                      <Card key={member.id} className="border-border/80">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <CardTitle className="text-base">{member.name}</CardTitle>
                              <CardDescription>{member.description}</CardDescription>
                            </div>
                            <Badge variant="outline">Area only</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{member.status || "available"}</Badge>
                            <Badge variant="secondary">Members only</Badge>
                          </div>
                          <Button className="w-full" variant="outline" disabled>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Message when member chat opens
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default FriendFinder;
