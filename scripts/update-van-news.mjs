#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";

async function loadLocalEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const text = await readFile(resolve(process.cwd(), file), "utf8");
      for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (!match) continue;
        const [, key, rawValue] = match;
        if (process.env[key]) continue;
        process.env[key] = rawValue.replace(/^['\"]|['\"]$/g, "");
      }
    } catch {
      // Optional local env file.
    }
  }
}

await loadLocalEnv();

const OUTPUT_PATH = resolve(process.cwd(), "public/data/van-news-digest.json");
const MAX_ITEMS = 12;
const USER_AGENT = "VancietyDailyBriefing/1.0 (+https://vanciety.com)";

const feeds = [
  {
    name: "Google News — Van life",
    badge: "NEWS_SEARCH",
    url: "https://news.google.com/rss/search?q=van%20life%20OR%20camper%20van%20when%3A7d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "Google News — Sprinter / Transit / Promaster",
    badge: "NEWS_SEARCH",
    url: "https://news.google.com/rss/search?q=%28Sprinter%20van%20OR%20Ford%20Transit%20van%20OR%20Ram%20Promaster%29%20when%3A14d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "Google News — Overland and van events",
    badge: "EVENT_SEARCH",
    url: "https://news.google.com/rss/search?q=%28overland%20expo%20OR%20adventure%20van%20expo%20OR%20van%20rally%29%20when%3A30d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "Google News — Camper van gear",
    badge: "GEAR_SEARCH",
    url: "https://news.google.com/rss/search?q=%28camper%20van%20gear%20OR%20van%20conversion%20solar%20OR%20winnebago%20revel%29%20when%3A30d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    name: "RVBusiness",
    badge: "INDUSTRY_RSS",
    url: "https://rvbusiness.com/feed/",
  },
];

const affiliateCategories = [
  {
    id: "power-solar",
    label: "Power + solar upgrade list",
    keywords: ["battery", "solar", "inverter", "victron", "ecoflow", "goal zero", "power"],
    search: "van life solar battery inverter Victron portable power station",
    angle: "Turn news about power systems into a practical buyer checklist.",
  },
  {
    id: "camp-kitchen",
    label: "Camp kitchen essentials",
    keywords: ["camp", "kitchen", "fridge", "cook", "food", "restaurant"],
    search: "van life camp kitchen fridge induction cooktop storage",
    angle: "Pair destination/event news with the gear people need for the trip.",
  },
  {
    id: "security-privacy",
    label: "Security, tint, and privacy gear",
    keywords: ["security", "privacy", "tint", "window", "theft", "safe"],
    search: "van security window tint privacy screens dash camera",
    angle: "Useful for meetups, cities, and overnight parking stories.",
  },
  {
    id: "comfort-sleep",
    label: "Sleep, heat, and comfort",
    keywords: ["sleep", "heater", "winter", "mattress", "comfort", "fan"],
    search: "van life diesel heater roof fan mattress insulation",
    angle: "Convert weather/travel stories into comfort and safety product picks.",
  },
  {
    id: "recovery-tools",
    label: "Recovery and road tools",
    keywords: ["offroad", "overland", "trail", "tire", "recovery", "tools"],
    search: "overland van recovery gear tire inflator traction boards tool kit",
    angle: "Good fit for trail, expo, and remote travel stories.",
  },
];

const fixedSources = [
  {
    id: "overland-expo-events",
    title: "Overland Expo event calendar",
    source: "Overland Expo",
    url: "https://www.overlandexpo.com/",
    publishedAt: null,
    summary: "Official overland event source for current regional expos, dates, tickets, camping, education, and vendor lineups.",
    category: "events",
    badge: "OFFICIAL",
  },
  {
    id: "adventure-van-expo-events",
    title: "Adventure Van Expo schedule",
    source: "Adventure Van Expo",
    url: "https://adventurevanexpo.com/",
    publishedAt: null,
    summary: "Official van expo source for upcoming shows, builders, vendors, and meetup planning.",
    category: "events",
    badge: "OFFICIAL",
  },
  {
    id: "recreation-gov-camping",
    title: "Find nearby federal campgrounds",
    source: "Recreation.gov",
    url: "https://www.recreation.gov/search?q=camping",
    publishedAt: null,
    summary: "Official camping search for trip planning, campground availability, passes, and reservation windows.",
    category: "camping",
    badge: "OFFICIAL",
  },
];

function decodeEntities(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decodeEntities(match?.[1] ?? "");
}

function absolutizeGoogleNewsUrl(url) {
  if (!url) return url;
  if (url.startsWith("./")) return `https://news.google.com/${url.slice(2)}`;
  return url;
}

function categoryFor(text) {
  const haystack = text.toLowerCase();
  if (/expo|event|rally|show|festival|meetup/.test(haystack)) return "events";
  if (/solar|battery|inverter|power|electrical|starlink/.test(haystack)) return "power";
  if (/sprinter|transit|promaster|revel|winnebago|mercedes/.test(haystack)) return "vans";
  if (/camp|campground|boondock|park|trail/.test(haystack)) return "camping";
  if (/gear|product|review|sale|deal|marketplace|accessor/.test(haystack)) return "gear";
  return "vanlife";
}

function uniqueKey(item) {
  return `${item.title.toLowerCase()}|${item.url}`.replace(/\s+/g, " ");
}

