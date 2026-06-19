export type SourceBadge = "LIVE" | "VERIFIED" | "OFFICIAL" | "SUPABASE" | "USER_GATED";

export interface VerifiedVideo {
  youtubeId: string;
  title: string;
  channel: string;
  category: string;
  sourceQuery: string;
  thumbnail: string;
}

export interface VerifiedEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  url: string;
  titleVerified: string;
  imageUrl: string;
  summary: string;
  sourceBadge: SourceBadge;
}

export interface VerifiedVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  url: string;
  titleVerified: string;
  imageUrl: string;
  description: string;
  services: string[];
  sourceBadge: SourceBadge;
}

export interface VerifiedLocation {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  type: "campsite" | "business" | "event" | "poi" | "meetup" | "driveway";
  url: string;
  imageUrl: string;
  amenities: string[];
  verified: boolean;
  sourceBadge: SourceBadge;
}

export const verifiedVideos: VerifiedVideo[] = [
  {
    youtubeId: "Ixw3ebxYxKI",
    title: "144 WB Sprinter Van Tour: The Minimalist Adventure Van",
    channel: "Lost Hiway Customs",
    category: "builds",
    sourceQuery: "sprinter van conversion tour solar build",
    thumbnail: "https://i.ytimg.com/vi/Ixw3ebxYxKI/hqdefault.jpg",
  },
  {
    youtubeId: "FfmRg-52qy4",
    title: "Premium Mercedes Sprinter Camper Van Conversion Tour!",
    channel: "SSL Campers",
    category: "builds",
    sourceQuery: "sprinter van conversion tour solar build",
    thumbnail: "https://i.ytimg.com/vi/FfmRg-52qy4/hqdefault.jpg",
  },
  {
    youtubeId: "5rx5_R-Axrg",
    title: "Ultimate Adventure Rig: 4x4 Sprinter Van Tour!",
    channel: "Forged 4x4",
    category: "offroad",
    sourceQuery: "sprinter van conversion tour solar build",
    thumbnail: "https://i.ytimg.com/vi/5rx5_R-Axrg/hqdefault.jpg",
  },
  {
    youtubeId: "OwcgNvBUPic",
    title: "Victron Off Grid System for Van Life (Beginner Friendly) | Mercedes Sprinter Van Conversion #25",
    channel: "Matt's Van",
    category: "electrical",
    sourceQuery: "van life mercedes sprinter build electrical system",
    thumbnail: "https://i.ytimg.com/vi/OwcgNvBUPic/hqdefault.jpg",
  },
  {
    youtubeId: "01F4QDVJUq0",
    title: "DIY Sprinter Camper Van Electrical Install - Full Tutorial",
    channel: "EXPLORIST life Mobile Marine & Off-Grid Electrical",
    category: "electrical",
    sourceQuery: "van life mercedes sprinter build electrical system",
    thumbnail: "https://i.ytimg.com/vi/01F4QDVJUq0/hqdefault.jpg",
  },
  {
    youtubeId: "2Lor2jWV8J4",
    title: "AEONrv at Overland Expo West 2026 | Tour the Rig in Flagstaff, AZ",
    channel: "AEONrv",
    category: "events",
    sourceQuery: "overland expo van life 2026",
    thumbnail: "https://i.ytimg.com/vi/2Lor2jWV8J4/hqdefault.jpg",
  },
  {
    youtubeId: "2i5Is3-QCA8",
    title: "Can a 4x4 Mercedes Sprinter Van really go Off Road?",
    channel: "We Hit The Road",
    category: "offroad",
    sourceQuery: "sprinter van off road adventure",
    thumbnail: "https://i.ytimg.com/vi/2i5Is3-QCA8/hqdefault.jpg",
  },
  {
    youtubeId: "xnSVDwal_jo",
    title: "Budget Vanlife Tour After 5+ Years - Ford Econoline Van Tour",
    channel: "JupiterHikes",
    category: "van-life",
    sourceQuery: "Vanciety legacy video import validated via YouTube oEmbed",
    thumbnail: "https://i.ytimg.com/vi/xnSVDwal_jo/hqdefault.jpg",
  },
  {
    youtubeId: "37rv2-nP5BQ",
    title: "Gamer Changes his life by Living in a DIY Van | VanLife Tour",
    channel: "Different Media.",
    category: "van-life",
    sourceQuery: "Vanciety legacy video import validated via YouTube oEmbed",
    thumbnail: "https://i.ytimg.com/vi/37rv2-nP5BQ/hqdefault.jpg",
  },
  {
    youtubeId: "jIwfxcZDVLQ",
    title: "Camper Van Tips No One Ever Talks About",
    channel: "Everything's Been Done",
    category: "tips",
    sourceQuery: "Vanciety legacy video import validated via YouTube oEmbed",
    thumbnail: "https://i.ytimg.com/vi/jIwfxcZDVLQ/hqdefault.jpg",
  },
  {
    youtubeId: "rmwDjISev7E",
    title: "INSANE Custom Sprinter Van Build With BIG Rear Bath: Full Luxury Overlanding Tour",
    channel: "New Jersey Outdoor Adventures",
    category: "builds",
    sourceQuery: "Vanciety legacy video import validated via YouTube oEmbed",
    thumbnail: "https://i.ytimg.com/vi/rmwDjISev7E/hqdefault.jpg",
  },
  {
    youtubeId: "gme5z-6yAWE",
    title: "The ULTIMATE 4x4 Sprinter Van Build: A $230,000 Rolling Fortress!",
    channel: "New Jersey Outdoor Adventures",
    category: "offroad",
    sourceQuery: "Vanciety legacy video import validated via YouTube oEmbed",
    thumbnail: "https://i.ytimg.com/vi/gme5z-6yAWE/hqdefault.jpg",
  },
  {
    youtubeId: "4oEbABQbQfc",
    title: "Solo Van Camping in Guthrie County!",
    channel: "VanCamp402",
    category: "camping",
    sourceQuery: "Vanciety legacy video import validated via YouTube oEmbed",
    thumbnail: "https://i.ytimg.com/vi/4oEbABQbQfc/hqdefault.jpg",
  },
];

