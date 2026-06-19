-- Create youtube_videos table for storing real YouTube content
CREATE TABLE public.youtube_videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_id text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  thumbnail_url text NOT NULL,
  channel_title text NOT NULL,
  channel_id text NOT NULL,
  published_at timestamp with time zone NOT NULL,
  duration text,
  view_count bigint,
  like_count bigint,
  category text NOT NULL DEFAULT 'van-life',
  tags text[],
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (videos are public content)
CREATE POLICY "YouTube videos are viewable by everyone" 
ON public.youtube_videos 
FOR SELECT 
USING (true);

-- Only authenticated users can manage videos (for admin purposes)
CREATE POLICY "Only authenticated users can manage videos" 
ON public.youtube_videos 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_youtube_videos_updated_at
BEFORE UPDATE ON public.youtube_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_youtube_videos_published_at ON public.youtube_videos(published_at DESC);
CREATE INDEX idx_youtube_videos_category ON public.youtube_videos(category);
CREATE INDEX idx_youtube_videos_featured ON public.youtube_videos(is_featured) WHERE is_featured = true;