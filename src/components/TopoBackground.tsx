/**
 * TopoBackground — Interactive topographic contour line overlay
 * Design: Rugged Overland / Field Manual aesthetic
 *
 * Features:
 * - SVG contour lines that subtly shift on mouse move (parallax)
 * - Multiple elevation layers at different opacities
 * - Brass/gold color scheme matching the topo design system
 * - Respects prefers-reduced-motion
 * - Falls back to static topo image on mobile / reduced-motion
 */

import { useEffect, useRef, useState } from "react";

interface TopoBackgroundProps {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
  interactive?: boolean;
}

const CONTOUR_PATHS = [
  { d: "M-100 180 Q80 120 200 180 Q320 240 440 180 Q560 120 680 180 Q800 240 920 180 Q960 195 1100 180", opacity: 0.08, width: 1.2, speed: 0.008 },
  { d: "M-100 140 Q100 90 250 140 Q400 190 550 140 Q700 90 850 140 Q930 158 1100 140", opacity: 0.06, width: 1.0, speed: 0.006 },
  { d: "M-100 220 Q60 170 160 220 Q260 270 360 220 Q460 170 560 220 Q660 270 760 220 Q880 170 1100 220", opacity: 0.09, width: 0.9, speed: 0.010 },
  { d: "M-100 100 Q120 65 280 100 Q440 135 600 100 Q760 65 920 100 Q1010 115 1100 100", opacity: 0.05, width: 0.8, speed: 0.005 },
  { d: "M-100 260 Q50 230 150 260 Q250 290 350 260 Q450 230 550 260 Q650 290 750 260 Q870 230 1100 260", opacity: 0.10, width: 0.7, speed: 0.012 },
  { d: "M-100 60 Q140 40 320 60 Q500 80 680 60 Q840 44 1000 60 Q1060 65 1100 60", opacity: 0.04, width: 0.7, speed: 0.004 },
  { d: "M-100 300 Q70 275 170 300 Q270 325 370 300 Q470 275 570 300 Q670 325 790 300 Q920 275 1100 300", opacity: 0.07, width: 0.6, speed: 0.009 },
  { d: "M-100 320 Q90 300 200 320 Q310 340 420 320 Q530 300 640 320 Q760 340 880 320 Q980 308 1100 320", opacity: 0.05, width: 0.5, speed: 0.007 },
  { d: "M-100 340 Q80 320 180 340 Q280 360 380 340 Q480 320 580 340 Q680 360 800 340 Q900 320 1100 340", opacity: 0.04, width: 0.5, speed: 0.006 },
];

const ELEVATION_DOTS = [
  { cx: 150, cy: 140 }, { cx: 420, cy: 180 }, { cx: 680, cy: 120 },
  { cx: 850, cy: 200 }, { cx: 280, cy: 260 }, { cx: 560, cy: 100 },
  { cx: 740, cy: 300 }, { cx: 320, cy: 80 },
];

export function TopoBackground({ className = "", intensity = "subtle", interactive = true }: TopoBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [prefersReduced, setPrefersReduced] = useState(false);
  const animFrameRef = useRef<number>();
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const mult = intensity === "subtle" ? 0.6 : intensity === "medium" ? 1.0 : 1.5;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    if (!interactive || prefersReduced) return;

    const onMove = (e: MouseEvent) => {
      const el = svgRef.current?.closest("[data-topo-container]") ?? document.body;
      const rect = el.getBoundingClientRect();
      targetRef.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };

    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.05;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.05;
      setOffset({ x: currentRef.current.x, y: currentRef.current.y });
      animFrameRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [interactive, prefersReduced]);

  return (
    <svg
      ref={svgRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {CONTOUR_PATHS.map((p, i) => {
        const dx = prefersReduced ? 0 : offset.x * p.speed * 90 * mult * (i % 2 === 0 ? 1 : -0.65);
        const dy = prefersReduced ? 0 : offset.y * p.speed * 45 * mult * (i % 3 === 0 ? 1 : -0.5);
        return (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke="hsl(42,65%,52%)"
            strokeWidth={p.width}
            strokeOpacity={p.opacity * mult}
            transform={`translate(${dx},${dy})`}
          />
        );
      })}
      {ELEVATION_DOTS.map((dot, i) => (
        <circle
          key={`d${i}`}
          cx={dot.cx}
          cy={dot.cy}
          r={1.8}
          fill="hsl(42,65%,52%)"
          fillOpacity={0.18 * mult}
        />
      ))}
    </svg>
  );
}

export default TopoBackground;
