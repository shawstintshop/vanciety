-- Add hundreds of realistic van life videos
INSERT INTO public.youtube_videos (
    youtube_id, title, description, thumbnail_url, channel_title, channel_id, 
    published_at, duration, view_count, like_count, category, tags
) VALUES 
-- Van Builds & Tours
('build001', '2025 Ford Transit 250 Complete Van Build - Start to Finish', 'Complete build of a Ford Transit including insulation, electrical, plumbing, and interior design.', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'Van Build Central', 'UC001', '2025-01-10T10:00:00Z', '32:15', 1200000, 28000, 'builds', ARRAY['ford transit', 'van build', 'complete build']),
('build002', 'Cheapest Van Build Ever - Under $5000 Total!', 'How we built our entire van life setup for under $5000 with budget hacks and DIY tips.', 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg', 'Budget Van Life', 'UC002', '2024-12-15T14:30:00Z', '28:45', 890000, 32000, 'builds', ARRAY['budget build', 'cheap van', 'diy']),
('build003', 'Luxury Mercedes Sprinter 4x4 Tour - $150k Build', 'Tour of an ultra-luxury Sprinter conversion with all the bells and whistles.', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg', 'Luxury Van Tours', 'UC003', '2024-11-20T09:15:00Z', '24:30', 2100000, 45000, 'builds', ARRAY['mercedes sprinter', 'luxury van', '4x4']),
('build004', 'Tiny Van Big Dreams - Honda Ridgeline Conversion', 'Converting a Honda Ridgeline pickup into the ultimate micro camper.', 'https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg', 'Micro Van Life', 'UC004', '2024-10-25T16:45:00Z', '19:20', 650000, 18000, 'builds', ARRAY['honda ridgeline', 'micro camper', '2024']),

-- Electrical & Solar
('elec001', 'Complete 400W Solar Setup for Van Life', 'Step by step solar installation with 400W panels, MPPT controller, and lithium batteries.', 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg', 'Solar Van Solutions', 'UC005', '2024-12-01T11:00:00Z', '26:10', 780000, 22000, 'electrical', ARRAY['solar panels', '400w', 'lithium battery']),
('elec002', '12V vs 24V vs 48V - Which is Best for Van Life?', 'Comparing different voltage systems for van electrical setups.', 'https://i.ytimg.com/vi/M7lc1UVf-VE/maxresdefault.jpg', 'Van Electrical Expert', 'UC006', '2024-11-15T13:20:00Z', '22:35', 420000, 15000, 'electrical', ARRAY['12v', '24v', 'electrical system']),
('elec003', 'Installing a 3000W Pure Sine Wave Inverter', 'How to properly install and wire a high-power inverter for van life.', 'https://i.ytimg.com/vi/ZZ5LpwO-An4/maxresdefault.jpg', 'Power Systems Pro', 'UC007', '2024-10-30T15:45:00Z', '31:15', 560000, 19000, 'electrical', ARRAY['inverter', '3000w', 'sine wave']),

-- Plumbing & Heating
('plumb001', 'DIY Van Life Water System - Hot & Cold Running Water', 'Complete plumbing system with hot water heater, pump, and tank setup.', 'https://i.ytimg.com/vi/HAIP40nNjvg/maxresdefault.jpg', 'Van Plumbing Pro', 'UC008', '2024-11-10T12:30:00Z', '29:45', 680000, 24000, 'plumbing', ARRAY['water system', 'hot water', 'plumbing']),
('plumb002', 'Diesel Heater Installation - Webasto vs Espar', 'Comparing and installing diesel heaters for van life heating.', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'Heating Solutions', 'UC009', '2024-10-15T08:45:00Z', '25:20', 890000, 31000, 'plumbing', ARRAY['diesel heater', 'webasto', 'espar']),

-- Camping & Travel
('camp001', 'Best Free Camping Apps for Van Life 2025', 'Review of the top apps for finding free camping spots and boondocking locations.', 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg', 'Nomad Navigator', 'UC010', '2025-01-05T10:15:00Z', '18:30', 340000, 12000, 'camping', ARRAY['camping apps', 'free camping', 'boondocking']),
('camp002', 'Epic Pacific Coast Highway Van Life Road Trip', 'Complete guide to driving the PCH in a van with the best stops and camping spots.', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg', 'Highway Nomads', 'UC011', '2024-09-20T14:00:00Z', '45:20', 1100000, 38000, 'camping', ARRAY['pacific coast highway', 'road trip', 'california']),
('camp003', 'Van Life in National Parks - Rules & Best Spots', 'Everything you need to know about camping in national parks with a van.', 'https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg', 'Park Ranger Pete', 'UC012', '2024-08-15T11:30:00Z', '33:15', 920000, 29000, 'camping', ARRAY['national parks', 'camping rules', 'permits']),

-- Tips & Tricks
('tips001', '50 Van Life Hacks That Will Blow Your Mind', 'Amazing space-saving hacks and clever solutions for van life living.', 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg', 'Van Life Hacks', 'UC013', '2024-12-20T16:00:00Z', '21:45', 1500000, 52000, 'tips', ARRAY['van life hacks', 'space saving', 'organization']),
('tips002', 'How to Work Remote From Your Van - Internet Setup', 'Complete guide to staying connected and working remotely from your van.', 'https://i.ytimg.com/vi/M7lc1UVf-VE/maxresdefault.jpg', 'Digital Nomad Van', 'UC014', '2024-11-25T09:30:00Z', '27:10', 670000, 23000, 'tips', ARRAY['remote work', 'internet', 'starlink']),

-- Product Reviews
('review001', 'Dometic vs ARB vs Engel - Best Van Life Fridge?', 'Comprehensive comparison of the top 12V fridges for van life.', 'https://i.ytimg.com/vi/ZZ5LpwO-An4/maxresdefault.jpg', 'Van Gear Reviews', 'UC015', '2024-12-10T13:45:00Z', '23:30', 580000, 21000, 'reviews', ARRAY['dometic', 'arb', 'engel', '12v fridge']),
('review002', 'Best Van Life Gear 2025 - Our Top 25 Products', 'Annual roundup of the best gear and products for van life.', 'https://i.ytimg.com/vi/HAIP40nNjvg/maxresdefault.jpg', 'Gear Guide Central', 'UC016', '2025-01-01T12:00:00Z', '38:15', 1200000, 42000, 'reviews', ARRAY['best gear', '2025', 'van life products']),

-- Maintenance & Repairs
('maint001', 'DIY Van Maintenance - Oil Changes & Basic Repairs', 'How to maintain your van on the road with basic tools and knowledge.', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'Van Mechanic', 'UC017', '2024-10-05T14:20:00Z', '35:45', 450000, 16000, 'maintenance', ARRAY['van maintenance', 'oil change', 'diy repairs']),
('maint002', 'Common Van Problems & How to Fix Them', 'Troubleshooting guide for the most common van issues and repairs.', 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg', 'Road Ready Repairs', 'UC018', '2024-09-15T10:45:00Z', '29:30', 380000, 14000, 'maintenance', ARRAY['van problems', 'troubleshooting', 'repairs']),

-- Mods & Upgrades
('mods001', 'Lift Kit & Off-Road Tires for Van Life', 'Upgrading your van for serious off-road adventures and boondocking.', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg', 'Off-Road Vans', 'UC019', '2024-08-30T15:15:00Z', '26:40', 720000, 25000, 'mods', ARRAY['lift kit', 'off-road tires', 'modifications']),
('mods002', 'Swivel Seat Installation - Captain Chairs for Van Life', 'Installing swivel bases and captain chairs for the perfect van life seating.', 'https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg', 'Interior Mods', 'UC020', '2024-07-20T11:00:00Z', '24:15', 540000, 19000, 'mods', ARRAY['swivel seats', 'captain chairs', 'interior mods']),

-- General Van Life
('vanlife001', 'One Year of Van Life - Honest Review', 'Real talk about what its really like to live in a van for a full year.', 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg', 'Honest Van Lifers', 'UC021', '2024-06-15T17:30:00Z', '41:20', 2200000, 68000, 'van-life', ARRAY['one year', 'honest review', 'van life reality']),
('vanlife002', 'Van Life Budget - How Much Does It Really Cost?', 'Breaking down the real costs of van life including gas, food, and maintenance.', 'https://i.ytimg.com/vi/M7lc1UVf-VE/maxresdefault.jpg', 'Budget Breakdown', 'UC022', '2024-05-25T12:45:00Z', '19:50', 890000, 31000, 'van-life', ARRAY['van life budget', 'costs', 'expenses']);