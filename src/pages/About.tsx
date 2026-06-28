/**
 * About.tsx — Vanciety About Page
 * Shaw's real story — the foundation of Vanciety.
 */

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Calendar,
  Compass,
  Cpu,
  Flame,
  Heart,
  MapPin,
  MessageCircle,
  Quote,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  Video,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
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

const STANDARDS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Shield, title: "No Pay-to-Play Trust", desc: "Paying to be listed will never be enough. Every shop, builder, and product earns its place through quality and community trust." },
  { icon: Star, title: "Quality First, Always", desc: "Shaw built Shaw's Tint Shop to a 5-star Google rating by putting customers first. Vanciety follows that same rule — no shortcuts, no exceptions." },
  { icon: Heart, title: "Community Over Commerce", desc: "This platform exists to protect and educate van owners, not to take advantage of people who don't know mechanical systems or product quality." },
  { icon: Flame, title: "30 Years of Real Service", desc: "Shaw spent 30 years as a career firefighter in Pierce County, WA. That same commitment to showing up for people is the foundation of Vanciety." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-28">
        {/* 1. Hero */}
        <HeroSection
          image="https://files.manuscdn.com/user_upload_by_module/session_file/94256494/NoDaXWxfTTDCNHnc.jpg"
          badge="About Vanciety"
          title="Built from a lifetime"
          accent="on the road and in the fire."
          subtitle="One founder. One standard. One place for everything van life."
        >
          <Button asChild size="lg" className="bg-primary text-black font-semibold hover:bg-amber-500">
            <Link to="/auth">Join Free<ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10">
            <Link to="/forum">Browse Forum</Link>
          </Button>
        </HeroSection>

        {/* 2. About Vanciety — Shaw's Story */}
        <section className="border-b border-border bg-card py-16 lg:py-24 topo-section-dark">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <Badge className="mb-4 border border-primary/30 bg-primary/10 text-amber-300">
                <Compass className="mr-1.5 h-3.5 w-3.5" />
                About Vanciety
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl lg:text-5xl leading-tight">
                Built from one simple belief.
              </h2>
              <p className="mt-5 text-lg text-amber-400 font-semibold">
                People who love vans, vanlife, overlanding, camping, travel, and quality gear should never have to figure everything out alone.
              </p>

              {/* Shaw's story */}
              <div className="mt-10 space-y-6 text-muted-foreground text-base sm:text-lg leading-relaxed">
                <p>
                  For founder Shaw, vans were never a trend. They were part of life from the beginning. His story goes back to the 1970s, watching his dad build out vans in the garage during the original era of van slams, custom interiors, bold paint, road culture, and true hands-on craftsmanship. That early exposure turned into a lifelong obsession with customizing, building, solving problems, and making things better.
                </p>
                <p>
                  Shaw has spent nine years in the vanlife world and a lifetime customizing almost everything around him. He started tinting windows, detailing cars, and modifying vehicles at age 15. By 19, he had won at Autorama with a custom car build. That standard never left. Whether it was a van, a car, a website, a business, a product, or a piece of art — the goal was always the same: build it right, make it useful, and never settle for average.
                </p>
                <p>
                  Before Vanciety, Shaw served 30 years as a career firefighter in Pierce County, Washington, retiring in 2023 as a Captain/Public Information Officer. That career came with real sacrifice, including severe PTSD, and life after retirement became a day-by-day process of rebuilding, simplifying, and finding purpose again. Vanciety grew from that place: a need to reconnect with people, get back to what matters, and create something that helps others navigate the road, their vans, and their lives with more confidence.
                </p>
                <p>
                  Shaw has also spent decades in web design, software, marketing, product development, and small business building. He developed one of the first fire department websites in 1997 and went on to create platforms and projects including RITBAG, Fire Donation, and Fire Careers. Alongside his brother, a successful entrepreneur, Shaw has helped develop products, websites, systems, and businesses focused on helping people and improving how small businesses serve their customers.
                </p>
                <p>
                  Creativity has always been part of the same path. Shaw is a recognized abstract artist in Tacoma, Washington, with art installations throughout the Seattle-Tacoma area and recognition as an Artist of the Year. Whether through vehicles, websites, businesses, emergency service, art, or product design — the work has always been about connection, quality, and common sense.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Why Vanciety Exists */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid items-start gap-12 lg:grid-cols-2">
              <div>
                <Badge className="mb-4 border border-primary/30 bg-primary/10 text-amber-300">
                  <Heart className="mr-1.5 h-3.5 w-3.5" />
                  Why Vanciety Exists
                </Badge>
                <h2 className="text-3xl font-black text-foreground sm:text-4xl">
                  It started from a simple frustration.
                </h2>
                <div className="mt-6 space-y-5 text-muted-foreground text-base sm:text-lg leading-relaxed">
                  <p>
                    Shaw hated driving past vans from out of town and not knowing if the people inside needed help, a safe place to stay, a good campsite, a trusted mechanic, or local advice. Maybe they needed to know where to go. Maybe they needed to know where not to go. Maybe they just needed someone to say, <span className="text-foreground font-medium">"You're welcome here."</span>
                  </p>
                  <p>
                    That is the heart of Vanciety.
                  </p>
                  <p>
                    Vanciety is a van society built to connect people who love vans, vanlife, overlanding, camping, travel, quality products, honest service, and real community. Most van people are independent. Many are introverts. A lot of us are out here because we want space, freedom, and a simpler life. But simple does not mean alone.
                  </p>
                  <p>
                    Vanciety exists so van owners, travelers, builders, campers, and overlanders have one trusted place to find what they need: products, services, videos, guides, mechanics, builders, campsites, resources, recommendations, and real people who care.
                  </p>
                </div>
              </div>

              {/* Pull quote */}
              <div className="flex flex-col gap-6">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
                  <Quote className="h-8 w-8 text-amber-400 mb-4" />
                  <blockquote className="text-xl font-semibold text-foreground leading-relaxed">
                    "Our goal is to build the most trusted van resource in the world: a place where people can find everything they need for their van without having to search everywhere else."
                  </blockquote>
                  <p className="mt-4 text-amber-400 font-medium">— Shaw, Founder of Vanciety</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-bold text-foreground mb-4">Vanciety is here for:</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    {[
                      "Trusted van products and gear",
                      "Honest service providers",
                      "Quality mechanics and builders",
                      "Helpful videos and guides",
                      "Vanlife and camping resources",
                      "Overlanding support",
                      "Real reviews and star ratings",
                      "Community connection",
                      "Local knowledge from real people",
                      "A place where van owners can help each other",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Our Standard */}
        <section className="border-b border-border bg-card py-16 lg:py-20 topo-section-dark">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-3xl">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <Shield className="mr-1.5 h-3.5 w-3.5" />
                Our Standard
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">
                Vanciety does not compromise on quality.
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Every product, service, shop, mechanic, builder, and company connected to this platform must earn trust. Good companies will be recognized because they do good work. Poor service, low-quality products, dishonest pricing, and companies that take advantage of people will not have a place here.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STANDARDS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-background p-6 transition hover:border-primary/50"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-amber-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-foreground">{title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Stats grid */}
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

        {/* 6. Photo grid */}
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

        {/* 7. Features grid */}
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

        {/* 8. The Vanciety Promise */}
        <section className="border-b border-border bg-card py-16 lg:py-20 topo-section-dark">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 border border-primary/30 bg-primary/10 text-amber-300">
                <Flame className="mr-1.5 h-3.5 w-3.5" />
                The Vanciety Promise
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">
                Built on hard work, common sense, quality, honesty, and service.
              </h2>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
                We are here for the people who live in vans, build vans, love vans, travel in vans, camp in vans, work on vans, and dream about vans. We are here for the people who want reliable information, better products, better service, and a community that actually gives a damn.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                {[
                  "No shortcuts.",
                  "No pay-to-play trust.",
                  "No low-quality recommendations.",
                  "No taking advantage of people.",
                ].map((promise) => (
                  <div key={promise} className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 font-semibold text-amber-300">
                    {promise}
                  </div>
                ))}
              </div>
              <p className="mt-8 text-foreground font-semibold text-lg">
                Just real people, real experience, trusted resources, and a van society built to help.
              </p>
            </div>
          </div>
        </section>

        {/* 9. CTA */}
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
