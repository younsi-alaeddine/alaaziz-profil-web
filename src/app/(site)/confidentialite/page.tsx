import { ConfidentialiteContent } from "@/components/sections/LegalPageContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Politique de confidentialité");

export default function ConfidentialitePage() {
  return <ConfidentialiteContent />;
}
