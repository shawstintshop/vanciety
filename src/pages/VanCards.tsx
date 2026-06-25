import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, IdCard } from "lucide-react";
import Header from "@/components/Header";
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
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/sprinter-white-4x4.png)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/45" />
          </div>
          <div className="relative z-10 container mx-auto px-4 py-20 lg:py-24">
            <div className="max-w-3xl">
              <Badge className="mb-5 border border-primary/40 bg-primary/10 text-amber-300 hover:bg-primary/15">
                <IdCard className="mr-1.5 h-3.5 w-3.5" />
                Van Cards
              </Badge>
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Meet the <span className="text-amber-400">Vanciety community.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-300">
                Every member gets a Van Card — their rig, their build, their story. Browse the community
                and see who's out there on the road.
              </p>
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
