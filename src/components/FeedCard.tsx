/**
 * FeedCard — displays a single content feed item.
 * Used on both the Home page feed section and the News page.
 *
 * Thumbnail handling:
 * - Real image: shown with hover zoom + YouTube play button overlay
 * - null thumbnail: category-branded gradient with large emoji — never a broken image
 */
import { ExternalLink, Play, Clock } from "lucide-react";
import { CATEGORY_META, type FeedItem } from "@/hooks/useContentFeed";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

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

// Category-branded gradient backgrounds for when there's no thumbnail
const CATEGORY_GRADIENTS: Record<string, string> = {
  youtube:  "from-red-950/80 via-red-900/60 to-zinc-900",
  news:     "from-blue-950/80 via-blue-900/60 to-zinc-900",
  products: "from-amber-950/80 via-amber-900/60 to-zinc-900",
  how_to:   "from-green-950/80 via-green-900/60 to-zinc-900",
  stealth:  "from-indigo-950/80 via-indigo-900/60 to-zinc-900",
  overland: "from-orange-950/80 via-orange-900/60 to-zinc-900",
  builds:   "from-purple-950/80 via-purple-900/60 to-zinc-900",
  camping:  "from-teal-950/80 via-teal-900/60 to-zinc-900",
};

export default function FeedCard({ item, compact = false }: FeedCardProps) {
  const meta = CATEGORY_META[item.category] ?? CATEGORY_META.news;
  const isYouTube = item.category === "youtube";
  const gradient = CATEGORY_GRADIENTS[item.category] ?? CATEGORY_GRADIENTS.news;

  // Track if the real image failed to load so we can fall back to the gradient
  const [imgFailed, setImgFailed] = useState(false);
  const showRealImage = !!item.thumbnail_url && !imgFailed;

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
      {/* Thumbnail area */}
      <div
        className={`relative overflow-hidden flex-shrink-0
          ${compact ? "w-20 h-16 rounded-lg" : "aspect-video w-full"}`}
      >
        {showRealImage ? (
          <img
            src={item.thumbnail_url!}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          // Branded gradient fallback — never a broken image
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className={compact ? "text-xl" : "text-4xl opacity-60"}>{meta.emoji}</span>
          </div>
        )}

        {/* YouTube play button */}
        {isYouTube && !compact && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center
              group-hover:bg-red-600 transition-colors duration-200">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Category badge — top left of image */}
        {!compact && (
          <div className="absolute top-2 left-2">
            <span className={`text-xs font-medium text-white px-2 py-0.5 rounded-full ${meta.color}`}>
              {meta.emoji} {meta.label}
            </span>
          </div>
        )}
      </div>

      {/* Text content */}
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

        <div className={`flex items-center gap-2 text-xs text-muted-foreground ${compact ? "mt-1" : ""}`}>
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
