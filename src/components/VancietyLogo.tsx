import React from 'react';

const VancietyLogo = ({ className = '' }: { className?: string }) => (
  <img
    src="/brand/vanciety-logo-main.png"
    alt="Vanciety - International Van Society"
    className={`h-12 w-auto object-contain ${className}`}
  />
);

export default VancietyLogo;
