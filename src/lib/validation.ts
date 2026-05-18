import type { ContactPayload } from "@/app/actions/contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload(
  payload: ContactPayload
): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();
  const service = payload.service.trim();
  const message = payload.message.trim();
  const company = payload.company?.trim() || null;
  const budget = payload.budget?.trim() || null;

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: "Nom invalide (2–120 caractères)." };
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { ok: false, error: "Adresse email invalide." };
  }
  if (!service || service.length > 200) {
    return { ok: false, error: "Veuillez sélectionner un service." };
  }
  if (message.length < 10 || message.length > 5000) {
    return { ok: false, error: "Message : entre 10 et 5000 caractères." };
  }
  if (company && company.length > 200) {
    return { ok: false, error: "Nom d'entreprise trop long." };
  }

  return {
    ok: true,
    data: { name, email, company, budget, service, message },
  };
}
