import { requireTeamMember } from "@/lib/team-access";
import { TeamTaskBoard } from "@/components/equipe/TeamTaskBoard";
import type { ProjectTask, SocialContentRequest } from "@/lib/types";

export default async function EquipeHomePage() {
  const { supabase, member } = await requireTeamMember();

  const [{ data: tasks }, { data: social }] = await Promise.all([
    supabase
      .from("project_tasks")
      .select("*, projects(title)")
      .eq("assignee_id", member.id)
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("social_content_requests")
      .select("*, social_accounts(platform, account_name)")
      .eq("assignee_id", member.id)
      .not("status", "in", '("publie","annule")'),
  ]);

  const taskList = (tasks as ProjectTask[]) ?? [];
  const socialList = (social as SocialContentRequest[]) ?? [];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Bonjour, {member.name}</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Voici vos tâches et demandes assignées — mettez à jour le statut au fur et à mesure.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Mes tâches projet</h2>
        <TeamTaskBoard tasks={taskList} />
      </section>

      {socialList.length > 0 && (
        <section className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold mb-4">Contenus social assignés</h2>
          <ul className="space-y-2 text-sm">
            {socialList.map((s) => (
              <li key={s.id} className="p-3 rounded-xl bg-white/[0.02] flex justify-between gap-4">
                <span>{s.title}</span>
                <span className="text-neutral-500 shrink-0">{s.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
