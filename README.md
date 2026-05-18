# Alaeddine & Aziz — Site portfolio

Site Next.js 15 pour le duo développeurs **Alaeddine & Aziz** (frontend + backend, SaaS, web).

## Prérequis

- Node.js 20+
- Compte [Supabase](https://supabase.com)

## Installation

1. **Créer un projet Supabase** sur le dashboard.
2. **Exécuter la migration** : dans l’éditeur SQL Supabase, coller et exécuter le fichier  
   `supabase/migrations/20250518000000_contact_requests.sql`.
3. **Créer un utilisateur admin** : Authentication → Users → Add user (email + mot de passe). Ce compte servira pour `/admin/login`.
4. **Variables d’environnement** : copier `.env.local.example` vers `.env.local` et renseigner :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Installer et lancer** :

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Administration : [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Scripts

| Commande        | Description        |
|----------------|--------------------|
| `npm run dev`  | Serveur de dev     |
| `npm run build`| Build production   |
| `npm run start`| Démarrer le build  |

## Structure

- `src/app/(site)/` — pages publiques
- `src/app/admin/` — tableau de bord des demandes de contact
- `src/components/sections/` — sections réutilisables
- `src/lib/data.ts` — contenu statique (services, portfolio, FAQ…)

## Régénérer les fichiers (optionnel)

```bash
python3 scripts/gen2.py
```
