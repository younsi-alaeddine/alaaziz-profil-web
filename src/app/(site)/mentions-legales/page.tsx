import { MentionsLegalesContent } from "@/components/sections/LegalPageContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Mentions légales");

export default function MentionsLegalesPage() {
  return <MentionsLegalesContent />;
}
