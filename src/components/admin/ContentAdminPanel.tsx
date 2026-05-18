"use client";

import { useState, useTransition } from "react";
import { saveSiteContentSection, resetSiteContentSection } from "@/app/actions/cms";
import type { SiteContentBundle } from "@/lib/content-defaults";
import { useToast } from "@/components/Toast";
import { ContentStructuredForms } from "@/components/admin/ContentStructuredForms";
import { Loader2, RotateCcw, Save } from "lucide-react";

const TABS: { key: keyof SiteContentBundle; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "À propos" },
  { key: "pages", label: "En-têtes pages" },
  { key: "home", label: "Accueil" },
  { key: "legal", label: "Légal" },
  { key: "services", label: "Services" },
  { key: "portfolio", label: "Portfolio" },
  { key: "reviews", label: "Témoignages" },
  { key: "faq", label: "FAQ" },
  { key: "skills", label: "Compétences" },
  { key: "plans", label: "Tarifs" },
  { key: "heroStats", label: "Stats" },
  { key: "images", label: "Images" },
  { key: "nav", label: "Nav" },
  { key: "footer", label: "Footer" },
];

const FORM_TABS = new Set<keyof SiteContentBundle>([
  "hero",
  "about",
  "footer",
  "home",
  "legal",
  "pages",
  "images",
]);

export function ContentAdminPanel({ content }: { content: SiteContentBundle }) {
  const { toast } = useToast();
  const [tab, setTab] = useState<keyof SiteContentBundle>("hero");
  const [draft, setDraft] = useState<SiteContentBundle[keyof SiteContentBundle]>(content.hero);
  const [json, setJson] = useState(() => JSON.stringify(content.hero, null, 2));
  const [mode, setMode] = useState<"form" | "json">("form");
  const [pending, startTransition] = useTransition();

  function switchTab(key: keyof SiteContentBundle) {
    setTab(key);
    const next = content[key];
    setDraft(next);
    setJson(JSON.stringify(next, null, 2));
    setMode(FORM_TABS.has(key) ? "form" : "json");
  }

  function save() {
    startTransition(async () => {
      try {
        const payload =
          mode === "json"
            ? (JSON.parse(json) as SiteContentBundle[typeof tab])
            : draft;
        const r = await saveSiteContentSection(tab, payload);
        if (!r.ok) toast(r.error, "error");
        else toast("Contenu enregistré", "success");
      } catch {
        toast("JSON invalide", "error");
      }
    });
  }

  function reset() {
    if (!confirm("Réinitialiser cette section ?")) return;
    startTransition(async () => {
      const r = await resetSiteContentSection(tab);
      if (!r.ok) toast(r.error, "error");
      else window.location.reload();
    });
  }

  const showForm = FORM_TABS.has(tab) && mode === "form";

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold">Éditeur de contenu du site</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Modifiez textes, services, portfolio, FAQ, tarifs, pages légales, etc.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => switchTab(item.key)}
            className={
              "px-3 py-1.5 rounded-lg text-xs " +
              (tab === item.key
                ? "bg-violet-500/30 text-violet-200"
                : "glass-light text-neutral-400")
            }
          >
            {item.label}
          </button>
        ))}
      </div>
      {FORM_TABS.has(tab) && (
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode("form")}
            className={
              "px-3 py-1 rounded-lg " +
              (mode === "form" ? "bg-violet-500/30 text-violet-200" : "glass-light text-neutral-500")
            }
          >
            Formulaire
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("json");
              setJson(JSON.stringify(draft, null, 2));
            }}
            className={
              "px-3 py-1 rounded-lg " +
              (mode === "json" ? "bg-violet-500/30 text-violet-200" : "glass-light text-neutral-500")
            }
          >
            JSON
          </button>
        </div>
      )}
      {showForm ? (
        <ContentStructuredForms tab={tab} value={draft} onChange={setDraft} />
      ) : (
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={18}
          className="w-full font-mono text-xs rounded-xl bg-black/40 border border-white/10 p-4"
        />
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="bg-grad px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{" "}
          Enregistrer
        </button>
        <button
          type="button"
          onClick={reset}
          className="glass-light px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Réinitialiser
        </button>
      </div>
    </div>
  );
}