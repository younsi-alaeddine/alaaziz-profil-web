import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { TeamLoginForm } from "@/components/equipe/TeamLoginForm";

export const metadata = {
  title: "Connexion équipe",
};

export default function EquipeLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      }
    >
      <TeamLoginForm />
    </Suspense>
  );
}
