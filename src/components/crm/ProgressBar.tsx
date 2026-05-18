export function ProgressBar({ percent }: { percent: number }) {
  const value = Math.min(100, Math.max(0, percent));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-neutral-500">
        <span>Progression</span>
        <span>{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-grad rounded-full transition-all duration-700" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
