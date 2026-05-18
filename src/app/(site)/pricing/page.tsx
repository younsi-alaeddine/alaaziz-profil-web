import { DynamicPageHeader } from "@/components/sections/DynamicPageHeader";
import { PricingSection } from "@/components/sections/PricingSection";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Tarifs");

export default function PricingPage() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <DynamicPageHeader pageKey="pricing" />
      <PricingSection />
    </section>
  );
}
