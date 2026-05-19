import { isAdminUser } from "@/lib/auth";
import type { SupabaseClient } from "@supabase/supabase-js";

export type AppRole = "admin" | "team" | "client";

export type AuthUser = {
  id: string;
  email?: string | null;
};

export async function resolveUserRole(
  supabase: SupabaseClient,
  user: AuthUser
): Promise<AppRole | null> {
  if (isAdminUser(user.email)) return "admin";

  const { data: team } = await supabase
    .from("team_members")
    .select("id")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (team) return "team";

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (client) return "client";

  return null;
}

export function roleHomePath(role: AppRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "team":
      return "/equipe";
    case "client":
      return "/portal";
  }
}
