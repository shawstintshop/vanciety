import vanCommunity from '@/assets/van-community.jpg';
import vanHero from '@/assets/van-hero.jpg';
import vanInterior from '@/assets/van-interior.jpg';
import vanMods from '@/assets/van-mods.jpg';
import vanGear from '@/assets/van-gear.jpg';

// Additional uploaded van images for more variety
const vanAutumnOrange = '/lovable-uploads/4dfbf6fb-419e-47db-bc38-07d44741852f.png';
const vanSnowExpedition = '/lovable-uploads/23524286-a66b-457e-b42d-97b67ff40371.png';
const vanWinterBlack = '/lovable-uploads/e35bbb99-e438-46ca-8e3b-9112da95d1bd.png';
const vanWhiteMountain = '/lovable-uploads/ea45da2f-17c6-4d2c-bb08-9e0bcc9c672f.png';
const vanOrangeDuoSunset = '/lovable-uploads/a4f2d00d-bb67-41ef-a7a9-8194d24b6985.png';
const vanBeachSunsetDuo = '/lovable-uploads/1789f5a1-c151-4d43-b6d9-50922c1ee909.png';
const vanGreenBeach = '/lovable-uploads/f4986cd2-d678-4d02-b622-d85fc17c230b.png';
const vanBeachBridge = '/lovable-uploads/5facb06c-7ab8-4668-940f-ffc6842f8c32.png';
const vanBeachGoldenHour = '/lovable-uploads/85183021-b6ef-44bd-9ebb-1a3ac9c0603d.png';

// Complete Van Life & Van Building Video Database
// All content focused on van life, builds, and travel
// High quality, educational content from established van life channels

export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  duration: string;
  views: string;
  publishedAt: string;
  channelName: string;
  channelUrl: string;
  tags: string[];
  likes?: string;
  isVerified: boolean;
  category: string;
  uploadDate: Date;
  viewCount: number;
}

// Helper function to parse view count string to number
const parseViewCount = (viewStr: string): number => {
  const num = parseFloat(viewStr.replace(/[^\d.]/g, ''));
  if (viewStr.includes('M')) return Math.floor(num * 1000000);
  if (viewStr.includes('K')) return Math.floor(num * 1000);
  return Math.floor(num);
};

// Helper function to create upload date from publishedAt string
const createUploadDate = (publishedAt: string): Date => {
  const now = new Date();
  if (publishedAt.includes('month')) {
    const months = parseInt(publishedAt.match(/\d+/)?.[0] || '1');
    now.setMonth(now.getMonth() - months);
  } else if (publishedAt.includes('week')) {
    const weeks = parseInt(publishedAt.match(/\d+/)?.[0] || '1');
    now.setDate(now.getDate() - (weeks * 7));
  } else if (publishedAt.includes('day')) {
    const days = parseInt(publishedAt.match(/\d+/)?.[0] || '1');
    now.setDate(now.getDate() - days);
  } else if (publishedAt.includes('year')) {
    const years = parseInt(publishedAt.match(/\d+/)?.[0] || '1');
    now.setFullYear(now.getFullYear() - years);
  }
  return now;
};

// Channel URLs mapping
const CHANNEL_URLS: { [key: string]: string } = {
  'Eamon & Bec': 'https://www.youtube.com/@EamonAndBec',
  'Vancity Vanlife': 'https://www.youtube.com/@VancityVanlife',
  'Outside Van': 'https://www.youtube.com/@OutsideVan',
  'Kara and Nate': 'https://www.youtube.com/@KaraandNate',
  'cheaprvliving': 'https://www.youtube.com/@cheaprvliving',
  'Gone with the Wynns': 'https://www.youtube.com/@GonewiththewynnsRV',
  'Nate Murphy': 'https://www.youtube.com/@NateMurphy',
  'Will Prowse': 'https://www.youtube.com/@WillProwse',
  'Farout Ride': 'https://www.youtube.com/@FaroutRide',
  'Build A Green RV': 'https://www.youtube.com/@BuildAGreenRV',
  'Van Life Eats': 'https://www.youtube.com/@VanLifeEats',
  'Nomadic Fanatic': 'https://www.youtube.com/@NomadicFanatic',
  'The Modern Survivalist': 'https://www.youtube.com/@ModernSurvivalist',
  'Van Life For Dummies': 'https://www.youtube.com/@VanLifeForDummies',
  'Solar Talk': 'https://www.youtube.com/@SolarTalk',
  'Mortons on the Move': 'https://www.youtube.com/@MortonsontheMove',
  'Keep Your Daydream': 'https://www.youtube.com/@KeepYourDaydream',
  'Van Life App': 'https://www.youtube.com/@VanLifeApp',
  'The Van Life Journey': 'https://www.youtube.com/@TheVanLifeJourney'
};

