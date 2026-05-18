"use client";

import {
  Building2,
  CloudCog,
  Globe,
  LucideIcon,
  Rocket,
  Server,
  Smartphone,
} from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  "building-2": Building2,
  rocket: Rocket,
  "cloud-cog": CloudCog,
  smartphone: Smartphone,
  server: Server,
};

const COLOR_RING: Record<string, string> = {
  violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
  emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
  pink: "from-pink-500/20 to-pink-500/5 border-pink-500/20",
  amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
};

export function ServicesGrid() {
  const { services } = useSiteContent();
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s, i) => {
        const Icon = ICONS[s.icon] ?? Globe;
        const ring = COLOR_RING[s.color] ?? COLOR_RING.violet;
        return (
          <article
            key={s.title}
            className={`anim card-hover glass rounded-2xl p-6 border bg-gradient-to-br ${ring}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="w-12 h-12 rounded-xl glass-light flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-violet-300" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-neutral-400 mb-4">{s.desc}</p>
            <div className="flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <span key={t} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-neutral-400">
                  {t}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
