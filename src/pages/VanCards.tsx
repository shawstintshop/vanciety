import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle, IdCard } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import VanCard, { VanCardProfile } from "@/components/VanCard";

const VanCards = () => {
  const [profiles, setProfiles] = useState<VanCardProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, created_at, van_type")
        // van_type tolerated if absent — VanCard handles a null value gracefully
        .order("created_at", { ascending: false });

      if (!active) return;

      if (fetchError) {
        setError(fetchError.message);
        setProfiles([]);
      } else {
        setProfiles(data ?? []);
      }
      setLoading(false);
    };

    fetchProfiles();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="vanciety-page vanciety-page--cards min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection
          image="/images/sprinter-white-4x4.png"
          badge="Van Cards"
          title="Meet the"
          accent="Vanciety community."
          subtitle="Every member gets a Van Card — their rig, their build, their story."
        />

        {/* Create Your Van Card CTA */}
        <section className="bg-card border-b border-border py-14">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-background p-8 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <IdCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground">Create Your Van Card</h2>
                  <p className="text-muted-foreground">Join Vanciety and add your rig, build, and story to the community.</p>
                </div>
              </div>
              <Button asChild size="lg" className="bg-primary text-black font-semibold hover:bg-amber-500">
                <Link to="/auth">Create Your Van Card</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-4 p-6 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-14 h-14 rounded-full" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="max-w-md mx-auto text-center py-16">
                <div className="w-16 h-16 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Could not load Van Cards
                </h2>
                <p className="text-muted-foreground">{error}</p>
              </div>
            )}

            {!loading && !error && profiles.length === 0 && (
              <div className="max-w-md mx-auto text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No members yet</h2>
                <p className="text-muted-foreground">
                  Be the first to join the Vanciety community.
                </p>
              </div>
            )}

            {!loading && !error && profiles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {profiles.map((profile) => (
                  <VanCard key={profile.id} profile={profile} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default VanCards;
