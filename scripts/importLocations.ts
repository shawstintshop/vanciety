#!/usr/bin/env tsx
/**
 * Import salvaged locations to Supabase
 * 
 * Usage:
 *   npm run import:locations
 * 
 * Requires:
 *   SUPABASE_URL or VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
config();

// Read environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL (or VITE_SUPABASE_URL)');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface Location {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  type: string;
  amenities?: string[];
  cost?: string;
  rating?: number;
  reviewCount?: number;
  isPremiumOnly?: boolean;
  isVerified?: boolean;
  date?: string;
  attendees?: number;
  maxAttendees?: number;
}

// Map salvaged types to Supabase schema types
function mapLocationType(type: string): string {
  const typeMap: Record<string, string> = {
    'camp_spot': 'campsite',
    'driveway_surf': 'driveway',
    'meetup': 'event',
    'vendor': 'business',
    'poi': 'poi'
  };
  return typeMap[type] || 'campsite';
}

async function importLocations() {
  console.log('📍 Starting locations import...\n');

  // Read locations JSON
  const locationsPath = path.join(__dirname, '../public/data/salvaged/northwest-locations.json');
  const locationsData: Location[] = JSON.parse(fs.readFileSync(locationsPath, 'utf-8'));

  console.log(`🗺️  Found ${locationsData.length} locations in salvaged data\n`);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const location of locationsData) {
    // Check if location already exists (by name + coordinates)
    const { data: existing } = await supabase
      .from('locations')
      .select('id')
      .eq('name', location.name)
      .eq('latitude', location.latitude)
      .eq('longitude', location.longitude)
      .single();

    if (existing) {
      console.log(`↷ Skipped: ${location.name} - already exists`);
      skipped++;
      continue;
    }

    // Prepare location data
    const locationData: any = {
      name: location.name,
      description: location.description,
      latitude: location.latitude,
      longitude: location.longitude,
      type: mapLocationType(location.type),
      amenities: location.amenities || [],
      verified: location.isVerified !== false,
      rating: location.rating || 0,
      reviews_count: location.reviewCount || 0
    };

    // Insert new location
    const { error } = await supabase
      .from('locations')
      .insert(locationData);

    if (error) {
      console.error(`✗ Failed: ${location.name} - ${error.message}`);
      failed++;
    } else {
      console.log(`✓ Imported: ${location.name} (${location.type})`);
      imported++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 Import Summary');
  console.log('='.repeat(70));
  console.log(`✓ Imported:  ${imported}`);
  console.log(`↷ Skipped:   ${skipped} (already exist)`);
  console.log(`✗ Failed:    ${failed}`);
  console.log(`🗺️  Total:     ${locationsData.length}`);
  console.log('='.repeat(70));

  // Query final counts by type
  const { count: campCount } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'campsite');

  const { count: driveCount } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'driveway');

  const { count: eventCount } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'event');

  console.log('\n📊 Database Totals:');
  console.log(`   Campsites: ${campCount || 0}`);
  console.log(`   Driveways: ${driveCount || 0}`);
  console.log(`   Events: ${eventCount || 0}`);

  process.exit(failed > 0 ? 1 : 0);
}

importLocations().catch((error) => {
  console.error('❌ Import failed:', error);
  process.exit(1);
});
