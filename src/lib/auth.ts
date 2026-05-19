import { DEMO_ADMIN_EMAIL } from "@/lib/demo-config";

/** Comma-separated admin emails (server-only). Empty = any authenticated user (dev only). */
export function getAdminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!fromEnv.includes(DEMO_ADMIN_EMAIL.toLowerCase())) {
    return [...fromEnv, DEMO_ADMIN_EMAIL.toLowerCase()];
  }
  return fromEnv;
}

export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  const allowlist = getAdminEmails();
  if (allowlist.length === 0) return true;
  return allowlist.includes(email.toLowerCase());
}
