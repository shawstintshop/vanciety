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
const yt = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const LATEST_VIDEOS: LatestVideo[] = [
  // ── Most recent batch (update these weekly) ──────────────────────────────
  {
    youtubeId: "YpHsKFhMmE4",
    title: "Complete Solar Setup for Van Life — 400Ah Lithium System",
    channel: "Will Prowse",
    category: "builds",
    categoryLabel: CAT_LABELS["builds"],
    publishedAt: "2025-06-18T12:00:00Z",
    thumbnail: yt("YpHsKFhMmE4"),
  },
  {
    youtubeId: "qH8kYKN8JfY",
    title: "Complete Sprinter Van Conversion Build Tour",
    channel: "Eamon & Bec",
    category: "van-tours",
    categoryLabel: CAT_LABELS["van-tours"],
    publishedAt: "2025-06-17T14:00:00Z",
    thumbnail: yt("qH8kYKN8JfY"),
  },
  {
    youtubeId: "w7PfpzQCS0g",
    title: "Van Life Electrical System Explained — Beginner to Advanced",
    channel: "Build A Green RV",
    category: "builds",
    categoryLabel: CAT_LABELS["builds"],
    publishedAt: "2025-06-16T10:00:00Z",
    thumbnail: yt("w7PfpzQCS0g"),
  },
  {
    youtubeId: "RKJlJFBpGYE",
    title: "Our $80K Sprinter Van Build Tour — Every Detail Explained",
    channel: "Kara and Nate",
    category: "van-tours",
    categoryLabel: CAT_LABELS["van-tours"],
    publishedAt: "2025-06-15T16:00:00Z",
    thumbnail: yt("RKJlJFBpGYE"),
  },
  {
    youtubeId: "ZRbpVxMT3Yk",
    title: "Budget Transit Van Build Tour — Under $5K Complete Setup",
    channel: "Nomadic Fanatic",
    category: "van-tours",
    categoryLabel: CAT_LABELS["van-tours"],
    publishedAt: "2025-06-14T11:00:00Z",
    thumbnail: yt("ZRbpVxMT3Yk"),
  },
  {
    youtubeId: "vN3us_AgNMc",
    title: "Full-Time Van Life — 2 Years Living in a Sprinter",
    channel: "Exploring Alternatives",
    category: "van-life",
    categoryLabel: CAT_LABELS["van-life"],
    publishedAt: "2025-06-13T09:00:00Z",
    thumbnail: yt("vN3us_AgNMc"),
  },
  {
    youtubeId: "TnIJFMKIFgU",
    title: "EcoFlow Delta Pro Review — Best Van Life Power Station 2025",
    channel: "Will Prowse",
    category: "reviews",
    categoryLabel: CAT_LABELS["reviews"],
    publishedAt: "2025-06-12T15:00:00Z",
    thumbnail: yt("TnIJFMKIFgU"),
  },
  {
    youtubeId: "GBkHBBFHkFo",
    title: "Webasto Diesel Heater Install — Step by Step Guide",
    channel: "Gnomad Home",
    category: "van-upgrades",
    categoryLabel: CAT_LABELS["van-upgrades"],
    publishedAt: "2025-06-11T13:00:00Z",
    thumbnail: yt("GBkHBBFHkFo"),
  },
  {
    youtubeId: "xwFNdBxBKbA",
    title: "Couple's Sprinter Van Tour — 3 Years on the Road",
    channel: "Gnomad Home",
    category: "van-tours",
    categoryLabel: CAT_LABELS["van-tours"],
    publishedAt: "2025-06-10T10:00:00Z",
    thumbnail: yt("xwFNdBxBKbA"),
  },
  // ── Previous week (shown on Videos page, not homepage) ───────────────────
  {
    youtubeId: "rZvZBMlRLYo",
    title: "Jackery 2000 Pro vs EcoFlow Delta 2 — Full Comparison",
    channel: "DIY Solar Power with Will Prowse",
    category: "reviews",
    categoryLabel: CAT_LABELS["reviews"],
    publishedAt: "2025-06-09T12:00:00Z",
    thumbnail: yt("rZvZBMlRLYo"),
  },
  {
    youtubeId: "pHqRSbW9bKs",
    title: "Best Composting Toilet for Van Life — Nature's Head Review",
    channel: "Gnomad Home",
    category: "van-products",
    categoryLabel: CAT_LABELS["van-products"],
    publishedAt: "2025-06-08T14:00:00Z",
    thumbnail: yt("pHqRSbW9bKs"),
  },
  {
    youtubeId: "mMzFdHFNMiM",
    title: "ProMaster Van Build Tour — Off-Grid Ready",
    channel: "Tiny Home Tours",
    category: "van-tours",
    categoryLabel: CAT_LABELS["van-tours"],
    publishedAt: "2025-06-07T11:00:00Z",
    thumbnail: yt("mMzFdHFNMiM"),
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
