/**
 * Index.tsx — Vanciety Home Page
 * Design: Rugged Overland / Topo Map — Aged Brass primary, Charcoal base
 * Replaced all lime-500/green with primary (brass) tokens
 */

import { Link } from "react-router-dom";
import HomeFeed from "@/components/HomeFeed";
import VannaBubble from "@/components/VannaBubble";
import type { LucideIcon } from "lucide-react";
import {
  Bot, Calendar, Wrench, Users,
  Video, ShoppingBag, Building2, Cpu, MapPin,
  MessageSquare, Map as MapIcon, ArrowRight,
  UserPlus, Compass, Mountain, Sparkles,
  Tent, Image as ImageIcon,
} from "lucide-react";
import Header from "@/components/Header";
import TopoBackground from "@/components/TopoBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Customer-facing feature cards ──────────────────────────────
const FEATURES: { icon: LucideIcon; title: string; desc: string; to: string }[] = [
  {
    icon: Bot,
    title: "Ask Vana — Your AI Van Assistant",
    desc: "Get instant answers about repairs, builds, gear, and routes. Vana knows vans.",
    to: "/ai",
  },
  {
    icon: Wrench,
    title: "Van Intelligence Repair Guides",
    desc: "Step-by-step repair guides with videos, tools lists, and expert tips for every common issue.",
    to: "/van-intelligence",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    desc: "Buy and sell vans, parts, and gear directly with the Vanciety community.",
    to: "/marketplace",
  },
  {
    icon: Calendar,
    title: "Events & Meetups",
    desc: "Find van life rallies, workshops, and gatherings near you on an interactive map.",
    to: "/events",
  },
  {
    icon: Video,
    title: "How-To Videos",
    desc: "Watch real van build and maintenance videos curated from the best creators.",
    to: "/videos",
  },
  {
    icon: Users,
    title: "Community Forum",
    desc: "Ask questions, share your build, and get advice from thousands of real van lifers.",
    to: "/forum",
  },
  {
    icon: Building2,
    title: "Find Builders & Vendors",
    desc: "Locate trusted van builders, upfitters, and parts suppliers across the country.",
    to: "/vendors",
  },
  {
    icon: MapIcon,
    title: "Friend Finder",
    desc: "Connect with van lifers near you for meetups, help on the road, and local tips.",
    to: "/friend-finder",
  },
];

// ── How it works ────────────────────────────────────────────────
const HOW_IT_WORKS: { n: number; title: string; desc: string; icon: LucideIcon }[] = [
  { n: 1, title: "Join Free", desc: "Create your account in seconds — no credit card needed.", icon: UserPlus },
  { n: 2, title: "Discover", desc: "Search products, repair guides, events, videos, and local experts.", icon: Compass },
  { n: 3, title: "Connect", desc: "Join the community, ask questions, and share your build.", icon: Users },
  { n: 4, title: "Adventure", desc: "Make confident decisions, upgrade your van, and explore more.", icon: Mountain },
];

// ── Ecosystem tiles ─────────────────────────────────────────────
const ECOSYSTEM: { icon: LucideIcon; label: string }[] = [
  { icon: ShoppingBag, label: "Parts & Gear" },
  { icon: Building2, label: "Van Builders" },
  { icon: Calendar, label: "Events & Meetups" },
  { icon: Video, label: "How-To Videos" },
  { icon: ImageIcon, label: "Van Builds Gallery" },
  { icon: Wrench, label: "Repair Guides" },
  { icon: Cpu, label: "AI Assistant" },
  { icon: MapIcon, label: "Trip Planning" },
  { icon: MessageSquare, label: "Community Forum" },
  { icon: MapPin, label: "Friend Finder" },
];

