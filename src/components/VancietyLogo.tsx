import { Link } from "react-router-dom";

const VancietyLogo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`inline-flex shrink-0 items-center ${className}`} aria-label="Home">
    <img
      src="/brand/vanciety-logo-transparent.png"
      alt="Vanciety - International Van Society"
      className="h-full w-auto max-w-full object-contain"
    />
  </Link>
);

export default VancietyLogo;
