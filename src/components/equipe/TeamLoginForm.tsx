"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, UserCog } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ERRORS: Record<string, string> = {
  no_access: "Ce compte n'est pas membre de l'équipe. Contactez un administrateur.",
  unauthorized: "Accès refusé.",
};

export function TeamLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError ? ERRORS[urlError] ?? "Erreur de connexion." : null
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: String(fd.get("email")),
        password: String(fd.get("password")),
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      router.push("/equipe");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de connexion");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md glass rounded-2xl p-8 space-y-5 border border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <UserCog className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold">Espace équipe</h1>
            <p className="text-xs text-neutral-500">Tâches · projets assignés</p>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <label className="block text-sm">
          <span className="text-neutral-400">Email professionnel</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-emerald-500/50 focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-400">Mot de passe</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-emerald-500/50 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Connexion équipe
        </button>
        <p className="text-center text-xs text-neutral-500 pt-2">
          Administrateur ?{" "}
          <Link href="/admin/login" className="text-violet-400 hover:text-violet-300">
            Espace admin
          </Link>
          {" · "}
          <Link href="/portal/suivi" className="text-neutral-400 hover:text-white">
            Suivi client
          </Link>
        </p>
      </form>
    </div>
  );
}
