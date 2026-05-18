export function PageHeader({
  label,
  labelColor = "text-violet-400",
  title,
  subtitle,
  center = false,
}: {
  label: string;
  labelColor?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`anim mb-16 ${center ? "text-center" : ""}`}>
      <span
        className={`section-label text-xs font-medium uppercase tracking-wider ${labelColor} ${center ? "justify-center" : ""}`}
      >
        {label}
      </span>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">{title}</h1>
      {subtitle && <p className="text-neutral-500 mt-3">{subtitle}</p>}
    </div>
  );
}
