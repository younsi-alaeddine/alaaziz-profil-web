"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

const TAG_COLORS: Record<string, string> = {
  violet: "bg-violet-500/20 text-violet-300",
  blue: "bg-blue-500/20 text-blue-300",
  emerald: "bg-emerald-500/20 text-emerald-300",
  pink: "bg-pink-500/20 text-pink-300",
  amber: "bg-amber-500/20 text-amber-300",
};

export function PortfolioGrid() {
  const { portfolio } = useSiteContent();
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {portfolio.map((p, i) => (
        <article key={p.title} className="anim card-hover glass rounded-2xl overflow-hidden group" style={{ transitionDelay: `${i * 80}ms` }}>
          <div className="relative aspect-video overflow-hidden">
            <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition duration-500" sizes="(max-width:768px) 100vw, 50vw" />
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {p.tags.map((t) => (
                <span key={t.label} className={`text-[10px] px-2 py-1 rounded-md ${TAG_COLORS[t.color] ?? TAG_COLORS.violet}`}>
                  {t.label}
                </span>
              ))}
            </div>
            <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
            <p className="text-sm text-neutral-400 mb-4">{p.desc}</p>
            <Link href="/contact" className="text-sm text-violet-400 hover:text-violet-300 inline-flex items-center gap-1">
              Discuter du projet <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
