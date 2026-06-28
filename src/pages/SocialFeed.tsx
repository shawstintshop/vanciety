/**
 * SocialFeed.tsx — Vanciety Social Feed Hub
 * One page. Every van life social platform.
 * Aggregates: YouTube, Reddit, RSS News, Twitter/X embeds, Instagram embeds
 *
 * API Reality:
 * - YouTube: Public RSS feed (no key needed for channel feeds)
 * - Reddit: Public JSON API (no auth needed for public subreddits)
 * - News: RSS via allorigins CORS proxy (VanLife, Overland, Camping blogs)
 * - Instagram/TikTok: Embed widgets (require account auth for full API)
 * - Twitter/X: Embed timeline widget
 *
 * Design: matte black (#0d0d0d) + gold (#c9a96e) + warm white (#e8dcc8)
 */
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Youtube, MessageSquare, Newspaper, Instagram, Twitter,
  RefreshCw, ExternalLink, ThumbsUp, Clock, TrendingUp,
  Filter, Globe, Flame, ChevronRight, Play, ArrowUpRight,
  Loader2, AlertCircle, Hash,
} from "lucide-react";
import Header from "@/components/Header";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeedItem {
  id: string;
  source: "youtube" | "reddit" | "news" | "instagram" | "twitter";
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  author?: string;
  authorAvatar?: string;
  published: Date;
  score?: number;
  comments?: number;
  subreddit?: string;
  channelName?: string;
  tags?: string[];
}

// ─── Source config ────────────────────────────────────────────────────────────
const SOURCES = [
  { id: "all", label: "All Sources", icon: Globe, color: "#c9a96e" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "#FF0000" },
  { id: "reddit", label: "Reddit", icon: MessageSquare, color: "#FF4500" },
  { id: "news", label: "News & Blogs", icon: Newspaper, color: "#60a5fa" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "#E1306C" },
  { id: "twitter", label: "Twitter / X", icon: Twitter, color: "#1DA1F2" },
];

// ─── Van life YouTube channels (public RSS, no API key needed) ────────────────
const YT_CHANNELS = [
  { id: "UCVcEd_QSgRHkIo6UMeNAnHg", name: "Kara and Nate" },
  { id: "UCe_8CJwFMKKhQCpkFGJD9Jg", name: "Eamon & Bec" },
  { id: "UCpJoFNBZOFna5oSGHaHMnOA", name: "Nate Murphy" },
  { id: "UCFfBMPFmqnih8Uf9Gl5LFSA", name: "Gnomad Home" },
  { id: "UCt1Kcf7WNRG4GqXMf9WKLNQ", name: "Trent & Allie" },
];

// ─── Van life subreddits ──────────────────────────────────────────────────────
const SUBREDDITS = ["vandwellers", "vanlife", "overlanding", "CampingandHiking", "SprinterVans"];

// ─── Van life news RSS feeds — van/overland/Sprinter ONLY ────────────────────
const NEWS_FEEDS = [
  { url: "https://www.thevanlifeguide.com/feed/", name: "Van Life Guide" },
  { url: "https://www.mortonsonthemove.com/feed/", name: "Mortons on the Move" },
  { url: "https://www.explorist.life/feed/", name: "Explorist Life" },
  { url: "https://gnomad.com/feed/", name: "Gnomad Home" },
  { url: "https://www.outsidevan.com/blog/feed/", name: "Outside Van" },
  { url: "https://www.faroutride.com/feed/", name: "Farout Ride" },
];

// ─── CORS proxy ───────────────────────────────────────────────────────────────
const PROXY = "https://api.allorigins.win/get?url=";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function parseYTDate(str: string): Date {
  try { return new Date(str); } catch { return new Date(); }
}

// ─── Fetch functions ──────────────────────────────────────────────────────────
async function fetchRedditPosts(subreddit: string): Promise<FeedItem[]> {
  try {
    const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=8`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data?.children || [])
      .filter((p: any) => !p.data.stickied && p.data.title)
      .slice(0, 6)
      .map((p: any) => ({
        id: `reddit-${p.data.id}`,
        source: "reddit" as const,
        title: p.data.title,
        description: p.data.selftext?.slice(0, 200) || p.data.url || "",
        url: `https://reddit.com${p.data.permalink}`,
        thumbnail: p.data.thumbnail?.startsWith("http") ? p.data.thumbnail : undefined,
        author: `u/${p.data.author}`,
        published: new Date(p.data.created_utc * 1000),
        score: p.data.score,
        comments: p.data.num_comments,
        subreddit: p.data.subreddit,
        tags: [p.data.subreddit],
      }));
  } catch {
    return [];
  }
}

