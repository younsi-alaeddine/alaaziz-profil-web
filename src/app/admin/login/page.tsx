import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
