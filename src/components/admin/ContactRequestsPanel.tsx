"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createProjectFromContact } from "@/app/actions/crm";
import { deleteContactRequest, markContactAsRead } from "@/app/actions/admin";
import type { ContactRequest } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { FolderPlus, Mail, Trash2 } from "lucide-react";

export function ContactRequestsPanel({
  initialRows,
  initialError,
}: {
  initialRows: ContactRequest[];
  initialError: string | null;
}) {
  const { toast } = useToast();
  const [rows, setRows] = useState(initialRows);
  const [pending, startTransition] = useTransition();

  function handleConvert(id: string) {
    startTransition(async () => {
      const result = await createProjectFromContact(id);
      if (!result.ok) {
        toast(result.error, "error");
        return;
      }
      toast(
        result.portalInvite
          ? `Projet créé. ${result.portalInvite}`
          : "Projet créé avec succès",
        result.portalInvite?.includes("SUPABASE") ? "error" : "success"
      );
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "read" as const, project_id: result.projectId } : r
        )
      );
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Réception des demandes</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Site web, WhatsApp, email — convertissez une demande en projet client.
        </p>
      </div>
      {initialError && <p className="text-sm text-red-400">{initialError}</p>}
      {rows.length === 0 ? (
        <p className="text-neutral-500 py-12 text-center">Aucune demande.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li
              key={r.id}
              className={`glass rounded-xl p-5 border ${
                r.status === "new" ? "border-violet-500/30" : "border-white/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-violet-400" />
                    {r.name} — {r.email}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {new Date(r.created_at).toLocaleString("fr-FR")} · {r.service}
                  </p>
                  <p className="text-sm text-neutral-300 mt-3 whitespace-pre-wrap">{r.message}</p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {!r.project_id && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handleConvert(r.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-1 disabled:opacity-50"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      Créer projet
                    </button>
                  )}
                  {r.project_id && (
                    <Link
                      href={`/admin/projets/${r.project_id}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300"
                    >
                      Voir projet
                    </Link>
                  )}
                  {r.status === "new" && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await markContactAsRead(r.id);
                          setRows((prev) =>
                            prev.map((x) => (x.id === r.id ? { ...x, status: "read" } : x))
                          );
                        })
                      }
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
                    >
                      Lu
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        if (!confirm("Supprimer ?")) return;
                        await deleteContactRequest(r.id);
                        setRows((prev) => prev.filter((x) => x.id !== r.id));
                      })
                    }
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
