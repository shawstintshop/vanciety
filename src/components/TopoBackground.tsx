type TopoBackgroundProps = {
  className?: string;
  opacity?: number;
};

const TopoBackground = ({ className = '', opacity = 0.22 }: TopoBackgroundProps) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: "url('/brand/van-topo-dark.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: '220px auto',
        backgroundPosition: 'center',
        opacity,
      }}
    />
  );
};

export default TopoBackground;
