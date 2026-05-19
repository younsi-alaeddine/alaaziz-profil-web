import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminUser } from "@/lib/auth";
import {
  PORTAL_GUEST_COOKIE,
  hasPortalGuestCookie,
} from "@/lib/portal-guest-cookie-edge";
import { getSupabaseEnv, isSupabaseConfigured } from "./env";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  const { url, key } = getSupabaseEnv();
  const pathname = request.nextUrl.pathname;

  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request: { headers: request.headers },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const guestCookie = request.cookies.get(PORTAL_GUEST_COOKIE)?.value;
  const hasGuestSession = hasPortalGuestCookie(guestCookie);

  const isAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  const isEquipeRoute =
    pathname.startsWith("/equipe") && !pathname.startsWith("/equipe/login");

  const isPortalProtected =
    pathname.startsWith("/portal") &&
    !pathname.startsWith("/portal/login") &&
    !pathname.startsWith("/portal/suivi");

  // —— Admin ——
  if (isAdminRoute) {
    if (!user) {
      const u = request.nextUrl.clone();
      u.pathname = "/admin/login";
      return NextResponse.redirect(u);
    }
    if (!isAdminUser(user.email)) {
      const { data: team } = await supabase
        .from("team_members")
        .select("id")
        .eq("user_id", user.id)
        .eq("active", true)
        .maybeSingle();
      if (team) {
        const u = request.nextUrl.clone();
        u.pathname = "/equipe";
        return NextResponse.redirect(u);
      }
      const u = request.nextUrl.clone();
      u.pathname = "/admin/login";
      u.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(u);
    }
  }

  // —— Équipe (travailleurs) ——
  if (isEquipeRoute) {
    if (!user) {
      const u = request.nextUrl.clone();
      u.pathname = "/equipe/login";
      return NextResponse.redirect(u);
    }
    if (isAdminUser(user.email)) {
      const u = request.nextUrl.clone();
      u.pathname = "/admin/dashboard";
      return NextResponse.redirect(u);
    }
    const { data: team } = await supabase
      .from("team_members")
      .select("id")
      .eq("user_id", user.id)
      .eq("active", true)
      .maybeSingle();
    if (!team) {
      const u = request.nextUrl.clone();
      u.pathname = "/equipe/login";
      u.searchParams.set("error", "no_access");
      return NextResponse.redirect(u);
    }
  }

  // —— Client (portail + suivi express cookie) ——
  if (isPortalProtected) {
    if (!user && !hasGuestSession) {
      const u = request.nextUrl.clone();
      u.pathname = "/portal/suivi";
      return NextResponse.redirect(u);
    }
    if (user) {
      if (isAdminUser(user.email)) {
        const u = request.nextUrl.clone();
        u.pathname = "/admin/dashboard";
        return NextResponse.redirect(u);
      }
      const { data: team } = await supabase
        .from("team_members")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (team) {
        const u = request.nextUrl.clone();
        u.pathname = "/equipe";
        return NextResponse.redirect(u);
      }
      const { data: clientRow } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!clientRow) {
        const u = request.nextUrl.clone();
        u.pathname = "/portal/login";
        u.searchParams.set("error", "no_access");
        return NextResponse.redirect(u);
      }
    }
  }

  // Redirections login déjà connecté
  if (pathname === "/admin/login" && user && isAdminUser(user.email)) {
    const u = request.nextUrl.clone();
    u.pathname = "/admin/dashboard";
    return NextResponse.redirect(u);
  }

  if (pathname === "/equipe/login" && user && !isAdminUser(user.email)) {
    const { data: team } = await supabase
      .from("team_members")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (team) {
      const u = request.nextUrl.clone();
      u.pathname = "/equipe";
      return NextResponse.redirect(u);
    }
  }

  if (pathname === "/portal/login" && user && !isAdminUser(user.email)) {
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (client) {
      const u = request.nextUrl.clone();
      u.pathname = "/portal";
      return NextResponse.redirect(u);
    }
  }

  return supabaseResponse;
}
