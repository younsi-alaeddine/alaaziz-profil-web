import { getSiteContent } from "@/lib/content";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { DemoEnvironmentPanel } from "@/components/admin/DemoEnvironmentPanel";
import { getDemoEnvironmentStatus } from "@/app/actions/demo-seed";

export default async function ParametresPage() {
  const [content, demoStatus] = await Promise.all([
    getSiteContent(),
    getDemoEnvironmentStatus(),
  ]);

  return (
    <div className="space-y-10">
      <DemoEnvironmentPanel status={demoStatus} />
      <SettingsPanel content={content} />
    </div>
  );
}
