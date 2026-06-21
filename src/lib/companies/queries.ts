import { supabase } from "@/integrations/supabase/client";
import type {
  Company, CompanyProduct, CompanyService, CompanyEvent, CompanyVideo,
  CompanyReview, CompanyFAQ, CompanyPromotion, CompanyLead, LeadStatus,
  AIContentJob, CompanyDashboardStats,
} from "./types";

// The vendor tables are newer than the generated Database type, so use an
// untyped view of the client and cast results to our domain interfaces.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = supabase as any;

export interface CompanyFilters {
  category?: string;
  state?: string;
  search?: string;
  featured?: boolean;
}

// ── Public queries ───────────────────────────────────────────────────────────
export async function getPublishedCompanies(filters: CompanyFilters = {}): Promise<Company[]> {
  try {
    let q = sb.from("companies").select("*").eq("status", "published");
    if (filters.category && filters.category !== "all") q = q.eq("category", filters.category);
    if (filters.state && filters.state !== "all") q = q.eq("state", filters.state);
    if (filters.featured) q = q.eq("featured", true);
    if (filters.search) {
      const s = `%${filters.search}%`;
      q = q.or(`name.ilike.${s},tagline.ilike.${s},city.ilike.${s},category.ilike.${s}`);
    }
    q = q.order("featured", { ascending: false }).order("name", { ascending: true });
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as Company[];
  } catch (e) {
    console.error("getPublishedCompanies failed:", e);
    return [];
  }
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  try {
    const { data, error } = await sb.from("companies").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return (data as Company) ?? null;
  } catch (e) {
    console.error("getCompanyBySlug failed:", e);
    return null;
  }
}

export async function getCompanyProducts(
  companyId: string,
  filters: { category?: string; inStock?: boolean } = {}
): Promise<CompanyProduct[]> {
  try {
    let q = sb.from("company_products").select("*").eq("company_id", companyId).eq("status", "published");
    if (filters.category && filters.category !== "all") q = q.eq("category", filters.category);
    if (filters.inStock) q = q.eq("in_stock", true);
    q = q.order("featured", { ascending: false }).order("created_at", { ascending: false });
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as CompanyProduct[];
  } catch (e) {
    console.error("getCompanyProducts failed:", e);
    return [];
  }
}

export async function getCompanyServices(companyId: string): Promise<CompanyService[]> {
  try {
    const { data, error } = await sb
      .from("company_services").select("*")
      .eq("company_id", companyId).eq("status", "active")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as CompanyService[];
  } catch (e) {
    console.error("getCompanyServices failed:", e);
    return [];
  }
}

export async function getCompanyEvents(companyId: string): Promise<CompanyEvent[]> {
  try {
    const { data, error } = await sb
      .from("company_events").select("*")
      .eq("company_id", companyId).eq("status", "published")
      .order("start_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as CompanyEvent[];
  } catch (e) {
    console.error("getCompanyEvents failed:", e);
    return [];
  }
}

export async function getCompanyVideos(companyId: string): Promise<CompanyVideo[]> {
  try {
    const { data, error } = await sb
      .from("company_videos").select("*")
      .eq("company_id", companyId)
      .order("featured", { ascending: false }).order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as CompanyVideo[];
  } catch (e) {
    console.error("getCompanyVideos failed:", e);
    return [];
  }
}

export async function getCompanyReviews(companyId: string): Promise<CompanyReview[]> {
  try {
    const { data, error } = await sb
      .from("company_reviews").select("*")
      .eq("company_id", companyId).eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as CompanyReview[];
  } catch (e) {
    console.error("getCompanyReviews failed:", e);
    return [];
  }
}

export async function getCompanyFAQs(companyId: string): Promise<CompanyFAQ[]> {
  try {
    const { data, error } = await sb
      .from("company_faqs").select("*")
      .eq("company_id", companyId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as CompanyFAQ[];
  } catch (e) {
    console.error("getCompanyFAQs failed:", e);
    return [];
  }
}

export async function getCompanyPromotions(companyId: string): Promise<CompanyPromotion[]> {
  try {
    const { data, error } = await sb
      .from("company_promotions").select("*")
      .eq("company_id", companyId).eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as CompanyPromotion[];
  } catch (e) {
    console.error("getCompanyPromotions failed:", e);
    return [];
  }
}

// ── Vendor dashboard queries (require auth) ──────────────────────────────────
export async function getMyCompany(userId: string): Promise<Company | null> {
  try {
    const { data, error } = await sb
      .from("companies").select("*")
      .eq("owner_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1).maybeSingle();
    if (error) throw error;
    return (data as Company) ?? null;
  } catch (e) {
    console.error("getMyCompany failed:", e);
    return null;
  }
}

export async function getCompanyLeads(companyId: string, status?: LeadStatus): Promise<CompanyLead[]> {
  try {
    let q = sb.from("company_leads").select("*").eq("company_id", companyId);
    if (status) q = q.eq("status", status);
    q = q.order("created_at", { ascending: false });
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as CompanyLead[];
  } catch (e) {
    console.error("getCompanyLeads failed:", e);
    return [];
  }
}

export async function getCompanyDashboardStats(companyId: string): Promise<CompanyDashboardStats> {
  const empty: CompanyDashboardStats = {
    totalLeads: 0, newLeads: 0, totalProducts: 0, totalReviews: 0, avgRating: 0, totalPageViews: 0,
  };
  try {
    const count = (table: string, extra: (q: any) => any = (x) => x) => // eslint-disable-line @typescript-eslint/no-explicit-any
      extra(sb.from(table).select("*", { count: "exact", head: true }).eq("company_id", companyId));

    const [leadsAll, leadsNew, products, reviewsHead, pageViews, reviewRows] = await Promise.all([
      count("company_leads"),
      count("company_leads", (q: any) => q.eq("status", "new")), // eslint-disable-line @typescript-eslint/no-explicit-any
      count("company_products"),
      count("company_reviews", (q: any) => q.eq("status", "approved")), // eslint-disable-line @typescript-eslint/no-explicit-any
      count("company_analytics_events", (q: any) => q.eq("event_type", "page_view")), // eslint-disable-line @typescript-eslint/no-explicit-any
      sb.from("company_reviews").select("rating").eq("company_id", companyId).eq("status", "approved"),
    ]);

    const ratings: number[] = (reviewRows.data ?? []).map((r: { rating: number }) => r.rating);
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    return {
      totalLeads: leadsAll.count ?? 0,
      newLeads: leadsNew.count ?? 0,
      totalProducts: products.count ?? 0,
      totalReviews: reviewsHead.count ?? 0,
      avgRating: Math.round(avgRating * 10) / 10,
      totalPageViews: pageViews.count ?? 0,
    };
  } catch (e) {
    console.error("getCompanyDashboardStats failed:", e);
    return empty;
  }
}

export async function getAIContentJobs(companyId: string): Promise<AIContentJob[]> {
  try {
    const { data, error } = await sb
      .from("ai_content_jobs").select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as AIContentJob[];
  } catch (e) {
    console.error("getAIContentJobs failed:", e);
    return [];
  }
}
