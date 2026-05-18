import { notFound } from "next/navigation";
import { requireClient } from "@/lib/auth-server";
import { ClientProjectView } from "@/components/portal/ClientProjectView";
import type {
  Invoice,
  Project,
  ProjectDocument,
  ProjectMessage,
  ProjectStage,
  ProjectValidation,
} from "@/lib/types";

export default async function PortalProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, client } = await requireClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("client_id", client.id)
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
      .select("*, project_validations(*)")
      .eq("project_id", id)
      .order("sort_order"),
    supabase
      .from("project_messages")
      .select("*")
      .eq("project_id", id)
      .order("created_at"),
    supabase.from("project_documents").select("*").eq("project_id", id),
    supabase.from("invoices").select("*").eq("project_id", id),
  ]);

  return (
    <ClientProjectView
      project={project as Project}
      stages={
        (stages as (ProjectStage & { project_validations: ProjectValidation | null })[]) ?? []
      }
      messages={(messages as ProjectMessage[]) ?? []}
      documents={(documents as ProjectDocument[]) ?? []}
      invoices={(invoices as Invoice[]) ?? []}
    />
  );
}
