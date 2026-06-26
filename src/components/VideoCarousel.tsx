import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Eye, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { verifiedVideos } from "@/data/vancietyVerified";
import { Link } from "react-router-dom";

const fallbackVideos = verifiedVideos.map((video) => ({
  id: video.youtubeId,
  youtube_id: video.youtubeId,
  title: video.title,
  thumbnail_url: video.thumbnail,
  channel_title: video.channel,
  duration: "live link",
  view_count: null,
  source_badge: "VERIFIED",
}));

type CarouselVideo = {
  id?: string;
  youtube_id: string;
  title: string;
  thumbnail_url: string;
  channel_title?: string | null;
  duration?: string | null;
  view_count?: number | null;
  source_badge?: string | null;
};

const VideoCarousel = () => {
  const [videos, setVideos] = useState<CarouselVideo[]>(fallbackVideos);
  const [source, setSource] = useState<"SUPABASE" | "VERIFIED">("VERIFIED");

  useEffect(() => {
    const fetchFeaturedVideos = async () => {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(6);

      if (error || !data || data.length === 0) {
        console.info('Using verified fallback videos for homepage carousel', error?.message);
        setVideos(fallbackVideos);
        setSource("VERIFIED");
        return;
      }

      setVideos(data as unknown as CarouselVideo[]);
      setSource("SUPABASE");
    };

    fetchFeaturedVideos();
  }, []);

  const openVideo = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  };

  return (
    <section id="video-section" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <Badge className="mb-3 bg-blue-600 text-white">
              <ShieldCheck className="w-3 h-3 mr-1" />
              {source === "SUPABASE" ? "Live Supabase feed" : "Verified YouTube fallback"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Real Van Life
              </span>
              <span className="text-foreground"> YouTube Videos</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Showing {videos.length} real YouTube videos. Fallback IDs were validated through YouTube oEmbed.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/videos">Open full video library</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <div
              key={video.id || video.youtube_id}
              className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border"
              onClick={() => openVideo(video.youtube_id)}
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544978503-7ad5ac882d5d?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <Button variant="secondary" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6" />
                  </Button>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {video.duration || "YouTube"}
                </div>
                {(video.source_badge || source) && (
                  <div className="absolute top-2 left-2 bg-blue-600 px-2 py-1 rounded text-white text-xs font-semibold">
                    {video.source_badge || source}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {video.title}
                </h4>

                <div className="flex items-center justify-between text-sm text-muted-foreground gap-3">
                  <span className="text-xs truncate">{video.channel_title || "Verified YouTube"}</span>
                  <div className="flex items-center shrink-0">
                    <Eye className="w-4 h-4 mr-1" />
                    {video.view_count
                      ? video.view_count >= 1000000
                        ? `${(video.view_count / 1000000).toFixed(1)}M`
                        : video.view_count >= 1000
                          ? `${(video.view_count / 1000).toFixed(0)}K`
                          : video.view_count
                      : "verified"
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;
