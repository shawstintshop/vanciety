/**
 * FeedCard — displays a single content feed item.
 * Used on both the Home page feed section and the News page.
 */
import { ExternalLink, Play, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_META, type FeedItem } from "@/hooks/useContentFeed";
import { formatDistanceToNow } from "date-fns";

interface FeedCardProps {
  item: FeedItem;
  compact?: boolean;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "";
  }
}

export default function FeedCard({ item, compact = false }: FeedCardProps) {
  const meta = CATEGORY_META[item.category] ?? CATEGORY_META.news;
  const isYouTube = item.category === "youtube";

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-xl border border-border/40 bg-card overflow-hidden
        hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5
        transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-primary ${compact ? "flex gap-3 p-3" : ""}`}
    >
      {/* Thumbnail */}
      {item.thumbnail_url ? (
        <div
          className={`relative overflow-hidden bg-muted flex-shrink-0
            ${compact ? "w-20 h-16 rounded-lg" : "aspect-video w-full"}`}
        >
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {isYouTube && !compact && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center
                group-hover:bg-red-600 transition-colors duration-200">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            </div>
          )}
          <div className={`absolute top-2 left-2 ${compact ? "hidden" : ""}`}>
            <span className={`text-xs font-medium text-white px-2 py-0.5 rounded-full ${meta.color}`}>
              {meta.emoji} {meta.label}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`bg-muted flex items-center justify-center flex-shrink-0
            ${compact ? "w-20 h-16 rounded-lg" : "aspect-video w-full"}`}
        >
          <span className="text-2xl">{meta.emoji}</span>
        </div>
      )}

      {/* Content */}
      <div className={compact ? "flex-1 min-w-0" : "p-4"}>
        {compact && (
          <span className={`text-xs font-medium text-white px-1.5 py-0.5 rounded ${meta.color} mb-1 inline-block`}>
            {meta.label}
          </span>
        )}

        <h3 className={`font-semibold text-foreground group-hover:text-primary transition-colors
          line-clamp-2 leading-snug ${compact ? "text-sm" : "text-base mb-2"}`}>
          {item.title}
        </h3>

        {!compact && item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.description}
          </p>
        )}

        <div className={`flex items-center gap-2 text-xs text-muted-foreground
          ${compact ? "mt-1" : ""}`}>
          {item.source_name && (
            <span className="font-medium truncate max-w-[120px]">{item.source_name}</span>
          )}
          {item.published_at && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {timeAgo(item.published_at)}
              </span>
            </>
          )}
          {!compact && (
            <ExternalLink className="w-3 h-3 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
    </a>
  );
}
