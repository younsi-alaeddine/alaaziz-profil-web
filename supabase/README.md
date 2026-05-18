# Supabase

## Installation complète

Exécutez **`full_schema.sql`** dans le SQL Editor Supabase (une seule fois).

Ensuite :

```sql
INSERT INTO public.admin_allowlist (email) VALUES ('votre@email.com');
```

## Migrations séparées

Si vous préférez exécuter étape par étape, utilisez les fichiers dans `migrations/` dans l’ordre numérique (18000000 → 18300000).
