import { createClient } from '@supabase/supabase-js';
import { verifiedLocations, verifiedVideos } from '../src/data/vancietyVerified';
import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const [key, ...rest] = line.split('=');
    if (!process.env[key]) {
      process.env[key] = rest.join('=').replace(/^['"]|['"]$/g, '');
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env'));

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in local .env');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const locationRows = verifiedLocations.map((item) => ({
  name: item.name,
  description: item.description,
  latitude: item.latitude,
  longitude: item.longitude,
  type: item.type,
  amenities: item.amenities,
  rating: item.verified ? 5 : 0,
  reviews_count: 0,
  images: item.imageUrl ? [item.imageUrl] : [],
  contact_info: {
    url: item.url,
    source_badge: item.sourceBadge,
  },
  verified: item.verified,
  status: item.sourceBadge,
  url: item.url,
}));

const videoRows = verifiedVideos.map((item) => ({
  youtube_id: item.youtubeId,
  title: item.title,
  description: `Verified Vanciety source: ${item.sourceQuery}`,
  thumbnail_url: item.thumbnail,
  channel_title: item.channel,
  channel_id: null,
  published_at: null,
  duration: null,
  view_count: 0,
  like_count: 0,
  category: item.category,
  tags: [item.sourceQuery, item.category, 'vanciety-verified'],
  is_featured: ['builds', 'electrical', 'offroad', 'camping'].includes(item.category),
}));

async function countRows(table: string) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) throw new Error(`${table} count failed: ${error.message}`);
  return count ?? 0;
}

type SupabaseRow = Record<string, unknown>;
type UpsertOptions = { onConflict: string };

async function insertIfEmpty(table: string, rows: SupabaseRow[]) {
  const before = await countRows(table);
  if (before > 0) return { before, after: before, inserted: 0, skipped: true };
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`${table} insert failed: ${error.message}`);
  const after = await countRows(table);
  return { before, after, inserted: rows.length, skipped: false };
}

async function upsertChecked(table: string, rows: SupabaseRow[], options: UpsertOptions) {
  const { error } = await supabase.from(table).upsert(rows, options);
  if (error) throw new Error(`${table} upsert failed: ${error.message}`);
  const after = await countRows(table);
  return { before: null, after, inserted: rows.length, skipped: false };
}

const locationResult = await insertIfEmpty('locations', locationRows);
const videoResult = await upsertChecked('youtube_videos', videoRows, { onConflict: 'youtube_id' });

console.log(JSON.stringify({
  seeded_locations: locationResult.inserted,
  seeded_videos: videoResult.inserted,
  remote_location_count: locationResult.after,
  remote_video_count: videoResult.after,
  locations_skipped_existing_data: locationResult.skipped,
}, null, 2));
