"use client";

import { useTransition } from "react";
import {
  createDigitalRequest,
  createSocialAccount,
  createSocialContentRequest,
  updateDigitalRequestStatus,
} from "@/app/actions/crm-extended";
import {
  DIGITAL_CATEGORIES,
  DIGITAL_STATUS_LABELS,
  SOCIAL_PLATFORM_LABELS,
} from "@/lib/crm";
import type { DigitalRequest, DigitalRequestStatus, SocialAccount, SocialContentRequest, TeamMember } from "@/lib/types";
import { useToast } from "@/components/Toast";

type Props = {
  accounts: SocialAccount[];
  socialRequests: SocialContentRequest[];
  digitalRoots: DigitalRequest[];
  team: TeamMember[];
};

function DigitalTree({ items, depth = 0 }: { items: DigitalRequest[]; depth?: number }) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  if (!items.length) return null;

  return (
    <ul className={depth > 0 ? "ml-6 mt-2 border-l border-white/10 pl-4 space-y-2" : "space-y-3"}>
      {items.map((d) => (
        <li key={d.id} className="glass-light rounded-xl p-4 border border-white/5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-sm">{d.title}</p>
              <p className="text-xs text-neutral-500 mt-1">
                Niveau {d.level} · {d.category} ·{" "}
                {DIGITAL_STATUS_LABELS[d.status]}
              </p>
              {d.description && (
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{d.description}</p>
              )}
            </div>
            <select
              value={d.status}
              disabled={pending}
              onChange={(e) => {
                const status = e.target.value as DigitalRequestStatus;
                startTransition(async () => {
                  const r = await updateDigitalRequestStatus(d.id, status);
                  toast(r.ok ? "Statut mis à jour" : (r.error ?? "Erreur"), r.ok ? "success" : "error");
                });
              }}
              className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs"
            >
              {Object.entries(DIGITAL_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          {d.children && d.children.length > 0 && (
            <DigitalTree items={d.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export function DigitalHub({ accounts, socialRequests, digitalRoots, team }: Props) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <section className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Compte social (Facebook / Instagram…)</h3>
          <form
            action={(fd) =>
              startTransition(async () => {
                const r = await createSocialAccount(fd);
                toast(r.ok ? "Compte ajouté" : (r.error ?? "Erreur"), r.ok ? "success" : "error");
              })
            }
            className="space-y-3"
          >
            <select name="platform" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
              {Object.entries(SOCIAL_PLATFORM_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <input name="account_name" required placeholder="@marque ou Page Facebook" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
            <input name="profile_url" placeholder="URL profil" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
            <button type="submit" disabled={pending} className="bg-grad w-full py-2 rounded-xl text-sm">
              Enregistrer
            </button>
          </form>
          <ul className="mt-4 space-y-2 text-sm">
            {accounts.map((a) => (
              <li key={a.id} className="p-2 rounded-lg bg-white/[0.02]">
                {SOCIAL_PLATFORM_LABELS[a.platform]} — {a.account_name}
              </li>
            ))}
          </ul>
        </section>

        <section className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Demande de contenu</h3>
          <form
            action={(fd) =>
              startTransition(async () => {
                const r = await createSocialContentRequest(fd);
                toast(r.ok ? "Demande créée" : (r.error ?? "Erreur"), r.ok ? "success" : "error");
              })
            }
            className="space-y-3"
          >
            <input name="title" required placeholder="Titre (ex. Post lancement)" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
            <select name="social_account_id" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
              <option value="">Compte</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {SOCIAL_PLATFORM_LABELS[a.platform]} — {a.account_name}
                </option>
              ))}
            </select>
            <select name="assignee_id" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
              <option value="">Assigné</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <textarea name="brief" rows={2} placeholder="Brief" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm resize-none" />
            <button type="submit" disabled={pending} className="bg-grad w-full py-2 rounded-xl text-sm">
              Créer
            </button>
          </form>
        </section>
      </div>

      <div className="space-y-6">
        <section className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Demande digitale (multiniveau)</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              startTransition(async () => {
                const r = await createDigitalRequest({
                  title: String(fd.get("title")),
                  category: String(fd.get("category")),
                  parent_id: String(fd.get("parent_id") || "") || null,
                  description: String(fd.get("description") || "") || null,
                  assignee_id: String(fd.get("assignee_id") || "") || null,
                });
                toast(r.ok ? "Demande créée" : (r.error ?? "Erreur"), r.ok ? "success" : "error");
                if (r.ok) e.currentTarget.reset();
              });
            }}
            className="space-y-3"
          >
            <input name="title" required placeholder="Titre" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm" />
            <select name="category" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
              {DIGITAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <select name="parent_id" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
              <option value="">Racine (niveau 0)</option>
              {digitalRoots.map((d) => (
                <option key={d.id} value={d.id}>
                  Sous : {d.title}
                </option>
              ))}
            </select>
            <select name="assignee_id" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
              <option value="">Assigné</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <textarea name="description" rows={2} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm resize-none" />
            <button type="submit" disabled={pending} className="bg-grad w-full py-2 rounded-xl text-sm">
              Ajouter
            </button>
          </form>
        </section>

        <section className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Arbre des demandes digitales</h3>
          <DigitalTree items={digitalRoots} />
        </section>

        <section className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Contenus social</h3>
          <ul className="space-y-2 text-sm">
            {socialRequests.length === 0 ? (
              <li className="text-neutral-500">Aucune demande.</li>
            ) : (
              socialRequests.map((s) => (
                <li key={s.id} className="p-3 rounded-xl bg-white/[0.02]">
                  {s.title}
                  <span className="text-neutral-500 text-xs block mt-1">{s.status}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
