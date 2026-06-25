import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin, Star, BadgeCheck, Globe, Instagram, Youtube, Facebook,
  ArrowLeft, Send, Map as MapIcon, Package,
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getManufacturerBySlug, type ManufacturerComment } from "@/data/manufacturers";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const StarRow = ({ value, onSelect }: { value: number; onSelect?: (n: number) => void }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        onClick={onSelect ? () => onSelect(n) : undefined}
        className={`h-5 w-5 ${onSelect ? "cursor-pointer" : ""} ${
          n <= Math.round(value) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"
        }`}
      />
    ))}
  </div>
);

const ManufacturerDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const manufacturer = slug ? getManufacturerBySlug(slug) : undefined;

  // Comment state — seeded with static reviews, then merged with Supabase reviews
  const [comments, setComments] = useState<ManufacturerComment[]>(manufacturer?.comments ?? []);
  const [draftRating, setDraftRating] = useState(0);
  const [draftBody, setDraftBody] = useState("");
  const [draftName, setDraftName] = useState("");

  // Load persisted reviews for this manufacturer slug on mount / slug change
  useEffect(() => {
    if (!slug) return;
    let active = true;
    const seed = manufacturer?.comments ?? [];
    (async () => {
      const { data, error } = await supabase
        .from("manufacturer_reviews" as any)
        .select("*")
        .eq("manufacturer_slug", slug)
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error || !data) {
        setComments(seed);
        return;
      }
      const loaded: ManufacturerComment[] = (data as any[]).map((row) => ({
        author: row.author_name || "Anonymous",
        rating: row.rating,
        date: (row.created_at ?? "").slice(0, 10),
        body: row.body,
      }));
      setComments([...loaded, ...seed]);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const avgRating = useMemo(() => {
    if (!comments.length) return manufacturer?.rating ?? 0;
    return comments.reduce((s, c) => s + c.rating, 0) / comments.length;
  }, [comments, manufacturer]);

  if (!manufacturer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-28 text-center">
          <h1 className="text-2xl font-bold">Brand not found</h1>
          <Link to="/manufacturers" className="mt-4 inline-block text-primary hover:underline">
            ← Back to all manufacturers
          </Link>
        </main>
      </div>
    );
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftRating || !draftBody.trim()) {
      toast.error("Add a rating and a comment.");
      return;
    }
    if (!user) {
      toast.error("Sign in to post a review");
      return;
    }

    const authorName = draftName.trim() || user.email || "Anonymous";
    const optimistic: ManufacturerComment = {
      author: authorName,
      rating: draftRating,
      date: new Date().toISOString().slice(0, 10),
      body: draftBody.trim(),
    };

    // Optimistic update
    setComments((prev) => [optimistic, ...prev]);

    const { error } = await supabase.from("manufacturer_reviews" as any).insert({
      manufacturer_slug: slug,
      user_id: user.id,
      rating: draftRating,
      body: draftBody.trim(),
      author_name: draftName.trim() || user.email,
    });

    if (error) {
      // Roll back optimistic item
      setComments((prev) => prev.filter((c) => c !== optimistic));
      toast.error("Could not post review. Please try again.");
      return;
    }

    setDraftRating(0);
    setDraftBody("");
    setDraftName("");
    toast.success("Review posted!");
  };

  const mapUrl = `/map?layer=manufacturers&focus=${manufacturer.slug}`;

  return (
    <div className="vanciety-page min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pb-16 pt-20">
        <Link to="/manufacturers" className="mb-5 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> All manufacturers
        </Link>

        {/* Header block */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-foreground">{manufacturer.name}</h1>
                {manufacturer.verified && <BadgeCheck className="h-6 w-6 text-primary" aria-label="Verified brand" />}
              </div>
              <p className="mt-1 text-muted-foreground">{manufacturer.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {manufacturer.city}, {manufacturer.state}
                </span>
                <span className="flex items-center gap-1">
                  <StarRow value={avgRating} /> {avgRating.toFixed(1)} ({comments.length})
                </span>
                {manufacturer.founded && <span>Est. {manufacturer.founded}</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="hero">
                <a href={manufacturer.website} target="_blank" rel="noreferrer">
                  <Globe className="mr-2 h-4 w-4" /> Website
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link to={mapUrl}>
                  <MapIcon className="mr-2 h-4 w-4" /> See on map
                </Link>
              </Button>
            </div>
          </div>

          {/* Socials */}
          <div className="mt-4 flex gap-3">
            {manufacturer.social.instagram && (
              <a href={manufacturer.social.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {manufacturer.social.youtube && (
              <a href={manufacturer.social.youtube} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            )}
            {manufacturer.social.facebook && (
              <a href={manufacturer.social.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left: about + products */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-border/60 bg-card/60 p-6">
              <h2 className="mb-2 font-semibold text-foreground">About</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{manufacturer.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {manufacturer.specialties.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/60 p-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <Package className="h-5 w-5 text-primary" /> Products
              </h2>
              <div className="space-y-3">
                {manufacturer.products.map((p) => (
                  <div key={p.name} className="flex items-start justify-between gap-4 rounded-xl bg-muted/30 p-4">
                    <div>
                      <p className="font-medium text-foreground">{p.name}</p>
                      {p.description && <p className="mt-0.5 text-sm text-muted-foreground">{p.description}</p>}
                    </div>
                    {p.price && <span className="shrink-0 font-semibold text-primary">{p.price}</span>}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: reviews + comments */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-border/60 bg-card/60 p-6">
              <h2 className="mb-4 font-semibold text-foreground">Rate this brand</h2>
              <form onSubmit={submitComment} className="space-y-3">
                <StarRow value={draftRating} onSelect={setDraftRating} />
                <Input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Your name (optional)"
                />
                <Textarea
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                  placeholder="Share your experience with this brand…"
                  rows={3}
                />
                <Button type="submit" variant="hero" className="w-full">
                  <Send className="mr-2 h-4 w-4" /> Post review
                </Button>
              </form>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/60 p-6">
              <h2 className="mb-4 font-semibold text-foreground">
                Reviews ({comments.length})
              </h2>
              <div className="space-y-4">
                {comments.map((c, i) => (
                  <div key={`${c.author}-${i}`} className="border-b border-border/40 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{c.author}</span>
                      <span className="text-xs text-muted-foreground">{c.date}</span>
                    </div>
                    <div className="my-1"><StarRow value={c.rating} /></div>
                    <p className="text-sm text-muted-foreground">{c.body}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-sm text-muted-foreground">No reviews yet — be the first.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManufacturerDetail;
