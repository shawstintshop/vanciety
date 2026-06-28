import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search, MapPin, Globe, ExternalLink, Star, Zap, Truck,
  Wrench, Package, Hammer, ShoppingCart, Tent, Compass,
  Link2, ShoppingBag, Phone, ChevronRight, Award, Shield
} from "lucide-react";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Seo from "@/components/Seo";

const VENDOR_CATEGORIES = [
  { id: "all",           name: "All Vendors",          icon: ShoppingBag },
  { id: "builders",      name: "Van Builders",         icon: Hammer },
  { id: "manufacturers", name: "Manufacturers",        icon: Truck },
  { id: "parts",         name: "Parts & Components",   icon: Wrench },
  { id: "electrical",    name: "Electrical & Solar",   icon: Zap },
  { id: "gear",          name: "Accessories & Gear",   icon: Package },
  { id: "rentals",       name: "Van Rentals",          icon: Tent },
  { id: "tours",         name: "Tours & Events",       icon: Compass },
  { id: "services",      name: "Services",             icon: Star },
  { id: "dealerships",   name: "Dealerships",          icon: ShoppingCart },
  { id: "affiliate",     name: "Top Picks",            icon: Link2 },
];

const AVATAR_VENDOR = {
  business_name: "Avatar Off-Road",
  tagline: "Redefining Adventure",
  description: "Family-owned and operated in Sandy, UT — Avatar Off-Road has been crafting premium van accessories for over 30 years. From the iconic Massif rear-door storage system to Pioneer roof racks, winch bumpers, and side ladders, every product is designed in-house and made in the USA. Built for Mercedes Sprinter, Ford Transit, Nissan NV, and RAM ProMaster.",
  location: "Sandy, UT",
  phone: "(801) 569-8899",
  website_url: "https://avataroffroad.com",
  logo_url: "https://avataroffroad.com/cdn/shop/files/White_behind_Offroad_2fca5e83-6bff-4add-99bc-1fe668b06ce4.png?v=1742598895&width=300",
  banner_url: "https://avataroffroad.com/cdn/shop/files/Avatar_Offroad_Ski_Box_Bikes_Tire_Carrier_Massif_4.jpg?v=1741548077&width=2000",
  products: [
    { name: "Sprinter Front Winch Bumper", img: "https://avataroffroad.com/cdn/shop/files/frontwinchbumpersprintervan.jpg?v=1754078873&width=600", url: "https://avataroffroad.com/products/sprinter-front-winch-bumper" },
  ],
  services: ["Roof Racks", "Storage Boxes", "Bumpers", "Ladders", "Mounts", "Pro Installation"],
  vehicles: ["Mercedes Sprinter", "Ford Transit", "Nissan NV", "RAM ProMaster"],
  badges: ["Made in USA", "Family Owned", "30+ Years Experience", "Pro Install Available"],
};

