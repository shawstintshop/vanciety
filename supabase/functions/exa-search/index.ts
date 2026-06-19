// Exa.ai Search Edge Function for Vanciety
// Proxies requests to Exa neural search API — keeps EXA_API_KEY server-side.
//
// Required Supabase secret:  EXA_API_KEY
// Free tier: 1000 searches/month at exa.ai
//
// POST body: { query: string, category?: string, numResults?: number }
// Returns:   { results: ExaResult[], requestId: string }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Vanlife-focused search domains — Exa's domain filter keeps results relevant
const VANLIFE_DOMAINS = [
  "reddit.com/r/vandwellers",
  "reddit.com/r/vandwellerUrbanStrategy",
  "reddit.com/r/overlanding",
  "faroutride.com",
  "explorist.life",
  "gnomad.life",
  "vanlifeexplorers.com",
  "sprinterlife.com",
  "fordtransitusaforum.com",
  "thervgeeks.com",
  "outsidevan.com",
  "storytelleroverland.com",
  "overlandexpo.com",
  "adventurevanexpo.com",
  "descendonbend.com",
  "freecampsites.net",
  "dyrt.com",
  "recreation.gov",
  "blm.gov",
  "youtube.com",
];

// Category → query context map for smarter search
const CATEGORY_CONTEXT: Record<string, string> = {
  builds: "van build conversion DIY Sprinter Transit",
  electrical: "van electrical solar Victron lithium battery",
  plumbing: "van plumbing water system sink shower",
  camping: "van camping free dispersed BLM camping spot",
  events: "vanlife event rally expo gathering meetup",
  gear: "van gear equipment accessories upgrade review",
  mechanics: "van mechanic repair service shop Sprinter",
  community: "vanlife community tips advice experience",
  news: "vanlife news 2025 2026 latest",
};

interface ExaSearchBody {
  query: string;
  category?: string;
  numResults?: number;
  useAutoprompt?: boolean;
  type?: "neural" | "keyword" | "auto";
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  contents?: {
    text?: { maxCharacters?: number };
    highlights?: { numSentences?: number; highlightsPerUrl?: number };
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("EXA_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "EXA_API_KEY not configured in Supabase secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json() as {
      query: string;
      category?: string;
      numResults?: number;
      freshness?: "day" | "week" | "month" | "year";
      focusVanlife?: boolean;
    };

    if (!body.query?.trim()) {
      return new Response(
        JSON.stringify({ error: "query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build enriched query with category context
    const contextHint = body.category ? CATEGORY_CONTEXT[body.category] ?? "" : "";
    const enrichedQuery = contextHint
      ? `${body.query} ${contextHint}`
      : body.query;

    // Freshness filter
    let startPublishedDate: string | undefined;
    const now = new Date();
    if (body.freshness === "day") {
      startPublishedDate = new Date(now.getTime() - 86400000).toISOString();
    } else if (body.freshness === "week") {
      startPublishedDate = new Date(now.getTime() - 7 * 86400000).toISOString();
    } else if (body.freshness === "month") {
      startPublishedDate = new Date(now.getTime() - 30 * 86400000).toISOString();
    }

    const exaBody: ExaSearchBody = {
      query: enrichedQuery,
      numResults: Math.min(body.numResults ?? 8, 20),
      type: "auto",
      useAutoprompt: true,
      contents: {
        text: { maxCharacters: 400 },
        highlights: { numSentences: 2, highlightsPerUrl: 1 },
      },
    };

    if (body.focusVanlife !== false) {
      exaBody.includeDomains = VANLIFE_DOMAINS;
    }

    if (startPublishedDate) {
      exaBody.startPublishedDate = startPublishedDate;
    }

    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exaBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ error: "Exa API error", status: response.status, detail: errText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    // Shape the response for the client
    const results = (data.results ?? []).map((r: {
      id?: string;
      url: string;
      title: string;
      score?: number;
      publishedDate?: string;
      author?: string;
      text?: string;
      highlights?: string[];
    }) => ({
      id: r.id ?? r.url,
      url: r.url,
      title: r.title,
      score: r.score,
      publishedDate: r.publishedDate,
      author: r.author,
      snippet: r.highlights?.[0] ?? r.text?.slice(0, 200) ?? "",
    }));

    return new Response(
      JSON.stringify({ results, requestId: data.requestId, query: body.query }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
