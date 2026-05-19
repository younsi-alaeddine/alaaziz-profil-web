# Référence projet

> Dépôt : https://github.com/younsi-alaeddine/alaaziz-profil-web

## Déploiement

| Service | Rôle |
|---------|------|
| **Vercel** | Hébergement Next.js |
| **Supabase** | Postgres, Auth, RLS |

Variables : voir `.env.local.example` — à configurer dans **Vercel → Settings → Environment Variables** (pas de secrets dans le code).

## URLs locales

| Zone | URL |
|------|-----|
| Site | http://localhost:3000 |
| Admin | http://localhost:3000/admin/login |
| Équipe | http://localhost:3000/equipe/login |
| Client | http://localhost:3000/portal/login |
| Suivi Express | http://localhost:3000/portal/suivi |

## Base de données

Hébergée sur Supabase (schéma déjà en place). Modifications via le dashboard Supabase → SQL Editor si besoin.

## Stack

Next.js 15 · React 19 · Tailwind 4 · Supabase (Auth + Postgres + RLS)
