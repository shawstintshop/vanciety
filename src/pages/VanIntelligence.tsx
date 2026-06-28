import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, CheckCircle2, ExternalLink, Gauge, MapPinned, ShieldAlert, TriangleAlert, Video, Wrench, BookmarkPlus, Sparkles, Loader2, Search, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PRECHECKS = [
  "Rough idle, hesitation, reduced power, or limp mode.",
  "EGR fault code or check-engine light.",
  "Buck/judder during acceleration or soot buildup symptoms.",
  "The fault returns after clearing codes or after a short road test.",
];

const CLEANING_FLOW = [
  "Scan for codes and confirm the symptoms point to EGR flow or soot buildup.",
  "Open the factory parts / service reference and confirm the exact EGR hardware for your engine.",
  "Watch one real teardown video before touching the van so you know the bolt count, sensors, and access points.",
  "Remove the EGR assembly carefully and inspect for heavy carbon, sticky movement, cracked seals, or coolant / electrical issues.",
  "Clean only the passages and surfaces that are meant to be cleaned. Do not force or soak the electronics.",
  "Reinstall with a new gasket, clear codes if needed, and road test.",
  "If the symptom returns, stop cleaning and move to deeper diagnosis or replacement.",
];

const FACTS = [
  {
    title: "Official Mercedes-Benz source",
    url: "https://static.nhtsa.gov/odi/tsbs/2025/MC-11016423-0001.pdf",
    note: "Mercedes-Benz technical note for OM642 diesel EGR valve diagnosis and cleaning procedure.",
  },
  {
    title: "Mercedes-Benz parts lookup",
    url: "https://mbparts.mbusa.com/v-2019-mercedes-benz-sprinter-2500--base--3-0l-v6-diesel/emission-system--egr-system",
    note: "Manufacturer diagram and component reference for the Sprinter 2500 V6 diesel path.",
  },
  {
    title: "MB USA Bluetec update / VIN lookup",
    url: "https://bluetecupdate.mbusa.com/home",
    note: "Factory-owned VIN and emissions reference for verification and status checks.",
  },
];

const VIDEOS = [
  {
    title: "Sprinter 3.0L V6 EGR Cleaning + Stuck EGR Removal Tip (OM642)",
    url: "https://www.youtube.com/watch?v=MQPCj4xjZlI",
    note: "Best teardown-style walkthrough for this path.",
  },
  {
    title: "Mercedes Sprinter Van EGR Cleaning - Step-by-Step Guide",
    url: "https://www.youtube.com/watch?v=2LMYXmkjdfI",
    note: "Good visual companion for the process and tool flow.",
  },
  {
    title: "How to Clean EGR Valve on Mercedes Sprinter | 2007–2022 V6 Diesel",
    url: "https://www.youtube.com/watch?v=5ctn55mv7EA",
    note: "Useful for the V6 diesel path and cleaning/removal visuals.",
  },
  {
    title: "How to: Mercedes Sprinter V6 Diesel EGR Valve Cleaning (2019 ...)",
    url: "https://www.youtube.com/watch?v=rblAImX9Z3g",
    note: "Extra visual option for the same engine family.",
  },
  {
    title: "Mercedes Sprinter EGR Valve Cleaning How To HD 1080p",
    url: "https://www.youtube.com/watch?v=AypetdeS9eA",
    note: "Additional visual reference for removal and cleaning.",
  },
  {
    title: "Sprinter EGR valve Removal and Cleaning 2010-2016 3.0L diesel",
    url: "https://www.youtube.com/watch?v=Fad1Av3gRkI",
    note: "Helpful extra video for visual learners on the V6 diesel path.",
  },
];

const FORUMS = [
  {
    title: "MBWorld: OM642 EGR/intake cleaning",
    url: "https://mbworld.org/forums/diesel-forum/690387-om642-egr-intake-cleaning.html",
    note: "Owner notes and practical cleaning discussion.",
  },
  {
    title: "MBWorld: OM642 EGR/intake cleaning - page 2",
    url: "https://mbworld.org/forums/diesel-forum/690387-om642-egr-intake-cleaning-2.html",
    note: "Follow-up info, caution notes, and code-clear reminders.",
  },
  {
    title: "Air Forums: Cleaning the EGR valve in an Interstate",
    url: "https://www.airforums.com/threads/cleaning-the-egr-valve-in-an-interstate.1415525/",
    note: "Sprinter owners referencing a known cleaning video and workflow.",
  },
  {
    title: "Winnebago Revel Forum: EGR Valve Cleaning - VS30 Chassis",
    url: "https://www.winnebagorevelforum.com/forum/revel-tech/problem-solving-owners-helping-each-other/mb-chassis-problems/3331-egr-valve-cleaning-vs30-chassis",
    note: "VS30-specific owner discussion for practical removal tips.",
  },
];

const NEXT_ACTIONS = [
  "Identify your exact engine and model year before buying parts.",
  "Use the factory source first, then a video, then forum confirmation.",
  "If the fault is electrical or returns after cleaning, replace or diagnose deeper instead of repeating the same cleaning.",
  "Use the parts lookup to confirm the correct gasket, valve, and related emission components.",
];

