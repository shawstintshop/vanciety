import Header from "@/components/Header";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background topo-card">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground">

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance</h2>
              <p className="text-muted-foreground leading-relaxed">
                By creating an account or using Vanciety, you agree to these Terms of Service. If you do not agree, please do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Your Account</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for keeping your account credentials secure. You must be at least 13 years old to create an account. You may not create accounts for others without their permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Community Standards</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vanciety is a community for van lifers. You agree not to post spam, harassment, illegal content, or false information. Marketplace listings must be accurate and for real items. We reserve the right to remove content or accounts that violate these standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Marketplace</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vanciety provides a platform for community members to buy and sell van-related items. Vanciety is not a party to any transaction between buyers and sellers. You are responsible for the accuracy of your listings and for completing transactions safely.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of content you post on Vanciety. By posting, you grant Vanciety a non-exclusive license to display your content on the platform. You may not post content that infringes on others' intellectual property.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vanciety is provided "as is." We are not liable for any damages arising from your use of the platform, including marketplace transactions, community interactions, or reliance on repair guides or AI-generated content. Always verify repair information with a qualified mechanic.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these terms from time to time. Continued use of Vanciety after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                Questions about these terms? Email us at{" "}
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

export default Terms;
