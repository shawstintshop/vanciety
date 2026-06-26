// ============================================================
// fourthwall-products — Fetch live product catalog from Fourthwall Platform API
//
// SECURITY: Credentials are Supabase secrets, never exposed to browser.
// Frontend calls: supabase.functions.invoke("fourthwall-products")
//
// Required secrets (set in Supabase Dashboard → Edge Functions → Secrets):
//   FOURTHWALL_API_USER     = fw_api_cdkkmpbko6av2ijuzlsv@fourthwall.com
//   FOURTHWALL_API_PASS     = z1Osao4CkQYQM4P1ewmhicmr15T3qoVVBAztlw7q
//
// Returns: { products: FourthwallProduct[], total: number, storeUrl: string }
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FOURTHWALL_BASE = "https://api.fourthwall.com/open-api/v1.0";
const STORE_URL = "https://vanciety-shop.fourthwall.com";

interface FWVariant {
  id: string;
  name: string;
  unitPrice?: { value: number; currency: string };
  attributes?: { name: string; value: string }[];
  stock?: { type: string };
}

interface FWImage {
  id: string;
  url: string;
  transformedUrl?: string;
}

interface FWProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  state?: { type: string };
  access?: { type: string };
  thumbnailImage?: FWImage;
  images?: FWImage[];
  variants?: FWVariant[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiUser = Deno.env.get("FOURTHWALL_API_USER");
    const apiPass = Deno.env.get("FOURTHWALL_API_PASS");

    if (!apiUser || !apiPass) {
      return new Response(
        JSON.stringify({
          error: "Fourthwall credentials not configured",
          hint: "Set FOURTHWALL_API_USER and FOURTHWALL_API_PASS in Supabase Edge Function secrets",
          products: [],
          total: 0,
          storeUrl: STORE_URL,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic Auth header
    const credentials = btoa(`${apiUser}:${apiPass}`);
    const headers = {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip",
    };

    // Fetch all products (paginate if needed)
    let allProducts: FWProduct[] = [];
    let page = 0;
    let totalPages = 1;

    while (page < totalPages) {
      const res = await fetch(
        `${FOURTHWALL_BASE}/products?limit=50&page=${page}`,
        { headers }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Fourthwall API error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      allProducts = allProducts.concat(data.results || []);
      totalPages = data.totalPages || 1;
      page++;
    }

    // Normalize products for the frontend
    const products = allProducts.map((p: FWProduct) => {
      const variants = p.variants || [];

      // Get price range
      const prices = variants
        .map((v) => v.unitPrice?.value)
        .filter((v): v is number => typeof v === "number" && v > 0);
      const minPrice = prices.length ? Math.min(...prices) : 0;
      const maxPrice = prices.length ? Math.max(...prices) : 0;
      const currency = variants[0]?.unitPrice?.currency || "USD";

      // Format price display
      const formatPrice = (cents: number) =>
        (cents / 100).toLocaleString("en-US", { style: "currency", currency });
      const priceDisplay =
        minPrice === maxPrice || maxPrice === 0
          ? formatPrice(minPrice)
          : `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;

      // Extract sizes and colors from variant attributes
      const sizes = [
        ...new Set(
          variants
            .flatMap((v) => v.attributes || [])
            .filter((a) => a.name.toLowerCase() === "size")
            .map((a) => a.value)
        ),
      ];
      const colors = [
        ...new Set(
          variants
            .flatMap((v) => v.attributes || [])
            .filter((a) => a.name.toLowerCase() === "color")
            .map((a) => a.value)
        ),
      ];

      // Best thumbnail: use transformedUrl (720px) if available, else raw url
      const thumb =
        p.thumbnailImage?.transformedUrl ||
        p.thumbnailImage?.url ||
        p.images?.[0]?.transformedUrl ||
        p.images?.[0]?.url ||
        "";

      // All images
      const images = (p.images || []).map(
        (img) => img.transformedUrl || img.url
      );

      // Product URL on Fourthwall store
      const productUrl = `${STORE_URL}/products/${p.slug}`;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        thumbnail: thumb,
        images,
        price: priceDisplay,
        priceRaw: minPrice,
        currency,
        sizes,
        colors,
        productUrl,
        available: p.state?.type === "AVAILABLE",
        variantCount: variants.length,
      };
    });

    // Sort: available first, then by name
    products.sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return new Response(
      JSON.stringify({
        products,
        total: products.length,
        storeUrl: STORE_URL,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("fourthwall-products error:", err);
    return new Response(
      JSON.stringify({
        error: String(err),
        products: [],
        total: 0,
        storeUrl: STORE_URL,
      }),
      {
        status: 200, // Return 200 so frontend can handle gracefully
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
