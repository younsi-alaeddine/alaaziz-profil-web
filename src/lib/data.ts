export const NAV_LINKS = [
  { href: "/about", label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/skills", label: "Compétences" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const SERVICES = [
  {
    icon: "globe",
    color: "violet",
    title: "Création de Sites Web",
    desc: "Sites vitrines, e-commerce, portfolios avec React, Next.js, Vue.js.",
    tags: ["React", "Next.js", "Tailwind"],
  },
  {
    icon: "building-2",
    color: "blue",
    title: "Pages Entreprise",
    desc: "Landing pages convertissantes et sites corporate pour votre marque.",
    tags: ["SEO", "UX/UI", "Analytics"],
  },
  {
    icon: "rocket",
    color: "emerald",
    title: "Croissance de Projet",
    desc: "Stratégie digitale, SEO avancé et analytics pour votre croissance.",
    tags: ["Growth", "SEO", "CRO"],
  },
  {
    icon: "cloud-cog",
    color: "pink",
    title: "Applications SaaS",
    desc: "Plateformes SaaS complètes avec auth, paiement et infrastructure scalable.",
    tags: ["Stripe", "Auth", "Multi-tenant"],
  },
  {
    icon: "smartphone",
    color: "amber",
    title: "Apps Mobile & PWA",
    desc: "Applications cross-platform et Progressive Web Apps.",
    tags: ["React Native", "Flutter", "PWA"],
  },
  {
    icon: "server",
    color: "cyan",
    title: "API & Backend",
    desc: "Architectures backend robustes avec Node.js, Python, APIs REST/GraphQL.",
    tags: ["Node.js", "Python", "GraphQL"],
  },
] as const;

export const PORTFOLIO = [
  {
    image: "https://picsum.photos/seed/saas-d6/800/450.jpg",
    tags: [
      { label: "SaaS", color: "violet" },
      { label: "Full-Stack", color: "blue" },
    ],
    title: "FinTrack — SaaS Financière",
    desc: "Dashboard, Stripe, multi-tenant, rapports temps réel.",
  },
  {
    image: "https://picsum.photos/seed/ecom-d6/800/450.jpg",
    tags: [{ label: "E-Commerce", color: "emerald" }],
    title: "MaisonLuxe — Premium",
    desc: "Boutique haut de gamme, paiement sécurisé.",
  },
  {
    image: "https://picsum.photos/seed/corp-d6/800/450.jpg",
    tags: [{ label: "Corporate", color: "pink" }],
    title: "TechCorp — B2B & Leads",
    desc: "Site B2B, blog SEO, espace client.",
  },
  {
    image: "https://picsum.photos/seed/fit-d6/800/450.jpg",
    tags: [{ label: "Mobile", color: "amber" }],
    title: "FitPulse — Fitness App",
    desc: "App cross-platform, GPS, wearables.",
  },
] as const;

export const REVIEWS = [
  {
    text: "Alaeddine et Aziz ont transformé notre vision en plateforme SaaS en temps record. Une équipe complémentaire et redoutable.",
    name: "Marie Laurent",
    role: "CEO, TechStart",
    avatar: "https://picsum.photos/seed/r1/48/48.jpg",
  },
  {
    text: "Leur synergie est impressionnante. Alaeddine sur le frontend, Aziz sur le backend — le résultat est fluide et performant.",
    name: "Ahmed Benali",
    role: "Fondateur, MaisonLuxe",
    avatar: "https://picsum.photos/seed/r2/48/48.jpg",
  },
  {
    text: "Deux développeurs avec les mêmes techs mais des spécialisations complémentaires. Parfait pour notre SaaS.",
    name: "Sophie Martin",
    role: "COO, DataFlow",
    avatar: "https://picsum.photos/seed/r3/48/48.jpg",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "Pourquoi travailler avec deux développeurs ?",
    a: "Nous sommes complémentaires : Alaeddine excelle en frontend et UX, Aziz en backend et architecture cloud. Ensemble, nous livrons plus vite et avec une qualité supérieure, sans les goulots d'étranglement d'un développeur seul.",
  },
  {
    q: "Maîtrisez-vous les mêmes technologies ?",
    a: "Oui ! Nous partageons le même stack : React, Next.js, Node.js, Python, TypeScript, SQL/NoSQL et DevOps. Cela nous permet de collaborer de manière fluide sur n'importe quelle partie du projet.",
  },
  {
    q: "Combien de temps prend un projet ?",
    a: "Site vitrine : 1-2 semaines. Site complet avec backend : 3-6 semaines. Application SaaS : 2-4 mois. Étant deux, nous livrons généralement 40% plus vite qu'un solo.",
  },
  {
    q: "Proposez-vous un suivi après livraison ?",
    a: "Absolument. Tous nos plans incluent un support post-lancement. Les plans Premium et Enterprise incluent une maintenance continue et l'évolution de votre produit.",
  },
  {
    q: "Travaillez-vous à distance ?",
    a: "Oui, nous travaillons à 100% à distance avec Slack, Notion, Figma et Git. Nous communiquons en FR, AR ou EN selon votre préférence.",
  },
] as const;

export const ALAEDDINE_IMG =
  "https://z-cdn-media.chatglm.cn/files/395e086e-4756-49ea-8377-185519207025.png?auth_key=1879100000-94c8a48d5c9c46d39bfff403b31f9c46-0-3bdf00c5d85072f2dcd3da6a67acf5ac";
export const AZIZ_IMG = "https://picsum.photos/seed/aziz-dev/400/480.jpg";

export const HERO_STATS = [
  { value: "50+", label: "Projets livrés" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "2x", label: "Plus rapide à deux" },
] as const;

export const SKILLS = [
  { name: "React / Next.js", level: 95 },
  { name: "TypeScript", level: 92 },
  { name: "Node.js / APIs", level: 90 },
  { name: "Python / Backend", level: 88 },
  { name: "UI/UX & Tailwind", level: 93 },
  { name: "DevOps & Cloud", level: 85 },
] as const;

export const PLANS = [
  {
    name: "Starter",
    price: "1 500 €",
    desc: "Site vitrine professionnel",
    features: ["5 pages", "Design responsive", "SEO de base", "1 mois de support"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "4 500 €",
    desc: "Site complet + backend",
    features: ["Jusqu'à 15 pages", "CMS / API", "Analytics", "3 mois de support"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    desc: "SaaS & applications sur mesure",
    features: ["Architecture scalable", "Auth & paiements", "DevOps", "Maintenance continue"],
    highlight: false,
  },
] as const;
