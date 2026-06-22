type VancietyConceptVisualProps = {
  className?: string;
  src?: string;
  alt?: string;
  title?: string;
  caption?: string;
  badge?: string;
  compact?: boolean;
};

// VancietyConceptVisual — decorative concept illustration for van life community
const VancietyConceptVisual = ({
  className = '',
  src,
  alt = 'Vanciety concept visual',
  title = 'Vanciety Community Map',
  caption = 'Interactive van life destinations',
  badge,
  compact = false,
}: VancietyConceptVisualProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-primary/10 via-background to-muted/30 ${compact ? 'aspect-[16/10]' : 'aspect-video'} ${className}`}
    >
      {src ? (
        <>
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white">
            {badge && (
              <span className="mb-3 inline-flex w-fit rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-950">
                {badge}
              </span>
            )}
            <p className="text-lg font-bold leading-tight">{title}</p>
            <p className="mt-1 text-sm text-white/80">{caption}</p>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div>
            <div className="mb-4 text-6xl">🚐</div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground/60">{caption}</p>
          </div>
        </div>
      )}

      {/* Decorative topo dots */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-primary/20"
          style={{ top: `${20 + i * 12}%`, left: `${10 + i * 15}%` }}
        />
      ))}
    </div>
  );
};

export default VancietyConceptVisual;
