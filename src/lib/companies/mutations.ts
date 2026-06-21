import { supabase } from "@/integrations/supabase/client";
import type { Company, CompanyProduct, CompanyService, CompanyEvent, CompanyVideo, CompanyReview, CompanyLead, CompanyPromotion, CompanyFAQ, AIContentJob, LeadStatus } from "./types";
import type {
  CreateCompanyInput, UpdateCompanyInput, CreateProductInput, UpdateProductInput,
  CreateServiceInput, CreateEventInput, CreateVideoInput, SubmitReviewInput,
  SubmitLeadInput, CreatePromotionInput, CreateFAQInput, TrackAnalyticsInput, CreateAIJobInput,
} from "./schemas";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = supabase as any;

export interface MutationResult<T> {
  data: T | null;
  error: string | null;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function insert<T>(table: string, row: Record<string, unknown>): Promise<MutationResult<T>> {
  try {
    const { data, error } = await sb.from(table).insert(row).select().single();
    if (error) throw error;
    return { data: data as T, error: null };
  } catch (e) {
    console.error(`insert into ${table} failed:`, e);
    return { data: null, error: (e as Error).message ?? "Something went wrong" };
  }
}

async function update<T>(table: string, id: string, row: Record<string, unknown>): Promise<MutationResult<T>> {
  try {
    const { data, error } = await sb.from(table).update({ ...row, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return { data: data as T, error: null };
  } catch (e) {
    console.error(`update ${table} failed:`, e);
    return { data: null, error: (e as Error).message ?? "Something went wrong" };
  }
}

// ── Company ──────────────────────────────────────────────────────────────────
export async function createCompany(input: CreateCompanyInput, ownerUserId?: string): Promise<MutationResult<Company>> {
  return insert<Company>("companies", {
    ...input,
    slug: input.slug || slugify(input.name),
    owner_user_id: ownerUserId ?? null,
    claimed: !!ownerUserId,
    status: "draft",
  });
}

export async function updateCompany(companyId: string, input: UpdateCompanyInput): Promise<MutationResult<Company>> {
  return update<Company>("companies", companyId, input);
}

export async function publishCompany(companyId: string): Promise<MutationResult<Company>> {
  return update<Company>("companies", companyId, { status: "published", published_at: new Date().toISOString() });
}

// ── Products ─────────────────────────────────────────────────────────────────
export async function createProduct(input: CreateProductInput): Promise<MutationResult<CompanyProduct>> {
  return insert<CompanyProduct>("company_products", { ...input, slug: input.slug || slugify(input.name) });
}

export async function updateProduct(productId: string, input: UpdateProductInput): Promise<MutationResult<CompanyProduct>> {
  return update<CompanyProduct>("company_products", productId, input);
}

// ── Services ─────────────────────────────────────────────────────────────────
export async function createService(input: CreateServiceInput): Promise<MutationResult<CompanyService>> {
  return insert<CompanyService>("company_services", { ...input, slug: input.slug || slugify(input.name) });
}

// ── Events ───────────────────────────────────────────────────────────────────
export async function createEvent(input: CreateEventInput): Promise<MutationResult<CompanyEvent>> {
  return insert<CompanyEvent>("company_events", { ...input, slug: input.slug || slugify(input.title) });
}

// ── Videos ───────────────────────────────────────────────────────────────────
export async function createVideo(input: CreateVideoInput): Promise<MutationResult<CompanyVideo>> {
  return insert<CompanyVideo>("company_videos", input);
}

// ── Reviews ──────────────────────────────────────────────────────────────────
export async function submitReview(input: SubmitReviewInput, userId?: string): Promise<MutationResult<CompanyReview>> {
  return insert<CompanyReview>("company_reviews", { ...input, user_id: userId ?? null, status: "pending" });
}

// ── Leads ────────────────────────────────────────────────────────────────────
export async function submitLead(input: SubmitLeadInput, userId?: string): Promise<MutationResult<CompanyLead>> {
  const res = await insert<CompanyLead>("company_leads", {
    ...input,
    user_id: userId ?? null,
    source_url: input.source_url ?? (typeof window !== "undefined" ? window.location.href : null),
    status: "new",
  });
  // Fire-and-forget analytics for the lead submission.
  if (res.data) {
    void trackAnalyticsEvent({ company_id: input.company_id, event_type: "lead_submit", product_id: input.product_id, service_id: input.service_id, event_id: input.event_id });
  }
  return res;
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<MutationResult<CompanyLead>> {
  return update<CompanyLead>("company_leads", leadId, { status });
}

// ── Promotions ───────────────────────────────────────────────────────────────
export async function createPromotion(input: CreatePromotionInput): Promise<MutationResult<CompanyPromotion>> {
  return insert<CompanyPromotion>("company_promotions", input);
}

// ── FAQs ─────────────────────────────────────────────────────────────────────
export async function createFAQ(input: CreateFAQInput): Promise<MutationResult<CompanyFAQ>> {
  return insert<CompanyFAQ>("company_faqs", input);
}

// ── Analytics ────────────────────────────────────────────────────────────────
export async function trackAnalyticsEvent(input: TrackAnalyticsInput): Promise<void> {
  try {
    await sb.from("company_analytics_events").insert({
      ...input,
      page_url: input.page_url ?? (typeof window !== "undefined" ? window.location.href : null),
      referrer: input.referrer ?? (typeof document !== "undefined" ? document.referrer : null),
    });
  } catch (e) {
    // Analytics must never break the UX.
    console.warn("trackAnalyticsEvent failed:", e);
  }
}

// ── AI content jobs ──────────────────────────────────────────────────────────
export async function createAIContentJob(input: CreateAIJobInput, createdBy?: string): Promise<MutationResult<AIContentJob>> {
  return insert<AIContentJob>("ai_content_jobs", { ...input, created_by: createdBy ?? null, status: "pending" });
}
