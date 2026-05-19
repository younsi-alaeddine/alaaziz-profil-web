import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { TrackingLoginForm } from "@/components/portal/TrackingLoginForm";

export const metadata = {
  title: "Suivi de projet",
  description: "Consultez l'avancement de votre projet avec votre code de suivi.",
};

export default function PortalSuiviPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
        </div>
      }
    >
      <TrackingLoginForm />
    </Suspense>
  );
}
