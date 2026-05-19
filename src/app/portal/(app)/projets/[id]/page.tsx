import { notFound } from "next/navigation";
import { requirePortalAccess, portalDb } from "@/lib/portal-access";
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
  const ctx = await requirePortalAccess();
  const db = portalDb(ctx);

  const { data: project } = await db
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("client_id", ctx.client.id)
    .maybeSingle();

  if (!project) notFound();

  const [
    { data: stages },
    { data: messages },
    { data: documents },
    { data: invoices },
  ] = await Promise.all([
    db
      .from("project_stages")
      .select("*, project_validations(*)")
      .eq("project_id", id)
      .order("sort_order"),
    db.from("project_messages").select("*").eq("project_id", id).order("created_at"),
    db.from("project_documents").select("*").eq("project_id", id),
    db.from("invoices").select("*").eq("project_id", id),
  ]);

  return (
    <ClientProjectView
      guestMode={ctx.mode === "guest"}
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
