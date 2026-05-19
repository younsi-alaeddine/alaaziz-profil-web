-- CRM étendu : code suivi client, équipe, tâches, social, demandes digitales multiniveau

-- Code suivi « Suivi Express » (email + code, sans mot de passe)
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS tracking_code TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS clients_tracking_code_idx ON public.clients(tracking_code);

-- Équipe interne
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'developer',
  email TEXT,
  avatar_color TEXT DEFAULT 'violet',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tâches par projet + assignation équipe
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status public.task_status NOT NULL DEFAULT 'todo',
  priority public.task_priority NOT NULL DEFAULT 'medium',
  due_date DATE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS project_tasks_project_id_idx ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS project_tasks_assignee_id_idx ON public.project_tasks(assignee_id);

DROP TRIGGER IF EXISTS project_tasks_updated_at ON public.project_tasks;
CREATE TRIGGER project_tasks_updated_at
  BEFORE UPDATE ON public.project_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Comptes réseaux sociaux (Facebook, Instagram, etc.)
CREATE TYPE public.social_platform AS ENUM ('facebook', 'instagram', 'linkedin', 'tiktok');

CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  platform public.social_platform NOT NULL,
  account_name TEXT NOT NULL,
  profile_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS social_accounts_project_id_idx ON public.social_accounts(project_id);

-- Demandes de contenu / gestion social
CREATE TYPE public.social_request_status AS ENUM (
  'brief',
  'creation',
  'validation',
  'planifie',
  'publie',
  'annule'
);

CREATE TABLE IF NOT EXISTS public.social_content_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'post',
  status public.social_request_status NOT NULL DEFAULT 'brief',
  scheduled_for TIMESTAMPTZ,
  brief TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Demandes digitales multiniveau (parent → enfants)
CREATE TYPE public.digital_request_status AS ENUM (
  'nouveau',
  'qualification',
  'en_cours',
  'en_attente_client',
  'livre',
  'annule'
);

CREATE TABLE IF NOT EXISTS public.digital_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.digital_requests(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  contact_request_id UUID REFERENCES public.contact_requests(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'web',
  level INT NOT NULL DEFAULT 0 CHECK (level >= 0 AND level <= 3),
  status public.digital_request_status NOT NULL DEFAULT 'nouveau',
  priority public.task_priority NOT NULL DEFAULT 'medium',
  assignee_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  description TEXT,
  budget TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS digital_requests_parent_id_idx ON public.digital_requests(parent_id);
CREATE INDEX IF NOT EXISTS digital_requests_project_id_idx ON public.digital_requests(project_id);

DROP TRIGGER IF EXISTS digital_requests_updated_at ON public.digital_requests;
CREATE TRIGGER digital_requests_updated_at
  BEFORE UPDATE ON public.digital_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_content_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admins manage project_tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Admins manage social_accounts" ON public.social_accounts;
DROP POLICY IF EXISTS "Admins manage social_content_requests" ON public.social_content_requests;
DROP POLICY IF EXISTS "Admins manage digital_requests" ON public.digital_requests;
DROP POLICY IF EXISTS "Clients read own tasks" ON public.project_tasks;

CREATE POLICY "Admins manage team_members"
  ON public.team_members FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage project_tasks"
  ON public.project_tasks FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage social_accounts"
  ON public.social_accounts FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage social_content_requests"
  ON public.social_content_requests FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage digital_requests"
  ON public.digital_requests FOR ALL TO authenticated
  USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

CREATE POLICY "Clients read own tasks"
  ON public.project_tasks FOR SELECT TO authenticated
  USING (public.owns_project(project_id));

-- Équipe par défaut (Alaeddine & Aziz)
INSERT INTO public.team_members (name, role, email, avatar_color)
SELECT 'Alaeddine', 'frontend', NULL, 'violet'
WHERE NOT EXISTS (SELECT 1 FROM public.team_members WHERE name = 'Alaeddine');

INSERT INTO public.team_members (name, role, email, avatar_color)
SELECT 'Aziz', 'backend', NULL, 'blue'
WHERE NOT EXISTS (SELECT 1 FROM public.team_members WHERE name = 'Aziz');
