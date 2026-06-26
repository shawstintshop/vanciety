import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, ExternalLink, Mail, Megaphone, PlayCircle, Shirt, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VanBriefingItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string | null;
  summary: string;
  category: string;
  badge: string;
  unavailable?: boolean;
}

interface AffiliateOpportunity {
  id: string;
  label: string;
  search: string;
  angle: string;
  score: number;
  url: string;
  affiliateActive: boolean;
}

interface VanNewsDigest {
  generatedAt: string;
  title: string;
  subtitle: string;
  sourcePolicy: string;
  topStory: string;
  categories: string[];
  items: VanBriefingItem[];
  affiliateOpportunities: AffiliateOpportunity[];
  socialCopy: {
    facebook: string;
    x: string;
    youtubeDescription: string;
  };
  videoPrompt: string;
  emailListCTA: {
    headline: string;
    copy: string;
    status: string;
  };
  merchDropIdea: {
    theme: string;
    productIdeas: string[];
    releaseCadence: string;
    fulfillment: string;
  };
}

const fallbackDigest: VanNewsDigest = {
  generatedAt: new Date().toISOString(),
  title: "Today’s Van Intelligence Briefing",
  subtitle: "Daily van-life news, events, gear angles, and creator prompts for Vanciety.",
  sourcePolicy: "Today’s briefing opens official van-life event, camping, and gear sources while the daily digest feed is refreshed.",
  topStory: "Daily van briefing generator is ready",
  categories: ["events", "gear", "camping"],
  items: [
    {
      id: "fallback-overland-expo",
      title: "Check the Overland Expo calendar",
      source: "Overland Expo",
      url: "https://www.overlandexpo.com/",
      publishedAt: null,
      summary: "Official source for expo dates, tickets, vendor lineups, classes, and camping details.",
      category: "events",
      badge: "OFFICIAL",
    },
    {
      id: "fallback-adventure-van-expo",
      title: "Check the Adventure Van Expo schedule",
      source: "Adventure Van Expo",
      url: "https://adventurevanexpo.com/",
      publishedAt: null,
      summary: "Official van expo calendar for upcoming shows, builders, and meetup planning.",
      category: "events",
      badge: "OFFICIAL",
    },
    {
      id: "fallback-recreation-gov",
      title: "Find federal campgrounds for the next trip",
      source: "Recreation.gov",
      url: "https://www.recreation.gov/search?q=camping",
      publishedAt: null,
      summary: "Official campground search for availability, reservations, passes, and trip planning.",
      category: "camping",
      badge: "OFFICIAL",
    },
  ],
  affiliateOpportunities: [
    {
      id: "power-solar",
      label: "Power + solar upgrade list",
      search: "van life solar battery inverter Victron portable power station",
      angle: "Turn power-system stories into a practical buyer checklist.",
      score: 0,
      url: "https://www.amazon.com/s?k=van+life+solar+battery+inverter+Victron+portable+power+station",
      affiliateActive: false,
    },
  ],
  socialCopy: {
    facebook: "Today’s Vanciety van briefing is ready. Share the top stories, events, and gear ideas with your van group.",
    x: "Today’s Vanciety van briefing: van news, events, gear and trip ideas.",
    youtubeDescription: "Daily Vanciety van briefing. Add verified source links before publishing.",
  },
  videoPrompt: "Create a 45-60 second vertical van-life news video for Vanciety using a dark topo contour background and clean captions.",
  emailListCTA: {
    headline: "Get the daily van briefing",
    copy: "Join the Vanciety list for van events, gear research, build ideas, product drops, and member meetup updates.",
    status: "Email provider not connected yet.",
  },
  merchDropIdea: {
    theme: "Topo Roads Limited Drop",
    productIdeas: ["Topo contour tee", "Adventure van hoodie", "Camp mug"],
    releaseCadence: "Monthly core drop plus limited holiday editions.",
    fulfillment: "Connect Printful, Printify, Fourthwall, Shopify + Gelato, or another print-on-demand provider.",
  },
};

const badgeClass = (badge: string) => {
  switch (badge) {
    case "OFFICIAL":
      return "bg-blue-600 text-white";
    case "NEWS_SEARCH":
      return "bg-emerald-600 text-white";
    case "EVENT_SEARCH":
      return "bg-purple-600 text-white";
    case "GEAR_SEARCH":
      return "bg-orange-500 text-black";
    case "INDUSTRY_RSS":
      return "bg-cyan-700 text-white";
    default:
      return "bg-slate-600 text-white";
  }
};

