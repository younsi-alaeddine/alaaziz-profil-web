import { getSiteContent } from "@/lib/content";
import { ContentAdminPanel } from "@/components/admin/ContentAdminPanel";

export default async function ContenuPage() {
  const content = await getSiteContent();
  return <ContentAdminPanel content={content} />;
}
