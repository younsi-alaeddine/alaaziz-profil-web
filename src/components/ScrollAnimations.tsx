"use client";

import { useEffect } from "react";
import { scrollToSection } from "@/components/layout/ScrollLink";

export function ScrollAnimations() {
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

    const observe = () => {
      document.querySelectorAll(".anim, .anim-l, .anim-r").forEach((el) => {
        if (!el.classList.contains("v")) obs.observe(el);
      });
    };

    observe();

    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => scrollToSection(hash), 150);
    }

    const onHashChange = () => {
      document.querySelectorAll(".anim, .anim-l, .anim-r").forEach((el) => {
        el.classList.remove("v");
      });
      observe();
      const h = window.location.hash;
      if (h) scrollToSection(h);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      obs.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return null;
}
