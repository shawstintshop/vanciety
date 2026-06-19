import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ExaResult {
  id: string;
  url: string;
  title: string;
  score?: number;
  publishedDate?: string;
  author?: string;
  snippet: string;
}

export interface ExaSearchOptions {
  category?: "builds" | "electrical" | "plumbing" | "camping" | "events" | "gear" | "mechanics" | "community" | "news";
  numResults?: number;
  freshness?: "day" | "week" | "month" | "year";
  focusVanlife?: boolean;
}

export interface UseExaSearchReturn {
  results: ExaResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
  search: (q: string, options?: ExaSearchOptions) => Promise<void>;
  clear: () => void;
}

// Simple in-memory cache: key = "query|options" → results
const cache = new Map<string, { results: ExaResult[]; ts: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useExaSearch(): UseExaSearchReturn {
  const [results, setResults] = useState<ExaResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (q: string, options: ExaSearchOptions = {}) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    const cacheKey = `${trimmed}|${JSON.stringify(options)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      setResults(cached.results);
      setQuery(trimmed);
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setQuery(trimmed);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("exa-search", {
        body: {
          query: trimmed,
          ...options,
          focusVanlife: options.focusVanlife ?? true,
          numResults: options.numResults ?? 8,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      const hits: ExaResult[] = data?.results ?? [];
      setResults(hits);
      cache.set(cacheKey, { results: hits, ts: Date.now() });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    setQuery("");
  }, []);

  return { results, isLoading, error, query, search, clear };
}
