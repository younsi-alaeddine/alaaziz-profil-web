"use client";

import { PageHeader } from "@/components/sections/PageHeader";
import { useSiteContent } from "@/components/SiteContentProvider";
import type { SiteContentBundle } from "@/lib/content-defaults";

type PageKey = keyof SiteContentBundle["pages"];

export function DynamicPageHeader({ pageKey }: { pageKey: PageKey }) {
  const { pages } = useSiteContent();
  const p = pages[pageKey];

  return (
    <PageHeader
      label={p.label}
      labelColor={p.labelColor}
      title={
        <>
          {p.title}{" "}
          {p.titleHighlight ? (
            <span className="text-gradient">{p.titleHighlight}</span>
          ) : null}
        </>
      }
      subtitle={p.subtitle}
      center
    />
  );
}
