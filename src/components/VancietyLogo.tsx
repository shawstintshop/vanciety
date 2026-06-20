const VancietyLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const sizes = { sm: 'h-6', md: 'h-8', lg: 'h-12' };
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/brand/van-topo-dark.png"
        alt="Vanciety"
        className={`${sizes[size]} w-auto shrink-0 object-contain`}
      />
      <span className="font-bold bg-gradient-hero bg-clip-text text-transparent">Vanciety</span>
    </div>
  );
};

export default VancietyLogo;
