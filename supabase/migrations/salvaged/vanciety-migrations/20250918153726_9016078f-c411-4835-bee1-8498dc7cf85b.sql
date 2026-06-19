-- Add many more van life videos to reach hundreds
INSERT INTO public.youtube_videos (
    youtube_id, title, description, thumbnail_url, channel_title, channel_id, 
    published_at, duration, view_count, like_count, category, tags
) VALUES 
-- More Van Builds
('build005', 'Converting a School Bus to Van Life Paradise', 'Amazing skoolie conversion with full kitchen, bathroom, and solar setup.', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'Skoolie Life', 'UC023', '2024-12-30T10:00:00Z', '42:15', 1800000, 62000, 'builds', ARRAY['school bus', 'skoolie', 'conversion']),
('build006', 'Ram ProMaster City Mini Van Build', 'Small van, big adventure - complete mini van conversion tour.', 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg', 'Mini Van Adventures', 'UC024', '2024-12-25T14:30:00Z', '18:45', 540000, 19000, 'builds', ARRAY['ram promaster', 'mini van', 'small build']),
('build007', 'Nissan NV200 Stealth Van Build', 'Ultimate stealth van for city van life and urban camping.', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg', 'Stealth Van Co', 'UC025', '2024-12-20T09:15:00Z', '25:30', 720000, 24000, 'builds', ARRAY['nissan nv200', 'stealth van', 'urban camping']),
('build008', 'Vintage VW Bus Restoration & Conversion', 'Restoring a classic 1970s VW Bus for modern van life.', 'https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg', 'Classic Van Restorations', 'UC026', '2024-12-15T16:45:00Z', '35:20', 960000, 31000, 'builds', ARRAY['vw bus', 'vintage van', 'restoration']),
('build009', 'Chevy Express 3500 High-Top Conversion', 'Extended Chevy van with standing room conversion tour.', 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg', 'Express Van Builds', 'UC027', '2024-12-10T11:00:00Z', '29:15', 430000, 16000, 'builds', ARRAY['chevy express', 'high top', 'standing room']),

-- More Electrical & Solar
('elec004', 'Battle Born vs Renogy - Lithium Battery Comparison', 'Head-to-head comparison of the top lithium battery brands for van life.', 'https://i.ytimg.com/vi/M7lc1UVf-VE/maxresdefault.jpg', 'Battery Battle', 'UC028', '2024-12-05T13:20:00Z', '31:40', 680000, 25000, 'electrical', ARRAY['battle born', 'renogy', 'lithium battery']),
('elec005', 'Installing a Victron System - Complete Setup', 'Professional Victron electrical system installation from start to finish.', 'https://i.ytimg.com/vi/ZZ5LpwO-An4/maxresdefault.jpg', 'Victron Experts', 'UC029', '2024-11-30T15:45:00Z', '38:25', 520000, 21000, 'electrical', ARRAY['victron', 'professional install', 'complete system']),
('elec006', 'Flexible Solar Panels vs Rigid - Pros & Cons', 'Comparing flexible and rigid solar panels for van installations.', 'https://i.ytimg.com/vi/HAIP40nNjvg/maxresdefault.jpg', 'Solar Comparisons', 'UC030', '2024-11-25T12:30:00Z', '24:15', 390000, 14000, 'electrical', ARRAY['flexible solar', 'rigid panels', 'comparison']),

-- More Plumbing & Heating
('plumb003', 'Composting Toilet vs Cassette - Van Life Bathroom', 'Comparing different toilet options for van life bathrooms.', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'Bathroom Solutions', 'UC031', '2024-11-20T08:45:00Z', '22:50', 780000, 28000, 'plumbing', ARRAY['composting toilet', 'cassette toilet', 'bathroom']),
('plumb004', 'Chinese Diesel Heater Install & Review', 'Installing and testing a budget Chinese diesel heater for van life.', 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg', 'Budget Heating', 'UC032', '2024-11-15T14:20:00Z', '27:35', 920000, 33000, 'plumbing', ARRAY['chinese heater', 'budget heating', 'diesel heater']),
('plumb005', 'Greywater System - Legal & Practical Solutions', 'How to handle greywater in your van life setup legally and effectively.', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg', 'Water Management', 'UC033', '2024-11-10T10:15:00Z', '19:45', 340000, 12000, 'plumbing', ARRAY['greywater', 'water management', 'legal']),

-- More Camping & Travel
('camp004', 'Van Life in Alaska - Ultimate Adventure', 'Epic journey through Alaska with van life tips for extreme conditions.', 'https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg', 'Arctic Adventures', 'UC034', '2024-09-15T17:30:00Z', '52:20', 1400000, 48000, 'camping', ARRAY['alaska', 'extreme conditions', 'arctic']),
('camp005', 'Best Van Life Destinations in Europe', 'Top 20 destinations for van life travel across Europe.', 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg', 'European Nomads', 'UC035', '2024-09-10T12:45:00Z', '33:15', 880000, 31000, 'camping', ARRAY['europe', 'destinations', 'travel']),
('camp006', 'Winter Van Life Survival Guide', 'How to stay warm and safe during winter van life adventures.', 'https://i.ytimg.com/vi/M7lc1UVf-VE/maxresdefault.jpg', 'Winter Warriors', 'UC036', '2024-01-15T09:30:00Z', '41:50', 1200000, 42000, 'camping', ARRAY['winter van life', 'cold weather', 'survival']),

-- More Tips & Tricks
('tips003', 'Van Life Laundry Solutions - Stay Clean on the Road', 'Creative ways to do laundry while living in a van full-time.', 'https://i.ytimg.com/vi/ZZ5LpwO-An4/maxresdefault.jpg', 'Clean Living', 'UC037', '2024-08-20T16:00:00Z', '16:30', 450000, 17000, 'tips', ARRAY['laundry', 'hygiene', 'clean living']),
('tips004', 'Van Life Security - Protecting Your Home on Wheels', 'Essential security tips and gear for van life safety.', 'https://i.ytimg.com/vi/HAIP40nNjvg/maxresdefault.jpg', 'Van Security Pro', 'UC038', '2024-08-15T11:20:00Z', '28:45', 620000, 23000, 'tips', ARRAY['security', 'safety', 'protection']),
('tips005', 'Making Money on the Road - Van Life Income Ideas', '20+ ways to earn money while living the van life dream.', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'Nomad Income', 'UC039', '2024-08-10T14:15:00Z', '32:20', 1100000, 38000, 'tips', ARRAY['making money', 'income', 'work from van']),

-- More Product Reviews
('review003', 'MaxxAir vs Fantastic Fan - Best Van Ventilation', 'Comparing the top roof fans for van life ventilation.', 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg', 'Ventilation Reviews', 'UC040', '2024-07-25T13:45:00Z', '21:30', 490000, 18000, 'reviews', ARRAY['maxxair', 'fantastic fan', 'ventilation']),
('review004', 'Best Van Life Mattresses - Sleep Better on the Road', 'Testing and reviewing the top mattresses for van life comfort.', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg', 'Sleep Solutions', 'UC041', '2024-07-20T15:30:00Z', '26:15', 380000, 14000, 'reviews', ARRAY['mattresses', 'sleep', 'comfort']),
('review005', 'Portable Washing Machines for Van Life', 'Review of compact washing machines perfect for van life.', 'https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg', 'Portable Appliances', 'UC042', '2024-07-15T10:00:00Z', '18:45', 320000, 12000, 'reviews', ARRAY['washing machine', 'portable', 'appliances']),

-- More Maintenance & Repairs
('maint003', 'Van Life Emergency Repairs - Roadside Fixes', 'Essential repairs every van lifer should know how to do.', 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg', 'Emergency Repairs', 'UC043', '2024-06-30T14:20:00Z', '34:15', 560000, 20000, 'maintenance', ARRAY['emergency repairs', 'roadside', 'diy fixes']),
('maint004', 'Tire Maintenance & Replacement on the Road', 'Everything about van tires, maintenance, and roadside replacement.', 'https://i.ytimg.com/vi/M7lc1UVf-VE/maxresdefault.jpg', 'Tire Experts', 'UC044', '2024-06-25T11:45:00Z', '29:30', 420000, 15000, 'maintenance', ARRAY['tire maintenance', 'tire replacement', 'roadside']),

-- More Mods & Upgrades
('mods003', 'Adding a Roof Deck to Your Van', 'Building a rooftop deck platform for van life outdoor living.', 'https://i.ytimg.com/vi/ZZ5LpwO-An4/maxresdefault.jpg', 'Roof Deck Builds', 'UC045', '2024-06-20T15:15:00Z', '31:40', 730000, 26000, 'mods', ARRAY['roof deck', 'outdoor living', 'platform']),
('mods004', 'Rear Door Window Installation', 'Adding windows to van rear doors for better visibility and light.', 'https://i.ytimg.com/vi/HAIP40nNjvg/maxresdefault.jpg', 'Window Mods', 'UC046', '2024-06-15T12:00:00Z', '23:25', 380000, 14000, 'mods', ARRAY['rear windows', 'door windows', 'visibility']),

-- More General Van Life
('vanlife003', 'Van Life with Kids - Family Adventures', 'How to make van life work with children and family adventures.', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'Family Van Life', 'UC047', '2024-05-20T17:30:00Z', '36:20', 1300000, 45000, 'van-life', ARRAY['family van life', 'kids', 'children']),
('vanlife004', 'Van Life Dating - Finding Love on the Road', 'Navigating relationships and dating while living the van life.', 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg', 'Love on Wheels', 'UC048', '2024-05-15T13:45:00Z', '24:15', 620000, 21000, 'van-life', ARRAY['dating', 'relationships', 'love']),
('vanlife005', 'Solo Female Van Life - Safety & Empowerment', 'Inspiring stories and safety tips for women traveling solo in vans.', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg', 'Solo Female Nomads', 'UC049', '2024-05-10T10:30:00Z', '42:50', 1500000, 52000, 'van-life', ARRAY['solo female', 'safety', 'empowerment']),

-- Offroad Adventures
('offroad001', 'Van Life Overland Adventure - Baja Mexico', 'Epic overland journey through Baja California in a 4x4 van.', 'https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg', 'Overland Adventures', 'UC050', '2024-04-25T16:00:00Z', '48:30', 920000, 33000, 'offroad', ARRAY['baja mexico', 'overland', '4x4']),
('offroad002', 'Building the Ultimate Off-Road Van', 'Complete off-road van build with lift, tires, and armor.', 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg', 'Off-Road Builds', 'UC051', '2024-04-20T14:15:00Z', '37:45', 780000, 28000, 'offroad', ARRAY['off-road build', 'lift kit', 'armor']),
('offroad003', 'Van Life Desert Survival Tips', 'Essential knowledge for desert van life and off-grid camping.', 'https://i.ytimg.com/vi/M7lc1UVf-VE/maxresdefault.jpg', 'Desert Nomads', 'UC052', '2024-04-15T11:30:00Z', '26:20', 540000, 19000, 'offroad', ARRAY['desert survival', 'off-grid', 'desert camping']);