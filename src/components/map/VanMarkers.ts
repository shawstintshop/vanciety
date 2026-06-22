// Custom van marker icons for the Vanciety map
// Uses real Revel/Agile van illustrations from /public/vans/

// ── Real van image markers ────────────────────────────────────────────────────
// Each returns an <img> HTML string for use inside a Leaflet divIcon.
// The images are served from /vans/ in the public folder.

export const createVanImageMarker = (
  vanFile: string,
  size = 64,
  pulse = false
): string => {
  const pulseRing = pulse
    ? `<div style="
        position:absolute;
        inset:-6px;
        border-radius:50%;
        border:2px solid rgba(245,158,66,0.5);
        animation:vanciety-pulse 2s ease-in-out infinite;
      "></div>`
    : '';

  return `<div style="position:relative;display:inline-block;">
    ${pulseRing}
    <img
      src="/vans/${vanFile}"
      width="${size}"
      height="${Math.round(size * 0.72)}"
      style="display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));image-rendering:auto;"
      draggable="false"
    />
  </div>`;
};

// ── Pulse animation (injected once into the page) ─────────────────────────────
export const VAN_MARKER_KEYFRAMES = `
  @keyframes vanciety-pulse {
    0%,100% { transform:scale(1); opacity:0.5; }
    50%      { transform:scale(1.3); opacity:0.15; }
  }
`;

// ── Pre-built marker types ────────────────────────────────────────────────────
export const VAN_MARKERS = {
  // Your location — white Revel with pulse
  you: (size = 56) => createVanImageMarker('van-white-revel.png', size, true),

  // Friend/member van — silver Revel with pulse
  friend: (size = 44) => createVanImageMarker('van-silver-revel.png', size, true),

  // Event markers by category
  event_rally:    (size = 44) => createVanImageMarker('van-blue-revel.png',  size, false),
  event_expo:     (size = 44) => createVanImageMarker('van-black-agile.png', size, false),
  event_meetup:   (size = 44) => createVanImageMarker('van-white-revel.png', size, false),
  event_workshop: (size = 44) => createVanImageMarker('van-tan.png',         size, false),
  event_gathering:(size = 44) => createVanImageMarker('van-dark-revel.png',  size, false),

  // Campsite / business
  campsite: (size = 36) => createVanImageMarker('van-silver-revel.png', size, false),
  business: (size = 36) => createVanImageMarker('van-dark-revel.png',   size, false),

  // Demo van (hero marker on map)
  demo: (size = 60) => createVanImageMarker('van-black-agile.png', size, true),
};

// Create a Leaflet divIcon from a van image
export const createVanIcon = (type: keyof typeof VAN_MARKERS, size?: number) => {
  return VAN_MARKERS[type](size);
};

// Event category → marker type
export const eventCategoryToMarker = (category: string): keyof typeof VAN_MARKERS => {
  switch (category?.toLowerCase()) {
    case 'rally':    return 'event_rally';
    case 'expo':     return 'event_expo';
    case 'meetup':   return 'event_meetup';
    case 'workshop': return 'event_workshop';
    case 'gathering':return 'event_gathering';
    default:         return 'event_meetup';
  }
};

// Legacy pin SVG (kept for vendor/manufacturer pins that are not van-type)
export const createEventPinSvg = (color: string, emoji: string, size = 40): string => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size*1.3}" width="${size}" height="${size*1.3}">
    <ellipse cx="${size/2}" cy="${size*1.2}" rx="${size*0.15}" ry="${size*0.04}" fill="rgba(0,0,0,0.2)"/>
    <line x1="${size/2}" y1="${size*0.7}" x2="${size/2}" y2="${size*1.15}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="${size/2}" cy="${size*0.38}" r="${size*0.35}" fill="${color}" stroke="white" stroke-width="2"/>
    <text x="${size/2}" y="${size*0.45}" text-anchor="middle" font-size="${size*0.35}" dominant-baseline="middle">${emoji}</text>
  </svg>`;
};

export const EVENT_PINS = {
  rally:    (size = 36) => createEventPinSvg('#E63946', '🚐', size),
  expo:     (size = 36) => createEventPinSvg('#457B9D', '🎪', size),
  meetup:   (size = 36) => createEventPinSvg('#2A9D8F', '🤝', size),
  workshop: (size = 36) => createEventPinSvg('#E9C46A', '🔧', size),
  gathering:(size = 36) => createEventPinSvg('#F4A261', '🏕️', size),
  campsite: (size = 36) => createEventPinSvg('#10b981', '⛺', size),
};
