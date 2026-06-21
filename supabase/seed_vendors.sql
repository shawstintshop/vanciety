-- ============================================================================
-- Vanciety Vendor System — seed data (10 published companies + children)
-- Intended for a one-time run on a fresh vendor schema.
-- Companies upsert on slug; children attach via slug subselect.
-- ============================================================================

-- ── COMPANIES ───────────────────────────────────────────────────────────────
INSERT INTO companies (name, slug, tagline, category, subcategories, city, state, country, serves_nationwide, verified, featured, status, short_description, description, website_url, contact_email)
VALUES
  ('Roam Adventure Co.', 'roam-adventure-co', 'Built for the Road Less Traveled', 'Gear & Accessories', ARRAY['roof top tents','awnings','overlanding gear'], 'Flagstaff', 'AZ', 'USA', true, true, true, 'published', 'Roof top tents, awnings, and overlanding gear built for the road less traveled.', 'Roam Adventure Co. designs and builds rugged roof top tents, awnings, and storage solutions for van lifers and overlanders who push past the pavement.', 'https://www.roamadventureco.com', 'hello@roamadventureco.com'),
  ('Agile Off Road', 'agile-off-road', 'Engineered for Van Life', 'Parts & Fabrication', ARRAY['bumpers','racks','skid plates','accessories'], 'San Diego', 'CA', 'USA', true, true, true, 'published', 'Bumpers, racks, skid plates and accessories engineered for Sprinter van life.', 'Agile Off Road engineers premium suspension, bumpers, and protection for Mercedes Sprinter vans — proven on the toughest trails.', 'https://www.agileoffroad.com', 'support@agileoffroad.com'),
  ('Method Race Wheels', 'method-race-wheels', 'Race Proven. Van Approved.', 'Wheels & Tires', ARRAY['wheels','beadlock','accessories'], 'Palm Desert', 'CA', 'USA', true, true, true, 'published', 'Race-proven wheels and beadlocks, van approved.', 'Method Race Wheels builds championship-winning wheels for racing and overlanding, with load-rated options purpose-built for heavy adventure vans.', 'https://www.methodracewheels.com', 'info@methodracewheels.com'),
  ('Victron Energy', 'victron-energy', 'Power Your Adventure', 'Electrical & Power', ARRAY['inverters','batteries','solar','chargers'], 'Almere', 'NL', 'NL', true, true, true, 'published', 'Inverters, batteries, solar and chargers for off-grid power.', 'Victron Energy makes premium inverter/chargers, MPPT controllers, and battery monitors — the backbone of serious off-grid van electrical systems worldwide.', 'https://www.victronenergy.com', 'sales@victronenergy.com'),
  ('Owl Vans', 'owl-vans', 'Precision Built. Adventure Ready.', 'Van Builders', ARRAY['full builds','partial builds','consulting'], 'Boise', 'ID', 'USA', false, true, false, 'published', 'Precision-built Sprinter conversions and accessories.', 'Owl Vans builds adventure-ready Sprinter conversions and engineers some of the best-known rear storage and tire-carrier systems in the industry.', 'https://owlvans.com', 'hello@owlvans.com'),
  ('Van Compass', 'van-compass', 'Go Further. Go Higher.', 'Suspension & Lift Kits', ARRAY['lift kits','suspension','accessories'], 'Portland', 'OR', 'USA', true, true, false, 'published', 'Lift kits and suspension to go further and higher.', 'Van Compass develops suspension, lift kits, and off-road components that transform Sprinter, Transit, and ProMaster vans into capable backcountry rigs.', 'https://vancompass.com', 'support@vancompass.com'),
  ('Aluminess', 'aluminess', 'The Original Van Rack', 'Exterior Accessories', ARRAY['roof racks','bumpers','ladders','swing arms'], 'El Cajon', 'CA', 'USA', true, true, false, 'published', 'The original aluminum van racks, bumpers, and ladders.', 'Aluminess pioneered lightweight aluminum racks, bumpers, ladders, and swing-arms for adventure vans — handcrafted in Southern California.', 'https://aluminess.com', 'info@aluminess.com'),
  ('Flatline Van Co.', 'flatline-van-co', 'Modular. Minimal. Mobile.', 'Interior & Furniture', ARRAY['bed platforms','storage','modular systems'], 'Denver', 'CO', 'USA', true, true, false, 'published', 'Modular, minimal interior systems for DIY van builds.', 'Flatline Van Co. makes modular bed platforms, storage, and interior systems that make a clean DIY van build fast and repeatable.', 'https://flatlinevanco.com', 'hello@flatlinevanco.com'),
  ('Storyteller Overland', 'storyteller-overland', 'Adventure Starts Here', 'Van Builders', ARRAY['4x4 builds','MODE system','Ford Transit builds'], 'Birmingham', 'AL', 'USA', true, true, true, 'published', '4x4 adventure vans with the MODE power system.', 'Storyteller Overland builds premium 4x4 adventure vans on Mercedes Sprinter and Ford Transit chassis, known for the MODE power system and bold design.', 'https://storytelleroverland.com', 'hello@storytelleroverland.com'),
  ('Winnebago Revel', 'winnebago-revel', 'The Ultimate 4x4 Adventure Van', 'Adventure Vans', ARRAY['4x4 vans','adventure vehicles','motorhomes'], 'Forest City', 'IA', 'USA', true, true, true, 'published', 'The ultimate 4x4 Sprinter adventure van.', 'The Winnebago Revel is a fully self-contained 4x4 Mercedes Sprinter adventure van with a power lift bed, gear garage, and true off-grid capability.', 'https://www.winnebago.com/models/product/motorhomes/class-b/revel', 'info@winnebago.com')
