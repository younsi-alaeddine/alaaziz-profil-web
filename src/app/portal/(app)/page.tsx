import Link from "next/link";
import { requireClient } from "@/lib/auth-server";
import { PortalNotifications } from "@/components/portal/PortalNotifications";
import { ProgressBar } from "@/components/crm/ProgressBar";
import { ProjectStatusBadge } from "@/components/crm/ProjectStatusBadge";
import type { Notification, Project, ProjectStatus } from "@/lib/types";

export default async function PortalHomePage() {
  const { supabase, client, user } = await requireClient();

  const [{ data: projects }, { data: notifications }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("client_id", client.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const list = (projects as Project[]) ?? [];
  const notifs = (notifications as Notification[]) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Bonjour, {client.name}</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Suivez l&apos;avancement, validez les étapes et accédez à vos documents.
        </p>
      </div>
      <PortalNotifications notifications={notifs} />
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
    </div>
  );
}
