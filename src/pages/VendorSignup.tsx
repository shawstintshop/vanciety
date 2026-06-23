import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShoppingBag, Upload, Camera, Globe, MapPin, Mail, Phone,
  Sparkles, Check, ArrowRight, Star, Zap, Crown, Shield,
  Hammer, Truck, Wrench, Compass, Tent, Package, Link2,
  ShoppingCart, Building, ChevronRight
} from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { id: "builders",       label: "Van Builders",         icon: Hammer,      desc: "Custom van conversions & builds" },
  { id: "manufacturers",  label: "Manufacturers",        icon: Truck,       desc: "Vehicle & component manufacturers" },
  { id: "parts",          label: "Parts & Components",   icon: Wrench,      desc: "Van parts, plumbing, heating" },
  { id: "electrical",     label: "Electrical & Solar",   icon: Zap,         desc: "Solar, batteries, inverters" },
  { id: "tours",          label: "Tours & Experiences",  icon: Compass,     desc: "Guided tours, van life experiences" },
  { id: "rentals",        label: "Van Rentals",          icon: Tent,        desc: "Rent camper vans & RVs" },
  { id: "gear",           label: "Accessories & Gear",   icon: Package,     desc: "Camping gear, kitchen, storage" },
  { id: "services",       label: "Services",             icon: Star,        desc: "Insurance, consulting, maintenance" },
  { id: "affiliate",      label: "Affiliate / Reseller", icon: Link2,       desc: "Amazon, eBay, affiliate products" },
  { id: "dealerships",    label: "Dealerships",          icon: ShoppingCart, desc: "New & used van sales" },
];

const PRICING_TIERS = [
  {
    id: "free", name: "Starter", price: "Free", period: "",
    features: ["Basic listing", "1 photo", "Business description", "Category listing", "Contact info"],
    cta: "Start Free", popular: false,
  },
  {
    id: "pro", name: "Pro", price: "$49", period: "/mo",
    features: ["Everything in Starter", "Unlimited photos & videos", "Featured in category", "Product listings", "Analytics dashboard", "Priority support", "Verified badge"],
    cta: "Go Pro", popular: true,
  },
  {
    id: "enterprise", name: "Enterprise", price: "$149", period: "/mo",
    features: ["Everything in Pro", "Homepage featured spot", "AI-powered descriptions", "Affiliate link tracking", "Custom branding", "API access", "Dedicated account manager"],
    cta: "Contact Sales", popular: false,
  },
];

const inferSeoTags = (text: string) => {
  const normalized = text.toLowerCase();
  const tags = [
    ["solar", "Solar"],
    ["battery", "Battery Systems"],
    ["inverter", "Inverters"],
    ["sprinter", "Sprinter"],
    ["transit", "Transit"],
    ["revel", "Revel"],
    ["electrical", "Electrical"],
    ["plumbing", "Plumbing"],
    ["cabinet", "Cabinetry"],
    ["heater", "Heating"],
    ["off-grid", "Off-Grid"],
  ].filter(([needle]) => normalized.includes(needle)).map(([, label]) => label);

  return tags.slice(0, 6);
};

