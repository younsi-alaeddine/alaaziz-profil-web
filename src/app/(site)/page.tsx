"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { useSiteContent } from "@/components/SiteContentProvider";

export default function HomePage() {
  const { home } = useSiteContent();

  const quickLinks = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <Hero />
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="anim text-center mb-12">
          <span className="section-label text-xs font-medium uppercase tracking-wider text-violet-400 justify-center">
            {home.reviewsLabel}
          </span>
          <h2 className="text-3xl font-bold mt-4">{home.reviewsTitle}</h2>
        </div>
        <ReviewsSection />
        <div className="anim flex flex-wrap justify-center gap-4 mt-16">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="glass-light px-5 py-2.5 rounded-xl text-sm hover:bg-white/10 transition flex items-center gap-2 card-hover"
            >
              {l.label} <ArrowRight className="w-4 h-4" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