async function fetchYouTubeChannel(channelId: string, channelName: string): Promise<FeedItem[]> {
  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(`${PROXY}${encodeURIComponent(feedUrl)}`);
    if (!res.ok) return [];
    const json = await res.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(json.contents, "text/xml");
    const entries = Array.from(xml.querySelectorAll("entry")).slice(0, 4);
    return entries.map((entry) => {
      const videoId = entry.querySelector("videoId")?.textContent || "";
      const title = entry.querySelector("title")?.textContent || "";
      const published = entry.querySelector("published")?.textContent || "";
      const views = entry.querySelector("statistics")?.getAttribute("views") || "0";
      return {
        id: `yt-${videoId}`,
        source: "youtube" as const,
        title,
        description: entry.querySelector("description")?.textContent?.slice(0, 200) || "",
        url: `https://youtube.com/watch?v=${videoId}`,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        author: channelName,
        published: parseYTDate(published),
        score: parseInt(views),
        channelName,
        tags: ["YouTube", channelName],
      };
    });
  } catch {
    return [];
  }
}

async function fetchNewsFeed(feedUrl: string, sourceName: string): Promise<FeedItem[]> {
  try {
    const res = await fetch(`${PROXY}${encodeURIComponent(feedUrl)}`);
    if (!res.ok) return [];
    const json = await res.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(json.contents, "text/xml");
    const items = Array.from(xml.querySelectorAll("item")).slice(0, 5);
    return items.map((item, i) => {
      const title = item.querySelector("title")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "";
      const desc = item.querySelector("description")?.textContent?.replace(/<[^>]*>/g, "").slice(0, 200) || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      const enclosure = item.querySelector("enclosure");
      const imgMatch = item.querySelector("description")?.textContent?.match(/src="([^"]+)"/);
      return {
        id: `news-${sourceName}-${i}`,
        source: "news" as const,
        title,
        description: desc,
        url: link,
        thumbnail: enclosure?.getAttribute("url") || (imgMatch ? imgMatch[1] : undefined),
        author: sourceName,
        published: pubDate ? new Date(pubDate) : new Date(),
        tags: ["News", sourceName],
      };
    });
  } catch {
    return [];
  }
}

// ─── Source badge ─────────────────────────────────────────────────────────────
const SOURCE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  youtube: { label: "YouTube", color: "#FF0000", bg: "rgba(255,0,0,0.12)" },
  reddit: { label: "Reddit", color: "#FF4500", bg: "rgba(255,69,0,0.12)" },
  news: { label: "News", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  instagram: { label: "Instagram", color: "#E1306C", bg: "rgba(225,48,108,0.12)" },
  twitter: { label: "Twitter", color: "#1DA1F2", bg: "rgba(29,161,242,0.12)" },
};

