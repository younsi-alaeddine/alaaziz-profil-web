import { requireAdmin } from "@/lib/auth-server";
import { TeamBoard } from "@/components/admin/TeamBoard";
import type { Project, ProjectTask, TeamMember } from "@/lib/types";

export default async function AdminEquipePage() {
  const { supabase } = await requireAdmin();

  const [{ data: team }, { data: tasks }, { data: projects }] = await Promise.all([
    supabase.from("team_members").select("*").order("name"),
    supabase
      .from("project_tasks")
      .select("*, team_members(name), projects(title)")
      .order("created_at", { ascending: false }),
    supabase.from("projects").select("id, title").order("title"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">Équipe</p>
        <h2 className="text-2xl font-bold">Tâches & assignations</h2>
        <p className="text-neutral-400 text-sm mt-1">
          Chaque membre voit ses missions — le client les voit en lecture sur son espace.
        </p>
      </div>
      <TeamBoard
        team={(team as TeamMember[]) ?? []}
        tasks={(tasks as ProjectTask[]) ?? []}
        projects={(projects as Pick<Project, "id" | "title">[]) ?? []}
      />
    </div>
  );
}
