import Link from "next/link";
import { requireAdmin } from "@/lib/auth-server";
import { ProjectStatusBadge } from "@/components/crm/ProjectStatusBadge";
import { ProgressBar } from "@/components/crm/ProgressBar";
import type { Project, ProjectStatus } from "@/lib/types";

export default async function ProjetsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("projects")
    .select("*, clients(name, email)")
    .order("updated_at", { ascending: false });

  const projects = (data ?? []) as (Project & {
    clients: { name: string; email: string };
  })[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Gestion des projets</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Statuts, calendrier, lien live et suivi des étapes.
        </p>
      </div>
      {projects.length === 0 ? (
        <p className="text-neutral-500 py-12 text-center glass rounded-2xl">
          Aucun projet. Convertissez une demande depuis l&apos;onglet Demandes.
        </p>
      ) : (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-neutral-500">
                <th className="px-5 py-3 font-medium">Projet</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Progression</th>
                <th className="px-5 py-3 font-medium">Livraison</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <Link href={`/admin/projets/${p.id}`} className="font-medium hover:text-violet-300">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-neutral-400">
                    {p.clients?.name}
                    <span className="block text-xs">{p.clients?.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <ProjectStatusBadge status={p.status as ProjectStatus} />
                  </td>
                  <td className="px-5 py-4 w-40">
                    <ProgressBar percent={p.progress_percent} />
                  </td>
                  <td className="px-5 py-4 text-neutral-400">
                    {p.delivery_date
                      ? new Date(p.delivery_date).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
