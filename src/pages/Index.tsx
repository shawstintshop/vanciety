import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Check, Bot, Search, Calendar, Wrench, User, Users, Globe, Megaphone,
  BarChart3, ShoppingBag, Building2, Video, Star, ArrowRight, UserPlus,
  Compass, Mountain, Tent, Truck, Caravan, TreePine, Crown, Ticket,
  Link2, Sparkles, Cpu, Send, MessageSquare, Image as ImageIcon,
  Map as MapIcon, DollarSign,
} from "lucide-react";
import Header from "@/components/Header";
import TopoBackground from "@/components/TopoBackground";
import VancietyLogo from "@/components/VancietyLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-van-lake.jpg";

const LIME = "text-lime-500";

// ── Routes (wired to the app's real routes; /products & /companies don't exist) ──
const R = {
  products: "/marketplace",
  companies: "/manufacturers",
  events: "/events",
  videos: "/videos",
  map: "/map",
  mechanics: "/vendors",
  auth: "/auth",
};

const HERO_CHECKLIST = [
  "For Van Owners",
  "For Vendors & Manufacturers",
  "For Event Organizers",
  "For Installers & Mechanics",
  "For the Entire Van Community",
];

const OWNER_FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Bot, title: "AI Van Assistant", desc: "Get personalized recommendations, answers, and help 24/7" },
  { icon: Search, title: "Product Discovery", desc: "Search, compare, read reviews, watch install videos" },
  { icon: Calendar, title: "Events Near You", desc: "Find van events, meetups, and rallies near you" },
  { icon: Wrench, title: "Find Experts", desc: "Locate trusted mechanics, installers, and shops" },
  { icon: User, title: "Build Your Profile", desc: "Track your van, mods, trips, favorites and wishlists" },
  { icon: Users, title: "Community", desc: "Connect, share builds, get advice from real van lifers" },
];

const VENDOR_FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Globe, title: "Instant Website", desc: "Get a beautiful, SEO optimized website instantly" },
  { icon: Megaphone, title: "AI Marketing Agent", desc: "AI creates content, blogs, social posts, emails and ads for you" },
  { icon: Bot, title: "AI Sales Agent", desc: "Answers customer questions, recommends products, 24/7" },
  { icon: Users, title: "Lead Management", desc: "Capture, manage and convert more leads in one place" },
  { icon: BarChart3, title: "Analytics & Insights", desc: "See what's working with real-time data and AI recommendations" },
  { icon: Calendar, title: "Event Promotion", desc: "Promote sales, launches, and events automatically" },
];

const APP_TABS: { label: string; sub: string; to: string; icon: LucideIcon }[] = [
  { label: "Products", sub: "Browse 10,000+", to: R.products, icon: ShoppingBag },
  { label: "Companies", sub: "Find the best", to: R.companies, icon: Building2 },
  { label: "Events", sub: "Near You", to: R.events, icon: Calendar },
  { label: "Videos", sub: "Watch & Learn", to: R.videos, icon: Video },
  { label: "Mechanics", sub: "Find Experts", to: R.mechanics, icon: Wrench },
];

const PRODUCTS = [
  { name: "Victron Multiplus II", price: "$1,299.00", reviews: 128 },
  { name: "Roam Adventure Co. Roof Top Tent", price: "$1,895.00", reviews: 86 },
  { name: "Method 701 Wheels", price: "$299.00", reviews: 74 },
  { name: "Agile Off Road Rear Bumper", price: "$1,045.00", reviews: 53 },
];

const EVENTS = [
  { name: "Overland Expo West", loc: "Costa Mesa, CA", date: "May 13-19, 2024" },
  { name: "Van Life Campout", loc: "Joshua Tree, CA", date: "May 24-26, 2024" },
  { name: "Pacific Northwest Van Meet", loc: "Bend, OR", date: "June 7-9, 2024" },
];

const HOW_IT_WORKS: { n: number; title: string; desc: string; icon: LucideIcon }[] = [
  { n: 1, title: "JOIN VANCIETY", desc: "Create your free account in seconds", icon: UserPlus },
  { n: 2, title: "DISCOVER", desc: "Find products, companies, events, videos and expert help", icon: Compass },
  { n: 3, title: "CONNECT", desc: "Engage with the community, ask questions, share and learn", icon: Users },
  { n: 4, title: "BUILD & ADVENTURE", desc: "Make informed decisions, upgrade your van, explore more", icon: Mountain },
];

