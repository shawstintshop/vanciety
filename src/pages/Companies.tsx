import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Building2,
  BadgeCheck,
  MapPin,
  Star,
  ArrowRight,
  Loader2,
} from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getPublishedCompanies } from "@/lib/companies/queries";
import type { Company } from "@/lib/companies/types";

const ALL_VALUE = "all";

const CATEGORIES = [
  "Van Builders",
  "Parts & Fabrication",
  "Electrical & Power",
  "Gear & Accessories",
  "Wheels & Tires",
  "Suspension & Lift Kits",
  "Interior & Furniture",
  "Exterior Accessories",
  "Adventure Vans",
  "Mechanics & Installers",
  "Event Organizers",
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const PAGE_SIZE = 12;

const Companies = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL_VALUE);
  const [state, setState] = useState<string>(ALL_VALUE);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredFirst, setFeaturedFirst] = useState(true);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Debounce the search input before triggering a re-query.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // Re-query whenever any server-side filter changes.
  useEffect(() => {
    let active = true;
    setLoading(true);

    const filters: {
      category?: string;
      state?: string;
      search?: string;
    } = {};
    if (category !== ALL_VALUE) filters.category = category;
    if (state !== ALL_VALUE) filters.state = state;
    if (debouncedSearch) filters.search = debouncedSearch;

    getPublishedCompanies(filters)
      .then((data) => {
        if (!active) return;
        setCompanies(data || []);
      })
      .catch(() => {
        if (!active) return;
        setCompanies([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category, state, debouncedSearch]);

  // Reset pagination when the filter set changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, state, debouncedSearch, verifiedOnly, featuredFirst]);

  // Apply client-side "Verified Only" + "Featured First".
  const filtered = companies.filter((c) => (verifiedOnly ? c.verified === true : true));

  const sorted = featuredFirst
    ? [...filtered].sort((a, b) => {
        const af = a.featured ? 1 : 0;
        const bf = b.featured ? 1 : 0;
        return bf - af;
      })
    : filtered;

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-white/10 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-20">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find Every Van Life Brand in{" "}
              <span className="text-lime-400">One Place</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
              Browse builders, parts makers, electrical specialists, and the
              gear that powers life on the road.
            </p>

            <div className="relative mx-auto mt-8 max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies, categories, or locations..."
                className="h-14 rounded-xl border-white/10 bg-gray-900 pl-12 pr-4 text-base text-white placeholder:text-gray-500 focus-visible:ring-lime-500"
              />
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <section className="border-b border-white/10 bg-gray-950/60 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                {/* Inline search (mirrors the hero search) */}
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="border-white/10 bg-gray-900 pl-9 text-white placeholder:text-gray-500 focus-visible:ring-lime-500"
                  />
                </div>

                {/* Category */}
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full border-white/10 bg-gray-900 text-white focus:ring-lime-500 sm:w-56">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-gray-900 text-white">
                    <SelectItem value={ALL_VALUE}>All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* State */}
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="w-full border-white/10 bg-gray-900 text-white focus:ring-lime-500 sm:w-40">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 border-white/10 bg-gray-900 text-white">
                    <SelectItem value={ALL_VALUE}>All States</SelectItem>
                    {US_STATES.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant={verifiedOnly ? "default" : "outline"}
                  onClick={() => setVerifiedOnly((v) => !v)}
                  className={
                    verifiedOnly
                      ? "bg-lime-500 text-gray-950 hover:bg-lime-400"
                      : "border-white/10 bg-transparent text-gray-300 hover:bg-gray-900 hover:text-white"
                  }
                >
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Verified Only
                </Button>
                <Button
                  type="button"
                  variant={featuredFirst ? "default" : "outline"}
                  onClick={() => setFeaturedFirst((v) => !v)}
                  className={
                    featuredFirst
                      ? "bg-lime-500 text-gray-950 hover:bg-lime-400"
                      : "border-white/10 bg-transparent text-gray-300 hover:bg-gray-900 hover:text-white"
                  }
                >
                  <Star className="mr-2 h-4 w-4" />
                  Featured First
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <p className="mb-6 text-sm text-gray-400">
            {loading
              ? "Loading companies..."
              : `Showing ${sorted.length} ${
                  sorted.length === 1 ? "company" : "companies"
                }`}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <Loader2 className="mr-3 h-6 w-6 animate-spin text-lime-400" />
              Loading companies...
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-gray-900 py-24 text-center">
              <Building2 className="mb-4 h-12 w-12 text-gray-600" />
              <h3 className="text-lg font-semibold text-white">
                No companies found
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                Try adjusting your search, category, or state filters to find
                more results.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setVisibleCount((count) => count + PAGE_SIZE)
                    }
                    className="border-lime-500/40 bg-transparent text-lime-400 hover:bg-lime-500 hover:text-gray-950"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const description = company.short_description || company.description || "";
  const subcategories = (company.subcategories || []).slice(0, 3);
  const location = [company.city, company.state].filter(Boolean).join(", ");

  return (
    <Card
      className={`relative flex h-full flex-col overflow-hidden bg-gray-900 transition-colors hover:bg-gray-900/70 ${
        company.featured ? "border-lime-500" : "border-white/10"
      }`}
    >
      {company.featured && (
        <Badge className="absolute right-3 top-3 z-10 bg-lime-500 text-gray-950 hover:bg-lime-500">
          Featured
        </Badge>
      )}

      <CardContent className="flex h-full flex-col p-5">
        {/* Header: logo + verified */}
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gray-950">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={`${company.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-7 w-7 text-gray-500" />
            )}
          </div>

          <div className="min-w-0 flex-1 pr-12">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-base font-semibold text-white">
                {company.name}
              </h3>
              {company.verified && (
                <BadgeCheck className="h-4 w-4 flex-shrink-0 text-lime-400" />
              )}
            </div>
            {company.tagline && (
              <p className="truncate text-sm text-gray-400">
                {company.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="mt-4">
          <Badge className="bg-lime-500 text-gray-950 hover:bg-lime-500">
            {company.category}
          </Badge>
        </div>

        {/* Location */}
        {location && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-400">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {/* Stars (visual only) */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-lime-400 text-lime-400"
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">Reviews</span>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-300">
            {description}
          </p>
        )}

        {/* Subcategory chips */}
        {subcategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {subcategories.map((sub) => (
              <span
                key={sub}
                className="rounded-full border border-white/10 bg-gray-950 px-2.5 py-0.5 text-xs text-gray-300"
              >
                {sub}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-5">
          <Button
            asChild
            className="w-full bg-lime-500 text-gray-950 hover:bg-lime-400"
          >
            <Link to={`/companies/${company.slug}`}>
              View Company
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Companies;
