"use client";

import type { SiteContentBundle } from "@/lib/content-defaults";

const inputClass =
  "mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm";

type Props = {
  tab: keyof SiteContentBundle;
  value: SiteContentBundle[keyof SiteContentBundle];
  onChange: (v: SiteContentBundle[keyof SiteContentBundle]) => void;
};

export function ContentStructuredForms({ tab, value, onChange }: Props) {
  if (tab === "hero") {
    const h = value as SiteContentBundle["hero"];
    return (
      <div className="space-y-4 max-w-xl">
        {(
          [
            ["badge", "Badge"],
            ["title", "Titre"],
            ["titleHighlight", "Titre (surbrillance)"],
            ["subtitle", "Sous-titre"],
            ["ctaPrimary", "Bouton principal"],
            ["ctaSecondary", "Bouton secondaire"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="text-neutral-400">{label}</span>
            <input
              className={inputClass}
              value={h[key]}
              onChange={(e) => onChange({ ...h, [key]: e.target.value })}
            />
          </label>
        ))}
      </div>
    );
  }

  if (tab === "about") {
    const a = value as SiteContentBundle["about"];
    return (
      <div className="space-y-4 max-w-xl">
        <label className="block text-sm">
          <span className="text-neutral-400">Bio</span>
          <textarea
            className={inputClass + " min-h-[100px]"}
            value={a.bio}
            onChange={(e) => onChange({ ...a, bio: e.target.value })}
          />
        </label>
        {(
          [
            ["card1Title", "card1Text", "Carte 1"],
            ["card2Title", "card2Text", "Carte 2"],
          ] as const
        ).map(([titleKey, textKey, label]) => (
          <div key={label} className="space-y-2 p-4 rounded-xl glass-light">
            <p className="text-xs text-violet-400 font-medium">{label}</p>
            <input
              className={inputClass}
              value={a[titleKey]}
              onChange={(e) => onChange({ ...a, [titleKey]: e.target.value })}
              placeholder="Titre"
            />
            <textarea
              className={inputClass + " min-h-[60px]"}
              value={a[textKey]}
              onChange={(e) => onChange({ ...a, [textKey]: e.target.value })}
              placeholder="Texte"
            />
          </div>
        ))}
      </div>
    );
  }

  if (tab === "footer") {
    const f = value as SiteContentBundle["footer"];
    return (
      <div className="space-y-4 max-w-xl">
        <label className="block text-sm">
          <span className="text-neutral-400">Copyright</span>
          <input
            className={inputClass}
            value={f.copyright}
            onChange={(e) => onChange({ ...f, copyright: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-400">Tagline footer</span>
          <input
            className={inputClass}
            value={f.tagline}
            onChange={(e) => onChange({ ...f, tagline: e.target.value })}
          />
        </label>
      </div>
    );
  }

  if (tab === "home") {
    const home = value as SiteContentBundle["home"];
    return (
      <div className="space-y-4 max-w-xl">
        <label className="block text-sm">
          <span className="text-neutral-400">Label section témoignages</span>
          <input
            className={inputClass}
            value={home.reviewsLabel}
            onChange={(e) => onChange({ ...home, reviewsLabel: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-400">Titre section témoignages</span>
          <input
            className={inputClass}
            value={home.reviewsTitle}
            onChange={(e) => onChange({ ...home, reviewsTitle: e.target.value })}
          />
        </label>
      </div>
    );
  }

  if (tab === "legal") {
    const legal = value as SiteContentBundle["legal"];
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-3">
          <p className="text-xs text-violet-400 font-medium">Mentions légales</p>
          <input
            className={inputClass}
            value={legal.mentionsTitle}
            onChange={(e) => onChange({ ...legal, mentionsTitle: e.target.value })}
          />
          <textarea
            className={inputClass + " min-h-[120px]"}
            value={legal.mentionsBody}
            onChange={(e) => onChange({ ...legal, mentionsBody: e.target.value })}
          />
        </div>
        <div className="space-y-3">
          <p className="text-xs text-violet-400 font-medium">Confidentialité</p>
          <input
            className={inputClass}
            value={legal.privacyTitle}
            onChange={(e) => onChange({ ...legal, privacyTitle: e.target.value })}
          />
          <textarea
            className={inputClass + " min-h-[120px]"}
            value={legal.privacyBody}
            onChange={(e) => onChange({ ...legal, privacyBody: e.target.value })}
          />
        </div>
      </div>
    );
  }

  if (tab === "pages") {
    const pages = value as SiteContentBundle["pages"];
    const keys = Object.keys(pages) as (keyof typeof pages)[];
    return (
      <div className="space-y-8">
        {keys.map((pageKey) => {
          const p = pages[pageKey];
          return (
            <div
              key={pageKey}
              className="space-y-3 p-4 rounded-xl glass-light border border-white/5"
            >
              <p className="text-sm font-medium capitalize">{pageKey}</p>
              {(
                [
                  ["label", "Label"],
                  ["labelColor", "Couleur label (classe Tailwind)"],
                  ["title", "Titre"],
                  ["titleHighlight", "Surbrillance"],
                  ["subtitle", "Sous-titre"],
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="block text-sm">
                  <span className="text-neutral-400">{label}</span>
                  <input
                    className={inputClass}
                    value={p[field]}
                    onChange={(e) =>
                      onChange({
                        ...pages,
                        [pageKey]: { ...p, [field]: e.target.value },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  if (tab === "images") {
    const img = value as SiteContentBundle["images"];
    return (
      <div className="space-y-4 max-w-xl">
        <label className="block text-sm">
          <span className="text-neutral-400">URL photo Alaeddine</span>
          <input
            className={inputClass}
            value={img.alaeddine}
            onChange={(e) => onChange({ ...img, alaeddine: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-400">URL photo Aziz</span>
          <input
            className={inputClass}
            value={img.aziz}
            onChange={(e) => onChange({ ...img, aziz: e.target.value })}
          />
        </label>
      </div>
    );
  }

  return (
    <p className="text-sm text-neutral-500">
      Utilisez l&apos;éditeur JSON pour cette section (tableaux : services, portfolio, etc.).
    </p>
  );
}
