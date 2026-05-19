"use client";

import Image from "next/image";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Fragment } from "react";
import { ScrollLink } from "@/components/layout/ScrollLink";
import { useSiteContent } from "@/components/SiteContentProvider";
import { CONTACT_SECTION_HREF, sectionHref, SECTION_IDS } from "@/lib/sections";
import Link from "next/link";

export function Hero() {
  const { hero, heroStats, images } = useSiteContent();

  return (
    <div className="relative min-h-[min(92vh,900px)] w-full flex items-center overflow-hidden">
      <div className="page-hero-glow absolute inset-0" aria-hidden />
      <div className="absolute top-1/4 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-violet-600/15 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/15 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_1s]" />
      <div className="site-container relative z-10 w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16 md:py-20 lg:py-24">
        <div className="anim-l space-y-6">
          <div className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-2 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-[pulse-dot_2s_ease_infinite]" />
            {hero.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            {hero.title} <span className="text-gradient">{hero.titleHighlight}</span>
          </h1>
          <span className="hero-line w-24" aria-hidden />
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed">{hero.subtitle}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <ScrollLink
              href={CONTACT_SECTION_HREF}
              className="bg-grad px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition inline-flex items-center gap-2 shadow-lg shadow-violet-500/20"
            >
              {hero.ctaPrimary} <ArrowRight className="w-4 h-4" />
            </ScrollLink>
            <ScrollLink
              href={sectionHref(SECTION_IDS.portfolio)}
              className="glass-light px-6 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition"
            >
              {hero.ctaSecondary}
            </ScrollLink>
            <Link
              href="/portal/suivi"
              className="glass-light px-6 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-300"
            >
              <Sparkles className="w-4 h-4" /> Suivi projet
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4">
            {heroStats.map((stat, i) => (
              <Fragment key={stat.label}>
                {i > 0 && <div className="hidden sm:block w-px h-10 bg-white/10" />}
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="anim-r relative flex justify-center gap-3 sm:gap-4">
          <div className="photo-card w-36 sm:w-44 md:w-52 animate-[float_6s_ease-in-out_infinite]">
            <Image src={images.alaeddine} alt="Alaeddine" width={400} height={480} className="relative z-10 rounded-2xl object-cover w-full h-auto shadow-2xl" priority />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass rounded-lg px-3 py-1.5 text-xs font-medium z-20 whitespace-nowrap">
              <Sparkles className="w-3 h-3 inline mr-1 text-violet-400" /> Alaeddine · Frontend
            </div>
          </div>
          <div className="photo-card w-36 sm:w-44 md:w-52 mt-8 sm:mt-12 animate-[float_7s_ease-in-out_infinite_0.5s]">
            <Image src={images.aziz} alt="Aziz" width={400} height={480} className="relative z-10 rounded-2xl object-cover w-full h-auto shadow-2xl" priority />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass rounded-lg px-3 py-1.5 text-xs font-medium z-20 whitespace-nowrap">
              <Zap className="w-3 h-3 inline mr-1 text-blue-400" /> Aziz · Backend
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
