import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { CONTACT_SECTION_HREF } from "@/lib/sections";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-gradient">404</p>
        <h1 className="text-2xl font-bold mt-4">Page introuvable</h1>
        <p className="text-neutral-500 mt-3 text-sm">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link
            href="/"
            className="bg-grad px-5 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Accueil
          </Link>
          <Link
            href={`/${CONTACT_SECTION_HREF}`}
            className="glass-light px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
