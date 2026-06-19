#!/usr/bin/env tsx
/**
 * Import real YouTube videos to Supabase
 * 
 * Usage:
 *   npm run import:videos
 * 
 * Requires:
 *   SUPABASE_URL or VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
  console.error('\nAdd these to .env file:');
  console.error('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function importVideos() {
  console.log('🎬 Importing real YouTube videos to Supabase...\n');
  console.log('📍 Database:', SUPABASE_URL);
  console.log('');

  // Load the real videos JSON
  const videosPath = './public/data/salvaged/realVideos.json';
  
  let videosData: any;
  
  try {
    const rawData = await fs.readFile(videosPath, 'utf-8');
    videosData = JSON.parse(rawData);
    console.log(`✓ Loaded ${videosData.videos.length} real YouTube videos\n`);
  } catch (error) {
    console.error('✗ Failed to load realVideos.json:', error);
    process.exit(1);
  }

  console.log('🔍 Checking existing videos in database...');
  
  const { data: existingVideos, error: fetchError } = await supabase
    .from('youtube_videos')
    .select('youtube_id');

  if (fetchError) {
    console.error('✗ Failed to fetch existing videos:', fetchError.message);
    process.exit(1);
  }

  const existingIds = new Set(existingVideos?.map(v => v.youtube_id) || []);
  console.log(`✓ Found ${existingIds.size} existing videos in database\n`);

  console.log('📥 Importing videos...\n');
  
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const video of videosData.videos) {
    const youtubeId = video.youtubeId;
    
    if (existingIds.has(youtubeId)) {
      console.log(`   ↷  Skipped (exists): ${video.title}`);
      skipped++;
      continue;
    }

    // Convert to Supabase schema
    const record = {
      youtube_id: youtubeId,
      title: video.title,
      description: video.description || '',
      thumbnail_url: video.thumbnail,
      channel_title: video.channel,
      channel_id: video.channelUrl.split('/').pop() || video.channel.replace(/\s+/g, ''),
      published_at: new Date().toISOString(), // Use current date since we don't have exact dates
      duration: video.duration,
      view_count: video.viewCount,
      like_count: null,
      category: video.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
      tags: video.tags || [],
      is_featured: false,
    };

    const { error: insertError } = await supabase
      .from('youtube_videos')
      .insert([record]);

    if (insertError) {
      console.log(`   ✗ Failed: ${video.title}`);
      console.log(`      Error: ${insertError.message}`);
      failed++;
    } else {
      console.log(`   ✓ Imported: ${video.title} (${video.channel})`);
      imported++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 Import Summary');
  console.log('='.repeat(70));
  console.log(`✓ Imported:  ${imported}`);
  console.log(`↷ Skipped:   ${skipped} (already exist)`);
  console.log(`✗ Failed:    ${failed}`);
  console.log(`📺 Total:     ${videosData.videos.length}`);
  console.log('='.repeat(70));

  if (imported > 0) {
    console.log('\n✅ Video import complete!');
    console.log(`   Added ${imported} new van life videos to the database`);
    console.log('   View at: http://localhost:8080/videos\n');
    
    // Show channels
    const channels = [...new Set(videosData.videos.map((v: any) => v.channel))];
    console.log(`📺 Channels represented (${channels.length}):`);
    channels.forEach((c: string) => console.log(`   • ${c}`));
    console.log('');
  } else if (skipped > 0) {
    console.log('\n⚠️  All videos already exist in database');
    console.log('   No new videos imported\n');
  } else {
    console.log('\n❌ No videos imported');
    if (failed > 0) {
      console.log('   Check errors above\n');
    }
  }

  // Note about fetching more
  console.log('💡 Next steps to get more videos:');
  console.log('   1. Set up YouTube Data API key (YOUTUBE_API_KEY)');
  console.log('   2. The fetch-youtube-videos Edge Function can pull from 19 curated channels');
  console.log('   3. Channels list at: docs/salvaged/video-links.md\n');
}

importVideos().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
