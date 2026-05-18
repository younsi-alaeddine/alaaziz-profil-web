# Alaeddine & Aziz — Site portfolio & CRM

Site **Next.js 15** : vitrine moderne, **CMS admin**, **CRM projets/clients**, **espace client** (`/portal`).

**Dépôt :** https://github.com/younsi-alaeddine/alaaziz-profil-web

## Fonctionnalités

| Zone | URL | Description |
|------|-----|-------------|
| Site public | `/` | Pages marketing (services, portfolio, tarifs, FAQ, contact) |
| Admin | `/admin/login` | Dashboard, demandes, projets, clients, calendrier |
| Contenu | `/admin/contenu` | Textes, services, portfolio, FAQ, pages légales (CMS) |
| Paramètres | `/admin/parametres` | Marque, GitHub, LinkedIn, email |
| Portail client | `/portal/login` | Suivi projet, validations, documents, factures, messages |

## Prérequis

- Node.js 20+
- Projet [Supabase](https://supabase.com)

## Installation rapide

```bash
git clone git@github.com:younsi-alaeddine/alaaziz-profil-web.git
cd alaaziz-profil-web
npm install
cp .env.local.example .env.local
# Éditez .env.local avec vos clés Supabase
npm run dev
```

Site : http://localhost:3000

## Supabase — base de données (complet)

### Option A — tout en une fois (recommandé)

1. Supabase → **SQL Editor** → New query  
2. Coller et exécuter : **`supabase/full_schema.sql`**  
3. Puis :

```sql
INSERT INTO public.admin_allowlist (email) VALUES ('votre@email.com');
```

### Option B — migrations une par une

Dans l’ordre, dans `supabase/migrations/` :

1. `20250518000000_contact_requests.sql`
2. `20250518100000_admin_allowlist_rls.sql`
3. `20250518200000_client_project_crm.sql`
4. `20250518300000_site_cms.sql`

Puis l’`INSERT` admin_allowlist ci-dessus.

## Supabase — Auth

1. **Authentication → Users → Add user** : créer l’admin (email + mot de passe).  
2. Même email dans `admin_allowlist` **et** `ADMIN_EMAILS` dans `.env.local`.  
3. **Authentication → URL Configuration** : ajouter  
   - `http://localhost:3000/auth/callback`  
   - votre URL de production  

### Invitations clients (automatique)

Avec `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local` :

- **Admin → Clients → Inviter au portail** : crée le compte Auth + envoie l’e-mail.  
- À la **création d’un projet** depuis une demande : invitation automatique si le client n’a pas encore de compte.

## Variables d'environnement

Voir **`.env.local.example`** (liste complète).

| Variable | Obligatoire | Usage |
|----------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL projet Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Oui | Clé publishable (ou `ANON_KEY`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Pour portail auto | Invitations clients (secret) |
| `ADMIN_EMAILS` | Oui | Accès `/admin` |
| `NEXT_PUBLIC_SITE_URL` | Recommandé | Callbacks, SEO |

**Ne jamais committer `.env.local`.**

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement (hot reload) |
| `npm run build` | Build production |
| `npm run start` | Serveur production (après build) |
| `npm run lint` | ESLint |

## Structure du projet

```
src/app/(site)/     Pages publiques
src/app/admin/      CRM + CMS admin
src/app/portal/     Espace client
src/app/actions/    Server actions (contact, CRM, CMS)
src/components/     UI (sections, admin, portal)
src/lib/            Auth, contenu, Supabase, CRM
supabase/
  full_schema.sql   Schéma SQL complet (1 fichier)
  migrations/       Migrations par étape
```

## Déploiement (Vercel)

1. Importer le repo GitHub.  
2. Ajouter toutes les variables d’environnement (comme `.env.local`).  
3. `NEXT_PUBLIC_SITE_URL` = URL Vercel ou domaine custom.  
4. Mettre à jour les redirect URLs Supabase.

## Licence

Projet privé — Alaeddine & Aziz.
