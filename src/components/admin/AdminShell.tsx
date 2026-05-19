"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  ExternalLink,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Share2,
  Terminal,
  UserCog,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/demandes", label: "Demandes", icon: Inbox },
  { href: "/admin/projets", label: "Projets", icon: FolderKanban },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/equipe", label: "Équipe", icon: UserCog },
  { href: "/admin/digital", label: "Digital & Social", icon: Share2 },
  { href: "/admin/calendrier", label: "Calendrier", icon: Calendar },
  { href: "/admin/contenu", label: "Contenu site", icon: FileText },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
] as const;

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 border-r border-white/5 glass flex flex-col">
        <div className="p-5 border-b border-white/5">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-grad rounded-lg flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">
              CRM <span className="text-gradient">Admin</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active
                    ? "bg-violet-500/20 text-violet-200"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="border-b border-white/5 px-8 py-5 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">{title ?? "Administration"}</h1>
          <Link
            href="/"
            target="_blank"
            className="text-sm text-neutral-400 hover:text-white flex items-center gap-2 glass-light px-3 py-2 rounded-lg transition"
          >
            <ExternalLink className="w-4 h-4" />
            Voir le site
          </Link>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
