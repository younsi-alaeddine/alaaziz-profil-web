"use client";

import { useCallback, type MouseEvent, type ReactNode } from "react";

type ScrollLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export function scrollToSection(hash: string, behavior: ScrollBehavior = "smooth") {
  const id = hash.replace(/^#/, "");
  if (!id) {
    window.scrollTo({ top: 0, behavior });
    window.history.pushState(null, "", "/");
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior, block: "start" });
    window.history.pushState(null, "", `/#${id}`);
  }
}

export function ScrollLink({ href, children, className, onNavigate }: ScrollLinkProps) {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      scrollToSection(href);
      onNavigate?.();
    },
    [href, onNavigate]
  );

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