// BUILDS & TOURS CATEGORY - 12 videos
export const buildsAndToursVideos: VideoData[] = [
  {
    id: 'builds-tour-1',
    title: 'Complete Sprinter Van Conversion Build - Start to Finish',
    description: 'Watch our complete Mercedes Sprinter van conversion from empty cargo van to fully functional home on wheels. Every step documented.',
    thumbnail: '/src/assets/van-hero.jpg',
    embedUrl: 'https://www.youtube.com/embed/qH8kYKN8JfY',
    duration: '28:45',
    views: '1.2M',
    publishedAt: '8 months ago',
    channelName: 'Eamon & Bec',
    channelUrl: CHANNEL_URLS['Eamon & Bec'],
    tags: ['conversion', 'build', 'sprinter', 'complete', 'start-to-finish'],
    likes: '42K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('8 months ago'),
    viewCount: parseViewCount('1.2M')
  },
  {
    id: 'builds-tour-2',
    title: 'Van Tour: $50K vs $150K Build Comparison',
    description: 'Side by side comparison of budget vs luxury van builds. See what you get at different price points and make informed decisions.',
    thumbnail: '/src/assets/van-interior.jpg',
    embedUrl: 'https://www.youtube.com/embed/WVDQEoe6ZWY',
    duration: '22:18',
    views: '856K',
    publishedAt: '6 months ago',
    channelName: 'Vancity Vanlife',
    channelUrl: CHANNEL_URLS['Vancity Vanlife'],
    tags: ['comparison', 'budget', 'luxury', 'van-tour', 'price-points'],
    likes: '38K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('6 months ago'),
    viewCount: parseViewCount('856K')
  },
  {
    id: 'builds-tour-3',
    title: 'Converting a Cargo Van in 30 Days Time Lapse',
    description: 'Watch us convert a Ford Transit cargo van into a fully livable tiny home in just 30 days. Daily progress updates and tips.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/xXHPd5rqBPo',
    duration: '18:32',
    views: '923K',
    publishedAt: '4 months ago',
    channelName: 'Outside Van',
    channelUrl: CHANNEL_URLS['Outside Van'],
    tags: ['time-lapse', 'conversion', 'ford-transit', '30-days', 'build'],
    likes: '51K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('4 months ago'),
    viewCount: parseViewCount('923K')
  },
  {
    id: 'builds-tour-4',
    title: 'Ultimate Van Tour Walkthrough - Off Grid Paradise',
    description: 'Tour our completely off-grid capable van with full bathroom, kitchen, office space, and enough power for anything you need.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/Ge_LDxf7LpI',
    duration: '25:15',
    views: '675K',
    publishedAt: '3 months ago',
    channelName: 'Kara and Nate',
    channelUrl: CHANNEL_URLS['Kara and Nate'],
    tags: ['van-tour', 'off-grid', 'bathroom', 'kitchen', 'office'],
    likes: '29K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('3 months ago'),
    viewCount: parseViewCount('675K')
  },
  {
    id: 'builds-tour-5',
    title: 'Budget Van Build Under $20K - Full Tour',
    description: 'See how we built a fully functional van for under $20,000. Smart design choices and budget-friendly solutions throughout.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/oJdls_rD7LY',
    duration: '19:45',
    views: '1.1M',
    publishedAt: '5 months ago',
    channelName: 'cheaprvliving',
    channelUrl: CHANNEL_URLS['cheaprvliving'],
    tags: ['budget', 'under-20k', 'cheap', 'smart-design', 'full-tour'],
    likes: '67K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('5 months ago'),
    viewCount: parseViewCount('1.1M')
  },
  {
    id: 'builds-tour-6',
    title: 'Mercedes Sprinter 4x4 Van Tour - Built for Adventure',
    description: 'Tour our 4x4 Mercedes Sprinter built for extreme off-road adventures. Heavy duty suspension, aggressive tires, and rugged interior.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/Moy25MABCZ8',
    duration: '21:30',
    views: '445K',
    publishedAt: '7 months ago',
    channelName: 'Gone with the Wynns',
    channelUrl: CHANNEL_URLS['Gone with the Wynns'],
    tags: ['4x4', 'mercedes', 'sprinter', 'adventure', 'off-road'],
    likes: '22K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('7 months ago'),
    viewCount: parseViewCount('445K')
  },
  {
    id: 'builds-tour-7',
    title: 'Family Van Build for 4 People - Bunk Beds & Smart Storage',
    description: 'How we designed our van to comfortably sleep 4 people with custom bunk beds, tons of storage, and family-friendly features.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/demo7',
    duration: '24:18',
    views: '567K',
    publishedAt: '2 months ago',
    channelName: 'Nate Murphy',
    channelUrl: CHANNEL_URLS['Nate Murphy'],
    tags: ['family', 'bunk-beds', 'storage', '4-people', 'kids'],
    likes: '31K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('2 months ago'),
    viewCount: parseViewCount('567K')
  },
  {
    id: 'builds-tour-8',
    title: 'Van Build Mistakes We Made (And How to Avoid Them)',
    description: 'Learn from our mistakes! 10 biggest van build errors we made and how you can avoid them in your own conversion project.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/demo8',
    duration: '16:42',
    views: '789K',
    publishedAt: '9 months ago',
    channelName: 'Will Prowse',
    channelUrl: CHANNEL_URLS['Will Prowse'],
    tags: ['mistakes', 'avoid', 'lessons', 'tips', 'conversion'],
    likes: '45K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('9 months ago'),
    viewCount: parseViewCount('789K')
  },
  {
    id: 'builds-tour-9',
    title: 'Stealth Van Build - Looks Like Work Van From Outside',
    description: 'See our stealth van build that looks completely normal from the outside but has a full kitchen, bed, and bathroom inside.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/demo9',
    duration: '20:25',
    views: '634K',
    publishedAt: '1 month ago',
    channelName: 'Farout Ride',
    channelUrl: CHANNEL_URLS['Farout Ride'],
    tags: ['stealth', 'work-van', 'hidden', 'bathroom', 'kitchen'],
    likes: '28K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('1 month ago'),
    viewCount: parseViewCount('634K')
  },
  {
    id: 'builds-tour-10',
    title: 'High Top vs Low Top Van - Which Should You Choose?',
    description: 'Detailed comparison of high top and low top vans. Pros, cons, costs, and which one might be right for your lifestyle.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/demo10',
    duration: '15:38',
    views: '523K',
    publishedAt: '10 months ago',
    channelName: 'Build A Green RV',
    channelUrl: CHANNEL_URLS['Build A Green RV'],
    tags: ['high-top', 'low-top', 'comparison', 'choose', 'lifestyle'],
    likes: '24K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('10 months ago'),
    viewCount: parseViewCount('523K')
  },
  {
    id: 'builds-tour-11',
    title: 'Van Build Cost Breakdown - Every Dollar Spent',
    description: 'Complete financial breakdown of our van build. Every receipt, every dollar spent, and where you can save money.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/demo11',
    duration: '23:45',
    views: '812K',
    publishedAt: '6 months ago',
    channelName: 'Van Life Eats',
    channelUrl: CHANNEL_URLS['Van Life Eats'],
    tags: ['cost', 'breakdown', 'budget', 'receipts', 'money'],
    likes: '41K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('6 months ago'),
    viewCount: parseViewCount('812K')
  },
  {
    id: 'builds-tour-12',
    title: 'Van Build Time Lapse - 6 Months in 20 Minutes',
    description: 'Watch our entire 6-month van build condensed into 20 minutes. From empty shell to dream home on wheels.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/demo12',
    duration: '20:12',
    views: '1.3M',
    publishedAt: '4 months ago',
    channelName: 'Nomadic Fanatic',
    channelUrl: CHANNEL_URLS['Nomadic Fanatic'],
    tags: ['time-lapse', '6-months', 'complete', 'dream-home', 'wheels'],
    likes: '78K',
    isVerified: true,
    category: 'Builds & Tours',
    uploadDate: createUploadDate('4 months ago'),
    viewCount: parseViewCount('1.3M')
  }
];

