import { randomInt } from "crypto";

const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Code lisible type AAZ-X7K2M9 — pour Suivi Express */
export function generateTrackingCode(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += CHARSET[randomInt(0, CHARSET.length)];
  }
  return `AAZ-${suffix}`;
}
