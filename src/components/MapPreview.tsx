import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Users, Crown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import FallbackMap from "./FallbackMap";
import { verifiedLocations, liveSourceNotes } from "@/data/vancietyVerified";

const mapLocations = verifiedLocations.map((location) => ({
  id: location.id,
  name: location.name,
  description: location.description,
  latitude: location.latitude,
  longitude: location.longitude,
  type: location.type,
  amenities: location.amenities,
}));

const MapPreview = () => {
  const { mapRef, isLoaded, error } = useGoogleMaps({
    center: { lat: 39.8283, lng: -98.5795 },
    zoom: 4,
    locations: mapLocations
  });

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-600 text-white">Official map anchors</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Interactive </span>
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Adventure Map
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Verified official camp, public-land, and event sources. Live member/van locations appear only after opt-in Supabase tracking is active.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-gradient-card rounded-2xl p-6 shadow-hero">
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                {error ? (
                  <FallbackMap
                    locations={mapLocations}
                    onLocationClick={(location) => console.log('Selected location:', location)}
                  />
                ) : !isLoaded ? (
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center">
                    <p className="text-muted-foreground">Loading interactive map...</p>
                  </div>
                ) : (
                  <div ref={mapRef} className="w-full h-full rounded-xl" />
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs"><MapPin className="w-3 h-3 mr-1" />Verified sources</Badge>
                  <Badge variant="outline" className="text-xs"><Users className="w-3 h-3 mr-1" />Opt-in live vans</Badge>
                  <Badge variant="outline" className="text-xs"><Navigation className="w-3 h-3 mr-1" />Google/Fallback map</Badge>
                </div>
                <Button asChild variant="hero" size="sm">
                  <Link to="/map">Explore Map</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
              <strong className="text-foreground">Source note:</strong> {liveSourceNotes.tracking}
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center shadow-glow">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Official Location Sources</h3>
                <p className="text-muted-foreground">
                  Recreation.gov, BLM camping guidance, FreeCampsites.net, and official event anchors are linked directly instead of invented map inventory.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-forest rounded-xl flex items-center justify-center shadow-glow">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Live Member Finder</h3>
                <p className="text-muted-foreground">
                  See nearby Vanciety members only when they choose to share an approximate area, then use the Friend Finder to plan meetups, campouts, or van-help sessions safely.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-glow">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Direct Source Links</h3>
                <p className="text-muted-foreground">
                  Every verified source page links out to the official website for final rules, dates, bookings, and travel decisions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center shadow-glow">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Works With or Without a Map Key</h3>
                <p className="text-muted-foreground">
                  Use the full Google-powered map when configured, or browse the built-in adventure map and official source links when it is not.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapPreview;
