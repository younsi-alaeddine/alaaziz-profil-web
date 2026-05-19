"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  DEMO_ACCOUNTS,
  DEMO_PASSWORD,
  DEMO_TRACKING_CODE,
} from "@/lib/demo-config";
import {
  purgeDemoEnvironment,
  seedDemoEnvironment,
} from "@/app/actions/demo-seed";
import { useToast } from "@/components/Toast";
import type { DemoEnvironmentStatus } from "@/app/actions/demo-seed";
import {
  Copy,
  FlaskConical,
  Loader2,
  LogIn,
  Shield,
  Trash2,
  User,
  Users,
} from "lucide-react";

const ROWS = [
  {
    label: "Admin CRM",
    icon: Shield,
    email: DEMO_ACCOUNTS.admin.email,
    login: DEMO_ACCOUNTS.admin.loginPath,
    extra: null as string | null,
  },
  {
    label: "Équipe (travailleur)",
    icon: Users,
    email: DEMO_ACCOUNTS.team.email,
    login: DEMO_ACCOUNTS.team.loginPath,
    extra: null,
  },
  {
    label: "Client (portail complet)",
    icon: User,
    email: DEMO_ACCOUNTS.client.email,
    login: DEMO_ACCOUNTS.client.loginPath,
    extra: null,
  },
  {
    label: "Suivi Express (sans mot de passe)",
    icon: FlaskConical,
    email: DEMO_ACCOUNTS.client.email,
    login: DEMO_ACCOUNTS.client.suiviPath,
    extra: `Code : ${DEMO_TRACKING_CODE}`,
  },
] as const;

export function DemoEnvironmentPanel({
  status,
}: {
  status: DemoEnvironmentStatus;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [installed, setInstalled] = useState(status.installed);

  function copy(text: string) {
    void navigator.clipboard.writeText(text);
    toast("Copié", "success");
  }

  function seed() {
    startTransition(async () => {
      const r = await seedDemoEnvironment();
      if (!r.ok) {
        toast(r.error, "error");
        return;
      }
      setInstalled(true);
      toast("Environnement démo créé", "success");
    });
  }

  function purge() {
    if (
      !confirm(
        "Supprimer tous les comptes et données démo ? Cette action est irréversible."
      )
    ) {
      return;
    }
    startTransition(async () => {
      const r = await purgeDemoEnvironment();
      if (!r.ok) {
        toast(r.error, "error");
        return;
      }
      setInstalled(false);
      toast("Environnement démo supprimé", "success");
    });
  }

  return (
    <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-5 max-w-2xl">
      <DemoStatusHeader installed={installed} hasServiceRole={status.hasServiceRole} />

      <p className="text-sm text-neutral-400">
        Mot de passe commun pour les 3 comptes :{" "}
        <code className="text-amber-200 bg-black/30 px-2 py-0.5 rounded">
          {DEMO_PASSWORD}
        </code>
        <button
          type="button"
          onClick={() => copy(DEMO_PASSWORD)}
          className="ml-2 inline-flex items-center gap-1 text-xs text-violet-300 hover:text-white"
        >
          <Copy className="w-3 h-3" /> Copier
        </button>
      </p>

      <DemoAccessRows copy={copy} />

      <p className="text-xs text-neutral-500">
        Inclut : demande contact, client, projet (étapes, messages, facture, tâches,
        social, digital), notifications. Tout est marqué démo et supprimable
        ci-dessous.
      </p>

      <DemoActionButtons
        installed={installed}
        pending={pending}
        hasServiceRole={status.hasServiceRole}
        onSeed={seed}
        onPurge={purge}
      />
    </section>
  );
}

function DemoStatusHeader({
  installed,
  hasServiceRole,
}: {
  installed: boolean;
  hasServiceRole: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FlaskConical className="w-5 h-5 text-amber-400" />
      <h2 className="text-lg font-semibold">Environnement démo</h2>
      <span
        className={`text-xs px-2.5 py-1 rounded-full ${
          installed
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-neutral-500/20 text-neutral-400"
        }`}
      >
        {installed ? "Installé" : "Non installé"}
      </span>
      {!hasServiceRole && (
        <p className="text-xs text-red-400 w-full">
          Ajoutez SUPABASE_SERVICE_ROLE_KEY dans .env.local pour créer / supprimer
          les comptes.
        </p>
      )}
    </div>
  );
}

function DemoAccessRows({ copy }: { copy: (text: string) => void }) {
  return (
    <div className="space-y-3">
      {ROWS.map(({ label, icon: Icon, email, login, extra }) => (
        <div
          key={label}
          className="rounded-xl bg-black/20 border border-white/5 p-4 text-sm space-y-2"
        >
          <div className="flex items-center gap-2 text-neutral-200 font-medium">
            <Icon className="w-4 h-4 text-violet-400" />
            {label}
          </div>
          <p className="text-neutral-300 font-mono text-xs break-all">{email}</p>
          {extra && <p className="text-amber-200/90 text-xs">{extra}</p>}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => copy(email)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Email
            </button>
            <Link
              href={login}
              target="_blank"
              className="text-xs px-2.5 py-1.5 rounded-lg bg-violet-500/20 text-violet-200 hover:bg-violet-500/30 flex items-center gap-1"
            >
              <LogIn className="w-3 h-3" /> Ouvrir
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function DemoActionButtons({
  installed,
  pending,
  hasServiceRole,
  onSeed,
  onPurge,
}: {
  installed: boolean;
  pending: boolean;
  hasServiceRole: boolean;
  onSeed: () => void;
  onPurge: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <button
        type="button"
        onClick={onSeed}
        disabled={pending || installed || !hasServiceRole}
        className="bg-grad px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-40"
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin" />}
        Créer l&apos;environnement démo
      </button>
      <button
        type="button"
        onClick={onPurge}
        disabled={pending || !installed || !hasServiceRole}
        className="px-4 py-2.5 rounded-xl text-sm border border-red-500/30 text-red-300 hover:bg-red-500/10 flex items-center gap-2 disabled:opacity-40"
      >
        <Trash2 className="w-4 h-4" />
        Supprimer tout le démo
      </button>
    </div>
  );
}
