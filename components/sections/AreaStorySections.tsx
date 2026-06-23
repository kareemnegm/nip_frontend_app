import Image from "next/image";
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
import type { AreaFeatureItem } from "@/lib/area/detail";

export type AreaHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  imageUrl?: string;
};

export function AreaHero({
  eyebrow = "AREA | DUBAI",
  title,
  description,
  imageUrl,
}: AreaHeroProps) {
  return (
    <section
      data-site-hero
      className="relative flex h-[360px] items-end overflow-hidden bg-[linear-gradient(166.53deg,#254672_0%,#081a33_71.43%)] sm:h-[460px]"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
      ) : null}
      <div className={cn("relative mx-auto w-full pb-14", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "flex flex-col gap-3")}>
          <p className="text-overline font-semibold text-platinum-400">{eyebrow}</p>
          <h1 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[52px] tracking-[-0.04em] text-white sm:text-[64px] sm:leading-[72px]">
            {title}
          </h1>
          <p className="max-w-[398px] text-body-sm text-sapphire-100">{description}</p>
        </div>
      </div>
    </section>
  );
}

export function AreaSectionHeading({
  eyebrow,
  title,
  className,
  titleClassName,
}: {
  eyebrow: string;
  title: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4 text-center", className)}>
      <p className="text-overline font-semibold text-accent">{eyebrow}</p>
      <h2
        className={cn(
          "font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-brand",
          titleClassName,
        )}
      >
        {title}
      </h2>
    </div>
  );
}

function FeaturePillIcon({ icon, iconSvg }: { icon: IconName; iconSvg?: string | null }) {
  if (iconSvg?.trim()) {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center [&_svg]:h-6 [&_svg]:w-6 [&_svg]:text-brand"
        dangerouslySetInnerHTML={{ __html: iconSvg }}
        aria-hidden
      />
    );
  }

  return <Icon name={icon} className="h-6 w-6 shrink-0 text-brand" />;
}

export function AreaFeaturePill({ label, icon, iconSvg }: AreaFeatureItem) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[var(--radius-field)] bg-basalt-50 py-2 pl-3 pr-4 text-[11px] font-medium leading-[14px] text-ink-secondary">
      <FeaturePillIcon icon={icon} iconSvg={iconSvg} />
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
  highlights: AreaFeatureItem[];
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
  title,
  imageUrl,
  connectivity,
}: {
  title: string;
  imageUrl?: string;
  connectivity: AreaFeatureItem[];
}) {
  return (
    <div className={cn(sitePageInnerClassName, "space-y-6")}>
      <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
        {title}
      </h2>
      <div className="relative h-[280px] overflow-hidden rounded-[var(--radius-card)] sm:h-[320px]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1080px) 100vw, 1080px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-basalt-100">
            <Icon name="mapPin" className="h-[100px] w-[100px] text-white/80" />
          </div>
        )}
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
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function AreaExploreCta({
  eyebrow,
  title,
  contactHref,
  speakWithLabel,
  nipLabel,
}: {
  eyebrow: string;
  title: string;
  contactHref: string;
  speakWithLabel: string;
  nipLabel: string;
}) {
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
            <p className="text-overline font-semibold text-accent-on-dark">{eyebrow}</p>
            <h2 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-white">
              {title}
            </h2>
          </div>
          <Link
            href={contactHref}
            className="inline-flex items-center justify-center gap-[3px] rounded-[var(--radius-field)] bg-white px-6 py-[9px] text-xs leading-4 text-brand transition-colors hover:bg-sapphire-50"
          >
            <span className="font-semibold">{speakWithLabel}</span>
            <span className="font-[family-name:var(--font-logo)] font-medium">{nipLabel}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
