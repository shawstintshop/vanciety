import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export type LocationType = 'campsite' | 'driveway' | 'event' | 'business' | 'poi';

interface Location {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: LocationType;
  amenities?: string[];
  rating?: number;
}

interface UseLeafletMapProps {
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  locations?: Location[];
  onLocationClick?: (location: Location) => void;
}

// Location type configurations
const locationTypeConfig: Record<LocationType, { color: string; label: string; icon: string }> = {
  campsite: { color: '#10b981', label: 'Campsite', icon: '🏕️' },
  driveway: { color: '#3b82f6', label: 'Driveway', icon: '🏠' },
  event: { color: '#f59e0b', label: 'Event', icon: '🎉' },
  business: { color: '#8b5cf6', label: 'Business', icon: '🏪' },
  poi: { color: '#ef4444', label: 'POI', icon: '📍' },
};

export const useLeafletMap = ({
  center = [39.8283, -98.5795], // Center of USA
  zoom = 5,
  locations = [],
  onLocationClick
}: UseLeafletMapProps = {}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || map) return;

    const leafletMap = L.map(mapRef.current, {
      center,
      zoom,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(leafletMap);

    setMap(leafletMap);
    setIsLoaded(true);

    return () => {
      leafletMap.remove();
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    locations.forEach((location) => {
      const config = locationTypeConfig[location.type] || locationTypeConfig.poi;
      
      // Create custom icon with emoji
      const customIcon = L.divIcon({
        html: `
          <div style="
            background: ${config.color};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            ${config.icon}
          </div>
        `,
        className: 'custom-marker-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([location.latitude, location.longitude], {
        icon: customIcon,
        title: location.name,
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="max-width: 250px; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; color: ${config.color}; font-size: 16px; font-weight: bold;">
            ${location.name}
          </h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; line-height: 1.4;">
            ${location.description || 'No description available'}
          </p>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="background: ${config.color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
              ${config.label}
            </span>
            ${location.rating ? `
              <span style="color: #666; font-size: 12px;">
                ⭐ ${location.rating}/5
              </span>
            ` : ''}
          </div>
          ${location.amenities && location.amenities.length > 0 ? `
            <div style="font-size: 12px; color: #888;">
              Amenities: ${location.amenities.slice(0, 3).join(', ')}${location.amenities.length > 3 ? '...' : ''}
            </div>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add click listener
      marker.on('click', () => {
        if (onLocationClick) {
          onLocationClick(location);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (locations.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 12 });
    }
  }, [map, isLoaded, locations, onLocationClick]);

  return {
    mapRef,
    map,
    isLoaded,
    error: null, // Leaflet doesn't need API keys, so no errors expected
  };
};
