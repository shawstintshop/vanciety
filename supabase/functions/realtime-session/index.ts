// Realtime Session Token Proxy
// Issues a short-lived ephemeral OpenAI Realtime API token so the browser
// never sees the real OPENAI_API_KEY. Called by VoiceVanny before connecting.
//
// Required Supabase secret:  OPENAI_API_KEY
// Optional:                  OPENAI_REALTIME_MODEL (default: gpt-4o-realtime-preview)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const model = Deno.env.get("OPENAI_REALTIME_MODEL") ?? "gpt-4o-realtime-preview";

    // Create ephemeral session token via OpenAI Realtime Sessions API
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice: "alloy",
        instructions: [
          "You are Vanny, the friendly AI assistant for Vanciety.com — the complete vanlife community.",
          "You help members with: van builds and repairs, trip planning, campsite discovery, van events,",
          "finding mechanics and builders, gear recommendations, and connecting with other van owners.",
          "Keep responses concise, warm, and practical. You know vanlife deeply.",
          "Never give medical, legal, or financial advice. If asked, redirect to qualified professionals.",
          "If asked about pricing, say prices change and link to the vendor directly.",
        ].join(" "),
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 800,
        },
        input_audio_transcription: { model: "whisper-1" },
        max_response_output_tokens: 512,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(
        JSON.stringify({ error: "OpenAI session failed", detail: err }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const session = await response.json();

    return new Response(JSON.stringify(session), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
