import React from 'react';

const TopoBackground = () => (
  <div
    className="absolute inset-0 w-full h-full"
    style={{
      backgroundImage: 'url(/images/topo-background.avif)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      opacity: 0.15,
      zIndex: 0,
    }}
  />
);

export default TopoBackground;
