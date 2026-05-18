"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type ToastItem = { id: number; message: string; type: ToastType };

const ToastContext = createContext<{
  toast: (message: string, type?: ToastType) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles: Record<ToastType, string> = {
  success: "border-emerald-500/30 bg-emerald-500/10",
  error: "border-red-500/30 bg-red-500/10",
  info: "border-blue-500/30 bg-blue-500/10",
};

const iconColors: Record<ToastType, string> = {
  success: "text-emerald-400",
  error: "text-red-400",
  info: "text-blue-400",
};

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toasts items={items} setItems={setItems} />
    </ToastContext.Provider>
  );
}

function Toasts({
  items,
  setItems,
}: {
  items: ToastItem[];
  setItems: React.Dispatch<React.SetStateAction<ToastItem[]>>;
}) {
  return (
    <div className="fixed top-24 right-6 z-[200] flex flex-col gap-2">
      {items.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={`toast-enter glass rounded-xl px-5 py-3 flex items-center gap-3 border min-w-[260px] ${styles[t.type]}`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${iconColors[t.type]}`} />
            <span className="text-sm text-white flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
              className="opacity-60 hover:opacity-100 text-neutral-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