// ── Stats ───────────────────────────────────────────────────────
const STATS: { icon: LucideIcon; value: string; label: string; sub: string }[] = [
  { icon: ShoppingBag, value: "Parts & Gear", label: "Marketplace", sub: "Browse community listings" },
  { icon: Building2, value: "Builders", label: "Vendors & Shops", sub: "Verified van professionals" },
  { icon: Calendar, value: "Events", label: "Meetups & Rallies", sub: "Find gatherings near you" },
  { icon: Users, value: "Community", label: "Forum & Members", sub: "Real van lifers helping each other" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-16">

        {/* ════════ HERO ════════ */}
        <section
          className="relative isolate overflow-hidden border-b border-white/10 vanciety-hero-topo"
          data-topo-container
        >
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/sprinter-red-rocks-arch.png)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/30" />
          </div>
          <TopoBackground className="z-[1]" intensity="medium" />

          <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
            <div className="mb-6">
              <Badge className="border border-primary/40 bg-primary/10 text-amber-300 hover:bg-primary/15">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Van Life, All in One Place
              </Badge>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl text-white">
                Everything you need
                <br />
                <span className="text-amber-400">for van life, in one place.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
                Find repair guides, trusted builders, gear, events, and a community of real van lifers
                — all powered by Vana, your personal AI van assistant.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-primary font-semibold text-primary-foreground hover:bg-amber-500">
                  <Link to="/auth">
                    Join Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/8 text-white hover:bg-white/12">
                  <Link to="/ai">Ask Vana</Link>
                </Button>
              </div>

              {/* Quick-access cards */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Repair Guides", desc: "Step-by-step help for the most common van issues.", to: "/van-intelligence" },
                  { title: "Events Near You", desc: "Rallies, meetups, and workshops on an interactive map.", to: "/events" },
                  { title: "Community", desc: "Ask questions and get answers from real van lifers.", to: "/forum" },
                ].map((item) => (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="rounded-xl border border-white/12 bg-white/6 p-4 transition hover:border-primary/50 hover:bg-primary/10"
                  >
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-300">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════ VANA AI HIGHLIGHT ════════ */}
        <section className="bg-card py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge className="mb-4 border border-primary/30 bg-primary/10 text-amber-300">
                  <Bot className="mr-1.5 h-3.5 w-3.5" />
                  Powered by AI
                </Badge>
                <h2 className="text-3xl font-black sm:text-4xl text-foreground">
                  Meet Vana — your personal
                  <br />
                  <span className="text-primary">van life assistant.</span>
                </h2>
                <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                  Ask Vana anything — repair questions, gear recommendations, route planning,
                  or finding the right builder for your build. Vana gives you a direct answer,
                  not a list of links to dig through.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="bg-primary font-semibold text-primary-foreground hover:bg-amber-500">
                    <Link to="/ai">
                      Ask Vana Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
                    <Link to="/van-intelligence">Open Repair Guides</Link>
                  </Button>
                </div>
              </div>

              {/* Sample prompts */}
              <div className="rounded-xl border border-border bg-background p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                  Try asking Vana:
                </p>
                <div className="space-y-3">
                  {[
                    "My Sprinter is throwing a P0401 code — what do I do?",
                    "What solar setup do I need for full-time living?",
                    "Find me van life events in the Pacific Northwest",
                    "Best budget insulation for a Transit build?",
                    "Who builds Sprinters in Colorado?",
                  ].map((prompt) => (
                    <Link
                      key={prompt}
                      to={`/ai?q=${encodeURIComponent(prompt)}`}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-foreground transition hover:border-primary/50 hover:bg-primary/8"
                    >
                      <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                      {prompt}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ FEATURES GRID ════════ */}
        <section className="bg-background py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black sm:text-4xl text-foreground">
                Everything van life,
                <span className="text-primary"> all in one place.</span>
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Whether you're planning your first build or living full-time on the road,
                Vanciety has the tools and community to support every step.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, desc, to }) => (
                <Link
                  key={title}
                  to={to}
                  className="group rounded-xl border border-border bg-card p-5 transition hover:border-primary/50 hover:bg-primary/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary mb-4 group-hover:bg-primary/25 transition">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="font-bold text-foreground text-sm">{title}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ HOW IT WORKS ════════ */}
        <section className="relative isolate overflow-hidden py-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/vans-driveway-meetup.jpg)" }}
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative z-10 container mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-10 text-white">How It Works</h2>
            <div className="flex flex-col gap-4 md:flex-row md:items-stretch max-w-4xl mx-auto">
              {HOW_IT_WORKS.map(({ n, title, desc, icon: Icon }, idx) => (
                <div key={title} className="flex items-center gap-4 md:flex-1 md:flex-col md:items-start">
                  <div className="flex-1 rounded-xl border border-white/15 bg-black/40 backdrop-blur-sm p-5 w-full">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                        {n}
                      </span>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-3 text-sm font-black uppercase tracking-wide text-white">{title}</p>
                    <p className="mt-1 text-sm text-gray-300">{desc}</p>
                  </div>
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <ArrowRight className="hidden h-6 w-6 shrink-0 self-center text-primary md:block" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild size="lg" className="bg-primary font-semibold text-primary-foreground hover:bg-amber-500">
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ════════ ECOSYSTEM + STATS ════════ */}
        <section className="bg-card py-16 border-b border-border">
          <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-3">
            {/* Ecosystem */}
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-xl font-black text-foreground">
                Everything in One <span className="text-primary">Ecosystem</span>
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {ECOSYSTEM.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-xs font-medium text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-border bg-background p-6 lg:col-span-2">
              <h3 className="text-xl font-black text-foreground">
                What's <span className="text-primary">Inside</span>
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STATS.map(({ icon: Icon, value, label, sub }) => (
                  <div key={label} className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                    <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                    <p className="text-sm font-black text-foreground">{value}</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-0.5">{label}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-tight">{sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-primary/25 bg-primary/8 p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-foreground">Ready to join the community?</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Free to join. No credit card required.</p>
                </div>
                <Button asChild className="shrink-0 bg-primary font-semibold text-primary-foreground hover:bg-amber-500">
                  <Link to="/auth">Join Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ LIVE CONTENT FEED ════════ */}
        <HomeFeed />

      </main>

      {/* Vanna — floating AI assistant, home page only */}
      <VannaBubble />
    </div>
  );
};

export default Index;
