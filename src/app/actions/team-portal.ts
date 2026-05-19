"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-server";
import { requireTeamMember } from "@/lib/team-access";
import { provisionTeamPortalAccess } from "@/lib/provision-team-portal";
import type { TaskStatus } from "@/lib/types";

export async function inviteTeamMemberToPortal(memberId: string) {
  const { supabase } = await requireAdmin();

  const { data: member, error } = await supabase
    .from("team_members")
    .select("id, name, email, user_id")
    .eq("id", memberId)
    .single();

  if (error || !member) {
    return { ok: false as const, error: "Membre introuvable." };
  }

  if (member.user_id) {
    return { ok: false as const, error: "Accès équipe déjà actif pour ce membre." };
  }

  if (!member.email) {
    return {
      ok: false as const,
      error: "Ajoutez un email au membre avant d'envoyer l'invitation.",
    };
  }

  const result = await provisionTeamPortalAccess({
    memberId: member.id,
    email: member.email,
    name: member.name,
    supabase,
  });

  if (!result.ok) {
    return result;
  }

  revalidatePath("/admin/equipe");
  revalidatePath("/equipe");

  const messages: Record<string, string> = {
    invited: "Invitation équipe envoyée par e-mail.",
    created: "Compte équipe créé.",
    linked_existing: "Compte existant lié au membre.",
  };

  return { ok: true as const, message: messages[result.mode] ?? "Accès activé." };
}

export async function updateMyTaskStatus(taskId: string, status: TaskStatus) {
  const { supabase, member } = await requireTeamMember();

  const { data: task } = await supabase
    .from("project_tasks")
    .select("id, assignee_id")
    .eq("id", taskId)
    .maybeSingle();

  if (!task || task.assignee_id !== member.id) {
    return { ok: false as const, error: "Tâche non autorisée." };
  }

  const { error } = await supabase
    .from("project_tasks")
    .update({ status })
    .eq("id", taskId);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/equipe");
  return { ok: true as const };
}
