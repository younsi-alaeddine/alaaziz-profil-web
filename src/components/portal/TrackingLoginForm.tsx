"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Mail, Sparkles } from "lucide-react";
import { verifyTrackingAccess } from "@/app/actions/portal-tracking";

export function TrackingLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await verifyTrackingAccess(
      String(fd.get("email")),
      String(fd.get("code"))
    );
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/portal");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-2 text-xs text-violet-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Suivi Express
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Où en est <span className="text-gradient">mon projet</span> ?
          </h1>
          <p className="text-neutral-400 text-sm mt-3 max-w-sm mx-auto">
            Entrez l&apos;email du projet et le code reçu par e-mail — sans mot de passe.
          </p>
        </div>

        <form onSubmit={onSubmit} className="glass rounded-2xl p-8 space-y-5 border border-white/5">
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <label className="block text-sm">
            <span className="text-neutral-400 flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" /> Email du projet
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vous@entreprise.com"
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-violet-500/50 focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="text-neutral-400 flex items-center gap-2 mb-1">
              <KeyRound className="w-4 h-4" /> Code de suivi
            </span>
            <input
              name="code"
              type="text"
              required
              autoComplete="one-time-code"
              placeholder="AAZ-X7K2M9"
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-mono tracking-widest uppercase focus:border-violet-500/50 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-grad w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Voir l&apos;avancement
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-6">
          Compte complet avec mot de passe ?{" "}
          <Link href="/portal/login" className="text-violet-400 hover:text-violet-300">
            Espace client
          </Link>
        </p>
      </div>
    </div>
  );
}
