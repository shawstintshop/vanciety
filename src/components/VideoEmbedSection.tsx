import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, X, ExternalLink, ShieldCheck } from "lucide-react";
import { verifiedVideos } from "@/data/vancietyVerified";

const VideoEmbedSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(verifiedVideos[0]?.youtubeId ?? null);

  const VideoEmbed = ({ embedId, title }: { embedId: string; title: string }) => (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-hero">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${embedId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0"
      />
    </div>
  );

  const selected = verifiedVideos.find((video) => video.youtubeId === selectedVideo);

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-600 text-white">
            <ShieldCheck className="w-3 h-3 mr-1" />
            YouTube oEmbed verified
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Watch Real Builds
            </span>
            <span className="text-foreground"> and Road Content</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch real van-life videos, build tours, tips, and adventure clips. Choose a card to swap the featured player.
          </p>
        </div>

        {selected && (
          <div className="mb-12 max-w-5xl mx-auto">
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <VideoEmbed embedId={selected.youtubeId} title={selected.title} />
              <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-xl">{selected.title}</h3>
                  <p className="text-sm text-muted-foreground">{selected.channel} • {selected.sourceQuery}</p>
                </div>
                <Button asChild variant="outline">
                  <a href={`https://www.youtube.com/watch?v=${selected.youtubeId}`} target="_blank" rel="noreferrer">
                    Open on YouTube <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedVideos.map((video) => (
            <Card
              key={video.youtubeId}
              className="group bg-gradient-card hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
              onClick={() => setSelectedVideo(video.youtubeId)}
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="hero" size="icon" className="shadow-lg">
                    <Play className="w-6 h-6" />
                  </Button>
                </div>

                <div className="absolute top-3 left-3 bg-gradient-sunset px-2 py-1 rounded text-white text-xs font-semibold">
                  {video.category}
                </div>
              </div>

              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-1">{video.channel}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/videos">Browse All Videos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoEmbedSection;
