/** Comma-separated admin emails (server-only). Empty = any authenticated user (dev only). */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  const allowlist = getAdminEmails();
  if (allowlist.length === 0) return true;
  return allowlist.includes(email.toLowerCase());
}
