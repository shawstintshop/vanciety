/**
 * LatestVideos — Homepage section showing the 9 newest van life videos.
 *
 * Design: 3-column compact grid, topo-card backgrounds, brass accent badges.
 * Notification bell shows unseen count; clicking a card marks it seen.
 * "View all videos →" routes to /videos and marks all as seen.
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Bell, BellRing, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLatestVideos } from "@/hooks/useLatestVideos";
import { useToast } from "@/hooks/use-toast";

export default function LatestVideos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { homepageVideos, newCount, seenIds, markSeen, markAllSeen } = useLatestVideos();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Show toast at most once per day — only when there are genuinely unseen videos
  useEffect(() => {
    if (newCount <= 0) return;
    const TOAST_KEY = "vanciety_video_toast_date";
    const today = new Date().toDateString();
    if (localStorage.getItem(TOAST_KEY) === today) return;
    localStorage.setItem(TOAST_KEY, today);
    const timer = setTimeout(() => {
      toast({
        title: `${newCount} new van life video${newCount > 1 ? "s" : ""} 🎬`,
        description: "Fresh uploads from your favourite channels are ready.",
        duration: 5000,
      });
    }, 3000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoClick = (youtubeId: string) => {
    markSeen(youtubeId);
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, "_blank", "noopener,noreferrer");
  };

  const handleViewAll = () => {
    markAllSeen();
    navigate("/videos");
  };

  return (
    <section className="py-14 topo-section-dense">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Play className="w-4 h-4 fill-primary text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Latest Videos
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              Fresh from the Community
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Van tours, builds, Sprinter mechanics, Revel mods &amp; more — updated daily
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
              title={newCount > 0 ? `${newCount} new videos` : "All caught up"}
              onClick={() => {
                if (newCount > 0) {
                  toast({
                    title: `${newCount} new video${newCount > 1 ? "s" : ""} waiting`,
                    description: "Scroll down to see the latest uploads.",
                    duration: 3000,
                  });
                }
              }}
            >
              {newCount > 0 ? (
                <>
                  <BellRing className="w-5 h-5 text-primary animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-[10px] font-bold text-background rounded-full flex items-center justify-center px-1">
                    {newCount}
                  </span>
                </>
              ) : (
                <Bell className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAll}
              className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all"
            >
              All Videos
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* ── 3×3 Video Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {homepageVideos.map((video, idx) => {
            const isNew = !seenIds.has(video.youtubeId);
            const isHovered = hoveredId === video.youtubeId;

            return (
              <div
                key={video.youtubeId}
                className={`
                  group relative rounded-xl overflow-hidden cursor-pointer
                  bg-card border transition-all duration-200
                  ${isNew ? "border-primary/40 shadow-[0_0_12px_rgba(180,140,60,0.15)]" : "border-border/40"}
                  hover:border-primary/60 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]
                  hover:-translate-y-0.5
                `}
                style={{ animationDelay: `${idx * 60}ms` }}
                onClick={() => handleVideoClick(video.youtubeId)}
                onMouseEnter={() => setHoveredId(video.youtubeId)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-zinc-900">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? "scale-105" : "scale-100"}`}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = "1";
                        img.src = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
                      }
                    }}
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Play button */}
                  <div className={`
                    absolute inset-0 flex items-center justify-center
                    transition-opacity duration-200
                    ${isHovered ? "opacity-100" : "opacity-0"}
                  `}>
                    <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-background text-background ml-0.5" />
                    </div>
                  </div>

                  {/* NEW badge */}
                  {isNew && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-background rounded-full shadow">
                        New
                      </span>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-black/60 text-white/80 rounded-full backdrop-blur-sm border border-white/10">
                      {video.categoryLabel}
                    </span>
                  </div>

                  {/* YouTube icon bottom-right */}
                  <div className="absolute bottom-2 right-2 opacity-70">
                    <svg className="w-5 h-3.5" viewBox="0 0 90 20" fill="none">
                      <rect width="90" height="20" rx="4" fill="#FF0000" />
                      <polygon points="35,4 35,16 55,10" fill="white" />
                      <text x="60" y="14" fontSize="9" fill="white" fontFamily="Arial" fontWeight="bold">YouTube</text>
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className={`text-sm font-semibold leading-snug line-clamp-2 mb-1 transition-colors ${isHovered ? "text-primary" : "text-foreground"}`}>
                    {video.title}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground truncate">{video.channel}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer CTA ── */}
        <div className="mt-8 text-center">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors group"
          >
            Browse all categories — Van Tours, Sprinter Mechanics, Revel Mods &amp; more
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
