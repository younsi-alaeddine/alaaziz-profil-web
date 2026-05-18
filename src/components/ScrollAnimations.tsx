"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("v");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );

    document.querySelectorAll(".anim, .anim-l, .anim-r").forEach((el) => {
      el.classList.remove("v");
      obs.observe(el);
    });

    return () => obs.disconnect();
  }, [pathname]);

  return null;
}
