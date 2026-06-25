/**
 * Events.tsx — Vanciety Events Page
 * Surfaces upcoming van-life rallies, meetups, and festivals and routes
 * members to the event map and submission flow.
 */

import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin, Plus, Ticket } from "lucide-react";
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
};

const EVENTS: VanEvent[] = [
  { title: "Descend on Bend", location: "Bend, OR", date: "July 15–17", price: "Free", free: true },
  { title: "Overland Expo West", location: "Flagstaff, AZ", date: "Aug 22–24", price: "$25–75", free: false },
  { title: "Van Life Rally", location: "Joshua Tree, CA", date: "July 5", price: "Free", free: true },
  { title: "Midwest Vanlife Fest", location: "Bloomington, IN", date: "Sep 12–14", price: "$20", free: false },
  { title: "Pacific Van Rally", location: "Ashland, OR", date: "Oct 3–5", price: "$15", free: false },
  { title: "Van Life Summit", location: "Moab, UT", date: "Nov 1", price: "Free", free: true },
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-16">
        {/* 1. Hero */}
        <HeroSection
          image="/images/vanciety-large-van-event.jpg"
          badge="Events & Meetups"
          title="Find your people"
          accent="on the road."
          subtitle="Rallies, festivals, and local meetups for Sprinter owners and van lifers."
        >
          <Button asChild size="lg" className="bg-primary text-black font-semibold hover:bg-amber-500">
            <Link to="/map">Open Event Map<ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10">
            <Link to="/auth">Submit Your Event</Link>
          </Button>
        </HeroSection>

        {/* 2. Upcoming events grid */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-3xl">
              <Badge className="mb-3 border border-primary/30 bg-primary/10 text-amber-300">
                <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                Upcoming
              </Badge>
              <h2 className="text-3xl font-black text-foreground sm:text-4xl">Where the community is headed.</h2>
              <p className="mt-3 text-muted-foreground sm:text-lg">
                Six gatherings coming up across the country — from free local meetups to the big overland expos.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EVENTS.map((event) => (
                <div
                  key={event.title}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-amber-300">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <Badge
                      className={
                        event.free
                          ? "border border-primary/40 bg-primary/10 text-amber-300"
                          : "border border-border bg-muted text-muted-foreground"
                      }
                    >
                      <Ticket className="mr-1 h-3 w-3" />
                      {event.price}
                    </Badge>
                  </div>

                  <p className="text-lg font-bold text-foreground">{event.title}</p>

                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-amber-400" />
                      {event.location}
                    </p>
                    <p className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-amber-400" />
                      {event.date}
                    </p>
                  </div>

                  <Link
                    to="/map"
                    className="mt-5 inline-flex items-center text-sm font-semibold text-amber-400"
                  >
                    View on map
                    <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-0.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Photo break */}
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/vans-neighborhood-meetup.jpg)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-20 lg:py-28">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
                Every meetup starts with <span className="text-amber-400">one neighbor.</span>
              </h2>
              <p className="mt-5 text-lg text-gray-300">
                From driveway gatherings to weekend rallies, the best van-life moments happen face to face.
                Find one near you — or start your own.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Submit event CTA */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-8 text-center shadow-card sm:p-12 topo-section-dark">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-amber-300">
                <Plus className="h-7 w-7" />
              </div>
              <h2 className="mx-auto max-w-2xl text-3xl font-black text-foreground sm:text-4xl">
                Hosting a rally or meetup?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground sm:text-lg">
                Put your event in front of the whole Vanciety community. Submit the details and we'll get it
                on the map and the upcoming list.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="bg-primary font-semibold text-primary-foreground hover:bg-amber-500">
                  <Link to="/auth">
                    Submit Your Event
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-border bg-transparent text-foreground hover:bg-muted">
                  <Link to="/map">Browse the Map</Link>
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
