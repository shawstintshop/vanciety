import Header from "@/components/Header";

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-background topo-card">
      <Header />
      <main className="pt-16 sm:pt-20">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">Accessibility</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground">

            <section>
              <h2 className="text-xl font-semibold mb-3">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vanciety is committed to making van life accessible to everyone. We are working to ensure our platform meets WCAG 2.1 Level AA standards so that all community members — regardless of ability — can use Vanciety effectively.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">What We're Doing</h2>
              <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
                <li>Keyboard navigation support across all interactive elements</li>
                <li>Sufficient color contrast ratios for text and UI components</li>
                <li>Descriptive alt text for images and icons</li>
                <li>Semantic HTML structure for screen reader compatibility</li>
                <li>Focus indicators on all interactive elements</li>
                <li>Responsive design that works at all zoom levels</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Known Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vanciety is actively being developed. Some areas of the platform may not yet meet full accessibility standards, including the interactive map and some video embeds. We are actively working to address these gaps.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Report an Issue</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you encounter an accessibility barrier on Vanciety, please let us know. Your feedback directly shapes our improvements. Contact us at{" "}
                <a href="mailto:hello@vanciety.com" className="text-primary hover:underline">
                  hello@vanciety.com
                </a>{" "}
                with the subject line "Accessibility" and a description of what you experienced. We aim to respond within 5 business days.
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Accessibility;
