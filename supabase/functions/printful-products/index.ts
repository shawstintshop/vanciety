// ============================================================
// printful-products — Fetch live product catalog from Printful API v2
//
// SECURITY: PRINTFUL_API_KEY is a Supabase secret, never exposed to browser.
// Frontend calls: supabase.functions.invoke("printful-products", { body: { action } })
//
// Required secret: PRINTFUL_API_KEY
// Set via: supabase secrets set PRINTFUL_API_KEY=your_key_here
//
// Actions:
//   list_products  — returns all sync products with variants + mockup images
//   get_product    — returns single product detail by id
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRINTFUL_BASE = "https://api.printful.com";

async function printfulFetch(path: string, apiKey: string) {
  const res = await fetch(`${PRINTFUL_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Printful API error ${res.status}: ${err}`);
  }
  return res.json();
}

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

    const { action, product_id, limit = 50, offset = 0 } = await req.json();

    if (action === "list_products") {
      // Fetch sync products list
      const data = await printfulFetch(
        `/sync/products?limit=${limit}&offset=${offset}`,
        apiKey
      );

      // For each product, fetch full detail to get variants + mockup images
      const products = await Promise.all(
        (data.result || []).map(async (p: { id: number }) => {
          try {
            const detail = await printfulFetch(`/sync/products/${p.id}`, apiKey);
            const product = detail.result?.sync_product;
            const variants = detail.result?.sync_variants || [];

            // Get the first mockup image from variants
            const mockupImage =
              variants[0]?.files?.find((f: { type: string }) => f.type === "preview")?.preview_url ||
              variants[0]?.files?.find((f: { type: string }) => f.type === "default")?.preview_url ||
              product?.thumbnail_url ||
              null;

            // Collect all unique mockup images
            const allImages = [
              ...new Set(
                variants
                  .flatMap((v: { files?: { type: string; preview_url?: string }[] }) =>
                    (v.files || [])
                      .filter((f) => f.type === "preview" || f.type === "default")
                      .map((f) => f.preview_url)
                  )
                  .filter(Boolean)
              ),
            ].slice(0, 4);

            // Get price range from variants
            const prices = variants
              .map((v: { retail_price?: string }) => parseFloat(v.retail_price || "0"))
              .filter((p: number) => p > 0);
            const minPrice = prices.length ? Math.min(...prices) : 0;
            const maxPrice = prices.length ? Math.max(...prices) : 0;

            // Get available sizes/colors from variants
            const sizes = [...new Set(variants.map((v: { size?: string }) => v.size).filter(Boolean))];
            const colors = [...new Set(variants.map((v: { color?: string }) => v.color).filter(Boolean))];

            return {
              id: product.id,
              external_id: product.external_id,
              name: product.name,
              thumbnail_url: mockupImage,
              images: allImages,
              variants_count: variants.length,
              min_price: minPrice,
              max_price: maxPrice,
              price_display:
                minPrice === maxPrice
                  ? `$${minPrice.toFixed(2)}`
                  : `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`,
              sizes,
              colors,
              is_ignored: product.is_ignored,
            };
          } catch (_e) {
            return null;
          }
        })
      );

      return new Response(
        JSON.stringify({
          products: products.filter(Boolean),
          total: data.paging?.total || products.length,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "get_product" && product_id) {
      const detail = await printfulFetch(`/sync/products/${product_id}`, apiKey);
      const product = detail.result?.sync_product;
      const variants = detail.result?.sync_variants || [];

      return new Response(
        JSON.stringify({ product, variants }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action. Use: list_products, get_product" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
