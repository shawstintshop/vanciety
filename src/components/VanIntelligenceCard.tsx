import { ExternalLink } from "lucide-react";
import SourceBadge from "./SourceBadge";

interface VanIntelligenceCardProps {
  title: string;
  description: string;
  badge: string;
  url?: string;
  note?: string;
  tags?: string[];
  children?: React.ReactNode;
  className?: string;
}

const VanIntelligenceCard = ({
  title,
  description,
  badge,
  url,
  note,
  tags,
  children,
  className = "",
}: VanIntelligenceCardProps) => {
  return (
    <div className={`bg-card border border-border rounded-xl p-4 flex flex-col gap-3 shadow-card ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-snug">{title}</h3>
        <SourceBadge badge={badge} className="flex-shrink-0 mt-0.5" />
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>

      {note && (
        <p className="text-xs text-muted-foreground/70 italic border-l-2 border-border pl-2">{note}</p>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      {children}

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          Open source
        </a>
      )}
    </div>
  );
};

export default VanIntelligenceCard;
