/**
 * Topo Hydration Script — ingest TOP_LOCATIONS.md into the `locations` table.
 *
 * Usage:
 *   npm run ingest:locations
 *
 * Requires server-only env vars (loaded via dotenv):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * The service role key bypasses RLS, so this MUST only ever run server-side /
 * locally — never ship it to the browser bundle.
 */

import "dotenv/config";
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const TOP_LOCATIONS_PATH =
  "/Volumes/AI-DATA/PROJECTS/vanciety_platform/content/topo/TOP_LOCATIONS.md";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "[ingest:locations] Missing required env vars. Set SUPABASE_URL and " +
      "SUPABASE_SERVICE_ROLE_KEY (e.g. in a .env file). Aborting."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Allowed location types in the app (lowercase). */
const TYPE_MAP: Record<string, string> = {
  poi: "poi",
  event: "event",
  business: "business",
  campsite: "campsite",
  driveway: "driveway",
  meetup: "meetup",
};

interface ParsedLocation {
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  description: string;
  amenities: string[];
}

/**
 * Parse every markdown table row across all sections. We treat any line that
 * looks like a 5-cell table row (`| a | b | c | d | e |`) as a candidate and
 * filter out the header / separator rows by inspecting the cells.
 */
function parseMarkdown(raw: string): {
  rows: ParsedLocation[];
  skipped: { line: string; reason: string }[];
} {
  const rows: ParsedLocation[] = [];
  const skipped: { line: string; reason: string }[] = [];

  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;

    // Split into cells, dropping the leading/trailing empty cells from the
    // outer pipes.
    const cells = trimmed
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());

    if (cells.length !== 5) {
      skipped.push({ line: trimmed, reason: `expected 5 cells, got ${cells.length}` });
      continue;
    }

    const [name, typeRaw, latRaw, lngRaw, description] = cells;

    // Header row: "Name | Type | Latitude | Longitude | Description"
    if (name.toLowerCase() === "name" && typeRaw.toLowerCase() === "type") {
      continue;
    }

    // Separator row: "|------|------|..."
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) {
      continue;
    }

    if (!name) {
      skipped.push({ line: trimmed, reason: "empty name" });
      continue;
    }

    const type = TYPE_MAP[typeRaw.toLowerCase()];
    if (!type) {
      skipped.push({ line: trimmed, reason: `unknown type "${typeRaw}"` });
      continue;
    }

    const latitude = Number(latRaw);
    const longitude = Number(lngRaw);

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      skipped.push({ line: trimmed, reason: `invalid latitude "${latRaw}"` });
      continue;
    }
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      skipped.push({ line: trimmed, reason: `invalid longitude "${lngRaw}"` });
      continue;
    }

    rows.push({
      name,
      type,
      latitude,
      longitude,
      description: description || "",
      // TOP_LOCATIONS.md has no amenities column. Do not hallucinate values.
      amenities: [],
    });
  }

  return { rows, skipped };
}

async function main() {
  let raw: string;
  try {
    raw = readFileSync(TOP_LOCATIONS_PATH, "utf8");
  } catch (err) {
    console.error(
      `[ingest:locations] Could not read ${TOP_LOCATIONS_PATH}: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    process.exit(1);
  }

  const { rows, skipped } = parseMarkdown(raw);

  let inserts = 0;
  let updates = 0;
  const failures: { name: string; message: string }[] = [];

  for (const row of rows) {
    try {
      // No unique constraint on name, so dedupe on name + lat + lng.
      const { data: existing, error: selectError } = await supabase
        .from("locations")
        .select("id")
        .eq("name", row.name)
        .eq("latitude", row.latitude)
        .eq("longitude", row.longitude)
        .maybeSingle();

      if (selectError) {
        failures.push({ name: row.name, message: selectError.message });
        continue;
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from("locations")
          .update({
            type: row.type,
            description: row.description,
            amenities: row.amenities,
          })
          .eq("id", existing.id);

        if (updateError) {
          failures.push({ name: row.name, message: updateError.message });
          continue;
        }
        updates++;
      } else {
        const { error: insertError } = await supabase.from("locations").insert({
          name: row.name,
          type: row.type,
          latitude: row.latitude,
          longitude: row.longitude,
          description: row.description,
          amenities: row.amenities,
        });

        if (insertError) {
          failures.push({ name: row.name, message: insertError.message });
          continue;
        }
        inserts++;
      }
    } catch (err) {
      failures.push({
        name: row.name,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  console.log("\n[ingest:locations] Summary");
  console.log("--------------------------------");
  console.log(`Total parsed      : ${rows.length}`);
  console.log(`Successful inserts: ${inserts}`);
  console.log(`Successful updates: ${updates}`);
  console.log(`Skipped invalid   : ${skipped.length}`);
  console.log(`Failures          : ${failures.length}`);

  if (skipped.length > 0) {
    console.log("\nSkipped rows:");
    for (const s of skipped) {
      console.log(`  - ${s.reason}: ${s.line}`);
    }
  }

  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const f of failures) {
      console.log(`  - ${f.name}: ${f.message}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(
    `[ingest:locations] Unexpected error: ${
      err instanceof Error ? err.message : String(err)
    }`
  );
  process.exit(1);
});
