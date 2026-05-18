import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

function portalRedirectUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${base}/auth/callback?next=/portal`;
}

async function findAuthUserIdByEmail(
  admin: SupabaseClient,
  email: string
): Promise<string | null> {
  const normalized = email.toLowerCase();
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const match = data.users.find((u) => u.email?.toLowerCase() === normalized);
    if (match) return match.id;

    if (data.users.length < perPage) break;
    page += 1;
  }

  return null;
}

export type ProvisionResult =
  | { ok: true; userId: string; mode: "linked_existing" | "invited" | "created" }
  | { ok: false; error: string };

/**
 * Crée ou retrouve un utilisateur Auth pour l'email du client et lie clients.user_id.
 */
export async function provisionClientPortalAccess(params: {
  clientId: string;
  email: string;
  name: string;
  /** Client Supabase avec droits admin (RLS) pour mettre à jour la table clients */
  supabase: SupabaseClient;
}): Promise<ProvisionResult> {
  const email = params.email.trim().toLowerCase();
  if (!email) {
    return { ok: false, error: "Email client invalide." };
  }

  const admin = createAdminClient();
  let userId = await findAuthUserIdByEmail(admin, email);
  let mode: "linked_existing" | "invited" | "created" = "linked_existing";

  if (!userId) {
    const redirectTo = portalRedirectUrl();

    const { data: invited, error: inviteError } =
      await admin.auth.admin.inviteUserByEmail(email, {
        data: { full_name: params.name, role: "client" },
        redirectTo,
      });

    if (!inviteError && invited.user) {
      userId = invited.user.id;
      mode = "invited";
    } else {
      const msg = inviteError?.message ?? "";
      const alreadyExists =
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("registered") ||
        inviteError?.status === 422;

      if (alreadyExists) {
        userId = await findAuthUserIdByEmail(admin, email);
        if (userId) {
          mode = "linked_existing";
        }
      }

      if (!userId) {
        const { data: created, error: createError } =
          await admin.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: { full_name: params.name, role: "client" },
          });

        if (createError || !created.user) {
          return {
            ok: false,
            error:
              createError?.message ??
              inviteError?.message ??
              "Impossible de créer le compte client.",
          };
        }
        userId = created.user.id;
        mode = "created";
      }
    }
  }

  const { error: linkError } = await params.supabase
    .from("clients")
    .update({ user_id: userId })
    .eq("id", params.clientId);

  if (linkError) {
    return { ok: false, error: linkError.message };
  }

  return { ok: true, userId, mode };
}
