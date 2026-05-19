"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, LogOut, UserCog } from "lucide-react";
import type { TeamMember } from "@/lib/types";

export function TeamShell({
  member,
  children,
}: {
  member: TeamMember;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/equipe/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5 glass sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/equipe" className="font-semibold flex items-center gap-2">
            <UserCog className="w-5 h-5 text-emerald-400" />
            Espace <span className="text-emerald-400">équipe</span>
          </Link>
          <span className="hidden sm:inline text-xs text-neutral-500">
            {member.name} · {member.role}
          </span>
          <nav className="flex items-center gap-2">
            <Link
              href="/equipe"
              className={`p-2 rounded-lg ${pathname === "/equipe" ? "bg-emerald-500/20 text-emerald-200" : "text-neutral-400 hover:text-white"}`}
              aria-label="Tableau de bord"
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
