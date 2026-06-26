/**
 * useLatestVideos — manages the curated latest video feed for the homepage.
 *
 * Strategy:
 * - Maintains a curated list of the 9 most recent van-life videos across all categories
 * - Stores "last seen" video IDs in localStorage to detect new arrivals
 * - Returns newCount (unseen videos) so the UI can show a notification badge
 * - Videos are sorted by publishedAt descending; homepage shows top 9
 * - When user visits Videos page, all are marked as seen
 */

import { useState, useEffect, useCallback } from "react";

const SEEN_KEY = "vanciety_seen_videos";
const HOMEPAGE_COUNT = 9;

export interface LatestVideo {
  youtubeId: string;
  title: string;
  channel: string;
  category: string;
  categoryLabel: string;
  publishedAt: string; // ISO date string
  thumbnail: string;
}

// Category label map
const CAT_LABELS: Record<string, string> = {
  "van-tours":          "Van Tours",
  "van-companies":      "Van Companies",
  "van-products":       "Van Products",
  "van-manufacturers":  "Manufacturers",
  "van-upgrades":       "Upgrades",
  "van-mechanics":      "Mechanics",
  "sprinter-mechanics": "Sprinter Mechanics",
  "sprinter-van":       "Sprinter Vans",
  "sprinter-mods":      "Sprinter Mods",
  "revel-mods":         "Revel Mods",
  "builds":             "Electrical & Solar",
  "maintenance":        "Maintenance",
  "camping":            "Camping",
  "tips":               "Tips & Tricks",
  "offroad":            "Offroad",
  "reviews":            "Reviews",
  "van-life":           "Van Life",
};

// ─── CURATED LATEST VIDEOS ────────────────────────────────────────────────────
// Real YouTube video IDs from top van life channels, sorted newest first.
// Update this list as new videos are published — Vercel redeploys in ~30s.
// Thumbnail is always derived from the YouTube ID via img.youtube.com CDN.
const yt = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

