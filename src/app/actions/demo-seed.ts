"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";
import { DEMO_ACCOUNTS, DEMO_TRACKING_CODE } from "@/lib/demo-config";
import {
  deleteAuthUsersByEmails,
  upsertDemoAuthUser,
} from "@/lib/demo-auth";

export type DemoEnvironmentStatus = {
  installed: boolean;
  hasServiceRole: boolean;
};

export async function getDemoEnvironmentStatus(): Promise<DemoEnvironmentStatus> {
  const { supabase } = await requireAdmin();
  const { count } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("is_demo", true);

  return {
    installed: (count ?? 0) > 0,
    hasServiceRole: isServiceRoleConfigured(),
  };
}

export async function seedDemoEnvironment() {
  const { supabase } = await requireAdmin();

  if (!isServiceRoleConfigured()) {
    return {
      ok: false as const,
      error: "SUPABASE_SERVICE_ROLE_KEY requise pour créer les comptes démo.",
    };
  }

  const { count } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("is_demo", true);

  if ((count ?? 0) > 0) {
    return {
      ok: false as const,
      error: "L'environnement démo existe déjà. Supprimez-le avant de le recréer.",
    };
  }

  try {
    const adminAuth = createAdminClient();

    const adminUserId = await upsertDemoAuthUser({
      email: DEMO_ACCOUNTS.admin.email,
      name: DEMO_ACCOUNTS.admin.name,
      role: "admin",
    });

    await adminAuth.from("admin_allowlist").upsert(
      { email: DEMO_ACCOUNTS.admin.email, is_demo: true },
      { onConflict: "email" }
    );

    const teamUserId = await upsertDemoAuthUser({
      email: DEMO_ACCOUNTS.team.email,
      name: DEMO_ACCOUNTS.team.name,
      role: "team",
    });

    const { data: teamMember, error: teamError } = await supabase
      .from("team_members")
      .insert({
        name: DEMO_ACCOUNTS.team.name,
        role: DEMO_ACCOUNTS.team.role,
        email: DEMO_ACCOUNTS.team.email,
        avatar_color: "emerald",
        active: true,
        user_id: teamUserId,
        is_demo: true,
      })
      .select("id")
      .single();

    if (teamError || !teamMember) {
      throw new Error(teamError?.message ?? "Échec création membre équipe démo.");
    }

    const clientUserId = await upsertDemoAuthUser({
      email: DEMO_ACCOUNTS.client.email,
      name: DEMO_ACCOUNTS.client.name,
      role: "client",
    });

    const { data: contact, error: contactError } = await supabase
      .from("contact_requests")
      .insert({
        name: "Jean Dupont",
        email: "prospect@demo.local",
        company: "Prospect Démo",
        budget: "5 000 – 10 000 €",
        service: "Site vitrine",
        message:
          "Demande démo : refonte site vitrine + SEO. Souhaite un devis sous 48 h.",
        status: "new",
        is_demo: true,
      })
      .select("id")
      .single();

    if (contactError || !contact) {
      throw new Error(contactError?.message ?? "Échec demande contact démo.");
    }

    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert({
        email: DEMO_ACCOUNTS.client.email,
        name: DEMO_ACCOUNTS.client.name,
        company: DEMO_ACCOUNTS.client.company,
        phone: "+33 6 00 00 00 01",
        user_id: clientUserId,
        tracking_code: DEMO_TRACKING_CODE,
        is_demo: true,
      })
      .select("id")
      .single();

    if (clientError || !client) {
      throw new Error(clientError?.message ?? "Échec client démo.");
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        client_id: client.id,
        contact_request_id: contact.id,
        title: "Site vitrine — Démo",
        description:
          "Projet de démonstration : maquettes validées, développement en cours, livraison prévue fin du mois.",
        service: "Développement web",
        status: "en_developpement",
        progress_percent: 55,
        start_date: new Date().toISOString().slice(0, 10),
        delivery_date: new Date(Date.now() + 30 * 86400000)
          .toISOString()
          .slice(0, 10),
        live_url: "https://demo.alaeddine-aziz.dev",
        budget: "8 500 €",
        source: "demo",
      })
      .select("id")
      .single();

    if (projectError || !project) {
      throw new Error(projectError?.message ?? "Échec projet démo.");
    }

    await supabase
      .from("contact_requests")
      .update({ project_id: project.id })
      .eq("id", contact.id);

    const stages = [
      { title: "Cadrage & wireframes", sort_order: 0, status: "completed" as const },
      { title: "Design UI", sort_order: 1, status: "completed" as const },
      { title: "Développement", sort_order: 2, status: "in_progress" as const },
      { title: "Recette & mise en ligne", sort_order: 3, status: "pending" as const },
    ];

    for (const s of stages) {
      await supabase.from("project_stages").insert({
        project_id: project.id,
        title: s.title,
        sort_order: s.sort_order,
        status: s.status,
        scheduled_date: new Date(Date.now() + s.sort_order * 7 * 86400000)
          .toISOString()
          .slice(0, 10),
        completed_at:
          s.status === "completed" ? new Date().toISOString() : null,
      });
    }

    const { data: stagesRows } = await supabase
      .from("project_stages")
      .select("id, sort_order")
      .eq("project_id", project.id)
      .order("sort_order");

    const stageForValidation = stagesRows?.find((s) => s.sort_order === 1);
    if (stageForValidation) {
      await supabase.from("project_validations").insert({
        project_id: project.id,
        stage_id: stageForValidation.id,
        decision: "approved",
        client_note: "Design validé — merci !",
        decided_at: new Date().toISOString(),
      });
    }

    await supabase.from("project_messages").insert([
      {
        project_id: project.id,
        author_role: "admin",
        body: "Bienvenue sur votre espace projet démo. N'hésitez pas à nous écrire ici.",
      },
      {
        project_id: project.id,
        author_role: "client",
        body: "Parfait, j'ai consulté les maquettes. On valide la direction artistique.",
      },
    ]);

    await supabase.from("project_documents").insert({
      project_id: project.id,
      title: "Cahier des charges — Démo.pdf",
      category: "spec",
      file_url: "#",
      uploaded_by: "admin",
    });

    await supabase.from("invoices").insert({
      project_id: project.id,
      label: "Acompte 40 % — Démo",
      amount_cents: 340000,
      currency: "EUR",
      status: "sent",
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    });

    await supabase.from("project_tasks").insert([
      {
        project_id: project.id,
        assignee_id: teamMember.id,
        title: "Intégration page d'accueil",
        description: "Hero, services, témoignages",
        status: "in_progress",
        priority: "high",
        sort_order: 0,
      },
      {
        project_id: project.id,
        assignee_id: teamMember.id,
        title: "Formulaire contact + CRM",
        status: "todo",
        priority: "medium",
        sort_order: 1,
      },
    ]);

    const { data: socialAccount } = await supabase
      .from("social_accounts")
      .insert({
        project_id: project.id,
        client_id: client.id,
        platform: "instagram",
        account_name: "@demo_societe",
        profile_url: "https://instagram.com/demo",
        status: "active",
        notes: "Compte démo",
      })
      .select("id")
      .single();

    if (socialAccount) {
      await supabase.from("social_content_requests").insert({
        project_id: project.id,
        social_account_id: socialAccount.id,
        assignee_id: teamMember.id,
        title: "Post lancement — Démo",
        content_type: "carousel",
        status: "creation",
        brief: "3 visuels + légende FR/EN",
      });
    }

    const { data: parentDigital } = await supabase
      .from("digital_requests")
      .insert({
        project_id: project.id,
        client_id: client.id,
        contact_request_id: contact.id,
        title: "Pack digital complet — Démo",
        category: "web",
        level: 0,
        status: "en_cours",
        priority: "high",
        assignee_id: teamMember.id,
        description: "Site + SEO + social",
        budget: "12 000 €",
        is_demo: true,
      })
      .select("id")
      .single();

    if (parentDigital) {
      await supabase.from("digital_requests").insert({
        parent_id: parentDigital.id,
        project_id: project.id,
        client_id: client.id,
        title: "Landing page conversion",
        category: "landing",
        level: 1,
        status: "qualification",
        priority: "medium",
        assignee_id: teamMember.id,
        is_demo: true,
      });
    }

    await supabase.from("notifications").insert({
      user_id: clientUserId,
      project_id: project.id,
      title: "Nouvelle étape disponible",
      body: "Le design UI est prêt pour validation (démo).",
    });

    void adminUserId;

    revalidatePath("/admin");
    revalidatePath("/admin/parametres");
    revalidatePath("/admin/clients");
    revalidatePath("/admin/projets");
    revalidatePath("/admin/equipe");
    revalidatePath("/admin/digital");

    return { ok: true as const };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Erreur lors de la création démo.",
    };
  }
}

