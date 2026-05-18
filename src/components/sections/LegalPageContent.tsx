"use client";

import { PageHeader } from "@/components/sections/PageHeader";
import { useSiteContent } from "@/components/SiteContentProvider";

export function MentionsLegalesContent() {
  const { legal } = useSiteContent();
  return (
    <section className="px-6 py-16 max-w-3xl mx-auto">
      <PageHeader label="Légal" labelColor="text-neutral-400" title={legal.mentionsTitle} center />
      <div className="glass rounded-2xl p-8 border border-white/5 text-sm text-neutral-400 leading-relaxed anim whitespace-pre-line">
        {legal.mentionsBody}
      </div>
    </section>
  );
}

export function ConfidentialiteContent() {
  const { legal } = useSiteContent();
  return (
    <section className="px-6 py-16 max-w-3xl mx-auto">
      <PageHeader label="Légal" labelColor="text-neutral-400" title={legal.privacyTitle} center />
      <div className="glass rounded-2xl p-8 border border-white/5 text-sm text-neutral-400 leading-relaxed anim whitespace-pre-line">
        {legal.privacyBody}
      </div>
    </section>
  );
}
