// vancietyVerified — verified data for About, Vendors, News, and other pages

export const verifiedVendors = [
  {
    id: 'pacific-van-repair',
    name: 'Pacific Northwest Van Repair',
    category: 'Service',
    location: 'Seattle, WA',
    description: 'Sprinter specialist — diagnostics, conversions, and van life prep.',
    website: 'https://example.com',
    verified: true,
    source: 'community',
  },
  {
    id: 'overlander-supply',
    name: 'Overlander Supply Co.',
    category: 'Gear',
    location: 'Portland, OR',
    description: 'Overland gear, solar components, and van conversion supplies.',
    website: 'https://example.com',
    verified: true,
    source: 'community',
  },
  {
    id: 'adventure-van-outfitters',
    name: 'Adventure Van Outfitters',
    category: 'Builders',
    location: 'Eureka, CA',
    description: 'Full van conversions and custom builds for Sprinter and Transit.',
    website: 'https://example.com',
    verified: true,
    source: 'community',
  },
];

export const verifiedLocations = [
  { id: 'loc-1', name: 'Mount Rainier — Ohanapecosh', type: 'campsite' as const, state: 'WA', latitude: 46.7318, longitude: -121.5685, description: 'Old-growth forest campground at Mount Rainier', amenities: ['restrooms', 'water', 'trails'], verified: true, url: '', imageUrl: '', sourceBadge: 'verified' },
  { id: 'loc-2', name: 'Olympic Peninsula — Rialto Beach', type: 'campsite' as const, state: 'WA', latitude: 47.9215, longitude: -124.6384, description: 'Dramatic sea stacks and coastal camping', amenities: ['beach', 'trails', 'wildlife'], verified: true, url: '', imageUrl: '', sourceBadge: 'verified' },
  { id: 'loc-3', name: 'Deception Pass State Park', type: 'campsite' as const, state: 'WA', latitude: 48.4028, longitude: -122.6368, description: 'Iconic bridge and rugged coastline camping', amenities: ['restrooms', 'water', 'trails', 'beach'], verified: true, url: '', imageUrl: '', sourceBadge: 'verified' },
  { id: 'loc-4', name: 'Smith Rock State Park', type: 'campsite' as const, state: 'OR', latitude: 44.3672, longitude: -121.1420, description: 'World-class rock climbing and camping in the high desert', amenities: ['restrooms', 'water', 'trails', 'climbing'], verified: true, url: '', imageUrl: '', sourceBadge: 'verified' },
  { id: 'loc-5', name: 'Crater Lake — Mazama Campground', type: 'campsite' as const, state: 'OR', latitude: 42.8684, longitude: -122.1685, description: 'Camp near the deepest lake in the US', amenities: ['restrooms', 'water', 'trails', 'store'], verified: true, url: '', imageUrl: '', sourceBadge: 'verified' },
];

export const verifiedVideos = [
  { title: 'Complete Solar Setup for Van Life', channel: 'Will Prowse', youtube_id: 'YpHsKFhMmE4' },
  { title: 'Complete Sprinter Van Conversion Build', channel: 'Eamon & Bec', youtube_id: 'qH8kYKN8JfY' },
  { title: 'Van Life Electrical System Explained', channel: 'Build A Green RV', youtube_id: 'w7PfpzQCS0g' },
];

export const verifiedEvents: { name: string; type: string; location: string }[] = [
  { name: 'Portland Van Life Meetup', type: 'meetup', location: 'Portland, OR' },
  { name: 'NorCal Van Life Gathering', type: 'gathering', location: 'Northern California' },
];

export const liveSourceNotes = [
  'All event info links to official pages — verify dates and tickets at the source.',
  'Vanciety does not sell tickets or guarantee event availability.',
  'Community-submitted events are reviewed but not independently verified.',
];

export const sourceBadgeClass = (source: string): string => {
  if (source === 'community') return 'bg-green-500/10 text-green-600 border-green-500/20';
  if (source === 'verified') return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  return 'bg-muted text-muted-foreground border-border';
};
