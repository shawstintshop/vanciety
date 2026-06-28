/**
 * vanaRouter.ts — Vana AI Intent Router
 * =========================================
 * Pure client-side. No API key, no network call, zero latency.
 *
 * Strategy: Score each question against a set of intent rules using
 * keyword matching. The highest-scoring rule wins and returns a
 * conversational reply + the best Vanciety page to link to.
 *
 * When the real AI backend is restored, swap handleSend() to call
 * the edge function again and keep this as a fallback.
 */

export interface VanaResponse {
  answer: string;
  /** Relative path to navigate to, e.g. "/forum" */
  page?: string;
  /** Human-readable label for the link button */
  pageLabel?: string;
}

interface IntentRule {
  /** Keywords/phrases — any match scores +1 per hit */
  keywords: string[];
  /** Regex patterns — any match scores +2 */
  patterns?: RegExp[];
  page: string;
  pageLabel: string;
  /** Template response. Use {q} to echo the question. */
  reply: string;
  /** Base score before keyword matching */
  priority?: number;
}

const RULES: IntentRule[] = [
  // ── REPAIR / MECHANICAL ─────────────────────────────────────────
  {
    keywords: ["repair", "fix", "broke", "broken", "code", "p0", "dtc", "check engine", "oil", "leak",
               "transmission", "engine", "sprinter", "transit", "promaster", "mechanic", "service",
               "diagnostic", "fault", "error", "won't start", "wont start", "overheating", "coolant",
               "brake", "clutch", "alternator", "battery dead", "starter", "belt", "timing"],
    patterns: [/p\d{4}/i, /error code/i, /won.?t start/i],
    page: "/van-intelligence",
    pageLabel: "Open Van Intelligence",
    reply: "Sounds like a repair question — Van Intelligence is the right place. It has step-by-step guides for the most common Sprinter, Transit, and Promaster issues, with tool lists and video walkthroughs.",
  },
  // ── SOLAR / ELECTRICAL ──────────────────────────────────────────
  {
    keywords: ["solar", "panel", "battery", "lithium", "lifepo4", "inverter", "shore power",
               "electrical", "wiring", "amp", "watt", "volt", "charge controller", "mppt",
               "victron", "renogy", "bluetti", "jackery", "power station", "shore", "hookup",
               "generator", "alternator charge", "dc-dc", "dc dc", "b2b"],
    page: "/shop",
    pageLabel: "Browse Van Shop",
    reply: "Great solar/electrical question! The Van Shop has curated gear picks for solar panels, lithium batteries, charge controllers, and inverters — all with real specs and affiliate links. For install guides, check Van Intelligence too.",
  },
  // ── INSULATION / BUILD ──────────────────────────────────────────
  {
    keywords: ["insulation", "build", "conversion", "convert", "diy", "floor", "walls", "ceiling",
               "framing", "wood", "plywood", "foam", "spray foam", "thinsulate", "polyiso",
               "vapor barrier", "condensation", "moisture", "subfloor", "vinyl", "tile",
               "cabinet", "bed platform", "couch", "sofa", "layout", "design"],
    page: "/van-intelligence",
    pageLabel: "Open Van Intelligence",
    reply: "Van builds are our specialty! Van Intelligence has guides on insulation, framing, flooring, and full conversion walkthroughs. The Forum is also great for build-specific questions from the community.",
  },
  // ── VENTILATION / FANS ──────────────────────────────────────────
  {
    keywords: ["fan", "vent", "ventilation", "maxxair", "fantastic fan", "roof vent", "air flow",
               "airflow", "humidity", "condensation", "hot", "heat", "cool", "cooling", "ac",
               "air conditioning", "climate"],
    page: "/shop",
    pageLabel: "Browse Van Shop",
    reply: "Ventilation is critical in a van build! The Van Shop has top-rated roof fans like Maxxair and Fantastic Fan. Van Intelligence also has a guide on managing heat and humidity.",
  },
  // ── KITCHEN / COOKING ───────────────────────────────────────────
  {
    keywords: ["kitchen", "cook", "cooking", "fridge", "refrigerator", "cooler", "stove", "propane",
               "butane", "induction", "sink", "water", "plumbing", "tank", "pump", "filter",
               "food", "meal", "prep", "dometic", "iceco", "alpicool"],
    page: "/shop",
    pageLabel: "Browse Van Shop",
    reply: "Kitchen setups are a big part of van life! The Van Shop has fridges, stoves, and water systems. Check the Forum too — lots of members share their kitchen build photos and tips.",
  },
  // ── SLEEPING / BED ──────────────────────────────────────────────
  {
    keywords: ["bed", "sleep", "mattress", "platform", "murphy", "fold", "convertible", "couch bed",
               "sleeping", "rest", "comfort", "pillow", "sheets"],
    page: "/van-intelligence",
    pageLabel: "Open Van Intelligence",
    reply: "Bed design is one of the most personal parts of a van build! Van Intelligence has layout guides for fixed beds, fold-out platforms, and Murphy-style setups. The Forum has tons of real-world examples too.",
  },
  // ── CAMPING / STEALTH ───────────────────────────────────────────
  {
    keywords: ["camp", "camping", "stealth", "overnight", "parking", "sleep", "boondock", "boondocking",
               "dispersed", "blm", "national forest", "free camp", "campsite", "spot", "location",
               "where to park", "urban camping", "city", "walmart", "cracker barrel", "rest stop",
               "truck stop", "casino", "harvest host"],
    page: "/resources",
    pageLabel: "Open Resource Board",
    reply: "Finding spots is the lifeblood of van life! The Resource Board is where the community shares water fill stations, dump stations, free parking, and stealth spots. The Map also shows member locations and events near you.",
  },
  // ── WATER / DUMP STATIONS ───────────────────────────────────────
  {
    keywords: ["water", "fill", "dump", "dump station", "grey water", "black water", "tank", "waste",
               "fresh water", "potable", "refill", "rv dump", "sewer"],
    page: "/resources",
    pageLabel: "Open Resource Board",
    reply: "The Resource Board is exactly what you need — members share water fill stations, dump stations, and free overnight spots across the country. Add your own finds to help the community!",
  },
  // ── EVENTS / MEETUPS ────────────────────────────────────────────
  {
    keywords: ["event", "meetup", "meet up", "rally", "gathering", "festival", "vanlife", "van life",
               "convention", "show", "expo", "overland", "overlanding", "get together", "community",
               "near me", "local"],
    page: "/events",
    pageLabel: "Browse Events",
    reply: "There are van life events and meetups happening all the time! Head to the Events page to find rallies, workshops, and gatherings on the interactive map — filter by location and date.",
  },
  // ── FIND MEMBERS / COMMUNITY ────────────────────────────────────
  {
    keywords: ["find", "connect", "member", "people", "van lifer", "community", "friend", "meet",
               "other van", "nearby", "who is", "local van", "van life friend", "travel buddy",
               "caravan", "convoy"],
    page: "/friend-finder",
    pageLabel: "Find Members",
    reply: "Find Members is the place for that! It shows van lifers who've opted in to share their general location (city-level only, never GPS). Great for finding travel buddies or getting local tips.",
  },
  // ── FORUM / QUESTIONS ───────────────────────────────────────────
  {
    keywords: ["forum", "post", "question", "ask", "advice", "help", "opinion", "recommend",
               "suggestion", "thread", "discuss", "discussion", "community", "tips", "tricks"],
    page: "/forum",
    pageLabel: "Go to Forum",
    reply: "The Forum is the best place for open questions and community advice. Thousands of real van lifers are there to help — post your question and you'll usually get solid answers fast.",
  },
  // ── CAMPFIRE BOARDS ─────────────────────────────────────────────
  {
    keywords: ["campfire", "board", "topic", "async", "introvert", "quiet", "slow", "chill",
               "no pressure", "anonymous", "share", "story", "experience"],
    page: "/campfire",
    pageLabel: "Open Campfire Boards",
    reply: "Campfire Boards are Vanciety's async community spaces — no pressure, no real-time chat. Pick a topic board, share your story or question, and read others at your own pace. Perfect for introverts.",
  },
  // ── TRIP JOURNALS ───────────────────────────────────────────────
  {
    keywords: ["journal", "trip", "log", "diary", "route", "road trip", "travel", "adventure",
               "document", "share trip", "write", "story"],
    page: "/journals",
    pageLabel: "Open Trip Journals",
    reply: "Trip Journals let you document and share your van life adventures — routes, photos, and notes. Browse other members' journeys for route inspiration too.",
  },
  // ── MARKETPLACE / BUY-SELL ──────────────────────────────────────
  {
    keywords: ["buy", "sell", "sale", "listing", "marketplace", "used", "second hand", "secondhand",
               "for sale", "price", "how much", "van for sale", "parts", "gear", "equipment",
               "trade", "swap"],
    page: "/marketplace",
    pageLabel: "Go to Marketplace",
    reply: "The Marketplace is where the Vanciety community buys and sells vans, parts, and gear. You can browse listings or post your own — all within the community.",
  },
  // ── SHOP / AFFILIATE GEAR ───────────────────────────────────────
  {
    keywords: ["shop", "gear", "product", "buy new", "recommend", "best", "top", "review",
               "affiliate", "amazon", "link", "purchase", "kit", "setup"],
    page: "/shop",
    pageLabel: "Browse Van Shop",
    reply: "The Van Shop has curated gear picks across every van build category — solar, electrical, kitchen, ventilation, sleeping, safety, and more. All links go straight to Amazon with real product specs.",
  },
  // ── VENDORS / BUILDERS ──────────────────────────────────────────
  {
    keywords: ["builder", "build company", "conversion company", "upfitter", "vendor", "shop",
               "professional", "hire", "custom build", "who builds", "find a builder",
               "sprinter builder", "transit builder", "van builder"],
    page: "/vendors",
    pageLabel: "Find Builders & Vendors",
    reply: "Looking for a pro to build your van? The Vendors page lists trusted van builders, upfitters, and parts suppliers across the country — searchable by location and specialty.",
  },
  // ── VIDEOS ──────────────────────────────────────────────────────
  {
    keywords: ["video", "youtube", "watch", "tutorial", "how to", "walkthrough", "demo",
               "tour", "van tour", "build video", "install video"],
    page: "/videos",
    pageLabel: "Watch How-To Videos",
    reply: "The Videos page has curated van build and maintenance videos from the best creators on YouTube — organized by topic so you can find exactly what you need.",
  },
  // ── MEMBER SPOTLIGHT ────────────────────────────────────────────
  {
    keywords: ["member tips", "insider tips", "local tips", "community tips", "weekly", "member", "feature",
               "icebreaker", "introduce", "profile"],
    page: "/icebreaker",
    pageLabel: "Member Tips",
    reply: "Member Tips is where the community shares knowledge and stories — a new member is featured each week with their van setup, tips, and experience. Great way to get inspired!",
  },
  // ── SIGN UP / JOIN ──────────────────────────────────────────────
  {
    keywords: ["join", "sign up", "register", "account", "create account", "membership",
               "free", "how do i join", "login", "log in", "sign in"],
    page: "/auth",
    pageLabel: "Join Vanciety Free",
    reply: "Joining Vanciety is completely free — no credit card needed. Create an account to access the community, post in the Forum, use the Member Map, and more.",
  },
  // ── VANNA / AI ──────────────────────────────────────────────────
  {
    keywords: ["vana", "vana", "ai", "assistant", "chat", "bot", "help me", "who are you",
               "what can you do", "what is this"],
    page: "/ai",
    pageLabel: "Open Vana AI",
    reply: "I'm Vana — Vanciety's AI van life guide! I can point you to repair guides, gear recommendations, community boards, events, and more. The full Vana AI page has an expanded chat interface. What do you need help with?",
  },
  // ── SAFETY / SECURITY ───────────────────────────────────────────
  {
    keywords: ["safe", "safety", "security", "lock", "alarm", "theft", "break in", "break-in",
               "protect", "solo", "woman", "women", "female", "solo travel", "danger"],
    page: "/shop",
    pageLabel: "Browse Van Shop",
    reply: "Van life safety is important! The Van Shop has security gear like door locks, alarms, and window covers. The Forum also has a great thread on solo van life safety tips from experienced members.",
  },
  // ── HEATING / WINTER ────────────────────────────────────────────
  {
    keywords: ["heat", "heater", "heating", "diesel heater", "webasto", "espar", "propex",
               "chinese heater", "winter", "cold", "freeze", "snow", "insulate for cold"],
    page: "/shop",
    pageLabel: "Browse Van Shop",
    reply: "Staying warm in a van is all about the right heater and insulation combo. The Van Shop has diesel heaters (Webasto, Espar, budget Chinese options) and Van Intelligence has cold-weather build guides.",
  },
  // ── NEWS / CONTENT ──────────────────────────────────────────────
  {
    keywords: ["news", "latest", "update", "article", "read", "blog", "content", "feed",
               "what's new", "whats new", "recent", "trending"],
    page: "/news",
    pageLabel: "Read Van Life News",
    reply: "The News page pulls in the latest van life articles, gear reviews, and community content from top sources — updated daily. Check it out for what's happening in the van life world right now.",
  },
];

