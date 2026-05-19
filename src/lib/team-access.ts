import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth";
import type { TeamMember } from "@/lib/types";

export async function requireTeamMember() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/equipe/login");
  }

  if (isAdminUser(user.email)) {
    redirect("/admin/dashboard");
  }

  const { data: member } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (!member) {
    redirect("/equipe/login?error=no_access");
  }

  return {
    supabase,
    user: { id: user.id, email: user.email },
    member: member as TeamMember,
  };
}

export async function getTeamMemberOrNull() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || isAdminUser(user.email)) return null;

  const { data: member } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (!member) return null;

  return { supabase, user, member: member as TeamMember };
}
