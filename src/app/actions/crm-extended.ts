"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-server";
import type {
  DigitalRequestStatus,
  SocialPlatform,
  SocialRequestStatus,
  TaskPriority,
  TaskStatus,
} from "@/lib/types";

export async function createTeamMember(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("team_members").insert({
    name: String(formData.get("name")),
    role: String(formData.get("role") || "developer"),
    email: String(formData.get("email") || "") || null,
    avatar_color: String(formData.get("avatar_color") || "violet"),
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/equipe");
  return { ok: true as const };
}

export async function createProjectTask(
  projectId: string,
  data: {
    title: string;
    assignee_id?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string | null;
  }
) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("project_tasks").insert({
    project_id: projectId,
    title: data.title,
    assignee_id: data.assignee_id ?? null,
    status: data.status ?? "todo",
    priority: data.priority ?? "medium",
    due_date: data.due_date ?? null,
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/admin/projets/${projectId}`);
  revalidatePath("/admin/equipe");
  revalidatePath("/admin/dashboard");
  return { ok: true as const };
}

export async function updateProjectTask(
  taskId: string,
  data: Partial<{
    status: TaskStatus;
    assignee_id: string | null;
    priority: TaskPriority;
  }>
) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("project_tasks").update(data).eq("id", taskId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/equipe");
  revalidatePath("/admin/dashboard");
  return { ok: true as const };
}

export async function createSocialAccount(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("social_accounts").insert({
    platform: String(formData.get("platform")) as SocialPlatform,
    account_name: String(formData.get("account_name")),
    profile_url: String(formData.get("profile_url") || "") || null,
    project_id: String(formData.get("project_id") || "") || null,
    client_id: String(formData.get("client_id") || "") || null,
    notes: String(formData.get("notes") || "") || null,
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/digital");
  return { ok: true as const };
}

export async function createSocialContentRequest(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("social_content_requests").insert({
    title: String(formData.get("title")),
    project_id: String(formData.get("project_id") || "") || null,
    social_account_id: String(formData.get("social_account_id") || "") || null,
    assignee_id: String(formData.get("assignee_id") || "") || null,
    content_type: String(formData.get("content_type") || "post"),
    status: (String(formData.get("status") || "brief") as SocialRequestStatus),
    brief: String(formData.get("brief") || "") || null,
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/digital");
  return { ok: true as const };
}

export async function createDigitalRequest(data: {
  title: string;
  category: string;
  parent_id?: string | null;
  project_id?: string | null;
  contact_request_id?: string | null;
  client_id?: string | null;
  description?: string | null;
  budget?: string | null;
  assignee_id?: string | null;
  level?: number;
}) {
  const { supabase } = await requireAdmin();
  const level = data.parent_id ? (data.level ?? 1) : 0;
  const { error } = await supabase.from("digital_requests").insert({
    title: data.title,
    category: data.category,
    parent_id: data.parent_id ?? null,
    project_id: data.project_id ?? null,
    contact_request_id: data.contact_request_id ?? null,
    client_id: data.client_id ?? null,
    description: data.description ?? null,
    budget: data.budget ?? null,
    assignee_id: data.assignee_id ?? null,
    level,
    status: "nouveau",
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/digital");
  revalidatePath("/admin/dashboard");
  return { ok: true as const };
}

export async function updateDigitalRequestStatus(id: string, status: DigitalRequestStatus) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("digital_requests").update({ status }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/digital");
  return { ok: true as const };
}
