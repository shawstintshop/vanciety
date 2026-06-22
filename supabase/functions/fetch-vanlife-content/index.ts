/**
 * Supabase Edge Function: fetch-vanlife-content
 *
 * Fetches vanlife content from YouTube RSS, Google News RSS,
 * Reddit RSS, and other public feeds. Extracts real thumbnails
 * via Open Graph scraping. Stores results in content_feed table.
 *
 * Deploy: supabase functions deploy fetch-vanlife-content
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
  { id: "UCi3Lx4KFBzCFbHqMUXUFGpQ", name: "Gnomad Home" },
  { id: "UCe7RRdRJGOjqSVqGqNPqMjA", name: "Trent & Allie" },
  { id: "UCzWQYUVCpZqtN93H8RR44Qw", name: "Exploring Alternatives" },
  { id: "UCuDiGQRGBBME2JfGKJMRdkw", name: "Wand'rly" },
];

const NEWS_RSS_FEEDS = [
  // Direct publication feeds — include og:image in RSS or have scrapable pages
  {
    url: "https://www.outsideonline.com/feed/",
    category: "news",
    source: "Outside Magazine",
  },
  {
    url: "https://expeditionportal.com/feed/",
    category: "overland",
    source: "Expedition Portal",
  },
  {
    url: "https://www.motortrend.com/rss/news/",
    category: "news",
    source: "MotorTrend",
  },
  {
    url: "https://www.caranddriver.com/rss/all.xml/",
    category: "news",
    source: "Car and Driver",
  },
  {
    url: "https://www.thedrive.com/feed",
    category: "news",
    source: "The Drive",
  },
  {
    url: "https://www.autoevolution.com/rss/news.xml",
    category: "builds",
    source: "autoevolution",
  },
  {
    url: "https://www.autoblog.com/rss.xml",
    category: "news",
    source: "Autoblog",
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
    url: "https://www.reddit.com/r/camping/new/.rss",
    category: "camping",
    source: "r/camping",
  },
  {
    url: "https://www.reddit.com/r/stealthcamping/new/.rss",
    category: "stealth",
    source: "r/stealthcamping",
  },
  {
    url: "https://www.reddit.com/r/boondocking/new/.rss",
    category: "stealth",
    source: "r/boondocking",
  },
];

const HOW_TO_FEEDS = [
  {
    url: "https://www.reddit.com/r/vandwellers/search.rss?q=how+to&sort=new",
    category: "how_to",
    source: "r/vandwellers",
  },
  {
    url: "https://www.reddit.com/r/vanlife/search.rss?q=diy+build&sort=new",
    category: "how_to",
    source: "r/vanlife",
  },
  {
    url: "https://expeditionportal.com/category/how-to/feed/",
    category: "how_to",
    source: "Expedition Portal",
  },
];

const PRODUCT_FEEDS = [
  {
    url: "https://www.outdoorgearlab.com/rss",
    category: "products",
    source: "OutdoorGearLab",
  },
  {
    url: "https://gearjunkie.com/feed",
    category: "products",
    source: "Gear Junkie",
  },
  {
    url: "https://www.rei.com/blog/feed",
    category: "products",
    source: "REI Blog",
  },
  {
    url: "https://www.reddit.com/r/CampingGear/new/.rss",
    category: "products",
    source: "r/CampingGear",
  },
];

// ─── Thumbnail extraction ─────────────────────────────────────

/**
 * Extract Open Graph image from a URL.
 * Fetches the HTML and parses og:image or twitter:image meta tags.
 * Returns null on failure — never throws.
 */
/**
 * Resolve a Google News redirect URL to the real article URL.
 */
async function resolveGoogleNewsUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Vanciety/1.0; +https://vanciety.com)" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    // After following redirects, the final URL is the real article
    return res.url || url;
  } catch {
    return url;
  }
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    // For Google News redirect URLs, resolve to the real article URL first
    let targetUrl = url;
    if (url.includes("news.google.com")) {
      targetUrl = await resolveGoogleNewsUrl(url);
      // If still google.com after redirect, skip
      if (targetUrl.includes("google.com")) return null;
    }

    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Vanciety/1.0; +https://vanciety.com)",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return null;

    // Only read first 20KB to avoid large downloads
    const reader = res.body?.getReader();
    if (!reader) return null;

    let html = "";
    let bytesRead = 0;
    const maxBytes = 20000;

    while (bytesRead < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
      bytesRead += value.length;
      // Stop once we've seen the </head> tag
      if (html.includes("</head>")) break;
    }
    reader.cancel();

    // Try og:image first
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch?.[1]) return ogMatch[1];

    // Fallback: twitter:image
    const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    if (twitterMatch?.[1]) return twitterMatch[1];

    return null;
  } catch {
    return null;
  }
}

