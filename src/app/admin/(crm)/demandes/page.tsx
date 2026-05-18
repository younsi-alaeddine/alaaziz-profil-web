import { requireAdmin } from "@/lib/auth-server";
import { ContactRequestsPanel } from "@/components/admin/ContactRequestsPanel";
import type { ContactRequest } from "@/lib/types";

export default async function DemandesPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <ContactRequestsPanel
      initialRows={(data as ContactRequest[]) ?? []}
      initialError={error?.message ?? null}
    />
  );
}
