/**
 * WrenchDay.tsx — Vanciety Wrench Day Program Page
 * Monthly community van maintenance days — every van gets worked on.
 */
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Globe, MapPin, Wrench, Users, BookOpen, Shield, Calendar } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SERVICES = [
  "Oil and filter change",
  "Air filter replacement",
  "Cabin air filter replacement",
  "Tire rotation and pressure check",
  "Fluid top-off (coolant, brake, power steering, washer)",
  "Battery terminal cleaning",
  "Wiper blade replacement",
  "Light bulb check",
  "Visual brake inspection",
  "Belt and hose visual inspection",
  "Basic OBD-II diagnostic scan",
];

const CLASSES = [
  { month: "January", topic: "Oil changes: types, intervals, DIY walkthrough" },
  { month: "February", topic: "Electrical systems: batteries, inverters, solar basics" },
  { month: "March", topic: "Tire safety: rotation, pressure, sidewall reading, spare prep" },
  { month: "April", topic: "Brake systems: pads, rotors, fluid, when to DIY vs. shop" },
  { month: "May", topic: "Cooling system: coolant, thermostat, hose inspection" },
  { month: "June", topic: "Fuel system: filters, injectors, DEF for diesels" },
  { month: "July", topic: "Suspension and steering: bushings, ball joints, alignment basics" },
  { month: "August", topic: "Transmission: fluid check, service intervals, warning signs" },
  { month: "September", topic: "Van conversion electrical: 12V systems, shore power, battery banks" },
  { month: "October", topic: "Winterization: fluids, seals, heating systems, cold weather prep" },
  { month: "November", topic: "Emergency roadside: tire change, jump start, tow point, kit checklist" },
  { month: "December", topic: "Full van inspection: pre-trip checklist, year-end review" },
];

const PILOT_CITIES = [
  { city: "Seattle, WA", status: "Launching" },
  { city: "Portland, OR", status: "Launching" },
  { city: "Denver, CO", status: "Launching" },
  { city: "San Diego, CA", status: "Recruiting" },
  { city: "Austin, TX", status: "Recruiting" },
  { city: "Asheville, NC", status: "Recruiting" },
  { city: "Bend, OR", status: "Recruiting" },
  { city: "Salt Lake City, UT", status: "Recruiting" },
  { city: "Nashville, TN", status: "Recruiting" },
  { city: "Bozeman, MT", status: "Recruiting" },
];

const GLOBAL_PHASES = [
  { phase: "Phase 1", region: "USA", timeline: "2026–2027", target: "10 chapters, 2,000+ vans serviced" },
  { phase: "Phase 2", region: "Canada", timeline: "2027", target: "Vancouver, Calgary, Toronto, Montreal, Victoria" },
  { phase: "Phase 3", region: "United Kingdom", timeline: "2027–2028", target: "London, Bristol, Edinburgh, Manchester, Brighton" },
  { phase: "Phase 4", region: "Germany & Europe", timeline: "2028–2029", target: "Berlin, Munich, Amsterdam, Barcelona, Lisbon" },
  { phase: "Phase 5", region: "Australia & New Zealand", timeline: "2029–2030", target: "Sydney, Melbourne, Brisbane, Auckland" },
];

