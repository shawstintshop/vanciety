// VancietyConceptVisual — decorative concept illustration for van life community
const VancietyConceptVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-muted/30 border border-border/40 aspect-video flex items-center justify-center ${className}`}>
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🚐</div>
        <p className="text-sm text-muted-foreground">Vanciety Community Map</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Interactive van life destinations</p>
      </div>
      {/* Decorative topo dots */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{ top: `${20 + i * 12}%`, left: `${10 + i * 15}%` }}
        />
      ))}
    </div>
  );
};

export default VancietyConceptVisual;
