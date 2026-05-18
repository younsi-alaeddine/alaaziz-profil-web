import {
  NAV_LINKS,
  SERVICES,
  PORTFOLIO,
  REVIEWS,
  FAQ_ITEMS,
  ALAEDDINE_IMG,
  AZIZ_IMG,
  HERO_STATS,
  SKILLS,
  PLANS,
} from "@/lib/data";

export const HERO_CONTENT = {
  badge: "Disponibles pour nouveaux projets",
  title: "Deux développeurs,",
  titleHighlight: "une vision",
  subtitle:
    "Alaeddine & Aziz — duo full-stack. Frontend, backend, SaaS et mobile pour transformer vos idées en produits digitaux performants.",
  ctaPrimary: "Démarrer un projet",
  ctaSecondary: "Voir le portfolio",
};

export const ABOUT_CONTENT = {
  bio: "Nous sommes Alaeddine et Aziz, deux développeurs full-stack passionnés par la création de produits digitaux performants. Notre force : la complémentarité — UX et frontend d'un côté, architecture backend et cloud de l'autre.",
  card1Title: "Duo agile",
  card1Text: "Communication fluide, livraisons rapides, zéro silo entre design et technique.",
  card2Title: "Stack unifié",
  card2Text: "React, Next.js, Node.js, Python — un seul langage d'équipe pour tout le produit.",
};

export const FOOTER_CONTENT = {
  tagline: "Développeurs Full-Stack",
  copyright: "Alaeddine & Aziz. Tous droits réservés.",
};

export const BRAND_CONTENT = {
  name: "Alaeddine & Aziz",
  tagline: "Développeurs Full-Stack",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  contactEmail: "contact@alaeddine-aziz.dev",
};

export type PageHeaderContent = {
  label: string;
  labelColor: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
};

export const PAGES_CONTENT: Record<
  "about" | "services" | "skills" | "portfolio" | "pricing" | "faq" | "contact",
  PageHeaderContent
> = {
  about: {
    label: "À propos",
    labelColor: "text-violet-400",
    title: "Le duo",
    titleHighlight: "Alaeddine & Aziz",
    subtitle: "Deux profils, une équipe.",
  },
  services: {
    label: "Services",
    labelColor: "text-blue-400",
    title: "Ce que nous",
    titleHighlight: "construisons",
    subtitle: "Du site vitrine au SaaS.",
  },
  skills: {
    label: "Compétences",
    labelColor: "text-emerald-400",
    title: "Notre",
    titleHighlight: "stack technique",
    subtitle: "Technologies et outils maîtrisés.",
  },
  portfolio: {
    label: "Portfolio",
    labelColor: "text-pink-400",
    title: "Projets",
    titleHighlight: "récents",
    subtitle: "Une sélection de réalisations.",
  },
  pricing: {
    label: "Tarifs",
    labelColor: "text-amber-400",
    title: "Formules",
    titleHighlight: "adaptées",
    subtitle: "Transparentes et évolutives.",
  },
  faq: {
    label: "FAQ",
    labelColor: "text-cyan-400",
    title: "Questions",
    titleHighlight: "fréquentes",
    subtitle: "Tout ce que vous devez savoir.",
  },
  contact: {
    label: "Contact",
    labelColor: "text-violet-400",
    title: "Parlons de",
    titleHighlight: "votre projet",
    subtitle: "Réponse sous 24h en moyenne.",
  },
};

export const HOME_SECTION_CONTENT = {
  reviewsLabel: "Témoignages",
  reviewsTitle: "Ils nous font confiance",
};

export const LEGAL_CONTENT = {
  mentionsTitle: "Mentions légales",
  mentionsBody:
    "Éditeur : Alaeddine & Aziz — développeurs full-stack. Hébergement : à compléter selon votre hébergeur. Pour toute question : utilisez le formulaire de contact.",
  privacyTitle: "Politique de confidentialité",
  privacyBody:
    "Les données collectées via le formulaire de contact sont utilisées uniquement pour répondre à votre demande. Vous disposez d'un droit d'accès, de rectification et de suppression en nous contactant.",
};

export type SiteContentBundle = {
  hero: typeof HERO_CONTENT;
  about: typeof ABOUT_CONTENT;
  footer: typeof FOOTER_CONTENT;
  brand: typeof BRAND_CONTENT;
  nav: typeof NAV_LINKS;
  services: typeof SERVICES;
  portfolio: typeof PORTFOLIO;
  reviews: typeof REVIEWS;
  faq: typeof FAQ_ITEMS;
  skills: typeof SKILLS;
  plans: typeof PLANS;
  heroStats: typeof HERO_STATS;
  images: { alaeddine: string; aziz: string };
  pages: typeof PAGES_CONTENT;
  home: typeof HOME_SECTION_CONTENT;
  legal: typeof LEGAL_CONTENT;
};

export function getDefaultSiteContent(): SiteContentBundle {
  return {
    hero: { ...HERO_CONTENT },
    about: { ...ABOUT_CONTENT },
    footer: { ...FOOTER_CONTENT },
    brand: { ...BRAND_CONTENT },
    nav: [...NAV_LINKS],
    services: [...SERVICES],
    portfolio: [...PORTFOLIO],
    reviews: [...REVIEWS],
    faq: [...FAQ_ITEMS],
    skills: [...SKILLS],
    plans: [...PLANS],
    heroStats: [...HERO_STATS],
    images: { alaeddine: ALAEDDINE_IMG, aziz: AZIZ_IMG },
    pages: Object.fromEntries(
      Object.entries(PAGES_CONTENT).map(([k, v]) => [k, { ...v }])
    ) as typeof PAGES_CONTENT,
    home: { ...HOME_SECTION_CONTENT },
    legal: { ...LEGAL_CONTENT },
  };
}
