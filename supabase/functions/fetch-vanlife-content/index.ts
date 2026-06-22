/**
 * Supabase Edge Function: fetch-vanlife-content
 *
 * Fetches vanlife content from YouTube RSS, Google News RSS,
 * Reddit RSS, and other public feeds. Stores results in
 * the content_feed table. Runs daily via pg_cron.
 *
 * Deploy: supabase functions deploy fetch-vanlife-content
 * Trigger: SELECT cron.schedule('fetch-vanlife-content', '0 6 * * *',
 *   $$SELECT net.http_post(url:='https://<project>.supabase.co/functions/v1/fetch-vanlife-content',
 *   headers:='{"Authorization":"Bearer <anon_key>"}'::jsonb)$$);
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Feed Sources ────────────────────────────────────────────

const YOUTUBE_CHANNELS = [
  { id: "UCpnXq4BNKK6Ov_GCBDhFGRw", name: "Kara and Nate" },
  { id: "UCBcRF18a7Qf58cCRy5xuWwQ", name: "Nomadic Fanatic" },
  { id: "UCqMaQPxHFuTBvhSLJFJFHaA", name: "Eamon & Bec" },
  { id: "UCPKxQCPMKHZBIGFGSJQkHpA", name: "FarOut Ride" },
  { id: "UCBcRF18a7Qf58cCRy5xuWwQ", name: "Wand'rly" },
  { id: "UCi3Lx4KFBzCFbHqMUXUFGpQ", name: "Gnomad Home" },
  { id: "UCe7RRdRJGOjqSVqGqNPqMjA", name: "Trent & Allie" },
  { id: "UCBcRF18a7Qf58cCRy5xuWwQ", name: "Van Life Sagas" },
];

const NEWS_RSS_FEEDS = [
  {
    url: "https://news.google.com/rss/search?q=van+life&hl=en-US&gl=US&ceid=US:en",
    category: "news",
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=stealth+camping+van&hl=en-US&gl=US&ceid=US:en",
    category: "stealth",
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=overland+van+build&hl=en-US&gl=US&ceid=US:en",
    category: "overland",
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=van+conversion+build&hl=en-US&gl=US&ceid=US:en",
    category: "builds",
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=van+camping+tips&hl=en-US&gl=US&ceid=US:en",
    category: "camping",
    source: "Google News",
  },
  {
    url: "https://www.reddit.com/r/vandwellers/new/.rss",
    category: "news",
    source: "r/vandwellers",
  },
  {
    url: "https://www.reddit.com/r/vanlife/new/.rss",
    category: "news",
    source: "r/vanlife",
  },
  {
    url: "https://www.reddit.com/r/overlanding/new/.rss",
    category: "overland",
    source: "r/overlanding",
  },
  {
    url: "https://www.reddit.com/r/CampingandHiking/new/.rss",
    category: "camping",
    source: "r/CampingandHiking",
  },
  {
    url: "https://expeditionportal.com/feed/",
    category: "overland",
    source: "Expedition Portal",
  },
  {
    url: "https://www.outsideonline.com/feed/",
    category: "camping",
    source: "Outside Magazine",
  },
];

const HOW_TO_FEEDS = [
  {
    url: "https://news.google.com/rss/search?q=van+conversion+how+to+DIY&hl=en-US&gl=US&ceid=US:en",
    category: "how_to",
    source: "Google News",
  },
  {
    url: "https://www.reddit.com/r/vandwellers/search.rss?q=how+to&sort=new",
    category: "how_to",
    source: "r/vandwellers",
  },
];

const PRODUCT_FEEDS = [
  {
    url: "https://news.google.com/rss/search?q=van+life+gear+products+2025&hl=en-US&gl=US&ceid=US:en",
    category: "products",
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=camping+van+solar+equipment&hl=en-US&gl=US&ceid=US:en",
    category: "products",
    source: "Google News",
  },
];

// ─── XML Parser ──────────────────────────────────────────────

function parseRSS(xml: string): Array<{
  title: string;
  url: string;
  description: string;
  author: string;
  publishedAt: string;
  thumbnail: string;
}> {
  const items: Array<{
    title: string;
    url: string;
    description: string;
    author: string;
    publishedAt: string;
    thumbnail: string;
  }> = [];

  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

  for (const match of itemMatches) {
    const item = match[1];

    const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
      item.match(/<title>(.*?)<\/title>/))?.[1]?.trim() || "";

    const link = (item.match(/<link>(.*?)<\/link>/) ||
      item.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/))?.[1]?.trim() || "";

    const desc = (item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
      item.match(/<description>([\s\S]*?)<\/description>/))?.[1]
      ?.replace(/<[^>]+>/g, "")
      ?.trim()
      ?.slice(0, 500) || "";

    const author = (item.match(/<author><!\[CDATA\[(.*?)\]\]><\/author>/) ||
      item.match(/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/) ||
      item.match(/<author>(.*?)<\/author>/))?.[1]?.trim() || "";

    const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) ||
      item.match(/<published>(.*?)<\/published>/))?.[1]?.trim() || "";

    const thumbnail = (item.match(/<media:thumbnail[^>]+url="([^"]+)"/) ||
      item.match(/<enclosure[^>]+url="([^"]+)"[^>]+type="image/))?.[1] || "";

    if (title && link) {
      items.push({
        title,
        url: link,
        description: desc,
        author,
        publishedAt: pubDate,
        thumbnail,
      });
    }
  }

  return items.slice(0, 20); // max 20 per feed
}

function parseYouTubeRSS(xml: string, channelName: string): Array<{
  title: string;
  url: string;
  description: string;
  author: string;
  publishedAt: string;
  thumbnail: string;
  videoId: string;
}> {
  const items = [];
  const entryMatches = xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g);

  for (const match of entryMatches) {
    const entry = match[1];

    const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || "";
    const title = entry.match(/<title>(.*?)<\/title>/)?.[1]?.trim() || "";
    const published = entry.match(/<published>(.*?)<\/published>/)?.[1] || "";
    const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1]
      ?.trim()
      ?.slice(0, 500) || "";
    const thumbnail = videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "";

    if (videoId && title) {
      items.push({
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        description,
        author: channelName,
        publishedAt: published,
        thumbnail,
        videoId,
      });
    }
  }

  return items.slice(0, 10);
}

// ─── Hash helper for deduplication ───────────────────────────

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ─── Main handler ────────────────────────────────────────────

Deno.serve(async (_req) => {
  let itemsAdded = 0;
  let itemsTotal = 0;
  const errors: string[] = [];

  try {
    // 1. Fetch YouTube RSS feeds
    for (const channel of YOUTUBE_CHANNELS) {
      try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`;
        const res = await fetch(rssUrl, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) continue;
        const xml = await res.text();
        const videos = parseYouTubeRSS(xml, channel.name);

        for (const v of videos) {
          itemsTotal++;
          const { error } = await supabase.from("content_feed").upsert({
            source_id: v.videoId,
            category: "youtube",
            title: v.title,
            description: v.description,
            url: v.url,
            thumbnail_url: v.thumbnail,
            author: v.author,
            source_name: channel.name,
            published_at: v.publishedAt ? new Date(v.publishedAt).toISOString() : null,
          }, { onConflict: "source_id,category" });

          if (!error) itemsAdded++;
        }
      } catch (e) {
        errors.push(`YouTube ${channel.name}: ${e.message}`);
      }
    }

    // 2. Fetch news/reddit/overland RSS feeds
    const allFeeds = [...NEWS_RSS_FEEDS, ...HOW_TO_FEEDS, ...PRODUCT_FEEDS];
    for (const feed of allFeeds) {
      try {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "Vanciety/1.0 (+https://vanciety.com)" },
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) continue;
        const xml = await res.text();
        const items = parseRSS(xml);

        for (const item of items) {
          itemsTotal++;
          const sourceId = simpleHash(item.url);
          const { error } = await supabase.from("content_feed").upsert({
            source_id: sourceId,
            category: feed.category,
            title: item.title.slice(0, 300),
            description: item.description,
            url: item.url,
            thumbnail_url: item.thumbnail || null,
            author: item.author || null,
            source_name: feed.source,
            published_at: item.publishedAt ? new Date(item.publishedAt).toISOString() : null,
          }, { onConflict: "source_id,category" });

          if (!error) itemsAdded++;
        }
      } catch (e) {
        errors.push(`Feed ${feed.source}: ${e.message}`);
      }
    }

    // 3. Clean up items older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from("content_feed")
      .update({ is_active: false })
      .lt("published_at", thirtyDaysAgo);

    // 4. Log the run
    await supabase.from("feed_fetch_log").insert({
      items_added: itemsAdded,
      items_total: itemsTotal,
      status: errors.length === 0 ? "success" : errors.length < 3 ? "partial" : "error",
      error_msg: errors.length > 0 ? errors.slice(0, 3).join("; ") : null,
    });

    return new Response(
      JSON.stringify({ ok: true, itemsAdded, itemsTotal, errors }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    await supabase.from("feed_fetch_log").insert({
      items_added: 0,
      items_total: 0,
      status: "error",
      error_msg: err.message,
    });
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
