import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  BadgeCheck,
  Star,
  MapPin,
  Image as ImageIcon,
  ExternalLink,
  Calendar,
  PlayCircle,
  Search,
  MessageSquare,
  Loader2,
  Tag,
} from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { useAuth } from "@/contexts/AuthContext";

import {
  getCompanyBySlug,
  getCompanyProducts,
  getCompanyServices,
  getCompanyEvents,
  getCompanyVideos,
  getCompanyReviews,
  getCompanyFAQs,
  getCompanyPromotions,
} from "@/lib/companies/queries";
import {
  submitLead,
  submitReview,
  trackAnalyticsEvent,
} from "@/lib/companies/mutations";
import { SubmitLeadSchema, SubmitReviewSchema } from "@/lib/companies/schemas";
import type {
  Company,
  CompanyProduct,
  CompanyService,
  CompanyEvent,
  CompanyVideo,
  CompanyReview,
  CompanyFAQ,
  CompanyPromotion,
} from "@/lib/companies/types";

type TabKey =
  | "overview"
  | "products"
  | "services"
  | "events"
  | "videos"
  | "reviews"
  | "contact";

type LeadFormValues = z.infer<typeof SubmitLeadSchema>;
type ReviewFormValues = z.infer<typeof SubmitReviewSchema>;

const LEAD_TYPE_OPTIONS: { value: LeadFormValues["lead_type"]; label: string }[] = [
  { value: "general", label: "General Question" },
  { value: "product_question", label: "Product Question" },
  { value: "service_quote", label: "Service Quote" },
  { value: "install_request", label: "Install Request" },
  { value: "partnership", label: "Partnership" },
];