export const verifiedEvents: VerifiedEvent[] = [
  {
    id: "overland-expo-pnw-2026",
    name: "Overland Expo Pacific Northwest",
    date: "June 26–28, 2026",
    location: "Redmond, Oregon",
    category: "Events",
    url: "https://www.overlandexpo.com/pacific-northwest/",
    titleVerified: "Overland Expo PNW | Premier Overlanding Event in Redmond",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    summary: "Official Overland Expo PNW event page verified live. Strong match for van, overland, adventure rigs, gear vendors, and community meetups.",
    sourceBadge: "OFFICIAL",
  },
  {
    id: "overland-expo-mtn-west-2026",
    name: "Overland Expo Mountain West",
    date: "August 21–23, 2026",
    location: "Loveland, Colorado",
    category: "Events",
    url: "https://www.overlandexpo.com/mtn-west/",
    titleVerified: "Overland Expo Mountain West | Loveland, Colorado",
    imageUrl: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1400&q=80",
    summary: "Official Mountain West event page verified live. Use as a real event anchor for Colorado/Front Range van-life planning.",
    sourceBadge: "OFFICIAL",
  },
  {
    id: "overland-expo-west-2027",
    name: "Overland Expo West",
    date: "May 14–16, 2027",
    location: "Flagstaff, Arizona",
    category: "Events",
    url: "https://www.overlandexpo.com/west/",
    titleVerified: "Overland Expo West | Premier Overlanding Event in Flagstaff",
    imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    summary: "Official event page verified live. The page also exposes 2026 historical/show-hour text; current hero date shows the next West event window.",
    sourceBadge: "OFFICIAL",
  },
  {
    id: "adventure-van-expo-2026",
    name: "Adventure Van Expo",
    date: "2026 season schedule listed on official site",
    location: "Multiple U.S. venues",
    category: "Events",
    url: "https://adventurevanexpo.com/",
    titleVerified: "Home | Adventure Van Expo",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80",
    summary: "Official Adventure Van Expo page verified live. Extracted schedule text included Hood River June 20–21 and additional summer/fall dates.",
    sourceBadge: "OFFICIAL",
  },
  {
    id: "nw-overland-rally",
    name: "NW Overland Rally",
    date: "June 18–21 listed on official site",
    location: "Northwest U.S.",
    category: "Events",
    url: "https://www.nwoverlandrally.com/",
    titleVerified: "HOME | NWOR Overland Rally",
    imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    summary: "Official rally site verified live; useful for Northwest overland/van-life event planning.",
    sourceBadge: "OFFICIAL",
  },
  {
    id: "descend-on-bend",
    name: "Descend on Bend",
    date: "Annual event — verify current date on official page",
    location: "Oregon",
    category: "Events",
    url: "https://descendonbend.com/",
    titleVerified: "Descend On Bend – Annual Van Life & Outdoor Gathering in Oregon",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    summary: "Official site verified live. Keep date as official-page check until a current date is extracted from the source.",
    sourceBadge: "OFFICIAL",
  },
];

