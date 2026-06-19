import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Zap, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PremiumSection = () => {
  const navigate = useNavigate();
  const features = [
    "Access to 10K+ premium camp spots",
    "Unlimited video streaming in 4K",
    "Priority forum support & badges",
    "Exclusive member-only events",
    "Advanced map filters & offline mode",
    "Premium van build tutorials",
    "Direct messaging with top builders",
    "Early access to new features"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-sunset px-4 py-2 rounded-full text-white font-semibold mb-6 shadow-glow">
            <Crown className="w-4 h-4" />
            <span>Premium Membership</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Unlock the </span>
            <span className="bg-gradient-sunset bg-clip-text text-transparent">
              Ultimate
            </span>
            <br />
            <span className="text-foreground">Van Life Experience</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of premium members and access exclusive content, 
            secret locations, and advanced features for just $9.99/month
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Premium Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-sunset blur-lg opacity-20 rounded-2xl"></div>
            <div className="relative bg-gradient-card rounded-2xl p-8 shadow-hero border border-border/50">
              {/* Card Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-sunset rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Premium Membership</h3>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl font-bold bg-gradient-sunset bg-clip-text text-transparent">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Cancel anytime • 7-day free trial</p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-gradient-forest rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button variant="hero" size="lg" className="w-full group" onClick={() => navigate('/auth')}>
                Start Free Trial
                <Zap className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                <Shield className="w-3 h-3 inline mr-1" />
                Secure checkout • Protected by SSL encryption
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-card rounded-xl p-6 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Exclusive Content</h4>
              <p className="text-sm text-muted-foreground">
                Access premium van builds, secret locations, and advanced tutorials
              </p>
            </div>

            <div className="bg-gradient-card rounded-xl p-6 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-forest rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">VIP Community</h4>
              <p className="text-sm text-muted-foreground">
                Connect with top van builders and experienced travelers
              </p>
            </div>

            <div className="bg-gradient-card rounded-xl p-6 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Priority Support</h4>
              <p className="text-sm text-muted-foreground">
                Get fast help from our expert team and community moderators
              </p>
            </div>

            <div className="bg-gradient-card rounded-xl p-6 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Early Access</h4>
              <p className="text-sm text-muted-foreground">
                Be first to try new features and exclusive beta content
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center space-x-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">12,000+</span>
              <span>Premium Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-secondary" />
              <span className="font-semibold">4.9/5</span>
              <span>Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-secondary" />
              <span className="font-semibold">98%</span>
              <span>Renewal Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;