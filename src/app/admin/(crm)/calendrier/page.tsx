import Link from "next/link";
import { requireAdmin } from "@/lib/auth-server";

export default async function CalendrierPage() {
  const { supabase } = await requireAdmin();
  const { data: stages } = await supabase
    .from("project_stages")
    .select("id, title, scheduled_date, status, project_id, projects(id, title)")
    .not("scheduled_date", "is", null)
    .order("scheduled_date", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Calendrier de programmation</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Dates planifiées pour chaque étape de projet.
        </p>
      </div>
      {!stages?.length ? (
        <p className="text-neutral-500 py-12 text-center glass rounded-2xl">
          Aucune étape planifiée. Définissez des dates dans chaque fiche projet.
        </p>
      ) : (
        <div className="glass rounded-2xl border border-white/5 divide-y divide-white/5">
          {stages.map((s) => (
            <Link
              key={s.id}
              href={`/admin/projets/${s.project_id}`}
              className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 hover:bg-white/[0.02] transition"
            >
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-xs text-neutral-500">
                  {(s.projects as { title?: string })?.title ?? "Projet"}
                </p>
              </div>
              <time className="text-violet-300 font-medium">
                {s.scheduled_date
                  ? new Date(s.scheduled_date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                  : "—"}
              </time>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