async function fetchFeed(feed) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  try {
    const response = await fetch(feed.url, {
      headers: { "user-agent": USER_AGENT, accept: "application/rss+xml, application/xml, text/xml, */*" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const xml = await response.text();
    const blocks = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].map((m) => m[0]);
    return blocks.slice(0, 8).map((block, index) => {
      const title = getTag(block, "title");
      const description = getTag(block, "description");
      const source = getTag(block, "source") || feed.name;
      const rawUrl = getTag(block, "link") || getTag(block, "guid");
      const url = absolutizeGoogleNewsUrl(rawUrl);
      const publishedAt = getTag(block, "pubDate") || null;
      return {
        id: `${feed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
        title,
        source,
        url,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
        summary: description.slice(0, 240),
        category: categoryFor(`${title} ${description}`),
        badge: feed.badge,
      };
    }).filter((item) => item.title && item.url);
  } catch (error) {
    return [{
      id: `feed-error-${feed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: `${feed.name} currently unavailable`,
      source: feed.name,
      url: feed.url,
      publishedAt: null,
      summary: `Automated feed check could not read this source: ${error instanceof Error ? error.message : String(error)}. Open the source directly for current updates.`,
      category: "source-status",
      badge: "SOURCE_CHECK",
      unavailable: true,
    }];
  } finally {
    clearTimeout(timeout);
  }
}

function buildAffiliateUrl(search) {
  const tag = process.env.VANCIETY_AMAZON_AFFILIATE_TAG || process.env.AMAZON_ASSOCIATE_TAG || "";
  const base = `https://www.amazon.com/s?k=${encodeURIComponent(search)}`;
  return tag ? `${base}&tag=${encodeURIComponent(tag)}` : base;
}

function chooseAffiliateOpportunities(items) {
  const text = items.map((item) => `${item.title} ${item.summary}`).join(" ").toLowerCase();
  const scored = affiliateCategories.map((cat) => ({
    ...cat,
    score: cat.keywords.reduce((sum, keyword) => sum + (text.includes(keyword) ? 1 : 0), 0),
    url: buildAffiliateUrl(cat.search),
    affiliateActive: Boolean(process.env.VANCIETY_AMAZON_AFFILIATE_TAG || process.env.AMAZON_ASSOCIATE_TAG),
  })).sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map(({ keywords, ...item }) => item);
}

function buildDigest(items) {
  const availableItems = items.filter((item) => !item.unavailable);
  const topItems = [...availableItems, ...items.filter((item) => item.unavailable)].slice(0, MAX_ITEMS);
  const categories = [...new Set(topItems.map((item) => item.category))];
  const headline = topItems[0]?.title ?? "Daily van briefing";
  const bullets = topItems.slice(0, 5).map((item) => `${item.title} — ${item.source}`);
  const affiliateOpportunities = chooseAffiliateOpportunities(topItems);
  const videoPrompt = [
    "Create a 45-60 second vertical van-life news video for Vanciety.",
    "Tone: useful, friendly, premium, practical, no hype.",
    "Open with: 'Here is today's Vanciety van briefing.'",
    "Cover these updates:",
    ...bullets.map((bullet, i) => `${i + 1}. ${bullet}`),
    "End with: 'Join Vanciety for van events, gear research, member meetups, and daily van intelligence.'",
    "On-screen style: dark topo contour map background, clean captions, evergreen/charcoal/sand palette, subtle road-line motion.",
  ].join("\n");

  return {
    generatedAt: new Date().toISOString(),
    title: "Today’s Van Intelligence Briefing",
    subtitle: "Fresh van-life news, event leads, product angles, and social/video copy for Vanciety.",
    sourcePolicy: "Automated public RSS/news search plus official van-life source links. Open original sources to verify details before publishing or making purchase claims.",
    topStory: headline,
    categories,
    items: topItems,
    affiliateOpportunities,
    socialCopy: {
      facebook: `🚐 Today’s Vanciety van briefing:\n\n${bullets.map((b) => `• ${b}`).join("\n")}\n\nWhat are you watching in the van world this week?`,
      x: `Today’s Vanciety van briefing: ${bullets.slice(0, 2).join(" | ")} More van news, events, gear and trip ideas at Vanciety.`,
      youtubeDescription: `${bullets.join("\n")}\n\nLinks and source notes are inside the Vanciety daily briefing. Some gear links may be affiliate links when configured.`,
    },
    videoPrompt,
    emailListCTA: {
      headline: "Get the daily van briefing",
      copy: "Join the Vanciety list for van events, gear research, build ideas, product drops, and member meetup updates.",
      status: "Email provider not connected yet — wire to ConvertKit, Beehiiv, Mailchimp, or Supabase when selected.",
    },
    merchDropIdea: {
      theme: "Topo Roads Limited Drop",
      productIdeas: ["Topo contour tee", "Adventure van hoodie", "Camp mug", "Trail sticker pack"],
      releaseCadence: "Monthly core drop plus limited holiday editions.",
      fulfillment: "Print-on-demand provider not connected yet — recommended shortlist: Printful, Printify, Fourthwall, Shopify + Gelato.",
    },
  };
}

const feedResults = await Promise.all(feeds.map(fetchFeed));
const seen = new Set();
const items = [...feedResults.flat(), ...fixedSources].filter((item) => {
  const key = uniqueKey(item);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
const digest = buildDigest(items);
await mkdir(dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, `${JSON.stringify(digest, null, 2)}\n`, "utf8");
console.log(`Wrote ${OUTPUT_PATH}`);
console.log(`Items: ${digest.items.length}`);
console.log(`Top story: ${digest.topStory}`);
