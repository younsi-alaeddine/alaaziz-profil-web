"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ERROR_MESSAGES: Record<string, string> = {
  auth: "Échec de l'authentification. Réessayez.",
  unauthorized: "Ce compte n'est pas autorisé à accéder à l'administration.",
};

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError ? ERROR_MESSAGES[urlError] ?? "Erreur de connexion." : null
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de connexion");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md glass rounded-2xl p-8 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-6 h-6 text-violet-400" />
          <h1 className="text-xl font-bold">Administration</h1>
        </div>
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <label className="block text-sm">
          <span className="text-neutral-400">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-violet-500/50 focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-400">Mot de passe</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-violet-500/50 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-grad w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Se connecter
        </button>
      </form>
    </div>
  );
}
