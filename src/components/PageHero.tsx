/**
 * PageHero — Unified cinematic page header
 * Design: Full-width hero image that tells the story of each page
 * - heroImage: CDN URL for the cinematic background photo
 * - Falls back to topo texture if no image provided
 * - Gold label, large white title, subtitle
 * - Same visual language as the merch page reference
 */
import { LucideIcon } from "lucide-react";

interface PageHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  compact?: boolean;
  heroImage?: string; // CDN URL for cinematic background photo
}

export default function PageHero({
  label,
  title,
  subtitle,
  icon: Icon,
  children,
  compact = false,
  heroImage,
}: PageHeroProps) {
  const minH = compact ? "280px" : "420px";

  if (heroImage) {
    return (
      <div
        className="relative isolate overflow-hidden flex items-end border-b border-[#2e2e2e]"
        style={{ minHeight: minH }}
      >
        {/* Cinematic background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
          {/* Dark gradient so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/85" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 pb-12 pt-28">
          {(label || Icon) && (
            <div className="flex items-center gap-2 mb-3">
              {Icon && <Icon className="w-5 h-5 text-[#c9a96e]" />}
              {label && (
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#c9a96e]">
                  {label}
                </span>
              )}
            </div>
          )}
          <h1
            className="font-display tracking-wider text-white uppercase leading-none"
            style={{ fontSize: compact ? "clamp(28px,4vw,42px)" : "clamp(36px,6vw,72px)", textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-300 leading-relaxed">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-5">{children}</div>}
        </div>
      </div>
    );
  }

  // Fallback: topo texture (no heroImage provided)
  return (
    <div
      className={`relative overflow-hidden bg-background border-b border-border/40 ${
        compact ? "py-6 px-4" : "py-10 px-4 md:py-14"
      }`}
      style={{
        backgroundImage: "url('/images/topo-dark-gold.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative z-10 max-w-5xl mx-auto">
        {(label || Icon) && (
          <div className="flex items-center gap-2 mb-3">
            {Icon && <Icon className="w-5 h-5 text-primary" />}
            {label && (
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                {label}
              </span>
            )}
          </div>
        )}
        <h1
          className={`font-black tracking-tight text-foreground ${
            compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl lg:text-5xl"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}
