import { requireAdmin } from "@/lib/auth-server";
import { DigitalHub } from "@/components/admin/DigitalHub";
import { buildDigitalRequestTree } from "@/lib/digital-tree";
import type {
  DigitalRequest,
  SocialAccount,
  SocialContentRequest,
  TeamMember,
} from "@/lib/types";

export default async function AdminDigitalPage() {
  const { supabase } = await requireAdmin();

  const [{ data: accounts }, { data: socialRequests }, { data: digitalFlat }, { data: team }] =
    await Promise.all([
      supabase.from("social_accounts").select("*").order("created_at", { ascending: false }),
      supabase
        .from("social_content_requests")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("digital_requests").select("*").order("level").order("created_at"),
      supabase.from("team_members").select("id, name, role").eq("active", true),
    ]);

  const digitalRoots = buildDigitalRequestTree((digitalFlat as DigitalRequest[]) ?? []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-pink-400 mb-2">Digital Hub</p>
        <h2 className="text-2xl font-bold">Social & demandes multiniveau</h2>
        <p className="text-neutral-400 text-sm mt-1">
          Facebook, Instagram, campagnes et sous-demandes (SEO, ads, contenu…).
        </p>
      </div>
      <DigitalHub
        accounts={(accounts as SocialAccount[]) ?? []}
        socialRequests={(socialRequests as SocialContentRequest[]) ?? []}
        digitalRoots={digitalRoots}
        team={(team as TeamMember[]) ?? []}
      />
    </div>
  );
}