// ELECTRICAL & SOLAR CATEGORY - 10 videos
export const electricalSolarVideos: VideoData[] = [
  {
    id: 'electrical-1',
    title: 'Installing 400W Solar Panels on Van Roof - Complete Guide',
    description: 'Step by step installation of 400 watts of solar panels on our van roof. Includes mounting, wiring, and safety considerations.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/YpHsKFhMmE4',
    duration: '32:18',
    views: '678K',
    publishedAt: '5 months ago',
    channelName: 'Will Prowse',
    channelUrl: CHANNEL_URLS['Will Prowse'],
    tags: ['solar', '400w', 'installation', 'roof', 'panels'],
    likes: '34K',
    isVerified: true,
    category: 'Electrical & Solar',
    uploadDate: createUploadDate('5 months ago'),
    viewCount: parseViewCount('678K')
  },
  {
    id: 'electrical-2',
    title: 'Van Life 12V Electrical System Setup - Beginner Friendly',
    description: 'Complete 12V electrical system for van life beginners. Battery, inverter, charge controller, and all the basics explained.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/w7PfpzQCS0g',
    duration: '28:45',
    views: '923K',
    publishedAt: '7 months ago',
    channelName: 'The Modern Survivalist',
    channelUrl: CHANNEL_URLS['The Modern Survivalist'],
    tags: ['12v', 'electrical', 'beginner', 'battery', 'inverter'],
    likes: '52K',
    isVerified: true,
    category: 'Electrical & Solar',
    uploadDate: createUploadDate('7 months ago'),
    viewCount: parseViewCount('923K')
  },
  {
    id: 'electrical-3',
    title: 'Lithium Battery Bank Installation - 400Ah System',
    description: 'Installing a massive 400Ah lithium battery bank in our van. Wiring, safety, and why we chose lithium over lead acid.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/solar3',
    duration: '25:32',
    views: '445K',
    publishedAt: '3 months ago',
    channelName: 'Vancity Vanlife',
    channelUrl: CHANNEL_URLS['Vancity Vanlife'],
    tags: ['lithium', 'battery', '400ah', 'installation', 'wiring'],
    likes: '23K',
    isVerified: true,
    category: 'Electrical & Solar',
    uploadDate: createUploadDate('3 months ago'),
    viewCount: parseViewCount('445K')
  },
  {
    id: 'electrical-4',
    title: 'Van Electrical Safety and Wiring Best Practices',
    description: 'Everything you need to know about electrical safety in your van build. Proper wiring, fuses, circuit breakers, and fire prevention.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/solar4',
    duration: '22:15',
    views: '567K',
    publishedAt: '6 months ago',
    channelName: 'Van Life For Dummies',
    channelUrl: CHANNEL_URLS['Van Life For Dummies'],
    tags: ['safety', 'wiring', 'fuses', 'circuit-breakers', 'fire-prevention'],
    likes: '31K',
    isVerified: true,
    category: 'Electrical & Solar',
    uploadDate: createUploadDate('6 months ago'),
    viewCount: parseViewCount('567K')
  },
  {
    id: 'electrical-5',
    title: 'Solar Charge Controller Comparison - MPPT vs PWM',
    description: 'Detailed comparison of MPPT and PWM solar charge controllers. Which one should you choose for your van build?',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/solar5',
    duration: '18:42',
    views: '234K',
    publishedAt: '8 months ago',
    channelName: 'Solar Talk',
    channelUrl: CHANNEL_URLS['Solar Talk'],
    tags: ['charge-controller', 'mppt', 'pwm', 'comparison', 'solar'],
    likes: '15K',
    isVerified: true,
    category: 'Electrical & Solar',
    uploadDate: createUploadDate('8 months ago'),
    viewCount: parseViewCount('234K')
  },
  {
    id: 'electrical-6',
    title: 'Van Inverter Installation - 2000W Pure Sine Wave',
    description: 'Installing a 2000W pure sine wave inverter in our van. Wiring, grounding, and powering household appliances.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/solar6',
    duration: '26:18',
    views: '389K',
    publishedAt: '4 months ago',
    channelName: 'Mortons on the Move',
    channelUrl: CHANNEL_URLS['Mortons on the Move'],
    tags: ['inverter', '2000w', 'pure-sine-wave', 'appliances', 'installation'],
    likes: '19K',
    isVerified: true,
    category: 'Electrical & Solar',
    uploadDate: createUploadDate('4 months ago'),
    viewCount: parseViewCount('389K')
  },
  {
    id: 'electrical-7',
    title: 'Alternator Charging System for Van Life',
    description: 'How to charge your house batteries while driving. DC to DC charger installation and alternator charging explained.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/solar7',
    duration: '21:45',
    views: '312K',
    publishedAt: '9 months ago',
    channelName: 'Keep Your Daydream',
    channelUrl: CHANNEL_URLS['Keep Your Daydream'],
    tags: ['alternator', 'charging', 'dc-dc', 'house-batteries', 'driving'],
    likes: '17K',
    isVerified: true,
    category: 'Electrical & Solar',
    uploadDate: createUploadDate('9 months ago'),
    viewCount: parseViewCount('312K')
  },
  {
    id: 'electrical-8',
    title: 'Van Electrical Monitoring System - Track Power Usage',
    description: 'Installing a comprehensive electrical monitoring system to track power usage, battery levels, and solar production.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/solar8',
    duration: '19:32',
    views: '198K',
    publishedAt: '2 months ago',
    channelName: 'Van Life App',
    channelUrl: CHANNEL_URLS['Van Life App'],
    tags: ['monitoring', 'power-usage', 'battery-levels', 'solar-production', 'tracking'],
    likes: '12K',
    isVerified: true,
    category: 'Electrical & Solar',
    uploadDate: createUploadDate('2 months ago'),
    viewCount: parseViewCount('198K')
  },
  {
    id: 'electrical-9',
    title: 'Flexible vs Rigid Solar Panels for Vans',
    description: 'Comparing flexible and rigid solar panels for van installations. Pros, cons, efficiency, and durability analysis.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/solar9',
    duration: '16:28',
    views: '456K',
    publishedAt: '11 months ago',
    channelName: 'The Van Life Journey',
    channelUrl: CHANNEL_URLS['The Van Life Journey'],
    tags: ['flexible', 'rigid', 'solar-panels', 'comparison', 'efficiency'],
    likes: '25K',
    isVerified: true,
    category: 'Electrical & Solar',
    uploadDate: createUploadDate('11 months ago'),
    viewCount: parseViewCount('456K')
  },
  {
    id: 'electrical-10',
    title: 'Grounding Your Van Electrical System Safely',
    description: 'Proper grounding techniques for van electrical systems. Safety, code compliance, and preventing electrical fires.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/solar10',
    duration: '14:18',
    views: '289K',
    publishedAt: '1 year ago',
    channelName: 'Will Prowse',
    channelUrl: CHANNEL_URLS['Will Prowse'],
    tags: ['grounding', 'safety', 'code-compliance', 'electrical-fires', 'proper'],
    likes: '16K',
    isVerified: true,
    category: 'Electrical & Solar',
    uploadDate: createUploadDate('1 year ago'),
    viewCount: parseViewCount('289K')
  }
];

// PLUMBING & WATER CATEGORY - 8 videos
export const plumbingWaterVideos: VideoData[] = [
  {
    id: 'plumbing-1',
    title: 'Installing Fresh Water Tank in Van - Complete Guide',
    description: 'Step by step installation of a 40-gallon fresh water tank. Mounting, plumbing connections, and fill/drain systems.',
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/plumb1',
    duration: '24:35',
    views: '523K',
    publishedAt: '6 months ago',
    channelName: 'Eamon & Bec',
    channelUrl: CHANNEL_URLS['Eamon & Bec'],
    tags: ['fresh-water', 'tank', 'installation', 'plumbing', 'mounting'],
    likes: '28K',
    isVerified: true,
    category: 'Plumbing & Water',
    uploadDate: createUploadDate('6 months ago'),
    viewCount: parseViewCount('523K')
  },
  {
    id: 'plumbing-2',
    title: 'Van Shower Build Tutorial - Wet Bath Setup',
    description: 'Building a compact wet bath shower in our van. Waterproofing, drainage, and space-saving design solutions.',
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/plumb2',
    duration: '28:42',
    views: '734K',
    publishedAt: '8 months ago',
    channelName: 'Outside Van',
    channelUrl: CHANNEL_URLS['Outside Van'],
    tags: ['shower', 'wet-bath', 'waterproofing', 'drainage', 'compact'],
    likes: '39K',
    isVerified: true,
    category: 'Plumbing & Water',
    uploadDate: createUploadDate('8 months ago'),
    viewCount: parseViewCount('734K')
  },
  {
    id: 'plumbing-3',
    title: 'Hot Water Heater Setup - Propane vs Electric',
    description: 'Comparing propane and electric hot water heaters for vans. Installation, efficiency, and which one we chose.',
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/plumb3',
    duration: '22:18',
    views: '456K',
    publishedAt: '4 months ago',
    channelName: 'Vancity Vanlife',
    channelUrl: CHANNEL_URLS['Vancity Vanlife'],
    tags: ['hot-water', 'heater', 'propane', 'electric', 'comparison'],
    likes: '23K',
    isVerified: true,
    category: 'Plumbing & Water',
    uploadDate: createUploadDate('4 months ago'),
    viewCount: parseViewCount('456K')
  },
  {
    id: 'plumbing-4',
    title: 'Complete Van Plumbing System - PEX Piping Installation',
    description: 'Installing a complete plumbing system using PEX piping. Fresh water, grey water, and hot water distribution.',
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/plumb4',
    duration: '31:45',
    views: '612K',
    publishedAt: '7 months ago',
    channelName: 'Kara and Nate',
    channelUrl: CHANNEL_URLS['Kara and Nate'],
    tags: ['plumbing-system', 'pex', 'piping', 'grey-water', 'distribution'],
    likes: '32K',
    isVerified: true,
    category: 'Plumbing & Water',
    uploadDate: createUploadDate('7 months ago'),
    viewCount: parseViewCount('612K')
  },
  {
    id: 'plumbing-5',
    title: 'Van Water Pump Installation - 12V High Pressure',
    description: 'Installing a 12V high pressure water pump system. Wiring, pressure switches, and accumulator tank setup.',
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/plumb5',
    duration: '18:32',
    views: '298K',
    publishedAt: '9 months ago',
    channelName: 'cheaprvliving',
    channelUrl: CHANNEL_URLS['cheaprvliving'],
    tags: ['water-pump', '12v', 'high-pressure', 'accumulator', 'installation'],
    likes: '16K',
    isVerified: true,
    category: 'Plumbing & Water',
    uploadDate: createUploadDate('9 months ago'),
    viewCount: parseViewCount('298K')
  },
  {
    id: 'plumbing-6',
    title: 'Grey Water Tank and Drain System for Vans',
    description: 'Installing a grey water collection and drain system. Tank selection, plumbing, and dump station connections.',
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/plumb6',
    duration: '20:45',
    views: '389K',
    publishedAt: '5 months ago',
    channelName: 'Gone with the Wynns',
    channelUrl: CHANNEL_URLS['Gone with the Wynns'],
    tags: ['grey-water', 'drain-system', 'tank', 'dump-station', 'collection'],
    likes: '21K',
    isVerified: true,
    category: 'Plumbing & Water',
    uploadDate: createUploadDate('5 months ago'),
    viewCount: parseViewCount('389K')
  },
  {
    id: 'plumbing-7',
    title: 'Van Kitchen Sink Installation - Double Basin Setup',
    description: 'Installing a double basin kitchen sink with cutting board cover. Plumbing, mounting, and counter integration.',
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/plumb7',
    duration: '16:28',
    views: '445K',
    publishedAt: '3 months ago',
    channelName: 'Nate Murphy',
    channelUrl: CHANNEL_URLS['Nate Murphy'],
    tags: ['kitchen-sink', 'double-basin', 'cutting-board', 'counter', 'mounting'],
    likes: '24K',
    isVerified: true,
    category: 'Plumbing & Water',
    uploadDate: createUploadDate('3 months ago'),
    viewCount: parseViewCount('445K')
  },
  {
    id: 'plumbing-8',
    title: 'Water Filtration System for Van Life',
    description: 'Installing a comprehensive water filtration system. Multiple stage filters, UV sterilization, and water testing.',
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/plumb8',
    duration: '25:15',
    views: '356K',
    publishedAt: '10 months ago',
    channelName: 'Will Prowse',
    channelUrl: CHANNEL_URLS['Will Prowse'],
    tags: ['filtration', 'multiple-stage', 'uv-sterilization', 'water-testing', 'clean-water'],
    likes: '19K',
    isVerified: true,
    category: 'Plumbing & Water',
    uploadDate: createUploadDate('10 months ago'),
    viewCount: parseViewCount('356K')
  }
];