const TOOL_LIST = [
  "Basic socket set and extensions",
  "Torx bits / drivers as required by the EGR hardware",
  "Gloves and safety glasses",
  "Approved EGR cleaner",
  "Soft brush / non-metallic cleaning brush",
  "Replacement gasket if removal is required",
  "OBD scanner for codes and verification",
];

const visualCards = [
  {
    title: "A. Diagnose the symptom",
    copy: "Start with what you're experiencing — rough idle, limp mode, fault codes — before touching anything.",
    badge: "Diagnose",
    Icon: Search,
  },
  {
    title: "B. Factory source first",
    copy: "Cross-reference the official Mercedes-Benz service documentation and parts lookup before ordering.",
    badge: "Factory",
    Icon: BookOpen,
  },
  {
    title: "C. Community confirmation",
    copy: "Verify the fix with real owner reports from Sprinter-Source, MBWorld, and van life forums.",
    badge: "Community",
    Icon: Users,
  },
];

const VanIntelligence = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── AI diagnosis (server-side via the van-intelligence-ai edge function;
  //    ANTHROPIC_API_KEY stays in Supabase secrets, never in the browser) ──
  const [issue, setIssue] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // ── Knowledge-base articles loaded from van_intelligence_articles ──
  type KbArticle = { id: string; title: string; category: string; body: string; tags: string[]; source_url: string | null };
  const [articles, setArticles] = useState<KbArticle[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("van_intelligence_articles" as any)
        .select("id, title, category, body, tags, source_url")
        .order("created_at", { ascending: false });
      if (active && data) setArticles(data as unknown as KbArticle[]);
    })();
    return () => { active = false; };
  }, []);

  const runDiagnosis = async () => {
    if (!issue.trim()) {
      toast.info("Describe the van issue first.");
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("van-intelligence-ai", {
        body: { issue: issue.trim() },
      });
      if (error) throw error;
      if (data?.ok && data.diagnosis) {
        setAiResult(data.diagnosis as string);
      } else {
        setAiError((data?.error as string) || "Could not get a diagnosis. Try again.");
      }
    } catch {
      setAiError("AI request failed. Please try again in a moment.");
    } finally {
      setAiLoading(false);
    }
  };

  const saveThisGuide = async () => {
    if (!user) {
      toast.info("Sign in to save this guide.");
      navigate("/auth");
      return;
    }

    const title = "2022 Sprinter V6 Diesel EGR Cleaning";
    const canonicalTopic = "egr-cleaning";
    const slug = "2022-sprinter-v6-diesel-egr-cleaning";
    const guideUrl = "/van-intelligence?guide=egr-v6-diesel";

    const { data: existingCollection, error: collectionError } = await supabase
      .from("member_collections")
      .select("id")
      .eq("user_id", user.id)
      .eq("slug", slug)
      .maybeSingle();

    if (collectionError) {
      toast.error("Could not save this guide right now.");
      return;
    }

    let collectionId = existingCollection?.id;

    if (!collectionId) {
      const { data: createdCollection, error: createError } = await supabase
        .from("member_collections")
        .insert({
          user_id: user.id,
          title,
          slug,
          query_text: "2022 Sprinter V6 diesel EGR cleaning",
          canonical_topic: canonicalTopic,
          topic_category: "maintenance",
          topic_aliases: ["egr valve", "egr cleaning", "sprinter egr", "diesel egr"],
          summary: "Saved guide for EGR cleaning, factory references, videos, and forum evidence.",
          vehicle_context: {
            engine: "V6 diesel",
            model: "2022 Sprinter 2500",
          },
        })
        .select("id")
        .single();

      if (createError || !createdCollection) {
        toast.error("Could not save this guide right now.");
        return;
      }

      collectionId = createdCollection.id;
    }

    const { error: itemError } = await supabase.from("collection_items").upsert({
      collection_id: collectionId,
      item_type: "note",
      source_table: "guide",
      source_id: slug,
      title,
      description: "Saved starting point for the V6 diesel EGR repair guide.",
      url: guideUrl,
      source_badge: "MANUAL",
      topic_key: canonicalTopic,
      topic_label: "EGR cleaning",
      topic_score: 1,
      is_new: false,
      metadata: {
        section: "Van Intelligence",
        origin: "manual-save",
      },
    }, { onConflict: "collection_id,source_table,source_id" });

    if (itemError) {
      toast.error("Saved the collection, but could not attach the guide item.");
      return;
    }

    toast.success("Guide saved to your member page.");
  };

  return (
    <div className="min-h-screen bg-background topo-card">
      <Header />
      <main className="pt-16 sm:pt-20">
        <HeroSection
          image="https://files.manuscdn.com/user_upload_by_module/session_file/94256494/dwkoSqnsLaqyoryO.jpg"
          badge="Repair Research Hub"
          title="Find the exact fix"
          accent="for your Sprinter."
          subtitle="Factory references, manufacturer diagrams, real videos, and forum evidence."
        >
          <Button variant="outline" onClick={saveThisGuide} className="gap-2 border-white/25 text-white hover:bg-white/10">
            <BookmarkPlus className="h-4 w-4" />
            Save this guide
          </Button>
        </HeroSection>

        <section className="container mx-auto px-4 py-12">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* AI diagnosis — Claude Haiku via secure server-side edge function */}
          <Card className="mb-8 border-primary/30 bg-card/90 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Describe your van issue
              </CardTitle>
              <CardDescription>
                Get an AI diagnosis and step-by-step repair guidance. Always confirm exact parts against the factory reference for your engine and VIN.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="e.g. 2019 Sprinter 3.0 V6 — rough idle, hesitation, and a P0299 underboost code that returns after clearing."
                rows={3}
                className="resize-none"
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={runDiagnosis} disabled={aiLoading} className="gap-2">
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {aiLoading ? "Diagnosing…" : "Get AI Diagnosis"}
                </Button>
                <span className="text-xs text-muted-foreground">Powered by Claude · API keys stay server-side</span>
              </div>
              {aiError && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{aiError}</div>
              )}
              {aiResult && (
                <div className="rounded-xl border border-border/60 bg-background/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">{aiResult}</div>
              )}
            </CardContent>
          </Card>

          {/* Knowledge base — loaded from van_intelligence_articles */}
          {articles.length > 0 && (
            <Card className="mb-8 border-border/80 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Knowledge base
                </CardTitle>
                <CardDescription>Verified repair-research articles from the Vanciety library.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {articles.map((a) => (
                  <div key={a.id} className="rounded-xl border border-border/60 bg-background/50 p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase">{a.category}</Badge>
                      <h3 className="font-semibold">{a.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                    {a.source_url && (
                      <a href={a.source_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        Source <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-border/80 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ShieldAlert className="h-5 w-5 text-secondary" />
                  Start with the symptoms
                </CardTitle>
                <CardDescription>
                  Match the problem to the right path before you buy parts or start disassembly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {PRECHECKS.map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-border/60 bg-background/50 p-3 text-sm">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Gauge className="h-5 w-5 text-primary" />
                  Next action
                </CardTitle>
                <CardDescription>
                  This is the fastest path to the right answer without wasting time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {NEXT_ACTIONS.map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-border/60 bg-background/50 p-3 text-sm">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">{index + 1}</div>
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-6 lg:grid-cols-3">
            {visualCards.map((card) => (
              <Card key={card.title} className="overflow-hidden border-border/80 bg-card/90 shadow-lg">
                <div className="flex items-center justify-center bg-[#111] border-b border-border/60 py-10">
                  <card.Icon className="h-14 w-14 text-primary opacity-75" />
                </div>
                <CardHeader className="space-y-2">
                  <Badge className="w-fit bg-primary text-primary-foreground">{card.badge}</Badge>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription>{card.copy}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/80 bg-card/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Wrench className="h-5 w-5 text-primary" />
                  Tools and supplies
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {TOOL_LIST.map((tool) => (
                  <div key={tool} className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 p-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {tool}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPinned className="h-5 w-5 text-primary" />
                  Factory and manufacturer links
                </CardTitle>
                <CardDescription>
                  These are the strongest source anchors for the V6 diesel path.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {FACTS.map((ref) => (
                  <div key={ref.url} className="rounded-2xl border border-border/70 bg-background/55 p-4">
                    <a href={ref.url} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
                      {ref.title}
                    </a>
                    <p className="mt-2 text-sm text-muted-foreground">{ref.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <Card className="border-border/80 bg-card/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Video className="h-5 w-5 text-primary" />
                Videos that show the job
              </CardTitle>
              <CardDescription>
                Real walkthroughs for the OM642 / V6 diesel EGR path.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {VIDEOS.map((video) => (
                <a key={video.url} href={video.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-border/70 bg-background/60 p-4 transition hover:border-primary/70 hover:bg-primary/5">
                  <p className="text-sm font-semibold">{video.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{video.note}</p>
                  <p className="mt-3 text-xs font-medium text-primary">Open video <ExternalLink className="ml-1 inline-block h-3 w-3" /></p>
                </a>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <Card className="border-border/80 bg-card/90">
            <CardHeader>
              <CardTitle className="text-xl">Forum and owner evidence</CardTitle>
              <CardDescription>
                Use these to compare what other owners actually did and what fixed the issue.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {FORUMS.map((thread) => (
                <div key={thread.url} className="rounded-2xl border border-border/70 bg-background/55 p-4">
                  <a href={thread.url} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
                    {thread.title}
                  </a>
                  <p className="mt-2 text-sm text-muted-foreground">{thread.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <Card className="border-border/80 bg-card/90">
            <CardHeader>
              <CardTitle className="text-xl">What this page should answer next</CardTitle>
              <CardDescription>
                A guide is only useful if it tells people what to do when the first fix doesn’t solve it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Which exact EGR component fits your engine</p>
              <p>• Whether cleaning is allowed or replacement is smarter</p>
              <p>• What to do when the codes come back after a reset</p>
              <p>• How to pivot from symptoms to the right repair path</p>
              <Separator className="my-4" />
              <Button asChild variant="hero" className="w-full sm:w-auto">
                <Link to="/videos">Go to videos</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default VanIntelligence;
