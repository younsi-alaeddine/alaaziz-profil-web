import Link from "next/link";
import { requirePortalAccess, portalDb } from "@/lib/portal-access";
import { PortalNotifications } from "@/components/portal/PortalNotifications";
import { ProgressBar } from "@/components/crm/ProgressBar";
import { ProjectStatusBadge } from "@/components/crm/ProjectStatusBadge";
import type { Notification, Project, ProjectStatus, ProjectTask } from "@/lib/types";
import { TASK_STATUS_LABELS } from "@/lib/crm";
import { Users } from "lucide-react";

export default async function PortalHomePage() {
  const ctx = await requirePortalAccess();
  const db = portalDb(ctx);

  const projectsQuery = db
    .from("projects")
    .select("*")
    .eq("client_id", ctx.client.id)
    .order("updated_at", { ascending: false });

  const notifsQuery =
    ctx.mode === "auth"
      ? db
          .from("notifications")
          .select("*")
          .eq("user_id", ctx.user.id)
          .eq("read", false)
          .order("created_at", { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [] as Notification[] });

  const [{ data: projects }, { data: notifications }] = await Promise.all([
    projectsQuery,
    notifsQuery,
  ]);

  const list = (projects as Project[]) ?? [];
  const notifs = (notifications as Notification[]) ?? [];

  let taskList: ProjectTask[] = [];
  if (list.length > 0) {
    const { data: tasks } = await db
      .from("project_tasks")
      .select("*, team_members(name, role, avatar_color)")
      .in(
        "project_id",
        list.map((p) => p.id)
      )
      .order("sort_order", { ascending: true });
    taskList = (tasks as ProjectTask[]) ?? [];
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Bonjour, {ctx.client.name}</h1>
        <p className="text-neutral-400 text-sm mt-1">
          {ctx.mode === "guest"
            ? "Suivi Express — consultez l'avancement et les tâches de votre équipe."
            : "Suivez l'avancement, validez les étapes et accédez à vos documents."}
        </p>
        {ctx.mode === "guest" && ctx.client.tracking_code && (
          <p className="text-xs text-neutral-600 mt-2 font-mono">
            Code actif · {ctx.client.tracking_code}
          </p>
        )}
      </div>

      {ctx.mode === "auth" && <PortalNotifications notifications={notifs} />}

      <section>
        <h2 className="text-lg font-semibold mb-4">Mes projets</h2>
        {list.length === 0 ? (
          <p className="text-neutral-500">Aucun projet pour le moment.</p>
        ) : (
          <ul className="space-y-4">
            {list.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/portal/projets/${p.id}`}
                  className="block glass rounded-2xl p-6 border border-white/5 hover:border-violet-500/30 transition"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="font-semibold">{p.title}</h3>
                    <ProjectStatusBadge status={p.status as ProjectStatus} />
                  </div>
                  <ProgressBar percent={p.progress_percent} />
                  {p.delivery_date && (
                    <p className="text-xs text-neutral-500 mt-3">
                      Livraison estimée :{" "}
                      {new Date(p.delivery_date).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {taskList.length > 0 && (
        <section className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            Équipe sur votre projet
          </h2>
          <ul className="space-y-3">
            {taskList.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div>
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {t.team_members?.name ?? "Non assigné"}
                    {t.team_members?.role
                      ? ` · ${t.team_members.role}`
                      : ""}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-md bg-violet-500/15 text-violet-300">
                  {TASK_STATUS_LABELS[t.status]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