export const verifiedVendors: VerifiedVendor[] = [
  {
    id: "outside-van",
    name: "Outside Van",
    category: "Van Builders",
    location: "Portland, Oregon",
    url: "https://www.outsidevan.com/",
    titleVerified: "Outside Van | Purpose-Built Adventure Vans",
    imageUrl: "https://images.unsplash.com/photo-1544978503-7ad5ac882d5d?auto=format&fit=crop&w=1400&q=80",
    description: "Purpose-built adventure van conversions. Official site verified live.",
    services: ["Custom van builds", "Adventure layouts", "Sprinter conversions"],
    sourceBadge: "OFFICIAL",
  },
  {
    id: "field-van",
    name: "Field Van",
    category: "Van Builders",
    location: "Fresno, California",
    url: "https://fieldvan.com/",
    titleVerified: "Fresno Camper Vans: Ford Transit, Mercedes Sprinter, Dodge Ram",
    imageUrl: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?auto=format&fit=crop&w=1400&q=80",
    description: "Camper vans for Ford Transit, Mercedes Sprinter, and Dodge Ram. Official site verified live.",
    services: ["Camper vans", "Sprinter builds", "Transit builds", "Ram builds"],
    sourceBadge: "OFFICIAL",
  },
  {
    id: "storyteller-overland",
    name: "Storyteller Overland",
    category: "Adventure Vans",
    location: "Birmingham, Alabama",
    url: "https://storytelleroverland.com/",
    titleVerified: "Storyteller Overland | Best Off-Road Adventure Vehicles",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
    description: "Off-road adventure vehicles and MODE vans. Official site verified live.",
    services: ["Adventure vans", "Off-road rigs", "Dealer network"],
    sourceBadge: "OFFICIAL",
  },
  {
    id: "explorist-life",
    name: "EXPLORIST.life",
    category: "Electrical & Solar",
    location: "Online education / mobile electrical",
    url: "https://www.explorist.life/",
    titleVerified: "Official site reachable",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80",
    description: "Mobile, marine, and off-grid electrical education and resources. Official site verified reachable.",
    services: ["Electrical diagrams", "Solar education", "Van power tutorials"],
    sourceBadge: "OFFICIAL",
  },
  {
    id: "faroutride",
    name: "FarOutRide",
    category: "DIY Build Resource",
    location: "Online",
    url: "https://faroutride.com/",
    titleVerified: "FarOutRide.com | Travel Far. Get Out. Ride Everyday.",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
    description: "DIY van conversion guides, electrical resources, and build documentation. Official site verified live.",
    services: ["DIY guides", "Build documentation", "Electrical resources"],
    sourceBadge: "OFFICIAL",
  },
];

export const verifiedLocations: VerifiedLocation[] = [
  {
    id: "recreation-gov",
    name: "Recreation.gov Campground Finder",
    description: "Official federal recreation booking and campground search. Use for bookable public campgrounds.",
    latitude: 39.8283,
    longitude: -98.5795,
    type: "campsite",
    url: "https://www.recreation.gov/",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=80",
    amenities: ["Official bookings", "Federal campgrounds", "Permits", "Maps"],
    verified: true,
    sourceBadge: "OFFICIAL",
  },
  {
    id: "blm-camping",
    name: "BLM Camping Guidance",
    description: "Official Bureau of Land Management camping guidance and public-land recreation rules.",
    latitude: 39.5,
    longitude: -111.5,
    type: "poi",
    url: "https://www.blm.gov/programs/recreation/camping",
    imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    amenities: ["Public land", "Dispersed camping rules", "Official guidance"],
    verified: true,
    sourceBadge: "OFFICIAL",
  },
  {
    id: "freecampsites",
    name: "FreeCampsites.net",
    description: "Community campground discovery source. Use with judgment and verify current local rules before arrival.",
    latitude: 38.5,
    longitude: -110.0,
    type: "campsite",
    url: "https://freecampsites.net/",
    imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80",
    amenities: ["Community reports", "Free camping leads", "Route planning"],
    verified: true,
    sourceBadge: "VERIFIED",
  },
  {
    id: "overland-expo-pnw-location",
    name: "Overland Expo PNW — Redmond, OR",
    description: "Verified official event anchor for PNW van/overland community planning.",
    latitude: 44.2726,
    longitude: -121.1739,
    type: "event",
    url: "https://www.overlandexpo.com/pacific-northwest/",
    imageUrl: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1400&q=80",
    amenities: ["Event", "Vendors", "Education", "Community"],
    verified: true,
    sourceBadge: "OFFICIAL",
  },
  {
    id: "overland-expo-mtn-west-location",
    name: "Overland Expo Mountain West — Loveland, CO",
    description: "Verified official event anchor for Colorado van/overland community planning.",
    latitude: 40.3978,
    longitude: -105.0749,
    type: "event",
    url: "https://www.overlandexpo.com/mtn-west/",
    imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    amenities: ["Event", "Training", "Vendors", "Community"],
    verified: true,
    sourceBadge: "OFFICIAL",
  },
];

export const liveSourceNotes = {
  photos: "Photos load from remote image CDN links.",
  videos: "Video links open real YouTube videos and channels.",
  events: "Event and vendor cards link to the organizer or business page for current details.",
  tracking: "Member locations appear only when a signed-in member chooses to share an approximate area.",
};

export const sourceBadgeClass = (source: SourceBadge) => {
  switch (source) {
    case "LIVE": return "bg-green-600 text-white";
    case "OFFICIAL": return "bg-blue-600 text-white";
    case "SUPABASE": return "bg-emerald-600 text-white";
    case "USER_GATED": return "bg-amber-500 text-black";
    default: return "bg-slate-600 text-white";
  }
};
