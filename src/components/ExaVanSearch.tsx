import { FormEvent, useState } from "react";
import { ExternalLink, Loader2, Search, Sparkles, X, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExaSearch, type ExaSearchOptions } from "@/hooks/useExaSearch";
import { cn } from "@/lib/utils";

interface ExaVanSearchProps {
  /** Pre-set category context */
  category?: ExaSearchOptions["category"];
  /** Placeholder override */
  placeholder?: string;
  /** Show category chips */
  showCategories?: boolean;
  /** Compact card layout */
  compact?: boolean;
}

const CATEGORY_CHIPS: { label: string; value: ExaSearchOptions["category"]; icon: string }[] = [
  { label: "Builds", value: "builds", icon: "🔧" },
  { label: "Electrical", value: "electrical", icon: "⚡" },
  { label: "Camping", value: "camping", icon: "⛺" },
  { label: "Events", value: "events", icon: "📅" },
  { label: "Gear", value: "gear", icon: "🎒" },
  { label: "Mechanics", value: "mechanics", icon: "🔩" },
  { label: "Community", value: "community", icon: "👥" },
  { label: "News", value: "news", icon: "📰" },
];

const FRESHNESS_OPTIONS: { label: string; value: ExaSearchOptions["freshness"] }[] = [
  { label: "Any time", value: undefined },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
  { label: "This year", value: "year" },
];

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
};

const formatDate = (iso?: string) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return null;
  }
};

const ExaVanSearch = ({
  category: defaultCategory,
  placeholder = "Search vanlife builds, gear, camping, events…",
  showCategories = true,
  compact = false,
}: ExaVanSearchProps) => {
  const { results, isLoading, error, query, search, clear } = useExaSearch();
  const [input, setInput] = useState("");
  const [activeCategory, setActiveCategory] = useState<ExaSearchOptions["category"]>(defaultCategory);
  const [freshness, setFreshness] = useState<ExaSearchOptions["freshness"]>(undefined);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    search(input, { category: activeCategory, freshness, numResults: compact ? 5 : 10 });
  };

  const handleChip = (cat: ExaSearchOptions["category"]) => {
    const next = cat === activeCategory ? undefined : cat;
    setActiveCategory(next);
    if (input.trim()) {
      search(input, { category: next, freshness, numResults: compact ? 5 : 10 });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-border/80 bg-card/80 py-2.5 pl-9 pr-10 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
          />
          {(input || query) && (
            <button
              type="button"
              onClick={() => { setInput(""); clear(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button type="submit" variant="hero" disabled={isLoading || !input.trim()} className="shrink-0">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {!compact && <span className="ml-2 hidden sm:inline">Search</span>}
        </Button>
      </form>

      {/* Category chips */}
      {showCategories && (
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_CHIPS.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => handleChip(chip.value)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                activeCategory === chip.value
                  ? "border-primary bg-primary/15 text-primary-glow"
                  : "border-border/70 bg-card/60 text-foreground/65 hover:border-primary/40 hover:text-foreground"
              )}
            >
              <span>{chip.icon}</span>
              {chip.label}
            </button>
          ))}

          {/* Freshness */}
          <div className="ml-auto flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            {FRESHNESS_OPTIONS.map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  setFreshness(opt.value);
                  if (input.trim()) search(input, { category: activeCategory, freshness: opt.value });
                }}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] transition-all",
                  freshness === opt.value
                    ? "border-secondary/60 bg-secondary/12 text-secondary"
                    : "border-border/50 text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{results.length}</span> results for{" "}
              <span className="italic">"{query}"</span>
              {activeCategory && (
                <Badge variant="outline" className="ml-2 border-primary/30 text-primary-glow">
                  <Tag className="mr-1 h-2.5 w-2.5" />
                  {activeCategory}
                </Badge>
              )}
              <span className="ml-2 text-[11px] opacity-60">· powered by Exa neural search</span>
            </p>
            <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
          </div>

          <div className={cn("grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
            {results.map((r) => (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 rounded-2xl border border-border/70 bg-card/70 p-4 transition-all hover:border-primary/40 hover:bg-card/90 hover:shadow-[0_0_16px_rgba(var(--primary-rgb),.1)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground group-hover:text-primary-glow">
                    {r.title}
                  </h3>
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50 group-hover:text-primary-glow" />
                </div>

                {r.snippet && (
                  <p className="line-clamp-2 text-xs leading-relaxed text-foreground/60">
                    {r.snippet}
                  </p>
                )}

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded bg-background/60 px-1.5 py-0.5 font-mono">
                    {getDomain(r.url)}
                  </span>
                  {r.publishedDate && (
                    <>
                      <span>·</span>
                      <span>{formatDate(r.publishedDate)}</span>
                    </>
                  )}
                  {r.author && (
                    <>
                      <span>·</span>
                      <span className="truncate max-w-[100px]">{r.author}</span>
                    </>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Empty state after search */}
      {!isLoading && query && results.length === 0 && !error && (
        <div className="rounded-xl border border-border/60 bg-card/50 px-5 py-8 text-center text-sm text-muted-foreground">
          No results found for <span className="italic">"{query}"</span> in vanlife sources.
          <br />
          <button
            onClick={() => search(query, { focusVanlife: false })}
            className="mt-2 text-primary-glow underline-offset-2 hover:underline"
          >
            Search the open web instead
          </button>
        </div>
      )}
    </div>
  );
};

export default ExaVanSearch;