ON CONFLICT (slug) DO NOTHING;

-- ── PRODUCTS ────────────────────────────────────────────────────────────────
INSERT INTO company_products (company_id, name, slug, category, description, price, image_url, in_stock, featured, status)
VALUES
  ((SELECT id FROM companies WHERE slug='roam-adventure-co'), 'Roam Roof Top Tent', 'roam-roof-top-tent', 'roof top tents', 'Hard-wearing roof top tent that sleeps two, sets up in minutes.', 1895, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='roam-adventure-co'), 'Roam Awning 270', 'roam-awning-270', 'awnings', '270-degree awning for instant shade and shelter.', 549, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='roam-adventure-co'), 'Rugged Case 55L', 'rugged-case-55l', 'overlanding gear', 'Crushproof, dustproof gear case for the build.', 189, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='agile-off-road'), 'Agile Rear Bumper', 'agile-rear-bumper', 'bumpers', 'Modular rear bumper with tire carrier for Sprinter.', 1045, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='agile-off-road'), 'RIP Suspension Kit', 'rip-suspension-kit', 'accessories', 'Ride Improvement Package for a smoother, more controlled ride.', 1899, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='agile-off-road'), 'Skid Plate System', 'skid-plate-system', 'skid plates', 'Full underbody protection for off-pavement travel.', 795, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='method-race-wheels'), 'Method 701 Wheel', 'method-701-wheel', 'wheels', 'Load-rated 701 wheel built for heavy adventure vans.', 299, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='method-race-wheels'), 'Method 305 NV Wheel', 'method-305-nv-wheel', 'wheels', 'Iconic NV design, now in van fitments.', 289, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='method-race-wheels'), 'Beadlock Ring Kit', 'beadlock-ring-kit', 'beadlock', 'Replacement beadlock ring hardware kit.', 129, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='victron-energy'), 'MultiPlus II 12/3000', 'multiplus-ii-12-3000', 'inverters', 'Inverter/charger with built-in transfer switch.', 915, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='victron-energy'), 'SmartSolar MPPT 100/50', 'smartsolar-mppt-100-50', 'solar', 'Bluetooth MPPT solar charge controller.', 310, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='victron-energy'), 'SmartShunt 500A', 'smartshunt-500a', 'batteries', 'Battery monitor with Bluetooth and app.', 135, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='owl-vans'), 'Sherpa Tire Carrier', 'sherpa-tire-carrier', 'accessories', 'Swing-away spare tire and storage system.', 1650, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='owl-vans'), 'Expedition Rear Door Rack', 'expedition-rear-door-rack', 'accessories', 'Modular rear door storage rack.', 595, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='owl-vans'), 'Full Custom Build', 'full-custom-build', 'full builds', 'Ground-up custom Sprinter conversion.', NULL, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='van-compass'), 'Stage 6.3 Lift Kit', 'stage-6-3-lift-kit', 'lift kits', 'Complete suspension lift and tuning package.', 3250, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='van-compass'), 'Falcon Shocks Set', 'falcon-shocks-set', 'suspension', 'Performance shocks tuned for loaded vans.', 1450, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='van-compass'), 'Sumo Springs Kit', 'sumo-springs-kit', 'accessories', 'Progressive bump stops for sag and stability.', 329, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='aluminess'), 'Roof Rack', 'aluminess-roof-rack', 'roof racks', 'Lightweight aluminum roof rack, made in USA.', 1895, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='aluminess'), 'Rear Door Ladder', 'rear-door-ladder', 'ladders', 'Bolt-on aluminum rear ladder.', 425, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='aluminess'), 'Front Bumper', 'aluminess-front-bumper', 'bumpers', 'Aluminum front bumper with light tabs.', 1295, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='flatline-van-co'), 'Modular Bed Platform', 'modular-bed-platform', 'bed platforms', 'Adjustable, removable bed platform system.', 1250, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='flatline-van-co'), 'Galley Storage Module', 'galley-storage-module', 'storage', 'Drop-in kitchen and storage module.', 980, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='flatline-van-co'), 'Wall Panel Kit', 'wall-panel-kit', 'modular systems', 'Pre-cut insulated wall panel kit.', 740, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='storyteller-overland'), 'Stealth MODE Build', 'stealth-mode-build', '4x4 builds', '4x4 Sprinter with the MODE 2.0 power system.', 235000, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='storyteller-overland'), 'Beast MODE Build', 'beast-mode-build', '4x4 builds', 'Maximum off-grid 4x4 adventure van.', 265000, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='storyteller-overland'), 'MODE Power System', 'mode-power-system', 'MODE system', 'Integrated lithium power and control system.', 28000, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='winnebago-revel'), 'Revel 44E', 'revel-44e', '4x4 vans', '4x4 Sprinter with power lift bed and gear garage.', 228000, NULL, true, true, 'published'),
  ((SELECT id FROM companies WHERE slug='winnebago-revel'), 'Revel Accessory Package', 'revel-accessory-package', 'adventure vehicles', 'Factory accessory and upfit package.', 4500, NULL, true, false, 'published'),
  ((SELECT id FROM companies WHERE slug='winnebago-revel'), 'Extended Warranty', 'revel-extended-warranty', 'adventure vehicles', 'Extended coverage for your Revel.', 2900, NULL, true, false, 'published');