const VendorSignup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1); // 1=category, 2=details, 3=media, 4=confirm
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const [form, setForm] = useState({
    business_name: "",
    category: "",
    description: "",
    location: "",
    website_url: "",
    contact_email: user?.email || "",
    contact_phone: "",
    services: "",
    year_established: "",
    social_instagram: "",
    social_youtube: "",
    social_facebook: "",
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const aiTags = inferSeoTags(`${form.business_name} ${form.description} ${form.services}`);
  const categoryLabel = CATEGORIES.find((category) => category.id === form.category)?.label || "Vendor";
  const aiSnippet = form.business_name
    ? `${form.business_name} is a ${categoryLabel.toLowerCase()}${form.location ? ` based in ${form.location}` : ""} focused on ${form.services || "van life services and products"}.`
    : "Add business details to preview the AI listing optimization layer.";

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please create an account or sign in first.", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      // Upload logo if provided
      let logoUrl = null;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `vendor-logos/${user.id}/${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("vendor-media")
          .upload(path, logoFile);
        if (!uploadErr && uploadData) {
          const { data: urlData } = supabase.storage.from("vendor-media").getPublicUrl(path);
          logoUrl = urlData.publicUrl;
        }
      }

      // Create vendor profile
      const { error } = await supabase.from("vendors").insert({
        user_id: user.id,
        business_name: form.business_name,
        category: form.category,
        description: form.description,
        location: form.location,
        website_url: form.website_url || null,
        contact_email: form.contact_email || null,
        contact_phone: form.contact_phone || null,
        email: form.contact_email || null,
        phone: form.contact_phone || null,
        logo_url: logoUrl,
        services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
        year_established: form.year_established ? parseInt(form.year_established) : null,
        social_links: {
          instagram: form.social_instagram || null,
          youtube: form.social_youtube || null,
          facebook: form.social_facebook || null,
        },
        status: "pending",
        subscription_tier: "free",
      } as any);

      if (error) throw error;

      toast({
        title: "🎉 Application submitted!",
        description: "We'll review your listing and get you live within 24 hours.",
      });
      navigate("/vendors");
    } catch (err: any) {
      toast({
        title: "Error submitting",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background topo-card">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* ── Header ─────────────────────────────────────── */}
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary text-primary-foreground text-sm px-4 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Vendor Registration
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">
              List Your Business
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join the fastest-growing van life directory. Reach thousands of builders,
              travelers, and enthusiasts looking for exactly what you offer.
            </p>
          </div>

          {/* ── Progress Steps ─────────────────────────────── */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[
              { n: 1, label: "Category" },
              { n: 2, label: "Details" },
              { n: 3, label: "Media" },
              { n: 4, label: "Confirm" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= s.n
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.n ? <Check className="w-4 h-4" /> : s.n}
                </div>
                <span className={`text-sm hidden sm:inline ${step >= s.n ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                {i < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </div>

          {/* ── Step 1: Category Selection ─────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">What type of business are you?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const selected = form.category === cat.id;
                  return (
                    <Card
                      key={cat.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selected ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "hover:border-primary/30"
                      }`}
                      onClick={() => updateForm("category", cat.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{cat.label}</h3>
                          <p className="text-sm text-muted-foreground">{cat.desc}</p>
                        </div>
                        {selected && <Check className="w-5 h-5 text-primary" />}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="hero"
                  size="lg"
                  disabled={!form.category}
                  onClick={() => setStep(2)}
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2: Business Details ───────────────────── */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>Tell us about your business so customers can find you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name *</Label>
                    <Input
                      id="business_name"
                      placeholder="Your Business Name"
                      value={form.business_name}
                      onChange={(e) => updateForm("business_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="City, State"
                        value={form.location}
                        onChange={(e) => updateForm("location", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell van lifers what you do, what makes you different, and why they should choose you..."
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="services">Services / Products (comma-separated)</Label>
                  <Input
                    id="services"
                    placeholder="Custom Builds, Solar Install, Plumbing, Electrical..."
                    value={form.services}
                    onChange={(e) => updateForm("services", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="website_url"
                        placeholder="https://yoursite.com"
                        value={form.website_url}
                        onChange={(e) => updateForm("website_url", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year_established">Year Established</Label>
                    <Input
                      id="year_established"
                      placeholder="2020"
                      type="number"
                      value={form.year_established}
                      onChange={(e) => updateForm("year_established", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="contact_email"
                        placeholder="hello@yourbusiness.com"
                        value={form.contact_email}
                        onChange={(e) => updateForm("contact_email", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="contact_phone"
                        placeholder="(555) 123-4567"
                        value={form.contact_phone}
                        onChange={(e) => updateForm("contact_phone", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social_instagram">Instagram</Label>
                    <Input
                      id="social_instagram"
                      placeholder="@yourbusiness"
                      value={form.social_instagram}
                      onChange={(e) => updateForm("social_instagram", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_youtube">YouTube</Label>
                    <Input
                      id="social_youtube"
                      placeholder="Channel URL"
                      value={form.social_youtube}
                      onChange={(e) => updateForm("social_youtube", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_facebook">Facebook</Label>
                    <Input
                      id="social_facebook"
                      placeholder="Page URL"
                      value={form.social_facebook}
                      onChange={(e) => updateForm("social_facebook", e.target.value)}
                    />
                  </div>
                </div>

                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI listing optimization preview
                    </CardTitle>
                    <CardDescription>
                      This is the first practical layer for vendor AI: better listing copy, stronger tags, and cleaner lead intake before a full automation system is added.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Suggested snippet</p>
                      <p className="mt-2 text-sm text-muted-foreground">{aiSnippet}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Suggested tags</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(aiTags.length ? aiTags : [categoryLabel]).map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 text-sm text-muted-foreground">
                      <div className="rounded-xl border bg-background/70 p-3">
                        <p className="font-medium text-foreground">Next AI step</p>
                        <p className="mt-1">Vision-assisted component tagging from uploaded van build photos.</p>
                      </div>
                      <div className="rounded-xl border bg-background/70 p-3">
                        <p className="font-medium text-foreground">Lead qualification path</p>
                        <p className="mt-1">Budget, timeline, and van type questions before a human vendor reply.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button
                    variant="hero"
                    size="lg"
                    disabled={!form.business_name || !form.description}
                    onClick={() => setStep(3)}
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Step 3: Media Upload ───────────────────────── */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Logo</CardTitle>
                <CardDescription>
                  Add your business logo. You can upload more photos and videos from your vendor dashboard after signup.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoPreview ? (
                    <div className="flex flex-col items-center gap-4">
                      <img src={logoPreview} alt="Logo preview" className="w-32 h-32 rounded-xl object-contain" />
                      <p className="text-sm text-muted-foreground">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Upload Business Logo</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG, or SVG up to 5MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>

                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">More media after signup</h4>
                      <p className="text-sm text-muted-foreground">
                        Once your listing is approved, you'll get access to your vendor dashboard where you can
                        upload unlimited photos, embed YouTube videos, add product listings, and manage your business profile.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button variant="hero" size="lg" onClick={() => setStep(4)}>
                    Review & Submit <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Step 4: Review & Submit ────────────────────── */}
          {step === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Listing</CardTitle>
                  <CardDescription>Make sure everything looks good before submitting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Business Name</p>
                      <p className="font-semibold">{form.business_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-semibold">{CATEGORIES.find((c) => c.id === form.category)?.label}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{form.location || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <p className="font-semibold">{form.website_url || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{form.description}</p>
                  </div>
                  {form.services && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Services</p>
                      <div className="flex flex-wrap gap-2">
                        {form.services.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                          <Badge key={s} variant="outline">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {logoPreview && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Logo</p>
                      <img src={logoPreview} alt="Logo" className="w-20 h-20 rounded-xl object-contain border" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {!user && (
                <Card className="border-border bg-muted/40">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Shield className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="font-semibold">Sign in to submit</h4>
                      <p className="text-sm text-muted-foreground">You need a free Vanciety account to list your business.</p>
                    </div>
                    <Button asChild variant="hero">
                      <a href="/auth">Sign In / Sign Up</a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading || !user}
                >
                  {loading ? "Submitting..." : "Submit Listing"}
                  {!loading && <Check className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
          )}

          {/* ── Pricing Section ────────────────────────────── */}
          <div id="pricing" className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
              <p className="text-muted-foreground">Start free. Upgrade when you're ready to grow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICING_TIERS.map((tier) => (
                <Card
                  key={tier.id}
                  className={`relative overflow-hidden ${
                    tier.popular ? "border-primary ring-2 ring-primary/30" : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                    <Button
                      variant={tier.popular ? "hero" : "outline"}
                      className="w-full mt-4"
                      onClick={() => {
                        if (step === 1) setStep(1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {tier.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorSignup;
