-- Exécuter dans Supabase SQL Editor (une fois)
-- Email admin : younsialaeddine@gmail.com

INSERT INTO public.admin_allowlist (email)
VALUES ('younsialaeddine@gmail.com')
ON CONFLICT (email) DO NOTHING;
