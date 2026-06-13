import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
  siteWideCardGutterX,
  siteWideCardInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

export type AreaHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function AreaHero({
  eyebrow = "AREA | DUBAI",
  title,
  description,
}: AreaHeroProps) {
  return (
    <section
      data-site-hero
      className="flex h-[360px] items-end bg-[linear-gradient(166.53deg,#254672_0%,#081a33_71.43%)] sm:h-[460px]"
    >
      <div className={cn("mx-auto w-full pb-14", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(sitePageInnerClassName, "flex flex-col gap-3")}
        >
          <p className="text-overline font-semibold text-platinum-400">
            {eyebrow}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[52px] tracking-[-0.04em] text-white sm:text-[64px] sm:leading-[72px]">
            {title}
          </h1>
          <p className="max-w-[398px] text-body-sm text-sapphire-100">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

export function AreaSectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4 text-center", className)}>
      <p className="text-overline font-semibold text-accent">{eyebrow}</p>
      <h2 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-brand">
        {title}
      </h2>
    </div>
  );
}

export function AreaFeaturePill({
  label,
  icon,
}: {
  label: string;
  icon: IconName;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[var(--radius-field)] bg-basalt-50 py-2 pl-3 pr-4 text-[11px] font-medium leading-[14px] text-ink-secondary">
      <Icon name={icon} className="h-6 w-6 shrink-0 text-brand" />
      {label}
    </span>
  );
}

export function AreaAboutSection({
  title,
  body,
  highlights,
}: {
  title: string;
  body: string;
  highlights: Array<{ label: string; icon: IconName }>;
}) {
  return (
    <div className={cn(sitePageInnerClassName, "space-y-6")}>
      <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
        {title}
      </h2>
      <p className="max-w-[900px] text-body-lg text-ink">{body}</p>
      <div className="flex max-w-[900px] flex-wrap gap-2.5">
        {highlights.map((item) => (
          <AreaFeaturePill key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}

export function AreaMapSection({
  connectivity,
}: {
  connectivity: Array<{ label: string; icon: IconName }>;
}) {
  return (
    <div className={cn(sitePageInnerClassName, "space-y-6")}>
      <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
        Connectivity &amp; Location
      </h2>
      <div className="flex h-[280px] items-center justify-center rounded-[var(--radius-card)] bg-basalt-100 sm:h-[320px]">
        <Icon name="mapPin" className="h-[100px] w-[100px] text-white/80" />
      </div>
      <div className="flex flex-wrap gap-2.5">
        {connectivity.map((item) => (
          <AreaFeaturePill key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}

export function AreaCardSection({
  eyebrow,
  title,
  variant,
  children,
}: {
  eyebrow: string;
  title: string;
  variant: "wide" | "standard";
  children: React.ReactNode;
}) {
  const isWide = variant === "wide";

  return (
    <section className={cn(isWide ? "bg-surface-muted" : "bg-white", "py-16")}>
      <div
        className={cn(
          "mx-auto w-full",
          siteMaxWidth,
          isWide ? siteWideCardGutterX : sitePageGutterX,
        )}
      >
        <div className={isWide ? siteWideCardInnerClassName : sitePageInnerClassName}>
          <AreaSectionHeading eyebrow={eyebrow} title={title} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AreaExploreCta({ areaName }: { areaName: string }) {
  return (
    <section className="bg-brand py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-center gap-10 text-center",
          )}
        >
          <div className="space-y-4">
            <p className="text-overline font-semibold text-accent-on-dark">
              EXPLORE WITH NIP
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-white">
              Considering {areaName}?
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-[3px] rounded-[var(--radius-field)] bg-white px-6 py-[9px] text-xs leading-4 text-brand transition-colors hover:bg-sapphire-50"
          >
            <span className="font-semibold">Speak with</span>
            <span className="font-[family-name:var(--font-logo)] font-medium">
              NIP
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
