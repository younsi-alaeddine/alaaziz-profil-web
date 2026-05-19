import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getPortalGuestClientId } from "@/lib/portal-guest-session";
import type { Client } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PortalContext =
  | {
      mode: "auth";
      supabase: SupabaseClient;
      user: { id: string; email?: string };
      client: Client;
    }
  | {
      mode: "guest";
      supabase: SupabaseClient;
      client: Client;
    };

export async function getPortalContext(): Promise<PortalContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: client } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (client) {
      return {
        mode: "auth",
        supabase,
        user: { id: user.id, email: user.email },
        client: client as Client,
      };
    }
  }

  const guestClientId = await getPortalGuestClientId();
  if (!guestClientId) return null;

  try {
    const admin = createAdminClient();
    const { data: client } = await admin
      .from("clients")
      .select("*")
      .eq("id", guestClientId)
      .maybeSingle();

    if (!client) return null;

    return { mode: "guest", supabase: admin, client: client as Client };
  } catch {
    return null;
  }
}

export async function requirePortalAccess(): Promise<PortalContext> {
  const ctx = await getPortalContext();
  if (!ctx) redirect("/portal/suivi");
  return ctx;
}

/** Lecture données client (auth RLS ou admin en mode invité) */
export function portalDb(ctx: PortalContext) {
  return ctx.supabase;
}
