"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-server";

export async function markContactAsRead(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("contact_requests")
    .update({ status: "read" })
    .eq("id", id);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function deleteContactRequest(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("contact_requests").delete().eq("id", id);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin");
  return { ok: true as const };
}
