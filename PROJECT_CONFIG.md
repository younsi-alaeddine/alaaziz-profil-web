# Configuration complète du projet

> **Dépôt :** https://github.com/younsi-alaeddine/alaaziz-profil-web  
> **Propriétaire / admin :** younsialaeddine@gmail.com  
> **Supabase project :** `acvtdelyqjtkqbzhtqgi`

## URLs

| Service | URL |
|---------|-----|
| Site local | http://localhost:3000 |
| Admin | http://localhost:3000/admin/login |
| Portail client | http://localhost:3000/portal/login |
| Supabase Dashboard | https://supabase.com/dashboard/project/acvtdelyqjtkqbzhtqgi |
| Supabase API | https://acvtdelyqjtkqbzhtqgi.supabase.co |
| Auth callback | http://localhost:3000/auth/callback |

## Variables d'environnement

Fichiers : **`.env.local`** (actif en dev) et **`.env`** (copie pour déploiement).

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL API Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clé publishable (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service_role (invitations portail — serveur) |
| `ADMIN_EMAILS` | Emails admin autorisés |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site |

## Base de données Supabase

1. Exécuter **`supabase/full_schema.sql`** (schéma complet)
2. Exécuter **`supabase/seed_admin.sql`** (admin allowlist)

```sql
INSERT INTO public.admin_allowlist (email)
VALUES ('younsialaeddine@gmail.com')
ON CONFLICT (email) DO NOTHING;
```

## Compte admin

1. Supabase → **Authentication → Users** → créer `younsialaeddine@gmail.com` + mot de passe
2. Connexion : `/admin/login`

## Stack technique

- Next.js 15.3.3, React 19, Tailwind CSS 4
- Supabase (Auth, Postgres, RLS)
- CRM : clients, projets, étapes, documents, factures, messages, notifications
- CMS : `site_content` éditable depuis `/admin/contenu`

## Commandes

```bash
npm install
npm run dev      # développement
npm run build && npm run start   # production
```

## Structure des migrations

| Fichier | Rôle |
|---------|------|
| `20250518000000_contact_requests.sql` | Formulaire contact |
| `20250518100000_admin_allowlist_rls.sql` | Admin allowlist + RLS |
| `20250518200000_client_project_crm.sql` | CRM complet |
| `20250518300000_site_cms.sql` | CMS site |
| `full_schema.sql` | Tout en un |