// ── Fallback when nothing matches ───────────────────────────────
const FALLBACK: VanaResponse = {
  answer: "Great question! I'm not sure which part of Vanciety fits that best — try the Forum where the community can give you a real answer, or browse the site to find what you need.",
  page: "/forum",
  pageLabel: "Ask in the Forum",
};

// ── Scorer ───────────────────────────────────────────────────────
function scoreRule(rule: IntentRule, q: string): number {
  const lower = q.toLowerCase();
  let score = rule.priority ?? 0;
  for (const kw of rule.keywords) {
    if (lower.includes(kw.toLowerCase())) score += 1;
  }
  for (const rx of rule.patterns ?? []) {
    if (rx.test(lower)) score += 2;
  }
  return score;
}

// ── Main export ──────────────────────────────────────────────────
export function routeVanaQuestion(question: string): VanaResponse {
  if (!question.trim()) return FALLBACK;

  let best: IntentRule | null = null;
  let bestScore = 0;

  for (const rule of RULES) {
    const s = scoreRule(rule, question);
    if (s > bestScore) {
      bestScore = s;
      best = rule;
    }
  }

  if (!best || bestScore === 0) return FALLBACK;

  return {
    answer: best.reply,
    page: best.page,
    pageLabel: best.pageLabel,
  };
}
