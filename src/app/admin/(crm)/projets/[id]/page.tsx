import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-server";
import { ProjectManageClient } from "@/components/admin/ProjectManageClient";
import type {
  Invoice,
  Project,
  ProjectDocument,
  ProjectMessage,
  ProjectStage,
} from "@/lib/types";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: project } = await supabase
    .from("projects")
    .select("*, clients(name, email, user_id)")
    .eq("id", id)
    .maybeSingle();

  if (!project) notFound();

  const [
    { data: stages },
    { data: messages },
    { data: documents },
    { data: invoices },
  ] = await Promise.all([
    supabase
      .from("project_stages")
      .select("*")
      .eq("project_id", id)
      .order("sort_order"),
    supabase
      .from("project_messages")
      .select("*")
      .eq("project_id", id)
      .order("created_at"),
    supabase
      .from("project_documents")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <ProjectManageClient
      project={project as Project & { clients: { name: string; email: string; user_id: string | null } }}
      stages={(stages as ProjectStage[]) ?? []}
      messages={(messages as ProjectMessage[]) ?? []}
      documents={(documents as ProjectDocument[]) ?? []}
      invoices={(invoices as Invoice[]) ?? []}
    />
  );
}
