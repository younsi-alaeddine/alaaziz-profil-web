"use client";

import { PageHeader } from "@/components/sections/PageHeader";
import { PageSection } from "@/components/layout/PageSection";
import { useSiteContent } from "@/components/SiteContentProvider";

type LegalDoc = "mentions" | "privacy";

function LegalDocument({ type }: { type: LegalDoc }) {
  const { legal } = useSiteContent();
  const title = type === "mentions" ? legal.mentionsTitle : legal.privacyTitle;
  const body = type === "mentions" ? legal.mentionsBody : legal.privacyBody;

  return (
    <PageSection
      variant="narrow"
      heroBanner
      header={
        <PageHeader
          label="Légal"
          labelColor="text-neutral-400"
          title={title}
          center
          hero
        />
      }
    >
      <div className="glass rounded-2xl p-6 sm:p-8 md:p-10 border border-white/5 text-sm sm:text-base text-neutral-400 leading-relaxed anim whitespace-pre-line">
        {body}
      </div>
    </PageSection>
  );
}

export function MentionsLegalesContent() {
  return <LegalDocument type="mentions" />;
}

export function ConfidentialiteContent() {
  return <LegalDocument type="privacy" />;
}
