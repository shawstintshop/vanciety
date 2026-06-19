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
  context?: string;
}

const SYSTEM_PROMPT = `You are Vanciety AI Concierge, a practical assistant for Sprinter van, overland van, Revel, and van-life visitors.

Rules:
- Help the visitor plan, compare, ask better questions, and decide which Vanciety source links to open next.
- Do not invent prices, event dates, inventory, ratings, reviews, legal advice, road access, campsite availability, or mechanic credentials.
- Tell visitors to verify prices, fitment, warranties, seller identity, bookings, road rules, and safety details on the linked official/source pages.
- Keep exact private location details out of public guidance. Prefer approximate areas and safe public meetups.
- Be concise, friendly, and action-oriented.`;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    const model = Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-4-6";

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Vanciety AI is not configured yet. Set ANTHROPIC_API_KEY as a Supabase Edge Function secret.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json().catch(() => ({}))) as ConciergeRequest;
    const question = String(body.question || "").trim();
    const mode = String(body.mode || "home").trim();
    const context = String(body.context || "").slice(0, 6000);

    if (!question) {
      return new Response(JSON.stringify({ error: "Question is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 900,
        temperature: 0.3,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              `Mode: ${mode}`,
              "Vanciety context:",
              context,
              "Visitor question:",
              question,
            ].join("\n\n"),
          },
        ],
      }),
    });

    const payload = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      console.error("Anthropic error", payload);
      return new Response(
        JSON.stringify({ error: "Vanciety AI request failed. Please try again shortly." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const answer = payload?.content?.map((part: { text?: string }) => part.text || "").join("\n").trim();

    return new Response(JSON.stringify({ answer, model }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("vanciety-ai-concierge error", error);
    return new Response(JSON.stringify({ error: "Unexpected AI concierge error." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
