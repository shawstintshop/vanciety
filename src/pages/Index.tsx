import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Check, Bot, Search, Calendar, Wrench, User, Users, Globe, Megaphone,
  BarChart3, ShoppingBag, Building2, Video, Star, ArrowRight, UserPlus,
  Compass, Mountain, Tent, Sparkles, Cpu, Send, MessageSquare, Image as ImageIcon,
  Map as MapIcon,
} from "lucide-react";
import Header from "@/components/Header";
import TopoBackground from "@/components/TopoBackground";
import AIVanConcierge from "@/components/AIVanConcierge";
import VancietyLogo from "@/components/VancietyLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const LIME = "text-lime-500";

// ── Routes (wired to the app's real routes; /products & /companies don't exist) ──
const R = {
  products: "/marketplace",
  companies: "/manufacturers",
  events: "/events",
  videos: "/videos",
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
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/sprinter-red-rocks-arch.png)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent" />
          </div>
          <TopoBackground />

          <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
            {/* Top row: brand lockup + audience checklist */}
            <div className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row">
              <div className="h-10" />

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
              <div className="relative isolate h-full overflow-hidden rounded-2xl bg-gray-100 p-6 text-white">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url(/images/vans-camping-forest.jpg)" }}
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10">
                  <Badge className="mb-4 bg-lime-500 text-gray-950 hover:bg-lime-500">For Van Owners</Badge>
                  <ul className="space-y-5">
                    {OWNER_FEATURES.map(({ icon: Icon, title, desc }) => (
                      <li key={title} className="flex gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-500/20 text-lime-300">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-white">{title}</p>
                          <p className="text-sm text-white/75">{desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
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

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <Link to="/van-intelligence?guide=egr-v6-diesel" className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-lime-500/40 hover:bg-lime-500/10">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src="/images/vana/vana-friendly-welcome.jpg" alt="Vana friendly welcome" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">Start here</p>
                        <p className="mt-1 text-sm font-semibold text-white">Ask Vana first</p>
                        <p className="mt-1 text-sm text-gray-300">She sends visitors to the exact repair, events, video, or help path.</p>
                      </div>
                    </Link>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      {[
                        { title: "Route guidance", image: "/images/vana/vana-route-guidance.jpg", to: "/van-intelligence?guide=egr-v6-diesel" },
                        { title: "Tech support", image: "/images/vana/vana-tech-support.jpg", to: "/vendors" },
                        { title: "Community finder", image: "/images/vana/vana-community-finder.jpg", to: "/friend-finder" },
                        { title: "Problem solving", image: "/images/vana/vana-problem-solving.jpg", to: "/forum" },
                        { title: "Adventure ready", image: "/images/vana/vana-adventure-ready.jpg", to: "/videos" },
                      ].map((item) => (
                        <Link key={item.title} to={item.to} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-lime-500/40 hover:bg-lime-500/10">
                          <div className="aspect-[16/9] overflow-hidden">
                            <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                          </div>
                          <div className="p-4">
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
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

                <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 bg-gray-950/60">
                  <div
                    className="relative isolate p-5 text-white"
                    style={{ backgroundImage: "url(/images/vanciety-large-van-event.jpg)", backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
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
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3 transition-colors hover:border-lime-500/40"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lime-500/15 text-lime-400">
                              <Calendar className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-white">{e.name}</p>
                              <p className="text-xs text-white/75">{e.loc}</p>
                            </div>
                            <span className="shrink-0 text-xs text-white/65">{e.date}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* RIGHT — For Vendors & Companies */}
            <div className="lg:col-span-3">
              <div className="relative isolate h-full overflow-hidden rounded-2xl bg-gray-100 p-6 text-white">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url(/images/sprinter-specialists-shop.jpg)" }}
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10">
                  <Badge className="mb-4 bg-gray-900 text-white hover:bg-gray-900">For Vendors &amp; Companies</Badge>
                  <ul className="space-y-5">
                    {VENDOR_FEATURES.map(({ icon: Icon, title, desc }) => (
                      <li key={title} className="flex gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-white">{title}</p>
                          <p className="text-sm text-white/75">{desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ SECTION 3 — HOW IT WORKS ════════ */}
        <section className="relative isolate overflow-hidden py-16 text-gray-900">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/vans-driveway-meetup.jpg)" }}
          />
          <div className="absolute inset-0 bg-white/80" />
          <div className="relative z-10 container mx-auto px-4">
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
                    Ask Vana first. She routes visitors to the exact guide, video, event, or repair page they need before they start scrolling.
                  </p>

                  <div className="mt-6">
                    <AIVanConcierge compact />
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

            {/* RIGHT — Stats */}
            <div className="rounded-2xl border border-white/10 bg-gray-950 p-6 lg:col-span-2">
              <h3 className="text-xl font-black">
                VanCiety by the <span className={LIME}>Numbers</span>
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <Icon className={`mx-auto mb-2 h-5 w-5 ${LIME}`} />
                    <p className="text-xl font-black">{value}</p>
                    <p className="text-xs text-gray-400">{label}</p>
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

      </main>
    </div>
  );
};

export default Index;
