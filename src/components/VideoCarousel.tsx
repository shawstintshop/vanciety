import { Button } from "@/components/ui/button";
import { Play, Clock, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const VideoCarousel = () => {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeaturedVideos = async () => {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching featured videos:', error);
        return;
      }

      setVideos(data || []);
    };

    fetchFeaturedVideos();
  }, []);

  const openVideo = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  };

  return (
    <section id="video-section" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Real Van Life
            </span>
            <span className="text-foreground"> YouTube Videos</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Found {videos.length} real van life videos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border"
              onClick={() => openVideo(video.youtube_id)}
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/640x360/374151/ffffff?text=Van+Life';
                  }}
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <Button variant="secondary" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6" />
                  </Button>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {video.duration}
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {video.title}
                </h4>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="text-xs">{video.channel_title}</span>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {video.view_count >= 1000000 
                      ? `${(video.view_count / 1000000).toFixed(1)}M`
                      : video.view_count >= 1000 
                      ? `${(video.view_count / 1000).toFixed(0)}K`
                      : video.view_count
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading van life videos...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoCarousel;