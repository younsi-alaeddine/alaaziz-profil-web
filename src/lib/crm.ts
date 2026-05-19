import type { InvoiceStatus, ProjectStatus, StageStatus } from "@/lib/types";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  nouvelle_demande: "Nouvelle demande",
  en_analyse: "En analyse",
  acceptee: "Acceptée",
  refusee: "Refusée",
  en_attente_paiement: "En attente paiement",
  planifiee: "Planifiée",
  en_developpement: "En développement",
  en_test: "En test",
  terminee: "Terminée",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  nouvelle_demande: "bg-slate-500/20 text-slate-300",
  en_analyse: "bg-amber-500/20 text-amber-300",
  acceptee: "bg-emerald-500/20 text-emerald-300",
  refusee: "bg-red-500/20 text-red-300",
  en_attente_paiement: "bg-orange-500/20 text-orange-300",
  planifiee: "bg-blue-500/20 text-blue-300",
  en_developpement: "bg-violet-500/20 text-violet-300",
  en_test: "bg-cyan-500/20 text-cyan-300",
  terminee: "bg-emerald-500/20 text-emerald-400",
};

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  pending: "À faire",
  in_progress: "En cours",
  completed: "Terminé",
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Brouillon",
  sent: "Envoyée",
  paid: "Payée",
  overdue: "En retard",
};

export const DOCUMENT_CATEGORIES = [
  { id: "cahier_charges", label: "Cahier des charges" },
  { id: "maquette", label: "Maquette" },
  { id: "contrat", label: "Contrat" },
  { id: "logo", label: "Logo / assets" },
  { id: "facture", label: "Facture" },
  { id: "technique", label: "Document technique" },
  { id: "autre", label: "Autre" },
] as const;

export const DEFAULT_PROJECT_STAGES = [
  { title: "Analyse", sort_order: 1 },
  { title: "Design / Maquette", sort_order: 2 },
  { title: "Développement", sort_order: 3 },
  { title: "Test", sort_order: 4 },
  { title: "Livraison", sort_order: 5 },
] as const;

export const PROJECT_SOURCES = [
  { id: "site_web", label: "Site web" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
  { id: "plateforme", label: "Plateforme privée" },
] as const;

export function computeProgressFromStages(
  stages: { status: StageStatus }[]
): number {
  if (stages.length === 0) return 0;
  const completed = stages.filter((s) => s.status === "completed").length;
  return Math.round((completed / stages.length) * 100);
}

export const TASK_STATUS_LABELS = {
  todo: "À faire",
  in_progress: "En cours",
  review: "Revue",
  done: "Terminé",
} as const;

export const TASK_PRIORITY_LABELS = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente",
} as const;

export const SOCIAL_PLATFORM_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
} as const;

export const DIGITAL_STATUS_LABELS = {
  nouveau: "Nouveau",
  qualification: "Qualification",
  en_cours: "En cours",
  en_attente_client: "Attente client",
  livre: "Livré",
  annule: "Annulé",
} as const;

export const DIGITAL_CATEGORIES = [
  { id: "web", label: "Site / App web" },
  { id: "seo", label: "SEO / Référencement" },
  { id: "social", label: "Réseaux sociaux" },
  { id: "ads", label: "Publicité digitale" },
  { id: "branding", label: "Branding / Design" },
  { id: "autre", label: "Autre" },
] as const;

export const TEAM_ROLE_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  design: "Design",
  marketing: "Marketing / Social",
  lead: "Lead projet",
};

export function formatEuro(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