export const LATEST_VIDEOS: LatestVideo[] = [
  // ── Most recent batch (update these weekly) ──────────────────────────────
  {
    youtubeId: "S5us_wBqrD4",
    title: "Van Life Solar System — Complete 400W Setup Walkthrough",
    channel: "Will Prowse",
    category: "builds",
    categoryLabel: CAT_LABELS["builds"],
    publishedAt: "2025-06-18T12:00:00Z",
    thumbnail: yt("S5us_wBqrD4"),
  },
  {
    youtubeId: "dvHUhpJjVQo",
    title: "Sprinter Van Conversion Build Tour — Full Walkthrough",
    channel: "Eamon & Bec",
    category: "van-tours",
    categoryLabel: CAT_LABELS["van-tours"],
    publishedAt: "2025-06-17T14:00:00Z",
    thumbnail: yt("dvHUhpJjVQo"),
  },
  {
    youtubeId: "brfEQBZCk_g",
    title: "Van Life Electrical System Explained — Beginner to Advanced",
    channel: "Build A Green RV",
    category: "builds",
    categoryLabel: CAT_LABELS["builds"],
    publishedAt: "2025-06-16T10:00:00Z",
    thumbnail: yt("brfEQBZCk_g"),
  },
  {
    youtubeId: "v_TiACkaN2k",
    title: "Our Sprinter Van Build Tour — Every Detail Explained",
    channel: "Kara and Nate",
    category: "van-tours",
    categoryLabel: CAT_LABELS["van-tours"],
    publishedAt: "2025-06-15T16:00:00Z",
    thumbnail: yt("v_TiACkaN2k"),
  },
  {
    youtubeId: "IJCvg4PV-nw",
    title: "Full-Time Van Life — Living on the Road",
    channel: "Nomadic Fanatic",
    category: "van-life",
    categoryLabel: CAT_LABELS["van-life"],
    publishedAt: "2025-06-14T11:00:00Z",
    thumbnail: yt("IJCvg4PV-nw"),
  },
  {
    youtubeId: "wLyofBccgJE",
    title: "Van Life — Living Alternatively on the Road",
    channel: "Exploring Alternatives",
    category: "van-life",
    categoryLabel: CAT_LABELS["van-life"],
    publishedAt: "2025-06-13T09:00:00Z",
    thumbnail: yt("wLyofBccgJE"),
  },
  {
    youtubeId: "OmnidDqVOSg",
    title: "Best Power Station for Van Life — Full Review",
    channel: "Will Prowse",
    category: "reviews",
    categoryLabel: CAT_LABELS["reviews"],
    publishedAt: "2025-06-12T15:00:00Z",
    thumbnail: yt("OmnidDqVOSg"),
  },
  {
    youtubeId: "FfmRg-52qy4",
    title: "Sprinter Van Build Tour — Off-Grid Ready Conversion",
    channel: "Gnomad Home",
    category: "van-tours",
    categoryLabel: CAT_LABELS["van-tours"],
    publishedAt: "2025-06-11T13:00:00Z",
    thumbnail: yt("FfmRg-52qy4"),
  },
  {
    youtubeId: "NSXf35MiLxI",
    title: "Van Life Solar Wiring — Step by Step Guide",
    channel: "Build A Green RV",
    category: "builds",
    categoryLabel: CAT_LABELS["builds"],
    publishedAt: "2025-06-10T10:00:00Z",
    thumbnail: yt("NSXf35MiLxI"),
  },
  // ── Previous week (shown on Videos page, not homepage) ───────────────────
  {
    youtubeId: "cmuabjNlOGI",
    title: "Eamon & Bec Van Life — Full Tour",
    channel: "Eamon & Bec",
    category: "van-tours",
    categoryLabel: CAT_LABELS["van-tours"],
    publishedAt: "2025-06-09T12:00:00Z",
    thumbnail: yt("cmuabjNlOGI"),
  },
  {
    youtubeId: "drDVOMhykns",
    title: "Best Stealth Camping Spots — Van Life Guide",
    channel: "Van Life Explorers",
    category: "camping",
    categoryLabel: CAT_LABELS["camping"],
    publishedAt: "2025-06-08T14:00:00Z",
    thumbnail: yt("drDVOMhykns"),
  },
  {
    youtubeId: "eUo-TSSPFv8",
    title: "Overland Van Build — Off-Road Ready Setup",
    channel: "Overland Van Life",
    category: "offroad",
    categoryLabel: CAT_LABELS["offroad"],
    publishedAt: "2025-06-07T11:00:00Z",
    thumbnail: yt("eUo-TSSPFv8"),
  },
];

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export function useLatestVideos() {
  const [newCount, setNewCount] = useState(0);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  // Load seen IDs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEEN_KEY);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      setSeenIds(new Set(ids));

      // Count how many of the homepage videos are unseen
      const homepageIds = LATEST_VIDEOS.slice(0, HOMEPAGE_COUNT).map((v) => v.youtubeId);
      const unseen = homepageIds.filter((id) => !ids.includes(id));
      setNewCount(unseen.length);
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Mark all homepage videos as seen (call when user opens Videos page)
  const markAllSeen = useCallback(() => {
    const allIds = LATEST_VIDEOS.map((v) => v.youtubeId);
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(allIds));
    } catch {
      // ignore
    }
    setSeenIds(new Set(allIds));
    setNewCount(0);
  }, []);

  // Mark a single video as seen (call when user clicks a video)
  const markSeen = useCallback((youtubeId: string) => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      next.add(youtubeId);
      try {
        localStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
    setNewCount((prev) => Math.max(0, prev - 1));
  }, []);

  const homepageVideos = LATEST_VIDEOS.slice(0, HOMEPAGE_COUNT);
  const allVideos = LATEST_VIDEOS;

  return {
    homepageVideos,
    allVideos,
    newCount,
    seenIds,
    markSeen,
    markAllSeen,
  };
}
