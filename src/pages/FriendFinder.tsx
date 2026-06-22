import Header from "@/components/Header";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Shield, Users } from "lucide-react";

const FriendFinder = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="vanciety-hero-topo py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-orange-600 text-white">Friend Finder Early Access</Badge>
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">Member help without exposing exact locations</h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Friend Finder is being built for approximate area matching, driveway-style meetups,
                and practical member help — not public live tracking.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  title: "Privacy-first matching",
                  description: "Share city-level or area-level presence instead of exact pins unless you explicitly choose otherwise.",
                },
                {
                  icon: Users,
                  title: "Practical member help",
                  description: "Find people nearby for repair advice, tool lending, campsite tips, and trusted local recommendations.",
                },
                {
                  icon: MapPin,
                  title: "Useful, not noisy",
                  description: "This will only be surfaced where it helps, not injected into every section and category on the site.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <Card key={title}>
                  <CardContent className="flex gap-4 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Current live routes</CardTitle>
                  <CardDescription>
                    While Friend Finder is still being staged, these are the useful paths already live.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button asChild variant="outline"><Link to="/forum">Ask the Community</Link></Button>
                  <Button asChild variant="outline"><Link to="/events">Browse Events</Link></Button>
                  <Button asChild variant="outline"><Link to="/vendors">Find Vendors</Link></Button>
                  <Button asChild variant="hero"><Link to="/ai">Open Vana <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Join the Friend Finder waitlist</CardTitle>
                <CardDescription>
                  Get notified when approximate-area matching, member save tools, and meetup routing go live.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NewsletterSignup
                  variant="inline"
                  defaultInterest={["member"]}
                  sourcePage="friend-finder"
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FriendFinder;
