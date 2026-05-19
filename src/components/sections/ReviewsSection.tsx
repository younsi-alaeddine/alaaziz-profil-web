"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

export function ReviewsSection() {
  const { reviews } = useSiteContent();
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 w-full">
      {reviews.map((r, i) => (
        <article key={r.name} className="anim card-hover glass rounded-2xl p-6 relative" style={{ transitionDelay: `${i * 100}ms` }}>
          <Quote className="w-8 h-8 text-violet-500/30 mb-4" />
          <p className="text-sm text-neutral-300 leading-relaxed mb-6">&ldquo;{r.text}&rdquo;</p>
          <div className="flex items-center gap-3">
            <Image src={r.avatar} alt={r.name} width={48} height={48} className="rounded-full w-12 h-12 object-cover" />
            <div>
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-neutral-500">{r.role}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
