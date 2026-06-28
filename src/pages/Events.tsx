/**
 * Events.tsx — Vanciety Events Page
 * Real van life events, forums, clubs, and the Wrench Day program.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  Globe,
  MapPin,
  MessageSquare,
  Plus,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type VanEvent = {
  title: string;
  location: string;
  date: string;
  price: string;
  free: boolean;
  url: string;
  type: "rally" | "expo" | "festival" | "meetup" | "wrenchday";
  description: string;
};

type VanForum = {
  name: string;
  url: string;
  type: string;
  members: string;
  description: string;
};

type VanClub = {
  name: string;
  url: string;
  location: string;
  description: string;
};

const EVENTS: VanEvent[] = [
  { title: "Women's Rubber Tramp Rendezvous (WRTR)", location: "Quartzsite, AZ", date: "Jan 7–9, 2026", price: "Free", free: true, url: "https://homesonwheelsalliance.org/2026-rubbertramp-rendevous/", type: "rally", description: "Free annual gathering for women living or aspiring to live the nomadic lifestyle. Hosted by HOWA." },
  { title: "Rubber Tramp Rendezvous (RTR)", location: "Quartzsite, AZ", date: "Jan 10–15, 2026", price: "Free", free: true, url: "https://homesonwheelsalliance.org/2026-rubbertramp-rendevous/", type: "rally", description: "Open to everyone — cars, vans, SUVs, RVs. No registration required. Hosted by Homes on Wheels Alliance." },
  { title: "Xscapers Annual Bash 2026", location: "Lake Havasu City, AZ", date: "Jan 10–18, 2026", price: "$145–$225", free: false, url: "https://www.escapees.com/events/xscapers-annual-bash-2026", type: "festival", description: "Week-long desert takeover for working-age nomads. Live music, theme nights, seminars, solar and boondocking talks." },
  { title: "VanFest: LIFTOFF!", location: "Melbourne, FL", date: "Feb 5–9, 2026", price: "$15–$145", free: false, url: "https://vanfestusa.com", type: "festival", description: "Largest community-focused nomadic celebration in Florida. Hundreds of vans, live music, workshops, and vendors." },
  { title: "Peace Love & Vans — Florida", location: "Dade City, FL", date: "Mar 6–9, 2026", price: "$15–$259", free: false, url: "https://www.peacelovevans.com", type: "festival", description: "1960s-inspired van village at Withlacoochee River Park. Hundreds of vans, workshops, live music, Tiki Bar, $15K in raffle prizes." },
  { title: "Overland Expo SoCal", location: "Costa Mesa, CA", date: "Mar 14–15, 2026", price: "$25–$75", free: false, url: "https://www.overlandexpo.com", type: "expo", description: "World's premier overlanding event series. Classes, vendors, film festival, and expert panels for van lifers and 4x4 enthusiasts." },
  { title: "RendezVan Mt. Bachelor", location: "Bend, OR", date: "Apr 16–19, 2026", price: "Free", free: true, url: "https://www.rendezvan.com", type: "festival", description: "Annual spring van life festival at Mt. Bachelor. Music, vendors, competitions, skiing, and camping." },
  { title: "Adventure Van Expo — Ventura, CA", location: "Ventura, CA", date: "May 2026", price: "Free (camping extra)", free: true, url: "https://adventurevanexpo.com/ventura-ca/", type: "expo", description: "National series of van life events. Open-house van tours, DIY contest, live music, food trucks, and vendors." },
  { title: "Overland Expo West", location: "Flagstaff, AZ", date: "May 15–17, 2026", price: "$25–$75", free: false, url: "https://www.overlandexpo.com/west/", type: "expo", description: "The world's largest overlanding event. Hundreds of exhibitors, classes, DIY rigs, and the Overland Film Festival." },
  { title: "Peace Love & Vans — Colorado", location: "Spanish Peaks, CO", date: "Jun 12–15, 2026", price: "$15–$259", free: false, url: "https://www.peacelovevans.com", type: "festival", description: "Mountain edition of the popular van life festival. Workshops, van tours, live music, and camping in the Colorado Rockies." },
  { title: "Adventure Van Expo — Hood River, OR", location: "Hood River, OR", date: "Jun 2026", price: "Free (camping extra)", free: true, url: "https://adventurevanexpo.com/hood-river-or/", type: "expo", description: "Pacific Northwest edition of the Adventure Van Expo. Open-house tours, builds, vendors, and community." },
  { title: "Overland Expo PNW", location: "Redmond, OR", date: "Jun 26–28, 2026", price: "$25–$75", free: false, url: "https://www.overlandexpo.com", type: "expo", description: "Pacific Northwest Overland Expo. Classes, vendors, and expert panels for van lifers and overlanders." },
  { title: "Adventure Van Expo — Winter Park, CO", location: "Winter Park, CO", date: "Jul 11–12, 2026", price: "Free (camping extra)", free: true, url: "https://adventurevanexpo.com/winterpark-co/", type: "expo", description: "Colorado mountain edition. Open-house vans, DIY contest, live music, food trucks, and camping." },
  { title: "Descend on Bend", location: "Yamhill River, OR", date: "Summer 2026", price: "Free", free: true, url: "https://www.descendonbend.com", type: "rally", description: "Annual four-day gathering of van lifers and outdoor enthusiasts. Hushed mumbles and handshakes — community first." },
  { title: "Overland Expo Mountain West", location: "Loveland, CO", date: "Aug 2026", price: "$25–$75", free: false, url: "https://www.overlandexpo.com", type: "expo", description: "Mountain edition of the Overland Expo series. Gear, workshops, and adventure vehicles for mountain van lifers." },
  { title: "Overland Expo East", location: "Arrington, VA", date: "Oct 2026", price: "$25–$75", free: false, url: "https://www.overlandexpo.com", type: "expo", description: "East Coast Overland Expo. Van conversions, expert presentations, and gear for East Coast van lifers." },
  { title: "Van-O-Ween", location: "Apache Junction, AZ", date: "Oct 30–Nov 3, 2026", price: "TBA", free: false, url: "https://vanfestusa.com", type: "festival", description: "Halloween-themed van life gathering. Costume contests, campfire tales, and haunted adventures." },
  { title: "Vanciety Wrench Day — Seattle, WA", location: "Seattle, WA", date: "First Saturday Monthly", price: "Free", free: true, url: "/wrench-day", type: "wrenchday", description: "Monthly community van maintenance day. Oil changes, brake checks, tire rotations, and classes. Every van gets worked on." },
  { title: "Vanciety Wrench Day — Portland, OR", location: "Portland, OR", date: "First Saturday Monthly", price: "Free", free: true, url: "/wrench-day", type: "wrenchday", description: "Monthly community van maintenance day. Volunteer mechanics, free classes, and community wrenching." },
  { title: "Vanciety Wrench Day — Denver, CO", location: "Denver, CO", date: "First Saturday Monthly", price: "Free", free: true, url: "/wrench-day", type: "wrenchday", description: "Monthly community van maintenance day. Volunteer mechanics, free classes, and community wrenching." },
];

const FORUMS: VanForum[] = [
  { name: "r/vandwellers", url: "https://www.reddit.com/r/vandwellers/", type: "Reddit", members: "230K+", description: "Tips, tricks, and support for living in your van, car, or truck. The original van life subreddit." },
  { name: "r/VanLife", url: "https://www.reddit.com/r/VanLife/", type: "Reddit", members: "950K+", description: "For people living a carefree, mobile, and active lifestyle on the road. Rig images, road stories, and tips." },
  { name: "r/SprinterVans", url: "https://www.reddit.com/r/SprinterVans/", type: "Reddit", members: "85K+", description: "Dedicated Sprinter van community. Builds, repairs, mods, and advice for all Sprinter generations." },
  { name: "r/overlanding", url: "https://www.reddit.com/r/overlanding/", type: "Reddit", members: "400K+", description: "Vehicle-dependent expedition travel. Gear, routes, builds, and stories from the overlanding community." },
  { name: "r/CamperVans", url: "https://www.reddit.com/r/CamperVans/", type: "Reddit", members: "120K+", description: "All camper van types — Sprinter, Transit, ProMaster, Econoline, and custom builds." },
  { name: "Sprinter-Source", url: "https://sprinter-source.com", type: "Dedicated Forum", members: "100K+", description: "The largest dedicated Sprinter forum. Technical discussions, build threads, and decades of archived knowledge." },
  { name: "Ford Transit USA Forum", url: "https://www.fordtransitusaforum.com", type: "Dedicated Forum", members: "50K+", description: "Everything Ford Transit — cargo, passenger, and camper conversions. Technical help and build threads." },
  { name: "Project Van Life Forum", url: "https://forum.projectvanlife.com", type: "Dedicated Forum", members: "Active", description: "Forum for van life, RV life, and bus life discussions. Build advice, travel tips, and community support." },
  { name: "Van & RV Living Forum", url: "https://vanlivingforum.com", type: "Dedicated Forum", members: "Active", description: "Discussion forum for van living, RV living, solar, mechanical issues, and camper topics." },
  { name: "Sportsmobile Forum", url: "https://www.sportsmobileforum.com", type: "Dedicated Forum", members: "Active", description: "Sportsmobile and 4x4 van conversion community. Build threads, technical help, and trip reports." },
  { name: "iRV2 Sprinter Chassis Forum", url: "https://www.irv2.com/forums/sprinter-chassis-forum.1741/", type: "Dedicated Forum", members: "Active", description: "Sprinter motorhome chassis discussions. Best practices, maintenance, and technical help." },
  { name: "BenzWorld Sprinter Forum", url: "https://www.benzworld.org/forums/w901-907-sprinter.71/", type: "Dedicated Forum", members: "Active", description: "Mercedes-Benz Sprinter forum covering W901–W907 generations. Technical discussions and community support." },
];

const CLUBS: VanClub[] = [
  { name: "New England Van Council (N.E.V.C.)", url: "https://newenglandvancouncil.com", location: "New England, USA", description: "Established 1975. Promotes the sport of vanning across New England. One of the oldest active van clubs in the country." },
  { name: "Adventure Van Expo", url: "https://adventurevanexpo.com", location: "National (CA, OR, WA, CO, MT)", description: "9th year running. 6 events in 2026 across the West Coast and Mountain states. Open-house vans, builds, and community." },
  { name: "California Street Vans", url: "https://www.youtube.com/@californiastreetvans", location: "Southern California", description: "Organizes the SoCal Slow Ride van cruise. Custom van culture, van slams, and West Coast van community." },
  { name: "The Overland Van Club (Revel Club)", url: "https://www.therevelclub.com/overlandvanclub", location: "National", description: "Members customize vans for travel and adventure. Community of overlanding van owners focused on quality builds." },
  { name: "Vanlife Pride", url: "https://vanlifepride.com", location: "National", description: "LGBTQ+ van life community. Annual Pride in the Desert event in Quartzsite, AZ plus smaller events throughout the year." },
  { name: "Homes on Wheels Alliance (HOWA)", url: "https://homesonwheelsalliance.org", location: "National", description: "Organizes the Rubber Tramp Rendezvous (RTR) and Women's RTR. Advocates for nomadic communities and vehicle dwellers." },
  { name: "Xscapers (by Escapees)", url: "https://xscapers.com", location: "National", description: "Working-age nomad community. Annual Bash event, regional meetups, and online community for full-time van and RV lifers." },
  { name: "The Van Club (UK)", url: "https://thevanclub.co.uk", location: "UK & Europe", description: "Membership club for motorhome, campervan, and van conversion enthusiasts. Exclusive meetups, member discounts, and events." },
  { name: "Vanlife Europe", url: "https://www.facebook.com/groups/527396140767308/", location: "Europe", description: "Facebook group for van lifers across Europe. Tips, camp spots, and community connections." },
  { name: "Peace Love & Vans", url: "https://www.peacelovevans.com", location: "Florida & Colorado", description: "Community-focused van events in Florida and Colorado. 1960s-inspired van village with workshops, music, and community." },
];

const FILTER_TABS = [
  { label: "All Events", value: "all" },
  { label: "Rallies", value: "rally" },
  { label: "Expos", value: "expo" },
  { label: "Festivals", value: "festival" },
  { label: "Wrench Day", value: "wrenchday" },
];

const Events = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const filtered = activeFilter === "all" ? EVENTS : EVENTS.filter((e) => e.type === activeFilter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28">
        {/* 1. Hero */}
        <HeroSection
          image="https://files.manuscdn.com/user_upload_by_module/session_file/94256494/NoDaXWxfTTDCNHnc.jpg"
          badge="Events, Forums & Clubs"
          title="Find your people"
          accent="on the road."
          subtitle="Every van life rally, expo, festival, forum, and club — all in one place."
        >
          <Button asChild size="lg" className="bg-primary text-black font-semibold hover:bg-amber-500">
            <Link to="/map">Open Event Map<ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10">
            <Link to="/auth">Submit Your Event</Link>
          </Button>
        </HeroSection>

        {/* 2. Wrench Day Banner */}
        <section className="border-b border-amber-500/30 bg-amber-500/10 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black text-foreground text-lg">Introducing Vanciety Wrench Day</p>
                  <p className="text-muted-foreground text-sm mt-0.5">Monthly community van maintenance days across the USA — and soon Canada, UK, and beyond. Every van gets worked on. Free.</p>
                </div>
              </div>
              <Button asChild size="sm" className="shrink-0 bg-amber-500 text-black font-semibold hover:bg-amber-400">
                <Link to="/wrench-day">Learn More <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 3. Events Grid */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                  <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                  2026 Events
                </Badge>
                <h2 className="text-3xl font-black text-foreground sm:text-4xl">Where the community is headed.</h2>
                <p className="mt-2 text-muted-foreground">{EVENTS.length} real events — rallies, expos, festivals, and Wrench Days.</p>
              </div>
              <Button asChild size="sm" variant="outline" className="shrink-0 border-border text-muted-foreground">
                <Link to="/auth"><Plus className="mr-1.5 h-4 w-4" />Submit Event</Link>
              </Button>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {FILTER_TABS.map((tab) => (
                <button key={tab.value} onClick={() => setActiveFilter(tab.value)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${activeFilter === tab.value ? "border-primary bg-primary/10 text-amber-300" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event) => (
                <a key={event.title + event.date}
                  href={event.url.startsWith("/") ? undefined : event.url}
                  target={event.url.startsWith("/") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50 hover:bg-primary/5">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-amber-300">
                      {event.type === "wrenchday" ? <Wrench className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge className={event.free ? "border border-primary/40 bg-primary/10 text-amber-300 text-xs" : "border border-border bg-card text-muted-foreground text-xs"}>
                        {event.price}
                      </Badge>
                      {event.type === "wrenchday" && (
                        <Badge className="border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs">Wrench Day</Badge>
                      )}
                    </div>
                  </div>
                  <p className="font-bold text-foreground group-hover:text-amber-300 transition">{event.title}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />{event.location}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />{event.date}
                  </div>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{event.description}</p>
                  <span className="mt-4 inline-flex items-center text-xs font-semibold text-amber-400">
                    {event.url.startsWith("/") ? "Learn More" : "View Event"}
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Forums */}
        <section className="border-b border-border bg-card py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                Forums & Online Communities
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">Where van lifers talk.</h2>
              <p className="mt-2 text-muted-foreground">{FORUMS.length} real forums and communities — Reddit, dedicated forums, and more.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FORUMS.map((forum) => (
                <a key={forum.name} href={forum.url} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-border bg-background p-5 transition hover:border-primary/50 hover:bg-primary/5">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge className="border border-border bg-card text-muted-foreground text-xs">{forum.type}</Badge>
                    <span className="text-xs text-muted-foreground">{forum.members} members</span>
                  </div>
                  <p className="font-bold text-foreground group-hover:text-amber-300 transition">{forum.name}</p>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{forum.description}</p>
                  <span className="mt-3 inline-flex items-center text-xs font-semibold text-amber-400">
                    Visit Forum <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Clubs */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <Users className="mr-1.5 h-3.5 w-3.5" />
                Van Clubs & Organizations
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">Clubs worth joining.</h2>
              <p className="mt-2 text-muted-foreground">{CLUBS.length} real van clubs and organizations — from 1975 to today.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CLUBS.map((club) => (
                <a key={club.name} href={club.url} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50 hover:bg-primary/5">
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Globe className="h-3.5 w-3.5 shrink-0" />{club.location}
                  </div>
                  <p className="font-bold text-foreground group-hover:text-amber-300 transition">{club.name}</p>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{club.description}</p>
                  <span className="mt-3 inline-flex items-center text-xs font-semibold text-amber-400">
                    Visit Club <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Wrench Day CTA */}
        <section className="border-b border-border bg-card py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                  <Wrench className="h-8 w-8" />
                </div>
              </div>
              <Badge className="mb-4 border border-primary/30 bg-primary/10 text-amber-300">Vanciety Wrench Day</Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">Every van gets worked on.</h2>
              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
                One day per month. Volunteer mechanics. Free oil changes, brake checks, tire rotations, and maintenance classes. Starting in the USA, then Canada, UK, Germany, and beyond. No van owner should ever be stranded or overcharged because they didn't know how.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="bg-primary font-semibold text-primary-foreground hover:bg-amber-500">
                  <Link to="/wrench-day">Start a Chapter <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-border text-muted-foreground hover:border-primary/50">
                  <Link to="/auth"><Ticket className="mr-2 h-5 w-5" />Volunteer as Mechanic</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Events;
