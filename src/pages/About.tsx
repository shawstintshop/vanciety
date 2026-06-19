import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">About Vanciety</h1>
          <p className="text-muted-foreground">The real van life community hub.</p>
        </div>
      </main>
    </div>
  );
};

export default About;
