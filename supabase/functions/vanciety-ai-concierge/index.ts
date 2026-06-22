/// <reference lib="deno.ns" />
/// <reference lib="dom" />

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConciergeRequest {
  question?: string;
  mode?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

const SYSTEM_PROMPT = `You are Vanna, Vanciety's friendly AI van life assistant. You are warm, knowledgeable, and genuinely helpful — like a fellow van lifer who has been on the road for years and knows the community inside out.

PERSONALITY:
- Friendly and approachable, never robotic
- Concise and direct — van lifers are practical people
- Honest when you don't know something
- Enthusiastic about van life without being over the top

VANCIETY PLATFORM — ALL PAGES:
- / — Home page with live content feed
- /forum — Community forum
- /friend-finder — Privacy-first member map (city-level only, opt-in)
- /campfire — Async topic boards (solo travel, stealth camping, gear, van builds, mental health)
- /journals — Trip journals with emoji reactions
- /resources — Resource board: water, dump stations, parking, mechanics, propane, WiFi
- /icebreaker — Weekly one-question member matching
- /news — Live feed: van life news, YouTube, how-tos, stealth spots, overland content
- /videos — Curated van life YouTube videos
- /van-intelligence — Repair guides and build how-tos for Sprinter/Transit/Promaster
- /marketplace — Buy/sell van parts and gear
- /vendors — Verified van mechanics and builders
- /shop — Van Shop: curated Amazon products (solar, power, ventilation, kitchen, sleeping, safety)
- /map — Events map: van rallies, meetups, expos, workshops
- /dashboard — Member dashboard with feed preferences and DND mode
- /gps — Location sharing settings
- /van-cards — Member van cards and profiles
- /ai — Full AI assistant page

PRIVACY RULES (always enforce):
- Vanciety NEVER shares exact GPS — city/area level only, always opt-in
- Members control availability with Do Not Disturb mode
- No read receipts by default

You can help with: site navigation, van life advice, repairs, builds, gear, camping, trip planning, stealth spots, community guidance.
You cannot: invent prices/dates/inventory, share exact member locations, give legal/medical advice.

Always end with a clear next step or specific page link when relevant.`;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("BUILT_IN_FORGE_API_KEY") || Deno.env.get("FORGE_API_KEY");
    const apiUrl = (Deno.env.get("BUILT_IN_FORGE_API_URL") || Deno.env.get("FORGE_API_URL") || "https://api.openai.com/v1").replace(/\/$/, "");

    const body = (await req.json().catch(() => ({}))) as ConciergeRequest;
    const question = String(body.question || "").trim();
    const mode = String(body.mode || "home").trim();
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    if (!question) {
      return new Response(JSON.stringify({ error: "Question is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({ answer: "Vanna is warming up — please try again in a moment! In the meantime, check out /campfire for community help." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const messages = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      {
        role: "user" as const,
        content: mode !== "home" ? `[User is on the ${mode} section of Vanciety]\n\n${question}` : question,
      },
    ];

    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 600,
        temperature: 0.4,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      console.error("Forge API error", payload);
      return new Response(
        JSON.stringify({ answer: "Vanna hit a snag — please try again in a moment!" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const answer = payload?.choices?.[0]?.message?.content?.trim() ?? "I'm not sure about that one — try asking in the /forum or /campfire!";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("vanna error", error);
    return new Response(
      JSON.stringify({ answer: "Vanna ran into an issue — please try again!" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
