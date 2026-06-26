import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import GPSSettings from "@/components/GPSSettings";
import { Satellite } from "lucide-react";

const GPSTracking = () => {
  return (
    <div className="vanciety-page vanciety-page--gps min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <PageHero
          label="GPS Tracking"
          title="Van GPS Tracking"
          subtitle="Share your van's real-time location with the Vanciety community. Find nearby vans, coordinate meetups, and stay connected on the road."
          icon={Satellite}
        />
        <section className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <GPSSettings />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GPSTracking;
