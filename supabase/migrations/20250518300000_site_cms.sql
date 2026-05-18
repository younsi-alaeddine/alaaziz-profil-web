-- CMS: contenu du site modifiable depuis l'admin

CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site content" ON public.site_content;
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;

-- Lecture publique (anon) pour le site marketing
CREATE POLICY "Public read site content"
  ON public.site_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage site content"
  ON public.site_content FOR ALL
  TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());
