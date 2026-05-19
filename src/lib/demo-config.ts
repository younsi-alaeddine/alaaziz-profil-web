/**
 * Comptes et données de démonstration — créés via Admin → Paramètres.
 * L'admin démo est reconnu par isAdminUser() sans modifier ADMIN_EMAILS.
 */
export const DEMO_PASSWORD = "DemoAAZ2026!";

export const DEMO_TRACKING_CODE = "AAZ-DEMO01";

export const DEMO_ACCOUNTS = {
  admin: {
    email: "demo-admin@demo.alaeddine-aziz.dev",
    name: "Admin Démo",
    loginPath: "/admin/login",
  },
  team: {
    email: "demo-equipe@demo.alaeddine-aziz.dev",
    name: "Marie Démo",
    role: "fullstack",
    loginPath: "/equipe/login",
  },
  client: {
    email: "demo-client@demo.alaeddine-aziz.dev",
    name: "Société Démo",
    company: "Démo SARL",
    loginPath: "/portal/login",
    suiviPath: "/portal/suivi",
  },
} as const;

export const DEMO_ADMIN_EMAIL = DEMO_ACCOUNTS.admin.email;

export const DEMO_ACCOUNT_EMAILS = [
  DEMO_ACCOUNTS.admin.email,
  DEMO_ACCOUNTS.team.email,
  DEMO_ACCOUNTS.client.email,
] as const;

export function isDemoAccountEmail(email?: string | null): boolean {
  if (!email) return false;
  return DEMO_ACCOUNT_EMAILS.includes(
    email.toLowerCase() as (typeof DEMO_ACCOUNT_EMAILS)[number]
  );
}
