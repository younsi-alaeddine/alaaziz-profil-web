"use client";

import { useEffect, useState } from "react";
import type { SectionId } from "@/lib/sections";

export function useActiveSection() {
  const [activeId, setActiveId] = useState<SectionId | "">("");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[data-section]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id as SectionId);
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.25] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