const COMPANIES = [
  { name: "ROAM ADVENTURE CO.", url: "roamadventureco.vanciety.com", tags: "Roof Top Tents | Awnings | Gear", cta: false },
  { name: "Victron Energy", url: "victronenergy.vanciety.com", tags: "Power Systems | Batteries | Solar", cta: false },
  { name: "AGILE OFF ROAD", url: "agileoffroad.vanciety.com", tags: "Bumpers | Racks | Accessories", cta: false },
  { name: "METHOD RACE WHEELS", url: "methodracewheels.vanciety.com", tags: "Wheels | Beadlock | Accessories", cta: false },
  { name: "YOUR COMPANY", url: "yourcompany.vanciety.com", tags: "Your Brand. Your Products. Powered by VanCiety.", cta: true },
];

const ECOSYSTEM: { icon: LucideIcon; label: string }[] = [
  { icon: ShoppingBag, label: "Products & Reviews" },
  { icon: Building2, label: "Company Directories" },
  { icon: Calendar, label: "Events & Meetups" },
  { icon: Video, label: "YouTube Videos" },
  { icon: ImageIcon, label: "Van Builds Gallery" },
  { icon: Wrench, label: "Mechanics & Installers" },
  { icon: Cpu, label: "AI Knowledge Base" },
  { icon: MapIcon, label: "Trip Planning Tools" },
  { icon: MessageSquare, label: "Community Forums" },
  { icon: ShoppingBag, label: "Marketplace" },
];

const REVENUE: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Crown, title: "Vendor Subscriptions", desc: "Monthly plans with unlimited features" },
  { icon: DollarSign, title: "Marketplace Fees", desc: "2-5% on transactions" },
  { icon: Star, title: "Featured Listings & Ads", desc: "Premium placement in search & categories" },
  { icon: Ticket, title: "Event Ticket & Booth Fees", desc: "Sell tickets, booths and sponsorships" },
  { icon: Link2, title: "Affiliate Partnerships", desc: "Earn from products, insurance, memberships" },
  { icon: Sparkles, title: "Premium User Memberships", desc: "Advanced tools, AI assistant, trip planning" },
];

const PHASES: { icon: LucideIcon; label: string; phase: string }[] = [
  { icon: Caravan, label: "VAN LIFE", phase: "Phase 1" },
  { icon: Compass, label: "OVERLANDING", phase: "Phase 2" },
  { icon: Truck, label: "RV LIFE", phase: "Phase 3" },
  { icon: Tent, label: "CAMPING", phase: "Phase 4" },
  { icon: Mountain, label: "HIKING", phase: "Phase 5" },
  { icon: TreePine, label: "OUTDOOR LIFE", phase: "And Beyond" },
];

const STATS: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Tent, value: "10,000+", label: "Products" },
  { icon: Building2, value: "1,000+", label: "Companies" },
  { icon: Calendar, value: "500+", label: "Events/Year" },
  { icon: Users, value: "100,000+", label: "Community Members" },
];

