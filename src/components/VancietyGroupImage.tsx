import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Users, MapPin } from "lucide-react";

const VANCIETY_GROUP_IMAGE = "/images/vanciety-group-collage.jpg";

interface VancietyGroupImageProps {
  className?: string;
  compact?: boolean;
  caption?: string;
}

const VancietyGroupImage = ({
  className,
  compact = false,
  caption = "Meetups, build help, camp meals, trail days, and route planning — the Vanciety community direction.",
}: VancietyGroupImageProps) => (
  <figure
    className={cn(
      "vanciety-topo-card group relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-hero",
      className
    )}
  >
    <img
      src={VANCIETY_GROUP_IMAGE}
      alt="Vanciety group collage showing vans, campfire meetups, van build work, shared meals, trail driving, paddling, and route planning"
      className={cn(
        "h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]",
        compact ? "min-h-[220px]" : "min-h-[340px]"
      )}
      loading={compact ? "lazy" : "eager"}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background/92 via-background/12 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 space-y-3 p-5">
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-primary/90 text-primary-foreground">
          <Users className="mr-1 h-3.5 w-3.5" />
          Vanciety group image
        </Badge>
        <Badge variant="secondary" className="bg-background/80 backdrop-blur">
          <MapPin className="mr-1 h-3.5 w-3.5" />
          Community concept
        </Badge>
      </div>
      {!compact && (
        <figcaption className="max-w-xl text-sm leading-relaxed text-foreground/88">
          {caption}
        </figcaption>
      )}
    </div>
  </figure>
);

export default VancietyGroupImage;
