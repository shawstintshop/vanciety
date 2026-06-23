import Header from "@/components/Header";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background topo-card">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground">

            <section>
              <h2 className="text-xl font-semibold mb-3">1. What We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you create a Vanciety account, we collect your email address, display name, and any profile information you choose to provide. When you use the marketplace, forum, or events features, we store the content you submit. We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data is used to operate your account, display your posts and listings, send you notifications you opt into, and improve the Vanciety platform. We use Supabase for secure database storage and authentication.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Location Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vanciety's Friend Finder and GPS features are designed with privacy first. Your exact location is never shared publicly. You control whether to share approximate area-level presence, and you can disable location features at any time from your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use essential cookies to keep you logged in and maintain your session. We do not use advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vanciety uses Supabase for database and authentication, and may embed YouTube videos. These services have their own privacy policies. We do not share your personal information with these services beyond what is necessary to operate the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You can request deletion of your account and associated data at any time by contacting us at{" "}
                <a href="mailto:hello@vanciety.com" className="text-primary hover:underline">
                  hello@vanciety.com
                </a>
                . We will process deletion requests within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                Questions about this policy? Email us at{" "}
                <a href="mailto:hello@vanciety.com" className="text-primary hover:underline">
                  hello@vanciety.com
                </a>
                .
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
