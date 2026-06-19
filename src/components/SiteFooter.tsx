import { Brain, Calendar, ExternalLink, Info, MapPin, MessageSquare, ShieldCheck, ShoppingBag, Sparkles, Users, Video, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import VancietyLogo from "./VancietyLogo";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Map", href: "/map", icon: MapPin },
      { label: "Friend Finder", href: "/friend-finder", icon: Users },
      { label: "About", href: "/about", icon: Info },
      { label: "Videos", href: "/videos", icon: Video },
      { label: "Events", href: "/news", icon: Calendar },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Forum", href: "/forum", icon: MessageSquare },
      { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
      { label: "Vendors", href: "/vendors", icon: Wrench },
      { label: "Van Cards", href: "/van-cards", icon: Users },
    ],
  },
  {
    title: "Intelligence",
    links: [
      { label: "Van Intelligence", href: "/van-intelligence", icon: Brain },
      { label: "AI Concierge", href: "/ai", icon: Sparkles },
      { label: "GPS Controls", href: "/gps", icon: MapPin },
      { label: "Sign in", href: "/auth", icon: ShieldCheck },
    ],
  },
];

const SiteFooter = () => (
  <footer className="vanciety-footer relative z-20 border-t border-border/80 bg-background/95 text-foreground backdrop-blur-xl">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
        <div className="space-y-5">
          <VancietyLogo />
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Premium van-life planning with real source links, opt-in member tools, map-aware AI guidance, and a topo design language built for routes, rigs, and community.
          </p>
          <div className="vanciety-map-grid rounded-2xl border border-border/70 bg-card/70 p-4 text-xs text-muted-foreground">
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary-glow" />
              Source policy
            </div>
            Vanciety does not invent live inventory, dates, bookings, or member activity. When a page depends on an outside provider, the button opens the original source; member tools require sign-in.
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {group.title}
              </h2>
              <nav className="space-y-2" aria-label={`${group.title} footer links`}>
                {group.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="group flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary-glow"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary-glow" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} Vanciety. Route smarter; verify at the source.</span>
        <a
          href="mailto:hello@vanciety.com?subject=Vanciety%20feedback"
          className="inline-flex items-center gap-1 font-medium text-primary-glow hover:text-secondary"
        >
          Send feedback <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
