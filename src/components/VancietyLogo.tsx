const VancietyLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const sizes = { sm: 'h-8', md: 'h-12', lg: 'h-20' };
  return (
    <img
      src="/brand/vanciety-logo-transparent.png"
      alt="Vanciety"
      className={`${sizes[size]} w-auto shrink-0 object-contain ${className}`}
    />
  );
};

export default VancietyLogo;
