# Alaeddine & Aziz — Site portfolio & CRM

Site **Next.js 15** : vitrine, **CMS admin**, **CRM**, **espace équipe**, **portail client** + **Suivi Express**.

**Dépôt :** https://github.com/younsi-alaeddine/alaaziz-profil-web

## Fonctionnalités

| Zone | URL | Description |
|------|-----|-------------|
| Site public | `/` | Landing (sections ancrées) |
| Admin | `/admin/login` | CRM, clients, projets, équipe, digital, CMS |
| Équipe | `/equipe/login` | Tâches et projets assignés |
| Client | `/portal/login` | Portail complet |
| Suivi Express | `/portal/suivi` | Accès email + code |
| Démo | `/admin/parametres` | Créer / supprimer l’environnement de test |

## Prérequis

- Node.js 20+
- Projet [Supabase](https://supabase.com) (schéma déjà appliqué en prod)
- [Vercel](https://vercel.com) pour le déploiement

## Installation locale

```bash
git clone git@github.com:younsi-alaeddine/alaaziz-profil-web.git
cd alaaziz-profil-web
npm install
cp .env.local.example .env.local
# Renseigner les clés Supabase (même projet que la prod ou un fork)
npm run dev
```

→ http://localhost:3000

## Variables d'environnement

Copier **`.env.local.example`** → **`.env.local`** (non versionné).

| Variable | Obligatoire | Usage |
|----------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL projet Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Oui | Clé publishable |
| `SUPABASE_SERVICE_ROLE_KEY` | Invitations + démo | Serveur uniquement |
| `ADMIN_EMAILS` | Oui | Accès `/admin` |
| `NEXT_PUBLIC_SITE_URL` | Oui | Callbacks Auth, liens |
| `PORTAL_GUEST_SECRET` | Suivi Express | Cookie signé (serveur) |

Sur **Vercel** : mêmes variables dans *Settings → Environment Variables*.

## Supabase

Schéma et données : gérés dans le **dashboard Supabase** (migrations déjà appliquées en prod).

Auth : ajouter `https://votre-domaine.vercel.app/auth/callback` dans Supabase → URL Configuration.

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement |
| `npm run build` | Build production |
| `npm run start` | Serveur après build |
| `npm run lint` | ESLint |

## Structure

```
src/app/          Routes (site, admin, equipe, portal)
src/components/   UI
src/lib/          Auth, Supabase, contenu, CRM
```

## Déploiement Vercel

1. Importer le repo GitHub.
2. Configurer toutes les variables d’environnement.
3. `NEXT_PUBLIC_SITE_URL` = URL de production.
4. Mettre à jour les redirect URLs Supabase.

## Licence

Projet privé — Alaeddine & Aziz.
