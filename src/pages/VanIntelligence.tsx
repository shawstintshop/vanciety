import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, ExternalLink, Wrench, Video, ShieldAlert, TriangleAlert, BookOpen, MapPinned, Gauge } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const EGR_VIDEOS = [
  {
    title: "Mercedes Sprinter Van EGR Cleaning - Step-by-Step Guide",
    url: "https://www.youtube.com/watch?v=2LMYXmkjdfI",
    channel: "YouTube",
    note: "General Sprinter EGR cleaning walkthrough with symptoms and removal context.",
  },
  {
    title: "How to Clean EGR Valve on Mercedes Sprinter | 2007–2022 V6 Diesel",
    url: "https://www.youtube.com/watch?v=5ctn55mv7EA",
    channel: "YouTube",
    note: "Useful for the V6 diesel path and cleaning/removal visuals.",
  },
  {
    title: "Step by Step 15 Minute EGR Valve Cleaning 2019+ Mercedes Sprinter",
    url: "https://www.youtube.com/watch?v=lJptuyuKaw8",
    channel: "YouTube",
    note: "VS30-era process context; verify engine-specific fit before starting.",
  },
];

const OFFICIAL_REFERENCES = [
  {
    title: "Mercedes-Benz LI14.20-N-073867 — EGR Valve Diagnosis and Cleaning Procedure",
    url: "https://static.nhtsa.gov/odi/tsbs/2025/MC-11016423-0001.pdf",
    note: "Official summary covering OM642 V6 diesel. Notes that the cleaning procedure is not valid for OM651/OM654.",
  },
  {
    title: "Wynn’s Sprinter 3.0L Diesel Induction & EGR Service Job Aid",
    url: "https://wynnsusa.com/wp-content/uploads/2021/10/ZW21000-Diesel-EGR-REV.-01-Job-Aid-Sprinter-3-Mercedes-Engine.pdf",
    note: "Helpful for service workflow and tooling; verify applicability for your exact engine before use.",
  },
];

const FIRST_STEPS = [
  "Confirm the engine code before touching anything. The page path below assumes the V6 diesel route.",
  "Scan for symptoms: bucking, hesitation, reduced power, rough idle, or EGR-related fault codes.",
  "Use the official reference first to decide whether cleaning is allowed or if replacement/other diagnosis is needed.",
  "If cleaning is appropriate, remove the EGR assembly carefully, inspect soot buildup, clean, and reinstall with a new gasket.",
  "Road test, clear codes if needed, and verify the symptom is gone before calling the job complete.",
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

const CHECKPOINTS = [
  "Do not force seized EGR blades.",
  "Do not spray electrical connectors or soak sensitive electronics.",
  "If the fault is electrical, cleaning may not solve it.",
  "If the part is damaged or seized, replacement may be the right fix.",
  "This guide is for the V6 diesel path — confirm the exact engine before starting.",
];

const VanIntelligence = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="vanciety-hero-topo border-b border-border/60 py-12">
          <div className="container mx-auto px-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-primary text-primary-foreground">
                <BookOpen className="mr-2 h-3.5 w-3.5" />
                Repair guide
              </Badge>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                2022 Sprinter VS30 V6 Diesel EGR Valve
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
                Diagnose, clean, remove, inspect, and verify the EGR valve on your Sprinter 2500 V6 diesel — with official references, real videos, tools, and a no-fluff step flow.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-border/80 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Gauge className="h-5 w-5 text-primary" />
                  Start here
                </CardTitle>
                <CardDescription>
                  This is the path a visitor should follow first so they do not end up on the wrong procedure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {FIRST_STEPS.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-2xl border border-border/70 bg-background/60 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ShieldAlert className="h-5 w-5 text-secondary" />
                  Safety / fit check
                </CardTitle>
                <CardDescription>
                  Keep this page honest. If one of these boxes is true, the visitor should stop and branch to the right fix.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {CHECKPOINTS.map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-border/60 bg-background/50 p-3 text-sm">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
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
                    <CheckCircle2 className="h-4 w-4 text-lime-500" />
                    {tool}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPinned className="h-5 w-5 text-primary" />
                  What this page should eventually answer
                </CardTitle>
                <CardDescription>
                  This is the content model for every future how-to page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-foreground/90">
                  <p>• What symptoms mean EGR trouble</p>
                  <p>• Whether the engine allows cleaning or needs another path</p>
                  <p>• How to remove, inspect, clean, and reinstall</p>
                  <p>• Which videos and official references to trust</p>
                  <p>• What to do when the cleaning does not fix it</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <Card className="border-border/80 bg-card/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Video className="h-5 w-5 text-primary" />
                Real videos
              </CardTitle>
              <CardDescription>
                These are the current verified video leads for the page. The final build should embed the best one and keep the others as backups.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {EGR_VIDEOS.map((video) => (
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
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/80 bg-card/90">
              <CardHeader>
                <CardTitle className="text-xl">Official references</CardTitle>
                <CardDescription>
                  These are the source documents to anchor the guide to real repair data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {OFFICIAL_REFERENCES.map((ref) => (
                  <div key={ref.url} className="rounded-2xl border border-border/70 bg-background/55 p-4">
                    <a href={ref.url} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
                      {ref.title}
                    </a>
                    <p className="mt-2 text-sm text-muted-foreground">{ref.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardHeader>
                <CardTitle className="text-xl">Next step in the build</CardTitle>
                <CardDescription>
                  After this page is live, we can wire a cleaner article layout and then add more repair guides using the same format.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>1. Put this guide into the Van Intelligence hub.</p>
                <p>2. Add a route card on the homepage and video page.</p>
                <p>3. Turn the same pattern into a reusable guide template.</p>
                <Separator className="my-4" />
                <Button asChild variant="hero" className="w-full">
                  <Link to="/videos">Go to videos</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VanIntelligence;
