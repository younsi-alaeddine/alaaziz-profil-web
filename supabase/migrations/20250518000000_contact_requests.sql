-- Contact requests table for Alaeddine & Aziz site
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  budget TEXT,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_requests_created_at_idx ON public.contact_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_requests_status_idx ON public.contact_requests (status);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Idempotent: safe to re-run in SQL Editor
DROP POLICY IF EXISTS "Public can insert contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Authenticated users can select contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Authenticated users can update contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Authenticated users can delete contact requests" ON public.contact_requests;

-- Public can submit contact forms (anon + authenticated)
CREATE POLICY "Public can insert contact requests"
  ON public.contact_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users (admins) can read/update/delete
CREATE POLICY "Authenticated users can select contact requests"
  ON public.contact_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact requests"
  ON public.contact_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contact requests"
  ON public.contact_requests
  FOR DELETE
  TO authenticated
  USING (true);
