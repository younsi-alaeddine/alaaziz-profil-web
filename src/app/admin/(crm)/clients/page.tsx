import { requireAdmin } from "@/lib/auth-server";
import { ClientsPanel } from "@/components/admin/ClientsPanel";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";
import type { Client } from "@/lib/types";

export default async function ClientsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <ClientsPanel
      clients={(data as Client[]) ?? []}
      serviceRoleConfigured={isServiceRoleConfigured()}
    />
  );
}
