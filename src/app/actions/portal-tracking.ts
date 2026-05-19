"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  clearPortalGuestSession,
  setPortalGuestSession,
} from "@/lib/portal-guest-session";
import { generateTrackingCode } from "@/lib/tracking-code";

export async function verifyTrackingAccess(email: string, code: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCode = code.trim().toUpperCase().replace(/\s/g, "");

  if (!normalizedEmail || normalizedCode.length < 6) {
    return { ok: false as const, error: "Email et code requis." };
  }

  try {
    const admin = createAdminClient();
    const { data: client, error } = await admin
      .from("clients")
      .select("id, email, tracking_code")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error || !client) {
      return { ok: false as const, error: "Aucun projet associé à cet email." };
    }

    if (!client.tracking_code || client.tracking_code !== normalizedCode) {
      return { ok: false as const, error: "Code de suivi incorrect." };
    }

    await setPortalGuestSession(client.id);
    revalidatePath("/portal");
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error: "Service indisponible. Réessayez ou contactez l'équipe.",
    };
  }
}

export async function logoutPortalGuest() {
  await clearPortalGuestSession();
  redirect("/portal/suivi");
}

export async function ensureClientTrackingCode(clientId: string): Promise<string | null> {
  try {
    const admin = createAdminClient();
    const { data: client } = await admin
      .from("clients")
      .select("tracking_code")
      .eq("id", clientId)
      .single();

    if (client?.tracking_code) return client.tracking_code;

    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateTrackingCode();
      const { data, error } = await admin
        .from("clients")
        .update({ tracking_code: code })
        .eq("id", clientId)
        .is("tracking_code", null)
        .select("tracking_code")
        .maybeSingle();

      if (!error && data?.tracking_code) return data.tracking_code;

      const { data: existing } = await admin
        .from("clients")
        .select("tracking_code")
        .eq("id", clientId)
        .single();
      if (existing?.tracking_code) return existing.tracking_code;
    }
    return null;
  } catch {
    return null;
  }
}

export async function regenerateTrackingCode(clientId: string) {
  const { requireAdmin } = await import("@/lib/auth-server");
  await requireAdmin();

  try {
    const admin = createAdminClient();
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateTrackingCode();
      const { error } = await admin
        .from("clients")
        .update({ tracking_code: code })
        .eq("id", clientId);

      if (!error) {
        revalidatePath("/admin/clients");
        revalidatePath("/admin/projets");
        return { ok: true as const, code };
      }
    }
    return { ok: false as const, error: "Impossible de générer un code unique." };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Erreur",
    };
  }
}
