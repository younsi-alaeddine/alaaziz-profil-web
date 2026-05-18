"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-server";
import type { SiteContentBundle } from "@/lib/content-defaults";

export async function saveSiteContentSection<K extends keyof SiteContentBundle>(
  key: K,
  value: SiteContentBundle[K]
) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("site_content").upsert(
    {
      key,
      value: value as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/pricing");
  revalidatePath("/faq");
  revalidatePath("/contact");
  revalidatePath("/skills");
  revalidatePath("/mentions-legales");
  revalidatePath("/confidentialite");
  revalidatePath("/admin/contenu");

  return { ok: true as const };
}

export async function saveSiteSetting(key: string, value: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("site_settings").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/parametres");
  return { ok: true as const };
}

export async function resetSiteContentSection(key: keyof SiteContentBundle) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("site_content").delete().eq("key", key);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true as const };
}
