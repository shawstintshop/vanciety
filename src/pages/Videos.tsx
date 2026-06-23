import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Play, Clock, Eye, Star, Crown, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useYouTubeSync } from "@/hooks/useYouTubeSync";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import AIVanConcierge from "@/components/AIVanConcierge";
import Seo from "@/components/Seo";
import { verifiedVideos } from "@/data/vancietyVerified";
import { useLatestVideos, LATEST_VIDEOS } from "@/hooks/useLatestVideos";

const verifiedVideoFallback = verifiedVideos.map((video) => ({
  id: video.youtubeId,
  youtube_id: video.youtubeId,
  title: video.title,
  description: `Van-life video from ${video.channel}.`,
  // Always derive thumbnail from YouTube CDN — never undefined
  thumbnail_url: video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
  channel_title: video.channel,
  category: video.category,
  published_at: new Date().toISOString(),
  duration: null,
  view_count: null,
  source_badge: "VERIFIED",
}));

const Videos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sourceNote, setSourceNote] = useState<string>("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast();
  const { markAllSeen } = useLatestVideos();
  
  // Auto-sync YouTube videos daily
  useYouTubeSync();

  // Mark all videos as seen when user visits the Videos page
  useEffect(() => {
    markAllSeen();
  }, [markAllSeen]);

  const videoCategories = [
    { id: "all",                name: "All Videos" },
    { id: "van-tours",          name: "Van Tours" },
    { id: "van-companies",      name: "Van Companies & Builders" },
    { id: "van-products",       name: "Van Products" },
    { id: "van-manufacturers",  name: "Van Manufacturers" },
    { id: "van-upgrades",       name: "Van Upgrades" },
    { id: "van-mechanics",      name: "Van Mechanics" },
    { id: "sprinter-mechanics", name: "Sprinter Mechanics" },
    { id: "sprinter-van",       name: "Mercedes Sprinter Vans" },
    { id: "sprinter-mods",      name: "Sprinter Mods" },
    { id: "revel-mods",         name: "Revel Van Mods" },
    { id: "builds",             name: "Electrical & Solar Builds" },
    { id: "maintenance",        name: "Maintenance & Repairs" },
    { id: "camping",            name: "Camping Spots & Travel" },
    { id: "tips",               name: "Tips, Tricks & Hacks" },
    { id: "offroad",            name: "Offroad Adventures" },
    { id: "reviews",            name: "Product Reviews & Installs" },
    { id: "van-life",           name: "General Van Life" },
  ];

  // Fetch videos from database
  const fetchVideos = async () => {
    try {
      let query = supabase
        .from('youtube_videos')
        .select('*')
        .order('published_at', { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,channel_title.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error fetching videos:', error);
        setSourceNote('');
        setVideos(verifiedVideoFallback);
        return;
      }

      setVideos(data && data.length ? data : verifiedVideoFallback);
      setSourceNote('');
    } catch (error) {
      console.error('Error:', error);
      setSourceNote('');
      setVideos(verifiedVideoFallback);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Refresh videos from YouTube API
  const refreshFromYouTube = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-youtube-videos', {
        body: { maxResults: 50, forceRefresh: true }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Fetched ${data.count} real van life videos from YouTube!`,
      });

      setSourceNote('');

      // Refresh the local data
      await fetchVideos();
    } catch (error) {
      console.error('Error refreshing videos:', error);
      setSourceNote('');
      toast({
        title: "Refresh unavailable",
        description: "Could not refresh right now. Curated van life videos are still available below.",
      });
      setVideos(verifiedVideoFallback);
    } finally {
      setRefreshing(false);
    }
  };

  // Format view count for display
  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Open YouTube video in new tab
  const openVideo = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  };

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory, searchQuery]);

  // Initial data load — silently fall back to curated videos if DB is empty.
  // Never call refreshFromYouTube on mount; that triggers the edge function and
  // shows an error toast if it fails, which is jarring on first load.
  useEffect(() => {
    // fetchVideos already falls back to verifiedVideoFallback if DB is empty.
    // Nothing extra needed here.
  }, []);

  return (
    <div className="vanciety-page vanciety-page--videos min-h-screen bg-background">
      <Seo
        title="Vanciety Videos | Verified Van Build, Repair, and Travel Videos"
        description="Watch van life videos for builds, repairs, installs, travel, and product walkthroughs."
        canonicalPath="/videos"
      />
      <Header />
      
      <main className="pt-16">
        <PageHero
          label="Video Library"
          title="Van Life Videos"
          subtitle="Real YouTube van builds, electrical tutorials, event videos, and off-road van content with verified links."
          icon={Play}
        >
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search videos, channels, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/60 border-border/60"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {videoCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "hero" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </PageHero>

        <section className="container mx-auto px-4">
          <div className="relative">
            <div className="pointer-events-none absolute -right-1 top-2 z-20 rounded-full border border-primary/30 bg-background/85 px-2 py-1 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <svg width="16" height="12" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Vanna">
                  <rect x="4" y="14" width="52" height="26" rx="5" fill="#F97316" />
                  <rect x="8" y="8" width="32" height="10" rx="4" fill="#EA580C" />
                  <rect x="10" y="10" width="14" height="8" rx="2" fill="#BAE6FD" opacity="0.9" />
                  <circle cx="16" cy="40" r="7" fill="#1C1917" />
                  <circle cx="48" cy="40" r="7" fill="#1C1917" />
                </svg>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Vanna</span>
              </div>
            </div>
            <AIVanConcierge mode="video" compact />
          </div>
        </section>

        {/* Video Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Header with refresh button */}
            {sourceNote && (
              <div className="mb-4 rounded-2xl border border-white/10 bg-card/70 p-4 text-sm text-muted-foreground">
                {sourceNote}
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === "all" ? "Latest Videos" : videoCategories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <Button 
                variant="outline" 
                onClick={refreshFromYouTube}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh from YouTube'}
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No videos found for this filter. Try a different category or clear your search.</p>
                <Button onClick={refreshFromYouTube} disabled={refreshing}>
                  {refreshing ? 'Loading...' : 'Load Videos'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="group bg-gradient-card hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                    onClick={() => openVideo(video.youtube_id)}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to maxresdefault if hqdefault fails
                          const img = e.currentTarget;
                          if (!img.dataset.fallback) {
                            img.dataset.fallback = '1';
                            img.src = `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;
                          }
                        }}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button variant="hero" size="icon" className="shadow-lg">
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                      </div>

                      {/* Duration */}
                      {video.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-white text-xs flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {video.duration}
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-primary/90 px-2 py-1 rounded text-primary-foreground text-xs font-semibold">
                        {videoCategories.find(c => c.id === video.category)?.name || 'Van Life'}
                      </div>

                      {video.source_badge && (
                        <div className="absolute top-3 right-3 bg-secondary/90 px-2 py-1 rounded text-secondary-foreground text-xs font-semibold">
                          {video.source_badge}
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </CardTitle>
                      <CardDescription className="mb-3 line-clamp-1">
                        {video.channel_title || 'Verified YouTube source'}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {video.view_count ? formatViewCount(video.view_count) : 'verified'}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-secondary" />
                            {video.published_at ? new Date(video.published_at).toLocaleDateString() : 'live link'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More */}
            {videos.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" onClick={fetchVideos}>
                  Load More Videos
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Videos;