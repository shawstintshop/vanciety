import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Camera, ShieldCheck } from "lucide-react";

interface VancietyConceptVisualProps {
  src: string;
  alt: string;
  title: string;
  caption: string;
  badge?: string;
  className?: string;
  imageClassName?: string;
  compact?: boolean;
}

const VancietyConceptVisual = ({
  src,
  alt,
  title,
  caption,
  badge = "Vanciety visual",
  className,
  imageClassName,
  compact = false,
}: VancietyConceptVisualProps) => (
  <figure
    className={cn(
      "vanciety-topo-card group relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-hero",
      className
    )}
  >
    <div className={cn("relative overflow-hidden", compact ? "h-[260px]" : "h-[360px] md:h-[430px]") }>
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]",
          imageClassName
        )}
        loading={compact ? "lazy" : "eager"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/92 via-background/12 to-transparent" />
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        <Badge className="bg-primary/90 text-primary-foreground">
          <Camera className="mr-1 h-3.5 w-3.5" />
          {badge}
        </Badge>
        <Badge variant="secondary" className="bg-background/82 backdrop-blur">
          <ShieldCheck className="mr-1 h-3.5 w-3.5" />
          Source links verified separately
        </Badge>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-xl font-bold text-foreground md:text-2xl">{title}</h3>
        {!compact && <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/88">{caption}</p>}
      </div>
    </div>
    {compact && (
      <figcaption className="border-t border-border/70 bg-background/86 p-4 text-sm leading-relaxed text-muted-foreground backdrop-blur">
        <span className="font-medium text-foreground">{title}:</span> {caption}
      </figcaption>
    )}
  </figure>
);

export default VancietyConceptVisual;
