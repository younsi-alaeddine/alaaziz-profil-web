import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from "@/lib/crm";
import type { ProjectStatus } from "@/lib/types";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PROJECT_STATUS_COLORS[status]}`}>
      {PROJECT_STATUS_LABELS[status]}
    </span>
  );
}
