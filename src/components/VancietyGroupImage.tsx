// VancietyGroupImage — community illustration component
const VancietyGroupImage: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-muted/40 to-background border border-border/40 flex items-center justify-center aspect-square ${className}`}>
      <div className="text-center p-6">
        <div className="flex justify-center gap-1 mb-3 text-3xl">
          <span>🧑</span><span>👩</span><span>🧔</span>
        </div>
        <p className="text-xs text-muted-foreground">Vanciety Community</p>
      </div>
    </div>
  );
};

export default VancietyGroupImage;
