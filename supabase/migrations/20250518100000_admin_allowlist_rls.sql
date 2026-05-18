-- Restrict admin operations to allowlisted emails
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;

-- No client access to allowlist; manage via SQL Editor:
-- INSERT INTO public.admin_allowlist (email) VALUES ('votre@email.com');

CREATE OR REPLACE FUNCTION public.is_site_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_allowlist
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

DROP POLICY IF EXISTS "Authenticated users can select contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Authenticated users can update contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Authenticated users can delete contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can select contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can update contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can delete contact requests" ON public.contact_requests;

CREATE POLICY "Admins can select contact requests"
  ON public.contact_requests
  FOR SELECT
  TO authenticated
  USING (public.is_site_admin());

CREATE POLICY "Admins can update contact requests"
  ON public.contact_requests
  FOR UPDATE
  TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins can delete contact requests"
  ON public.contact_requests
  FOR DELETE
  TO authenticated
  USING (public.is_site_admin());
