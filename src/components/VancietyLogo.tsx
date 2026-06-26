import { Link } from "react-router-dom";

type VancietyLogoProps = {
  className?: string;
  variant?: "badge" | "wordmark";
};

const VancietyLogo = ({ className = "", variant = "badge" }: VancietyLogoProps) => (
  <Link to="/" className={`inline-flex shrink-0 items-center ${className}`} aria-label="Home">
    {variant === "wordmark" ? (
      <img
        src="/images/vanciety-logo-wordmark.png"
        alt="Vanciety"
        className="block h-full w-auto max-w-full object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        loading="eager"
        decoding="async"
      />
    ) : (
      <img
        src="/images/vanciety-logo-badge.png"
        alt="Vanciety"
        className="block h-full w-auto max-w-full object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        loading="eager"
        decoding="async"
      />
    )}
  </Link>
);

export default VancietyLogo;