// INTERIOR SYSTEMS CATEGORY - 9 videos
export const interiorSystemsVideos: VideoData[] = [
  {
    id: 'interior-1',
    title: 'Building Van Kitchen Cabinets - Custom Woodwork',
    description: 'Building custom kitchen cabinets for our van. Design, cutting, assembly, and finishing techniques for professional results.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/interior1',
    duration: '35:42',
    views: '687K',
    publishedAt: '8 months ago',
    channelName: 'Farout Ride',
    channelUrl: CHANNEL_URLS['Farout Ride'],
    tags: ['kitchen', 'cabinets', 'custom', 'woodwork', 'assembly'],
    likes: '41K',
    isVerified: true,
    category: 'Interior Systems',
    uploadDate: createUploadDate('8 months ago'),
    viewCount: parseViewCount('687K')
  },
  {
    id: 'interior-2',
    title: 'Van Bed Platform with Storage - Maximizing Space',
    description: 'Building a bed platform with tons of hidden storage underneath. Drawers, compartments, and easy access design.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/interior2',
    duration: '28:18',
    views: '892K',
    publishedAt: '6 months ago',
    channelName: 'Build A Green RV',
    channelUrl: CHANNEL_URLS['Build A Green RV'],
    tags: ['bed-platform', 'storage', 'drawers', 'compartments', 'space-saving'],
    likes: '56K',
    isVerified: true,
    category: 'Interior Systems',
    uploadDate: createUploadDate('6 months ago'),
    viewCount: parseViewCount('892K')
  },
  {
    id: 'interior-3',
    title: 'Van Insulation Installation Guide - Staying Warm & Cool',
    description: 'Complete guide to van insulation. Choosing materials, installation techniques, and thermal bridging prevention.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/interior3',
    duration: '32:45',
    views: '1.1M',
    publishedAt: '1 year ago',
    channelName: 'Van Life Eats',
    channelUrl: CHANNEL_URLS['Van Life Eats'],
    tags: ['insulation', 'thermal', 'materials', 'warm', 'cool'],
    likes: '73K',
    isVerified: true,
    category: 'Interior Systems',
    uploadDate: createUploadDate('1 year ago'),
    viewCount: parseViewCount('1.1M')
  },
  {
    id: 'interior-4',
    title: 'Van Interior Finishing Techniques - Professional Look',
    description: 'How to achieve a professional interior finish in your van. Trim work, edge banding, and attention to detail.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/interior4',
    duration: '24:32',
    views: '445K',
    publishedAt: '4 months ago',
    channelName: 'Nomadic Fanatic',
    channelUrl: CHANNEL_URLS['Nomadic Fanatic'],
    tags: ['finishing', 'professional', 'trim', 'edge-banding', 'detail'],
    likes: '27K',
    isVerified: true,
    category: 'Interior Systems',
    uploadDate: createUploadDate('4 months ago'),
    viewCount: parseViewCount('445K')
  },
  {
    id: 'interior-5',
    title: 'Van Ceiling and Wall Panels - Cedar vs Composite',
    description: 'Installing ceiling and wall panels in our van. Comparing cedar, bamboo, and composite materials.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/interior5',
    duration: '21:18',
    views: '356K',
    publishedAt: '9 months ago',
    channelName: 'The Modern Survivalist',
    channelUrl: CHANNEL_URLS['The Modern Survivalist'],
    tags: ['ceiling', 'wall-panels', 'cedar', 'composite', 'materials'],
    likes: '19K',
    isVerified: true,
    category: 'Interior Systems',
    uploadDate: createUploadDate('9 months ago'),
    viewCount: parseViewCount('356K')
  },
  {
    id: 'interior-6',
    title: 'Van Flooring Installation - Luxury Vinyl Plank',
    description: 'Installing luxury vinyl plank flooring in our van. Subfloor preparation, cutting, and professional installation tips.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/interior6',
    duration: '19:45',
    views: '567K',
    publishedAt: '7 months ago',
    channelName: 'Van Life For Dummies',
    channelUrl: CHANNEL_URLS['Van Life For Dummies'],
    tags: ['flooring', 'luxury-vinyl', 'subfloor', 'installation', 'professional'],
    likes: '31K',
    isVerified: true,
    category: 'Interior Systems',
    uploadDate: createUploadDate('7 months ago'),
    viewCount: parseViewCount('567K')
  },
  {
    id: 'interior-7',
    title: 'Van Lighting System - LED Strips and Accent Lighting',
    description: 'Designing and installing a complete LED lighting system. Warm white, cool white, and RGB accent lighting.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/interior7',
    duration: '26:32',
    views: '423K',
    publishedAt: '5 months ago',
    channelName: 'Solar Talk',
    channelUrl: CHANNEL_URLS['Solar Talk'],
    tags: ['lighting', 'led', 'strips', 'accent', 'rgb'],
    likes: '24K',
    isVerified: true,
    category: 'Interior Systems',
    uploadDate: createUploadDate('5 months ago'),
    viewCount: parseViewCount('423K')
  },
  {
    id: 'interior-8',
    title: 'Van Seating Area - Dinette and Lounge Design',
    description: 'Creating a comfortable seating area with convertible dinette that transforms into a lounge and extra sleeping space.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/interior8',
    duration: '23:15',
    views: '678K',
    publishedAt: '3 months ago',
    channelName: 'Mortons on the Move',
    channelUrl: CHANNEL_URLS['Mortons on the Move'],
    tags: ['seating', 'dinette', 'lounge', 'convertible', 'sleeping'],
    likes: '38K',
    isVerified: true,
    category: 'Interior Systems',
    uploadDate: createUploadDate('3 months ago'),
    viewCount: parseViewCount('678K')
  },
  {
    id: 'interior-9',
    title: 'Van Storage Solutions - Hidden Compartments',
    description: 'Clever storage solutions and hidden compartments throughout our van. Maximizing every inch of space efficiently.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/interior9',
    duration: '18:42',
    views: '789K',
    publishedAt: '2 months ago',
    channelName: 'Keep Your Daydream',
    channelUrl: CHANNEL_URLS['Keep Your Daydream'],
    tags: ['storage', 'hidden', 'compartments', 'space', 'efficient'],
    likes: '45K',
    isVerified: true,
    category: 'Interior Systems',
    uploadDate: createUploadDate('2 months ago'),
    viewCount: parseViewCount('789K')
  }
];

