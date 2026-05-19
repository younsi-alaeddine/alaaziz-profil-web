export function PageHeader({
  label,
  labelColor = "text-violet-400",
  title,
  subtitle,
  center = false,
  hero = false,
}: {
  label: string;
  labelColor?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
  hero?: boolean;
}) {
  return (
    <div
      className={`anim ${center ? "text-center mx-auto" : ""} ${hero ? "max-w-4xl mx-auto" : "mb-4"}`}
    >
      <span
        className={`section-label text-xs font-medium uppercase tracking-[0.2em] ${labelColor} ${center ? "justify-center" : ""}`}
      >
        {label}
      </span>
      <h1
        className={`font-bold tracking-tight mt-5 leading-[1.1] ${
          hero
            ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            : "text-3xl sm:text-4xl md:text-5xl"
        }`}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={`text-neutral-400 mt-5 leading-relaxed ${
            hero ? "text-base sm:text-lg md:text-xl max-w-2xl" : "text-sm sm:text-base"
          } ${center ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
      {hero && <span className="hero-line w-20 mx-auto mt-8 block" aria-hidden />}
    </div>
  );
}
