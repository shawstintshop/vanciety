#!/usr/bin/env node
/**
 * Extract video data from videoDatabase.ts and convert to JSON
 * This handles the TypeScript module and extracts the 87 videos
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Converting videoDatabase.ts to JSON...\n');

// Read the videoDatabase.ts file
const videoDbPath = path.join(__dirname, '../public/data/salvaged/videoDatabase.ts');
const content = fs.readFileSync(videoDbPath, 'utf-8');

// Extract video objects using regex
// Each video follows this pattern:
// {
//   id: 'something',
//   title: 'Title',
//   ...
// }

const videos = [];
let categoryName = 'General';

// Split by export const to find categories
const categories = content.split('export const ');

for (const section of categories) {
  // Extract category name
  const categoryMatch = section.match(/^(\w+)Videos: VideoData\[\] = \[/);
  if (categoryMatch) {
    categoryName = categoryMatch[1]
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase());
  }

  // Extract video objects - match everything between { and },
  const videoMatches = section.matchAll(/\{\s*id:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*description:\s*['"]([^'"]*?)['"],\s*thumbnail:\s*([^,]+),\s*embedUrl:\s*['"]([^'"]+)['"],\s*duration:\s*['"]([^'"]+)['"],\s*views:\s*['"]([^'"]+)['"],\s*publishedAt:\s*['"]([^'"]+)['"],\s*channelName:\s*['"]([^'"]+)['"],\s*channelUrl:\s*['"]([^'"]+)['"],\s*tags:\s*\[([^\]]+)\]/gs);

  for (const match of videoMatches) {
    const [
      _,
      id,
      title,
      description,
      thumbnail,
      embedUrl,
      duration,
      views,
      publishedAt,
      channelName,
      channelUrl,
      tagsRaw
    ] = match;

    // Parse tags
    const tags = tagsRaw
      .split(',')
      .map(t => t.trim().replace(/['"]/g, ''))
      .filter(Boolean);

    // Extract YouTube ID from embedUrl
    const youtubeIdMatch = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)/);
    const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : id;

    // Parse view count
    const viewCountMatch = views.match(/([\d.]+)([KM]?)/);
    let viewCount = 0;
    if (viewCountMatch) {
      const num = parseFloat(viewCountMatch[1]);
      const suffix = viewCountMatch[2];
      if (suffix === 'M') viewCount = Math.floor(num * 1000000);
      else if (suffix === 'K') viewCount = Math.floor(num * 1000);
      else viewCount = Math.floor(num);
    }

    videos.push({
      id,
      youtubeId,
      title: title.replace(/\\'/g, "'"),
      description: description.replace(/\\'/g, "'"),
      thumbnail,
      embedUrl,
      duration,
      views,
      viewCount,
      publishedAt,
      channelName,
      channelUrl,
      tags,
      category: categoryName,
      isVerified: true,
    });
  }
}

console.log(`✓ Extracted ${videos.length} videos\n`);

// Category breakdown
const categoryCounts = {};
videos.forEach(v => {
  categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
});

console.log('📊 By Category:');
Object.entries(categoryCounts).forEach(([cat, count]) => {
  console.log(`   ${cat}: ${count}`);
});

// Write to JSON
const outputPath = path.join(__dirname, '../public/data/salvaged/videoDatabase.json');
fs.writeFileSync(outputPath, JSON.stringify(videos, null, 2));

console.log(`\n✅ Saved to: public/data/salvaged/videoDatabase.json`);
console.log(`   Total videos: ${videos.length}`);
console.log(`   Ready for import to Supabase\n`);
