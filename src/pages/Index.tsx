import { Link } from "react-router-dom";
import HomeFeed from "@/components/HomeFeed";
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

const LIME = "text-lime-500";

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

// ── Stats — honest, verifiable numbers ─────────────────────────
const STATS: { icon: LucideIcon; value: string; label: string; sub: string }[] = [
  { icon: ShoppingBag, value: "Parts & Gear", label: "Marketplace", sub: "Browse community listings" },
  { icon: Building2, value: "Builders", label: "Vendors & Shops", sub: "Verified van professionals" },
  { icon: Calendar, value: "Events", label: "Meetups & Rallies", sub: "Find gatherings near you" },
  { icon: Users, value: "Community", label: "Forum & Members", sub: "Real van lifers helping each other" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="pt-16">

        {/* ════════ HERO ════════ */}
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/sprinter-red-rocks-arch.png)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent" />
          </div>
          <TopoBackground />

          <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
            <div className="mb-6">
              <Badge className="border border-lime-500/30 bg-lime-500/10 text-lime-300 hover:bg-lime-500/10">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Van Life, All in One Place
              </Badge>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Everything you need
                <br />
                <span className={LIME}>for van life, in one place.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
                Find repair guides, trusted builders, gear, events, and a community of real van lifers
                — all powered by Vana, your personal AI van assistant.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-lime-500 font-semibold text-gray-950 hover:bg-lime-400">
                  <Link to="/auth">
                    Join Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
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
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-lime-500/40 hover:bg-lime-500/10"
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
        <section className="bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge className="mb-4 border border-lime-500/30 bg-lime-500/10 text-lime-300">
                  <Bot className="mr-1.5 h-3.5 w-3.5" />
                  Powered by AI
                </Badge>
                <h2 className="text-3xl font-black sm:text-4xl">
                  Meet Vana — your personal
                  <br />
                  <span className={LIME}>van life assistant.</span>
                </h2>
                <p className="mt-4 text-gray-300 text-lg leading-relaxed">
                  Ask Vana anything — repair questions, gear recommendations, route planning,
                  or finding the right builder for your build. Vana gives you a direct answer,
                  not a list of links to dig through.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="bg-lime-500 font-semibold text-gray-950 hover:bg-lime-400">
                    <Link to="/ai">
                      Ask Vana Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                    <Link to="/van-intelligence">Open Repair Guides</Link>
                  </Button>
                </div>
              </div>

              {/* Sample prompts */}
              <div className="rounded-2xl border border-white/10 bg-gray-950 p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-lime-400 mb-4">
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
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition hover:border-lime-500/40 hover:bg-lime-500/10"
                    >
                      <Sparkles className="h-4 w-4 shrink-0 text-lime-400" />
                      {prompt}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ FEATURES GRID ════════ */}
        <section className="bg-gray-950 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black sm:text-4xl">
                Everything van life,
                <span className={` ${LIME}`}> all in one place.</span>
              </h2>
              <p className="mt-3 text-gray-400 max-w-xl mx-auto">
                Whether you're planning your first build or living full-time on the road,
                Vanciety has the tools and community to support every step.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, desc, to }) => (
                <Link
                  key={title}
                  to={to}
                  className="group rounded-2xl border border-white/10 bg-gray-900 p-5 transition hover:border-lime-500/40 hover:bg-lime-500/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/15 text-lime-400 mb-4 group-hover:bg-lime-500/25 transition">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="font-bold text-white text-sm">{title}</p>
                  <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ HOW IT WORKS ════════ */}
        <section className="relative isolate overflow-hidden py-16 text-gray-900">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/vans-driveway-meetup.jpg)" }}
          />
          <div className="absolute inset-0 bg-white/85" />
          <div className="relative z-10 container mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-10">How It Works</h2>
            <div className="flex flex-col gap-4 md:flex-row md:items-stretch max-w-4xl mx-auto">
              {HOW_IT_WORKS.map(({ n, title, desc, icon: Icon }, idx) => (
                <div key={title} className="flex items-center gap-4 md:flex-1 md:flex-col md:items-start">
                  <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-5 w-full">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-500 text-sm font-black text-gray-950">
                        {n}
                      </span>
                      <Icon className="h-5 w-5 text-lime-600" />
                    </div>
                    <p className="mt-3 text-sm font-black uppercase tracking-wide">{title}</p>
                    <p className="mt-1 text-sm text-gray-600">{desc}</p>
                  </div>
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <ArrowRight className="hidden h-6 w-6 shrink-0 self-center text-lime-500 md:block" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild size="lg" className="bg-lime-500 font-semibold text-gray-950 hover:bg-lime-400">
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ════════ ECOSYSTEM + STATS ════════ */}
        <section className="bg-gray-900 py-16">
          <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-3">
            {/* Ecosystem */}
            <div className="rounded-2xl border border-white/10 bg-gray-950 p-6">
              <h3 className="text-xl font-black">
                Everything in One <span className={LIME}>Ecosystem</span>
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {ECOSYSTEM.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
                    <Icon className="h-4 w-4 shrink-0 text-lime-400" />
                    <span className="text-xs font-medium text-gray-200">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border border-white/10 bg-gray-950 p-6 lg:col-span-2">
              <h3 className="text-xl font-black">
                What's <span className={LIME}>Inside</span>
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STATS.map(({ icon: Icon, value, label, sub }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <Icon className={`mx-auto mb-2 h-5 w-5 ${LIME}`} />
                    <p className="text-sm font-black text-white">{value}</p>
                    <p className="text-xs font-semibold text-gray-300 mt-0.5">{label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-lime-500/20 bg-lime-500/5 p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-white">Ready to join the community?</p>
                  <p className="text-sm text-gray-400 mt-0.5">Free to join. No credit card required.</p>
                </div>
                <Button asChild className="shrink-0 bg-lime-500 font-semibold text-gray-950 hover:bg-lime-400">
                  <Link to="/auth">Join Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ LIVE CONTENT FEED ════════ */}
        <HomeFeed />

      </main>
    </div>
  );
};

export default Index;
