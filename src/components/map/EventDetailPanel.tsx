import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar, MapPin, Users, Clock, ExternalLink, X,
  Ticket, Star, Navigation, Share2, ChevronRight
} from "lucide-react";

export interface MapEvent {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  start_date: string;
  end_date?: string;
  city: string;
  state: string;
  venue_name?: string;
  latitude: number;
  longitude: number;
  category: string;
  cost_info?: string;
  registration_url?: string;
  expected_attendance?: number;
  rsvp_count?: number;
  tags?: string[];
  contact_name?: string;
  contact_email?: string;
  image_url?: string;
}

interface EventDetailPanelProps {
  event: MapEvent | null;
  onClose: () => void;
}

const categoryConfig: Record<string, { color: string; emoji: string; label: string }> = {
  rally: { color: "bg-red-500", emoji: "🚐", label: "Van Rally" },
  expo: { color: "bg-blue-500", emoji: "🎪", label: "Expo" },
  meetup: { color: "bg-teal-500", emoji: "🤝", label: "Meetup" },
  workshop: { color: "bg-yellow-500", emoji: "🔧", label: "Workshop" },
  gathering: { color: "bg-orange-500", emoji: "🏕️", label: "Gathering" },
};

const EventDetailPanel = ({ event, onClose }: EventDetailPanelProps) => {
  if (!event) return null;

  const config = categoryConfig[event.category] || categoryConfig.meetup;
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.name, text: event.short_description || event.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`, "_blank");
  };

  return (
    <div className="absolute inset-y-0 right-0 w-full sm:w-[420px] bg-background/95 backdrop-blur-xl border-l border-border/60 shadow-2xl z-[1000] overflow-y-auto animate-in slide-in-from-right-full duration-300">
      {/* Hero image or gradient */}
      <div className={`relative h-48 ${config.color} bg-opacity-90`}>
        {event.image_url ? (
          <img src={event.image_url} alt={event.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent flex items-center justify-center">
            <span className="text-7xl">{config.emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <Badge className={`${config.color} text-white text-xs`}>
            {config.emoji} {config.label}
          </Badge>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-2xl font-bold leading-tight">{event.name}</h2>
          <div className="flex items-center gap-2 mt-1 text-white/80 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            {event.venue_name ? `${event.venue_name}, ` : ""}
            {event.city}, {event.state}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Date & Time */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
          <Calendar className="w-5 h-5 text-orange-500 mt-0.5" />
          <div>
            <p className="font-semibold">{formatDate(startDate)}</p>
            {endDate && <p className="text-sm text-muted-foreground">→ {formatDate(endDate)}</p>}
            <p className="text-sm text-muted-foreground">{formatTime(startDate)}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {event.cost_info && (
            <div className="text-center p-3 rounded-xl bg-muted/30">
              <Ticket className="w-5 h-5 mx-auto text-green-500 mb-1" />
              <p className="text-sm font-semibold">{event.cost_info}</p>
              <p className="text-xs text-muted-foreground">Cost</p>
            </div>
          )}
          {event.expected_attendance && (
            <div className="text-center p-3 rounded-xl bg-muted/30">
              <Users className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <p className="text-sm font-semibold">{event.expected_attendance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Expected</p>
            </div>
          )}
          {event.rsvp_count !== undefined && (
            <div className="text-center p-3 rounded-xl bg-muted/30">
              <Star className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
              <p className="text-sm font-semibold">{event.rsvp_count}</p>
              <p className="text-xs text-muted-foreground">Going</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">About This Event</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {event.registration_url && (
            <Button asChild variant="hero" className="w-full" size="lg">
              <a href={event.registration_url} target="_blank" rel="noreferrer">
                <Ticket className="w-4 h-4 mr-2" />
                Register / Get Tickets
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleDirections}>
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Contact */}
        {event.contact_name && (
          <div className="rounded-xl border p-4">
            <h4 className="text-sm font-semibold mb-1">Organized by</h4>
            <p className="text-sm">{event.contact_name}</p>
            {event.contact_email && (
              <a href={`mailto:${event.contact_email}`} className="text-sm text-primary hover:underline">
                {event.contact_email}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPanel;
