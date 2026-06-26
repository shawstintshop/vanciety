import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface HeroSectionProps {
  image: string;
  badge: string;
  title: string;
  accent?: string;
  subtitle: string;
  children?: ReactNode;
}

export default function HeroSection({ image, badge, title, accent, subtitle, children }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden min-h-[500px] flex items-end border-b border-border">
      <div className="absolute inset-0 z-0">
        <img src={image} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
      </div>
      <div className="relative z-10 w-full container mx-auto px-4 pb-16 pt-36">
        <Badge className="mb-4 border border-primary/40 bg-primary/10 text-amber-300 text-xs font-bold uppercase tracking-widest">
          {badge}
        </Badge>
        <h1 className="font-display tracking-wider text-6xl sm:text-7xl lg:text-8xl leading-none text-white max-w-3xl uppercase">
          {title}
          {accent && <><br /><span className="text-amber-400">{accent}</span></>}
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
