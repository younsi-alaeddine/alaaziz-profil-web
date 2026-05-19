"use client";

import { useTransition } from "react";
import Link from "next/link";
import { updateMyTaskStatus } from "@/app/actions/team-portal";
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/lib/crm";
import type { ProjectTask, TaskStatus } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { ExternalLink } from "lucide-react";

export function TeamTaskBoard({ tasks }: { tasks: ProjectTask[] }) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-neutral-500 glass rounded-2xl p-8 border border-white/5 text-center">
        Aucune tâche assignée pour le moment.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((t) => (
        <li
          key={t.id}
          className="glass rounded-2xl p-5 border border-white/5 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <p className="font-medium">{t.title}</p>
            <p className="text-xs text-neutral-500 mt-1">
              {(t.projects as { title?: string })?.title ?? "Projet"} ·{" "}
              {TASK_PRIORITY_LABELS[t.priority]}
              {t.due_date &&
                ` · ${new Date(t.due_date).toLocaleDateString("fr-FR")}`}
            </p>
            {t.project_id && (
              <Link
                href={`/equipe/projets/${t.project_id}`}
                className="text-xs text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 mt-2"
              >
                Voir le projet <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
          <select
            value={t.status}
            disabled={pending}
            onChange={(e) => {
              const status = e.target.value as TaskStatus;
              startTransition(async () => {
                const r = await updateMyTaskStatus(t.id, status);
                toast(r.ok ? "Statut mis à jour" : (r.error ?? "Erreur"), r.ok ? "success" : "error");
              });
            }}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
          >
            {Object.entries(TASK_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </li>
      ))}
    </ul>
  );
}
