"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logoutPortalGuest } from "@/app/actions/portal-tracking";
import { LayoutDashboard, LogOut, Sparkles } from "lucide-react";

export function PortalShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "auth" | "guest";
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    if (mode === "guest") {
      await logoutPortalGuest();
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5 glass sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/portal" className="font-semibold">
            Espace <span className="text-gradient">client</span>
          </Link>
          {mode === "guest" && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-400 glass-light px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              Suivi Express
            </span>
          )}
          <nav className="flex items-center gap-2">
            <Link
              href="/portal"
              className={`p-2 rounded-lg ${pathname === "/portal" ? "bg-violet-500/20 text-violet-200" : "text-neutral-400 hover:text-white"}`}
              aria-label="Mes projets"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-lg text-neutral-400 hover:text-white"
              aria-label="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
