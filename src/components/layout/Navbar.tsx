"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Mail, Menu, Terminal, X } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { nav, brand } = useSiteContent();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-grad rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
            <Terminal className="text-white w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold">Alaeddine<span className="text-gradient">&Aziz</span></span>
            <p className="text-[10px] text-neutral-500 -mt-0.5">{brand.tagline}</p>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-7">
          {nav.map((link) => (
            <Link key={link.href} href={link.href}
              className={`nav-link text-sm text-neutral-400 hover:text-white transition ${isActive(link.href) ? "active" : ""}`}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/contact" className="hidden sm:flex bg-grad px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition items-center gap-2">
            <Mail className="w-4 h-4" /> Contact
          </Link>
          <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-white/10" aria-label="Menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 px-6 py-4 space-y-1">
          {nav.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={`block text-sm py-2.5 px-3 rounded-lg ${isActive(link.href) ? "text-violet-400 bg-violet-500/10" : "text-neutral-400 hover:bg-white/5"}`}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
