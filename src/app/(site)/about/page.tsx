import { DynamicPageHeader } from "@/components/sections/DynamicPageHeader";
import { AboutSection } from "@/components/sections/AboutSection";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("À propos");

export default function AboutPage() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <DynamicPageHeader pageKey="about" />
      <AboutSection />
    </section>
  );
}