/**
 * Extract image from Reddit RSS content:encoded block.
 */
function extractRedditImage(content: string): string | null {
  // Reddit includes <img> tags in content:encoded
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1] && !imgMatch[1].includes("external-preview.redd.it/award")) {
    return imgMatch[1];
  }
  // Also check for preview.redd.it
  const previewMatch = content.match(/https:\/\/preview\.redd\.it\/[^"'\s)]+/);
  if (previewMatch?.[0]) return previewMatch[0];
  return null;
}

// ─── XML Parser ──────────────────────────────────────────────

function parseRSS(xml: string, source: string): Array<{
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

    // Try multiple thumbnail sources from the RSS item itself
    let thumbnail = "";

    // 1. media:thumbnail (YouTube, some RSS feeds)
    thumbnail = item.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] || "";

    // 2. media:content with image type
    if (!thumbnail) {
      thumbnail = item.match(/<media:content[^>]+url="([^"]+)"[^>]+medium="image"/)?.[1]
        || item.match(/<media:content[^>]+medium="image"[^>]+url="([^"]+)"/)?.[1] || "";
    }

    // 3. enclosure with image type
    if (!thumbnail) {
      thumbnail = item.match(/<enclosure[^>]+url="([^"]+)"[^>]+type="image/)?.[1] || "";
    }

    // 4. Reddit: extract from content:encoded
    if (!thumbnail && source.startsWith("r/")) {
      const contentEncoded = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] || "";
      if (contentEncoded) {
        thumbnail = extractRedditImage(contentEncoded) || "";
      }
    }

    // 5. Expedition Portal / Outside Magazine: look for image in description HTML
    if (!thumbnail && (source === "Expedition Portal" || source === "Outside Magazine")) {
      const descRaw = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || "";
      thumbnail = descRaw.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || "";
    }

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

  return items.slice(0, 20);
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

    // Use maxresdefault for best quality, fall back to hqdefault
    const thumbnail = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
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

// ─── Hash helper ─────────────────────────────────────────────

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ─── Backfill thumbnails for existing null items ─────────────

async function backfillThumbnails(): Promise<number> {
  // Get items with no thumbnail that are not Google News redirects
  const { data: nullItems } = await supabase
    .from("content_feed")
    .select("id, url, category")
    .is("thumbnail_url", null)
    .eq("is_active", true)
    // Include Google News items — we now resolve their redirects
    .limit(50); // Process 50 at a time to avoid timeout

  if (!nullItems || nullItems.length === 0) return 0;

  let backfilled = 0;

  // Process in parallel batches of 5
  const batchSize = 5;
  for (let i = 0; i < nullItems.length; i += batchSize) {
    const batch = nullItems.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (item) => {
        const img = await fetchOgImage(item.url);
        if (img) {
          await supabase
            .from("content_feed")
            .update({ thumbnail_url: img })
            .eq("id", item.id);
          backfilled++;
        }
      })
    );
  }

  return backfilled;
}

// ─── Main handler ────────────────────────────────────────────

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const backfillOnly = url.searchParams.get("backfill") === "true";

  let itemsAdded = 0;
  let itemsTotal = 0;
  let backfilled = 0;
  const errors: string[] = [];

  try {
    if (!backfillOnly) {
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
              thumbnail_url: v.thumbnail || null,
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
          const items = parseRSS(xml, feed.source);

          for (const item of items) {
            itemsTotal++;
            const sourceId = simpleHash(item.url);

            // For non-Google-News items without a thumbnail, fetch og:image
            let thumbnail = item.thumbnail || null;
            if (!thumbnail && !item.url.includes("news.google.com")) {
              thumbnail = await fetchOgImage(item.url);
            }

            const { error } = await supabase.from("content_feed").upsert({
              source_id: sourceId,
              category: feed.category,
              title: item.title.slice(0, 300),
              description: item.description,
              url: item.url,
              thumbnail_url: thumbnail,
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
    }

    // 4. Backfill thumbnails for existing null-thumbnail items
    backfilled = await backfillThumbnails();

    // 5. Log the run
    await supabase.from("feed_fetch_log").insert({
      items_added: itemsAdded,
      items_total: itemsTotal,
      status: errors.length === 0 ? "success" : errors.length < 3 ? "partial" : "error",
      error_msg: errors.length > 0 ? errors.slice(0, 3).join("; ") : null,
    });

    return new Response(
      JSON.stringify({ ok: true, itemsAdded, itemsTotal, backfilled, errors }),
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
