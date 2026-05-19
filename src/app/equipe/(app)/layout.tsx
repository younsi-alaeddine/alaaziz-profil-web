import { TeamShell } from "@/components/equipe/TeamShell";
import { requireTeamMember } from "@/lib/team-access";

export default async function EquipeAppLayout({ children }: { children: React.ReactNode }) {
  const { member } = await requireTeamMember();
  return <TeamShell member={member}>{children}</TeamShell>;
}
