import Link from "next/link";
import { requireAdmin } from "@/lib/auth-server";
import { PROJECT_STATUS_LABELS, TASK_STATUS_LABELS, SOCIAL_PLATFORM_LABELS, DIGITAL_STATUS_LABELS } from "@/lib/crm";
import {
  Calendar,
  FolderKanban,
  Inbox,
  Instagram,
  Layers,
  Share2,
  TrendingUp,
  Users,
  UserCog,
} from "lucide-react";
import type { ProjectStatus } from "@/lib/types";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: demandes },
    { count: projets },
    { count: clients },
    { count: tasksOpen },
    { count: socialPending },
    { count: digitalOpen },
    { data: activeProjects },
    { data: upcomingStages },
    { data: recentTasks },
    { data: team },
  ] = await Promise.all([
    supabase.from("contact_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase
      .from("project_tasks")
      .select("*", { count: "exact", head: true })
      .neq("status", "done"),
    supabase
      .from("social_content_requests")
      .select("*", { count: "exact", head: true })
      .not("status", "in", '("publie","annule")'),
    supabase
      .from("digital_requests")
      .select("*", { count: "exact", head: true })
      .not("status", "in", '("livre","annule")'),
    supabase
      .from("projects")
      .select("id, title, status, progress_percent, delivery_date, clients(name)")
      .not("status", "in", '("terminee","refusee")')
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("project_stages")
      .select("id, title, scheduled_date, project_id, projects(title)")
      .not("scheduled_date", "is", null)
      .gte("scheduled_date", new Date().toISOString().slice(0, 10))
      .order("scheduled_date", { ascending: true })
      .limit(5),
    supabase
      .from("project_tasks")
      .select("id, title, status, due_date, team_members(name), projects(title)")
      .neq("status", "done")
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(8),
    supabase.from("team_members").select("id, name, role, active").eq("active", true),
  ]);

  const statCards = [
    { label: "Demandes site", value: demandes ?? 0, href: "/admin/demandes", icon: Inbox, color: "text-amber-400" },
    { label: "Projets", value: projets ?? 0, href: "/admin/projets", icon: FolderKanban, color: "text-violet-400" },
    { label: "Clients", value: clients ?? 0, href: "/admin/clients", icon: Users, color: "text-blue-400" },
    { label: "Tâches ouvertes", value: tasksOpen ?? 0, href: "/admin/equipe", icon: UserCog, color: "text-emerald-400" },
    { label: "Social en cours", value: socialPending ?? 0, href: "/admin/digital", icon: Instagram, color: "text-pink-400" },
    { label: "Demandes digitales", value: digitalOpen ?? 0, href: "/admin/digital", icon: Layers, color: "text-cyan-400" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-2">Tableau de bord</p>
          <h2 className="text-2xl font-bold">Vue d&apos;ensemble</h2>
          <p className="text-neutral-400 text-sm mt-1 max-w-xl">
            Projets, équipe, réseaux sociaux et demandes digitales multiniveau — tout en un seul endroit.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/digital" className="glass-light px-4 py-2 rounded-xl text-sm hover:bg-white/10 flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Digital & Social
          </Link>
          <Link href="/portal/suivi" target="_blank" className="bg-grad px-4 py-2 rounded-xl text-sm hover:opacity-90 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Aperçu client
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(({ label, value, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="glass rounded-2xl p-5 border border-white/5 hover:border-violet-500/25 transition group"
          >
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-neutral-500 mt-1 group-hover:text-neutral-300">{label}</p>
          </Link>
        ))}
      </div>

      {team && team.length > 0 && (
        <section className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-400" />
              Équipe active
            </h3>
            <Link href="/admin/equipe" className="text-xs text-violet-400 hover:text-violet-300">
              Gérer →
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {team.map((m) => (
              <span
                key={m.id}
                className="glass-light px-4 py-2 rounded-xl text-sm border border-white/5"
              >
                {m.name}
                <span className="text-neutral-500 text-xs ml-2">{m.role}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="grid xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-violet-400" />
            Projets en cours
          </h3>
          {!activeProjects?.length ? (
            <p className="text-sm text-neutral-500">Aucun projet actif.</p>
          ) : (
            <ul className="space-y-2">
              {activeProjects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/projets/${p.id}`}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-white/5 transition"
                  >
                    <div>
                      <p className="font-medium text-sm">{p.title}</p>
                      <p className="text-xs text-neutral-500">
                        {(p.clients as { name?: string })?.name} ·{" "}
                        {PROJECT_STATUS_LABELS[p.status as ProjectStatus]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-violet-300">{p.progress_percent}%</p>
                      <div className="w-20 h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
                        <div
                          className="h-full bg-grad rounded-full"
                          style={{ width: `${p.progress_percent}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Échéances
          </h3>
          {!upcomingStages?.length ? (
            <p className="text-sm text-neutral-500">Rien de planifié.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {upcomingStages.map((s) => (
                <li key={s.id} className="p-3 rounded-xl bg-white/[0.02] flex justify-between gap-2">
                  <span className="truncate">{s.title}</span>
                  <time className="text-violet-300 shrink-0 text-xs">
                    {s.scheduled_date
                      ? new Date(s.scheduled_date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })
                      : "—"}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <UserCog className="w-5 h-5 text-emerald-400" />
            Tâches équipe
          </h3>
          <Link href="/admin/equipe" className="text-xs text-violet-400">
            Tout voir →
          </Link>
        </div>
        {!recentTasks?.length ? (
          <p className="text-sm text-neutral-500">Aucune tâche en cours.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 text-xs border-b border-white/5">
                  <th className="pb-3 pr-4">Tâche</th>
                  <th className="pb-3 pr-4">Projet</th>
                  <th className="pb-3 pr-4">Assigné</th>
                  <th className="pb-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-4 font-medium">{t.title}</td>
                    <td className="py-3 pr-4 text-neutral-400">
                      {(t.projects as { title?: string })?.title ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-neutral-400">
                      {(t.team_members as { name?: string })?.name ?? "—"}
                    </td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-md bg-white/5">
                        {TASK_STATUS_LABELS[t.status as keyof typeof TASK_STATUS_LABELS]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs text-neutral-600">
        Statuts digitaux : {Object.values(DIGITAL_STATUS_LABELS).join(" · ")} · Plateformes :{" "}
        {Object.values(SOCIAL_PLATFORM_LABELS).join(" · ")}
      </p>
    </div>
  );
}
