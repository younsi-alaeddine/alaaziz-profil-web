import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminUser } from "@/lib/auth";
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

  const isAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  const isPortalRoute =
    pathname.startsWith("/portal") && !pathname.startsWith("/portal/login");

  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      return NextResponse.redirect(redirectUrl);
    }
    if (!isAdminUser(user.email)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      redirectUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (isPortalRoute) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/portal/login";
      return NextResponse.redirect(redirectUrl);
    }
    if (isAdminUser(user.email)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
    const { data: clientRow } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!clientRow) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/portal/login";
      redirectUrl.searchParams.set("error", "no_access");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (pathname === "/admin/login" && user && isAdminUser(user.email)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/portal/login" && user && !isAdminUser(user.email)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/portal";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
