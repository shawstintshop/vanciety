import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Navigation,
  Users,
  Tent,
  Coffee,
  Star,
  MapIcon,
  List,
  Plus,
  RefreshCw,
  Share,
  StopCircle,
  Satellite,
  Truck,
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { LocationType } from "@/hooks/useLeafletMap";
import { useLeafletMap } from "@/hooks/useLeafletMap";
import { useRealtimePresence } from "@/hooks/useRealtimePresence";
import { useRealtimeVanLocations } from "@/hooks/useRealtimeVanLocations";
import FallbackMap from "@/components/FallbackMap";
import AIVanConcierge from "@/components/AIVanConcierge";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { verifiedLocations } from "@/data/vancietyVerified";

// Location type styling (matches useLeafletMap)
const locationTypeConfig: Record<string, { color: string; label: string; icon: string }> = {
  campsite: { color: '#10b981', label: 'Campsite', icon: '🏕️' },
  driveway: { color: '#3b82f6', label: 'Driveway', icon: '🏠' },
  event: { color: '#f59e0b', label: 'Event', icon: '🎉' },
  business: { color: '#8b5cf6', label: 'Business', icon: '🏪' },
  poi: { color: '#ef4444', label: 'POI', icon: '📍' },
  live_van: { color: '#06b6d4', label: 'Live Van', icon: '🚐' },
  live_member: { color: '#8b5cf6', label: 'Member', icon: '👤' },
};

interface Location {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: LocationType;
  amenities?: string[];
  rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: string;
  url?: string;
  imageUrl?: string;
  sourceBadge?: string;
}

const verifiedLocationFallback: Location[] = verifiedLocations.map((location) => ({
  id: location.id,
  name: location.name,
  description: location.description,
  latitude: location.latitude,
  longitude: location.longitude,
  type: location.type,
  amenities: location.amenities,
  verified: location.verified,
  url: location.url,
  imageUrl: location.imageUrl,
  sourceBadge: location.sourceBadge,
}));

