import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AIVanConcierge from "@/components/AIVanConcierge";
import VoiceVanny from "@/components/VoiceVanny";
import PremiumSection from "@/components/PremiumSection";

const Index = () => {
  return (
    <div className="vanciety-page vanciety-page--home min-h-screen">
      <Header />
      <main>
        <Hero />
        <section id="vanciety-ai-helper" className="container mx-auto scroll-mt-24 px-4 py-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Talk to Vanny</span>
                <span className="rounded-full border border-primary/30 bg-primary/8 px-2 py-0.5 text-[11px] text-primary-glow">Voice · Live</span>
              </div>
              <VoiceVanny compact />
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Ask Vanny</span>
                <span className="rounded-full border border-border/60 bg-card/60 px-2 py-0.5 text-[11px] text-muted-foreground">Text</span>
              </div>
              <AIVanConcierge mode="home" compact />
            </div>
          </div>
        </section>
        <PremiumSection />
      </main>
    </div>
  );
};

export default Index;

