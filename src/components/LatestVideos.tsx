/**
 * LatestVideos — compact homepage video section.
 *
 * Goal: keep the homepage light, show only a few real videos, and fall back
 * to verified YouTube IDs if Supabase has no rows yet.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { verifiedVideos } from "@/data/vancietyVerified";
import VancietyConceptVisual from "@/components/VancietyConceptVisual";

type CompactVideo = {
  id?: string;
  youtube_id: string;
  title: string;
  thumbnail_url: string;
  channel_title?: string | null;
  published_at?: string | null;
  source_badge?: string | null;
};

const fallbackVideos: CompactVideo[] = verifiedVideos.slice(0, 3).map((video) => ({
  id: video.youtubeId,
  youtube_id: video.youtubeId,
  title: video.title,
  thumbnail_url: video.thumbnail,
  channel_title: video.channel,
  published_at: null,
  source_badge: "VERIFIED",
}));

const LatestVideos = () => {
  const [videos, setVideos] = useState<CompactVideo[]>(fallbackVideos);
  const [source, setSource] = useState<"SUPABASE" | "VERIFIED">("VERIFIED");

  useEffect(() => {
    let alive = true;

    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("youtube_videos")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(3);

      if (!alive) return;

      if (error || !data || data.length === 0) {
        setVideos(fallbackVideos);
        setSource("VERIFIED");
        return;
      }

      setVideos(
        data.map((video: { id: string; youtube_id: string; title: string; thumbnail_url?: string; channel_title?: string; published_at?: string; source_badge?: string; }) => ({
          id: video.id,
          youtube_id: video.youtube_id,
          title: video.title,
          thumbnail_url: video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`,
          channel_title: video.channel_title,
          published_at: video.published_at,
          source_badge: video.source_badge || "LIVE DB",
        }))
      );
      setSource("SUPABASE");
    };

    fetchVideos();
    return () => {
      alive = false;
    };
  }, []);

  const openVideo = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="border-b border-border bg-background py-10 topo-section-dense">
      <div className="container mx-auto max-w-5xl px-4">
        <VancietyConceptVisual
          compact
          className="mb-6"
          src="/images/van-build-workshop.jpg"
          alt="Van build workshop image"
          title="Real videos, real builds"
          caption="A smaller, curated set of verified YouTube videos keeps the section fast and focused."
          badge="Videos"
        />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Play className="h-4 w-4 fill-primary text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Latest Videos
              </span>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {source === "SUPABASE" ? "Live DB" : "Verified fallback"}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              Fresh from the community
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Three real YouTube videos only — no filler, no placeholders.
            </p>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link to="/videos">
              Open full video library
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {videos.map((video) => (
            <div
              key={video.id || video.youtube_id}
              className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              onClick={() => openVideo(video.youtube_id)}
            >
              <div className="relative aspect-video bg-zinc-900">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute left-2 top-2">
                  <Badge className="bg-black/65 text-white hover:bg-black/65">
                    {video.source_badge || source}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2 opacity-75">
                  <ExternalLink className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="p-3">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                  {video.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {video.channel_title || "Verified YouTube"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestVideos;
