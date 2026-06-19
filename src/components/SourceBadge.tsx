const BADGE_STYLES: Record<string, string> = {
  OFFICIAL: "bg-blue-600 text-white",
  LIVE_SEARCH: "bg-emerald-600 text-white",
  LIVE: "bg-green-600 text-white",
  VERIFIED: "bg-blue-600 text-white",
  PUBLIC_FORUM: "bg-teal-600 text-white",
  PUBLIC_SOCIAL: "bg-cyan-700 text-white",
  AUTH_REQUIRED: "bg-amber-500 text-black",
  SUPABASE: "bg-emerald-700 text-white",
  USER_GATED: "bg-amber-500 text-black",
  PRIVATE_SOURCE: "bg-rose-700 text-white",
  MEMBER_SUBMITTED: "bg-violet-600 text-white",
  UNKNOWN: "bg-slate-600 text-white",
};

const BADGE_TOOLTIPS: Record<string, string> = {
  OFFICIAL: "Official organizer/site — link fetched live.",
  LIVE_SEARCH: "Live search/index link — individual listings are not verified here.",
  LIVE: "Live data source.",
  VERIFIED: "Source verified.",
  PUBLIC_FORUM: "Publicly readable community forum.",
  PUBLIC_SOCIAL: "Public social source, may be rate-limited.",
  AUTH_REQUIRED: "Requires login before any data is visible.",
  SUPABASE: "Data from Supabase — requires active auth and database connection.",
  USER_GATED: "Requires user login or submission.",
  PRIVATE_SOURCE: "Private group — indexed only with explicit member permission.",
  MEMBER_SUBMITTED: "Community-contributed content, pending moderation.",
  UNKNOWN: "Source availability or details not yet verified.",
};

interface SourceBadgeProps {
  badge: string;
  className?: string;
}

const SourceBadge = ({ badge, className = "" }: SourceBadgeProps) => {
  const style = BADGE_STYLES[badge] ?? "bg-slate-600 text-white";
  const tooltip = BADGE_TOOLTIPS[badge];
  const label = badge.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${style} ${className}`}
      title={tooltip}
    >
      {label}
    </span>
  );
};

export default SourceBadge;