export async function purgeDemoEnvironment() {
  const { supabase } = await requireAdmin();

  if (!isServiceRoleConfigured()) {
    return {
      ok: false as const,
      error: "SUPABASE_SERVICE_ROLE_KEY requise pour supprimer les comptes démo.",
    };
  }

  try {
    const admin = createAdminClient();

    const { data: demoClients } = await supabase
      .from("clients")
      .select("id, user_id")
      .eq("is_demo", true);

    const { data: demoTeam } = await supabase
      .from("team_members")
      .select("id")
      .eq("is_demo", true);

    const clientIds = (demoClients ?? []).map((c) => c.id);
    const teamIds = (demoTeam ?? []).map((t) => t.id);
    await admin.from("digital_requests").delete().eq("is_demo", true);

    await supabase.from("contact_requests").delete().eq("is_demo", true);

    if (clientIds.length) {
      await supabase.from("clients").delete().in("id", clientIds);
    }

    if (teamIds.length) {
      await supabase.from("team_members").delete().in("id", teamIds);
    }

    await supabase.from("admin_allowlist").delete().eq("is_demo", true);

    await deleteAuthUsersByEmails([
      DEMO_ACCOUNTS.admin.email,
      DEMO_ACCOUNTS.team.email,
      DEMO_ACCOUNTS.client.email,
    ]);

    revalidatePath("/admin");
    revalidatePath("/admin/parametres");

    return { ok: true as const };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Erreur lors de la suppression démo.",
    };
  }
}
