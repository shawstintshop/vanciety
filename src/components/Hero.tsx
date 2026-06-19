import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, MapPin, Star, Crown } from "lucide-react";
import heroImage from "@/assets/hero-van-lake.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToVideos = () => {
    const el = document.getElementById("video-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Beautiful van by mountain lake" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-sunset px-4 py-2 rounded-full text-white font-semibold mb-6 shadow-glow">
            <Crown className="w-4 h-4" />
            <span>Join 50K+ Van Lifers</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Your Ultimate
            </span>
            <br />
            <span className="text-foreground">Van Life Community</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with fellow adventurers, discover hidden gems, stream exclusive content, 
            and build the van life of your dreams with our all-in-one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Button variant="hero" size="lg" className="group" onClick={() => navigate('/auth')}>
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" className="group" onClick={scrollToVideos}>
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary mr-2" />
                <span className="text-2xl font-bold text-foreground">50K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 text-secondary mr-2" />
                <span className="text-2xl font-bold text-foreground">25K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Camp Spots</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Play className="w-6 h-6 text-accent mr-2" />
                <span className="text-2xl font-bold text-foreground">10K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Videos</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-secondary mr-2" />
                <span className="text-2xl font-bold text-foreground">4.9</span>
              </div>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;