function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return `$${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StarRow({
  rating,
  size = 16,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={
            i <= rounded
              ? "fill-primary text-primary"
              : "fill-transparent text-gray-600"
          }
        />
      ))}
    </div>
  );
}

const CompanyProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<CompanyProduct[]>([]);
  const [services, setServices] = useState<CompanyService[]>([]);
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [videos, setVideos] = useState<CompanyVideo[]>([]);
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [faqs, setFaqs] = useState<CompanyFAQ[]>([]);
  const [promotions, setPromotions] = useState<CompanyPromotion[]>([]);

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState<string>("all");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // ── Data loading ───────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setCompany(null);
      if (!slug) {
        setLoading(false);
        return;
      }

      const c = await getCompanyBySlug(slug);
      if (cancelled) return;

      if (!c) {
        setCompany(null);
        setLoading(false);
        return;
      }

      setCompany(c);

      const [prod, svc, evt, vid, rev, faq, promo] = await Promise.all([
        getCompanyProducts(c.id),
        getCompanyServices(c.id),
        getCompanyEvents(c.id),
        getCompanyVideos(c.id),
        getCompanyReviews(c.id),
        getCompanyFAQs(c.id),
        getCompanyPromotions(c.id),
      ]);

      if (cancelled) return;

      setProducts(prod ?? []);
      setServices(svc ?? []);
      setEvents(evt ?? []);
      setVideos(vid ?? []);
      setReviews(rev ?? []);
      setFaqs(faq ?? []);
      setPromotions(promo ?? []);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ── Analytics: page view ─────────────────────────────────────────────────────
  useEffect(() => {
    if (company) {
      trackAnalyticsEvent({
        company_id: company.id,
        event_type: "page_view",
      });
    }
  }, [company]);

  // ── Derived data ─────────────────────────────────────────────────────────────
  const approvedReviews = useMemo(
    () => reviews.filter((r) => r.status === "approved"),
    [reviews]
  );

  const avgRating = useMemo(() => {
    if (approvedReviews.length === 0) return 0;
    const sum = approvedReviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    return sum / approvedReviews.length;
  }, [approvedReviews]);

  const ratingBreakdown = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approvedReviews.forEach((r) => {
      const star = Math.round(r.rating ?? 0);
      if (star >= 1 && star <= 5) counts[star] += 1;
    });
    return counts;
  }, [approvedReviews]);

  const featuredProducts = useMemo(() => {
    const featured = products.filter((p) => p.featured);
    return (featured.length ? featured : products).slice(0, 3);
  }, [products]);

  const productCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory =
        productCategory === "all" || p.category === productCategory;
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, productSearch, productCategory]);

  const activePromotions = useMemo(() => {
    const now = Date.now();
    return promotions.filter((p) => {
      if (p.status && p.status !== "active") return false;
      if (p.starts_at && new Date(p.starts_at).getTime() > now) return false;
      if (p.ends_at && new Date(p.ends_at).getTime() < now) return false;
      return true;
    });
  }, [promotions]);

  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return [...events]
      .filter((e) => !e.start_at || new Date(e.start_at).getTime() >= now)
      .sort((a, b) => {
        const ta = a.start_at ? new Date(a.start_at).getTime() : 0;
        const tb = b.start_at ? new Date(b.start_at).getTime() : 0;
        return ta - tb;
      });
  }, [events]);

  // ── Lead form ────────────────────────────────────────────────────────────────
  const leadForm = useForm<LeadFormValues>({
    resolver: zodResolver(SubmitLeadSchema),
    defaultValues: {
      company_id: "",
      name: "",
      email: "",
      phone: "",
      message: "",
      lead_type: "general",
    },
  });

  useEffect(() => {
    if (company) {
      leadForm.setValue("company_id", company.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  const onSubmitLead = leadForm.handleSubmit(async (values) => {
    if (!company) return;
    const { error } = await submitLead(
      {
        ...values,
        company_id: company.id,
        source_url:
          typeof window !== "undefined" ? window.location.href : undefined,
      },
      user?.id
    );
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(`Thanks! ${company.name} will be in touch soon.`);
    leadForm.reset({
      company_id: company.id,
      name: "",
      email: "",
      phone: "",
      message: "",
      lead_type: "general",
    });
  });

  // ── Review form ──────────────────────────────────────────────────────────────
  const reviewForm = useForm<ReviewFormValues>({
    resolver: zodResolver(SubmitReviewSchema),
    defaultValues: {
      company_id: "",
      rating: 5,
      title: "",
      body: "",
      reviewer_name: "",
    },
  });

  useEffect(() => {
    if (company) {
      reviewForm.setValue("company_id", company.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  const onSubmitReview = reviewForm.handleSubmit(async (values) => {
    if (!company || !user) return;
    const { error } = await submitReview(
      { ...values, company_id: company.id },
      user.id
    );
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Thanks! Your review is pending approval.");
    reviewForm.reset({
      company_id: company.id,
      rating: 5,
      title: "",
      body: "",
      reviewer_name: "",
    });
    setShowReviewForm(false);
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const goToTab = (tab: TabKey) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const requestServiceQuote = (serviceId: string) => {
    leadForm.setValue("lead_type", "service_quote");
    leadForm.setValue("service_id", serviceId);
    goToTab("contact");
  };

  const handleProductView = (product: CompanyProduct) => {
    if (!company) return;
    trackAnalyticsEvent({
      company_id: company.id,
      event_type: "product_view",
      product_id: product.id,
    });
  };

  // ── Render states ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <main className="pt-28">
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <main className="pt-28">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-32 text-center">
            <h1 className="text-2xl font-bold">Company not found</h1>
            <p className="text-gray-400">
              We couldn&apos;t find the company you&apos;re looking for. It may
              have moved or no longer be published.
            </p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-amber-500">
              <Link to="/companies">Browse all companies</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const locationLabel = [company.city, company.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="pt-28">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative">
          <div className="relative h-72 w-full overflow-hidden sm:h-80 md:h-96">
            {company.hero_image_url ? (
              <img
                src={company.hero_image_url}
                alt={`${company.name} hero`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-lime-900/40" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/20" />

            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto max-w-6xl px-4 pb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gray-900 sm:h-24 sm:w-24">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={`${company.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold sm:text-3xl">
                        {company.name}
                      </h1>
                      {company.verified && (
                        <Badge className="gap-1 border-primary/30 bg-primary/15 text-primary">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    {company.tagline && (
                      <p className="mt-1 text-gray-300">{company.tagline}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      {company.category && (
                        <span className="inline-flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          {company.category}
                        </span>
                      )}
                      {locationLabel && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {locationLabel}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <StarRow rating={avgRating} size={14} />
                        {approvedReviews.length > 0 && (
                          <span className="ml-1">
                            {avgRating.toFixed(1)} ({approvedReviews.length})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() => goToTab("contact")}
                    className="bg-primary text-primary-foreground hover:bg-amber-500"
                  >
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => goToTab("products")}
                    className="border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    View Products
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => goToTab("contact")}
                    className="border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    Get a Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabKey)}
          className="mx-auto max-w-6xl px-4"
        >
          <div className="sticky top-16 z-20 -mx-4 mb-6 border-b border-white/10 bg-gray-950/90 px-4 py-2 backdrop-blur">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
              {(
                [
                  ["overview", "Overview"],
                  ["products", "Products"],
                  ["services", "Services"],
                  ["events", "Events"],
                  ["videos", "Videos"],
                  ["reviews", "Reviews"],
                  ["contact", "Contact"],
                ] as [TabKey, string][]
              ).map(([key, label]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="rounded-md px-3 py-1.5 text-sm text-gray-400 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
          <TabsContent value="overview" className="space-y-8 pb-16">
            {company.description && (
              <section>
                <h2 className="mb-3 text-xl font-semibold">About</h2>
                <p className="whitespace-pre-line leading-relaxed text-gray-300">
                  {company.description}
                </p>
              </section>
            )}

            {activePromotions.length > 0 && (
              <section className="space-y-3">
                {activePromotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="rounded-lg border border-primary/30 bg-primary/10 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-amber-300">
                          {promo.title}
                        </p>
                        {promo.description && (
                          <p className="text-sm text-gray-300">
                            {promo.description}
                          </p>
                        )}
                        {promo.promo_code && (
                          <p className="mt-1 text-sm text-gray-300">
                            Code:{" "}
                            <span className="font-mono font-semibold text-amber-300">
                              {promo.promo_code}
                            </span>
                          </p>
                        )}
                      </div>
                      {promo.target_url && (
                        <Button
                          asChild
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-amber-500"
                        >
                          <a
                            href={promo.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Get Deal
                            <ExternalLink className="ml-1 h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {featuredProducts.length > 0 && (
              <section>
                <h2 className="mb-3 text-xl font-semibold">Featured Products</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onView={handleProductView}
                    />
                  ))}
                </div>
              </section>
            )}

            {faqs.length > 0 && (
              <section>
                <h2 className="mb-3 text-xl font-semibold">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border-white/10"
                    >
                      <AccordionTrigger className="text-left text-white hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="whitespace-pre-line text-gray-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {!company.description &&
              featuredProducts.length === 0 &&
              faqs.length === 0 &&
              activePromotions.length === 0 && (
                <p className="py-12 text-center text-gray-500">
                  No additional information available yet.
                </p>
              )}
          </TabsContent>

          {/* ── PRODUCTS ──────────────────────────────────────────────────── */}
          <TabsContent value="products" className="space-y-6 pb-16">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="border-white/10 bg-gray-900 pl-9 text-white placeholder:text-gray-500"
                />
              </div>
              <Select value={productCategory} onValueChange={setProductCategory}>
                <SelectTrigger className="w-full border-white/10 bg-gray-900 text-white sm:w-56">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-gray-900 text-white">
                  <SelectItem value="all">All categories</SelectItem>
                  {productCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="py-12 text-center text-gray-500">
                No products match your search.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={handleProductView}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── SERVICES ──────────────────────────────────────────────────── */}
          <TabsContent value="services" className="space-y-6 pb-16">
            {services.length === 0 ? (
              <p className="py-12 text-center text-gray-500">
                No services listed yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className="flex flex-col border-white/10 bg-gray-900 text-white"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      {service.category && (
                        <CardDescription className="text-gray-400">
                          {service.category}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1">
                      {service.description && (
                        <p className="text-sm text-gray-300">
                          {service.description}
                        </p>
                      )}
                      {service.price_starting_at !== null &&
                        service.price_starting_at !== undefined && (
                          <p className="mt-3 font-semibold text-primary">
                            Starting at {formatPrice(service.price_starting_at)}
                          </p>
                        )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => requestServiceQuote(service.id)}
                        className="w-full bg-primary text-primary-foreground hover:bg-amber-500"
                      >
                        Request Quote
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── EVENTS ────────────────────────────────────────────────────── */}
          <TabsContent value="events" className="space-y-4 pb-16">
            {upcomingEvents.length === 0 ? (
              <p className="py-12 text-center text-gray-500">
                No upcoming events.
              </p>
            ) : (
              upcomingEvents.map((event) => {
                const evLocation = [event.city, event.state]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <Link
                    key={event.id}
                    to="/events"
                    className="block rounded-lg border border-white/10 bg-gray-900 p-4 transition hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                          {event.start_at && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(event.start_at)}
                            </span>
                          )}
                          {evLocation && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {evLocation}
                            </span>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-gray-500" />
                    </div>
                  </Link>
                );
              })
            )}
          </TabsContent>

          {/* ── VIDEOS ────────────────────────────────────────────────────── */}
          <TabsContent value="videos" className="pb-16">
            {videos.length === 0 ? (
              <p className="py-12 text-center text-gray-500">No videos yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="overflow-hidden rounded-lg border border-white/10 bg-gray-900"
                  >
                    {video.youtube_video_id ? (
                      <div className="aspect-video w-full">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
                          title={video.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex aspect-video w-full items-center justify-center bg-gray-800 transition hover:bg-gray-700"
                      >
                        <PlayCircle className="h-12 w-12 text-primary" />
                      </a>
                    )}
                    <div className="p-3">
                      <p className="font-medium">{video.title}</p>
                      {video.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── REVIEWS ───────────────────────────────────────────────────── */}
          <TabsContent value="reviews" className="space-y-8 pb-16">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-gray-900 p-6 text-center">
                <p className="text-5xl font-bold text-primary">
                  {avgRating.toFixed(1)}
                </p>
                <StarRow rating={avgRating} size={18} className="mt-2" />
                <p className="mt-2 text-sm text-gray-400">
                  {approvedReviews.length} review
                  {approvedReviews.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-gray-900 p-6 md:col-span-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingBreakdown[star];
                  const pct =
                    approvedReviews.length > 0
                      ? (count / approvedReviews.length) * 100
                      : 0;
                  return (
                    <div key={star} className="mb-2 flex items-center gap-3">
                      <span className="w-10 shrink-0 text-sm text-gray-400">
                        {star} star
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-sm text-gray-400">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              {!user ? (
                <div className="rounded-lg border border-white/10 bg-gray-900 p-4 text-center">
                  <p className="text-gray-300">
                    Want to share your experience?{" "}
                    <Link
                      to="/auth"
                      className="font-semibold text-primary hover:underline"
                    >
                      Sign in to write a review
                    </Link>
                    .
                  </p>
                </div>
              ) : showReviewForm ? (
                <form
                  onSubmit={onSubmitReview}
                  className="space-y-4 rounded-lg border border-white/10 bg-gray-900 p-5"
                >
                  <h3 className="text-lg font-semibold">Write a Review</h3>

                  <div className="space-y-1.5">
                    <Label htmlFor="reviewer_name">Your name</Label>
                    <Input
                      id="reviewer_name"
                      {...reviewForm.register("reviewer_name")}
                      className="border-white/10 bg-gray-800 text-white"
                    />
                    {reviewForm.formState.errors.reviewer_name && (
                      <p className="text-sm text-red-400">
                        {reviewForm.formState.errors.reviewer_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="rating">Rating</Label>
                    <Select
                      value={String(reviewForm.watch("rating") ?? 5)}
                      onValueChange={(v) =>
                        reviewForm.setValue("rating", Number(v), {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger
                        id="rating"
                        className="border-white/10 bg-gray-800 text-white"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-gray-900 text-white">
                        {[5, 4, 3, 2, 1].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} star{n === 1 ? "" : "s"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="review_title">Title (optional)</Label>
                    <Input
                      id="review_title"
                      {...reviewForm.register("title")}
                      className="border-white/10 bg-gray-800 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="review_body">Your review</Label>
                    <Textarea
                      id="review_body"
                      rows={4}
                      {...reviewForm.register("body")}
                      className="border-white/10 bg-gray-800 text-white"
                    />
                    {reviewForm.formState.errors.body && (
                      <p className="text-sm text-red-400">
                        {reviewForm.formState.errors.body.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={reviewForm.formState.isSubmitting}
                      className="bg-primary text-primary-foreground hover:bg-amber-500"
                    >
                      {reviewForm.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Submit Review
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReviewForm(false)}
                      className="border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-amber-500"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Write a Review
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {approvedReviews.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  No reviews yet. Be the first to leave one!
                </p>
              ) : (
                approvedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border border-white/10 bg-gray-900 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {review.reviewer_name || "Anonymous"}
                        </span>
                        {review.verified_customer && (
                          <Badge className="gap-1 border-primary/30 bg-primary/15 text-primary">
                            <BadgeCheck className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    <StarRow rating={review.rating} size={14} className="mt-2" />
                    {review.title && (
                      <p className="mt-2 font-medium">{review.title}</p>
                    )}
                    {review.body && (
                      <p className="mt-1 whitespace-pre-line text-gray-300">
                        {review.body}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* ── CONTACT ───────────────────────────────────────────────────── */}
          <TabsContent value="contact" className="pb-16">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 text-xl font-semibold">
                Contact {company.name}
              </h2>
              <form
                onSubmit={onSubmitLead}
                className="space-y-4 rounded-lg border border-white/10 bg-gray-900 p-5"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      {...leadForm.register("name")}
                      className="border-white/10 bg-gray-800 text-white"
                    />
                    {leadForm.formState.errors.name && (
                      <p className="text-sm text-red-400">
                        {leadForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...leadForm.register("email")}
                      className="border-white/10 bg-gray-800 text-white"
                    />
                    {leadForm.formState.errors.email && (
                      <p className="text-sm text-red-400">
                        {leadForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      {...leadForm.register("phone")}
                      className="border-white/10 bg-gray-800 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lead_type">Lead type</Label>
                    <Select
                      value={leadForm.watch("lead_type")}
                      onValueChange={(v) =>
                        leadForm.setValue(
                          "lead_type",
                          v as LeadFormValues["lead_type"],
                          { shouldValidate: true }
                        )
                      }
                    >
                      <SelectTrigger
                        id="lead_type"
                        className="border-white/10 bg-gray-800 text-white"
                      >
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-gray-900 text-white">
                        {LEAD_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    {...leadForm.register("message")}
                    className="border-white/10 bg-gray-800 text-white"
                  />
                  {leadForm.formState.errors.message && (
                    <p className="text-sm text-red-400">
                      {leadForm.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={leadForm.formState.isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-amber-500 sm:w-auto"
                >
                  {leadForm.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Message
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// ── Product card (shared by overview + products) ─────────────────────────────
function ProductCard({
  product,
  onView,
}: {
  product: CompanyProduct;
  onView: (product: CompanyProduct) => void;
}) {
  const url = product.product_url || product.affiliate_url || null;
  const price = product.sale_price ?? product.price;

  return (
    <Card className="flex flex-col overflow-hidden border-white/10 bg-gray-900 text-white">
      <div className="aspect-square w-full bg-gray-800">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-gray-600" />
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-tight">{product.name}</h3>
        {product.brand && (
          <p className="text-sm text-gray-400">{product.brand}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          {price !== null && price !== undefined ? (
            <span className="font-semibold text-primary">
              {formatPrice(price)}
            </span>
          ) : (
            <span className="text-sm text-gray-500">Price on request</span>
          )}
          <StarRow rating={0} size={14} />
        </div>
        <div className="mt-auto pt-4">
          {url ? (
            <Button
              asChild
              onClick={() => onView(product)}
              className="w-full bg-primary text-primary-foreground hover:bg-amber-500"
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                View Product
                <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </a>
            </Button>
          ) : (
            <Button
              onClick={() => onView(product)}
              variant="outline"
              className="w-full border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              View Product
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default CompanyProfile;
