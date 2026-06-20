import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Package, PlusCircle, FileCode, Brain, Video, Calendar,
  Wrench, MapPin, ArrowRight, ShieldCheck, Star, BadgeCheck, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Category chips — names people say out loud, mapped to existing routes.
const CATEGORY_CHIPS = [
  { label: "Buy Parts", to: "/marketplace", icon: Package },
  { label: "Sell Items", to: "/shop", icon: PlusCircle },
  { label: "3D Print Files", to: "/shop", icon: FileCode },
  { label: "How-To Guides", to: "/van-intelligence", icon: Brain },
  { label: "Videos", to: "/videos", icon: Video },
  { label: "Events & Meetups", to: "/news", icon: Calendar },
  { label: "Hire Help", to: "/vendors", icon: Wrench },
  { label: "Map", to: "/map", icon: MapPin },
];

// "What do you need today?" — the primary jobs: discover, buy, sell, learn, meet, trust.
const GUIDED_CHOICES = [
  { title: "Buy parts & gear", desc: "Find the right part with fitment and reviews.", to: "/marketplace", icon: Package },
  { title: "Sell your stuff", desc: "List parts, gear, or 3D files in minutes.", to: "/shop", icon: PlusCircle },
  { title: "Learn to build", desc: "Step-by-step guides, videos, and specs.", to: "/van-intelligence", icon: Brain },
  { title: "Find help", desc: "Hire verified builders, brands, and pros.", to: "/vendors", icon: Wrench },
  { title: "Meet the community", desc: "Events, meetups, and members near you.", to: "/news", icon: Calendar },
  { title: "Ask Vanny", desc: "Tell Vanny what you're building or fixing.", to: "/ai", icon: Search },
];

const FEATURED = [
  { kind: "Listing", title: "Marketplace", desc: "Parts, gear, and used finds from the community.", to: "/marketplace", icon: Package },
  { kind: "Guide", title: "Build Guides", desc: "Electrical, plumbing, insulation, and more.", to: "/van-intelligence", icon: Brain },
  { kind: "Video", title: "How-To Videos", desc: "Watch real builds and repairs.", to: "/videos", icon: Video },
  { kind: "Event", title: "Events & Meetups", desc: "Rallies, expos, and gatherings across the USA.", to: "/map", icon: Calendar },
];

const TRUST = [
  { title: "Verified sellers & brands", desc: "Badges on profiles you can trust.", icon: BadgeCheck },
  { title: "Ratings & reviews", desc: "Real feedback on products, sellers, and creators.", icon: Star },
  { title: "Secure checkout", desc: "Protected payments and dispute handling.", icon: Lock },
  { title: "Safe meetups", desc: "Guidance for safe local buying and selling.", icon: ShieldCheck },
];

const HomeConversionFlow = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    // Marketplace is the primary discovery surface; pass the query through.
    navigate(q ? `/marketplace?q=${encodeURIComponent(q)}` : "/marketplace");
  };

  return (
    <>
      {/* 2. Search bar + category chips */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
            Find the right part, guide, or person — fast
          </h2>
          <p className="mb-6 text-muted-foreground">
            Search the marketplace, guides, files, and events in one place.
          </p>
          <form onSubmit={runSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search parts, gear, 3D files, guides, events…"
                className="h-12 pl-10 text-base"
                aria-label="Search Vanciety"
              />
            </div>
            <Button type="submit" variant="hero" size="lg">Search</Button>
          </form>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CATEGORY_CHIPS.map(({ label, to, icon: Icon }) => (
              <button
                key={label}
                onClick={() => navigate(to)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. "What do you need today?" guided choices */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground md:text-3xl">
          What do you need today?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDED_CHOICES.map(({ title, desc, to, icon: Icon }) => (
            <button
              key={title}
              onClick={() => navigate(to)}
              className="group flex items-start gap-4 rounded-xl border border-border/60 bg-card/60 p-5 text-left transition-all hover:border-primary/40 hover:shadow-glow"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="flex items-center font-semibold text-foreground">
                  {title}
                  <ArrowRight className="ml-1 h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{desc}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Featured listings, guides, videos, events */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground md:text-3xl">
          Explore Vanciety
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map(({ kind, title, desc, to, icon: Icon }) => (
            <button
              key={title}
              onClick={() => navigate(to)}
              className="group flex flex-col rounded-xl border border-border/60 bg-card/60 p-5 text-left transition-all hover:border-primary/40 hover:shadow-glow"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-border/60 px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {kind}
                </span>
              </div>
              <span className="font-semibold text-foreground">{title}</span>
              <span className="mt-1 text-sm text-muted-foreground">{desc}</span>
              <span className="mt-3 flex items-center text-sm font-medium text-primary">
                Browse
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Trust blocks */}
      <section className="border-y border-border/40 bg-card/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground md:text-3xl">
            Buy and sell with confidence
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="flex flex-col items-center rounded-xl p-5 text-center">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-semibold text-foreground">{title}</span>
                <span className="mt-1 text-sm text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeConversionFlow;
