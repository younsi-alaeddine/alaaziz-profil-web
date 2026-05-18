"use client";

import { useState, useTransition } from "react";
import type { Client } from "@/lib/types";
import { inviteClientToPortal } from "@/app/actions/crm";
import { useToast } from "@/components/Toast";
import { Loader2, Mail, UserCheck } from "lucide-react";

const MODE_MESSAGES: Record<string, string> = {
  invited: "Invitation envoyée par e-mail — le client définit son mot de passe via le lien.",
  created: "Compte créé et lié au portail.",
  linked_existing: "Compte Auth existant lié au portail.",
  already_linked: "Le portail est déjà actif pour ce client.",
};

export function ClientsPanel({
  clients,
  serviceRoleConfigured,
}: {
  clients: Client[];
  serviceRoleConfigured: boolean;
}) {
  const { toast } = useToast();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleInvite(clientId: string) {
    startTransition(async () => {
      setPendingId(clientId);
      const result = await inviteClientToPortal(clientId);
      setPendingId(null);
      if (!result.ok) {
        toast(result.error, "error");
        return;
      }
      const msg = MODE_MESSAGES[result.mode] ?? "Portail activé.";
      toast(msg, "success");
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Clients</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Chaque client accède à{" "}
          <code className="text-violet-300">/portal</code> avec le même e-mail. L&apos;invitation
          crée le compte Auth et envoie un e-mail automatiquement.
        </p>
      </div>

      {!serviceRoleConfigured && (
        <div className="glass rounded-xl p-4 border border-amber-500/30 text-sm text-amber-200/90">
          <p className="font-medium">Configuration requise</p>
          <p className="text-xs mt-2 text-amber-200/70">
            Ajoutez{" "}
            <code className="text-amber-100">SUPABASE_SERVICE_ROLE_KEY</code> dans{" "}
            <code className="text-amber-100">.env.local</code> (Supabase → Settings → API →
            service_role), puis redémarrez le serveur.
          </p>
        </div>
      )}

      {serviceRoleConfigured && (
        <div className="glass rounded-xl p-4 border border-white/5 text-sm text-neutral-400">
          <p className="font-medium text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-violet-400" />
            Invitation automatique
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs mt-2">
            <li>Création du compte Supabase Auth (même e-mail que le client)</li>
            <li>Liaison automatique à la fiche client</li>
            <li>E-mail d&apos;invitation pour définir le mot de passe</li>
            <li>À la création d&apos;un projet depuis une demande, l&apos;invitation part aussi</li>
          </ul>
        </div>
      )}

      <ul className="space-y-3">
        {clients.length === 0 ? (
          <li className="text-sm text-neutral-500">Aucun client pour le moment.</li>
        ) : (
          clients.map((c) => (
            <li
              key={c.id}
              className="glass rounded-xl p-5 border border-white/5 flex flex-wrap justify-between gap-4"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-neutral-400">{c.email}</p>
                {c.company && <p className="text-xs text-neutral-500 mt-1">{c.company}</p>}
              </div>
              <div className="flex items-center gap-2">
                {c.user_id ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <UserCheck className="w-4 h-4" /> Portail actif
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!serviceRoleConfigured || pendingId === c.id}
                    onClick={() => handleInvite(c.id)}
                    className="text-xs px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 disabled:opacity-50 flex items-center gap-2"
                  >
                    {pendingId === c.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Mail className="w-3.5 h-3.5" />
                    )}
                    Inviter au portail
                  </button>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
