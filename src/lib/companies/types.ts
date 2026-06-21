// Domain types for the Vanciety vendor / company system.
// These mirror the SQL schema in supabase/migrations/20260620050000_vendor_system.sql.

export type SubscriptionTier = "free" | "starter" | "pro" | "partner";
export type CompanyStatus = "draft" | "published" | "suspended";
export type LeadType =
  | "general"
  | "product_question"
  | "service_quote"
  | "install_request"
  | "event_inquiry"
  | "support"
  | "partnership";
export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "spam";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type AIJobType =
  | "generate_company_homepage"
  | "generate_product_description"
  | "generate_seo_metadata"
  | "generate_faqs"
  | "generate_social_posts"
  | "generate_email_campaign"
  | "generate_event_promo"
  | "summarize_reviews"
  | "generate_support_answers";

export type AIJobStatus = "pending" | "processing" | "complete" | "failed";

export interface Company {
  id: string;
  owner_user_id: string | null;
  name: string;
  slug: string;
  legal_name: string | null;
  tagline: string | null;
  description: string | null;
  short_description: string | null;
  category: string | null;
  subcategories: string[] | null;
  business_type: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  gallery_urls: string[] | null;
  website_url: string | null;
  custom_domain: string | null;
  vanciety_subdomain: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  support_email: string | null;
  sales_email: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  service_area: string | null;
  serves_nationwide: boolean;
  verified: boolean;
  claimed: boolean;
  featured: boolean;
  subscription_tier: SubscriptionTier;
  subscription_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: CompanyStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyPage {
  id: string;
  company_id: string;
  title: string;
  slug: string;
  page_type:
    | "home" | "about" | "products" | "services" | "gallery" | "videos"
    | "events" | "reviews" | "contact" | "support" | "custom";
  content: Record<string, unknown> | null;
  seo_title: string | null;
  seo_description: string | null;
  ai_generated: boolean;
  status: string;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FitmentData {
  van_make?: string;
  van_model?: string;
  year_start?: number;
  year_end?: number;
  wheelbase?: string;
  roof_height?: string;
  notes?: string;
}

export interface CompanyProduct {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  sku: string | null;
  brand: string | null;
  category: string | null;
  subcategory: string | null;
  description: string | null;
  short_description: string | null;
  price: number | null;
  sale_price: number | null;
  currency: string;
  image_url: string | null;
  gallery_urls: string[] | null;
  product_url: string | null;
  affiliate_url: string | null;
  amazon_url: string | null;
  fitment: FitmentData | null;
  specs: Record<string, unknown> | null;
  installation_difficulty: string | null;
  install_time_minutes: number | null;
  warranty: string | null;
  shipping_info: string | null;
  in_stock: boolean;
  featured: boolean;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyService {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  price_starting_at: number | null;
  price_type: "fixed" | "quote" | "hourly" | "per_foot" | null;
  duration_minutes: number | null;
  image_url: string | null;
  service_area: string | null;
  requires_quote: boolean;
  booking_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyEvent {
  id: string;
  company_id: string;
  title: string;
  slug: string;
  description: string | null;
  event_type: string | null;
  start_at: string | null;
  end_at: string | null;
  timezone: string | null;
  venue_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  ticket_url: string | null;
  price: number | null;
  capacity: number | null;
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyVideo {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  video_url: string;
  youtube_video_id: string | null;
  thumbnail_url: string | null;
  video_type: "install" | "review" | "tour" | "promo" | "interview" | null;
  tags: string[] | null;
  featured: boolean;
  published_at: string | null;
  created_at: string;
}

export interface CompanyReview {
  id: string;
  company_id: string;
  user_id: string | null;
  product_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  reviewer_name: string | null;
  verified_customer: boolean;
  source: string;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface CompanyLead {
  id: string;
  company_id: string;
  user_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  lead_type: LeadType;
  product_id: string | null;
  service_id: string | null;
  event_id: string | null;
  source_url: string | null;
  status: LeadStatus;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyPromotion {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  promo_code: string | null;
  discount_type: "percent" | "fixed" | "free_shipping" | "bogo" | null;
  discount_value: number | null;
  starts_at: string | null;
  ends_at: string | null;
  image_url: string | null;
  target_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyFAQ {
  id: string;
  company_id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  ai_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyDocument {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  document_url: string;
  document_type: "install_guide" | "warranty" | "manual" | "fitment_chart" | "spec_sheet" | null;
  tags: string[] | null;
  ai_indexed: boolean;
  created_at: string;
}

export interface CompanyAnalyticsEvent {
  id: string;
  company_id: string;
  event_type:
    | "page_view" | "product_view" | "service_view" | "lead_submit"
    | "outbound_click" | "phone_click" | "email_click" | "affiliate_click"
    | "video_play" | "promotion_click";
  page_url: string | null;
  referrer: string | null;
  user_id: string | null;
  session_id: string | null;
  product_id: string | null;
  service_id: string | null;
  event_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CompanyAIProfile {
  id: string;
  company_id: string;
  ai_name: string | null;
  brand_voice: string | null;
  sales_instructions: string | null;
  support_instructions: string | null;
  marketing_instructions: string | null;
  disallowed_claims: string[] | null;
  preferred_cta: string | null;
  knowledge_summary: string | null;
  last_generated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIContentJob {
  id: string;
  company_id: string;
  job_type: AIJobType;
  status: AIJobStatus;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  error: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CompanyDashboardStats {
  totalLeads: number;
  newLeads: number;
  totalProducts: number;
  totalReviews: number;
  avgRating: number;
  totalPageViews: number;
}
