import type { SupabaseClient } from "@supabase/supabase-js";

export async function notifyUser(
  supabase: SupabaseClient,
  params: {
    userId: string;
    projectId?: string;
    title: string;
    body: string;
  }
) {
  await supabase.from("notifications").insert({
    user_id: params.userId,
    project_id: params.projectId ?? null,
    title: params.title,
    body: params.body,
  });
}
