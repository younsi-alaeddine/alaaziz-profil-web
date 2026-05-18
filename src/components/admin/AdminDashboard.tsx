"use client";

import { useMemo, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactRequest } from "@/lib/types";
import {
  deleteContactRequest,
  markContactAsRead,
} from "@/app/actions/admin";
import {
  AlertCircle,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

type Filter = "all" | "new" | "read";

type Props = {
  initialRows: ContactRequest[];
  initialError?: string | null;
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "new", label: "Nouvelles" },
  { id: "read", label: "Lues" },
];

export function AdminDashboard({ initialRows, initialError }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [rows, setRows] = useState(initialRows);
  const [error, setError] = useState(initialError ?? null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [pending, startTransition] = useTransition();
  const [refreshing, setRefreshing] = useState(false);

  const stats = useMemo(
    () => ({
      total: rows.length,
      new: rows.filter((r) => r.status === "new").length,
      read: rows.filter((r) => r.status === "read").length,
    }),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q) ||
        r.message.toLowerCase().includes(q)
      );
    });
  }, [rows, filter, search]);

  async function refresh() {
    setRefreshing(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (fetchError) {
        setError(fetchError.message);
        toast(fetchError.message, "error");
      } else {
        setRows((data as ContactRequest[]) ?? []);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur de chargement";
      setError(msg);
      toast(msg, "error");
    } finally {
      setRefreshing(false);
    }
  }

  function handleMarkRead(id: string) {
    startTransition(async () => {
      const result = await markContactAsRead(id);
      if (!result.ok) {
        toast(result.error, "error");
        return;
      }
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "read" as const } : r))
      );
      toast("Marqué comme lu", "success");
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer cette demande ?")) return;
    startTransition(async () => {
      const result = await deleteContactRequest(id);
      if (!result.ok) {
        toast(result.error, "error");
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast("Demande supprimée", "success");
    });
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const busy = pending || refreshing;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid grid-cols-3 gap-3 max-w-md">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Nouvelles" value={stats.new} accent />
          <StatCard label="Lues" value={stats.read} />
        </div>
        <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={refresh}
          disabled={busy}
          className="glass-light px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </button>
        <button
          type="button"
          onClick={logout}
          className="glass-light px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white/10"
        >
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-400 glass rounded-xl p-4 border border-red-500/20 space-y-2">
          <p className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </p>
          <p className="text-xs text-neutral-500">
            Vérifiez que votre email est dans{" "}
            <code className="text-violet-300">admin_allowlist</code> (Supabase SQL).
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Rechercher nom, email, service…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:border-violet-500/50 focus:outline-none"
        />
        <div className="flex gap-1 p-1 rounded-xl glass-light">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === f.id
                  ? "bg-violet-500/30 text-violet-200"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {busy && rows.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">
          <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Aucune demande{filter !== "all" ? " dans cette catégorie" : ""}.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((r) => (
            <li
              key={r.id}
              className={`glass rounded-xl p-5 border ${
                r.status === "new" ? "border-violet-500/30" : "border-white/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold flex items-center gap-2 flex-wrap">
                    <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                    {r.name}
                    <span className="text-neutral-500 font-normal">— {r.email}</span>
                    {r.status === "new" && (
                      <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                        Nouveau
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {new Date(r.created_at).toLocaleString("fr-FR")} · {r.service}
                  </p>
                  {r.company && (
                    <p className="text-sm text-neutral-400 mt-2">Entreprise : {r.company}</p>
                  )}
                  {r.budget && (
                    <p className="text-sm text-neutral-400">Budget : {r.budget}</p>
                  )}
                  <p className="text-sm text-neutral-300 mt-3 whitespace-pre-wrap">{r.message}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {r.status === "new" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleMarkRead(r.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 disabled:opacity-50"
                    >
                      Marquer lu
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 disabled:opacity-50"
                    aria-label="Supprimer"
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

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        accent ? "border-violet-500/30 bg-violet-500/10" : "border-white/5 glass-light"
      }`}
    >
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
    </div>
  );
}
