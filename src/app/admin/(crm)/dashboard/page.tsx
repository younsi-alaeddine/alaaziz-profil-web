import Link from "next/link";
import { requireAdmin } from "@/lib/auth-server";
import { PROJECT_STATUS_LABELS } from "@/lib/crm";
import { FolderKanban, Inbox, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: demandes },
    { count: projets },
    { count: clients },
    { data: activeProjects },
    { data: upcomingStages },
  ] = await Promise.all([
    supabase.from("contact_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id, title, status, progress_percent, delivery_date")
      .not("status", "in", '("terminee","refusee")')
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("project_stages")
      .select("id, title, scheduled_date, project_id, projects(title)")
      .not("scheduled_date", "is", null)
      .gte("scheduled_date", new Date().toISOString().slice(0, 10))
      .order("scheduled_date", { ascending: true })
      .limit(6),
  ]);

  const cards = [
    { label: "Nouvelles demandes", value: demandes ?? 0, href: "/admin/demandes", icon: Inbox },
    { label: "Projets actifs", value: projets ?? 0, href: "/admin/projets", icon: FolderKanban },
    { label: "Clients", value: clients ?? 0, href: "/admin/clients", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <p className="text-neutral-400 text-sm max-w-2xl">
        Système professionnel de gestion client — demandes, projets, calendrier et espace client privé.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="glass rounded-2xl p-6 border border-white/5 hover:border-violet-500/30 transition group"
          >
            <Icon className="w-6 h-6 text-violet-400 mb-3" />
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-neutral-500 mt-1 group-hover:text-neutral-300">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-semibold mb-4">Projets en cours</h2>
          {!activeProjects?.length ? (
            <p className="text-sm text-neutral-500">Aucun projet actif.</p>
          ) : (
            <ul className="space-y-3">
              {activeProjects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/projets/${p.id}`}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-white/5 transition"
                  >
                    <div>
                      <p className="font-medium text-sm">{p.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {PROJECT_STATUS_LABELS[p.status as keyof typeof PROJECT_STATUS_LABELS]}
                      </p>
                    </div>
                    <span className="text-sm text-violet-300">{p.progress_percent}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-semibold mb-4">Prochaines échéances</h2>
          {!upcomingStages?.length ? (
            <p className="text-sm text-neutral-500">Aucune date planifiée.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingStages.map((s) => (
                <li key={s.id} className="flex justify-between gap-4 text-sm p-3 rounded-xl bg-white/[0.02]">
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs text-neutral-500">
                      {(s.projects as { title?: string })?.title ?? "Projet"}
                    </p>
                  </div>
                  <time className="text-violet-300 shrink-0">
                    {s.scheduled_date
                      ? new Date(s.scheduled_date).toLocaleDateString("fr-FR")
                      : "—"}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
