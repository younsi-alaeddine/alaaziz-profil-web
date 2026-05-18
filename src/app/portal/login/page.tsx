import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PortalLoginForm } from "@/components/portal/PortalLoginForm";

export default function PortalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
        </div>
      }
    >
      <PortalLoginForm />
    </Suspense>
  );
}
