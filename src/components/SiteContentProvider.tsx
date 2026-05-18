"use client";

import { createContext, useContext } from "react";
import type { SiteContentBundle } from "@/lib/content-defaults";

const SiteContentContext = createContext<SiteContentBundle | null>(null);

export function SiteContentProvider({
  content,
  children,
}: {
  content: SiteContentBundle;
  children: React.ReactNode;
}) {
  return (
    <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContentBundle {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return ctx;
}