const WrenchDay = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28">

        {/* 1. Hero */}
        <section className="relative isolate overflow-hidden border-b border-border bg-card">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.35_0.12_60/0.15),transparent_60%)]" />
          <div className="container relative z-10 mx-auto px-4 py-20 lg:py-28">
            <div className="max-w-3xl">
              <Badge className="mb-4 border border-amber-500/40 bg-amber-500/10 text-amber-300">
                <Wrench className="mr-1.5 h-3.5 w-3.5" />
                Vanciety Wrench Day
              </Badge>
              <h1 className="text-5xl font-black leading-tight text-foreground sm:text-6xl lg:text-7xl">
                Every van<br />
                <span className="text-amber-400">gets worked on.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-xl text-muted-foreground leading-relaxed">
                One day per month. Volunteer mechanics. Free oil changes, brake checks, tire rotations, and maintenance classes. No van owner should ever be stranded or overcharged because they didn't know how.
              </p>
              <p className="mt-3 text-muted-foreground">
                Starting in the USA. Then Canada. Then the UK. Then Germany. Then everywhere.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-amber-500 text-black font-bold hover:bg-amber-400">
                  <a href="#start-chapter">Start a Chapter <ArrowRight className="ml-2 h-5 w-5" /></a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-border text-muted-foreground hover:border-amber-500/50">
                  <a href="#volunteer">Volunteer as Mechanic</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. What Happens at Wrench Day */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                The Format
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">What happens at Wrench Day.</h2>
              <p className="mt-2 text-muted-foreground">One Saturday per month. 8AM to 5PM. Every van in the queue gets worked on.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Schedule */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 font-bold text-foreground">Event Schedule</h3>
                <div className="space-y-3">
                  {[
                    { time: "8:00 AM", activity: "Setup — Volunteer mechanics arrive, tools laid out, class area set up" },
                    { time: "9:00 AM", activity: "Gates open — Vans arrive, check-in, service queue forms" },
                    { time: "9:30 AM", activity: "Class Block 1 — Oil change basics, filter types, drain intervals" },
                    { time: "10:00 AM", activity: "Wrenching begins — Mechanics start working through queue" },
                    { time: "11:00 AM", activity: "Class Block 2 — Electrical basics: battery health, fuse panels" },
                    { time: "12:00 PM", activity: "Lunch break — Community potluck or food trucks" },
                    { time: "1:00 PM", activity: "Class Block 3 — Tire safety, rotation, pressure, sidewall inspection" },
                    { time: "2:00 PM", activity: "Wrenching continues — Afternoon queue" },
                    { time: "3:00 PM", activity: "Class Block 4 — Brake inspection, pad wear, rotor check" },
                    { time: "4:00 PM", activity: "Open Q&A — Mechanics take questions from the group" },
                    { time: "5:00 PM", activity: "Wrap up — Tools packed, site cleaned, next event announced" },
                  ].map((item) => (
                    <div key={item.time} className="flex gap-3 text-sm">
                      <span className="w-16 shrink-0 font-mono text-amber-400">{item.time}</span>
                      <span className="text-muted-foreground">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-2 font-bold text-foreground">Free Services at Every Event</h3>
                <p className="mb-4 text-sm text-muted-foreground">Volunteer labor is free. Owner brings their own oil, filter, and any specific parts.</p>
                <div className="space-y-2">
                  {SERVICES.map((service) => (
                    <div key={service} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      <span className="text-muted-foreground">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Monthly Class Curriculum */}
        <section className="border-b border-border bg-card py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                Class Curriculum
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">12-month class rotation.</h2>
              <p className="mt-2 text-muted-foreground">Each month covers a different topic so repeat attendees always learn something new.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CLASSES.map((cls) => (
                <div key={cls.month} className="flex gap-3 rounded-xl border border-border bg-background p-4">
                  <span className="w-24 shrink-0 text-sm font-bold text-amber-400">{cls.month}</span>
                  <span className="text-sm text-muted-foreground">{cls.topic}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Safety Rules */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <Shield className="mr-1.5 h-3.5 w-3.5" />
                Safety Rules
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">Non-negotiable.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { rule: "No van under a floor jack alone", detail: "Jack stands required, period. No exceptions." },
                { rule: "Engine off before any service", detail: "No work on running engines. Ever." },
                { rule: "Waste oil collected properly", detail: "Never poured on ground. Collected and recycled." },
                { rule: "Digital liability waiver required", detail: "Signed through Vanciety before entering the queue." },
                { rule: "No alcohol during wrenching hours", detail: "Zero tolerance during the service window." },
                { rule: "Children supervised away from work area", detail: "Family-friendly event — keep kids safe." },
              ].map((item) => (
                <div key={item.rule} className="rounded-xl border border-border bg-card p-5">
                  <p className="font-bold text-foreground">{item.rule}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Pilot Cities */}
        <section className="border-b border-border bg-card py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <MapPin className="mr-1.5 h-3.5 w-3.5" />
                Pilot Cities
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">Where we're starting.</h2>
              <p className="mt-2 text-muted-foreground">10 US cities in Year 1. Target: 2,000+ vans serviced.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {PILOT_CITIES.map((city) => (
                <div key={city.city} className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
                  <span className="font-bold text-foreground text-sm">{city.city}</span>
                  <Badge className={city.status === "Launching"
                    ? "w-fit border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs"
                    : "w-fit border border-border bg-card text-muted-foreground text-xs"}>
                    {city.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Global Rollout */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <Globe className="mr-1.5 h-3.5 w-3.5" />
                Global Rollout
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">Starting in the USA. Going everywhere.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {GLOBAL_PHASES.map((phase) => (
                <div key={phase.phase} className="rounded-xl border border-border bg-card p-5">
                  <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300 text-xs">{phase.phase}</Badge>
                  <p className="font-bold text-foreground">{phase.region}</p>
                  <p className="mt-1 text-xs text-amber-400">{phase.timeline}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{phase.target}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Start a Chapter */}
        <section id="start-chapter" className="border-b border-border bg-card py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <Badge className="mb-4 border border-primary/30 bg-primary/10 text-amber-300">
                  <Users className="mr-1.5 h-3.5 w-3.5" />
                  Start a Chapter
                </Badge>
                <h2 className="text-3xl font-black text-foreground sm:text-4xl">Run Wrench Day in your city.</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Chapter Leaders organize the monthly event in their city. Find a venue, recruit 2–4 volunteer mechanics, set a date, and post it on Vanciety. Even if it's just 5 vans and 2 mechanics — it counts.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Register as a Chapter Leader on Vanciety",
                    "Find a venue (parking lot, church, fairground, campground)",
                    "Recruit 2–4 volunteer mechanics from local van groups",
                    "Set a date — first Saturday of every month recommended",
                    "Post the event on Vanciety Events page",
                    "Run your first event and report back with photos",
                  ].map((step, i) => (
                    <div key={step} className="flex items-start gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">{i + 1}</span>
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" className="mt-8 bg-amber-500 text-black font-bold hover:bg-amber-400">
                  <Link to="/auth">Apply as Chapter Leader <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>

              {/* Volunteer */}
              <div id="volunteer">
                <Badge className="mb-4 border border-primary/30 bg-primary/10 text-amber-300">
                  <Wrench className="mr-1.5 h-3.5 w-3.5" />
                  Volunteer as Mechanic
                </Badge>
                <h2 className="text-3xl font-black text-foreground sm:text-4xl">Donate 4–8 hours once a month.</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Qualified mechanics (ASE certified, trade school grads, experienced DIYers, retired shop owners) who donate one Saturday per month. You'll receive a Vanciety Verified Mechanic badge and be listed in the Trusted Mechanic directory.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Demonstrate competency in at least 3 service areas",
                    "Commit to one Saturday per month",
                    "Receive Vanciety Volunteer Mechanic badge on your profile",
                    "Listed in the Vanciety Trusted Mechanic directory",
                    "Build community trust and reputation in your city",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" variant="outline" className="mt-8 border-border text-muted-foreground hover:border-amber-500/50">
                  <Link to="/auth">Register as Volunteer Mechanic <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 8. The Promise */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                  <Wrench className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">
                Built from 30 years of showing up for people.
              </h2>
              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
                Wrench Day is free. It will always be free. No van owner should ever be stranded on the side of the road, overcharged by a shop they didn't trust, or intimidated by basic maintenance because nobody showed them how. That's why this exists.
              </p>
              <p className="mt-3 text-muted-foreground">
                — Shaw, Founder of Vanciety. Retired Captain, Pierce County Fire Dept.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="bg-amber-500 text-black font-bold hover:bg-amber-400">
                  <a href="#start-chapter">Start a Chapter <ArrowRight className="ml-2 h-5 w-5" /></a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-border text-muted-foreground hover:border-amber-500/50">
                  <Link to="/events">View All Events</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default WrenchDay;
