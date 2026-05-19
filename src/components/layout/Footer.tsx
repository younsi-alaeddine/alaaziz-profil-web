"use client";

import Link from "next/link";
import { Github, Linkedin, Terminal } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

export function Footer() {
  const { brand, footer } = useSiteContent();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 py-12 md:py-16">
      <div className="site-container space-y-8">
        <div className="flex flex-wrap justify-center gap-6 text-xs text-neutral-500">
          <Link href="/mentions-legales" className="hover:text-white transition">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-white transition">
            Confidentialité
          </Link>
          <Link href="/portal/suivi" className="hover:text-violet-400 transition">
            Suivi projet
          </Link>
          <Link href="/portal/login" className="hover:text-white transition">
            Espace client
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-grad rounded-lg flex items-center justify-center">
              <Terminal className="text-white w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">
              {brand.name.split(" ")[0]}
              <span className="text-gradient">&Aziz</span>
            </span>
          </div>
          <p className="text-xs text-neutral-600 text-center">
            © {year} {footer.copyright}
          </p>
          <div className="flex items-center gap-3">
            <a
              href={brand.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg glass-light flex items-center justify-center hover:bg-white/10 transition text-neutral-500 hover:text-white"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={brand.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg glass-light flex items-center justify-center hover:bg-white/10 transition text-neutral-500 hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