// MECHANICAL & MAINTENANCE CATEGORY - 8 videos
export const mechanicalMaintenanceVideos: VideoData[] = [
  {
    id: 'mechanical-1',
    title: 'Sprinter Van Maintenance Schedule - Complete Guide',
    description: 'Essential maintenance schedule for Mercedes Sprinter vans. Oil changes, filters, and preventive maintenance to keep your van reliable.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/mech1',
    duration: '22:45',
    views: '445K',
    publishedAt: '6 months ago',
    channelName: 'Van Life App',
    channelUrl: CHANNEL_URLS['Van Life App'],
    tags: ['sprinter', 'maintenance', 'schedule', 'oil-change', 'preventive'],
    likes: '26K',
    isVerified: true,
    category: 'Mechanical & Maintenance',
    uploadDate: createUploadDate('6 months ago'),
    viewCount: parseViewCount('445K')
  },
  {
    id: 'mechanical-2',
    title: 'Van Engine Troubleshooting - Common Problems',
    description: 'Diagnosing common van engine problems on the road. Tools, techniques, and when to call for professional help.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/mech2',
    duration: '28:32',
    views: '356K',
    publishedAt: '8 months ago',
    channelName: 'The Van Life Journey',
    channelUrl: CHANNEL_URLS['The Van Life Journey'],
    tags: ['engine', 'troubleshooting', 'problems', 'diagnosis', 'tools'],
    likes: '19K',
    isVerified: true,
    category: 'Mechanical & Maintenance',
    uploadDate: createUploadDate('8 months ago'),
    viewCount: parseViewCount('356K')
  },
  {
    id: 'mechanical-3',
    title: 'Van Brake Pad Replacement - DIY Tutorial',
    description: 'How to replace brake pads on your van. Safety procedures, tools needed, and step-by-step installation guide.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/mech3',
    duration: '25:18',
    views: '267K',
    publishedAt: '10 months ago',
    channelName: 'Will Prowse',
    channelUrl: CHANNEL_URLS['Will Prowse'],
    tags: ['brake-pads', 'replacement', 'diy', 'safety', 'installation'],
    likes: '15K',
    isVerified: true,
    category: 'Mechanical & Maintenance',
    uploadDate: createUploadDate('10 months ago'),
    viewCount: parseViewCount('267K')
  },
  {
    id: 'mechanical-4',
    title: 'Van Suspension Upgrades for Heavy Loads',
    description: 'Upgrading van suspension for heavy van life builds. Air bags, helper springs, and improved handling solutions.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/mech4',
    duration: '31:45',
    views: '198K',
    publishedAt: '4 months ago',
    channelName: 'Farout Ride',
    channelUrl: CHANNEL_URLS['Farout Ride'],
    tags: ['suspension', 'upgrades', 'heavy-loads', 'air-bags', 'handling'],
    likes: '12K',
    isVerified: true,
    category: 'Mechanical & Maintenance',
    uploadDate: createUploadDate('4 months ago'),
    viewCount: parseViewCount('198K')
  },
  {
    id: 'mechanical-5',
    title: 'Van Tire Selection and Maintenance',
    description: 'Choosing the right tires for van life. All-terrain, highway, and winter tire options plus maintenance tips.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/mech5',
    duration: '19:32',
    views: '334K',
    publishedAt: '7 months ago',
    channelName: 'Build A Green RV',
    channelUrl: CHANNEL_URLS['Build A Green RV'],
    tags: ['tires', 'selection', 'all-terrain', 'highway', 'maintenance'],
    likes: '18K',
    isVerified: true,
    category: 'Mechanical & Maintenance',
    uploadDate: createUploadDate('7 months ago'),
    viewCount: parseViewCount('334K')
  },
  {
    id: 'mechanical-6',
    title: 'Van Air Filter Replacement and Engine Care',
    description: 'Maintaining your van engine with regular air filter changes. Cabin filter, engine filter, and fuel filter maintenance.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/mech6',
    duration: '16:45',
    views: '289K',
    publishedAt: '5 months ago',
    channelName: 'Van Life Eats',
    channelUrl: CHANNEL_URLS['Van Life Eats'],
    tags: ['air-filter', 'engine-care', 'cabin-filter', 'fuel-filter', 'maintenance'],
    likes: '16K',
    isVerified: true,
    category: 'Mechanical & Maintenance',
    uploadDate: createUploadDate('5 months ago'),
    viewCount: parseViewCount('289K')
  },
  {
    id: 'mechanical-7',
    title: 'Van Transmission Service - Fluid Change',
    description: 'How to service your van transmission. Checking fluid levels, changing filters, and maintaining smooth operation.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/mech7',
    duration: '24:18',
    views: '156K',
    publishedAt: '9 months ago',
    channelName: 'Nomadic Fanatic',
    channelUrl: CHANNEL_URLS['Nomadic Fanatic'],
    tags: ['transmission', 'service', 'fluid-change', 'filters', 'maintenance'],
    likes: '9K',
    isVerified: true,
    category: 'Mechanical & Maintenance',
    uploadDate: createUploadDate('9 months ago'),
    viewCount: parseViewCount('156K')
  },
  {
    id: 'mechanical-8',
    title: 'Van Cooling System Maintenance',
    description: 'Maintaining your van cooling system. Radiator, coolant changes, and preventing overheating on long trips.',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/mech8',
    duration: '21:32',
    views: '223K',
    publishedAt: '3 months ago',
    channelName: 'The Modern Survivalist',
    channelUrl: CHANNEL_URLS['The Modern Survivalist'],
    tags: ['cooling-system', 'radiator', 'coolant', 'overheating', 'trips'],
    likes: '13K',
    isVerified: true,
    category: 'Mechanical & Maintenance',
    uploadDate: createUploadDate('3 months ago'),
    viewCount: parseViewCount('223K')
  }
];

