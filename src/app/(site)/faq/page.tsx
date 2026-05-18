import { DynamicPageHeader } from "@/components/sections/DynamicPageHeader";
import { FaqSection } from "@/components/sections/FaqSection";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("FAQ");

export default function FaqPage() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <DynamicPageHeader pageKey="faq" />
      <FaqSection />
    </section>
  );
}