const formatDate = (value: string | null) => {
  if (!value) return "Open source";
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));
  } catch {
    return "Recent";
  }
};

const copyToClipboard = async (label: string, text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Clipboard may be blocked on non-secure origins; select/copy from the visible text instead.
  }
  return label;
};

const DailyVanBriefing = () => {
  const [digest, setDigest] = useState<VanNewsDigest>(fallbackDigest);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`/data/van-news-digest.json?ts=${Date.now()}`)
      .then((response) => (response.ok ? response.json() : fallbackDigest))
      .then((data: VanNewsDigest) => {
        if (isMounted) setDigest(data);
      })
      .catch(() => {
        if (isMounted) setDigest(fallbackDigest);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const generatedLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(digest.generatedAt));
    } catch {
      return "Today";
    }
  }, [digest.generatedAt]);

  const primaryItems = digest.items.slice(0, 5);
  const secondaryItems = digest.items.slice(5, 9);

  const handleCopy = async (label: string, text: string) => {
    await copyToClipboard(label, text);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="vanciety-topo-panel relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_32%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)/0.28))]" />
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(120deg, currentColor 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
      <div className="container relative mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-3 bg-primary text-primary-foreground">
              <Sparkles className="mr-1 h-3 w-3" /> Daily van intelligence
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{digest.title}</h2>
            <p className="mt-3 text-muted-foreground sm:text-lg">{digest.subtitle}</p>
            <p className="mt-2 text-xs text-muted-foreground">Updated {generatedLabel}. {digest.sourcePolicy}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/van-intelligence">
                Open Van Intelligence <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/news">Events & news</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.45fr_0.9fr]">
          <Card className="border-border/70 bg-card/85 shadow-card backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" /> Today’s briefing
              </CardTitle>
              <CardDescription>{loading ? "Loading latest briefing…" : digest.topStory}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {primaryItems.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl border border-border bg-background/75 p-4 transition hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge className={badgeClass(item.badge)}>{item.badge.replace(/_/g, " ")}</Badge>
                    <span className="text-xs text-muted-foreground">{item.source}</span>
                    <span className="text-xs text-muted-foreground">• {formatDate(item.publishedAt)}</span>
                  </div>
                  <h3 className="font-semibold leading-snug group-hover:text-primary">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Open source <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-border/70 bg-card/85 shadow-card backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" /> Social + video packet
                </CardTitle>
                <CardDescription>Copy-ready starting points for your groups, X, YouTube, email, and AI video generator.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline" onClick={() => handleCopy("Facebook", digest.socialCopy.facebook)}>
                  Copy Facebook group post
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => handleCopy("X", digest.socialCopy.x)}>
                  Copy X post
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => handleCopy("Video prompt", digest.videoPrompt)}>
                  <PlayCircle className="mr-2 h-4 w-4" /> Copy AI video prompt
                </Button>
                {copied && <p className="text-xs text-primary">Copied {copied} to clipboard.</p>}
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/85 shadow-card backdrop-blur">
              <CardHeader>
                <CardTitle>Gear picks for this week</CardTitle>
                <CardDescription>Curated van life gear matched to today's news and conditions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {digest.affiliateOpportunities.slice(0, 4).map((item) => (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-border bg-background/70 p-3 hover:border-primary/50">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.angle}</p>
                      </div>
                      <Badge variant="outline">Gear</Badge>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Card className="border-border/70 bg-card/85 shadow-card backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" /> {digest.emailListCTA.headline}
              </CardTitle>
              <CardDescription>{digest.emailListCTA.copy}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className="min-h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Vanciety briefing signup opens soon"
                  disabled
                />
                <Button disabled>Join list</Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{digest.emailListCTA.status}</p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/85 shadow-card backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shirt className="h-5 w-5 text-primary" /> {digest.merchDropIdea.theme}
              </CardTitle>
              <CardDescription>{digest.merchDropIdea.releaseCadence}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex flex-wrap gap-2">
                {digest.merchDropIdea.productIdeas.map((idea) => (
                  <Badge key={idea} variant="secondary">{idea}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Monthly drops — clothing, gear, and accessories for the van life community.</p>
            </CardContent>
          </Card>
        </div>

        {secondaryItems.length > 0 && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {secondaryItems.map((item) => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card/70 p-3 text-sm hover:border-primary/50">
                <Badge className={badgeClass(item.badge)}>{item.category}</Badge>
                <p className="mt-2 font-medium leading-snug">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.source}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DailyVanBriefing;