const ALL_VENDORS = [
  { id:"v1",  business_name:"Vancraft Customs",        category:"builders",      location:"Portland, OR",       website_url:"https://vancraftcustoms.com",           description:"Full custom Sprinter & Transit conversions. Off-grid solar, plumbing, and luxury interiors.",                              services:["Custom Builds","Solar","Plumbing"],            rating:4.9, verified:true },
  { id:"v2",  business_name:"Titan Vans",              category:"builders",      location:"Boulder, CO",        website_url:"https://www.titanvans.com",              description:"Premier van conversion company based in Boulder. Adventure-ready builds for every lifestyle.",                           services:["Custom Builds","Off-Grid","Adventure Vans"],   rating:4.8, verified:true },
  { id:"v3",  business_name:"DM Vans",                 category:"builders",      location:"Colorado",           website_url:"https://dmvans.com",                     description:"Direct-to-consumer Class B RV manufacturer. Formerly Dave & Matt Vans.",                                               services:["Class B RV","Custom Builds"],                  rating:4.7, verified:true },
  { id:"v4",  business_name:"Grit Overland",           category:"builders",      location:"Washington",         website_url:"http://www.gritoverland.com",             description:"Pacific Northwest van builder specializing in rugged overland-ready conversions.",                                      services:["Overland Builds","Custom Interiors"],          rating:4.7, verified:true },
  { id:"v5",  business_name:"Geotrek Vans",            category:"builders",      location:"Colorado",           website_url:"https://geotrekvans.com",                description:"Premium craftsmanship, essential features, and unbeatable value for adventure seekers.",                                services:["Custom Builds","Adventure Vans"],              rating:4.8, verified:true },
  { id:"v6",  business_name:"Ready. Set. Van.",         category:"builders",      location:"Hamilton, NJ",       website_url:"https://www.readysetvan.com",             description:"Full-service camper van builder on the East Coast. Adventure-ready vans for every client.",                            services:["Custom Builds","Full Service"],                rating:4.7, verified:true },
  { id:"v7",  business_name:"Overlander Vans",         category:"builders",      location:"Pittsburgh, PA",     website_url:"https://www.overlandervans.com",          description:"Promaster, Sprinter, and Transit conversions. Bring your van or use a local dealer.",                                  services:["Conversions","Overland"],                     rating:4.6, verified:true },
  { id:"v8",  business_name:"Remote Vans",             category:"builders",      location:"Ohio",               website_url:"https://remotevans.com",                 description:"Class B RV manufacturer with advanced technologies, superior build quality, and innovative design.",                   services:["Class B RV","Advanced Tech"],                 rating:4.7, verified:true },
  { id:"v9",  business_name:"NOOVO",                   category:"builders",      location:"Nevada",             website_url:"https://www.noovolife.com",               description:"From compact agile builds to fully equipped adventure vans — innovation, comfort, and style.",                         services:["Custom Builds","Compact Vans"],               rating:4.6, verified:true },
  { id:"v10", business_name:"Canyon Adventure Vans",   category:"builders",      location:"California",         website_url:"https://canyonadventurevans.com",         description:"Revel and STO upgrades. California-based adventure van specialists.",                                                   services:["Revel Upgrades","STO Builds"],                rating:4.5, verified:true },
  { id:"v11", business_name:"Off Highway Van",         category:"builders",      location:"Salt Lake City, UT", website_url:"https://www.offhighwayvan.com",           description:"Engineers, designs, and builds fully-customizable adventure vans. Lighter, more durable, more luxurious.",             services:["Custom Builds","Luxury Interiors"],           rating:4.8, verified:true },
  { id:"v12", business_name:"RoamLab X",               category:"builders",      location:"California",         website_url:"https://roamlabx.com",                   description:"Integrated overland and van systems — built with stronger product solutions.",                                          services:["Systems Integration","Overland"],             rating:4.6, verified:true },
  { id:"v13", business_name:"Winnebago",               category:"manufacturers", location:"Forest City, IA",    website_url:"https://www.winnebago.com",              description:"Iconic American RV & camper van manufacturer. Revel, Solis, and Ekko Class B models.",                                services:["Class B Vans","Adventure Vehicles"],          rating:4.7, verified:true },
  { id:"v14", business_name:"Mercedes-Benz Sprinter",  category:"manufacturers", location:"Nationwide",         website_url:"https://www.mbvans.com",                 description:"The gold standard in van conversions. Sprinter 144 and 170 wheelbase available in high roof.",                        services:["Sprinter 144","Sprinter 170","High Roof"],    rating:4.9, verified:true },
  { id:"v15", business_name:"Ford Transit",            category:"manufacturers", location:"Nationwide",         website_url:"https://www.ford.com/commercial-trucks/transit/", description:"America's best-selling van. Available in cargo, passenger, and connect configurations.",                        services:["Transit Cargo","Transit Passenger"],          rating:4.7, verified:true },
  { id:"v16", business_name:"RAM ProMaster",           category:"manufacturers", location:"Nationwide",         website_url:"https://www.ramtrucks.com/promaster.html", description:"Front-wheel drive van with the most cargo volume in its class. Popular for tall builds.",                          services:["ProMaster 136","ProMaster 159"],              rating:4.5, verified:true },
  { id:"v17", business_name:"Nissan NV",               category:"manufacturers", location:"Nationwide",         website_url:"https://www.nissanusa.com",              description:"Reliable cargo van with strong V8 option. Popular for heavy-duty builds.",                                            services:["NV1500","NV2500","NV3500"],                   rating:4.4, verified:true },
  { id:"v18", business_name:"Flatline Van Co.",        category:"parts",         location:"Online",             website_url:"https://flatlinevanco.com",              description:"Premium parts and accessories for Sprinter, Transit, and Promaster. Roof racks, interior components, and more.",     services:["Roof Racks","Interior Parts","Safari Racks"], rating:4.9, verified:true },
  { id:"v19", business_name:"Owl Vans",                category:"parts",         location:"Arizona",            website_url:"https://owlvans.com",                    description:"Crushing the accessories market for Sprinter and Transit. New products launching constantly.",                        services:["Racks","Interior","Exterior Parts"],          rating:4.8, verified:true },
  { id:"v20", business_name:"Van Compass",             category:"parts",         location:"Online",             website_url:"https://vancompass.com",                 description:"The OG suspension upgrade for conversion vans. Nearly mandatory for heavy builds near GVWR.",                         services:["Suspension","Lift Kits","Leveling"],          rating:4.9, verified:true },
  { id:"v21", business_name:"Orion Van Gear",          category:"parts",         location:"Oregon",             website_url:"https://orionvangear.com",               description:"Oregon-made roof racks, ladders, deck panels, solar mounts, and van build gear for real-world use.",                services:["Roof Racks","Ladders","Solar Mounts"],        rating:4.8, verified:true },
  { id:"v22", business_name:"AVC RIG",                 category:"parts",         location:"Loveland, CO",       website_url:"https://avcrig.com",                     description:"Professional-grade parts and kits that take the guesswork out of your van build.",                                  services:["Build Kits","Parts","Components"],            rating:4.7, verified:true },
  { id:"v23", business_name:"RRE-Global",              category:"parts",         location:"Nevada",             website_url:"https://rre-global.com",                 description:"Sprinter upfit accessories and Smartfloors for adventure vans.",                                                      services:["Smartfloors","Upfit Accessories"],            rating:4.6, verified:true },
  { id:"v24", business_name:"Campervan HQ",            category:"parts",         location:"Online",             website_url:"https://www.campervan-hq.com",           description:"One-stop shop for van accessories and parts. Wide selection for all major platforms.",                               services:["Accessories","Parts","Gear"],                 rating:4.5, verified:true },
  { id:"v25", business_name:"Vanlife Outfitters",      category:"parts",         location:"Online",             website_url:"https://www.vanlifeoutfitters.com",       description:"Premium gear, accessories, and essentials designed to enhance every van life journey.",                               services:["Accessories","Gear","Essentials"],            rating:4.7, verified:true },
  { id:"v26", business_name:"The Wanderful",           category:"gear",          location:"Online",             website_url:"https://shop.thewanderful.co",           description:"Soft goods and accessories for the campervan market. Expanding product line for van lifers.",                       services:["Soft Goods","Accessories"],                   rating:4.6, verified:true },
  { id:"v27", business_name:"Victron Energy",          category:"electrical",    location:"Global",             website_url:"https://www.victronenergy.com",          description:"The gold standard in off-grid electrical. Solar charge controllers, inverters, battery monitors, and full system solutions.", services:["Solar Controllers","Inverters","Battery Monitors"], rating:4.9, verified:true },
  { id:"v28", business_name:"Battle Born Batteries",   category:"electrical",    location:"Reno, NV",           website_url:"https://battlebornbatteries.com",        description:"Premium lithium LiFePO4 batteries built for van life. Industry-leading support and quality.",                       services:["Lithium Batteries","LiFePO4","Battery Systems"], rating:4.9, verified:true },
  { id:"v29", business_name:"REDARC Electronics",      category:"electrical",    location:"Global",             website_url:"https://redarcelectronics.com",          description:"All-in-one monitoring systems for van builds. Leading electrical and solar components from Australia, now in the US.", services:["Solar","Dual Battery","Monitoring Systems"],  rating:4.8, verified:true },
  { id:"v30", business_name:"Renogy",                  category:"electrical",    location:"Online",             website_url:"https://www.renogy.com",                 description:"Affordable solar panels, charge controllers, and battery systems. Popular budget-friendly option for van builds.",   services:["Solar Panels","Charge Controllers","Batteries"], rating:4.6, verified:true },
  { id:"v31", business_name:"Webasto",                 category:"electrical",    location:"Global",             website_url:"https://www.webasto.com",                description:"Premium diesel heaters and roof vents for van life. The Air Top and Dual Top are van life staples.",                services:["Diesel Heaters","Roof Vents","Climate Control"], rating:4.7, verified:true },
  { id:"v32", business_name:"Dometic",                 category:"electrical",    location:"Global",             website_url:"https://www.dometic.com",                description:"Portable fridges, air conditioners, and van life appliances trusted by overlanders worldwide.",                    services:["Portable Fridges","AC Units","Appliances"],   rating:4.7, verified:true },
  { id:"v33", business_name:"Just Roaming Design",     category:"electrical",    location:"Online",             website_url:"https://www.justroamingdesign.com",       description:"Pre-wired 12V power boxes with Victron components. Expandable from 200Ah to 1000Ah.",                               services:["Pre-Wired Boxes","Victron Systems","12V Power"], rating:4.8, verified:true },
  { id:"v34", business_name:"Thule",                   category:"gear",          location:"Global",             website_url:"https://www.thule.com",                  description:"World-class roof racks, cargo carriers, and outdoor gear. Trusted by van lifers globally.",                        services:["Roof Racks","Cargo Carriers","Bike Racks"],   rating:4.7, verified:true },
  { id:"v35", business_name:"Yakima",                  category:"gear",          location:"Portland, OR",       website_url:"https://www.yakima.com",                 description:"Roof racks, cargo boxes, and outdoor accessories for adventure vehicles.",                                           services:["Roof Racks","Cargo Boxes","Accessories"],     rating:4.6, verified:true },
  { id:"v36", business_name:"ARB 4x4 Accessories",    category:"gear",          location:"Global",             website_url:"https://www.arbusa.com",                 description:"Premium 4WD accessories including air compressors, recovery gear, and fridge slides.",                             services:["Air Compressors","Recovery Gear","Fridge Slides"], rating:4.8, verified:true },
  { id:"v37", business_name:"Unaka Gear",              category:"gear",          location:"Online",             website_url:"https://unakagear.com",                  description:"HSLD roof racks and van accessories. Highly recommended for solar panel mounting.",                                services:["Roof Racks","Solar Mounts"],                  rating:4.7, verified:true },
  { id:"v38", business_name:"Outdoorsy",               category:"rentals",       location:"Nationwide",         website_url:"https://www.outdoorsy.com",              description:"Peer-to-peer RV and camper van rental marketplace. Thousands of listings across North America.",                  services:["Van Rentals","RV Rentals","Peer-to-Peer"],    rating:4.6, verified:true },
  { id:"v39", business_name:"RVshare",                 category:"rentals",       location:"Nationwide",         website_url:"https://rvshare.com",                    description:"The largest peer-to-peer RV rental marketplace. Find camper vans near you.",                                      services:["Van Rentals","RV Rentals"],                   rating:4.5, verified:true },
  { id:"v40", business_name:"Escape Campervans",       category:"rentals",       location:"Nationwide",         website_url:"https://www.escapecampervans.com",        description:"Affordable campervan rentals with unique hand-painted designs. Multiple US locations.",                            services:["Campervan Rentals","One-Way Rentals"],        rating:4.6, verified:true },
  { id:"v41", business_name:"Jucy Rentals",            category:"rentals",       location:"Nationwide",         website_url:"https://www.jucyrentals.com",             description:"Compact campervan rentals with everything you need for the open road.",                                          services:["Compact Vans","Budget Rentals"],              rating:4.4, verified:true },
  { id:"v42", business_name:"Overland Expo",           category:"tours",         location:"Nationwide",         website_url:"https://www.overlandexpo.com",            description:"Premier overland and van life events with classes, demos, and community gathering.",                               services:["Events","Classes","Community"],               rating:4.6, verified:true },
  { id:"v43", business_name:"Adventure Van Expo",      category:"tours",         location:"Nationwide",         website_url:"https://adventurevanexpo.com",            description:"The van life community's premier expo. Builders, vendors, and enthusiasts all in one place.",                    services:["Expo","Community","Vendors"],                 rating:4.7, verified:true },
  { id:"v44", business_name:"Descend on Bend",         category:"tours",         location:"Bend, OR",           website_url:"https://descendonbend.com",               description:"Annual van life gathering in Bend, Oregon. One of the biggest van meetups in the country.",                      services:["Annual Meetup","Community"],                  rating:4.8, verified:true },
  { id:"v45", business_name:"Farout Ride",             category:"services",      location:"Online",             website_url:"https://faroutride.com",                  description:"The most comprehensive van build guides and resources online. Transit, Sprinter, and Promaster.",                services:["Build Guides","Resources","Reviews"],         rating:4.9, verified:true },
  { id:"v46", business_name:"Bearfoot Theory",         category:"services",      location:"Online",             website_url:"https://bearfoottheory.com",              description:"Van life essentials, gear reviews, and adventure travel guides from a full-time van lifer.",                    services:["Gear Reviews","Travel Guides","Resources"],   rating:4.8, verified:true },
  { id:"v47", business_name:"Engineers Who Van Life",  category:"services",      location:"Online",             website_url:"https://engineerswhovanlife.com",          description:"Technical van build guides from engineers. Roof racks, electrical, and mechanical deep dives.",                services:["Technical Guides","Build Resources"],         rating:4.8, verified:true },
  { id:"v48", business_name:"Mercedes-Benz of Santa Rosa", category:"dealerships", location:"Santa Rosa, CA",  website_url:"https://www.mbofsantarosa.com",           description:"Premier Mercedes-Benz dealership serving the North Bay. Sprinter specialist.",                                  services:["Sprinter Sales","Service","Parts"],           rating:4.7, verified:true },
  { id:"v49", business_name:"National Van Sales",      category:"dealerships",   location:"Nationwide",         website_url:"https://nationalvansales.com",            description:"Specializing in cargo and passenger van sales nationwide. All major brands available.",                          services:["Van Sales","Fleet Sales"],                    rating:4.5, verified:true },
  { id:"v50", business_name:"Amazon Van Life Store",   category:"affiliate",     location:"Online",             website_url:"https://amazon.com/vanlife",              description:"Curated van life gear, solar panels, kitchen setups, and must-have accessories.",                               services:["Solar Panels","Kitchen Gear","Storage","Bedding"], rating:4.4, verified:true },
  // Real verified builders
  { id:"v51", business_name:"Crozier Campers",             category:"builders",      location:"Warton, Preston, UK", website_url:"https://www.croziercampers.com",           description:"Premium off-grid Sprinter campervan conversions. Models: Beyond2, Beyond2+, Beyond2c, Beyond4, and fully bespoke builds. Prices from £97,500.",                                              services:["Custom Builds","Off-Grid","Bespoke","Sprinter"],  rating:5.0, verified:true },
  { id:"v52", business_name:"Outside Van",                 category:"builders",      location:"Portland, OR",        website_url:"https://outsidevan.com",                  description:"Purpose-built adventure van conversions. Models: Overnight, Parks, Syncline, Approach, Baseline. Sprinter 144 & 170. Phone: (800) 971-8830.",                                               services:["Custom Builds","Solar","Parts","Service"],         rating:4.9, verified:true },
  { id:"v53", business_name:"Storyteller Overland",        category:"builders",      location:"Birmingham, AL",      website_url:"https://www.storytelleroverland.com",     description:"Off-road adventure vehicles and expedition trucks. MODE Van models: XO, OG, Crew, Tour. Also builds GXV overland trucks.",                                                                  services:["Custom Builds","Off-Road","Accessories","Events"],  rating:4.9, verified:true },
  { id:"v54", business_name:"Contravans",                  category:"builders",      location:"Denver, CO",          website_url:"https://www.contravans.com",               description:"Affordable adventure-ready campervan conversions. Builds for Sprinter, Transit, ProMaster, NV200. DIY kits from $8,998, full adventure builds from $49,988.",                              services:["Custom Builds","DIY Kits","Lift Kits","Medical"],  rating:4.8, verified:true },
  { id:"v55", business_name:"The Vansmith",                category:"builders",      location:"Boulder, CO",         website_url:"https://thevansmith.com",                 description:"Premium handcrafted camper van conversions for Sprinter and Transit. Full builds $60K–$150K. Installations, repairs, DIY kits, and CNC services. Phone: (303) 414-6834.",                  services:["Custom Builds","DIY Kits","CNC","Repairs"],        rating:4.9, verified:true },
  { id:"v56", business_name:"Wayfarer Vans",               category:"builders",      location:"Colorado Springs, CO",website_url:"https://wayfarervans.com",                description:"Simple, high-quality modular camper vans for RAM ProMaster and Ford Transit. Builds start from $22,500. 136\" and 159\" ProMaster, 148\" Transit configurations.",                          services:["Custom Builds","ProMaster","Transit","Modular"],   rating:4.8, verified:true },
  { id:"v57", business_name:"Trakka",                      category:"builders",      location:"Sydney, Australia",   website_url:"https://trakka.com.au",                   description:"Australian manufacturer of luxury campervans and motorhomes. Models: Trakkadu, Torino, Akuna, Jabiru. Phone: 02 7228 4426.",                                                               services:["Custom Builds","Motorhomes","Luxury","VW"],        rating:4.8, verified:true },
  { id:"v58", business_name:"Wellhouse Leisure",           category:"builders",      location:"UK",                  website_url:"https://wellhouseleisure.com",             description:"UK manufacturer of compact campervans. Converts Ford Transit Custom, Toyota Proace, KIA PV5 EV, and Suzuki Jimny. Phone: 01226 668800.",                                                    services:["Campervans","Electric","Micro Campers","UK"],      rating:4.7, verified:true },

  // ── Independent Sprinter Specialist Shops ──────────────────────────────────
  { id:"v59", business_name:"The Sprinter Shop, Inc.",       category:"services",      location:"Lakewood, WA",        website_url:"https://www.thesprintershop.com",          description:"Veteran-owned, Sprinters-only shop in the Pacific Northwest. Factory-trained techs, Xentry diagnostics, OEM parts only. 4,444+ reviews. 2-year/24k warranty. Phone: (253) 244-4472.",         services:["Sprinter Only","Diagnostics","Service A/B","Fleet","OEM Parts"],  rating:4.9, verified:true },
  { id:"v60", business_name:"Sprinter Pitstop",               category:"services",      location:"San Diego, CA",       website_url:"https://sprinterpitstop.com",              description:"12+ years serving San Diego Sprinter owners. Official Van Compass & Radflo installer. Suspension upgrades, fleet service, collision repair. Phone: (858) 727-2080.",                           services:["Sprinter Only","Suspension","Fleet","Collision","Performance"], rating:4.8, verified:true },
  { id:"v61", business_name:"Sprinter Service & Repair",      category:"services",      location:"Vista / San Diego / Redlands, CA", website_url:"https://www.sprinter.repair",              description:"Four SoCal locations (Vista, Miramar, Redlands, Santa Fe Springs). Sprinter-only specialists with free inspections and transparent online estimates. Phone: (760) 933-0000.",                services:["Sprinter Only","Diagnostics","DPF/DEF","Engine","Free Inspection"], rating:4.7, verified:true },
  { id:"v62", business_name:"Sprinter Post",                   category:"services",      location:"Portland, OR",        website_url:"https://sprinterpost.com",                 description:"Portland's dedicated Sprinter repair shop. Specializes in all Sprinter generations including T1N diesel. Highly recommended in the Pacific Northwest van community. Phone: (360) 932-8738.",   services:["Sprinter Only","T1N Diesel","Diagnostics","Repair"],             rating:4.8, verified:true },
  { id:"v63", business_name:"5280 Sprinter Service",           category:"services",      location:"Denver, CO",          website_url:"https://www.5280sprinterservice.com",      description:"Denver's go-to independent Sprinter shop. Community-focused, mobile service available. Expert in all Sprinter generations. Highly rated by the Colorado van life community.",                 services:["Sprinter Only","Mobile Service","Diagnostics","Maintenance"],   rating:4.9, verified:true },
  { id:"v64", business_name:"Colorado Fleetworks",             category:"services",      location:"Denver, CO",          website_url:"https://www.coloradofleetworks.com",       description:"Owner-operated shop with 14+ years of Sprinter experience. You talk directly to the mechanic. Specializes in Sprinter van service and repair for both personal and fleet vehicles.",          services:["Sprinter","Fleet","Diagnostics","Repair","Service A/B"],       rating:4.8, verified:true },
  { id:"v65", business_name:"The Shop Automotive",             category:"services",      location:"Boulder, CO",         website_url:"https://www.theshopboulder.com",           description:"Boulder's premier independent shop for Mercedes Sprinter and 4x4 vehicles. Trusted by the Colorado van life and overlanding community for expert Sprinter care.",                              services:["Sprinter","4x4","Mercedes","Maintenance","Repair"],             rating:4.8, verified:true },
  { id:"v66", business_name:"TCM Werkshop",                    category:"services",      location:"Austin, TX",          website_url:"https://www.tcmwerkshop.com",              description:"Austin's expert Mercedes-Benz Sprinter van repair shop. Dealer-level diagnostics and maintenance with honest, transparent service. The top-rated independent Sprinter shop in Texas.",        services:["Sprinter Only","Diagnostics","Maintenance","Repair"],           rating:4.9, verified:true },
  { id:"v67", business_name:"Sprinter Van City",               category:"services",      location:"Fort Pierce, FL",     website_url:"https://www.sprintervancity.com",          description:"Largest Sprinter van facility in Florida. Full-service repair, maintenance, and diagnostics. Centrally located on the East Coast of Florida. Phone: (772) 461-2114.",                         services:["Sprinter","Fleet","Diagnostics","Repair","Maintenance"],       rating:4.7, verified:true },
  { id:"v68", business_name:"SprinterVanShop (NomadUSA)",      category:"services",      location:"Scotch Plains, NJ",   website_url:"https://sprintervanshop.com",              description:"New Jersey's largest organized group of factory-trained Sprinter technicians. Part of the NomadUSA network. Expert diagnostics, service, and repair on all Sprinter generations.",            services:["Sprinter Only","Factory Trained","Diagnostics","Fleet"],       rating:4.8, verified:true },
  { id:"v69", business_name:"Duncan's Auto",                   category:"services",      location:"Londonderry, NH",     website_url:"https://duncansauto.com",                  description:"Independent family-owned shop near Manchester, NH specializing in Sprinter and European makes. Well-known in the New England van community for honest Sprinter service.",                      services:["Sprinter","European","Maintenance","Repair"],                  rating:4.8, verified:true },
  { id:"v70", business_name:"Matrix Integrated",               category:"services",      location:"Portland & Bend, OR", website_url:"https://www.matrixintegrated.cc",           description:"Portland and Bend Oregon's go-to shop for Sprinter vans. Master Mercedes/Sprinter technicians with honest communication and unrivaled workmanship.",                                          services:["Sprinter","Mercedes","Master Technicians","Repair"],           rating:4.9, verified:true },
  { id:"v71", business_name:"Sprinter Store",                  category:"parts",         location:"Tualatin, OR",        website_url:"https://www.sprinterstore.com",             description:"The #1 Sprinter parts and accessories authority. 20+ years trusted by van lifers and professionals. Huge selection of OEM and aftermarket parts, suspension, windows, and accessories. Phone: (503) 427-2270.", services:["Parts","Accessories","Suspension","Windows","Interiors"],    rating:4.8, verified:true },
  { id:"v72", business_name:"Sprinter Parts US",               category:"parts",         location:"Online",              website_url:"https://sprinterpartsus.com",               description:"Founded by Sprinter mechanics with 40+ years combined experience. Specializes in hard-to-find Mercedes Sprinter OEM and quality aftermarket parts shipped fast across the USA.",               services:["OEM Parts","Aftermarket","Hard-to-Find Parts","Fast Shipping"], rating:4.7, verified:true },
  { id:"v73", business_name:"Alpine Autohaus",                 category:"services",      location:"Grand Junction, CO",  website_url:"https://www.alpineautohaus.com",            description:"The ONLY recommended Sprinter specialist in Grand Junction, CO. Community-verified top choice for Sprinter repair and maintenance in Western Colorado.",                                       services:["Sprinter","European","Diagnostics","Repair"],                  rating:4.9, verified:true },
];

