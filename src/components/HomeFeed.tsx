/**
 * HomeFeed — live vanlife content feed section for the home page.
 * Shows latest content across all categories with filter tabs.
 * Members can customize which categories appear via their profile.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import FeedCard from "@/components/FeedCard";
import { useContentFeed, CATEGORY_META, type FeedCategory } from "@/hooks/useContentFeed";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORY_TABS: FeedCategory[] = [
  "all", "youtube", "news", "how_to", "stealth", "overland", "builds", "camping", "products"
];

interface HomeFeedProps {
  /** Categories to show — comes from member preferences. Defaults to all. */
  allowedCategories?: FeedCategory[];
}

export default function HomeFeed({ allowedCategories }: HomeFeedProps) {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<FeedCategory>("all");

  const visibleTabs = allowedCategories
    ? CATEGORY_TABS.filter((c) => c === "all" || allowedCategories.includes(c))
    : CATEGORY_TABS;

  const { items, loading, usingFallback, refetch } = useContentFeed(
    activeCategory,
    12
  );

  return (
    <section className="py-16 bg-background topo-section-mid">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Rss className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Live Feed
              </span>
              {usingFallback && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Sample content
                </Badge>
              )}
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Latest Van Life Content
            </h2>
            <p className="text-muted-foreground mt-1">
              YouTube videos, news, how-tos, stealth spots, overland builds — updated daily
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/news">
                View all
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {visibleTabs.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150
                  ${activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
              >
                {meta.emoji} {meta.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Rss className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No content yet in this category</p>
            <p className="text-sm mt-1">Check back after the daily feed refresh</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Member preference nudge */}
        {user && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Want to customize which categories appear here?{" "}
              <Link to="/dashboard" className="text-primary hover:underline font-medium">
                Set your feed preferences →
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
