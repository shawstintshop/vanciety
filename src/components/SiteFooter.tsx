import { ArrowRight, Mail, MapPin, MessageCircle, Shield, ShoppingBag, Video, Wrench, Users } from "lucide-react";
import { Link } from "react-router-dom";
import VancietyLogo from "@/components/VancietyLogo";
import { Button } from "@/components/ui/button";

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Marketplace", to: "/marketplace", icon: ShoppingBag },
      { label: "How-To Videos", to: "/videos", icon: Video },
      { label: "Events", to: "/events", icon: MapPin },
      { label: "Find Members", to: "/dashboard", icon: Users },
    ],
  },
  {
    title: "Build & Fix",
    links: [
      { label: "Van Intelligence", to: "/van-intelligence", icon: Wrench },
      { label: "Vendors", to: "/vendors", icon: Wrench },
      { label: "Forum", to: "/forum", icon: MessageCircle },
      { label: "News", to: "/news", icon: Video },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", to: "/auth", icon: Shield },
      { label: "Member Dashboard", to: "/dashboard", icon: Users },
      { label: "Vendor Signup", to: "/vendor-signup", icon: ShoppingBag },
      { label: "Contact", to: "mailto:hello@vanciety.com", icon: Mail },
    ],
  },
];

const quickLinks = [
  { label: "Privacy", to: "/auth" },
  { label: "Terms", to: "/auth" },
  { label: "Support", to: "/auth" },
  { label: "Accessibility", to: "/auth" },
];

const SiteFooter = () => {
  return (
    <footer className="mt-auto border-t border-border/60 bg-[#050608] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1.5fr_1fr]">
          <div className="space-y-4">
            <VancietyLogo className="h-10 w-[220px] max-w-full" />
            <p className="max-w-md text-sm leading-6 text-white/70">
              Vanciety brings van owners, builders, vendors, events, videos, research, and members into one clean hub.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-white/60">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Toppo / dark theme</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">AI search</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Member tools</span>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => {
                    const Icon = link.icon;
                    if (link.to.startsWith("mailto:")) {
                      return (
                        <li key={link.label}>
                          <a href={link.to} className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-lime-400">
                            <Icon className="h-4 w-4" />
                            {link.label}
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={link.label}>
                        <Link to={link.to} className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-lime-400">
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-lime-400/20 bg-gradient-to-br from-white/8 via-white/5 to-lime-400/10 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime-400">Start here</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-white">Get Started Free</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Create your free account to save research, follow listings, see member tools, and unlock future location privacy controls.
            </p>
            <Button asChild className="mt-5 w-full bg-lime-500 font-semibold text-gray-950 hover:bg-lime-400">
              <Link to="/auth">
                Join Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Vanciety. Real van life community.</p>
          <div className="flex flex-wrap gap-4">
            {quickLinks.map((link) => (
              <Link key={link.label} to={link.to} className="transition hover:text-lime-400">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
