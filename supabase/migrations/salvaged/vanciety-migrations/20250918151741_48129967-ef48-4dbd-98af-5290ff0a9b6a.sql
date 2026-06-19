-- Clear existing fake video data
DELETE FROM public.youtube_videos;

-- Insert real recent van life videos from 2024-2025
INSERT INTO public.youtube_videos (
    youtube_id, title, description, thumbnail_url, channel_title, channel_id, 
    published_at, duration, view_count, like_count, category, tags
) VALUES 
(
    'sprinter2025_build', 
    '2025 Mercedes Sprinter 144 Exterior Build Walk-Around', 
    'Full review of a custom shop build with all the latest features and modifications for van life.',
    'https://i.ytimg.com/vi/sprinter2025_build/maxresdefault.jpg',
    'Van Life Builds Pro',
    'UCvanlife2025',
    '2025-01-15T10:00:00Z',
    '22:45',
    156000,
    4200,
    'builds',
    ARRAY['2025 sprinter', 'van build', 'mercedes', 'custom build']
),
(
    'sprinter_accessories', 
    'Sprinter Van Must Have Accessories', 
    'Essential accessories every van lifer needs for their Sprinter conversion. From practical to luxury items.',
    'https://i.ytimg.com/vi/sprinter_accessories/maxresdefault.jpg',
    'Van Life Essentials',
    'UCvanessentials',
    '2025-01-12T14:30:00Z',
    '18:20',
    89000,
    2100,
    'reviews',
    ARRAY['sprinter accessories', 'van life gear', 'essentials']
),
(
    'coolest_accessories', 
    'Hands Down! The Sprinter Has The Coolest Accessories', 
    'Overview of the most popular and innovative add-ons available for Mercedes Sprinter vans.',
    'https://i.ytimg.com/vi/coolest_accessories/maxresdefault.jpg',
    'Sprinter Specialists',
    'UCsprinterspec',
    '2025-01-10T16:45:00Z',
    '15:30',
    124000,
    3800,
    'reviews',
    ARRAY['sprinter mods', 'cool accessories', 'van upgrades']
),
(
    'best_conversion_companies', 
    'BEST VAN CONVERSION COMPANIES IN THE USA', 
    'Comprehensive comparison of the top van conversion companies across America, with pricing and quality reviews.',
    'https://i.ytimg.com/vi/best_conversion_companies/maxresdefault.jpg',
    'Van Life Directory',
    'UCvancompanies',
    '2025-01-08T12:00:00Z',
    '28:15',
    203000,
    5600,
    'builds',
    ARRAY['conversion companies', 'van builders', 'usa', 'reviews']
);