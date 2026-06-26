import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import GPSSettings from "@/components/GPSSettings";
import { Satellite } from "lucide-react";

const GPSTracking = () => {
  return (
    <div className="vanciety-page vanciety-page--gps min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <PageHero
          heroImage="https://files.manuscdn.com/user_upload_by_module/session_file/94256494/kYxxytNFujIYLWpl.jpg"
          label="GPS Tracking"
          title="Van GPS Tracking"
          subtitle="Share your van's real-time location with the Vanciety community. Find nearby vans, coordinate meetups, and stay connected on the road."
          icon={Satellite}
        />
        <section className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <GPSSettings />
          </div>
        </section>
      </main>
    </div>
  );
};

export default GPSTracking;
