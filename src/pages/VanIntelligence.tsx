import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, CheckCircle2, ExternalLink, Gauge, MapPinned, ShieldAlert, TriangleAlert, Video, Wrench } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const VANA_FRAMES = [
  { src: "/images/vana/vana-friendly-welcome.jpg", alt: "Vana friendly welcome" },
  { src: "/images/vana/vana-problem-solving.jpg", alt: "Vana problem solving" },
  { src: "/images/vana/vana-route-guidance.jpg", alt: "Vana route guidance" },
  { src: "/images/vana/vana-tech-support.jpg", alt: "Vana tech support" },
  { src: "/images/vana/vana-community-finder.jpg", alt: "Vana community finder" },
  { src: "/images/vana/vana-adventure-ready.jpg", alt: "Vana adventure ready" },
];

const PRECHECKS = [
  "Confirm your engine and model year first.",
  "Do not start if the issue is electrical, wiring-related, or unrelated to soot buildup.",
  "Have a new gasket ready if the unit needs to come off.",
  "Use the factory source first, then the video, then forum notes.",
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

const visualSteps = [
  { title: "1. Start here", image: VANA_FRAMES[0].src, note: "Use Vana to route to the right path." },
  { title: "2. Problem solve", image: VANA_FRAMES[1].src, note: "Match the symptom to the EGR issue." },
  { title: "3. Route guidance", image: VANA_FRAMES[2].src, note: "Open the factory source and part lookup." },
  { title: "4. Tech support", image: VANA_FRAMES[3].src, note: "Watch a teardown video before touching the van." },
  { title: "5. Community finder", image: VANA_FRAMES[4].src, note: "Check forums for owner-confirmed fixes." },
  { title: "6. Adventure ready", image: VANA_FRAMES[5].src, note: "Clean, test, and move back to the road." },
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
                Repair research hub
              </Badge>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Find the exact fix for your Sprinter
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
                Use facts first: factory references, manufacturer diagrams, real videos, and forum evidence. Then decide whether to clean, replace, or diagnose deeper.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-6 lg:grid-cols-2">
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
