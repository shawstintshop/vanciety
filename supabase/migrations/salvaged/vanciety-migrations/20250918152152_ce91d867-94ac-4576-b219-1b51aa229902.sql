-- Update with better van life thumbnails that actually exist
UPDATE public.youtube_videos 
SET thumbnail_url = CASE 
  WHEN youtube_id = 'sprinter2025_build' THEN 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg'
  WHEN youtube_id = 'sprinter_accessories' THEN 'https://i.ytimg.com/vi/M7lc1UVf-VE/maxresdefault.jpg'
  WHEN youtube_id = 'coolest_accessories' THEN 'https://i.ytimg.com/vi/ZZ5LpwO-An4/maxresdefault.jpg'
  WHEN youtube_id = 'best_conversion_companies' THEN 'https://i.ytimg.com/vi/HAIP40nNjvg/maxresdefault.jpg'
  ELSE thumbnail_url
END;