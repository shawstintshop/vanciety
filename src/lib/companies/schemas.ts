import { z } from "zod";

// ── Shared field schemas ─────────────────────────────────────────────────────
const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");
const optionalUrl = z.string().url().optional().or(z.literal(""));
const email = z.string().email();

export const FitmentSchema = z.object({
  van_make: z.string().optional(),
  van_model: z.string().optional(),
  year_start: z.number().int().optional(),
  year_end: z.number().int().optional(),
  wheelbase: z.string().optional(),
  roof_height: z.string().optional(),
  notes: z.string().optional(),
});

// ── Company ──────────────────────────────────────────────────────────────────
export const CreateCompanySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  slug: slug,
  tagline: z.string().max(160).optional(),
  description: z.string().optional(),
  short_description: z.string().max(280).optional(),
  category: z.string().optional(),
  subcategories: z.array(z.string()).optional(),
  business_type: z.string().optional(),
  logo_url: optionalUrl,
  hero_image_url: optionalUrl,
  website_url: optionalUrl,
  contact_email: email.optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  service_area: z.string().optional(),
  serves_nationwide: z.boolean().optional(),
});

export const UpdateCompanySchema = CreateCompanySchema.partial().extend({
  support_email: email.optional().or(z.literal("")),
  sales_email: email.optional().or(z.literal("")),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  legal_name: z.string().optional(),
});

// ── Product ──────────────────────────────────────────────────────────────────
export const CreateProductSchema = z.object({
  company_id: z.string().uuid(),
  name: z.string().min(1, "Product name is required"),
  slug: slug.optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.coerce.number().nonnegative().optional(),
  sale_price: z.coerce.number().nonnegative().optional(),
  currency: z.string().optional(),
  image_url: optionalUrl,
  product_url: optionalUrl,
  affiliate_url: optionalUrl,
  amazon_url: optionalUrl,
  fitment: FitmentSchema.optional(),
  installation_difficulty: z.string().optional(),
  warranty: z.string().optional(),
  in_stock: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.string().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial().omit({ company_id: true });

// ── Service ──────────────────────────────────────────────────────────────────
export const CreateServiceSchema = z.object({
  company_id: z.string().uuid(),
  name: z.string().min(1, "Service name is required"),
  slug: slug.optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  price_starting_at: z.coerce.number().nonnegative().optional(),
  price_type: z.enum(["fixed", "quote", "hourly", "per_foot"]).optional(),
  duration_minutes: z.coerce.number().int().optional(),
  service_area: z.string().optional(),
  requires_quote: z.boolean().optional(),
  booking_url: optionalUrl,
  status: z.string().optional(),
});

// ── Event ────────────────────────────────────────────────────────────────────
export const CreateEventSchema = z.object({
  company_id: z.string().uuid(),
  title: z.string().min(1, "Event title is required"),
  slug: slug.optional(),
  description: z.string().optional(),
  event_type: z.string().optional(),
  start_at: z.string().optional(),
  end_at: z.string().optional(),
  venue_name: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  ticket_url: optionalUrl,
  price: z.coerce.number().nonnegative().optional(),
  capacity: z.coerce.number().int().optional(),
  status: z.string().optional(),
});

// ── Video ────────────────────────────────────────────────────────────────────
export const CreateVideoSchema = z.object({
  company_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  video_url: z.string().url("A valid video URL is required"),
  youtube_video_id: z.string().optional(),
  thumbnail_url: optionalUrl,
  video_type: z.enum(["install", "review", "tour", "promo", "interview"]).optional(),
  tags: z.array(z.string()).optional(),
});

// ── Review ───────────────────────────────────────────────────────────────────
export const SubmitReviewSchema = z.object({
  company_id: z.string().uuid(),
  product_id: z.string().uuid().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(160).optional(),
  body: z.string().min(1, "Please write a review"),
  reviewer_name: z.string().min(1, "Your name is required"),
});

// ── Lead ─────────────────────────────────────────────────────────────────────
export const SubmitLeadSchema = z.object({
  company_id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: email,
  phone: z.string().optional(),
  message: z.string().min(1, "Please enter a message"),
  lead_type: z
    .enum([
      "general", "product_question", "service_quote",
      "install_request", "event_inquiry", "support", "partnership",
    ])
    .default("general"),
  product_id: z.string().uuid().optional(),
  service_id: z.string().uuid().optional(),
  event_id: z.string().uuid().optional(),
  source_url: z.string().optional(),
});

// ── Promotion ────────────────────────────────────────────────────────────────
export const CreatePromotionSchema = z.object({
  company_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  promo_code: z.string().optional(),
  discount_type: z.enum(["percent", "fixed", "free_shipping", "bogo"]).optional(),
  discount_value: z.coerce.number().nonnegative().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  target_url: optionalUrl,
  status: z.string().optional(),
});

// ── FAQ ──────────────────────────────────────────────────────────────────────
export const CreateFAQSchema = z.object({
  company_id: z.string().uuid(),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
  sort_order: z.coerce.number().int().optional(),
  ai_visible: z.boolean().optional(),
});

// ── Document ─────────────────────────────────────────────────────────────────
export const CreateDocumentSchema = z.object({
  company_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  document_url: z.string().url("A valid document URL is required"),
  document_type: z.enum(["install_guide", "warranty", "manual", "fitment_chart", "spec_sheet"]).optional(),
  tags: z.array(z.string()).optional(),
});

// ── Analytics ────────────────────────────────────────────────────────────────
export const TrackAnalyticsSchema = z.object({
  company_id: z.string().uuid(),
  event_type: z.enum([
    "page_view", "product_view", "service_view", "lead_submit",
    "outbound_click", "phone_click", "email_click", "affiliate_click",
    "video_play", "promotion_click",
  ]),
  page_url: z.string().optional(),
  referrer: z.string().optional(),
  product_id: z.string().uuid().optional(),
  service_id: z.string().uuid().optional(),
  event_id: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// ── AI job ───────────────────────────────────────────────────────────────────
export const CreateAIJobSchema = z.object({
  company_id: z.string().uuid(),
  job_type: z.enum([
    "generate_company_homepage", "generate_product_description", "generate_seo_metadata",
    "generate_faqs", "generate_social_posts", "generate_email_campaign",
    "generate_event_promo", "summarize_reviews", "generate_support_answers",
  ]),
  input: z.record(z.unknown()).optional(),
});

// ── Inferred input types (used by mutations) ─────────────────────────────────
export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type CreateServiceInput = z.infer<typeof CreateServiceSchema>;
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type CreateVideoInput = z.infer<typeof CreateVideoSchema>;
export type SubmitReviewInput = z.infer<typeof SubmitReviewSchema>;
export type SubmitLeadInput = z.infer<typeof SubmitLeadSchema>;
export type CreatePromotionInput = z.infer<typeof CreatePromotionSchema>;
export type CreateFAQInput = z.infer<typeof CreateFAQSchema>;
export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;
export type TrackAnalyticsInput = z.infer<typeof TrackAnalyticsSchema>;
export type CreateAIJobInput = z.infer<typeof CreateAIJobSchema>;
