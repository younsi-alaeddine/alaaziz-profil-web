"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

export function FaqSection() {
  const { faq } = useSiteContent();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-3">
      {faq.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={`anim faq-item glass rounded-xl border border-white/5 overflow-hidden ${isOpen ? "open" : ""}`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium hover:bg-white/5 transition"
            >
              {item.q}
              <ChevronDown className={`faq-chevron w-5 h-5 shrink-0 text-neutral-500 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="faq-answer px-6 pb-4 text-sm text-neutral-400 leading-relaxed">
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
