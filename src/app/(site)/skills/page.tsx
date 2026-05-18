import { DynamicPageHeader } from "@/components/sections/DynamicPageHeader";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Compétences");

export default function SkillsPage() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <DynamicPageHeader pageKey="skills" />
      <SkillsSection />
    </section>
  );
}
