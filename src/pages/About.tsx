/**
 * About.tsx — Vanciety About Page
 * Tells the community story and routes visitors into the core surfaces.
 */

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Calendar,
  Compass,
  Cpu,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Users,
  Video,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATS: { icon: LucideIcon; label: string; value: string; desc: string }[] = [
  { icon: Users, value: "Van Life", label: "Community", desc: "Real members swapping advice, builds, and road stories." },
  { icon: Wrench, value: "Repair", label: "Guides", desc: "Step-by-step troubleshooting for common Sprinter issues." },
  { icon: Calendar, value: "Events &", label: "Meetups", desc: "Rallies, workshops, and local gatherings on the map." },
  { icon: Bot, value: "Vana", label: "AI Assistant", desc: "Your personal van helper, ready to route any question." },
];

const PHOTOS: { src: string; alt: string }[] = [
  { src: "/images/vans-neighborhood-meetup.jpg", alt: "Vans gathered at a neighborhood meetup" },
  { src: "/images/vanciety-van-tech-mechanics.jpg", alt: "Mechanics working on van tech" },
  { src: "/images/vanciety-group-collage.jpg", alt: "Collage of the Vanciety community" },
];

const FEATURES: { icon: LucideIcon; title: string; desc: string; to: string }[] = [
  { icon: Cpu, title: "Van Intelligence", desc: "AI-backed repair guides and troubleshooting built for Sprinter owners.", to: "/van-intelligence" },
  { icon: Bot, title: "Ask Vana", desc: "Chat with your personal van assistant for instant answers and routing.", to: "/ai" },
  { icon: MapPin, title: "Van Life Spots", desc: "Campsites, meetups, and member-favorite locations on an interactive map.", to: "/spots" },
  { icon: ShoppingBag, title: "Marketplace", desc: "Buy and sell vans, parts, and gear within the community.", to: "/marketplace" },
  { icon: MessageCircle, title: "Community Forum", desc: "Ask questions and get answers from real van lifers.", to: "/forum" },
  { icon: Video, title: "Videos", desc: "Builds, tours, and maintenance walkthroughs from across the community.", to: "/videos" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-16">
        {/* 1. Hero */}
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/vanciety-large-van-event.jpg)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/45" />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-20 lg:py-28">
            <div className="max-w-3xl">
              <Badge className="mb-6 border border-primary/40 bg-primary/10 text-amber-300 hover:bg-primary/15">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                About Vanciety
              </Badge>
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Built by van lifers,
                <br />
                <span className="text-amber-400">for van lifers.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
                Vanciety is the home base for Sprinter owners and enthusiasts — repair guides, trusted
                builders, gear, events, and a community of real van lifers, all powered by Vana, your
                personal AI van assistant.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-primary font-semibold text-primary-foreground hover:bg-amber-500">
                  <Link to="/auth">
                    Join Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/8 text-white hover:bg-white/12">
                  <Link to="/forum">Browse Forum</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Mission */}
        <section className="border-b border-border bg-card py-16 lg:py-20 topo-section-dark">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                  <Compass className="mr-1.5 h-3.5 w-3.5" />
                  Our Mission
                </Badge>
                <h2 className="text-3xl font-black text-foreground sm:text-4xl">
                  Make van life simpler, safer, and more connected.
                </h2>
                <div className="mt-5 space-y-4 text-muted-foreground sm:text-lg">
                  <p>
                    Van life is freedom — but it comes with flat tires, electrical gremlins, and the
                    occasional lonely stretch of highway. We started Vanciety to put everything a Sprinter
                    owner needs in one place, backed by people who actually live this life.
                  </p>
                  <p>
                    From AI-powered repair guides to a privacy-first member map and a marketplace built for
                    the community, every feature exists to get you back on the road faster and keep you
                    connected to the people who get it.
                  </p>
                </div>
                <div className="mt-7">
                  <Button asChild className="bg-primary font-semibold text-primary-foreground hover:bg-amber-500">
                    <Link to="/auth">
                      Join the Community
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-card">
                <img
                  src="/images/sprinter-desert-camping.png"
                  alt="Vans camped out in the wild"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Stats grid */}
        <section className="border-b border-border py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map(({ icon: Icon, value, label, desc }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-amber-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xl font-black text-foreground">{value}</p>
                  <p className="text-amber-400">{label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Photo grid */}
        <section className="border-b border-border bg-card py-16 topo-section-dark">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-3xl">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <Users className="mr-1.5 h-3.5 w-3.5" />
                The Community
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">
                Real people, real builds, real miles.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PHOTOS.map(({ src, alt }) => (
                <div
                  key={src}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-card"
                >
                  <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Features grid */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-3xl">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Everything in one place
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">
                What you get with Vanciety.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, desc, to }) => (
                <Link
                  key={title}
                  to={to}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-amber-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{title}</p>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{desc}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-amber-400">
                    Explore
                    <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 6. CTA */}
        <section className="relative isolate overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/sprinter-red-rocks-arch.png)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-20 text-center lg:py-28">
            <h2 className="mx-auto max-w-2xl text-3xl font-black text-white sm:text-4xl lg:text-5xl">
              Ready to join the <span className="text-amber-400">Vanciety</span>?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-300">
              It's free to join. Get repair help, find your people, and make every mile a little easier.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-primary font-semibold text-primary-foreground hover:bg-amber-500">
                <Link to="/auth">
                  Join Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/8 text-white hover:bg-white/12">
                <Link to="/ai">
                  <Bot className="mr-2 h-5 w-5" />
                  Ask Vana
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
