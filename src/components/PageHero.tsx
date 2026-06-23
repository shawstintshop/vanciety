/**
 * PageHero — Unified page header used on every interior page.
 *
 * Design system: Dark charcoal bg-background + topo texture overlay +
 * brass primary accent. Replaces all per-page photo banners.
 *
 * Usage:
 *   <PageHero
 *     label="Van Shop"           // small uppercase label above title
 *     title="Gear that works"    // main h1
 *     subtitle="Hand-picked..."  // optional sub-text
 *     icon={ShoppingBag}         // optional Lucide icon
 *   />
 */
import { LucideIcon } from "lucide-react";

interface PageHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children?: React.ReactNode; // optional extra content (search bar, buttons)
  compact?: boolean;           // shorter padding for map/full-screen pages
}

export default function PageHero({
  label,
  title,
  subtitle,
  icon: Icon,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <div
      className={`relative overflow-hidden bg-background border-b border-border/40 ${
        compact ? "py-6 px-4" : "py-10 px-4 md:py-14"
      }`}
      style={{
        backgroundImage: "url('/images/topo-charcoal-light.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Dark gradient overlay so text is always readable */}
      <div className="absolute inset-0 bg-background/80" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Label */}
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

        {/* Title */}
        <h1
          className={`font-black tracking-tight text-foreground ${
            compact
              ? "text-2xl md:text-3xl"
              : "text-3xl md:text-4xl lg:text-5xl"
          }`}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Extra content slot */}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}
