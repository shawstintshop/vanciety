import Header from "@/components/Header";
import GPSSettings from "@/components/GPSSettings";
import { Satellite } from "lucide-react";

const GPSTracking = () => {
  return (
    <div className="vanciety-page vanciety-page--gps min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="vanciety-hero-topo py-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-hero bg-clip-text text-transparent flex items-center justify-center gap-3">
                  <Satellite className="w-10 h-10 text-primary" />
                  Van GPS Tracking
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Share your van's real-time location with the Vanciety community.
                Find nearby vans, coordinate meetups, and stay connected on the road.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <GPSSettings />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GPSTracking;
