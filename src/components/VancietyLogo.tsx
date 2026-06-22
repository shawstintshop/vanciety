import { Link } from "react-router-dom";

const VancietyLogo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`inline-flex shrink-0 items-center ${className}`} aria-label="Home">
    <span className="vanciety-wordmark inline-flex items-center text-[clamp(1.65rem,2.6vw,2.45rem)] font-black tracking-[-0.06em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
      Vanciety
    </span>
  </Link>
);

export default VancietyLogo;
