// ============================================================
// printful-checkout — Create a Printful order on behalf of a customer
//
// SECURITY: PRINTFUL_API_KEY is a Supabase secret, never exposed to browser.
// Frontend calls: supabase.functions.invoke("printful-checkout", { body: { ... } })
//
// Required secret: PRINTFUL_API_KEY
//
// Request body:
// {
//   recipient: { name, address1, city, state_code, country_code, zip, email, phone? },
//   items: [{ sync_variant_id, quantity }],
//   retail_costs?: { shipping: "0.00" }  // optional override
// }
//
// Returns: { order_id, status, shipping_cost, retail_costs }
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRINTFUL_BASE = "https://api.printful.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("PRINTFUL_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "PRINTFUL_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { recipient, items } = body;

    if (!recipient || !items || !items.length) {
      return new Response(
        JSON.stringify({ error: "recipient and items are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate required recipient fields
    const required = ["name", "address1", "city", "state_code", "country_code", "zip", "email"];
    for (const field of required) {
      if (!recipient[field]) {
        return new Response(
          JSON.stringify({ error: `recipient.${field} is required` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // First estimate shipping cost
    const estimateRes = await fetch(`${PRINTFUL_BASE}/orders/estimate-costs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient,
        items: items.map((item: { sync_variant_id: number; quantity: number }) => ({
          sync_variant_id: item.sync_variant_id,
          quantity: item.quantity,
        })),
      }),
    });

    let shippingCost = "0.00";
    if (estimateRes.ok) {
      const estimate = await estimateRes.json();
      shippingCost = estimate.result?.costs?.shipping || "0.00";
    }

    // Create the order (draft mode — confirm manually in Printful dashboard)
    const orderRes = await fetch(`${PRINTFUL_BASE}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient,
        items: items.map((item: { sync_variant_id: number; quantity: number }) => ({
          sync_variant_id: item.sync_variant_id,
          quantity: item.quantity,
        })),
        // confirm: false means draft — won't charge or produce until confirmed
        confirm: false,
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      return new Response(
        JSON.stringify({ error: `Printful order creation failed: ${err}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const order = await orderRes.json();
    const result = order.result;

    return new Response(
      JSON.stringify({
        order_id: result.id,
        status: result.status,
        shipping_cost: shippingCost,
        retail_costs: result.retail_costs,
        created: result.created,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
