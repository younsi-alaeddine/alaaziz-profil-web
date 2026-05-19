import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

function teamRedirectUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${base}/auth/callback?next=/equipe`;
}

async function findAuthUserIdByEmail(
  admin: ReturnType<typeof createAdminClient>,
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

export type TeamProvisionResult =
  | { ok: true; userId: string; mode: "linked_existing" | "invited" | "created" }
  | { ok: false; error: string };

export async function provisionTeamPortalAccess(params: {
  memberId: string;
  email: string;
  name: string;
  supabase: SupabaseClient;
}): Promise<TeamProvisionResult> {
  const email = params.email.trim().toLowerCase();
  if (!email) {
    return { ok: false, error: "Email requis pour l'accès équipe." };
  }

  const admin = createAdminClient();
  let userId = await findAuthUserIdByEmail(admin, email);
  let mode: "linked_existing" | "invited" | "created" = "linked_existing";

  if (!userId) {
    const redirectTo = teamRedirectUrl();
    const { data: invited, error: inviteError } =
      await admin.auth.admin.inviteUserByEmail(email, {
        data: { full_name: params.name, role: "team" },
        redirectTo,
      });

    if (!inviteError && invited.user) {
      userId = invited.user.id;
      mode = "invited";
    } else {
      userId = await findAuthUserIdByEmail(admin, email);
      if (!userId) {
        const { data: created, error: createError } =
          await admin.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: { full_name: params.name, role: "team" },
          });
        if (createError || !created.user) {
          return {
            ok: false,
            error:
              createError?.message ??
              inviteError?.message ??
              "Impossible de créer le compte équipe.",
          };
        }
        userId = created.user.id;
        mode = "created";
      }
    }
  }

  const { error: linkError } = await params.supabase
    .from("team_members")
    .update({ user_id: userId, email })
    .eq("id", params.memberId);

  if (linkError) {
    return { ok: false, error: linkError.message };
  }

  return { ok: true, userId, mode };
}
