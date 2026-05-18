import { getSiteContent } from "@/lib/content";
import { SettingsPanel } from "@/components/admin/SettingsPanel";

export default async function ParametresPage() {
  const content = await getSiteContent();
  return <SettingsPanel content={content} />;
}
