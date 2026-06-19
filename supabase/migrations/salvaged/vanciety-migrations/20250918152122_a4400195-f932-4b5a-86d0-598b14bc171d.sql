-- Update video thumbnails to use real working YouTube thumbnails
UPDATE public.youtube_videos 
SET thumbnail_url = CASE 
  WHEN youtube_id = 'sprinter2025_build' THEN 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  WHEN youtube_id = 'sprinter_accessories' THEN 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg'
  WHEN youtube_id = 'coolest_accessories' THEN 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg'
  WHEN youtube_id = 'best_conversion_companies' THEN 'https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg'
  ELSE thumbnail_url
END;