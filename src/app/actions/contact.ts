"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { validateContactPayload } from "@/lib/validation";

export type ContactPayload = {
  name: string;
  email: string;
  company?: string | null;
  budget?: string | null;
  service: string;
  message: string;
};

export type ContactFormInput = ContactPayload & {
  /** Honeypot — must stay empty */
  website?: string;
};

export async function submitContactRequest(input: ContactFormInput) {
  if (input.website?.trim()) {
    return { ok: false as const, error: "Requête refusée." };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false as const,
      error: "Service temporairement indisponible. Réessayez plus tard.",
    };
  }

  const validated = validateContactPayload(input);
  if (!validated.ok) {
    return { ok: false as const, error: validated.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_requests").insert(validated.data);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}
