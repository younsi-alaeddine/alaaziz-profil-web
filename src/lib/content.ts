import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  getDefaultSiteContent,
  type SiteContentBundle,
} from "@/lib/content-defaults";

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch: Record<string, unknown>
): T {
  const out = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(patch)) {
    const pv = patch[key];
    const bv = base[key];
    if (Array.isArray(pv)) {
      out[key] = pv;
    } else if (
      pv &&
      typeof pv === "object" &&
      !Array.isArray(pv) &&
      bv &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[key] = deepMerge(
        bv as Record<string, unknown>,
        pv as Record<string, unknown>
      );
    } else if (pv !== undefined) {
      out[key] = pv;
    }
  }
  return out as T;
}

export async function getSiteContent(): Promise<SiteContentBundle> {
  const defaults = getDefaultSiteContent();

  if (!isSupabaseConfigured()) {
    return defaults;
  }

  try {
    const supabase = await createClient();
    const { data: rows } = await supabase.from("site_content").select("key, value");

    if (!rows?.length) return defaults;

    let merged = { ...defaults } as SiteContentBundle;
    for (const row of rows) {
      const key = row.key as keyof SiteContentBundle;
      if (key in merged && row.value && typeof row.value === "object") {
        merged = {
          ...merged,
          [key]: deepMerge(
            merged[key] as Record<string, unknown>,
            row.value as Record<string, unknown>
          ),
        } as SiteContentBundle;
      }
    }
    return merged;
  } catch {
    return defaults;
  }
}

export async function getSiteSetting(key: string, fallback: string): Promise<string> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    return data?.value ?? fallback;
  } catch {
    return fallback;
  }
}