// ─── Component ────────────────────────────────────────────────────────────────
const SocialFeed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all sources in parallel
      const [redditResults, ytResults, newsResults] = await Promise.all([
        Promise.all(SUBREDDITS.map((s) => fetchRedditPosts(s))).then((r) => r.flat()),
        Promise.all(YT_CHANNELS.slice(0, 3).map((c) => fetchYouTubeChannel(c.id, c.name))).then((r) => r.flat()),
        Promise.all(NEWS_FEEDS.map((f) => fetchNewsFeed(f.url, f.name))).then((r) => r.flat()),
      ]);

      // Van-only ALLOWLIST — item MUST contain at least one van/overland keyword
      const VAN_REQUIRED_TERMS = [
        "van", "sprinter", "transit", "promaster", "revel", "winnebago",
        "camper", "vanlife", "van life", "overland", "overlanding",
        "4x4", "off-road", "offroad", "off road", "van build", "van conversion",
        "van tour", "stealth camp", "boondock", "van dwelling", "van living",
        "van dweller", "solar panel", "lithium battery", "diesel heater",
        "maxxair", "fan-tastic", "victron", "dometic", "webasto", "espar",
        "aluminess", "van maintenance", "van repair", "van upgrade", "van hack",
        "van product", "van gear", "van accessory", "van expo", "van rally",
        "van meetup", "van event", "vanfest", "rubber tramp", "xscapers",
        "adventure van", "camper van", "campervan", "van life", "van build",
        "pnw camp", "northwest camp", "washington camp", "oregon camp",
        "skoolie", "van conversion", "sprinter van", "transit van"
      ];
      const isVanContent = (item: FeedItem) => {
        const text = (item.title + " " + (item.description || "")).toLowerCase();
        // Reddit posts from van subreddits are always van content
        if (item.source === "reddit") return true;
        // YouTube from our curated channels is always van content
        if (item.source === "youtube") return true;
        // News items must match at least one van keyword
        return VAN_REQUIRED_TERMS.some((kw) => text.includes(kw));
      };
      const all = [...redditResults, ...ytResults, ...newsResults]
        .filter((item) => item.title && item.url && isVanContent(item))
        .sort((a, b) => b.published.getTime() - a.published.getTime());

      setItems(all);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Feed load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll, refreshKey]);

  const filtered = source === "all" ? items : items.filter((i) => i.source === source);

  const sourceCounts = SOURCES.reduce((acc, s) => {
    acc[s.id] = s.id === "all" ? items.length : items.filter((i) => i.source === s.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="vanciety-page min-h-screen bg-background">
      <Header />
      <main className="pt-16 sm:pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-[#0d0d0d]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,169,110,0.07)_0%,_transparent_55%)]" />
            <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#c9a96e" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          <div className="container relative mx-auto px-4 py-14 md:py-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/10 px-4 py-1.5">
                  <Flame className="h-3.5 w-3.5 text-[#c9a96e]" />
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a96e]">Live Social Feed</span>
                </div>
                <h1 className="mb-3 text-3xl font-black leading-tight text-[#e8dcc8] sm:text-4xl md:text-5xl">
                  Every Platform.<br />
                  <span className="text-[#c9a96e]">One Feed.</span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Van life content from YouTube, Reddit, news blogs, and social media — all in one place. Stop bouncing between apps.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <span className="text-xs text-muted-foreground">
                    Updated {timeAgo(lastUpdated)}
                  </span>
                )}
                <button
                  onClick={() => setRefreshKey((k) => k + 1)}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-[#c9a96e]/40 hover:text-foreground disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Source filter tabs */}
        <div className="border-b border-border bg-background/80 sticky top-16 sm:top-20 z-30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-none">
              {SOURCES.map((s) => {
                const Icon = s.icon;
                const count = sourceCounts[s.id] || 0;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSource(s.id)}
                    className={`shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      source === s.id
                        ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e]"
                        : "border-border/60 bg-card/60 text-muted-foreground hover:border-[#c9a96e]/40 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: source === s.id ? "#c9a96e" : s.color }} />
                    {s.label}
                    {count > 0 && (
                      <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        source === s.id ? "bg-[#c9a96e]/20 text-[#c9a96e]" : "bg-muted/60 text-muted-foreground"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex gap-6 min-w-0">
            {/* Feed */}
            <div className="flex-1 min-w-0 overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-[#c9a96e]" />
                  <p className="text-sm text-muted-foreground">Loading content from all platforms…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <Globe className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground">No content loaded for this source.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Some platforms require authentication — see sidebar for details.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Masonry-style mixed grid */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((item) => {
                      const badge = SOURCE_BADGE[item.source];
                      return (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition-all hover:border-[#c9a96e]/40 hover:shadow-lg hover:shadow-black/20"
                        >
                          {/* Thumbnail */}
                          {item.thumbnail && (
                            <div className="relative aspect-video overflow-hidden bg-muted/30">
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                              {item.source === "youtube" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform group-hover:scale-110">
                                    <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex flex-1 flex-col p-4">
                            {/* Source badge + time */}
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <span
                                className="rounded-full border px-2 py-0.5 text-[11px] font-bold"
                                style={{ color: badge.color, background: badge.bg, borderColor: badge.color + "40" }}
                              >
                                {badge.label}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {timeAgo(item.published)}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="mb-1.5 font-bold leading-snug text-foreground line-clamp-2 group-hover:text-[#c9a96e] transition-colors">
                              {item.title}
                            </h3>

                            {/* Description */}
                            {item.description && (
                              <p className="mb-3 flex-1 text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t border-border/40 pt-3">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {item.author && (
                                  <span className="font-medium text-foreground/70 truncate max-w-[120px]">
                                    {item.source === "reddit" ? (
                                      <span className="flex items-center gap-1">
                                        <Hash className="h-3 w-3" />
                                        {item.subreddit}
                                      </span>
                                    ) : item.author}
                                  </span>
                                )}
                                {item.score !== undefined && item.score > 0 && (
                                  <span className="flex items-center gap-0.5">
                                    <ThumbsUp className="h-3 w-3" />
                                    {item.score.toLocaleString()}
                                  </span>
                                )}
                                {item.comments !== undefined && (
                                  <span className="flex items-center gap-0.5">
                                    <MessageSquare className="h-3 w-3" />
                                    {item.comments.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#c9a96e]" />
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar — platform status + social embeds */}
            <aside className="hidden w-72 shrink-0 xl:block">
              <div className="sticky top-24 space-y-5">
                {/* Platform status */}
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Platform Status</div>
                  <div className="space-y-2">
                    {[
                      { name: "YouTube", status: "live", icon: Youtube, color: "#FF0000", note: "Public RSS feeds" },
                      { name: "Reddit", status: "live", icon: MessageSquare, color: "#FF4500", note: "Public API" },
                      { name: "News Blogs", status: "live", icon: Newspaper, color: "#60a5fa", note: "RSS feeds" },
                      { name: "Instagram", status: "auth", icon: Instagram, color: "#E1306C", note: "Requires OAuth" },
                      { name: "TikTok", status: "auth", icon: Flame, color: "#69C9D0", note: "Requires OAuth" },
                      { name: "Twitter / X", status: "auth", icon: Twitter, color: "#1DA1F2", note: "Requires API key" },
                    ].map((p) => {
                      const Icon = p.icon;
                      return (
                        <div key={p.name} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" style={{ color: p.color }} />
                            <span className="text-sm text-foreground">{p.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${p.status === "live" ? "bg-emerald-500" : "bg-amber-500"}`} />
                            <span className="text-xs text-muted-foreground">{p.note}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top subreddits */}
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Van Life Subreddits</div>
                  <div className="space-y-1.5">
                    {SUBREDDITS.map((sub) => (
                      <a
                        key={sub}
                        href={`https://reddit.com/r/${sub}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <Hash className="h-3.5 w-3.5 text-[#FF4500]" />
                          r/{sub}
                        </span>
                        <ExternalLink className="h-3 w-3 opacity-40" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* YouTube channels */}
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Featured Channels</div>
                  <div className="space-y-1.5">
                    {YT_CHANNELS.map((ch) => (
                      <a
                        key={ch.id}
                        href={`https://youtube.com/channel/${ch.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <Youtube className="h-3.5 w-3.5 text-[#FF0000]" />
                          {ch.name}
                        </span>
                        <ExternalLink className="h-3 w-3 opacity-40" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Connect socials CTA */}
                <div className="rounded-2xl border border-[#c9a96e]/20 bg-[#c9a96e]/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#c9a96e]" />
                    <span className="text-sm font-bold text-[#c9a96e]">Want Instagram & TikTok?</span>
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Connect your Vanciety account to enable full social media feeds from Instagram, TikTok, and Twitter/X.
                  </p>
                  <Link
                    to="/auth"
                    className="flex items-center justify-center gap-1.5 rounded-full bg-[#c9a96e] px-4 py-2 text-xs font-bold text-[#0d0d0d] transition-colors hover:bg-[#d4b87a]"
                  >
                    Join Free <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="border-t border-border bg-card/40 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-2 text-2xl font-black text-foreground">Never miss van life content again.</h2>
            <p className="mb-6 text-muted-foreground">Join Vanciety to get personalized feeds, save posts, and connect with the community.</p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-[#c9a96e] px-8 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#0d0d0d] transition-colors hover:bg-[#d4b87a]"
            >
              Join the Crew <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SocialFeed;
