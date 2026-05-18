import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminCrmLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
