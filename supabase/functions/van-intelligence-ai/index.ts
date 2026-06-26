// ============================================================
// van-intelligence-ai — server-side Claude diagnosis for the
// Van Intelligence repair hub.
//
// SECURITY: ANTHROPIC_API_KEY is held as a Supabase Edge Function
// secret and NEVER exposed to the browser. The frontend calls this
// function via supabase.functions.invoke("van-intelligence-ai", ...).
//
// Required secret: ANTHROPIC_API_KEY
// ============================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT =
  "You are a master Mercedes Sprinter and van-life mechanic and build advisor. " +
  "Given a described problem, return a clear, practical diagnosis and step-by-step repair guidance. " +
  "Be specific to Sprinter/diesel van platforms when relevant. " +
  "Format as: a one-line likely cause, then a short numbered list of diagnostic/repair steps, " +
  "then a one-line safety or 'when to see a pro' note. Never invent part numbers or prices — " +
  "tell the user to confirm exact parts against the factory reference for their engine and VIN.";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { issue } = await req.json().catch(() => ({ issue: "" }));

    if (!issue || typeof issue !== "string" || !issue.trim()) {
      return new Response(
        JSON.stringify({ ok: false, error: "Describe the van issue first." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ ok: false, error: "AI is not configured yet (missing ANTHROPIC_API_KEY)." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: issue.trim().slice(0, 2000) }],
      }),
    });

    if (!aiRes.ok) {
      const detail = await aiRes.text().catch(() => "");
      return new Response(
        JSON.stringify({ ok: false, error: `AI request failed (${aiRes.status}).`, detail }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await aiRes.json();
    const text = Array.isArray(data?.content)
      ? data.content.filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n").trim()
      : "";

    return new Response(
      JSON.stringify({ ok: true, diagnosis: text }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: "Unexpected error.", detail: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