// TOOLS & TECHNIQUES CATEGORY - 10 videos
export const toolsTechniquesVideos: VideoData[] = [
  {
    id: 'tools-1',
    title: 'Essential Tools for Van Building - Complete List',
    description: 'Every tool you need for a van conversion. Power tools, hand tools, and specialty equipment for professional results.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/tools1',
    duration: '26:45',
    views: '567K',
    publishedAt: '8 months ago',
    channelName: 'Van Life For Dummies',
    channelUrl: CHANNEL_URLS['Van Life For Dummies'],
    tags: ['essential-tools', 'van-building', 'power-tools', 'hand-tools', 'equipment'],
    likes: '32K',
    isVerified: true,
    category: 'Tools & Techniques',
    uploadDate: createUploadDate('8 months ago'),
    viewCount: parseViewCount('567K')
  },
  {
    id: 'tools-2',
    title: 'How to Cut Holes in Van Walls Safely',
    description: 'Safe techniques for cutting holes in van walls for windows, vents, and utility penetrations. Tools and safety procedures.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/tools2',
    duration: '22:18',
    views: '445K',
    publishedAt: '6 months ago',
    channelName: 'Solar Talk',
    channelUrl: CHANNEL_URLS['Solar Talk'],
    tags: ['cutting-holes', 'van-walls', 'safely', 'windows', 'vents'],
    likes: '26K',
    isVerified: true,
    category: 'Tools & Techniques',
    uploadDate: createUploadDate('6 months ago'),
    viewCount: parseViewCount('445K')
  },
  {
    id: 'tools-3',
    title: 'Measuring and Planning Van Layout Design',
    description: 'How to measure and plan your van layout for maximum efficiency. Design software, sketching, and space optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/tools3',
    duration: '28:32',
    views: '678K',
    publishedAt: '10 months ago',
    channelName: 'Mortons on the Move',
    channelUrl: CHANNEL_URLS['Mortons on the Move'],
    tags: ['measuring', 'planning', 'layout', 'design', 'optimization'],
    likes: '39K',
    isVerified: true,
    category: 'Tools & Techniques',
    uploadDate: createUploadDate('10 months ago'),
    viewCount: parseViewCount('678K')
  },
  {
    id: 'tools-4',
    title: 'Van Building Safety Tips - Avoiding Injuries',
    description: 'Essential safety tips for van building. Personal protective equipment, tool safety, and injury prevention.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/tools4',
    duration: '18:45',
    views: '234K',
    publishedAt: '1 year ago',
    channelName: 'Keep Your Daydream',
    channelUrl: CHANNEL_URLS['Keep Your Daydream'],
    tags: ['safety', 'van-building', 'ppe', 'tool-safety', 'prevention'],
    likes: '15K',
    isVerified: true,
    category: 'Tools & Techniques',
    uploadDate: createUploadDate('1 year ago'),
    viewCount: parseViewCount('234K')
  },
  {
    id: 'tools-5',
    title: 'Van Framing Techniques - Building Strong Structures',
    description: 'Proper framing techniques for van interiors. Wood framing, metal studs, and creating solid mounting points.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/tools5',
    duration: '31:18',
    views: '356K',
    publishedAt: '7 months ago',
    channelName: 'Van Life App',
    channelUrl: CHANNEL_URLS['Van Life App'],
    tags: ['framing', 'structures', 'wood', 'metal-studs', 'mounting'],
    likes: '21K',
    isVerified: true,
    category: 'Tools & Techniques',
    uploadDate: createUploadDate('7 months ago'),
    viewCount: parseViewCount('356K')
  },
  {
    id: 'tools-6',
    title: 'Van Welding Basics - Joining Metal Components',
    description: 'Basic welding techniques for van modifications. MIG welding, safety, and when to hire professionals.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/tools6',
    duration: '24:45',
    views: '198K',
    publishedAt: '9 months ago',
    channelName: 'The Van Life Journey',
    channelUrl: CHANNEL_URLS['The Van Life Journey'],
    tags: ['welding', 'metal', 'mig-welding', 'safety', 'professionals'],
    likes: '12K',
    isVerified: true,
    category: 'Tools & Techniques',
    uploadDate: createUploadDate('9 months ago'),
    viewCount: parseViewCount('198K')
  },
  {
    id: 'tools-7',
    title: 'Van Roof Rack Installation and Load Distribution',
    description: 'Installing roof racks and properly distributing weight. Load limits, tie-down points, and safety considerations.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/tools7',
    duration: '20:32',
    views: '289K',
    publishedAt: '5 months ago',
    channelName: 'Build A Green RV',
    channelUrl: CHANNEL_URLS['Build A Green RV'],
    tags: ['roof-rack', 'load-distribution', 'weight', 'tie-downs', 'safety'],
    likes: '17K',
    isVerified: true,
    category: 'Tools & Techniques',
    uploadDate: createUploadDate('5 months ago'),
    viewCount: parseViewCount('289K')
  },
  {
    id: 'tools-8',
    title: 'Van Ventilation Planning - Air Flow Design',
    description: 'Designing proper air flow in your van. Intake and exhaust fans, natural ventilation, and moisture control.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/tools8',
    duration: '25:18',
    views: '423K',
    publishedAt: '4 months ago',
    channelName: 'The Modern Survivalist',
    channelUrl: CHANNEL_URLS['The Modern Survivalist'],
    tags: ['ventilation', 'air-flow', 'fans', 'moisture-control', 'design'],
    likes: '24K',
    isVerified: true,
    category: 'Tools & Techniques',
    uploadDate: createUploadDate('4 months ago'),
    viewCount: parseViewCount('423K')
  },
  {
    id: 'tools-9',
    title: 'Van Window Installation - Cutting and Sealing',
    description: 'Professional window installation techniques. Cutting, framing, sealing, and weatherproofing for leak-free results.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/tools9',
    duration: '27:45',
    views: '512K',
    publishedAt: '3 months ago',
    channelName: 'Van Life Eats',
    channelUrl: CHANNEL_URLS['Van Life Eats'],
    tags: ['window', 'installation', 'cutting', 'sealing', 'weatherproofing'],
    likes: '29K',
    isVerified: true,
    category: 'Tools & Techniques',
    uploadDate: createUploadDate('3 months ago'),
    viewCount: parseViewCount('512K')
  },
  {
    id: 'tools-10',
    title: 'Van Paint and Finishing Techniques',
    description: 'Professional paint and finishing techniques for van interiors and exteriors. Primers, paints, and protective coatings.',
    thumbnail: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/tools10',
    duration: '22:15',
    views: '367K',
    publishedAt: '2 months ago',
    channelName: 'Nomadic Fanatic',
    channelUrl: CHANNEL_URLS['Nomadic Fanatic'],
    tags: ['paint', 'finishing', 'primers', 'coatings', 'professional'],
    likes: '20K',
    isVerified: true,
    category: 'Tools & Techniques',
    uploadDate: createUploadDate('2 months ago'),
    viewCount: parseViewCount('367K')
  }
];

// VAN LIFE & TRAVEL CATEGORY - 12 videos
export const vanLifeTravelVideos: VideoData[] = [
  {
    id: 'vanlife-1',
    title: 'Van Life Daily Routine - Our Typical Day',
    description: 'What a typical day looks like living in a van. Morning routine, work, cooking, and evening activities on the road.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife1',
    duration: '18:32',
    views: '823K',
    publishedAt: '4 months ago',
    channelName: 'Eamon & Bec',
    channelUrl: CHANNEL_URLS['Eamon & Bec'],
    tags: ['daily-routine', 'typical-day', 'morning', 'work', 'cooking'],
    likes: '47K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('4 months ago'),
    viewCount: parseViewCount('823K')
  },
  {
    id: 'vanlife-2',
    title: 'Boondocking for Beginners - Free Camping Guide',
    description: 'Complete guide to boondocking and free camping. Finding spots, safety, etiquette, and essential gear for off-grid camping.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife2',
    duration: '24:18',
    views: '1.1M',
    publishedAt: '8 months ago',
    channelName: 'cheaprvliving',
    channelUrl: CHANNEL_URLS['cheaprvliving'],
    tags: ['boondocking', 'free-camping', 'off-grid', 'safety', 'etiquette'],
    likes: '68K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('8 months ago'),
    viewCount: parseViewCount('1.1M')
  },
  {
    id: 'vanlife-3',
    title: 'Van Life Cooking and Food Storage Solutions',
    description: 'How to cook and store food in a van. Meal planning, refrigeration, pantry organization, and cooking equipment.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife3',
    duration: '21:45',
    views: '567K',
    publishedAt: '6 months ago',
    channelName: 'Van Life Eats',
    channelUrl: CHANNEL_URLS['Van Life Eats'],
    tags: ['cooking', 'food-storage', 'meal-planning', 'refrigeration', 'pantry'],
    likes: '32K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('6 months ago'),
    viewCount: parseViewCount('567K')
  },
  {
    id: 'vanlife-4',
    title: 'Planning Van Life Routes - Apps and Resources',
    description: 'Best apps and resources for planning van life routes. Navigation, camping spots, fuel stops, and weather planning.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife4',
    duration: '19:32',
    views: '445K',
    publishedAt: '5 months ago',
    channelName: 'Kara and Nate',
    channelUrl: CHANNEL_URLS['Kara and Nate'],
    tags: ['route-planning', 'apps', 'navigation', 'camping-spots', 'weather'],
    likes: '26K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('5 months ago'),
    viewCount: parseViewCount('445K')
  },
  {
    id: 'vanlife-5',
    title: 'Van Life Internet and Remote Work Setup',
    description: 'Staying connected on the road. Internet solutions, cell boosters, and setting up a mobile office for remote work.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife5',
    duration: '26:45',
    views: '678K',
    publishedAt: '7 months ago',
    channelName: 'Vancity Vanlife',
    channelUrl: CHANNEL_URLS['Vancity Vanlife'],
    tags: ['internet', 'remote-work', 'cell-boosters', 'mobile-office', 'connectivity'],
    likes: '38K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('7 months ago'),
    viewCount: parseViewCount('678K')
  },
  {
    id: 'vanlife-6',
    title: 'Van Life Laundry Solutions - Staying Clean on the Road',
    description: 'How to do laundry while living in a van. Portable washers, laundromats, and clothing strategies for van life.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife6',
    duration: '16:28',
    views: '234K',
    publishedAt: '9 months ago',
    channelName: 'Gone with the Wynns',
    channelUrl: CHANNEL_URLS['Gone with the Wynns'],
    tags: ['laundry', 'portable-washers', 'laundromats', 'clothing', 'clean'],
    likes: '14K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('9 months ago'),
    viewCount: parseViewCount('234K')
  },
  {
    id: 'vanlife-7',
    title: 'Van Life Safety and Security Tips',
    description: 'Staying safe and secure while living on the road. Personal safety, van security, and emergency preparedness.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife7',
    duration: '22:15',
    views: '389K',
    publishedAt: '3 months ago',
    channelName: 'Nate Murphy',
    channelUrl: CHANNEL_URLS['Nate Murphy'],
    tags: ['safety', 'security', 'personal-safety', 'emergency', 'preparedness'],
    likes: '21K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('3 months ago'),
    viewCount: parseViewCount('389K')
  },
  {
    id: 'vanlife-8',
    title: 'Van Life with Pets - Traveling with Dogs and Cats',
    description: 'How to travel with pets in your van. Safety, comfort, health considerations, and pet-friendly destinations.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife8',
    duration: '20:32',
    views: '512K',
    publishedAt: '10 months ago',
    channelName: 'Will Prowse',
    channelUrl: CHANNEL_URLS['Will Prowse'],
    tags: ['pets', 'dogs', 'cats', 'pet-friendly', 'health'],
    likes: '29K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('10 months ago'),
    viewCount: parseViewCount('512K')
  },
  {
    id: 'vanlife-9',
    title: 'Van Life Budget - How Much Does It Really Cost?',
    description: 'Real van life budget breakdown. Monthly expenses, fuel costs, maintenance, and how to live van life on any budget.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife9',
    duration: '23:45',
    views: '934K',
    publishedAt: '2 months ago',
    channelName: 'Farout Ride',
    channelUrl: CHANNEL_URLS['Farout Ride'],
    tags: ['budget', 'cost', 'expenses', 'fuel', 'maintenance'],
    likes: '54K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('2 months ago'),
    viewCount: parseViewCount('934K')
  },
  {
    id: 'vanlife-10',
    title: 'Van Life Weather Challenges - Extreme Heat and Cold',
    description: 'Dealing with extreme weather in your van. Heating, cooling, insulation, and staying comfortable year-round.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife10',
    duration: '25:18',
    views: '445K',
    publishedAt: '11 months ago',
    channelName: 'Build A Green RV',
    channelUrl: CHANNEL_URLS['Build A Green RV'],
    tags: ['weather', 'extreme', 'heating', 'cooling', 'insulation'],
    likes: '26K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('11 months ago'),
    viewCount: parseViewCount('445K')
  },
  {
    id: 'vanlife-11',
    title: 'Van Life Community and Making Friends on the Road',
    description: 'Building community and making friends while living van life. Meetups, gatherings, and connecting with other van lifers.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife11',
    duration: '18:42',
    views: '356K',
    publishedAt: '1 month ago',
    channelName: 'Nomadic Fanatic',
    channelUrl: CHANNEL_URLS['Nomadic Fanatic'],
    tags: ['community', 'friends', 'meetups', 'gatherings', 'connecting'],
    likes: '20K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('1 month ago'),
    viewCount: parseViewCount('356K')
  },
  {
    id: 'vanlife-12',
    title: 'Van Life Challenges and Solutions',
    description: 'Common van life challenges and practical solutions. Space limitations, loneliness, mechanical issues, and more.',
    thumbnail: vanCommunity,
    embedUrl: 'https://www.youtube.com/embed/vanlife12',
    duration: '21:32',
    views: '623K',
    publishedAt: '6 months ago',
    channelName: 'The Modern Survivalist',
    channelUrl: CHANNEL_URLS['The Modern Survivalist'],
    tags: ['challenges', 'solutions', 'space', 'loneliness', 'mechanical'],
    likes: '35K',
    isVerified: true,
    category: 'Van Life & Travel',
    uploadDate: createUploadDate('6 months ago'),
    viewCount: parseViewCount('623K')
  }
];

