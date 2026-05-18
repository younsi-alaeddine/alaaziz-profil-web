import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv, isSupabaseConfigured } from "./env";

export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  const { url, key } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — middleware refreshes sessions
        }
      },
    },
  });
}
