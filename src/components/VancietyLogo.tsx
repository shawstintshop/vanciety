/**
 * Dark-theme VANCIETY wordmark.
 * Bold, all-caps sans-serif in light gray with a small camper-van silhouette
 * to the left, and the "THE VAN INDUSTRY OPERATING SYSTEM" tagline optionally
 * shown below in tracked-out small caps.
 */

const VanGlyph = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 72 40"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Camper-van body with a stepped-up cab/hood */}
    <path d="M4 6h38a3 3 0 0 1 3 3v4h11l9 10v7a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z" />
    {/* Wheels */}
    <circle cx="20" cy="34" r="5.5" />
    <circle cx="52" cy="34" r="5.5" />
  </svg>
);

const VancietyLogo: React.FC<{
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}> = ({ className = "", size = "md", showTagline = false }) => {
  const cfg = {
    sm: { icon: "h-5", text: "text-base", gap: "gap-2", tag: "text-[7px]" },
    md: { icon: "h-7", text: "text-2xl", gap: "gap-2.5", tag: "text-[9px]" },
    lg: { icon: "h-11", text: "text-4xl sm:text-5xl", gap: "gap-3", tag: "text-[11px]" },
  }[size];

  return (
    <div className={`flex items-center ${cfg.gap} ${className}`}>
      <VanGlyph className={`${cfg.icon} w-auto shrink-0 text-moss-light`} />
      <div className="flex flex-col leading-none">
        <span
          className={`font-black uppercase tracking-tight text-neutral-50 ${cfg.text}`}
        >
          VANCIETY
        </span>
        {showTagline && (
          <span
            className={`mt-1.5 font-semibold uppercase tracking-[0.22em] text-neutral-400 ${cfg.tag}`}
          >
            The Van Industry Operating System
          </span>
        )}
      </div>
    </div>
  );
};

export default VancietyLogo;
