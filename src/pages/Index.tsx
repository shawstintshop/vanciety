/**
 * Index.tsx — Vanciety Home Page
 * Cleaned up to remove duplicate sections and anchor the home page around
 * real data: daily briefing, latest videos, live feed, and member actions.
 */

import { Link } from "react-router-dom";
import { ArrowRight, Bot, Building2, Calendar, Cpu, Image as ImageIcon, MapPin, ShoppingBag, Sparkles, Users, Video, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import TopoBackground from "@/components/TopoBackground";
import DailyVanBriefing from "@/components/DailyVanBriefing";
import LatestVideos from "@/components/LatestVideos";
import HomeFeed from "@/components/HomeFeed";
import VanaBubble from "@/components/VanaBubble";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const QUICK_ACTIONS: { icon: LucideIcon; title: string; desc: string; to: string }[] = [
  { icon: Bot, title: "Ask Vana", desc: "Get routed to the right guide, page, or community space.", to: "/ai" },
  { icon: Wrench, title: "Repair Guides", desc: "Step-by-step troubleshooting with practical fixes.", to: "/van-intelligence" },
  { icon: ShoppingBag, title: "Marketplace", desc: "Browse parts, vans, and gear listings.", to: "/marketplace" },
  { icon: Calendar, title: "Events & Meetups", desc: "Find rallies, workshops, and local gatherings.", to: "/events" },
  { icon: Users, title: "Community Forum", desc: "Ask questions and read real member advice.", to: "/forum" },
];

const CONTENT_HIGHLIGHTS: { icon: LucideIcon; title: string; label: string; desc: string; to: string }[] = [
  { icon: Video, title: "Latest Videos", label: "Fresh from YouTube", desc: "Van tours, builds, and maintenance walkthroughs.", to: "/videos" },
  { icon: ImageIcon, title: "Daily Briefing", label: "Real news + source links", desc: "Today’s van-life digest and event leads.", to: "/news" },
  { icon: MapPin, title: "Friend Finder", label: "Privacy-first member map", desc: "Approximate location sharing for meetups and help on the road.", to: "/friend-finder" },
  { icon: Cpu, title: "Van Intelligence", label: "AI helper + guides", desc: "Route questions into the best page for the job.", to: "/van-intelligence" },
];

const JOIN_FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: ShoppingBag, title: "Parts & Gear", desc: "Community listings and real product research." },
  { icon: Building2, title: "Builders", desc: "Trusted van professionals and shops." },
  { icon: Calendar, title: "Events", desc: "Meetups, rallies, and workshops near you." },
  { icon: Users, title: "Community", desc: "Forum help from real van lifers." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-28">
        <section className="relative isolate flex min-h-[560px] items-end overflow-hidden border-b border-white/10 vanciety-hero-topo" data-topo-container>
          {/* Vanciety van hero — matte black Sprinter in the mountains */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/94256494/JRiSVZqcQng3CprwFxMAGR/vanciety-van-hero-v2-AKtQYUhr7V6Ywk87ozFpTu.webp')" }}
          />
          {/* Deep gradient overlay for text legibility */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/55 to-black/90" />
          <TopoBackground className="z-[1]" intensity="medium" />

          <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
            <Badge className="mb-4 border border-primary/40 bg-primary/10 text-primary hover:bg-primary/15">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Van Life, all in one place
            </Badge>

            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Everything you need
                <br />
                <span className="text-primary">for van life, in one place.</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mt-4">
                Find repair guides, trusted builders, gear, events, and a community of real van lifers —
                all powered by Vana, your personal AI van assistant.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-primary text-black font-semibold hover:bg-amber-500">
                  <Link to="/auth">
                    Join Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10">
                  <Link to="/ai">Ask Vana</Link>
                </Button>
              </div>

              <div className="mt-8 grid gap-3 grid-cols-1 sm:grid-cols-3">
                {[
                  { title: "Repair Guides", desc: "Step-by-step help for common van issues.", to: "/van-intelligence" },
                  { title: "Events Near You", desc: "Rallies, meetups, and workshops on the map.", to: "/events" },
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

        <section className="border-b border-border bg-card py-16 topo-section-dark">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-3xl">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <Bot className="mr-1.5 h-3.5 w-3.5" />
                Vana and the live home surface
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">Start with the right action, not a wall of links.</h2>
              <p className="mt-3 text-muted-foreground sm:text-lg">
                The home page now separates quick actions from content. That keeps the page usable on mobile and makes the real data easier to find.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {QUICK_ACTIONS.map(({ icon: Icon, title, desc, to }) => (
                <Link
                  key={title}
                  to={to}
                  className="group rounded-xl border-2 border-border bg-background p-5 transition hover:border-primary/50 hover:bg-primary/5"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition group-hover:bg-primary/25">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-bold text-foreground">{title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <DailyVanBriefing />

        <LatestVideos />

        <section className="border-y border-border bg-card py-16 topo-section-mid">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">
                What’s inside
                <span className="text-primary"> the member experience</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                These are the actual places people go after joining: content, guidance, discovery, and the member map.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {CONTENT_HIGHLIGHTS.map(({ icon: Icon, title, label, desc, to }) => (
                <Link
                  key={title}
                  to={to}
                  className="group rounded-2xl border border-border bg-background p-6 transition hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary/25">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="text-lg font-bold text-foreground">{title}</p>
                      <p className="mt-1 text-sm font-medium text-primary/90">{label}</p>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{desc}</p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-primary/25 bg-primary/8 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-foreground">Ready to join the community?</p>
                  <p className="text-sm text-muted-foreground">Free to join. No credit card required.</p>
                </div>
                <Button asChild className="shrink-0 bg-primary font-semibold text-primary-foreground hover:bg-amber-500">
                  <Link to="/auth">Join Free</Link>
                </Button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {JOIN_FEATURES.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="rounded-lg border border-border bg-background/70 p-4">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Merch Section ─────────────────────────────────────── */}
        <section className="relative overflow-hidden border-y border-border">
          {/* Dark matte background */}
          <div className="absolute inset-0" style={{ background: "#0d0d0d" }} />
          {/* Subtle gold grid pattern overlay */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "linear-gradient(#c9a96e 1px, transparent 1px), linear-gradient(90deg, #c9a96e 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row items-center gap-10">

              {/* Left — copy */}
              <div className="flex-1 text-center lg:text-left">
                <Badge className="mb-4 text-xs font-bold tracking-widest uppercase"
                  style={{ background: "#c9a96e20", color: "#c9a96e", border: "1px solid #c9a96e40" }}>
                  Official Gear
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                  Build Experiences<br />
                  <span style={{ color: "#c9a96e" }}>Not Things.</span>
                </h2>
                <p className="text-base mb-2" style={{ color: "#aaa" }}>
                  Community · Gear · Connect · Knowledge
                </p>
                <p className="text-sm mb-8 max-w-md mx-auto lg:mx-0" style={{ color: "#666" }}>
                  Premium print-on-demand gear. Matte black everything. Gold badge.
                  Tees, hoodies, hats, mugs, bags, patches — built for the road.
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link to="/merch">
                    <Button className="font-bold px-8 py-3 text-base"
                      style={{ background: "#c9a96e", color: "#0a0a0a", border: "none" }}>
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Shop Merch
                    </Button>
                  </Link>
                  <a href="https://vanciety-shop.fourthwall.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="font-bold px-8 py-3 text-base"
                      style={{ borderColor: "#c9a96e40", color: "#c9a96e", background: "transparent" }}>
                      Visit Store
                    </Button>
                  </a>
                </div>

                {/* Product type chips */}
                <div className="flex flex-wrap gap-2 mt-8 justify-center lg:justify-start">
                  {["Tees", "Hoodies", "Hats", "Mugs", "Bags", "Patches", "Jackets"].map((item) => (
                    <span key={item} className="text-xs px-3 py-1 rounded-full"
                      style={{ background: "#1c1c1c", color: "#888", border: "1px solid #2e2e2e" }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — product grid preview */}
              <div className="flex-shrink-0 w-full max-w-sm mx-auto lg:mx-0 lg:max-w-none lg:w-[480px]">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Badge Tee", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80" },
                    { label: "Hoodie", img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&q=80" },
                    { label: "Trucker Hat", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&q=80" },
                    { label: "Tumbler", img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&q=80" },
                    { label: "Duffel", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80" },
                    { label: "Patch", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
                  ].map(({ label, img }) => (
                    <Link key={label} to="/merch"
                      className="group relative aspect-square rounded-lg overflow-hidden block"
                      style={{ background: "#1c1c1c" }}>
                      <img src={img} alt={label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2 text-xs font-bold text-white">{label}</span>
                    </Link>
                  ))}
                </div>
                <p className="text-center text-xs mt-3" style={{ color: "#555" }}>
                  All items ship direct · Premium quality · 30-day returns
                </p>
              </div>

            </div>
          </div>
        </section>

        <HomeFeed />
      </main>

      <VanaBubble />
    </div>
  );
};

export default Index;
