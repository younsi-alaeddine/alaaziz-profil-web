"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  addInvoice,
  addProjectDocument,
  addProjectMessage,
  updateProjectDetails,
  updateProjectStatus,
  updateStageSchedule,
  updateStageStatus,
} from "@/app/actions/crm";
import { ProgressBar } from "@/components/crm/ProgressBar";
import { ProjectStatusBadge } from "@/components/crm/ProjectStatusBadge";
import { StageTimeline } from "@/components/crm/StageTimeline";
import { DOCUMENT_CATEGORIES, formatEuro, PROJECT_STATUS_LABELS } from "@/lib/crm";
import type {
  Invoice,
  Project,
  ProjectDocument,
  ProjectMessage,
  ProjectStage,
  ProjectStatus,
  StageStatus,
} from "@/lib/types";
import { useToast } from "@/components/Toast";
import { ExternalLink, Loader2 } from "lucide-react";

const STATUSES = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

type Props = {
  project: Project & { clients: { name: string; email: string; user_id: string | null } };
  stages: ProjectStage[];
  messages: ProjectMessage[];
  documents: ProjectDocument[];
  invoices: Invoice[];
};

export function ProjectManageClient({
  project: initialProject,
  stages: initialStages,
  messages: initialMessages,
  documents: initialDocuments,
  invoices: initialInvoices,
}: Props) {
  const { toast } = useToast();
  const [project, setProject] = useState(initialProject);
  const [stages, setStages] = useState(initialStages);
  const [messages, setMessages] = useState(initialMessages);
  const [documents, setDocuments] = useState(initialDocuments);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [msg, setMsg] = useState("");
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const r = await action();
      if (!r.ok) toast(r.error ?? "Erreur", "error");
      else toast(success, "success");
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/projets" className="text-xs text-neutral-500 hover:text-white">
            ← Projets
          </Link>
          <h2 className="text-2xl font-bold mt-2">{project.title}</h2>
          <p className="text-sm text-neutral-400 mt-1">
            {project.clients.name} · {project.clients.email}
          </p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <ProgressBar percent={project.progress_percent} />

      <section className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="font-semibold">Statut & planning</h3>
        <select
          value={project.status}
          disabled={pending}
          onChange={(e) => {
            const status = e.target.value as ProjectStatus;
            setProject((p) => ({ ...p, status }));
            run(() => updateProjectStatus(project.id, status), "Statut mis à jour");
          }}
          className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {PROJECT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-xs text-neutral-500">
            Date de début
            <input
              type="date"
              defaultValue={project.start_date ?? ""}
              onBlur={(e) =>
                run(
                  () =>
                    updateProjectDetails(project.id, {
                      start_date: e.target.value || null,
                    }),
                  "Date enregistrée"
                )
              }
              className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-neutral-500">
            Livraison estimée
            <input
              type="date"
              defaultValue={project.delivery_date ?? ""}
              onBlur={(e) =>
                run(
                  () =>
                    updateProjectDetails(project.id, {
                      delivery_date: e.target.value || null,
                    }),
                  "Date enregistrée"
                )
              }
              className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-semibold mb-4">Calendrier des étapes</h3>
        <StageTimeline stages={stages} />
        <ul className="mt-6 space-y-3">
          {stages.map((stage) => (
            <li key={stage.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
              <span className="text-sm font-medium flex-1">{stage.title}</span>
              <input
                type="date"
                defaultValue={stage.scheduled_date ?? ""}
                onBlur={(e) =>
                  run(
                    () =>
                      updateStageSchedule(stage.id, project.id, e.target.value || null),
                    "Date enregistrée"
                  )
                }
                className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs"
              />
              <select
                value={stage.status}
                disabled={pending}
                onChange={(e) => {
                  const st = e.target.value as StageStatus;
                  setStages((prev) =>
                    prev.map((s) => (s.id === stage.id ? { ...s, status: st } : s))
                  );
                  run(
                    () => updateStageStatus(stage.id, project.id, st),
                    "Étape mise à jour"
                  );
                }}
                className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs"
              >
                <option value="pending">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
              </select>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="font-semibold">Lien live du projet</h3>
        <form
          className="grid sm:grid-cols-2 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const live_url = String(fd.get("live_url") || "") || null;
            const live_password = String(fd.get("live_password") || "") || null;
            setProject((p) => ({ ...p, live_url, live_password }));
            run(
              () => updateProjectDetails(project.id, { live_url, live_password }),
              "Lien live enregistré"
            );
          }}
        >
          <input
            name="live_url"
            defaultValue={project.live_url ?? ""}
            placeholder="https://demo.monsite.com/client-x"
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm sm:col-span-2"
          />
          <input
            name="live_password"
            defaultValue={project.live_password ?? ""}
            placeholder="Mot de passe (optionnel)"
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm"
          />
          <button type="submit" className="bg-grad px-4 py-2 rounded-xl text-sm">
            Enregistrer
          </button>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-violet-300 sm:col-span-2"
            >
              <ExternalLink className="w-4 h-4" /> Ouvrir la démo
            </a>
          )}
        </form>
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="font-semibold">Documents client</h3>
        <form
          className="grid sm:grid-cols-2 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            run(async () => {
              const r = await addProjectDocument(project.id, {
                title: String(fd.get("doc_title")),
                category: String(fd.get("doc_category")),
                file_url: String(fd.get("doc_url")) || undefined,
              });
              if (r.ok) {
                setDocuments((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    project_id: project.id,
                    title: String(fd.get("doc_title")),
                    category: String(fd.get("doc_category")),
                    file_url: String(fd.get("doc_url")) || null,
                    storage_path: null,
                    uploaded_by: "admin",
                    created_at: new Date().toISOString(),
                  },
                ]);
                e.currentTarget.reset();
              }
              return r;
            }, "Document ajouté");
          }}
        >
          <input name="doc_title" required placeholder="Titre" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
          <select name="doc_category" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
            {DOCUMENT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <input name="doc_url" placeholder="URL du fichier (PDF, Drive…)" className="sm:col-span-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
          <button type="submit" className="bg-grad px-4 py-2 rounded-xl text-sm sm:col-span-2">Ajouter document</button>
        </form>
        <ul className="text-sm space-y-2 text-neutral-300">
          {documents.map((d) => (
            <li key={d.id}>
              {d.file_url ? (
                <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:underline">
                  {d.title}
                </a>
              ) : (
                d.title
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="font-semibold">Facturation</h3>
        <form
          className="grid sm:grid-cols-3 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const euros = parseFloat(String(fd.get("amount")));
            run(async () => {
              const r = await addInvoice(project.id, {
                label: String(fd.get("label")),
                amount_cents: Math.round(euros * 100),
                due_date: String(fd.get("due_date")) || undefined,
              });
              if (r.ok) {
                setInvoices((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    project_id: project.id,
                    label: String(fd.get("label")),
                    amount_cents: Math.round(euros * 100),
                    currency: "EUR",
                    status: "sent",
                    due_date: String(fd.get("due_date")) || null,
                    paid_at: null,
                    created_at: new Date().toISOString(),
                  },
                ]);
                e.currentTarget.reset();
              }
              return r;
            }, "Facture créée");
          }}
        >
          <input name="label" required placeholder="Libellé" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
          <input name="amount" required type="number" step="0.01" placeholder="Montant €" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
          <input name="due_date" type="date" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
          <button type="submit" className="bg-grad px-4 py-2 rounded-xl text-sm sm:col-span-3">Créer facture</button>
        </form>
        <ul className="text-sm space-y-2">
          {invoices.map((inv) => (
            <li key={inv.id} className="flex justify-between text-neutral-300 p-2 rounded-lg bg-white/[0.02]">
              <span>{inv.label}</span>
              <span>{formatEuro(inv.amount_cents, inv.currency)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-semibold mb-4">Messages</h3>
        <ul className="space-y-3 max-h-64 overflow-y-auto mb-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`text-sm p-3 rounded-xl ${
                m.author_role === "admin" ? "bg-violet-500/10 ml-8" : "bg-white/5 mr-8"
              }`}
            >
              <span className="text-[10px] uppercase text-neutral-500">{m.author_role}</span>
              <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
            </li>
          ))}
        </ul>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!msg.trim()) return;
            run(async () => {
              const r = await addProjectMessage(project.id, msg, true);
              if (r.ok) {
                setMsg("");
                setMessages((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    project_id: project.id,
                    author_id: null,
                    author_role: "admin",
                    body: msg,
                    created_at: new Date().toISOString(),
                  },
                ]);
              }
              return r;
            }, "Message envoyé");
          }}
        >
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Répondre au client…"
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm"
          />
          <button type="submit" disabled={pending} className="bg-grad px-4 py-2 rounded-xl text-sm">
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Envoyer"}
          </button>
        </form>
      </section>
    </div>
  );
}
