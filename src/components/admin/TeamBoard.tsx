"use client";

import { useTransition } from "react";
import { createProjectTask, createTeamMember, updateProjectTask } from "@/app/actions/crm-extended";
import { inviteTeamMemberToPortal } from "@/app/actions/team-portal";
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS, TEAM_ROLE_LABELS } from "@/lib/crm";
import type { Project, ProjectTask, TaskStatus, TeamMember } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { Loader2 } from "lucide-react";

type Props = {
  team: TeamMember[];
  tasks: ProjectTask[];
  projects: Pick<Project, "id" | "title">[];
};

export function TeamBoard({ team, tasks, projects }: Props) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-semibold mb-4">Ajouter un membre</h3>
        <form
          action={(fd) =>
            startTransition(async () => {
              const r = await createTeamMember(fd);
              toast(r.ok ? "Membre ajouté" : (r.error ?? "Erreur"), r.ok ? "success" : "error");
            })
          }
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <input name="name" required placeholder="Nom" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
          <select name="role" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
            {Object.entries(TEAM_ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <input name="email" type="email" required placeholder="Email (connexion)" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
          <button type="submit" disabled={pending} className="bg-grad rounded-xl text-sm py-2 font-medium">
            {pending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Ajouter"}
          </button>
        </form>
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-semibold mb-4">Nouvelle tâche</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const projectId = String(fd.get("project_id"));
            startTransition(async () => {
              const r = await createProjectTask(projectId, {
                title: String(fd.get("title")),
                assignee_id: String(fd.get("assignee_id") || "") || null,
                priority: fd.get("priority") as ProjectTask["priority"],
              });
              toast(r.ok ? "Tâche créée" : (r.error ?? "Erreur"), r.ok ? "success" : "error");
              if (r.ok) e.currentTarget.reset();
            });
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          <select name="project_id" required className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm lg:col-span-2">
            <option value="">Projet</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <input name="title" required placeholder="Titre tâche" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm lg:col-span-2" />
          <select name="assignee_id" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
            <option value="">Assigné</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <select name="priority" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
            {Object.entries(TASK_PRIORITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <button type="submit" disabled={pending} className="bg-grad rounded-xl text-sm py-2 font-medium sm:col-span-2 lg:col-span-1">
            Créer
          </button>
        </form>
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-semibold mb-4">Membres & accès /equipe</h3>
        <ul className="space-y-2 mb-6">
          {team.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <div>
                <p className="font-medium text-sm">{m.name}</p>
                <p className="text-xs text-neutral-500">{m.email ?? "—"} · {m.role}</p>
              </div>
              {m.user_id ? (
                <span className="text-xs text-emerald-400">Accès actif</span>
              ) : (
                <button
                  type="button"
                  disabled={pending || !m.email}
                  onClick={() =>
                    startTransition(async () => {
                      const r = await inviteTeamMemberToPortal(m.id);
                      toast(
                        r.ok ? (r.message ?? "OK") : (r.error ?? "Erreur"),
                        r.ok ? "success" : "error"
                      );
                    })
                  }
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 disabled:opacity-50"
                >
                  Inviter à l&apos;espace équipe
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5 overflow-x-auto">
        <h3 className="font-semibold mb-4">Toutes les tâches</h3>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-neutral-500 text-xs border-b border-white/5">
              <th className="pb-3 pr-3">Tâche</th>
              <th className="pb-3 pr-3">Projet</th>
              <th className="pb-3 pr-3">Assigné</th>
              <th className="pb-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b border-white/5">
                <td className="py-3 pr-3 font-medium">{t.title}</td>
                <td className="py-3 pr-3 text-neutral-400">
                  {(t.projects as { title?: string })?.title ?? "—"}
                </td>
                <td className="py-3 pr-3 text-neutral-400">
                  {(t.team_members as { name?: string })?.name ?? "—"}
                </td>
                <td className="py-3">
                  <select
                    value={t.status}
                    disabled={pending}
                    onChange={(e) => {
                      const status = e.target.value as TaskStatus;
                      startTransition(async () => {
                        const r = await updateProjectTask(t.id, { status });
                        toast(r.ok ? "Mis à jour" : (r.error ?? "Erreur"), r.ok ? "success" : "error");
                      });
                    }}
                    className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs"
                  >
                    {Object.entries(TASK_STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
