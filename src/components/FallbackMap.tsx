import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Users, Tent, Coffee, Star } from "lucide-react";

interface Location {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: string;
  amenities?: string[];
}

interface FallbackMapProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}

const FallbackMap = ({ locations, onLocationClick }: FallbackMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'campsite': return <Tent className="w-4 h-4" />;
      case 'business': return <Coffee className="w-4 h-4" />;
      case 'meetup': return <Users className="w-4 h-4" />;
      case 'event': return <Star className="w-4 h-4" />;
      case 'driveway': return <Coffee className="w-4 h-4" />;
      case 'live_member': return <Users className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'campsite': return '#22c55e';
      case 'business': return '#3b82f6';
      case 'meetup': return '#f59e0b';
      case 'event': return '#ec4899';
      case 'driveway': return '#8b5cf6';
      case 'live_member': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    onLocationClick?.(location);
  };

  return (
    <div className="w-full h-full min-h-[520px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-muted/30"></div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Location Markers */}
      <div className="absolute inset-0 p-4">
        {locations.map((location, index) => {
          // Simple positioning based on lat/lng (not geographically accurate but functional)
          const x = ((location.longitude + 180) / 360) * 100;
          const y = ((90 - location.latitude) / 180) * 100;
          
          return (
            <div
              key={location.id}
              className="absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${Math.max(10, Math.min(90, x))}%`,
                top: `${Math.max(10, Math.min(90, y))}%`,
              }}
              onClick={() => handleLocationClick(location)}
            >
              {/* Marker */}
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transform transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: getLocationColor(location.type) }}
              >
                {getLocationIcon(location.type)}
              </div>
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap border border-border/50">
                <p className="text-sm font-medium">{location.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {location.type}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getLocationColor(selectedLocation.type) }}
                />
                {selectedLocation.name}
              </h3>
              {selectedLocation.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {selectedLocation.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {selectedLocation.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Approximate map area only
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLocation(null)}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Map Info Overlay */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-border/50">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Vanciety Map Preview</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {locations.length} source/member areas • Click markers for details
        </p>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button variant="outline" size="icon" className="bg-background/90">
          <Navigation className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="bg-background/90">
          <MapPin className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FallbackMap;