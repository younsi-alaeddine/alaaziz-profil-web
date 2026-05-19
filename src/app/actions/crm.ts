"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireClient } from "@/lib/auth-server";
import {
  computeProgressFromStages,
  DEFAULT_PROJECT_STAGES,
} from "@/lib/crm";
import { notifyUser } from "@/lib/notifications";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";
import { provisionClientPortalAccess } from "@/lib/provision-client-portal";
import { ensureClientTrackingCode } from "@/app/actions/portal-tracking";
import type {
  ProjectStatus,
  StageStatus,
  ValidationDecision,
} from "@/lib/types";

async function syncProjectProgress(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  projectId: string
) {
  const { data: stages } = await supabase
    .from("project_stages")
    .select("status")
    .eq("project_id", projectId);

  if (!stages) return;
  const progress = computeProgressFromStages(stages);
  await supabase
    .from("projects")
    .update({ progress_percent: progress })
    .eq("id", projectId);
}

export async function createProjectFromContact(contactId: string) {
  const { supabase } = await requireAdmin();

  const { data: contact, error: contactError } = await supabase
    .from("contact_requests")
    .select("*")
    .eq("id", contactId)
    .single();

  if (contactError || !contact) {
    return { ok: false as const, error: "Demande introuvable." };
  }

  if (contact.project_id) {
    return { ok: false as const, error: "Un projet existe déjà pour cette demande." };
  }

  const email = contact.email.toLowerCase();

  let { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!client) {
    const { data: newClient, error: clientError } = await supabase
      .from("clients")
      .insert({
        email,
        name: contact.name,
        company: contact.company,
      })
      .select("id, user_id, email, name")
      .single();

    if (clientError || !newClient) {
      return { ok: false as const, error: clientError?.message ?? "Erreur client." };
    }
    client = newClient;
    await ensureClientTrackingCode(newClient.id);
  }

  const { data: clientRow } = await supabase
    .from("clients")
    .select("id, user_id, email, name")
    .eq("id", client.id)
    .single();

  let portalInvite: string | undefined;
  if (
    clientRow &&
    !clientRow.user_id &&
    isServiceRoleConfigured()
  ) {
    const provision = await provisionClientPortalAccess({
      clientId: clientRow.id,
      email: clientRow.email,
      name: clientRow.name,
      supabase,
    });
    if (!provision.ok) {
      portalInvite = provision.error;
    } else if (provision.mode === "invited") {
      portalInvite = "Invitation portail envoyée par e-mail.";
    }
  } else if (clientRow && !clientRow.user_id && !isServiceRoleConfigured()) {
    portalInvite =
      "Ajoutez SUPABASE_SERVICE_ROLE_KEY pour activer l'invitation automatique.";
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      client_id: client.id,
      contact_request_id: contact.id,
      title: contact.service || "Nouveau projet",
      description: contact.message,
      service: contact.service,
      budget: contact.budget,
      status: "en_analyse",
      source: "site_web",
    })
    .select("id")
    .single();

  if (projectError || !project) {
    return { ok: false as const, error: projectError?.message ?? "Erreur projet." };
  }

  const stageRows = DEFAULT_PROJECT_STAGES.map((s) => ({
    project_id: project.id,
    title: s.title,
    sort_order: s.sort_order,
    status: "pending" as StageStatus,
  }));

  const { data: insertedStages, error: stagesError } = await supabase
    .from("project_stages")
    .insert(stageRows)
    .select("id");

  if (stagesError || !insertedStages) {
    return { ok: false as const, error: stagesError?.message ?? "Erreur étapes." };
  }

  await supabase.from("project_validations").insert(
    insertedStages.map((st) => ({
      project_id: project.id,
      stage_id: st.id,
      decision: "pending" as ValidationDecision,
    }))
  );

  await supabase
    .from("contact_requests")
    .update({ status: "read", project_id: project.id })
    .eq("id", contact.id);

  revalidatePath("/admin");
  revalidatePath("/admin/demandes");
  revalidatePath("/admin/projets");
  revalidatePath("/admin/clients");
  const trackingCode = await ensureClientTrackingCode(client.id);
  return {
    ok: true as const,
    projectId: project.id,
    trackingCode: trackingCode ?? undefined,
    portalInvite,
  };
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  const { supabase } = await requireAdmin();

  const { data: project } = await supabase
    .from("projects")
    .select("*, clients(user_id, email, name)")
    .eq("id", projectId)
    .single();

  const { error } = await supabase.from("projects").update({ status }).eq("id", projectId);

  if (error) return { ok: false as const, error: error.message };

  const clientUserId = (project?.clients as { user_id?: string })?.user_id;
  if (clientUserId) {
    await notifyUser(supabase, {
      userId: clientUserId,
      projectId,
      title: "Mise à jour du projet",
      body: `Le statut de votre projet est maintenant : ${status.replace(/_/g, " ")}.`,
    });
  }

  revalidatePath(`/admin/projets/${projectId}`);
  revalidatePath(`/portal/projets/${projectId}`);
  revalidatePath("/portal");
  return { ok: true as const };
}

