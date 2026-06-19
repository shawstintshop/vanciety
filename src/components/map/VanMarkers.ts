// Custom SVG van marker icons for the Vanciety map
// Tiny 4x4 Sprinter van icons with different colors for different marker types

export const createVanMarkerSvg = (color: string, size = 40, pulse = false): string => {
  const pulseCircle = pulse
    ? `<circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}" opacity="0.15">
        <animate attributeName="r" values="${size/2};${size*0.7};${size/2}" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite"/>
       </circle>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    ${pulseCircle}
    <!-- Shadow -->
    <ellipse cx="${size/2}" cy="${size*0.85}" rx="${size*0.25}" ry="${size*0.06}" fill="rgba(0,0,0,0.15)"/>
    <!-- Van body -->
    <g transform="translate(${size*0.15}, ${size*0.2}) scale(${size/56})">
      <!-- Main body -->
      <rect x="2" y="10" width="35" height="18" rx="3" fill="${color}" stroke="${color}" stroke-width="0.5"/>
      <!-- Cab -->
      <path d="M28,10 L35,10 Q38,10 38,13 L38,28 L28,28 Z" fill="${color}" stroke="${color}" stroke-width="0.5"/>
      <!-- Windshield -->
      <path d="M29,12 L34,12 Q36,12 36,14 L36,22 L29,22 Z" fill="rgba(255,255,255,0.85)" rx="1"/>
      <!-- Side window -->
      <rect x="16" y="12" width="11" height="8" rx="1" fill="rgba(255,255,255,0.7)"/>
      <!-- Side window 2 -->
      <rect x="4" y="12" width="10" height="8" rx="1" fill="rgba(255,255,255,0.6)"/>
      <!-- Roof rack -->
      <rect x="3" y="8" width="25" height="2.5" rx="1" fill="${color}" opacity="0.8"/>
      <rect x="6" y="7" width="3" height="1.5" rx="0.5" fill="${color}" opacity="0.6"/>
      <rect x="12" y="7" width="3" height="1.5" rx="0.5" fill="${color}" opacity="0.6"/>
      <rect x="18" y="7" width="3" height="1.5" rx="0.5" fill="${color}" opacity="0.6"/>
      <!-- Wheels -->
      <circle cx="10" cy="28" r="4.5" fill="#333" stroke="#555" stroke-width="0.5"/>
      <circle cx="10" cy="28" r="2" fill="#888"/>
      <circle cx="32" cy="28" r="4.5" fill="#333" stroke="#555" stroke-width="0.5"/>
      <circle cx="32" cy="28" r="2" fill="#888"/>
      <!-- Headlight -->
      <rect x="36" y="18" width="2.5" height="4" rx="1" fill="#FFD700"/>
      <!-- Taillight -->
      <rect x="0" y="20" width="2" height="3" rx="0.5" fill="#FF4444"/>
      <!-- Door handle -->
      <rect x="26" y="19" width="2" height="0.8" rx="0.4" fill="rgba(255,255,255,0.5)"/>
    </g>
  </svg>`;
};

// Pre-built marker types
export const VAN_MARKERS = {
  // Your location - orange (brand color)
  you: (size = 44) => createVanMarkerSvg('#E8722A', size, true),
  
  // Friend/member van - green (brand color)  
  friend: (size = 36) => createVanMarkerSvg('#2D6A4F', size, true),
  
  // Event markers by type
  event_rally: (size = 36) => createVanMarkerSvg('#E63946', size, false),
  event_expo: (size = 36) => createVanMarkerSvg('#457B9D', size, false),
  event_meetup: (size = 36) => createVanMarkerSvg('#2A9D8F', size, false),
  event_workshop: (size = 36) => createVanMarkerSvg('#E9C46A', size, false),
  event_gathering: (size = 36) => createVanMarkerSvg('#F4A261', size, false),
  
  // Campsite
  campsite: (size = 32) => createVanMarkerSvg('#10b981', size, false),
  
  // Business / van friendly
  business: (size = 32) => createVanMarkerSvg('#8b5cf6', size, false),
  
  // Demo van (for show)
  demo: (size = 48) => createVanMarkerSvg('#E8722A', size, true),
};

// Create a Leaflet divIcon from SVG
export const createVanIcon = (type: keyof typeof VAN_MARKERS, size?: number) => {
  // Returns the SVG string — caller creates L.divIcon
  const svg = VAN_MARKERS[type](size);
  return svg;
};

// Event category to marker type mapping
export const eventCategoryToMarker = (category: string): keyof typeof VAN_MARKERS => {
  switch (category?.toLowerCase()) {
    case 'rally': return 'event_rally';
    case 'expo': return 'event_expo';
    case 'meetup': return 'event_meetup';
    case 'workshop': return 'event_workshop';
    case 'gathering': return 'event_gathering';
    default: return 'event_meetup';
  }
};

// Event pin SVG (for non-van markers like pure location pins)
export const createEventPinSvg = (color: string, emoji: string, size = 40): string => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size*1.3}" width="${size}" height="${size*1.3}">
    <!-- Drop shadow -->
    <ellipse cx="${size/2}" cy="${size*1.2}" rx="${size*0.15}" ry="${size*0.04}" fill="rgba(0,0,0,0.2)"/>
    <!-- Pin stem -->
    <line x1="${size/2}" y1="${size*0.7}" x2="${size/2}" y2="${size*1.15}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <!-- Pin circle -->
    <circle cx="${size/2}" cy="${size*0.38}" r="${size*0.35}" fill="${color}" stroke="white" stroke-width="2"/>
    <!-- Emoji -->
    <text x="${size/2}" y="${size*0.45}" text-anchor="middle" font-size="${size*0.35}" dominant-baseline="middle">${emoji}</text>
  </svg>`;
};

export const EVENT_PINS = {
  rally: (size = 36) => createEventPinSvg('#E63946', '🚐', size),
  expo: (size = 36) => createEventPinSvg('#457B9D', '🎪', size),
  meetup: (size = 36) => createEventPinSvg('#2A9D8F', '🤝', size),
  workshop: (size = 36) => createEventPinSvg('#E9C46A', '🔧', size),
  gathering: (size = 36) => createEventPinSvg('#F4A261', '🏕️', size),
  campsite: (size = 36) => createEventPinSvg('#10b981', '⛺', size),
};
