import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_PASSWORD } from "@/lib/demo-config";

export async function findAuthUserIdByEmail(
  email: string
): Promise<string | null> {
  const admin = createAdminClient();
  const normalized = email.trim().toLowerCase();
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

export async function upsertDemoAuthUser(params: {
  email: string;
  name: string;
  role: "admin" | "team" | "client";
}): Promise<string> {
  const admin = createAdminClient();
  const email = params.email.trim().toLowerCase();
  const existingId = await findAuthUserIdByEmail(email);

  if (existingId) {
    const userId = existingId;
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: params.name,
        role: params.role,
        is_demo: true,
      },
    });
    if (error) throw error;
    return existingId;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: params.name,
      role: params.role,
      is_demo: true,
    },
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Impossible de créer l'utilisateur démo.");
  }

  return data.user.id;
}

export async function deleteAuthUsersByEmails(emails: string[]): Promise<void> {
  const admin = createAdminClient();
  for (const email of emails) {
    const userId = await findAuthUserIdByEmail(email);
    if (!userId) continue;
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) throw error;
  }
}
