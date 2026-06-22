import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, ArrowRight, Package, Tag, Truck, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VancietyShop = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await supabase.from("newsletter_subscribers").insert({
        email: email.trim(),
        interests: ["shop"],
      });
    } catch {
      // Silent — still show success even if insert fails
    }

    setSubmitted(true);
    toast({
      title: "You're on the list!",
      description: "We'll email you when the Vanciety Shop launches.",
    });
    setEmail("");
  };

  const features = [
    {
      icon: Package,
      title: "Van Life Essentials",
      description: "Curated gear, tools, and accessories picked by the community.",
    },
    {
      icon: Tag,
      title: "Community Pricing",
      description: "Member discounts and deals from verified van life brands.",
    },
    {
      icon: Truck,
      title: "Ship Anywhere",
      description: "Delivered to your home, a friend's address, or a pickup location.",
    },
    {
      icon: Shield,
      title: "Trusted Sellers",
      description: "Every product vetted by the Vanciety team before it goes live.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="vanciety-hero-topo py-20">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <ShoppingBag className="w-4 h-4" />
              Coming Soon
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              The Vanciety Shop
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              A curated store for van lifers — gear, tools, and accessories picked by the community. Launching soon.
            </p>

            {!submitted ? (
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" className="shrink-0">
                  Notify Me
                </Button>
              </form>
            ) : (
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-6 py-3 rounded-lg font-medium">
                ✓ You're on the list — we'll let you know when we launch!
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 p-6 rounded-xl border border-border/60 bg-card"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA to Marketplace */}
        <section className="py-12 border-t border-border/40">
          <div className="container mx-auto px-4 text-center max-w-xl">
            <h2 className="text-xl font-semibold mb-2">Need something now?</h2>
            <p className="text-muted-foreground mb-6">
              The community marketplace has vans, parts, and gear listed by real van lifers — available today.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/marketplace")}
              className="gap-2"
            >
              Browse the Marketplace
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VancietyShop;
