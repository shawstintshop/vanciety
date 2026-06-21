import { useId } from "react";

/**
 * Repeating USGS-style topographic contour texture.
 * Thin, low-opacity white contour lines + concentric "peak" rings on a
 * dark background. Renders as an inline SVG <pattern> so it tiles seamlessly
 * and scales to its (relatively positioned) parent.
 */
const TopoBackground = ({
  className = "",
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) => {
  // Unique per instance so multiple topo layers on one page don't collide.
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const patternId = `topo-${rawId}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={patternId}
          width="360"
          height="360"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="#ffffff" strokeWidth="1.1">
            {/* Flowing contour lines */}
            <path strokeOpacity="0.10" d="M-40,70 C40,30 110,100 190,64 C260,32 320,96 400,62" />
            <path strokeOpacity="0.07" d="M-40,118 C44,80 108,150 188,112 C262,78 322,140 400,108" />
            <path strokeOpacity="0.09" d="M-40,170 C50,128 120,200 196,166 C268,134 326,188 400,164" />
            <path strokeOpacity="0.06" d="M-40,224 C44,184 116,256 192,224 C262,194 322,250 400,224" />
            <path strokeOpacity="0.10" d="M-40,280 C52,238 110,312 184,280 C254,250 320,314 400,286" />
            <path strokeOpacity="0.07" d="M-40,334 C48,298 112,366 190,334 C260,304 324,360 400,332" />
            {/* Concentric "peaks" for that organic topo feel */}
            <ellipse strokeOpacity="0.08" cx="130" cy="170" rx="52" ry="34" transform="rotate(-12 130 170)" />
            <ellipse strokeOpacity="0.06" cx="130" cy="170" rx="30" ry="18" transform="rotate(-12 130 170)" />
            <ellipse strokeOpacity="0.07" cx="262" cy="96" rx="40" ry="26" transform="rotate(16 262 96)" />
            <ellipse strokeOpacity="0.05" cx="262" cy="96" rx="20" ry="12" transform="rotate(16 262 96)" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

export default TopoBackground;