-- ── SERVICES ────────────────────────────────────────────────────────────────
INSERT INTO company_services (company_id, name, slug, category, description, price_starting_at, price_type, requires_quote, status)
VALUES
  ((SELECT id FROM companies WHERE slug='agile-off-road'), 'Suspension Install', 'suspension-install', 'install', 'Professional install of suspension and bumpers.', 1200, 'quote', true, 'active'),
  ((SELECT id FROM companies WHERE slug='agile-off-road'), 'Alignment & Tuning', 'alignment-tuning', 'service', 'Post-lift alignment and ride tuning.', 350, 'fixed', false, 'active'),
  ((SELECT id FROM companies WHERE slug='owl-vans'), 'Full Conversion', 'full-conversion', 'build', 'Complete custom Sprinter conversion.', 90000, 'quote', true, 'active'),
  ((SELECT id FROM companies WHERE slug='owl-vans'), 'Build Consulting', 'build-consulting', 'consulting', 'One-on-one build planning and consulting.', 150, 'hourly', false, 'active'),
  ((SELECT id FROM companies WHERE slug='van-compass'), 'Lift Kit Install', 'lift-kit-install', 'install', 'Professional lift kit installation.', 1500, 'quote', true, 'active'),
  ((SELECT id FROM companies WHERE slug='storyteller-overland'), 'Custom Build Order', 'custom-build-order', 'build', 'Reserve a custom MODE build slot.', 235000, 'quote', true, 'active'),
  ((SELECT id FROM companies WHERE slug='flatline-van-co'), 'Install Support', 'install-support', 'support', 'Remote install support for DIY builders.', 99, 'fixed', false, 'active');

-- ── FAQS (2 each) ────────────────────────────────────────────────────────────
INSERT INTO company_faqs (company_id, question, answer, sort_order)
SELECT id, 'Do you ship nationwide?', 'Yes — we ship across the USA, and most orders leave the shop within 3-5 business days.', 0 FROM companies WHERE slug IN ('roam-adventure-co','agile-off-road','method-race-wheels','victron-energy','owl-vans','van-compass','aluminess','flatline-van-co','storyteller-overland','winnebago-revel')
UNION ALL
SELECT id, 'What vans are your products compatible with?', 'Our products fit popular adventure-van platforms including Mercedes Sprinter, Ford Transit, and Ram ProMaster. Check each product page for exact fitment.', 1 FROM companies WHERE slug IN ('roam-adventure-co','agile-off-road','method-race-wheels','victron-energy','owl-vans','van-compass','aluminess','flatline-van-co','storyteller-overland','winnebago-revel');

-- ── REVIEWS (2 approved each) ────────────────────────────────────────────────
INSERT INTO company_reviews (company_id, rating, title, body, reviewer_name, verified_customer, status)
SELECT id, 5, 'Top quality', 'Exactly what my build needed — quality and service were excellent.', 'VanLifeJess', true, 'approved' FROM companies WHERE slug IN ('roam-adventure-co','agile-off-road','method-race-wheels','victron-energy','owl-vans','van-compass','aluminess','flatline-van-co','storyteller-overland','winnebago-revel')
UNION ALL
SELECT id, 4, 'Great gear', 'Solid product and helpful support team. Would buy again.', 'OverlandOllie', true, 'approved' FROM companies WHERE slug IN ('roam-adventure-co','agile-off-road','method-race-wheels','victron-energy','owl-vans','van-compass','aluminess','flatline-van-co','storyteller-overland','winnebago-revel');

-- ── PROMOTIONS (1 each) ──────────────────────────────────────────────────────
INSERT INTO company_promotions (company_id, title, description, promo_code, discount_type, discount_value, status)
SELECT id, 'Van Show Special', '10% off your first order — this week only.', 'VANSHOW10', 'percent', 10, 'published' FROM companies WHERE slug IN ('roam-adventure-co','agile-off-road','method-race-wheels','victron-energy','owl-vans','van-compass','aluminess','flatline-van-co','storyteller-overland','winnebago-revel');
