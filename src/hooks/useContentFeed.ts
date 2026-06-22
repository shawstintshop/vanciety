/**
 * useContentFeed — fetches vanlife content from the content_feed table.
 * Falls back to curated static content if the table doesn't exist yet.
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type FeedCategory =
  | "all"
  | "youtube"
  | "news"
  | "products"
  | "how_to"
  | "stealth"
  | "overland"
  | "builds"
  | "camping";

export interface FeedItem {
  id: string;
  source_id: string;
  category: FeedCategory;
  title: string;
  description: string | null;
  url: string;
  thumbnail_url: string | null;
  author: string | null;
  source_name: string | null;
  published_at: string | null;
  fetched_at: string;
}

// Curated fallback content shown before the Edge Function has run
const FALLBACK_ITEMS: FeedItem[] = [
  {
    id: "f1", source_id: "f1", category: "youtube",
    title: "Full Van Build Tour — Sprinter 144 High Roof",
    description: "Complete walkthrough of a 144\" Sprinter conversion with solar, composting toilet, and custom woodwork.",
    url: "https://www.youtube.com/results?search_query=sprinter+van+build+tour",
    thumbnail_url: "https://images.unsplash.com/photo-1533591380348-14193f1de18f?w=400&q=80",
    author: "Gnomad Home", source_name: "YouTube",
    published_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    fetched_at: new Date().toISOString(),
  },
  {
    id: "f2", source_id: "f2", category: "stealth",
    title: "Best Stealth Camping Spots in the Pacific Northwest",
    description: "Dispersed camping, BLM land, and urban stealth spots across Oregon and Washington.",
    url: "https://www.reddit.com/r/vandwellers/search/?q=stealth+camping+pacific+northwest",
    thumbnail_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80",
    author: "r/vandwellers", source_name: "Reddit",
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    fetched_at: new Date().toISOString(),
  },
  {
    id: "f3", source_id: "f3", category: "overland",
    title: "Overland Van Setup: What You Actually Need",
    description: "Lift kits, all-terrain tires, skid plates, and recovery gear for serious off-road van builds.",
    url: "https://expeditionportal.com/?s=van",
    thumbnail_url: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=80",
    author: "Expedition Portal", source_name: "Expedition Portal",
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    fetched_at: new Date().toISOString(),
  },
  {
    id: "f4", source_id: "f4", category: "how_to",
    title: "How to Wire a 400W Solar System in Your Van",
    description: "Step-by-step guide: panels, charge controller, lithium battery bank, and inverter wiring.",
    url: "https://www.reddit.com/r/vandwellers/search/?q=solar+wiring+guide",
    thumbnail_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80",
    author: "r/vandwellers", source_name: "Reddit",
    published_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    fetched_at: new Date().toISOString(),
  },
  {
    id: "f5", source_id: "f5", category: "products",
    title: "Best Van Life Gear of 2025 — Tested and Reviewed",
    description: "Top picks for portable power stations, compact cooking gear, water filtration, and bedding.",
    url: "https://www.outsideonline.com/adventure-travel/road-trips/best-van-life-gear/",
    thumbnail_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    author: "Outside Magazine", source_name: "Outside Magazine",
    published_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    fetched_at: new Date().toISOString(),
  },
  {
    id: "f6", source_id: "f6", category: "camping",
    title: "Free Camping Across the Southwest — Full Route",
    description: "BLM land, national forest dispersed sites, and hidden gems from Arizona to Utah.",
    url: "https://www.reddit.com/r/CampingandHiking/search/?q=free+camping+southwest",
    thumbnail_url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&q=80",
    author: "r/CampingandHiking", source_name: "Reddit",
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    fetched_at: new Date().toISOString(),
  },
  {
    id: "f7", source_id: "f7", category: "builds",
    title: "Transit vs Sprinter vs ProMaster — 2025 Comparison",
    description: "Side-by-side breakdown of the three most popular van conversion platforms.",
    url: "https://news.google.com/search?q=transit+sprinter+promaster+comparison+2025",
    thumbnail_url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80",
    author: "Van Life News", source_name: "Google News",
    published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    fetched_at: new Date().toISOString(),
  },
  {
    id: "f8", source_id: "f8", category: "news",
    title: "Van Life Community Hits 2 Million Members Worldwide",
    description: "The van dwelling movement continues to grow as remote work and minimalism drive new converts.",
    url: "https://news.google.com/search?q=van+life+community+2025",
    thumbnail_url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
    author: "Van Life News", source_name: "Google News",
    published_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    fetched_at: new Date().toISOString(),
  },
];

export function useContentFeed(
  category: FeedCategory = "all",
  limit = 20,
  offset = 0,
  searchQuery = ""
) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("content_feed" as any)
        .select("*")
        .eq("is_active", true)
        .order("published_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (category !== "all") {
        query = query.eq("category", category);
      }

      if (searchQuery.trim()) {
        query = query.ilike("title", `%${searchQuery.trim()}%`);
      }

      const { data, error: dbError } = await query;

      if (dbError) {
        // Table doesn't exist yet — use fallback
        if (dbError.code === "42P01" || dbError.message?.includes("does not exist")) {
          setUsingFallback(true);
          const filtered = FALLBACK_ITEMS.filter(
            (item) =>
              (category === "all" || item.category === category) &&
              (!searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          setItems(filtered.slice(offset, offset + limit));
          setHasMore(false);
        } else {
          throw dbError;
        }
      } else {
        setUsingFallback(false);
        setItems((data as FeedItem[]) || []);
        setHasMore((data?.length || 0) === limit);
      }
    } catch (err: any) {
      setError(err.message);
      // Always show fallback on error
      setUsingFallback(true);
      const filtered = FALLBACK_ITEMS.filter(
        (item) =>
          (category === "all" || item.category === category) &&
          (!searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setItems(filtered.slice(offset, offset + limit));
    } finally {
      setLoading(false);
    }
  }, [category, limit, offset, searchQuery]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, hasMore, usingFallback, refetch: fetchItems };
}

export const CATEGORY_META: Record<
  FeedCategory,
  { label: string; emoji: string; color: string }
> = {
  all: { label: "All", emoji: "🌐", color: "bg-slate-500" },
  youtube: { label: "YouTube", emoji: "▶️", color: "bg-red-600" },
  news: { label: "News", emoji: "📰", color: "bg-blue-600" },
  products: { label: "Products", emoji: "🛒", color: "bg-amber-600" },
  how_to: { label: "How-To", emoji: "🔧", color: "bg-green-600" },
  stealth: { label: "Stealth Spots", emoji: "🌙", color: "bg-indigo-600" },
  overland: { label: "Overland", emoji: "🏔️", color: "bg-orange-600" },
  builds: { label: "Builds", emoji: "🚐", color: "bg-teal-600" },
  camping: { label: "Camping", emoji: "⛺", color: "bg-primary" },
};
