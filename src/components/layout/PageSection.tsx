import { DynamicPageHeader } from "@/components/sections/DynamicPageHeader";
import type { PageKey } from "@/lib/sections";

const WIDTH = {
  default: "max-w-7xl",
  narrow: "max-w-3xl",
  wide: "max-w-[90rem]",
} as const;

type PageSectionProps = {
  id?: string;
  /** Section ancrée sur la landing (#…, scroll-spy, animations) */
  anchor?: boolean;
  pageKey?: PageKey;
  header?: React.ReactNode;
  children: React.ReactNode;
  variant?: keyof typeof WIDTH;
  band?: boolean;
  /** Bandeau hero pleine largeur (pages légales) */
  heroBanner?: boolean;
};

export function PageSection({
  id,
  anchor = false,
  pageKey,
  header,
  children,
  variant = "default",
  band = false,
  heroBanner = false,
}: PageSectionProps) {
  const titleBlock = pageKey ? (
    <div className="anim mb-12 md:mb-16">
      <DynamicPageHeader pageKey={pageKey} />
    </div>
  ) : (
    header
  );

  const body = (
    <div className={`site-container section-spacing mx-auto w-full ${WIDTH[variant]}`}>
      {heroBanner ? header : titleBlock}
      {children}
    </div>
  );

  if (heroBanner) {
    return (
      <div className="w-full">
        <section className="page-hero relative w-full overflow-hidden">
          <div className="page-hero-glow" aria-hidden />
          <div className="page-grid-bg" aria-hidden />
          <div className="site-container relative z-10 py-14 sm:py-16 md:py-20 lg:py-24">
            {header}
          </div>
        </section>
        <section className={`site-container section-spacing mx-auto w-full ${WIDTH[variant]}`}>
          {children}
        </section>
      </div>
    );
  }

  if (anchor && id) {
    return (
      <section
        id={id}
        data-section
        className={`scroll-mt-24 w-full ${band ? "section-band" : "border-t border-white/5"}`}
      >
        {body}
      </section>
    );
  }

  return <div className="w-full">{body}</div>;
}
