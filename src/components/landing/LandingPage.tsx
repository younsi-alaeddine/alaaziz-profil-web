"use client";

import { createElement } from "react";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { PageSection } from "@/components/layout/PageSection";
import { ScrollLink } from "@/components/layout/ScrollLink";
import { useSiteContent } from "@/components/SiteContentProvider";
import { LANDING_SECTION_CONTENT } from "@/lib/landing-registry";
import {
  LANDING_MAIN_SECTIONS,
  QUICK_LINK_SECTION_IDS,
  SECTION_IDS,
  sectionIdFromHref,
} from "@/lib/sections";

export function LandingPage() {
  const { home, nav } = useSiteContent();

  const quickLinks = nav.filter((link) => {
    const id = sectionIdFromHref(link.href);
    return id !== null && (QUICK_LINK_SECTION_IDS as readonly string[]).includes(id);
  });

  return (
    <>
      <section id={SECTION_IDS.accueil} data-section className="scroll-mt-24">
        <Hero />
      </section>

      <PageSection id={SECTION_IDS.avis} anchor band>
        <div className="anim text-center mb-12 md:mb-16">
          <span className="section-label text-xs font-medium uppercase tracking-[0.2em] text-violet-400 justify-center">
            {home.reviewsLabel}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-5 tracking-tight">
            {home.reviewsTitle}
          </h2>
        </div>
        <ReviewsSection />
        <div className="anim flex flex-wrap justify-center gap-3 sm:gap-4 mt-14 md:mt-20">
          {quickLinks.map((link) => (
            <ScrollLink
              key={link.href}
              href={link.href}
              className="glass-light px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm hover:bg-white/10 transition flex items-center gap-2 card-hover"
            >
              {link.label} <ArrowRight className="w-4 h-4" />
            </ScrollLink>
          ))}
        </div>
      </PageSection>

      {LANDING_MAIN_SECTIONS.map((cfg) => {
        const Component = LANDING_SECTION_CONTENT[cfg.id];
        if (!Component) return null;
        return (
          <PageSection
            key={cfg.id}
            id={cfg.id}
            anchor
            pageKey={cfg.pageKey}
            variant={"wide" in cfg && cfg.wide ? "wide" : "default"}
            band={"band" in cfg ? cfg.band : false}
          >
            {createElement(Component)}
          </PageSection>
        );
      })}
    </>
  );
}