const Map = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [locations, setLocations] = useState<Location[]>(verifiedLocationFallback);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showLiveVans, setShowLiveVans] = useState(true);
  const { toast } = useToast();

  // Live member tracking (existing)
  const {
    memberLocations,
    isSharing,
    startLocationSharing,
    stopSharing
  } = useRealtimePresence();

  // GPS van tracking (new)
  const { liveVans } = useRealtimeVanLocations(showLiveVans);

  const mapFilters = [
    { id: "all", name: "All Locations", icon: MapPin },
    { id: "campsite", name: "Camp Spots", icon: Tent },
    { id: "live_vans", name: "Live Vans", icon: Satellite },
    { id: "members", name: "Live Members", icon: Users },
    { id: "driveway", name: "Driveway Surfing", icon: Coffee },
    { id: "business", name: "Van Friendly", icon: Coffee },
    { id: "event", name: "Events", icon: Star },
    { id: "meetup", name: "Meetups", icon: Users }
  ];

  // Fetch locations from database
  const fetchLocations = async () => {
    try {
      let query = supabase
        .from('locations')
        .select('*')
        .order('rating', { ascending: false });

      // Handle special filters for live locations
      if (selectedFilter === "members" || selectedFilter === "live_vans") {
        setLocations([]);
        setLoading(false);
        return;
      }

      if (selectedFilter !== "all") {
        query = query.eq('type', selectedFilter);
      }

      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const mapped = (data || []).map(location => ({
        ...location,
        type: location.type as LocationType
      }));
      setLocations(mapped.length ? mapped : verifiedLocationFallback.filter((location) => selectedFilter === "all" || location.type === selectedFilter));
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Using verified map anchors",
        description: "Live Supabase locations are unavailable, so Vanciety is showing verified official location/event sources.",
        variant: "destructive",
      });
      setLocations(verifiedLocationFallback.filter((location) => selectedFilter === "all" || location.type === selectedFilter));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [selectedFilter, searchQuery]);

  // Convert live GPS vans to map locations
  const liveVanLocations: Location[] = liveVans.map(van => ({
    id: van.id,
    name: van.display_name || 'Van member',
    description: van.message || `${van.status === 'traveling' ? 'On the road' : 'Parked'} — updated ${new Date(van.updated_at).toLocaleTimeString()}`,
    latitude: van.latitude,
    longitude: van.longitude,
    type: 'live_van' as LocationType,
    status: van.status,
  }));

  // Combine locations based on filter
  const allMapLocations = (() => {
    if (selectedFilter === "live_vans") {
      return liveVanLocations;
    }
    if (selectedFilter === "members") {
      return memberLocations.map(member => ({
        id: member.id,
        name: `Van Lifer - ${member.status}`,
        description: member.message || `Last seen: ${new Date(member.last_seen).toLocaleDateString()}`,
        latitude: member.latitude,
        longitude: member.longitude,
        type: 'live_member' as LocationType,
        status: member.status,
      }));
    }
    // For "all" filter, show regular locations plus live vans overlay
    if (selectedFilter === "all" && showLiveVans) {
      return [...locations, ...liveVanLocations];
    }
    return locations;
  })();

  const { mapRef, isLoaded, error } = useLeafletMap({
    center: [39.8283, -98.5795],
    zoom: 5,
    locations: allMapLocations,
    onLocationClick: (location) => {
      setSelectedLocation(location);
    }
  });

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  // Sidebar items — show different data depending on filter
  const sidebarItems = (() => {
    if (selectedFilter === "live_vans") return liveVanLocations;
    if (selectedFilter === "members") {
      return memberLocations.map(m => ({
        id: m.id,
        name: `Van Lifer - ${m.status}`,
        description: m.message || `Last seen: ${new Date(m.last_seen).toLocaleDateString()}`,
        latitude: m.latitude,
        longitude: m.longitude,
        type: 'live_member' as LocationType,
        status: m.status,
      }));
    }
    return locations;
  })();

  const sidebarCount = sidebarItems.length + (selectedFilter === "all" && showLiveVans ? liveVans.length : 0);

  return (
    <div className="vanciety-page vanciety-page--map min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="vanciety-hero-topo py-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Van Life Map
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover verified camp and event anchors, view opt-in member areas, and connect with van-friendly resources
              </p>
            </div>

            {/* Search & Filters */}
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search camp spots, cities, areas, or verified sources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={viewMode === 'map' ? 'hero' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className="flex items-center gap-2"
                  >
                    <MapIcon className="w-4 h-4" />
                    Map
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'hero' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex items-center gap-2"
                  >
                    <List className="w-4 h-4" />
                    List
                  </Button>

                  {/* Show Live Vans toggle */}
                  <Button
                    variant={showLiveVans ? 'hero' : 'outline'}
                    size="sm"
                    onClick={() => setShowLiveVans(!showLiveVans)}
                    className="flex items-center gap-2"
                  >
                    <Satellite className="w-4 h-4" />
                    {showLiveVans ? 'Live Vans On' : 'Live Vans Off'}
                    {liveVans.length > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                        {liveVans.length}
                      </Badge>
                    )}
                  </Button>

                  {/* Location Sharing Controls */}
                  {selectedFilter === "members" && (
                    isSharing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={stopSharing}
                        className="flex items-center gap-2"
                      >
                        <StopCircle className="w-4 h-4" />
                        Stop Sharing
                      </Button>
                    ) : (
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => startLocationSharing('available', 'Looking for van life connections!')}
                        className="flex items-center gap-2"
                      >
                        <Share className="w-4 h-4" />
                        Share Location
                      </Button>
                    )
                  )}

                  <Button variant="outline" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Suggest Location
                  </Button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                {mapFilters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <Button
                      key={filter.id}
                      variant={selectedFilter === filter.id ? "hero" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter(filter.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {filter.name}
                      {filter.id === "live_vans" && liveVans.length > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                          {liveVans.length}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <AIVanConcierge mode="trip" compact />
        </section>

        {viewMode === 'map' ? (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-200px)]">
            {/* Map Container */}
            <div className="relative flex-1">
              {loading ? (
                <div className="w-full h-full min-h-[500px] bg-muted animate-pulse flex items-center justify-center">
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              ) : !isLoaded ? (
                <div className="min-h-[calc(100vh-200px)] p-4">
                  <FallbackMap
                    locations={allMapLocations}
                    onLocationClick={handleLocationClick}
                  />
                  <div className="mt-3 rounded-xl border border-border/70 bg-background/80 p-3 text-sm text-muted-foreground">
                    {error
                      ? `Google Maps is unavailable: ${error}`
                      : "Google Maps is not active in this browser session. Vanciety is showing the real source/member area list as an approximate map preview."}
                  </div>
                </div>
              ) : (
                <div
                  ref={mapRef}
                  className="w-full h-full min-h-[500px]"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                />
              )}

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button variant="outline" size="icon" className="bg-background/90">
                  <Navigation className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-background/90">
                  <MapPin className="w-4 h-4" />
                </Button>
                <Link to="/gps">
                  <Button variant="outline" size="icon" className="bg-background/90" title="GPS Tracking Settings">
                    <Satellite className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sidebar with Location List */}
            <div className="w-full lg:w-96 bg-muted/20 p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedFilter === "live_vans" ? "Live Van Members" : "Verified Map Sources"}
                </h3>
                <Badge variant="secondary">{sidebarCount} found</Badge>
              </div>

              {/* Live Vans section when showing "all" */}
              {selectedFilter === "all" && showLiveVans && liveVans.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-primary flex items-center gap-2 mb-2">
                    <Satellite className="w-4 h-4" />
                    Live Van Members ({liveVans.length})
                  </h4>
                  <div className="space-y-2 mb-4">
                    {liveVans.slice(0, 5).map(van => (
                      <Card
                        key={van.id}
                        className="hover:shadow-glow transition-all duration-300 cursor-pointer border-primary/20"
                        onClick={() => handleLocationClick({
                          id: van.id,
                          name: van.display_name || 'Van member',
                          latitude: van.latitude,
                          longitude: van.longitude,
                          type: 'live_van' as LocationType,
                          status: van.status,
                        })}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Truck className="w-5 h-5 text-primary" />
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{van.display_name || 'Van member'}</p>
                              <p className="text-xs text-muted-foreground">
                                {van.status === 'traveling' ? 'On the road' : 'Parked'}
                                {van.speed ? ` — ${(van.speed * 2.237).toFixed(0)} mph` : ''}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {van.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {liveVans.length > 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedFilter("live_vans")}
                      >
                        View all {liveVans.length} live vans
                      </Button>
                    )}
                  </div>
                  <div className="border-b border-border mb-4" />
                </div>
              )}

              {/* Live vans filter */}
              {selectedFilter === "live_vans" && (
                <div className="space-y-3">
                  {liveVanLocations.length === 0 ? (
                    <div className="text-center py-8">
                      <Satellite className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-2">No van members are sharing right now.</p>
                      <Link to="/gps">
                        <Button variant="hero" size="sm">
                          <Satellite className="w-4 h-4 mr-2" />
                          Start Sharing Your Location
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    liveVanLocations.map(van => (
                      <Card
                        key={van.id}
                        className={`hover:shadow-glow transition-all duration-300 cursor-pointer ${
                          selectedLocation?.id === van.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleLocationClick(van)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Truck className="w-6 h-6 text-primary" />
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{van.name}</p>
                              <p className="text-sm text-muted-foreground">{van.description}</p>
                            </div>
                            <Badge variant={van.status === 'traveling' ? 'default' : 'secondary'}>
                              {van.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {/* Regular location list */}
              {selectedFilter !== "live_vans" && selectedFilter !== "members" && (
                <>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-4">
                            <div className="h-4 bg-muted rounded mb-2"></div>
                            <div className="h-3 bg-muted rounded w-2/3"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : locations.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No live Supabase locations found for this filter. Verified official anchors remain available in All Locations.</p>
                      <Button variant="outline" onClick={fetchLocations}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {locations.map((location) => {
                        const config = locationTypeConfig[location.type] || locationTypeConfig.poi;
                        return (
                          <Card
                            key={location.id}
                            className={`hover:shadow-glow transition-all duration-300 cursor-pointer ${
                              selectedLocation?.id === location.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => handleLocationClick(location)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    {location.name}
                                    {location.verified && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Star className="w-3 h-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </CardTitle>
                                  <p className="text-sm text-muted-foreground">{config.label}</p>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                              {location.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {location.description}
                                </p>
                              )}

                              {location.rating && location.rating > 0 && (
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-secondary fill-current" />
                                    <span className="text-sm font-medium">{location.rating}</span>
                                    {location.reviews_count && (
                                      <span className="text-sm text-muted-foreground">({location.reviews_count})</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {location.amenities && location.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {location.amenities.slice(0, 4).map((amenity) => (
                                    <Badge key={amenity} variant="secondary" className="text-xs">
                                      {amenity.replace('_', ' ')}
                                    </Badge>
                                  ))}
                                  {location.amenities.length > 4 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{location.amenities.length - 4} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Members filter */}
              {selectedFilter === "members" && (
                <div className="space-y-3">
                  {memberLocations.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No members sharing location.</p>
                    </div>
                  ) : (
                    memberLocations.map(member => (
                      <Card
                        key={member.id}
                        className="hover:shadow-glow transition-all duration-300 cursor-pointer"
                        onClick={() => handleLocationClick({
                          id: member.id,
                          name: `Van Lifer - ${member.status}`,
                          latitude: member.latitude,
                          longitude: member.longitude,
                          type: 'live_member' as LocationType,
                        })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{member.status}</p>
                              <p className="text-xs text-muted-foreground">{member.message || 'Available'}</p>
                            </div>
                            <Badge variant="secondary">{member.status}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // List View
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allMapLocations.map((location) => {
                const config = locationTypeConfig[location.type] || locationTypeConfig.poi;
                const isLiveVan = location.type === ('live_van' as LocationType);
                return (
                  <Card key={location.id} className="hover:shadow-glow transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {isLiveVan ? (
                          <div className="relative">
                            <Truck className="w-5 h-5 text-primary" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          </div>
                        ) : (
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: config.color }}
                          />
                        )}
                        {location.name}
                        {isLiveVan && (
                          <Badge variant="default" className="text-xs">LIVE</Badge>
                        )}
                        {location.type === 'live_member' && (
                          <Badge variant="secondary" className="text-xs">
                            {location.status}
                          </Badge>
                        )}
                      </CardTitle>
                      {location.description && (
                        <CardDescription>{location.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{isLiveVan ? 'Live Van' : config.label}</Badge>
                        {location.rating && location.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-secondary fill-current" />
                            <span className="text-sm">{location.rating}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Map;
