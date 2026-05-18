"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  addProjectMessage,
  submitStageValidation,
} from "@/app/actions/crm";
import { ProgressBar } from "@/components/crm/ProgressBar";
import { ProjectStatusBadge } from "@/components/crm/ProjectStatusBadge";
import { StageTimeline } from "@/components/crm/StageTimeline";
import { formatEuro } from "@/lib/crm";
import type {
  Invoice,
  Project,
  ProjectDocument,
  ProjectMessage,
  ProjectStage,
  ProjectStatus,
  ProjectValidation,
} from "@/lib/types";
import { useToast } from "@/components/Toast";
import { ExternalLink, Loader2 } from "lucide-react";

type StageWithVal = ProjectStage & { project_validations: ProjectValidation | null };

type Props = {
  project: Project;
  stages: StageWithVal[];
  messages: ProjectMessage[];
  documents: ProjectDocument[];
  invoices: Invoice[];
};

export function ClientProjectView({
  project,
  stages,
  messages: initialMessages,
  documents,
  invoices,
}: Props) {
  const { toast } = useToast();
  const [messages, setMessages] = useState(initialMessages);
  const [msg, setMsg] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      <Link href="/portal" className="text-xs text-neutral-500 hover:text-white">
        ← Mes projets
      </Link>
      <div className="flex flex-wrap justify-between gap-4">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <ProjectStatusBadge status={project.status as ProjectStatus} />
      </div>
      <ProgressBar percent={project.progress_percent} />
      {(project.start_date || project.delivery_date) && (
        <div className="flex flex-wrap gap-6 text-sm text-neutral-400">
          {project.start_date && (
            <p>Début : {new Date(project.start_date).toLocaleDateString("fr-FR")}</p>
          )}
          {project.delivery_date && (
            <p>Livraison : {new Date(project.delivery_date).toLocaleDateString("fr-FR")}</p>
          )}
        </div>
      )}

      <section className="glass rounded-2xl p-6 border border-white/5">
        <h2 className="font-semibold mb-4">Suivi des étapes</h2>
        <StageTimeline stages={stages} />
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <h2 className="font-semibold">Validation client</h2>
        {stages.map((stage) => {
          const v = stage.project_validations;
          if (!v || stage.status !== "completed") return null;
          return (
            <div key={stage.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="font-medium text-sm">{stage.title}</p>
              {v.decision === "pending" ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        const r = await submitStageValidation(v.id, project.id, "approved");
                        if (r.ok) toast("Étape validée", "success");
                        else toast(r.error ?? "Erreur", "error");
                      })
                    }
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300"
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      const note = prompt("Décrivez les modifications souhaitées :");
                      if (note === null) return;
                      startTransition(async () => {
                        const r = await submitStageValidation(
                          v.id,
                          project.id,
                          "changes_requested",
                          note
                        );
                        if (r.ok) toast("Demande enregistrée", "success");
                        else toast(r.error ?? "Erreur", "error");
                      });
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300"
                  >
                    Demander modification
                  </button>
                </div>
              ) : (
                <p className="text-xs text-neutral-500 mt-2">
                  {v.decision === "approved" ? "✅ Validé" : "🟡 Modifications demandées"}
                </p>
              )}
            </div>
          );
        })}
        {stages.every((s) => s.status !== "completed" || s.project_validations?.decision !== "pending") && (
          <p className="text-sm text-neutral-500">Les validations apparaîtront quand une étape est terminée.</p>
        )}
      </section>

      {project.live_url && (
        <section className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-semibold mb-2">Aperçu live</h2>
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-violet-300 text-sm"
          >
            <ExternalLink className="w-4 h-4" /> {project.live_url}
          </a>
          {project.live_password && (
            <p className="text-xs text-neutral-500 mt-2">Mot de passe : {project.live_password}</p>
          )}
        </section>
      )}

      <section className="glass rounded-2xl p-6 border border-white/5">
        <h2 className="font-semibold mb-4">Documents</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucun document pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((d) => (
              <li key={d.id}>
                {d.file_url ? (
                  <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-300 hover:underline">
                    {d.title}
                  </a>
                ) : (
                  <span className="text-sm">{d.title}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5">
        <h2 className="font-semibold mb-4">Factures & paiements</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucune facture.</p>
        ) : (
          <ul className="space-y-2">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex justify-between text-sm p-3 rounded-xl bg-white/[0.02]">
                <span>{inv.label}</span>
                <span className="text-violet-300">{formatEuro(inv.amount_cents, inv.currency)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5">
        <h2 className="font-semibold mb-4">Messages</h2>
        <ul className="space-y-3 max-h-48 overflow-y-auto mb-4">
          {messages.map((m) => (
            <li key={m.id} className={`text-sm p-3 rounded-xl ${m.author_role === "client" ? "bg-violet-500/10 ml-6" : "bg-white/5 mr-6"}`}>
              <p className="whitespace-pre-wrap">{m.body}</p>
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!msg.trim()) return;
            startTransition(async () => {
              const r = await addProjectMessage(project.id, msg, false);
              if (r.ok) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    project_id: project.id,
                    author_id: null,
                    author_role: "client",
                    body: msg,
                    created_at: new Date().toISOString(),
                  },
                ]);
                setMsg("");
                toast("Message envoyé", "success");
              } else toast(r.error ?? "Erreur", "error");
            });
          }}
          className="flex gap-2"
        >
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm"
            placeholder="Votre message…"
          />
          <button type="submit" disabled={pending} className="bg-grad px-4 py-2 rounded-xl text-sm">
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Envoyer"}
          </button>
        </form>
      </section>
    </div>
  );
}
