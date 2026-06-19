-- Add diverse van life locations for all map sections
INSERT INTO public.locations (name, description, latitude, longitude, type, amenities) VALUES
-- More Campsites
('Joshua Tree National Park', 'Iconic desert camping among unique rock formations and Joshua trees.', 33.8734, -115.9010, 'campsite', ARRAY['desert', 'rock_climbing', 'stargazing', 'hiking']),
('Glacier National Park', 'Stunning mountain camping with glacial lakes and wildlife viewing.', 48.7596, -113.7870, 'campsite', ARRAY['mountains', 'wildlife', 'hiking', 'fishing']),
('Death Valley Mesquite Flat', 'Remote desert camping with incredible night skies and solitude.', 36.6052, -117.0665, 'campsite', ARRAY['remote', 'stargazing', 'free_camping', 'desert']),
('Yosemite Backcountry', 'Backcountry camping with permits, incredible waterfalls and granite cliffs.', 37.8651, -119.5383, 'campsite', ARRAY['mountains', 'waterfalls', 'permits_required', 'backpacking']),

-- Driveway Surfing / Host Locations  
('Mountain View Farm Stay', 'Organic farm offering overnight parking with farm-to-table breakfast.', 45.3311, -121.7113, 'driveway', ARRAY['farm_fresh', 'breakfast', 'wifi', 'showers']),
('Desert Rose Sanctuary', 'Spiritual retreat center welcoming self-contained RVs and vans.', 34.1358, -116.4003, 'driveway', ARRAY['spiritual', 'meditation', 'quiet', 'desert_views']),
('Vineyard Overnight Parking', 'Family winery offering tastings and overnight parking for guests.', 38.5816, -122.8735, 'driveway', ARRAY['wine_tasting', 'family_friendly', 'vineyard_tours', 'restrooms']),
('Coastal Artist Studio', 'Artist studio with ocean views, welcoming creative van lifers.', 39.1612, -123.8058, 'driveway', ARRAY['ocean_views', 'art_studio', 'creative_space', 'inspiration']),
('Mountain Cabin Host', 'Cabin owner sharing mountain property with van life travelers.', 40.0150, -105.2705, 'driveway', ARRAY['mountains', 'hiking', 'campfire', 'community']),
('Texas Ranch Driveway', 'Working ranch offering overnight stays, horseback riding available.', 30.2672, -97.7431, 'driveway', ARRAY['ranch', 'horseback_riding', 'authentic_experience', 'wide_open_spaces']),

-- Van Life Events
('Overland Expo West 2024', 'Premier overland and van life expo with vendors, workshops, and community.', 34.5794, -114.3624, 'event', ARRAY['expo', 'vendors', 'workshops', 'community']),
('Van Life Weekender', 'Three-day festival celebrating the van life community and lifestyle.', 34.0522, -118.2437, 'event', ARRAY['festival', 'music', 'workshops', 'community']),
('Rubber Tramp Rendezvous', 'Annual gathering of budget-conscious nomads and van lifers.', 33.4734, -114.4780, 'event', ARRAY['budget_friendly', 'community', 'workshops', 'desert']),
('Women''s Van Life Gathering', 'Empowering event for women in the van life community.', 36.7783, -119.4179, 'event', ARRAY['women_only', 'empowerment', 'safety', 'community']),
('Solar Power Workshop Weekend', 'Hands-on solar installation and off-grid living workshops.', 37.7749, -122.4194, 'event', ARRAY['solar_power', 'education', 'hands_on', 'off_grid']),
('Van Life Convergence', 'Annual gathering in the Colorado Rockies with workshops and community.', 39.1012, -106.8175, 'event', ARRAY['mountains', 'community', 'workshops', 'networking']),

-- Van Friendly Businesses
('Van Life Supply Co', 'One-stop shop for van conversion parts and accessories.', 39.7392, -104.9903, 'business', ARRAY['parts', 'accessories', 'installation', 'advice']),
('Mobile Van Mechanic', 'Traveling mechanic specializing in van and RV repairs.', 33.4484, -112.0740, 'business', ARRAY['mobile_service', 'repairs', 'maintenance', 'emergency']),
('Laundromat & Showers Plus', 'Van-friendly facility with large washers and private shower rooms.', 35.2271, -80.8431, 'business', ARRAY['laundry', 'showers', 'van_parking', 'wifi']),
('Outdoor Gear Exchange', 'Used outdoor gear store with van life section and trade-ins.', 44.4759, -73.2121, 'business', ARRAY['gear', 'trade_ins', 'outdoor_equipment', 'community_board']),
('Van Conversion Specialists', 'Professional van conversion services and custom builds.', 47.6062, -122.3321, 'business', ARRAY['conversions', 'custom_builds', 'professional', 'design']);

-- Add sample user locations for testing live member tracking
INSERT INTO public.user_locations (user_id, latitude, longitude, status, message, is_public) VALUES
(gen_random_uuid(), 38.5733, -109.5498, 'parked', 'Amazing sunrise this morning! Great boondocking spot.', true),
(gen_random_uuid(), 36.1596, -121.6735, 'traveling', 'Heading south along PCH, looking for camping buddies!', true),
(gen_random_uuid(), 33.6639, -114.2251, 'available', 'Long-time van lifer, happy to share tips and coffee!', true),
(gen_random_uuid(), 34.8697, -111.7610, 'parked', 'Incredible red rock views, staying here for a few days.', true),
(gen_random_uuid(), 47.8021, -123.5964, 'traveling', 'Olympic Peninsula adventure, anyone know good spots?', true),
(gen_random_uuid(), 45.5152, -122.6784, 'available', 'Portland area, can share mechanic recommendations!', true),
(gen_random_uuid(), 40.7589, -111.8883, 'parked', 'Salt Lake City area, great for restocking supplies.', true),
(gen_random_uuid(), 32.7767, -96.7970, 'traveling', 'Texas bound, any good BBQ recommendations?', true);