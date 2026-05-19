import { PortalShell } from "@/components/portal/PortalShell";
import { requirePortalAccess } from "@/lib/portal-access";

export default async function PortalAppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requirePortalAccess();
  return <PortalShell mode={ctx.mode}>{children}</PortalShell>;
}