const Stars = () => (
  <div className="flex items-center gap-0.5">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="pt-16">
        {/* ════════ SECTION 1 — HERO ════════ */}
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt="Van in the mountains" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gray-950/85" />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/80 to-gray-950" />
          </div>
          <TopoBackground className="z-0" opacity={0.18} />

          <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
            {/* Top row: brand lockup + audience checklist */}
            <div className="mb-12 flex flex-col items-start justify-between gap-8 lg:flex-row">
              <VancietyLogo size="lg" />

              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {HERO_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-200">
                    <Check className={`h-4 w-4 shrink-0 ${LIME}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Headline + body */}
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                One Platform. Every Van.
                <br />
                <span className={LIME}>Every Product. Every Adventure.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
                VanCiety is the #1 hub for everything van life. Research products, find companies,
                discover events, meet people, find trusted mechanics, watch videos and get AI-powered
                answers &ndash; all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-lime-500 font-semibold text-gray-950 hover:bg-lime-400">
                  <Link to={R.auth}>
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Link to={R.products}>Explore the Platform</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ SECTION 2 — THREE-COLUMN LAYOUT ════════ */}
        <section className="bg-gray-950 py-16">
          <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-12">
            {/* LEFT — For Van Owners */}
            <div className="lg:col-span-3">
              <div className="h-full rounded-2xl bg-gray-100 p-6 text-gray-900">
                <Badge className="mb-4 bg-lime-500 text-gray-950 hover:bg-lime-500">For Van Owners</Badge>
                <ul className="space-y-5">
                  {OWNER_FEATURES.map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-500/15 text-lime-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-gray-600">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CENTER — App UI mockup */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/40">
                {/* App header */}
                <div className="border-b border-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-lg font-black tracking-tight">
                      VAN<span className={LIME}>CIETY</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="truncate text-xs text-gray-400">
                        Search products, companies, events, videos...
                      </span>
                    </div>
                  </div>

                  {/* Nav tabs */}
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {APP_TABS.map(({ label, sub, to, icon: Icon }) => (
                      <Link
                        key={label}
                        to={to}
                        className="flex shrink-0 flex-col rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:border-lime-500/50 hover:bg-lime-500/10"
                      >
                        <span className="flex items-center gap-1.5 text-xs font-semibold">
                          <Icon className="h-3.5 w-3.5 text-lime-400" />
                          {label}
                        </span>
                        <span className="text-[10px] text-gray-400">{sub}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* App body */}
                <div className="p-5">
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${LIME}`}>
                    Explore. Build. Adventure.
                  </p>
                  <h3 className="mt-1 text-2xl font-black">The #1 Van Life Hub</h3>

                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Search for products, companies, events...</span>
                  </div>

                  {/* Recommended For You */}
                  <div className="mt-6 flex items-center justify-between">
                    <h4 className="font-bold">Recommended For You</h4>
                    <Link to={R.products} className={`text-xs font-semibold ${LIME} hover:underline`}>
                      View All
                    </Link>
                  </div>
                  <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                    {PRODUCTS.map((p) => (
                      <Link
                        key={p.name}
                        to={R.products}
                        className="flex w-40 shrink-0 flex-col rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-lime-500/40"
                      >
                        <div className="mb-2 flex h-20 items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-800">
                          <ShoppingBag className="h-7 w-7 text-gray-500" />
                        </div>
                        <p className="line-clamp-2 text-xs font-semibold">{p.name}</p>
                        <p className={`mt-1 text-sm font-bold ${LIME}`}>{p.price}</p>
                        <div className="mt-1 flex items-center gap-1">
                          <Stars />
                          <span className="text-[10px] text-gray-400">({p.reviews})</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Upcoming Events */}
                  <div className="mt-6 flex items-center justify-between">
                    <h4 className="font-bold">Upcoming Events Near You</h4>
                    <Link to={R.events} className={`text-xs font-semibold ${LIME} hover:underline`}>
                      View All
                    </Link>
                  </div>
                  <div className="mt-3 space-y-2">
                    {EVENTS.map((e) => (
                      <Link
                        key={e.name}
                        to={R.events}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-lime-500/40"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lime-500/15 text-lime-400">
                          <Calendar className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{e.name}</p>
                          <p className="text-xs text-gray-400">{e.loc}</p>
                        </div>
                        <span className="shrink-0 text-xs text-gray-400">{e.date}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — For Vendors & Companies */}
            <div className="lg:col-span-3">
              <div className="h-full rounded-2xl bg-gray-100 p-6 text-gray-900">
                <Badge className="mb-4 bg-gray-900 text-white hover:bg-gray-900">For Vendors &amp; Companies</Badge>
                <ul className="space-y-5">
                  {VENDOR_FEATURES.map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-900/10 text-gray-900">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-gray-600">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ SECTION 3 — HOW IT WORKS ════════ */}
        <section className="bg-white py-16 text-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-12">
              {/* Steps */}
              <div className="lg:col-span-7">
                <h2 className="text-3xl font-black">How It Works</h2>
                <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-stretch">
                  {HOW_IT_WORKS.map(({ n, title, desc, icon: Icon }, idx) => (
                    <div key={title} className="flex items-center gap-4 md:flex-1 md:flex-col md:items-start">
                      <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-5">
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
              </div>

              {/* AI Powered Everything card */}
              <div className="lg:col-span-5">
                <div className="h-full rounded-2xl bg-gray-900 p-6 text-white">
                  <span className="inline-flex items-center gap-2 rounded-full bg-lime-500/15 px-3 py-1 text-xs font-semibold text-lime-400">
                    <Cpu className="h-4 w-4" />
                    AI Powered Everything
                  </span>
                  <p className="mt-4 text-gray-300">
                    AI understands your van, your style, and your goals to deliver smarter
                    recommendations, automate marketing, answer questions and save time.
                  </p>

                  {/* Floating chat mockup */}
                  <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-gray-950/60 p-4">
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-lime-500 px-4 py-2 text-sm font-medium text-gray-950">
                        What's the best battery for my 2020 Sprinter?
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-500/15 text-lime-400">
                        <Bot className="h-4 w-4" />
                      </span>
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
                        <span className="flex items-center gap-1 text-lime-400">
                          <Sparkles className="h-3.5 w-3.5" /> Vanny is typing
                          <span className="ml-1 inline-flex gap-0.5">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                      <input
                        type="text"
                        readOnly
                        placeholder="Ask Vanny anything..."
                        className="min-w-0 flex-1 bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-500"
                      />
                      <Send className="h-4 w-4 text-lime-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ SECTION 4 — EVERY COMPANY GETS A WEBSITE ════════ */}
        <section className="bg-gray-950 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-black sm:text-4xl">
              Every Company Gets Their Own <span className={LIME}>Powerful Website</span>
            </h2>
            <p className="mt-3 text-gray-400">Built in minutes. Managed by AI. Always up to date.</p>

            <div className="mt-10 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
              {COMPANIES.map((c) => (
                <Card
                  key={c.name}
                  className={`border ${
                    c.cta
                      ? "border-lime-500 bg-lime-500/10"
                      : "border-white/10 bg-gray-900"
                  } text-white`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          c.cta ? "bg-lime-500 text-gray-950" : "bg-white/10 text-lime-400"
                        }`}
                      >
                        <Building2 className="h-5 w-5" />
                      </span>
                      <p className="font-black">{c.name}</p>
                    </div>
                    <p className={`mt-3 text-sm font-medium ${LIME}`}>{c.url}</p>
                    <p className="mt-1 text-sm text-gray-400">{c.tags}</p>
                    {c.cta ? (
                      <Button asChild className="mt-4 w-full bg-lime-500 font-semibold text-gray-950 hover:bg-lime-400">
                        <Link to={R.auth}>Claim Your Website</Link>
                      </Button>
                    ) : (
                      <Link
                        to={R.companies}
                        className="mt-4 inline-flex items-center text-sm font-semibold text-lime-400 hover:underline"
                      >
                        Visit site <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ SECTION 5 — THREE-COLUMN BOTTOM ════════ */}
        <section className="bg-gray-900 py-16">
          <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-3">
            {/* LEFT — Everything in one ecosystem */}
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

            {/* CENTER — Revenue streams */}
            <div className="rounded-2xl border border-white/10 bg-gray-950 p-6">
              <h3 className="text-xl font-black">
                Revenue <span className={LIME}>Streams</span>
              </h3>
              <ul className="mt-5 space-y-4">
                {REVENUE.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-500/15 text-lime-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT — Expand into every adventure market */}
            <div className="rounded-2xl border border-white/10 bg-gray-950 p-6">
              <h3 className="text-xl font-black">
                Expand Into Every <span className={LIME}>Adventure Market</span>
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {PHASES.map(({ icon: Icon, label, phase }, idx) => (
                  <div key={label} className="relative rounded-xl border border-white/10 bg-white/5 p-4">
                    <Icon className="h-6 w-6 text-lime-400" />
                    <p className="mt-2 text-sm font-bold">{label}</p>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">{phase}</p>
                    {idx < PHASES.length - 1 && (
                      <ArrowRight className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-lime-500 sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════ SECTION 6 — STATS BAR ════════ */}
        <section className="bg-gray-950 py-14">
          <div className="container mx-auto grid items-center gap-8 px-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-lg text-gray-300">
                The #1 place to research, connect, buy and adventure in the van life and outdoor
                industries.
              </p>
              <p className={`mt-2 font-bold ${LIME}`}>vanciety.com</p>
            </div>
            <div className="grid grid-cols-2 gap-6 lg:col-span-8 lg:grid-cols-4">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <Icon className={`mx-auto mb-2 h-7 w-7 ${LIME}`} />
                  <p className="text-3xl font-black">{value}</p>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="container mx-auto px-4 pt-4 text-center text-xs text-gray-500 lg:text-right">
            and growing
          </p>
        </section>

        {/* ════════ SECTION 7 — FOOTER BAR ════════ */}
        <footer className="border-t border-white/10 bg-black py-10">
          <div className="container mx-auto grid gap-8 px-4 text-center lg:grid-cols-3 lg:text-left">
            <div>
              <div className="text-xl font-black tracking-tight">
                VAN<span className={LIME}>CIETY</span>
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Built by the van community. Powered by AI. Driven by adventure.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-gray-300">
                One Platform. Every Van. Every Adventure.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 lg:items-end">
              <p className="text-sm text-gray-300">Join the Movement. Build the Future.</p>
              <Button asChild size="lg" className="bg-lime-500 font-semibold text-gray-950 hover:bg-lime-400">
                <Link to={R.auth}>
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
