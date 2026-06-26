/**
 * News — vanlife content hub with live feed + verified events.
 * Two tabs: Live Feed (YouTube, news, how-tos, stealth, overland)
 * and Events (existing verified event sources).
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Rss, RefreshCw, Calendar, ExternalLink, MapPin, ShieldCheck, TrendingUp, Clock } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeedCard from "@/components/FeedCard";
import { useContentFeed, CATEGORY_META, type FeedCategory } from "@/hooks/useContentFeed";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { verifiedEvents, liveSourceNotes, sourceBadgeClass } from "@/data/vancietyVerified";

const FEED_TABS: FeedCategory[] = [
  "all", "youtube", "news", "how_to", "stealth", "overland", "builds", "camping", "products"
];

const PAGE_SIZE = 24;

type PageTab = "feed" | "events";

export default function News() {
  const [pageTab, setPageTab] = useState<PageTab>("feed");
  const [activeCategory, setActiveCategory] = useState<FeedCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [allItems, setAllItems] = useState<any[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setPage(0);
    setAllItems([]);
  }, [activeCategory, debouncedSearch]);

  const { items, loading, hasMore, usingFallback, refetch } = useContentFeed(
    activeCategory,
    PAGE_SIZE,
    page * PAGE_SIZE,
    debouncedSearch
  );

  // Append new page items
  useEffect(() => {
    if (!loading && items.length > 0) {
      if (page === 0) {
        setAllItems(items);
      } else {
        setAllItems((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const newItems = items.filter((i) => !existingIds.has(i.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [items, loading, page]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setPage((p) => p + 1); },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleRefresh = useCallback(() => {
    setPage(0);
    setAllItems([]);
    refetch();
  }, [refetch]);

  const topEvents = verifiedEvents.slice(0, 3);
  const remainingEvents = verifiedEvents.slice(3);
  const eventCategories = ["Official Events", "Adventure Van Expo", "Overland", "Northwest", "Oregon", "Colorado", "Arizona"];

  return (
    <div className="min-h-screen bg-background topo-card">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <HeroSection
          image="/images/sprinter-red-rocks-arch.png"
          badge="Van Life News"
          title="What's happening"
          accent="in van life."
          subtitle="Latest news, product launches, and community updates."
        />

        <section className="bg-background border-b border-border py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Rss className="w-5 h-5 text-amber-400" />
                <Badge className="bg-primary/10 text-amber-300 border-primary/20">Updated daily</Badge>
                {usingFallback && pageTab === "feed" && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Sample content — live feed coming soon
                  </Badge>
                )}
              </div>

              {/* Page tab switcher */}
              <div className="inline-flex rounded-full border border-border/60 bg-muted/40 p-1 mb-6">
                <button
                  onClick={() => setPageTab("feed")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-150
                    ${pageTab === "feed" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  🔴 Live Feed
                </button>
                <button
                  onClick={() => setPageTab("events")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-150
                    ${pageTab === "events" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  📅 Events
                </button>
              </div>

              {/* Search — only on feed tab */}
              {pageTab === "feed" && (
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search van life content..."
                    className="pl-11 pr-4 h-12 text-base rounded-full border-border/60 focus:border-primary bg-background"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── LIVE FEED TAB ── */}
        {pageTab === "feed" && (
          <>
            {/* Category tabs */}
            <div className="sticky top-16 z-20 bg-background/95 backdrop-blur border-b border-border/40">
              <div className="container mx-auto px-4">
                <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
                  {FEED_TABS.map((cat) => {
                    const meta = CATEGORY_META[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
                          transition-all duration-150 whitespace-nowrap
                          ${activeCategory === cat
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                      >
                        {meta.emoji} {meta.label}
                      </button>
                    );
                  })}
                  <button
                    onClick={handleRefresh}
                    className="flex-shrink-0 ml-auto px-3 py-2 rounded-full text-sm
                      text-muted-foreground hover:text-foreground hover:bg-muted
                      transition-all duration-150 flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Feed grid */}
            <div className="container mx-auto px-4 py-10">
              <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
                <span>
                  {allItems.length > 0
                    ? `${allItems.length} item${allItems.length !== 1 ? "s" : ""}${
                        activeCategory !== "all" ? ` in ${CATEGORY_META[activeCategory].label}` : ""
                      }${debouncedSearch ? ` matching "${debouncedSearch}"` : ""}`
                    : loading ? "Loading..." : "No results"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Auto-refreshes daily at 6am UTC
                </span>
              </div>

              {loading && page === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border/40 overflow-hidden">
                      <Skeleton className="aspect-video w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : allItems.length === 0 && !loading ? (
                <div className="text-center py-24 text-muted-foreground">
                  <Rss className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">
                    {debouncedSearch ? `No results for "${debouncedSearch}"` : "No content yet"}
                  </p>
                  <p className="text-sm mt-2">
                    {debouncedSearch ? "Try a different search term" : "The daily feed refresh will populate this soon"}
                  </p>
                  {debouncedSearch && (
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {allItems.map((item) => (
                      <FeedCard key={item.id} item={item} />
                    ))}
                  </div>
                  <div ref={loaderRef} className="mt-8 flex justify-center">
                    {loading && page > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading more...
                      </div>
                    )}
                    {!hasMore && allItems.length > 0 && !loading && (
                      <p className="text-sm text-muted-foreground">
                        You've seen everything — check back tomorrow for fresh content
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Sources footer */}
            <div className="border-t border-border/40 bg-muted/20 py-8">
              <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground mb-3 font-medium">Content sources</p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  {["YouTube — Kara & Nate", "Nomadic Fanatic", "Gnomad Home", "FarOut Ride",
                    "r/vandwellers", "r/vanlife", "r/overlanding",
                    "Expedition Portal", "Outside Magazine", "Google News"].map((s) => (
                    <span key={s} className="px-2 py-1 rounded bg-muted border border-border/40">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── EVENTS TAB ── */}
        {pageTab === "events" && (
          <>
            <section className="vanciety-hero-topo py-10">
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-primary text-primary-foreground">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Real source links only
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {eventCategories.map((category, index) => (
                    <Badge key={category} variant={index === 0 ? "default" : "outline"} className="px-3 py-1">
                      {category}
                    </Badge>
                  ))}
                </div>
                <div className="max-w-4xl rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
                  <strong className="text-foreground">Source policy:</strong> {liveSourceNotes.events} Dates that could not be cleanly extracted are labeled as official-page verification instead of guessed.
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-8">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                  <h2 className="text-2xl font-bold">Featured verified events</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                  {topEvents.map((event, index) => (
                    <Card key={event.id} className={`group hover:shadow-glow transition-all duration-300 overflow-hidden ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}>
                      <div className="relative aspect-video lg:aspect-auto">
                        <img
                          src={event.imageUrl}
                          alt={event.name}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${index === 0 ? "h-64 lg:h-96" : "h-52"}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                          <Badge className={sourceBadgeClass(event.sourceBadge)}>{event.sourceBadge}</Badge>
                          <Badge variant="secondary">{event.category}</Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className={`font-bold leading-tight ${index === 0 ? "text-2xl md:text-3xl" : "text-lg"}`}>{event.name}</h3>
                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/85">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{event.date}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <CardDescription className="mb-4 text-base leading-relaxed">{event.summary}</CardDescription>
                        <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground mb-4">
                          Verified page title: <span className="text-foreground">{event.titleVerified}</span>
                        </div>
                        <Button asChild variant="hero" className="w-full">
                          <a href={event.url} target="_blank" rel="noreferrer">
                            Open official source <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-12 bg-muted/20">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8">More verified event sources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingEvents.map((event) => (
                    <Card key={event.id} className="group hover:shadow-glow transition-all duration-300 overflow-hidden">
                      <div className="relative aspect-video">
                        <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <Badge className={`absolute top-3 left-3 ${sourceBadgeClass(event.sourceBadge)}`}>{event.sourceBadge}</Badge>
                      </div>
                      <CardContent className="p-5">
                        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">{event.name}</CardTitle>
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{event.date}</div>
                          <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location}</div>
                        </div>
                        <CardDescription className="mb-4 line-clamp-3">{event.summary}</CardDescription>
                        <Button asChild variant="outline" className="w-full">
                          <a href={event.url} target="_blank" rel="noreferrer">
                            Official page <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
