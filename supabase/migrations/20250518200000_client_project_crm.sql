-- CRM: clients, projets, étapes, documents, messages, validations, factures, notifications

CREATE TYPE public.project_status AS ENUM (
  'nouvelle_demande',
  'en_analyse',
  'acceptee',
  'refusee',
  'en_attente_paiement',
  'planifiee',
  'en_developpement',
  'en_test',
  'terminee'
);

CREATE TYPE public.stage_status AS ENUM (
  'pending',
  'in_progress',
  'completed'
);

CREATE TYPE public.validation_decision AS ENUM (
  'pending',
  'approved',
  'changes_requested'
);

CREATE TYPE public.invoice_status AS ENUM (
  'draft',
  'sent',
  'paid',
  'overdue'
);

-- Clients (liés à auth.users pour l'espace privé)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS clients_user_id_idx ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS clients_email_idx ON public.clients(email);

-- Projets
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  contact_request_id UUID REFERENCES public.contact_requests(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  service TEXT,
  status public.project_status NOT NULL DEFAULT 'nouvelle_demande',
  progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  start_date DATE,
  delivery_date DATE,
  live_url TEXT,
  live_password TEXT,
  live_expires_at TIMESTAMPTZ,
  budget TEXT,
  source TEXT DEFAULT 'site_web',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_client_id_idx ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON public.projects(status);
CREATE INDEX IF NOT EXISTS projects_delivery_date_idx ON public.projects(delivery_date);

-- Étapes du projet (calendrier + suivi)
CREATE TABLE IF NOT EXISTS public.project_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status public.stage_status NOT NULL DEFAULT 'pending',
  scheduled_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS project_stages_project_id_idx ON public.project_stages(project_id);

-- Documents
CREATE TABLE IF NOT EXISTS public.project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'autre',
  file_url TEXT,
  storage_path TEXT,
  uploaded_by TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS project_documents_project_id_idx ON public.project_documents(project_id);

-- Messages
CREATE TABLE IF NOT EXISTS public.project_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_role TEXT NOT NULL CHECK (author_role IN ('admin', 'client')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS project_messages_project_id_idx ON public.project_messages(project_id);

-- Validations client par étape
CREATE TABLE IF NOT EXISTS public.project_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES public.project_stages(id) ON DELETE CASCADE,
  decision public.validation_decision NOT NULL DEFAULT 'pending',
  client_note TEXT,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (stage_id)
);

-- Factures
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount_cents INT NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR',
  status public.invoice_status NOT NULL DEFAULT 'draft',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invoices_project_id_idx ON public.invoices(project_id);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id, read);

-- Lier demandes contact → projet optionnel
ALTER TABLE public.contact_requests
  ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

-- Helpers RLS
CREATE OR REPLACE FUNCTION public.get_my_client_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.clients WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.owns_project(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = p_project_id
      AND p.client_id = public.get_my_client_id()
  );
$$;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Idempotent policies (safe to re-run)
DROP POLICY IF EXISTS "Admins manage clients" ON public.clients;
DROP POLICY IF EXISTS "Admins manage projects" ON public.projects;
DROP POLICY IF EXISTS "Admins manage stages" ON public.project_stages;
DROP POLICY IF EXISTS "Admins manage documents" ON public.project_documents;
DROP POLICY IF EXISTS "Admins manage messages" ON public.project_messages;
DROP POLICY IF EXISTS "Admins manage validations" ON public.project_validations;
DROP POLICY IF EXISTS "Admins manage invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications;
DROP POLICY IF EXISTS "Clients read own profile" ON public.clients;
DROP POLICY IF EXISTS "Clients read own projects" ON public.projects;
DROP POLICY IF EXISTS "Clients read own stages" ON public.project_stages;
DROP POLICY IF EXISTS "Clients read own documents" ON public.project_documents;
DROP POLICY IF EXISTS "Clients read and send messages" ON public.project_messages;
DROP POLICY IF EXISTS "Clients insert messages" ON public.project_messages;
DROP POLICY IF EXISTS "Clients read and update validations" ON public.project_validations;
DROP POLICY IF EXISTS "Clients update validations" ON public.project_validations;
DROP POLICY IF EXISTS "Clients read own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;

-- Admin policies
CREATE POLICY "Admins manage clients"
  ON public.clients FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage projects"
  ON public.projects FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage stages"
  ON public.project_stages FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage documents"
  ON public.project_documents FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage messages"
  ON public.project_messages FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage validations"
  ON public.project_validations FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage invoices"
  ON public.invoices FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage notifications"
  ON public.notifications FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

-- Client policies
CREATE POLICY "Clients read own profile"
  ON public.clients FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Clients read own projects"
  ON public.projects FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

CREATE POLICY "Clients read own stages"
  ON public.project_stages FOR SELECT TO authenticated
  USING (public.owns_project(project_id));

CREATE POLICY "Clients read own documents"
  ON public.project_documents FOR SELECT TO authenticated
  USING (public.owns_project(project_id));

CREATE POLICY "Clients read and send messages"
  ON public.project_messages FOR SELECT TO authenticated
  USING (public.owns_project(project_id));

CREATE POLICY "Clients insert messages"
  ON public.project_messages FOR INSERT TO authenticated
  WITH CHECK (
    public.owns_project(project_id)
    AND author_role = 'client'
    AND author_id = auth.uid()
  );

CREATE POLICY "Clients read and update validations"
  ON public.project_validations FOR SELECT TO authenticated
  USING (public.owns_project(project_id));

CREATE POLICY "Clients update validations"
  ON public.project_validations FOR UPDATE TO authenticated
  USING (public.owns_project(project_id))
  WITH CHECK (public.owns_project(project_id));

CREATE POLICY "Clients read own invoices"
  ON public.invoices FOR SELECT TO authenticated
  USING (public.owns_project(project_id));

CREATE POLICY "Users read own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
