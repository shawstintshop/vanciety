const VancietyLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const sizes = { sm: 'w-6 h-6 text-sm', md: 'w-8 h-8 text-lg', lg: 'w-12 h-12 text-2xl' };
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes[size]} bg-gradient-hero rounded-lg flex items-center justify-center shrink-0`}>
        <span className="text-white font-black leading-none">V</span>
      </div>
      <span className="font-bold bg-gradient-hero bg-clip-text text-transparent">Vanciety</span>
    </div>
  );
};

export default VancietyLogo;
