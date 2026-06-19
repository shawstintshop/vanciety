import { useEffect } from "react";

const VancietyTopoSystem = () => {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;
    const handlePointerMove = (event: PointerEvent) => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 100;
        const y = (event.clientY / window.innerHeight) * 100;
        root.style.setProperty("--topo-pointer-x", `${x.toFixed(2)}%`);
        root.style.setProperty("--topo-pointer-y", `${y.toFixed(2)}%`);
        root.style.setProperty("--topo-drift-x", `${((x - 50) / 18).toFixed(2)}px`);
        root.style.setProperty("--topo-drift-y", `${((y - 50) / 18).toFixed(2)}px`);
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div className="vanciety-topo-system" aria-hidden="true">
      <div className="vanciety-topo-layer vanciety-topo-contours" />
      <div className="vanciety-topo-layer vanciety-topo-rings" />
      <div className="vanciety-topo-layer vanciety-topo-route" />
      <div className="vanciety-topo-layer vanciety-topo-badge-grain" />
      <div className="vanciety-topo-layer vanciety-topo-pointer" />
    </div>
  );
};

export default VancietyTopoSystem;