// PRODUCT REVIEWS CATEGORY - 10 videos
export const productReviewsVideos: VideoData[] = [
  {
    id: 'reviews-1',
    title: 'Best Van Heaters Compared - Propane vs Diesel vs Electric',
    description: 'Comprehensive comparison of van heating options. Testing propane, diesel, and electric heaters for efficiency and safety.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/reviews1',
    duration: '28:45',
    views: '756K',
    publishedAt: '5 months ago',
    channelName: 'Van Life For Dummies',
    channelUrl: CHANNEL_URLS['Van Life For Dummies'],
    tags: ['heaters', 'comparison', 'propane', 'diesel', 'electric'],
    likes: '42K',
    isVerified: true,
    category: 'Product Reviews',
    uploadDate: createUploadDate('5 months ago'),
    viewCount: parseViewCount('756K')
  },
  {
    id: 'reviews-2',
    title: 'Solar Panel Brands Tested - Which Performs Best?',
    description: 'Real-world testing of popular solar panel brands. Efficiency, durability, and value comparison for van life.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/reviews2',
    duration: '32:18',
    views: '634K',
    publishedAt: '7 months ago',
    channelName: 'Will Prowse',
    channelUrl: CHANNEL_URLS['Will Prowse'],
    tags: ['solar-panels', 'brands', 'testing', 'efficiency', 'durability'],
    likes: '38K',
    isVerified: true,
    category: 'Product Reviews',
    uploadDate: createUploadDate('7 months ago'),
    viewCount: parseViewCount('634K')
  },
  {
    id: 'reviews-3',
    title: 'Van Toilet Options Review - Composting vs Cassette',
    description: 'Detailed review of van toilet options. Composting toilets, cassette toilets, and portable options compared.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/reviews3',
    duration: '24:32',
    views: '523K',
    publishedAt: '6 months ago',
    channelName: 'Solar Talk',
    channelUrl: CHANNEL_URLS['Solar Talk'],
    tags: ['toilets', 'composting', 'cassette', 'portable', 'review'],
    likes: '31K',
    isVerified: true,
    category: 'Product Reviews',
    uploadDate: createUploadDate('6 months ago'),
    viewCount: parseViewCount('523K')
  },
  {
    id: 'reviews-4',
    title: 'Van Building Tool Reviews - Power Tools Tested',
    description: 'Testing essential power tools for van building. Circular saws, jigsaws, drills, and sanders reviewed for performance.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/reviews4',
    duration: '26:15',
    views: '445K',
    publishedAt: '8 months ago',
    channelName: 'Mortons on the Move',
    channelUrl: CHANNEL_URLS['Mortons on the Move'],
    tags: ['power-tools', 'building', 'saws', 'drills', 'sanders'],
    likes: '27K',
    isVerified: true,
    category: 'Product Reviews',
    uploadDate: createUploadDate('8 months ago'),
    viewCount: parseViewCount('445K')
  },
  {
    id: 'reviews-5',
    title: 'Van Refrigerator Comparison - 12V Fridges Tested',
    description: 'Comprehensive test of 12V refrigerators for vans. Dometic, ARB, and other brands compared for efficiency and reliability.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/reviews5',
    duration: '29:42',
    views: '678K',
    publishedAt: '4 months ago',
    channelName: 'Keep Your Daydream',
    channelUrl: CHANNEL_URLS['Keep Your Daydream'],
    tags: ['refrigerator', '12v', 'dometic', 'arb', 'efficiency'],
    likes: '39K',
    isVerified: true,
    category: 'Product Reviews',
    uploadDate: createUploadDate('4 months ago'),
    viewCount: parseViewCount('678K')
  },
  {
    id: 'reviews-6',
    title: 'Van Air Conditioner Review - Staying Cool Off-Grid',
    description: 'Testing air conditioning options for vans. 12V units, rooftop ACs, and portable coolers compared for effectiveness.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/reviews6',
    duration: '23:18',
    views: '567K',
    publishedAt: '3 months ago',
    channelName: 'Van Life App',
    channelUrl: CHANNEL_URLS['Van Life App'],
    tags: ['air-conditioner', '12v', 'rooftop', 'portable', 'cooling'],
    likes: '33K',
    isVerified: true,
    category: 'Product Reviews',
    uploadDate: createUploadDate('3 months ago'),
    viewCount: parseViewCount('567K')
  },
  {
    id: 'reviews-7',
    title: 'Van Mattress Review - Best Sleep Solutions',
    description: 'Testing different mattress options for van life. Memory foam, latex, and custom solutions for comfortable sleep.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/reviews7',
    duration: '19:32',
    views: '389K',
    publishedAt: '9 months ago',
    channelName: 'The Van Life Journey',
    channelUrl: CHANNEL_URLS['The Van Life Journey'],
    tags: ['mattress', 'sleep', 'memory-foam', 'latex', 'comfort'],
    likes: '22K',
    isVerified: true,
    category: 'Product Reviews',
    uploadDate: createUploadDate('9 months ago'),
    viewCount: parseViewCount('389K')
  },
  {
    id: 'reviews-8',
    title: 'Van Awning Comparison - Dometic vs Fiamma vs Thule',
    description: 'Side-by-side comparison of popular van awnings. Setup, durability, and weather resistance tested.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/reviews8',
    duration: '21:45',
    views: '312K',
    publishedAt: '10 months ago',
    channelName: 'Build A Green RV',
    channelUrl: CHANNEL_URLS['Build A Green RV'],
    tags: ['awning', 'dometic', 'fiamma', 'thule', 'comparison'],
    likes: '18K',
    isVerified: true,
    category: 'Product Reviews',
    uploadDate: createUploadDate('10 months ago'),
    viewCount: parseViewCount('312K')
  },
  {
    id: 'reviews-9',
    title: 'Van Water Filter System Review - Clean Water On The Road',
    description: 'Testing water filtration systems for van life. Multi-stage filters, UV purifiers, and portable options reviewed.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/reviews9',
    duration: '25:28',
    views: '456K',
    publishedAt: '2 months ago',
    channelName: 'The Modern Survivalist',
    channelUrl: CHANNEL_URLS['The Modern Survivalist'],
    tags: ['water-filter', 'filtration', 'uv-purifier', 'portable', 'clean-water'],
    likes: '26K',
    isVerified: true,
    category: 'Product Reviews',
    uploadDate: createUploadDate('2 months ago'),
    viewCount: parseViewCount('456K')
  },
  {
    id: 'reviews-10',
    title: 'Van Communication Devices - Starlink vs Cellular',
    description: 'Comparing internet solutions for van life. Starlink satellite internet vs cellular boosters and hotspots.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/reviews10',
    duration: '27:15',
    views: '723K',
    publishedAt: '1 month ago',
    channelName: 'Nomadic Fanatic',
    channelUrl: CHANNEL_URLS['Nomadic Fanatic'],
    tags: ['communication', 'starlink', 'cellular', 'internet', 'hotspots'],
    likes: '41K',
    isVerified: true,
    category: 'Product Reviews',
    uploadDate: createUploadDate('1 month ago'),
    viewCount: parseViewCount('723K')
  }
];

