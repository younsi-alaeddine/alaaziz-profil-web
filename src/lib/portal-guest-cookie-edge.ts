/** Vérification légère du cookie invité (compatible Edge / middleware). La signature complète est validée côté serveur. */
export const PORTAL_GUEST_COOKIE = "portal_guest";

export function hasPortalGuestCookie(raw: string | undefined): boolean {
  if (!raw) return false;
  const parts = raw.split(".");
  if (parts.length !== 3) return false;
  const exp = Number(parts[1]);
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000);
}
