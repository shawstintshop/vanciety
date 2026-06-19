import { ExternalLink, Info, Search } from "lucide-react";
import Header from "@/components/Header";
import SourceBadge from "@/components/SourceBadge";
import FireRating from "@/components/FireRating";
import VanIntelligenceCard from "@/components/VanIntelligenceCard";
import AIVanConcierge from "@/components/AIVanConcierge";
import ExaVanSearch from "@/components/ExaVanSearch";
import {
  verifiedEvents,
  verifiedVideos,
  verifiedVendors,
  marketplaceSources,
  forumSources,
  mechanicDealerSources,
  manufacturerEntries,
  productCategories,
  hubSections,
} from "@/data/vanIntelligence";

// ---------------------------------------------------------------------------
// Section header utility
// ---------------------------------------------------------------------------
const SectionHeader = ({
  id,
  emoji,
  title,
  subtitle,
}: {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
}) => (
  <div id={id} className="scroll-mt-32 pt-12 pb-6">
    <h2 className="text-2xl font-bold flex items-center gap-2">
      <span>{emoji}</span> {title}
    </h2>
    <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
  </div>
);

// ---------------------------------------------------------------------------
// Events section
// ---------------------------------------------------------------------------
const EventsSection = () => (
  <section className="border-b border-border pb-12">
    <SectionHeader
      id="events"
      emoji="📅"
      title="Events & Shows"
      subtitle="Official expos, rallies, and van shows. Dates and links verified on official pages."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {verifiedEvents.map((event) => (
        <div key={event.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-card flex flex-col">
          <div className="relative h-36 overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <SourceBadge badge={event.sourceBadge} />
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2 flex-1">
            <h3 className="font-semibold text-sm leading-snug">{event.name}</h3>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <span>📍 {event.location}</span>
              <span>🗓 {event.date}</span>
            </div>
            <p className="text-xs text-muted-foreground/80 leading-relaxed flex-1">{event.summary}</p>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Official site
            </a>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Marketplace section
// ---------------------------------------------------------------------------
const MarketplaceSection = () => (
  <section className="border-b border-border pb-12">
    <SectionHeader
      id="marketplace"
      emoji="🛒"
      title="Deals & Marketplace"
      subtitle="Live search links for vans, parts, and gear. Open each source to confirm current price, condition, seller, and availability."
    />
    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6 flex items-start gap-2">
      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-800 dark:text-amber-300">
        These links open the original marketplace or search page so you can review the latest listing details, photos, seller notes, and terms before making a decision.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {marketplaceSources.map((src) => (
        <VanIntelligenceCard
          key={src.id}
          title={src.name}
          description={src.category}
          badge={src.badge}
          url={src.url}
          note={src.note}
        />
      ))}
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Products taxonomy section
// ---------------------------------------------------------------------------
const ProductsSection = () => (
  <section className="border-b border-border pb-12">
    <SectionHeader
      id="products"
      emoji="🛠️"
      title="Products & Accessories"
      subtitle="Browse tires, power, solar, heaters, racks, audio, storage, security, and recovery gear with source links for deeper research."
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {productCategories.map((cat) => (
        <div key={cat.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{cat.emoji}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight">{cat.label}</h3>
            </div>
            <SourceBadge badge={cat.badge} />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{cat.description}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {cat.notableItems.map((item) => (
              <span key={item} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
          <FireRating score={0} placeholder />
          <p className="text-[10px] text-muted-foreground/60 italic">{cat.note}</p>
          <a
            href={cat.searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Search {cat.label.toLowerCase()}
          </a>
        </div>
      ))}
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Builders, Dealers & Manufacturers
// ---------------------------------------------------------------------------
const VendorsSection = () => (
  <section className="border-b border-border pb-12">
    <SectionHeader
      id="vendors"
      emoji="🏭"
      title="Builders, Dealers & Manufacturers"
      subtitle="Official sites for van manufacturers, builders, upfitters, and dealer locators."
    />

    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Manufacturers & Notable Builders</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {manufacturerEntries.map((entry) => (
        <div key={entry.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-snug">{entry.name}</h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground capitalize">
                {entry.type}
              </span>
              <SourceBadge badge={entry.badge} />
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {entry.vehicles.map((v) => (
              <span key={v} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                {v}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{entry.note}</p>
          <FireRating score={0} placeholder />
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Official site
          </a>
        </div>
      ))}
    </div>

    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Verified Van Builders & Resources</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {verifiedVendors.map((vendor) => (
        <div key={vendor.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-snug">{vendor.name}</h3>
            <SourceBadge badge={vendor.sourceBadge} />
          </div>
          <p className="text-xs text-muted-foreground">{vendor.location}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{vendor.description}</p>
          <div className="flex flex-wrap gap-1">
            {vendor.services.map((s) => (
              <span key={s} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{s}</span>
            ))}
          </div>
          <FireRating score={0} placeholder />
          <a
            href={vendor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Official site
          </a>
        </div>
      ))}
    </div>

    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Mechanic & Service Finders</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {mechanicDealerSources.map((src) => (
        <VanIntelligenceCard
          key={src.id}
          title={src.name}
          description={src.category}
          badge={src.badge}
          url={src.url}
          note={src.note}
        />
      ))}
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Forums & Groups
// ---------------------------------------------------------------------------
const ForumsSection = () => (
  <section className="border-b border-border pb-12">
    <SectionHeader
      id="forums"
      emoji="💬"
      title="Forums & Groups"
      subtitle="Community discussion boards, subreddits, and van groups. Login-required sources are clearly marked."
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {forumSources.map((src) => (
        <VanIntelligenceCard
          key={src.id}
          title={src.name}
          description={src.category}
          badge={src.badge}
          url={src.url}
          note={src.note}
        />
      ))}
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Video Library
// ---------------------------------------------------------------------------
const VideosSection = () => (
  <section className="border-b border-border pb-12">
    <SectionHeader
      id="videos"
      emoji="🎬"
      title="Video Library"
      subtitle="Van builds, tours, tips, electrical installs, upgrades, reviews, and overland adventures grouped so you can find what to watch next."
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {verifiedVideos.map((video) => (
        <a
          key={video.youtubeId}
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-card border border-border rounded-xl overflow-hidden shadow-card flex flex-col hover:border-primary/50 transition-colors group"
        >
          <div className="relative h-32 overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-2 left-2">
              <span className="text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded uppercase tracking-wide">
                {video.category}
              </span>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-1 flex-1">
            <h3 className="text-xs font-semibold leading-snug line-clamp-2">{video.title}</h3>
            <p className="text-[11px] text-muted-foreground">{video.channel}</p>
            <div className="mt-auto pt-1">
              <SourceBadge badge="VERIFIED" />
            </div>
          </div>
        </a>
      ))}
    </div>
    <div className="text-center">
      <a
        href="/videos"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        Browse full video library →
      </a>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Member Builds (honest placeholder)
// ---------------------------------------------------------------------------
const MemberBuildsSection = () => (
  <section className="border-b border-border pb-12">
    <SectionHeader
      id="builds"
      emoji="🔧"
      title="Member Builds & Uploads"
      subtitle="Community-submitted van builds, photos, and build documentation."
    />
    <div className="bg-card border border-border rounded-xl p-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <SourceBadge badge="USER_GATED" />
        <SourceBadge badge="SUPABASE" />
      </div>
      <h3 className="font-semibold mb-2">Share Your Van Build</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4 leading-relaxed">
        Members will be able to upload photos, build specs, parts lists, videos, lessons learned, and trip notes so other van owners can learn from real rigs.
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
        <span className="bg-muted px-2 py-1 rounded">Member sign-in</span>
        <span className="bg-muted px-2 py-1 rounded">Photos and videos</span>
        <span className="bg-muted px-2 py-1 rounded">Parts lists</span>
        <span className="bg-muted px-2 py-1 rounded">🔥 Fire ratings</span>
      </div>
      <a
        href="/auth"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        Sign in to be notified when uploads launch →
      </a>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Newsletter CTA
// ---------------------------------------------------------------------------
const NewsletterSection = () => (
  <section id="newsletter" className="scroll-mt-32 pb-16">
    <SectionHeader
      id="newsletter-header"
      emoji="📬"
      title="Van Intelligence Newsletter"
      subtitle="Weekly digest: upcoming events, sale watches, new video finds, and product picks."
    />
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-border rounded-xl p-8">
      <div className="max-w-lg mx-auto text-center">
        <h3 className="font-bold text-lg mb-2">Stay in the loop</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Weekly van intel delivered to your inbox: upcoming events, sale watches, new builds,
          product finds, route ideas, and community highlights.
        </p>
        <div className="flex items-center gap-2 mb-3">
          <SourceBadge badge="SUPABASE" />
          <span className="text-xs text-muted-foreground">— early access list</span>
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            disabled
            className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm opacity-60 cursor-not-allowed"
          />
          <button
            disabled
            className="bg-primary/50 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-60"
          >
            Notify me
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 italic">
          Newsletter signup opens when member accounts and email preferences are connected.
        </p>
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
const VanIntelligence = () => {
  return (
    <div className="vanciety-page vanciety-page--intel min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="vanciety-hero-topo pt-24 pb-14">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4">
            <span className="text-5xl hidden sm:block">🔍</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Van Intelligence Hub
              </h1>
              <p className="text-white/70 mt-2 text-base max-w-xl">
                Everything van-life travelers, builders, and owners need in one place: events, gear, forums, builds, videos, marketplaces, mechanics, and AI planning help.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded">
                  Updated source links
                </span>
                <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded">
                  Events + gear + videos
                </span>
                <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded">
                  AI trip/build help
                </span>
                <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded">
                  🔥 Fire ratings
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section nav */}
      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            {hubSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4">
        {/* Exa neural search */}
        <section className="py-8">
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-primary-glow" />
            <h2 className="text-base font-semibold">Search vanlife sources</h2>
            <span className="rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[11px] text-primary-glow">
              Exa neural search
            </span>
          </div>
          <ExaVanSearch showCategories />
        </section>
        <AIVanConcierge mode="home" compact />
        <EventsSection />
        <MarketplaceSection />
        <ProductsSection />
        <VendorsSection />
        <ForumsSection />
        <VideosSection />
        <MemberBuildsSection />
        <NewsletterSection />
      </main>

      {/* Footer note */}
      <div className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Van Intelligence Hub — Vanciety. Use these links as a starting point, then confirm final prices, dates, inventory, ratings, bookings, and service details on the original source.
            <span className="mx-1">·</span>
            Badges show source access level.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VanIntelligence;
