import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTeamMember } from "@/lib/team-access";
import { ProgressBar } from "@/components/crm/ProgressBar";
import { ProjectStatusBadge } from "@/components/crm/ProjectStatusBadge";
import { StageTimeline } from "@/components/crm/StageTimeline";
import { TeamTaskBoard } from "@/components/equipe/TeamTaskBoard";
import type { ProjectStage, ProjectStatus, ProjectTask } from "@/lib/types";

export default async function EquipeProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, member } = await requireTeamMember();

  const { data: hasTask } = await supabase
    .from("project_tasks")
    .select("id")
    .eq("project_id", id)
    .eq("assignee_id", member.id)
    .limit(1)
    .maybeSingle();

  if (!hasTask) notFound();

  const [{ data: project }, { data: stages }, { data: tasks }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase
      .from("project_stages")
      .select("*")
      .eq("project_id", id)
      .order("sort_order"),
    supabase
      .from("project_tasks")
      .select("*, projects(title)")
      .eq("project_id", id)
      .eq("assignee_id", member.id),
  ]);

  if (!project) notFound();

  return (
    <div className="space-y-8">
      <Link href="/equipe" className="text-xs text-neutral-500 hover:text-white">
        ← Mon espace
      </Link>
      <div className="flex flex-wrap justify-between gap-4">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <ProjectStatusBadge status={project.status as ProjectStatus} />
      </div>
      <ProgressBar percent={project.progress_percent} />
      <section className="glass rounded-2xl p-6 border border-white/5">
        <h2 className="font-semibold mb-4">Étapes du projet</h2>
        <StageTimeline stages={(stages as ProjectStage[]) ?? []} />
      </section>
      <section>
        <h2 className="font-semibold mb-4">Mes tâches sur ce projet</h2>
        <TeamTaskBoard tasks={(tasks as ProjectTask[]) ?? []} />
      </section>
    </div>
  );
}
