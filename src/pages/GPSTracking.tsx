import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import GPSSettings from "@/components/GPSSettings";
import { Satellite } from "lucide-react";

const GPSTracking = () => {
  return (
    <div className="vanciety-page vanciety-page--gps min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection image="/images/sprinter-foggy-beach.png" badge="GPS Tracking" title="Always know" accent="where your people are." subtitle="Opt-in real-time van location sharing for the community." />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <GPSSettings />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GPSTracking;