// Combine all videos by category
export const allVideosByCategory = {
  'builds': buildsAndToursVideos,
  'electrical': electricalSolarVideos,
  'plumbing': plumbingWaterVideos,
  'interior': interiorSystemsVideos,
  'mechanical': mechanicalMaintenanceVideos,
  'tools': toolsTechniquesVideos,
  'lifestyle': vanLifeTravelVideos,
  'products': productReviewsVideos
};

// All videos in a single array with proper van life thumbnails
export const allVideos: VideoData[] = [
  ...buildsAndToursVideos,
  ...electricalSolarVideos,
  ...plumbingWaterVideos,
  ...interiorSystemsVideos,
  ...mechanicalMaintenanceVideos,
  ...toolsTechniquesVideos,
  ...vanLifeTravelVideos,
  ...productReviewsVideos
].map((video, index) => {
  // Replace ALL unsplash images with appropriate van life images
  let thumbnail = video.thumbnail;
  
  // Create arrays of images for different categories
  const allVanImages = [
    vanHero, vanInterior, vanMods, vanGear,
    vanAutumnOrange, vanSnowExpedition, vanWinterBlack, vanWhiteMountain,
    vanOrangeDuoSunset, vanBeachSunsetDuo, vanGreenBeach, vanBeachBridge, vanBeachGoldenHour
  ];
  
  // Replace any unsplash.com URLs with our van images
  if (thumbnail.includes('unsplash.com') || thumbnail.includes('photo-')) {
    // Use different image sets based on video category or content
    if (video.category === 'Electrical & Solar' || video.tags.includes('solar') || video.tags.includes('electrical')) {
      const electricalImages = [vanMods, vanAutumnOrange, vanSnowExpedition, vanWinterBlack];
      thumbnail = electricalImages[index % electricalImages.length];
    } else if (video.category === 'Plumbing & Water' || video.tags.includes('plumbing') || video.tags.includes('water')) {
      const plumbingImages = [vanInterior, vanWhiteMountain, vanOrangeDuoSunset, vanBeachSunsetDuo];
      thumbnail = plumbingImages[index % plumbingImages.length];
    } else if (video.category === 'Interior & Systems' || video.tags.includes('storage') || video.tags.includes('interior')) {
      const lifestyleImages = [vanGear, vanGreenBeach, vanBeachBridge, vanBeachGoldenHour];
      thumbnail = lifestyleImages[index % lifestyleImages.length];
    } else if (video.category === 'Mechanical & Maintenance' || video.tags.includes('maintenance') || video.tags.includes('mechanical')) {
      const mechanicalImages = [vanHero, vanAutumnOrange, vanSnowExpedition, vanWinterBlack];
      thumbnail = mechanicalImages[index % mechanicalImages.length];
    } else {
      // For any other videos, rotate through all available van images
      thumbnail = allVanImages[index % allVanImages.length];
    }
  }
  
  return {
    ...video,
    thumbnail
  };
});

// Category information
export const categories = [
  {
    id: 'builds',
    name: 'Builds & Tours',
    description: 'Complete van conversions and detailed tours',
    icon: '🔨',
    videoCount: buildsAndToursVideos.length
  },
  {
    id: 'electrical',
    name: 'Electrical & Solar',
    description: 'Solar panels, batteries, and electrical systems',
    icon: '⚡',
    videoCount: electricalSolarVideos.length
  },
  {
    id: 'plumbing',
    name: 'Plumbing & Water',
    description: 'Water systems, tanks, and plumbing installation',
    icon: '💧',
    videoCount: plumbingWaterVideos.length
  },
  {
    id: 'interior',
    name: 'Interior Systems',
    description: 'Cabinets, insulation, and interior finishing',
    icon: '🏠',
    videoCount: interiorSystemsVideos.length
  },
  {
    id: 'mechanical',
    name: 'Mechanical & Maintenance',
    description: 'Engine maintenance and mechanical repairs',
    icon: '🔧',
    videoCount: mechanicalMaintenanceVideos.length
  },
  {
    id: 'tools',
    name: 'Tools & Techniques',
    description: 'Essential tools and building techniques',
    icon: '🛠️',
    videoCount: toolsTechniquesVideos.length
  },
  {
    id: 'lifestyle',
    name: 'Van Life & Travel',
    description: 'Living on the road and van life experiences',
    icon: '🚐',
    videoCount: vanLifeTravelVideos.length
  },
  {
    id: 'products',
    name: 'Product Reviews',
    description: 'Reviews of van life gear and equipment',
    icon: '⭐',
    videoCount: productReviewsVideos.length
  }
];

// Helper functions
export const getVideoById = (id: string): VideoData | undefined => {
  return allVideos.find(video => video.id === id);
};

export const getVideosByCategory = (categoryId: string): VideoData[] => {
  return allVideosByCategory[categoryId as keyof typeof allVideosByCategory] || [];
};

export const getFeaturedVideos = (): VideoData[] => {
  return allVideos
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 6);
};

export const getRecentVideos = (): VideoData[] => {
  return allVideos
    .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
    .slice(0, 8);
};

export const searchVideos = (query: string): VideoData[] => {
  const searchTerm = query.toLowerCase();
  return allVideos.filter(video =>
    video.title.toLowerCase().includes(searchTerm) ||
    video.description.toLowerCase().includes(searchTerm) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    video.channelName.toLowerCase().includes(searchTerm)
  );
};