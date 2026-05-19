/** IDs des sections de la landing page (ancres #…) */
export const SECTION_IDS = {
  accueil: "accueil",
  avis: "avis",
  about: "about",
  services: "services",
  skills: "skills",
  portfolio: "portfolio",
  pricing: "pricing",
  faq: "faq",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Anciennes URLs → section (une seule source pour redirects + logique) */
export const LEGACY_PATH_TO_SECTION: Record<string, SectionId> = {
  about: SECTION_IDS.about,
  services: SECTION_IDS.services,
  skills: SECTION_IDS.skills,
  portfolio: SECTION_IDS.portfolio,
  pricing: SECTION_IDS.pricing,
  faq: SECTION_IDS.faq,
  contact: SECTION_IDS.contact,
};

export const LEGACY_SECTION_PATHS = Object.keys(LEGACY_PATH_TO_SECTION);

export function sectionHref(id: SectionId): `#${SectionId}` {
  return `#${id}`;
}

export function sectionIdFromHref(href: string): SectionId | null {
  const id = href.replace(/^#\/?/, "").split("?")[0];
  return isSectionId(id) ? id : null;
}

export function isSectionId(value: string): value is SectionId {
  return Object.values(SECTION_IDS).includes(value as SectionId);
}

/** Sections affichées dans la nav + landing (hors accueil / avis) */
export const NAV_SECTION_IDS = [
  SECTION_IDS.about,
  SECTION_IDS.services,
  SECTION_IDS.skills,
  SECTION_IDS.portfolio,
  SECTION_IDS.pricing,
  SECTION_IDS.faq,
  SECTION_IDS.contact,
] as const;

/** Liens rapides sous les avis — sous-ensemble de la nav */
export const QUICK_LINK_SECTION_IDS = [
  SECTION_IDS.services,
  SECTION_IDS.portfolio,
  SECTION_IDS.pricing,
  SECTION_IDS.contact,
] as const;

/** Blocs principaux de la landing (ordre + mise en page) */
export const LANDING_MAIN_SECTIONS = [
  { id: SECTION_IDS.about, pageKey: "about" },
  { id: SECTION_IDS.services, pageKey: "services", wide: true, band: true },
  { id: SECTION_IDS.skills, pageKey: "skills" },
  { id: SECTION_IDS.portfolio, pageKey: "portfolio", wide: true, band: true },
  { id: SECTION_IDS.pricing, pageKey: "pricing", wide: true },
  { id: SECTION_IDS.faq, pageKey: "faq", band: true },
  { id: SECTION_IDS.contact, pageKey: "contact" },
] as const;

export type LandingSectionConfig = (typeof LANDING_MAIN_SECTIONS)[number];
export type PageKey = LandingSectionConfig["pageKey"];

export const CONTACT_SECTION_HREF = sectionHref(SECTION_IDS.contact);