export async function updateProjectDetails(
  projectId: string,
  data: {
    title?: string;
    start_date?: string | null;
    delivery_date?: string | null;
    live_url?: string | null;
    live_password?: string | null;
    description?: string | null;
  }
) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("projects").update(data).eq("id", projectId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/admin/projets/${projectId}`);
  revalidatePath(`/portal/projets/${projectId}`);
  return { ok: true as const };
}

export async function updateStageStatus(
  stageId: string,
  projectId: string,
  status: StageStatus
) {
  const { supabase } = await requireAdmin();

  const updates: Record<string, unknown> = { status };
  if (status === "completed") {
    updates.completed_at = new Date().toISOString();
  } else {
    updates.completed_at = null;
  }

  const { error } = await supabase
    .from("project_stages")
    .update(updates)
    .eq("id", stageId);

  if (error) return { ok: false as const, error: error.message };

  await syncProjectProgress(supabase, projectId);

  const { data: project } = await supabase
    .from("projects")
    .select("clients(user_id)")
    .eq("id", projectId)
    .single();

  const clientUserId = (project?.clients as { user_id?: string })?.user_id;
  if (clientUserId && status === "completed") {
    await notifyUser(supabase, {
      userId: clientUserId,
      projectId,
      title: "Étape terminée",
      body: "Une étape de votre projet vient d'être marquée comme terminée.",
    });
  }

  revalidatePath(`/admin/projets/${projectId}`);
  revalidatePath(`/portal/projets/${projectId}`);
  return { ok: true as const };
}

export async function updateStageSchedule(
  stageId: string,
  projectId: string,
  scheduled_date: string | null
) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("project_stages")
    .update({ scheduled_date })
    .eq("id", stageId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/admin/projets/${projectId}`);
  revalidatePath(`/portal/projets/${projectId}`);
  return { ok: true as const };
}

export async function inviteClientToPortal(clientId: string) {
  const { supabase } = await requireAdmin();

  if (!isServiceRoleConfigured()) {
    return {
      ok: false as const,
      error:
        "Clé service_role manquante. Supabase → Settings → API → service_role → SUPABASE_SERVICE_ROLE_KEY dans .env.local",
    };
  }

  const { data: client, error: fetchError } = await supabase
    .from("clients")
    .select("id, email, name, user_id")
    .eq("id", clientId)
    .single();

  if (fetchError || !client) {
    return { ok: false as const, error: "Client introuvable." };
  }

  if (client.user_id) {
    return { ok: true as const, mode: "already_linked" as const };
  }

  const result = await provisionClientPortalAccess({
    clientId: client.id,
    email: client.email,
    name: client.name,
    supabase,
  });

  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }

  revalidatePath("/admin/clients");
  return { ok: true as const, mode: result.mode };
}

/** @deprecated Préférez inviteClientToPortal — conservé pour lien manuel UUID */
export async function linkClientToUser(clientId: string, userId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("clients")
    .update({ user_id: userId })
    .eq("id", clientId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/clients");
  return { ok: true as const };
}

export async function addProjectMessage(projectId: string, body: string, asAdmin: boolean) {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false as const, error: "Message vide." };

  if (asAdmin) {
    const { supabase, user } = await requireAdmin();
    const { error } = await supabase.from("project_messages").insert({
      project_id: projectId,
      author_id: user.id,
      author_role: "admin",
      body: trimmed,
    });
    if (error) return { ok: false as const, error: error.message };

    const { data: project } = await supabase
      .from("projects")
      .select("clients(user_id)")
      .eq("id", projectId)
      .single();
    const clientUserId = (project?.clients as { user_id?: string })?.user_id;
    if (clientUserId) {
      await notifyUser(supabase, {
        userId: clientUserId,
        projectId,
        title: "Nouveau message",
        body: trimmed.slice(0, 120),
      });
    }
  } else {
    const { supabase, user } = await requireClient();
    const { error } = await supabase.from("project_messages").insert({
      project_id: projectId,
      author_id: user.id,
      author_role: "client",
      body: trimmed,
    });
    if (error) return { ok: false as const, error: error.message };
  }

  revalidatePath(`/admin/projets/${projectId}`);
  revalidatePath(`/portal/projets/${projectId}`);
  return { ok: true as const };
}

export async function submitStageValidation(
  validationId: string,
  projectId: string,
  decision: "approved" | "changes_requested",
  clientNote?: string
) {
  const { supabase } = await requireClient();

  const { error } = await supabase
    .from("project_validations")
    .update({
      decision,
      client_note: clientNote?.trim() || null,
      decided_at: new Date().toISOString(),
    })
    .eq("id", validationId);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath(`/portal/projets/${projectId}`);
  revalidatePath(`/admin/projets/${projectId}`);
  return { ok: true as const };
}

export async function addProjectDocument(
  projectId: string,
  data: { title: string; category: string; file_url?: string }
) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("project_documents").insert({
    project_id: projectId,
    title: data.title,
    category: data.category,
    file_url: data.file_url ?? null,
    uploaded_by: "admin",
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/admin/projets/${projectId}`);
  revalidatePath(`/portal/projets/${projectId}`);
  return { ok: true as const };
}

export async function addInvoice(
  projectId: string,
  data: { label: string; amount_cents: number; due_date?: string }
) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("invoices").insert({
    project_id: projectId,
    label: data.label,
    amount_cents: data.amount_cents,
    due_date: data.due_date ?? null,
    status: "sent",
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/admin/projets/${projectId}`);
  revalidatePath(`/portal/projets/${projectId}`);
  return { ok: true as const };
}

export async function markNotificationRead(notificationId: string) {
  const { supabase, user } = await requireClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/portal");
  return { ok: true as const };
}
