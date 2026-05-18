import { getSiteContent } from "@/lib/content";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default async function SiteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  return (
    <SiteContentProvider content={content}>
      <SiteLayout>{children}</SiteLayout>
    </SiteContentProvider>
  );
}
