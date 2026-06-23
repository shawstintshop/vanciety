import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Star, BadgeCheck, ArrowRight, Globe, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MANUFACTURERS,
  MANUFACTURER_CATEGORIES,
  type ManufacturerCategory,
} from "@/data/manufacturers";

const Manufacturers = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ManufacturerCategory | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MANUFACTURERS.filter((m) => {
      const matchesCat = category === "all" || m.category === category;
      const matchesQ =
        !q ||
        [m.name, m.city, m.state, m.tagline, ...m.specialties].join(" ").toLowerCase().includes(q);
      return matchesCat && matchesQ;
    }).sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  }, [query, category]);

  return (
    <div className="vanciety-page min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <PageHero
          label="Manufacturers & Brands"
          title="Van Manufacturers & Brands"
          subtitle="The hub for Sprinter, vanlife & overland manufacturers — explore brands, products, and reviews."
          icon={Sparkles}
        >
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brands, products, or locations…"
                className="h-12 pl-10 text-base bg-background/60 border-border/60"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {MANUFACTURER_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    category === c.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-card/60 text-foreground hover:border-primary/40"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </PageHero>

        {/* Grid */}
        <section className="container mx-auto px-4 py-10">
          <p className="mb-5 text-sm text-muted-foreground">
            {results.length} brand{results.length === 1 ? "" : "s"}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((m) => (
              <Link
                key={m.slug}
                to={`/manufacturers/${m.slug}`}
                className="group flex flex-col rounded-2xl border border-border/60 bg-card/60 p-5 transition-all hover:border-primary/40 hover:shadow-glow"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-foreground">{m.name}</h3>
                      {m.verified && <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified" />}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {m.city}, {m.state}
                    </div>
                  </div>
                  {m.featured && (
                    <Badge variant="outline" className="shrink-0 gap-1 text-[11px]">
                      <Sparkles className="h-3 w-3" /> Featured
                    </Badge>
                  )}
                </div>

                <p className="mb-3 flex-1 text-sm text-muted-foreground">{m.tagline}</p>

                <div className="mb-3 flex flex-wrap gap-1.5">
                  {m.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="rounded-full bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-3">
                  <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {m.rating.toFixed(1)}
                    <span className="font-normal text-muted-foreground">({m.reviewsCount})</span>
                  </span>
                  <span className="flex items-center text-sm font-medium text-primary">
                    View
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {results.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <Globe className="mx-auto mb-3 h-10 w-10 opacity-40" />
              No brands match your search.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Manufacturers;
