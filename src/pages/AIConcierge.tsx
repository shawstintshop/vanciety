import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bot, Calendar, MapPin, Search, Sparkles, Video, Wrench, Users } from "lucide-react";

const SUGGESTED_PATHS = [
  {
    title: "2022 Sprinter V6 diesel EGR valve cleaning",
    description: "Jump to the repair guide path with tools, videos, docs, and next actions.",
    to: "/van-intelligence?guide=egr-v6-diesel",
    keywords: ["egr", "sprinter", "diesel", "repair", "om642", "vs30"],
    icon: Wrench,
  },
  {
    title: "Find vendors and installers near me",
    description: "Open the vendor directory for builders, parts suppliers, and local specialists.",
    to: "/vendors",
    keywords: ["vendor", "installer", "builder", "shop", "mechanic", "solar"],
    icon: MapPin,
  },
  {
    title: "Watch real van build and repair videos",
    description: "Go to the verified video library with live/fallback YouTube content.",
    to: "/videos",
    keywords: ["video", "youtube", "watch", "install", "repair video"],
    icon: Video,
  },
  {
    title: "Find van events and meetups",
    description: "Browse rallies, expos, meetups, and workshops through the events route.",
    to: "/events",
    keywords: ["event", "meetup", "rally", "expo", "campout"],
    icon: Calendar,
  },
  {
    title: "Ask the community",
    description: "Open the forum to ask questions, share fixes, and get build feedback.",
    to: "/forum",
    keywords: ["forum", "community", "question", "discussion", "help"],
    icon: Users,
  },
];

const AIConcierge = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const bestMatch = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return null;

    return (
      SUGGESTED_PATHS.find((path) =>
        path.keywords.some((keyword) => normalized.includes(keyword)) ||
        path.title.toLowerCase().includes(normalized)
      ) ?? null
    );
  }, [query]);

  const handleRoute = () => {
    if (bestMatch) {
      navigate(bestMatch.to);
      return;
    }

    const normalized = query.trim();
    if (!normalized) return;
    navigate(`/van-intelligence?topic=${encodeURIComponent(normalized)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <PageHero
          heroImage="https://files.manuscdn.com/user_upload_by_module/session_file/94256494/dwkoSqnsLaqyoryO.jpg"
          label="Vana AI"
          title="Ask Vana First"
          subtitle="Vana routes you to the exact guide, vendor, video, event, or community path you need instead of making you hunt through every page."
          icon={Bot}
        >
          <Card className="max-w-3xl border-primary/20 shadow-glow">
            <CardContent className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try: 2022 Sprinter V6 diesel EGR cleaning"
                    className="pl-10 bg-background/60 border-border/60"
                  />
                </div>
                <Button variant="hero" onClick={handleRoute} className="sm:min-w-44">
                  Route Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {bestMatch ? (
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Best route</p>
                  <p className="mt-2 font-semibold">{bestMatch.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{bestMatch.description}</p>
                </div>
              ) : query.trim() ? (
                <div className="mt-4 rounded-2xl border bg-card p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Fallback route</p>
                  <p className="mt-2 font-semibold">Search Van Intelligence for "{query.trim()}"</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    If there is not a direct lane yet, Vana sends the topic into the guide/research path first.
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </PageHero>

        <section className="pb-14">
          <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="grid gap-4 md:grid-cols-2">
              {SUGGESTED_PATHS.map(({ title, description, to, icon: Icon }) => (
                <button
                  key={title}
                  onClick={() => navigate(to)}
                  className="rounded-2xl border bg-card p-5 text-left transition hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Want deeper concierge features?
                </CardTitle>
                <CardDescription>
                  Join the early-access list for saved research pages, member memory, and more personalized Vana help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NewsletterSignup
                  variant="inline"
                  defaultInterest={["member", "general"]}
                  sourcePage="ai-concierge"
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AIConcierge;
