import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import VanCard, { VanCardProfile } from "@/components/VanCard";
import PageHero from "@/components/PageHero";

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
        {/* Unified Page Hero */}
        <PageHero
          label="Van Cards"
          title="Van Cards"
          subtitle="Meet the members of the Vanciety community"
          icon={Users}
        />

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
