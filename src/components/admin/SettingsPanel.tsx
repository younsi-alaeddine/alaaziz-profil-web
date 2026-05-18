"use client";

import { useState, useTransition } from "react";
import { saveSiteContentSection } from "@/app/actions/cms";
import type { SiteContentBundle } from "@/lib/content-defaults";
import { useToast } from "@/components/Toast";
import { Loader2, Save } from "lucide-react";

export function SettingsPanel({ content }: { content: SiteContentBundle }) {
  const { toast } = useToast();
  const [brand, setBrand] = useState(content.brand);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const r = await saveSiteContentSection("brand", brand);
      if (!r.ok) {
        toast(r.error, "error");
        return;
      }
      toast("Paramètres enregistrés", "success");
    });
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-lg font-semibold">Marque & réseaux</h2>
      <label className="block text-sm"><span className="text-neutral-400">Nom</span>
        <input value={brand.name} onChange={e=>setBrand({...brand,name:e.target.value})} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm" /></label>
      <label className="block text-sm"><span className="text-neutral-400">Slogan</span>
        <input value={brand.tagline} onChange={e=>setBrand({...brand,tagline:e.target.value})} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm" /></label>
      <label className="block text-sm"><span className="text-neutral-400">GitHub URL</span>
        <input value={brand.github} onChange={e=>setBrand({...brand,github:e.target.value})} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm" /></label>
      <label className="block text-sm"><span className="text-neutral-400">LinkedIn URL</span>
        <input value={brand.linkedin} onChange={e=>setBrand({...brand,linkedin:e.target.value})} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm" /></label>
      <label className="block text-sm"><span className="text-neutral-400">Email contact</span>
        <input value={brand.contactEmail} onChange={e=>setBrand({...brand,contactEmail:e.target.value})} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm" /></label>
      <button type="button" onClick={save} disabled={pending} className="bg-grad px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
        {pending && <Loader2 className="w-4 h-4 animate-spin" />}<Save className="w-4 h-4"/> Enregistrer
      </button>
      <p className="text-xs text-neutral-500">Pour le contenu détaillé (services, FAQ…), utilisez Contenu site.</p>
    </div>
  );
}
