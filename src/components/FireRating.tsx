interface FireRatingProps {
  score: number;
  max?: number;
  label?: string;
  placeholder?: boolean;
}

const FireRating = ({ score, max = 5, label, placeholder = false }: FireRatingProps) => {
  if (placeholder) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="opacity-30">🔥🔥🔥🔥🔥</span>
        <span className="italic">Community fire rating opens with member reviews</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={i < score ? "text-base" : "opacity-20 text-base"}
          aria-hidden="true"
        >
          🔥
        </span>
      ))}
      {label && <span className="text-xs text-muted-foreground ml-1.5">{label}</span>}
    </div>
  );
};

export default FireRating;
