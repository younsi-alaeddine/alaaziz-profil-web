import { DynamicPageHeader } from "@/components/sections/DynamicPageHeader";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Portfolio");

export default function PortfolioPage() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <DynamicPageHeader pageKey="portfolio" />
      <PortfolioGrid />
    </section>
  );
}
