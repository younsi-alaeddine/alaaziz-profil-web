import { createClient } from "@/lib/supabase/server";
import { roleHomePath, resolveUserRole } from "@/lib/roles";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const role = await resolveUserRole(supabase, user);
        const destination =
          next && next.startsWith("/") ? next : role ? roleHomePath(role) : "/";
        return NextResponse.redirect(`${origin}${destination}`);
      }
      return NextResponse.redirect(`${origin}${next ?? "/portal"}`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth`);
}
