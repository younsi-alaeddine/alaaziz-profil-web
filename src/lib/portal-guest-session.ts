import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "portal_guest";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 jours

function getSecret(): string {
  const s =
    process.env.PORTAL_GUEST_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "dev-portal-guest-secret-change-me";
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export async function setPortalGuestSession(clientId: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = `${clientId}.${exp}`;
  const sig = sign(payload);
  const value = `${payload}.${sig}`;
  const jar = await cookies();
  jar.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearPortalGuestSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getPortalGuestClientId(): Promise<string | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const parts = raw.split(".");
  if (parts.length !== 3) return null;

  const [clientId, expStr, sig] = parts;
  const payload = `${clientId}.${expStr}`;
  const expected = sign(payload);

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  const exp = Number(expStr);
  if (!clientId || !Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return clientId;
}
