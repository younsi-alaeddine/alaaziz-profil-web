import { DynamicPageHeader } from "@/components/sections/DynamicPageHeader";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Services");

export default function ServicesPage() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <DynamicPageHeader pageKey="services" />
      <ServicesGrid />
    </section>
  );
}
