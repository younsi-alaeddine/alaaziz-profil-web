import { STAGE_STATUS_LABELS } from "@/lib/crm";
import type { ProjectStage } from "@/lib/types";
import { Check, Circle, Loader2 } from "lucide-react";

export function StageTimeline({
  stages,
  showDates = true,
}: {
  stages: ProjectStage[];
  showDates?: boolean;
}) {
  const sorted = [...stages].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <ul className="space-y-4">
      {sorted.map((stage) => {
        const Icon =
          stage.status === "completed"
            ? Check
            : stage.status === "in_progress"
              ? Loader2
              : Circle;
        const iconClass =
          stage.status === "completed"
            ? "text-emerald-400 bg-emerald-500/20"
            : stage.status === "in_progress"
              ? "text-violet-400 bg-violet-500/20 animate-spin"
              : "text-neutral-600 bg-white/5";

        return (
          <li key={stage.id} className="flex gap-4">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconClass}`}>
              <Icon className={`w-4 h-4 ${stage.status === "in_progress" ? "animate-spin" : ""}`} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-sm">{stage.title}</p>
                <span className="text-[10px] uppercase tracking-wide text-neutral-500">
                  {STAGE_STATUS_LABELS[stage.status]}
                </span>
              </div>
              {showDates && stage.scheduled_date && (
                <p className="text-xs text-neutral-500 mt-1">
                  Prévu : {new Date(stage.scheduled_date).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
