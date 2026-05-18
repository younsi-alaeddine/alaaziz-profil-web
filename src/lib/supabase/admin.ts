import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function isServiceRoleConfigured(): boolean {
  const { url } = getSupabaseEnv();
  return Boolean(url && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Server-only — bypasses RLS for Auth Admin (invite / create users). */
export function createAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant. Ajoutez-la dans .env.local (Supabase → Settings → API → service_role)."
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
