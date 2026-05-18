"use client";

import { useTransition } from "react";
import { markNotificationRead } from "@/app/actions/crm";
import type { Notification } from "@/lib/types";
import { Check, Loader2 } from "lucide-react";

export function PortalNotifications({ notifications }: { notifications: Notification[] }) {
  const [pending, startTransition] = useTransition();

  if (notifications.length === 0) return null;

  function dismiss(id: string) {
    startTransition(async () => {
      await markNotificationRead(id);
    });
  }

  return (
    <section className="glass rounded-2xl p-5 border border-violet-500/20 space-y-3 anim">
      <h2 className="text-sm font-semibold">Notifications</h2>
      {notifications.map((n) => (
        <div
          key={n.id}
          className="flex items-start justify-between gap-3 text-sm border-l-2 border-violet-500 pl-3"
        >
          <div>
            <p className="font-medium">{n.title}</p>
            {n.body && <p className="text-neutral-400 text-xs mt-0.5">{n.body}</p>}
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() => dismiss(n.id)}
            className="shrink-0 p-2 rounded-lg hover:bg-white/10 text-neutral-500 hover:text-emerald-400 transition"
            aria-label="Marquer comme lu"
          >
            {pending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
        </div>
      ))}
    </section>
  );
}
