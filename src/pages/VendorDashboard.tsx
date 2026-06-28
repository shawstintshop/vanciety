import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Building2,
  Package,
  Wrench,
  Calendar,
  Tag,
  Inbox,
  Star,
  Video,
  BarChart3,
  Sparkles,
  Settings as SettingsIcon,
  Plus,
  ExternalLink,
  Rocket,
  TrendingUp,
  Users,
  Eye,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getMyCompany,
  getCompanyDashboardStats,
  getCompanyLeads,
  getCompanyReviews,
  getCompanyProducts,
  getCompanyServices,
  getAIContentJobs,
} from "@/lib/companies/queries";
import {
  updateCompany,
  publishCompany,
  createProduct,
  createService,
  updateLeadStatus,
  createAIContentJob,
} from "@/lib/companies/mutations";
import type {
  Company,
  CompanyLead,
  CompanyReview,
  CompanyProduct,
  CompanyService,
  AIContentJob,
  CompanyDashboardStats,
  LeadStatus,
  AIJobType,
} from "@/lib/companies/types";

type Panel =
  | "overview"
  | "profile"
  | "products"
  | "services"
  | "events"
  | "promotions"
  | "leads"
  | "reviews"
  | "videos"
  | "analytics"
  | "ai"
  | "settings";

const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
];

function fmtDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtPrice(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return `$${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function truncate(text: string | null, max = 60): string {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "published":
    case "approved":
    case "complete":
    case "qualified":
      return "bg-primary/15 text-primary border-primary/30";
    case "new":
    case "pending":
    case "processing":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "spam":
    case "rejected":
    case "failed":
    case "suspended":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    case "draft":
    case "closed":
    default:
      return "bg-white/10 text-gray-300 border-white/20";
  }
}

const VendorDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [panel, setPanel] = useState<Panel>("overview");

  const [bootstrapping, setBootstrapping] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [stats, setStats] = useState<CompanyDashboardStats | null>(null);
  const [leads, setLeads] = useState<CompanyLead[]>([]);
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [products, setProducts] = useState<CompanyProduct[]>([]);
  const [services, setServices] = useState<CompanyService[]>([]);
  const [aiJobs, setAiJobs] = useState<AIContentJob[]>([]);

  // Redirect unauthenticated users to /auth.
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  // Load all dashboard data once we have an authenticated user.
  useEffect(() => {
    let active = true;

    async function load() {
      if (!user) return;
      setBootstrapping(true);
      try {
        const myCompany = await getMyCompany(user.id);
        if (!active) return;
        setCompany(myCompany);

        if (myCompany) {
          const [s, l, r, p, sv, jobs] = await Promise.all([
            getCompanyDashboardStats(myCompany.id),
            getCompanyLeads(myCompany.id),
            getCompanyReviews(myCompany.id),
            getCompanyProducts(myCompany.id),
            getCompanyServices(myCompany.id),
            getAIContentJobs(myCompany.id),
          ]);
          if (!active) return;
          setStats(s);
          setLeads(l);
          setReviews(r);
          setProducts(p);
          setServices(sv);
          setAiJobs(jobs);
        }
      } catch (err) {
        if (active) {
          toast.error("Failed to load your dashboard.");
        }
      } finally {
        if (active) setBootstrapping(false);
      }
    }

    if (user) load();

    return () => {
      active = false;
    };
  }, [user]);

  const newLeadCount = leads.filter((l) => l.status === "new").length;

  // ---- Reloaders -------------------------------------------------------
  async function reloadProducts() {
    if (!company) return;
    const [p, s] = await Promise.all([
      getCompanyProducts(company.id),
      getCompanyDashboardStats(company.id),
    ]);
    setProducts(p);
    setStats(s);
  }

  async function reloadServices() {
    if (!company) return;
    setServices(await getCompanyServices(company.id));
  }

  async function reloadAIJobs() {
    if (!company) return;
    setAiJobs(await getAIContentJobs(company.id));
  }

  // ---- Loading / empty states -----------------------------------------
  if (loading || (user && bootstrapping)) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <main className="pt-16 sm:pt-20">
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    // Redirect effect handles navigation; render nothing meaningful.
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <main className="pt-16" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <main className="pt-16 sm:pt-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-32 text-center">
            <Building2 className="mb-6 h-14 w-14 text-primary" />
            <h1 className="mb-3 text-3xl font-bold">
              You don't have a company yet
            </h1>
            <p className="mb-8 max-w-md text-gray-400">
              List your business on Vanciety to reach thousands of Sprinter van
              owners. Create your company profile to unlock the vendor
              dashboard.
            </p>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-amber-500"
            >
              <Link to="/for-vendors">Become a Vendor</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ---- Sidebar nav -----------------------------------------------------
  const navItems: { id: Panel; label: string; icon: typeof LayoutDashboard }[] =
    [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "profile", label: "My Company Profile", icon: Building2 },
      { id: "products", label: "Products", icon: Package },
      { id: "services", label: "Services", icon: Wrench },
      { id: "events", label: "Events", icon: Calendar },
      { id: "promotions", label: "Promotions", icon: Tag },
      { id: "leads", label: "Leads", icon: Inbox },
      { id: "reviews", label: "Reviews", icon: Star },
      { id: "videos", label: "Videos", icon: Video },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "ai", label: "AI Tools", icon: Sparkles },
      { id: "settings", label: "Settings", icon: SettingsIcon },
    ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="pt-16 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{company.name}</h1>
              <p className="text-sm text-gray-400">Vendor Dashboard</p>
            </div>
            <Badge
              variant="outline"
              className={`w-fit capitalize ${statusBadgeClass(company.status)}`}
            >
              {company.status}
            </Badge>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Sidebar */}
            <aside className="lg:w-64 lg:flex-shrink-0">
              <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = panel === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPanel(item.id)}
                      className={`flex flex-shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1 whitespace-nowrap">
                        {item.label}
                      </span>
                      {item.id === "leads" && newLeadCount > 0 && (
                        <Badge className="ml-auto bg-primary px-1.5 text-gray-950 hover:bg-primary">
                          {newLeadCount}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Content */}
            <section className="min-w-0 flex-1">
              {panel === "overview" && (
                <OverviewPanel
                  company={company}
                  stats={stats}
                  leads={leads}
                  reviews={reviews}
                  onNavigate={setPanel}
                />
              )}
              {panel === "profile" && (
                <ProfilePanel
                  company={company}
                  onUpdated={(c) => setCompany(c)}
                />
              )}
              {panel === "products" && (
                <ProductsPanel
                  company={company}
                  products={products}
                  onReload={reloadProducts}
                />
              )}
              {panel === "services" && (
                <ServicesPanel
                  company={company}
                  services={services}
                  onReload={reloadServices}
                />
              )}
              {panel === "leads" && (
                <LeadsPanel
                  leads={leads}
                  onChange={(updated) => setLeads(updated)}
                />
              )}
              {panel === "reviews" && <ReviewsPanel reviews={reviews} />}
              {panel === "ai" && (
                <AIToolsPanel
                  company={company}
                  jobs={aiJobs}
                  userId={user.id}
                  onReload={reloadAIJobs}
                />
              )}
              {panel === "settings" && <SettingsPanel company={company} />}
              {panel === "events" && (
                <ComingSoonPanel
                  title="Events"
                  description="Host meetups, builds, and demo days for the Vanciety community."
                />
              )}
              {panel === "promotions" && (
                <ComingSoonPanel
                  title="Promotions"
                  description="Run discount codes and featured deals across the platform."
                />
              )}
              {panel === "videos" && (
                <ComingSoonPanel
                  title="Videos"
                  description="Showcase install walkthroughs, reviews, and shop tours."
                />
              )}
              {panel === "analytics" && (
                <ComingSoonPanel
                  title="Analytics"
                  description="Deep traffic, conversion, and lead-source reporting."
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ====================================================================== */
/* Overview                                                                */
/* ====================================================================== */

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof TrendingUp;
}) {
  return (
    <Card className="border-white/10 bg-gray-900">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-xs text-gray-400">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewPanel({
  company,
  stats,
  leads,
  reviews,
  onNavigate,
}: {
  company: Company;
  stats: CompanyDashboardStats | null;
  leads: CompanyLead[];
  reviews: CompanyReview[];
  onNavigate: (panel: Panel) => void;
}) {
  const recentLeads = leads.slice(0, 5);
  const recentReviews = reviews.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Total Leads"
          value={stats?.totalLeads ?? 0}
          icon={Users}
        />
        <StatCard label="New Leads" value={stats?.newLeads ?? 0} icon={Inbox} />
        <StatCard
          label="Products Listed"
          value={stats?.totalProducts ?? 0}
          icon={Package}
        />
        <StatCard
          label="Avg Rating"
          value={stats ? stats.avgRating.toFixed(1) : "0.0"}
          icon={Star}
        />
        <StatCard
          label="Profile Views"
          value={stats?.totalPageViews ?? 0}
          icon={Eye}
        />
      </div>

      <Card className="border-white/10 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            className="bg-primary text-primary-foreground hover:bg-amber-500"
            onClick={() => onNavigate("products")}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <Button
            variant="outline"
            className="border-white/20 bg-transparent hover:bg-white/5"
            onClick={() => onNavigate("services")}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
          <Button
            variant="outline"
            className="border-white/20 bg-transparent hover:bg-white/5"
            onClick={() => onNavigate("profile")}
          >
            <Building2 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/20 bg-transparent hover:bg-white/5"
          >
            <Link to={`/companies/${company.slug}`}>
              <ExternalLink className="mr-2 h-4 w-4" /> View Live Site
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No leads yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-gray-300">
                      {fmtDate(lead.created_at)}
                    </TableCell>
                    <TableCell>{lead.name ?? "—"}</TableCell>
                    <TableCell className="text-gray-300">
                      {lead.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${statusBadgeClass(lead.status)}`}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base">Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentReviews.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No reviews yet.
            </p>
          ) : (
            recentReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-white/10 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {review.reviewer_name ?? "Anonymous"}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-primary">
                    <Star className="h-4 w-4 fill-current" />
                    {review.rating}
                  </span>
                </div>
                {review.title && (
                  <p className="mt-1 text-sm font-medium">{review.title}</p>
                )}
                {review.body && (
                  <p className="mt-1 text-sm text-gray-400">
                    {truncate(review.body, 140)}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ====================================================================== */
/* Profile                                                                 */
/* ====================================================================== */

function ProfilePanel({
  company,
  onUpdated,
}: {
  company: Company;
  onUpdated: (company: Company) => void;
}) {
  const [form, setForm] = useState({
    name: company.name ?? "",
    tagline: company.tagline ?? "",
    short_description: company.short_description ?? "",
    description: company.description ?? "",
    category: company.category ?? "",
    website_url: company.website_url ?? "",
    contact_email: company.contact_email ?? "",
    contact_phone: company.contact_phone ?? "",
    city: company.city ?? "",
    state: company.state ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await updateCompany(company.id, form);
    setSaving(false);
    if (error) {
      toast.error("Failed to save profile.");
    } else {
      toast.success("Profile saved.");
      onUpdated({ ...company, ...form });
    }
  }

  async function handlePublish() {
    setPublishing(true);
    const { data, error } = await publishCompany(company.id);
    setPublishing(false);
    if (error) {
      toast.error("Failed to publish company.");
    } else {
      toast.success("Company published!");
      onUpdated(data ?? { ...company, status: "published" });
    }
  }

  return (
    <Card className="border-white/10 bg-gray-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">My Company Profile</CardTitle>
          <Badge
            variant="outline"
            className={`capitalize ${statusBadgeClass(company.status)}`}
          >
            {company.status}
          </Badge>
        </div>
        <CardDescription>
          Keep your public profile fresh and accurate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company Name">
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="border-white/10 bg-gray-950"
            />
          </Field>
          <Field label="Category">
            <Input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="border-white/10 bg-gray-950"
            />
          </Field>
        </div>

        <Field label="Tagline">
          <Input
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            className="border-white/10 bg-gray-950"
          />
        </Field>

        <Field label="Short Description">
          <Textarea
            value={form.short_description}
            onChange={(e) => set("short_description", e.target.value)}
            rows={2}
            className="border-white/10 bg-gray-950"
          />
        </Field>

        <Field label="Description">
          <Textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            className="border-white/10 bg-gray-950"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Website URL">
            <Input
              value={form.website_url}
              onChange={(e) => set("website_url", e.target.value)}
              className="border-white/10 bg-gray-950"
            />
          </Field>
          <Field label="Contact Email">
            <Input
              type="email"
              value={form.contact_email}
              onChange={(e) => set("contact_email", e.target.value)}
              className="border-white/10 bg-gray-950"
            />
          </Field>
          <Field label="Contact Phone">
            <Input
              value={form.contact_phone}
              onChange={(e) => set("contact_phone", e.target.value)}
              className="border-white/10 bg-gray-950"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City">
              <Input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="border-white/10 bg-gray-950"
              />
            </Field>
            <Field label="State">
              <Input
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                className="border-white/10 bg-gray-950"
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-amber-500"
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
          <Button
            onClick={handlePublish}
            disabled={publishing || company.status === "published"}
            variant="outline"
            className="border-primary/40 bg-transparent text-primary hover:bg-primary/10"
          >
            {publishing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="mr-2 h-4 w-4" />
            )}
            {company.status === "published" ? "Published" : "Publish Company"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-400">{label}</Label>
      {children}
    </div>
  );
}

/* ====================================================================== */
/* Products                                                                */
/* ====================================================================== */

function ProductsPanel({
  company,
  products,
  onReload,
}: {
  company: Company;
  products: CompanyProduct[];
  onReload: () => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    sale_price: "",
    image_url: "",
    in_stock: true,
    status: "draft",
  });

  function reset() {
    setForm({
      name: "",
      category: "",
      description: "",
      price: "",
      sale_price: "",
      image_url: "",
      in_stock: true,
      status: "draft",
    });
  }

  async function handleCreate() {
    if (!form.name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    setSaving(true);
    const { error } = await createProduct({
      company_id: company.id,
      name: form.name.trim(),
      category: form.category || undefined,
      description: form.description || undefined,
      price: form.price ? Number(form.price) : undefined,
      sale_price: form.sale_price ? Number(form.sale_price) : undefined,
      image_url: form.image_url || undefined,
      in_stock: form.in_stock,
      status: form.status,
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to create product.");
      return;
    }
    toast.success("Product added.");
    reset();
    setShowForm(false);
    await onReload();
  }

  return (
    <Card className="border-white/10 bg-gray-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Products</CardTitle>
          <Button
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            className="bg-primary text-primary-foreground hover:bg-amber-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "Cancel" : "Add Product"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <div className="space-y-5 rounded-lg border border-white/10 bg-gray-950/60 p-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="border-white/10 bg-gray-950"
                />
              </Field>
              <Field label="Category">
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="border-white/10 bg-gray-950"
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="border-white/10 bg-gray-950"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Price">
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  className="border-white/10 bg-gray-950"
                />
              </Field>
              <Field label="Sale Price">
                <Input
                  type="number"
                  value={form.sale_price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sale_price: e.target.value }))
                  }
                  className="border-white/10 bg-gray-950"
                />
              </Field>
            </div>
            <Field label="Image URL">
              <Input
                value={form.image_url}
                onChange={(e) =>
                  setForm((p) => ({ ...p, image_url: e.target.value }))
                }
                className="border-white/10 bg-gray-950"
              />
            </Field>
            <div className="flex flex-wrap items-end gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, in_stock: e.target.checked }))
                  }
                  className="h-4 w-4 accent-lime-500"
                />
                In stock
              </label>
              <div className="w-40">
                <Field label="Status">
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, status: v }))
                    }
                  >
                    <SelectTrigger className="border-white/10 bg-gray-950">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
            <Button
              onClick={handleCreate}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-amber-500"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Product
            </Button>
          </div>
        )}

        {products.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            No products yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Category</TableHead>
                <TableHead className="text-gray-400">Price</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-gray-300">
                    {product.category ?? "—"}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {fmtPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${statusBadgeClass(product.status)}`}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ====================================================================== */
/* Services                                                                */
/* ====================================================================== */

function ServicesPanel({
  company,
  services,
  onReload,
}: {
  company: Company;
  services: CompanyService[];
  onReload: () => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price_starting_at: "",
    price_type: "fixed" as "fixed" | "quote" | "hourly" | "per_foot",
    requires_quote: false,
    booking_url: "",
  });

  function reset() {
    setForm({
      name: "",
      category: "",
      description: "",
      price_starting_at: "",
      price_type: "fixed",
      requires_quote: false,
      booking_url: "",
    });
  }

  async function handleCreate() {
    if (!form.name.trim()) {
      toast.error("Service name is required.");
      return;
    }
    setSaving(true);
    const { error } = await createService({
      company_id: company.id,
      name: form.name.trim(),
      category: form.category || undefined,
      description: form.description || undefined,
      price_starting_at: form.price_starting_at
        ? Number(form.price_starting_at)
        : undefined,
      price_type: form.price_type,
      requires_quote: form.requires_quote,
      booking_url: form.booking_url || undefined,
      status: "published",
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to create service.");
      return;
    }
    toast.success("Service added.");
    reset();
    setShowForm(false);
    await onReload();
  }

  return (
    <Card className="border-white/10 bg-gray-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Services</CardTitle>
          <Button
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            className="bg-primary text-primary-foreground hover:bg-amber-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "Cancel" : "Add Service"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <div className="space-y-5 rounded-lg border border-white/10 bg-gray-950/60 p-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="border-white/10 bg-gray-950"
                />
              </Field>
              <Field label="Category">
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="border-white/10 bg-gray-950"
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="border-white/10 bg-gray-950"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Starting Price">
                <Input
                  type="number"
                  value={form.price_starting_at}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      price_starting_at: e.target.value,
                    }))
                  }
                  className="border-white/10 bg-gray-950"
                />
              </Field>
              <Field label="Price Type">
                <Select
                  value={form.price_type}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      price_type: v as typeof form.price_type,
                    }))
                  }
                >
                  <SelectTrigger className="border-white/10 bg-gray-950">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="per_foot">Per Foot</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Booking URL">
              <Input
                value={form.booking_url}
                onChange={(e) =>
                  setForm((p) => ({ ...p, booking_url: e.target.value }))
                }
                className="border-white/10 bg-gray-950"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.requires_quote}
                onChange={(e) =>
                  setForm((p) => ({ ...p, requires_quote: e.target.checked }))
                }
                className="h-4 w-4 accent-lime-500"
              />
              Requires a quote
            </label>
            <Button
              onClick={handleCreate}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-amber-500"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Service
            </Button>
          </div>
        )}

        {services.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            No services yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Category</TableHead>
                <TableHead className="text-gray-400">Starting At</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow
                  key={service.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="text-gray-300">
                    {service.category ?? "—"}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {service.requires_quote
                      ? "Quote"
                      : fmtPrice(service.price_starting_at)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${statusBadgeClass(service.status)}`}
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ====================================================================== */
/* Leads                                                                   */
/* ====================================================================== */

function LeadsPanel({
  leads,
  onChange,
}: {
  leads: CompanyLead[];
  onChange: (leads: CompanyLead[]) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleStatus(leadId: string, status: LeadStatus) {
    const { error } = await updateLeadStatus(leadId, status);
    if (error) {
      toast.error("Failed to update lead.");
      return;
    }
    toast.success(`Lead marked ${status}.`);
    onChange(
      leads.map((l) => (l.id === leadId ? { ...l, status } : l)),
    );
  }

  return (
    <Card className="border-white/10 bg-gray-900">
      <CardHeader>
        <CardTitle className="text-base">Leads</CardTitle>
        <CardDescription>
          Click a row to read the full message.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            No leads yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Message</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <React.Fragment key={lead.id}>
                  <TableRow
                    onClick={() =>
                      setExpanded((cur) => (cur === lead.id ? null : lead.id))
                    }
                    className="cursor-pointer border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-gray-300">
                      {fmtDate(lead.created_at)}
                    </TableCell>
                    <TableCell>{lead.name ?? "—"}</TableCell>
                    <TableCell className="text-gray-300">
                      {lead.email ?? "—"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <span className="capitalize">
                        {lead.lead_type.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {truncate(lead.message, 40)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={lead.status}
                        onValueChange={(v) =>
                          handleStatus(lead.id, v as LeadStatus)
                        }
                      >
                        <SelectTrigger className="h-8 w-32 border-white/10 bg-gray-950 capitalize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEAD_STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  {expanded === lead.id && (
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableCell colSpan={6}>
                        <div className="rounded-lg bg-gray-950/60 p-4 text-sm text-gray-300">
                          <p className="mb-1 font-medium text-white">
                            Full message
                          </p>
                          <p className="whitespace-pre-wrap">
                            {lead.message ?? "No message provided."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ====================================================================== */
/* Reviews                                                                 */
/* ====================================================================== */

function ReviewsPanel({ reviews }: { reviews: CompanyReview[] }) {
  return (
    <Card className="border-white/10 bg-gray-900">
      <CardHeader>
        <CardTitle className="text-base">Reviews</CardTitle>
        <CardDescription>Approved customer reviews.</CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            No approved reviews yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Reviewer</TableHead>
                <TableHead className="text-gray-400">Rating</TableHead>
                <TableHead className="text-gray-400">Title</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow
                  key={review.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="text-gray-300">
                    {fmtDate(review.created_at)}
                  </TableCell>
                  <TableCell>{review.reviewer_name ?? "Anonymous"}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-primary">
                      <Star className="h-4 w-4 fill-current" />
                      {review.rating}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {review.title ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${statusBadgeClass(review.status)}`}
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* ====================================================================== */
/* AI Tools                                                                */
/* ====================================================================== */

const AI_TOOLS: {
  jobType: AIJobType;
  title: string;
  description: string;
}[] = [
  {
    jobType: "generate_company_homepage",
    title: "Generate Homepage Copy",
    description: "Draft a polished homepage hero and intro for your company.",
  },
  {
    jobType: "generate_product_description",
    title: "Write Product Descriptions",
    description: "Turn product specs into compelling, SEO-ready copy.",
  },
  {
    jobType: "generate_seo_metadata",
    title: "Generate SEO Metadata",
    description: "Auto-create titles and meta descriptions that rank.",
  },
  {
    jobType: "generate_faqs",
    title: "Create FAQ Answers",
    description: "Generate helpful FAQ answers from your business details.",
  },
  {
    jobType: "generate_social_posts",
    title: "Write Social Posts",
    description: "Spin up on-brand posts for your channels.",
  },
  {
    jobType: "generate_event_promo",
    title: "Generate Event Promo",
    description: "Promote your next meetup, demo day, or sale.",
  },
];

function AIToolsPanel({
  company,
  jobs,
  userId,
  onReload,
}: {
  company: Company;
  jobs: AIContentJob[];
  userId: string;
  onReload: () => Promise<void>;
}) {
  const [pending, setPending] = useState<AIJobType | null>(null);

  async function handleGenerate(jobType: AIJobType) {
    setPending(jobType);
    const { error } = await createAIContentJob(
      { company_id: company.id, job_type: jobType },
      userId,
    );
    setPending(null);
    if (error) {
      toast.error("Failed to queue AI job.");
      return;
    }
    toast.success("Queued — AI is working on it.");
    await onReload();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {AI_TOOLS.map((tool) => (
          <Card key={tool.jobType} className="border-white/10 bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                {tool.title}
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleGenerate(tool.jobType)}
                disabled={pending === tool.jobType}
                className="bg-primary text-primary-foreground hover:bg-amber-500"
              >
                {pending === tool.jobType ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base">Recent AI Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No AI jobs yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-gray-300">
                      <span className="capitalize">
                        {job.job_type.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${statusBadgeClass(job.status)}`}
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {fmtDate(job.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-gray-500">
        AI generation powered by Vanciety Pro — upgrade to unlock.
      </p>
    </div>
  );
}

/* ====================================================================== */
/* Settings                                                                */
/* ====================================================================== */

function SettingsPanel({ company }: { company: Company }) {
  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your company? This cannot be undone.",
    );
    if (confirmed) {
      toast("Contact support to delete", {
        description: "Reach out to support@vanciety.com to remove your company.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base">Subscription</CardTitle>
          <CardDescription>Your current Vanciety plan.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Current plan</p>
            <p className="text-lg font-semibold capitalize">
              {company.subscription_tier}
            </p>
          </div>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-amber-500"
          >
            <Link to="/for-vendors">Upgrade</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-500/30 bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-red-400">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently remove your company from Vanciety.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="border-red-500/40 bg-transparent text-red-400 hover:bg-red-500/10"
          >
            Delete Company
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ====================================================================== */
/* Coming soon stub                                                        */
/* ====================================================================== */

function ComingSoonPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-white/10 bg-gray-900">
      <CardContent className="flex flex-col items-center justify-center py-20 text-center">
        <Rocket className="mb-4 h-10 w-10 text-primary" />
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        <p className="mb-1 max-w-md text-sm text-gray-400">{description}</p>
        <p className="text-xs text-gray-500">Coming soon to your plan.</p>
      </CardContent>
    </Card>
  );
}

export default VendorDashboard;
