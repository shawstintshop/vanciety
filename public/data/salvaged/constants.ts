// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

// Application Constants
export const APP_NAME = 'Sprinter Society';
export const APP_DESCRIPTION = 'The ultimate vanlife community platform for Mercedes Sprinter enthusiasts';
export const APP_VERSION = '1.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

// Map Constants
export const DEFAULT_MAP_CENTER = {
  lat: 39.8283,
  lng: -98.5795
}; // Geographic center of USA

export const DEFAULT_MAP_ZOOM = 4;
export const MAX_MAP_ZOOM = 18;
export const MIN_MAP_ZOOM = 3;

// Premium Subscription
export const PREMIUM_PRICE = 999; // $9.99 in cents
export const PREMIUM_FEATURES = [
  'Access to secret member spots',
  'Premium video content',
  'Advanced map features',
  'Priority forum support',
  'Verified member badge',
  'Exclusive events access',
  'Direct messaging',
  'Ad-free experience'
];

// Video Categories
export const VIDEO_CATEGORIES = [
  'Van Builds',
  'Tech Tips',
  'Camping Adventures',
  'Vanlife Tours',
  'How-Tos',
  'Product Reviews',
  'Overland Expeditions',
  '4x4 Mods',
  'Revel Van Specifics'
];

// News Categories
export const NEWS_CATEGORIES = [
  'Industry News',
  'Product Releases',
  'Community Spotlight',
  'Travel Destinations',
  'Gear Reviews',
  'Safety Updates',
  'Legal Updates',
  'Environmental',
  'Technology'
];

// Forum Categories
export const FORUM_CATEGORIES = [
  {
    name: 'General Discussion',
    slug: 'general',
    description: 'General vanlife topics and discussions',
    icon: 'MessageCircle'
  },
  {
    name: 'Van Builds',
    slug: 'builds',
    description: 'Share your build progress and get advice',
    icon: 'Wrench'
  },
  {
    name: 'Technical Support',
    slug: 'technical',
    description: 'Get help with technical issues and repairs',
    icon: 'Settings'
  },
  {
    name: 'Travel & Routes',
    slug: 'travel',
    description: 'Share routes, destinations, and travel tips',
    icon: 'Map'
  },
  {
    name: 'Marketplace',
    slug: 'marketplace',
    description: 'Buy, sell, and trade van-related items',
    icon: 'ShoppingBag'
  },
  {
    name: 'Meetups & Events',
    slug: 'events',
    description: 'Organize and find local meetups',
    icon: 'Calendar'
  }
];

// Van Types
export const VAN_TYPES = [
  'Mercedes Sprinter 144"',
  'Mercedes Sprinter 170"',
  'Mercedes Sprinter 170" Extended',
  'Winnebago Revel',
  'Winnebago Era',
  'Roadtrek',
  'Custom Build',
  'Other'
];

// Location Types
export const LOCATION_TYPES = [
  {
    value: 'camp_spot',
    label: 'Camp Spot',
    icon: 'Tent',
    description: 'Free camping locations'
  },
  {
    value: 'meetup',
    label: 'Meetup Location',
    icon: 'Users',
    description: 'Community gathering spots'
  },
  {
    value: 'business',
    label: 'Van-Friendly Business',
    icon: 'Store',
    description: 'Businesses that welcome vanlifers'
  },
  {
    value: 'driveway_surf',
    label: 'Driveway Surfing',
    icon: 'Home',
    description: 'Member driveways for overnight parking'
  }
];

// Social Media Links
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/sprintersociety',
  youtube: 'https://youtube.com/@sprintersociety',
  facebook: 'https://facebook.com/sprintersociety',
  twitter: 'https://twitter.com/sprintersociety',
  tiktok: 'https://tiktok.com/@sprintersociety'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You must be logged in to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  PAYMENT_ERROR: 'Payment processing failed. Please try again.',
  UPLOAD_ERROR: 'File upload failed. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  POST_CREATED: 'Post created successfully!',
  MESSAGE_SENT: 'Message sent successfully!',
  SUBSCRIPTION_ACTIVATED: 'Premium subscription activated!',
  EVENT_CREATED: 'Event created successfully!',
  LOCATION_ADDED: 'Location added successfully!'
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  DISPLAY_WITH_TIME: 'MMM d, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
  TIME: 'h:mm a'
};

// Theme Colors (Earthy Adventure Theme)
export const THEME_COLORS = {
  primary: {
    50: '#f0f9f4',
    100: '#dcf3e4',
    200: '#bce7cd',
    300: '#8dd3a8',
    400: '#5bb87c',
    500: '#359a5a',
    600: '#267d47',
    700: '#20653b',
    800: '#1d5032',
    900: '#194229'
  },
  secondary: {
    50: '#f0f8ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  },
  earth: {
    50: '#faf8f3',
    100: '#f4f0e6',
    200: '#e8ddc7',
    300: '#d9c6a0',
    400: '#c9aa77',
    500: '#bc955a',
    600: '#a8824f',
    700: '#8a6b43',
    800: '#70573a',
    900: '#5c4830'
  }
};