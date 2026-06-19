import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface VancietyLogoProps {
  compact?: boolean;
  className?: string;
  markClassName?: string;
}

const LOGO_SRC = "/brand/vanciety-logo-transparent.png";

const VancietyLogoMark = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center justify-center overflow-visible bg-transparent",
      className
    )}
    aria-hidden="true"
  >
    <img
      src={LOGO_SRC}
      alt=""
      className="h-full w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.32)]"
      draggable={false}
    />
  </span>
);

const VancietyLogo = ({ compact = false, className, markClassName }: VancietyLogoProps) => (
  <Link
    to="/"
    className={cn("group inline-flex items-center gap-3 no-underline", className)}
    aria-label="Vanciety.com home"
  >
    <VancietyLogoMark className={cn(compact ? "h-12 w-12" : "h-16 w-16 sm:h-20 sm:w-20", markClassName)} />
    {!compact && (
      <span className="sr-only">Vanciety.com</span>
    )}
  </Link>
);

export { VancietyLogoMark };
export default VancietyLogo;
