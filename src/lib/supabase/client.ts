import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseConfigured } from "./env";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase n'est pas configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY dans .env.local"
    );
  }
  const { url, key } = getSupabaseEnv();
  return createBrowserClient(url!, key!);
}
