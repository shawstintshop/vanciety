import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import VancietyLogo from "@/components/VancietyLogo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="vanciety-page vanciety-page--ai min-h-screen bg-background">
      <Header />
      <main className="vanciety-hero-topo flex min-h-screen items-center justify-center px-4 pt-24 text-center">
        <div className="max-w-lg">
          <div className="mb-6 flex justify-center">
            <VancietyLogo className="h-16 w-[260px] max-w-full sm:h-18 sm:w-[280px]" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-glow">Route not found</p>
          <h1 className="mb-4 text-5xl font-black text-foreground">404</h1>
          <p className="mb-6 text-muted-foreground">
            That Vanciety trail marker does not exist. Head back to the map, Van Intelligence, or the home route.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero">
              <Link to="/">Return home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/map">Open map</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
