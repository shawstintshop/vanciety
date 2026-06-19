# Vanciety / SprinterSociety — Salvaged Video Links

> Extracted from all old project folders on 2025-06-17

## YouTube Channel — Official
- **YouTube**: https://youtube.com/@sprintersociety

## YouTube Channels Referenced (Van Life Content Creators)
These channels were curated in the `videoDatabase.ts` as featured content sources:

| Channel | YouTube URL |
|---------|------------|
| Eamon & Bec | https://www.youtube.com/@EamonAndBec |
| Vancity Vanlife | https://www.youtube.com/@VancityVanlife |
| Outside Van | https://www.youtube.com/@OutsideVan |
| Kara and Nate | https://www.youtube.com/@KaraandNate |
| cheaprvliving | https://www.youtube.com/@cheaprvliving |
| Gone with the Wynns | https://www.youtube.com/@GonewiththewynnsRV |
| Nate Murphy | https://www.youtube.com/@NateMurphy |
| Will Prowse | https://www.youtube.com/@WillProwse |
| Farout Ride | https://www.youtube.com/@FaroutRide |
| Build A Green RV | https://www.youtube.com/@BuildAGreenRV |
| Van Life Eats | https://www.youtube.com/@VanLifeEats |
| Nomadic Fanatic | https://www.youtube.com/@NomadicFanatic |
| The Modern Survivalist | https://www.youtube.com/@ModernSurvivalist |
| Van Life For Dummies | https://www.youtube.com/@VanLifeForDummies |
| Solar Talk | https://www.youtube.com/@SolarTalk |
| Mortons on the Move | https://www.youtube.com/@MortonsontheMove |
| Keep Your Daydream | https://www.youtube.com/@KeepYourDaydream |
| Van Life App | https://www.youtube.com/@VanLifeApp |
| The Van Life Journey | https://www.youtube.com/@TheVanLifeJourney |

## Real YouTube Video IDs (Embedded in videoDatabase.ts)
These are actual YouTube video IDs used in the old builds:

| Video ID | Embed URL | Context |
|----------|-----------|---------|
| qH8kYKN8JfY | https://www.youtube.com/embed/qH8kYKN8JfY | Builds & Tours |
| Ge_LDxf7LpI | https://www.youtube.com/embed/Ge_LDxf7LpI | Van content |
| Moy25MABCZ8 | https://www.youtube.com/embed/Moy25MABCZ8 | Van content |
| WVDQEoe6ZWY | https://www.youtube.com/embed/WVDQEoe6ZWY | Van content |
| YpHsKFhMmE4 | https://www.youtube.com/embed/YpHsKFhMmE4 | Van content |
| oJdls_rD7LY | https://www.youtube.com/embed/oJdls_rD7LY | Van content |
| w7PfpzQCS0g | https://www.youtube.com/embed/w7PfpzQCS0g | Van content |
| xXHPd5rqBPo | https://www.youtube.com/embed/xXHPd5rqBPo | Van content |

## Placeholder Video IDs (NOT real content — skip these)
- `dQw4w9WgXcQ` (Rick Astley - placeholder)
- `9bZkp7q19f0` (Gangnam Style - placeholder)
- `jNQXAC9IVRw` (First YouTube video - placeholder)
- `kJQP7kiw5Fk` (Despacito - placeholder)
- `y6120QOlsfU` (Placeholder)
- `interior1`–`interior9`, `mech1`–`mech8`, `plumb1`–`plumb8`, `solar3`–`solar10`, `tools1`–`tools10`, `reviews1`–`reviews10`, `vanlife1`–`vanlife12`, `demo7`–`demo12` (all placeholder stubs)

## Video Categories Used
The video gallery system supported these categories:
- Builds & Tours (12 videos)
- Solar & Electrical
- Mechanical / Maintenance
- Interior Design
- Plumbing
- Tools & Equipment
- Reviews
- Van Life Adventures
- Featured

## YouTube Integration
- The `fetch-youtube-videos` Supabase Edge Function in `vanciety.com` searches YouTube API for van life content
- Uses queries like "sprinter van build", "van life travel", "van conversion" 
- Auto-categorizes and stores in `youtube_videos` table
- YouTube API key required (configured via Supabase secrets)

## Source Files
- `/Downloads/Sprinter-Society-cursor-main/deployment-20250806-202004/_archive-20250812-190824/src/data/videoDatabase.ts` — Main video database (1,693 lines, 70KB)
- `/Downloads/Sprinter-Society-cursor-main/js/video-gallery.js` — Frontend gallery (695 lines)
- `/Downloads/sprintersociety/src/services/youtubeService.ts` — YouTube API integration
- `/Projects/vanciety.com/functions/fetch-youtube-videos/index.ts` — Supabase Edge Function