const Vendors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ALL_VENDORS.length };
    ALL_VENDORS.forEach((v) => { counts[v.category] = (counts[v.category] || 0) + 1; });
    return counts;
  }, []);

  const filteredVendors = useMemo(() => {
    return ALL_VENDORS.filter((vendor) => {
      const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || [vendor.business_name, vendor.category, vendor.location, vendor.description, ...(vendor.services || [])].join(" ").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getCategoryLabel = (id: string) => VENDOR_CATEGORIES.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Vanciety Vendors | Builders, Parts, Electrical & Van Services" description="Browse the most comprehensive van life vendor directory. Featured vendor: Avatar Off-Road. Builders, electrical, parts, rentals, and more." canonicalPath="/vendors" />
      <Header />
      <main className="pt-28">
        <PageHero title="Vendor Directory" subtitle="Every van life brand, builder, and supplier — in one place." badge="VENDORS" />

        {/* AVATAR PREMIUM FEATURED VENDOR */}
        <section className="bg-[#0d0d0d] py-12 border-b border-[#c9a96e]/30">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-3 mb-8">
              <Award className="h-5 w-5 text-[#c9a96e]" />
              <span className="text-[#c9a96e] text-xs font-bold uppercase tracking-[0.2em]">Premium Featured Vendor</span>
              <div className="flex-1 h-px bg-[#c9a96e]/20" />
            </div>
            <div className="relative rounded-xl overflow-hidden mb-8 border border-[#c9a96e]/20">
              <img src={AVATAR_VENDOR.banner_url} alt="Avatar Off-Road" className="w-full h-72 object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <img src={AVATAR_VENDOR.logo_url} alt="Avatar Off-Road Logo" className="h-14 w-auto mb-4 object-contain object-left" style={{ filter: "brightness(1.1)" }} />
                <h2 className="text-3xl font-black text-white uppercase tracking-wide mb-1">{AVATAR_VENDOR.business_name}</h2>
                <p className="text-[#c9a96e] text-sm font-semibold uppercase tracking-widest mb-3">{AVATAR_VENDOR.tagline}</p>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_VENDOR.badges.map((b) => (
                    <span key={b} className="bg-[#c9a96e]/20 border border-[#c9a96e]/40 text-[#c9a96e] text-xs px-3 py-1 rounded-full font-semibold">{b}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <h3 className="text-white font-bold text-lg mb-3">About Avatar Off-Road</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{AVATAR_VENDOR.description}</p>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-[#c9a96e]" /><span>{AVATAR_VENDOR.location}</span></div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-[#c9a96e]" /><span>{AVATAR_VENDOR.phone}</span></div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Globe className="h-4 w-4 text-[#c9a96e]" /><a href={AVATAR_VENDOR.website_url} target="_blank" rel="noopener noreferrer" className="text-[#c9a96e] hover:underline">avataroffroad.com</a></div>
                </div>
                <div className="mb-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Compatible Vehicles</p>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_VENDOR.vehicles.map((v) => (<span key={v} className="bg-background border border-border text-foreground text-xs px-2 py-1 rounded">{v}</span>))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href={AVATAR_VENDOR.website_url} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-[#c9a96e] hover:bg-[#b8935a] text-black font-bold text-sm">Shop Now <ChevronRight className="h-4 w-4 ml-1" /></Button>
                  </a>
                  <a href={`tel:${AVATAR_VENDOR.phone}`}>
                    <Button variant="outline" className="border-[#c9a96e]/40 text-[#c9a96e] hover:bg-[#c9a96e]/10 text-sm"><Phone className="h-4 w-4 mr-1" /> Call</Button>
                  </a>
                </div>
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-white font-bold text-lg mb-3">Featured Products</h3>
                <div className="grid grid-cols-2 gap-4">
                  {AVATAR_VENDOR.products.map((product) => (
                    <a key={product.name} href={product.url} target="_blank" rel="noopener noreferrer" className="group bg-background border border-border rounded-lg overflow-hidden hover:border-[#c9a96e]/50 transition-all duration-200">
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-foreground leading-tight mb-1">{product.name}</p>
                        <p className="text-[#c9a96e] font-bold text-sm"></p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FULL VENDOR DIRECTORY */}
        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wide">Full Vendor Directory</h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-sm">{ALL_VENDORS.length} vendors</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search vendors, services, location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {VENDOR_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${selectedCategory === cat.id ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"}`}>
                    <Icon className="h-3 w-3" />{cat.name}{count > 0 && <span className="ml-1 opacity-60">({count})</span>}
                  </button>
                );
              })}
            </div>
            {filteredVendors.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No vendors found</p>
                <p className="text-sm mt-1">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVendors.map((vendor) => (
                  <div key={vendor.id} className="group bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground text-sm leading-tight truncate">{vendor.business_name}</h3>
                          {vendor.verified && <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">{getCategoryLabel(vendor.category)}</Badge>
                      </div>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <Star className="h-3 w-3 fill-[#c9a96e] text-[#c9a96e]" />
                        <span className="text-xs font-bold text-foreground">{vendor.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{vendor.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3 flex-shrink-0" /><span className="truncate">{vendor.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {vendor.services.slice(0, 3).map((s) => (<span key={s} className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">{s}</span>))}
                      {vendor.services.length > 3 && <span className="text-[10px] text-muted-foreground px-1">+{vendor.services.length - 3}</span>}
                    </div>
                    <a href={vendor.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                      <Globe className="h-3.5 w-3.5" />Visit Website
                      <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-12 text-center border border-dashed border-border rounded-xl p-8">
              <h3 className="text-lg font-bold text-foreground mb-2">Are you a van life vendor?</h3>
              <p className="text-muted-foreground text-sm mb-4">Get listed in the Vanciety vendor directory and reach thousands of van lifers.</p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Apply to be Listed</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Vendors;
