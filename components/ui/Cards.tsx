"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type BaseCardProps = {
  className?: string;
};

/** Shared Figma card typography — Card / Property & Card / Insight (node 1525:28291). */
export const cardTypography = {
  shell:
    "flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover,0_8px_24px_rgba(15,23,42,0.12))]",
  body: "flex flex-1 flex-col justify-between px-6 pb-4 pt-6",
  bodyInsight: "flex flex-1 flex-col justify-between px-6 pb-2 pt-6",
  title: "text-xl font-bold leading-[26px] text-brand",
  location: "flex items-center gap-1 text-body-sm text-ink-tertiary",
  locationIcon: "h-3.5 w-3.5 shrink-0 text-brand",
  meta: "inline-flex items-center gap-1.5 text-xs font-semibold leading-4 text-ink",
  metaIconWrap:
    "inline-flex h-[22px] w-[22px] items-center justify-center rounded-[2px] bg-basalt-50 p-1",
  metaIcon: "h-3.5 w-3.5 text-ink-secondary",
  startingFrom: "text-xs leading-4 text-ink-tertiary",
  price: "flex items-center gap-2 text-xl font-bold leading-[26px] text-brand",
  priceIcon: "h-[18px] w-[18px] shrink-0",
  badge:
    "rounded-[2px] bg-basalt-50 px-2.5 py-1 text-[11px] font-medium leading-[14px] text-ink-secondary",
  cta: "inline-flex shrink-0 items-center gap-1 text-xs font-semibold leading-4 text-accent",
  ctaIcon: "h-4 w-4",
  category: "text-overline font-semibold uppercase text-accent",
  excerpt: "text-[13px] leading-[18px] text-ink-secondary",
  metaMuted: "text-[11px] font-medium leading-[14px] text-platinum-400",
} as const;

export type PropertyCardProps = BaseCardProps & {
  title: string;
  location: string;
  price: string;
  href?: string;
  handover?: string;
  imageLabel?: string;
  imageUrl?: string;
  meta?: string[];
  badges?: string[];
};

export type InsightCardProps = BaseCardProps & {
  category: string;
  title: string;
  excerpt: string;
  readTime?: string;
  href?: string;
  imageUrl?: string;
};

type AdvisorCardProps = BaseCardProps & {
  title: string;
  excerpt: string;
  href?: string;
  imageUrl?: string;
};

type CommunityCardProps = BaseCardProps & {
  title: string;
  facts: string[];
  projectCount?: string;
  href?: string;
};

function ImagePlaceholder({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-[220px] items-center justify-center rounded-[4px]",
        dark ? "bg-sapphire-200/30" : "bg-basalt-100",
      )}
    >
      <Icon
        name="home"
        className={cn(
          "h-[70px] w-[70px]",
          dark ? "text-white/70" : "text-white",
        )}
      />
    </div>
  );
}

function CardImage({
  imageUrl,
  alt,
  icon = "home",
  className,
}: {
  imageUrl?: string;
  alt: string;
  icon?: "home" | "building" | "mapPin";
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div className={cn("relative h-[236px] w-full overflow-hidden rounded-[4px]", className)}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="motion-card-image object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[236px] w-full items-center justify-center rounded-[4px] bg-basalt-100",
        className,
      )}
    >
      <Icon name={icon} className="h-[70px] w-[70px] text-white" />
    </div>
  );
}

export function PropertyCard({
  title,
  location,
  price,
  href,
  imageLabel,
  imageUrl,
  meta = [],
  badges = [],
  className,
}: PropertyCardProps) {
  const t = useTranslations("catalog");

  const card = (
    <article
      data-reveal
      className={cn(
        cardTypography.shell,
        "min-h-[480px]",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={imageLabel ?? title} />
      {imageLabel ? <span className="sr-only">{imageLabel}</span> : null}
      <div className={cardTypography.body}>
        <div className="space-y-3">
          <h3 className={cardTypography.title}>{title}</h3>
          <p className={cardTypography.location}>
            <Icon name="mapPin" className={cardTypography.locationIcon} />
            {location}
          </p>
          <div className="flex flex-wrap gap-3.5 pt-1">
            {meta.map((item) => (
              <span key={item} className={cardTypography.meta}>
                <span className={cardTypography.metaIconWrap}>
                  <Icon
                    name={
                      item.toLowerCase().includes("bed")
                        ? "bed"
                        : item.toLowerCase().includes("bath")
                          ? "bath"
                          : "grid"
                    }
                    className={cardTypography.metaIcon}
                  />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4 pt-6">
            <p className={cardTypography.startingFrom}>{t("startingFrom")}</p>
            <p className={cardTypography.price}>
              <Icon name="currency" className={cardTypography.priceIcon} />
              {price.replace(/^AED\s*/i, "")}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge} className={cardTypography.badge}>
                  {badge}
                </span>
              ))}
            </div>
            {href ? (
              <span className={cn(cardTypography.cta, "motion-link-arrow inline-flex")}>
                {t("exploreProperty")}{" "}
                <Icon name="arrowRight" className={cardTypography.ctaIcon} />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2">
        {card}
      </Link>
    );
  }

  return card;
}

export function OffPlanCard({
  title,
  location,
  price,
  handover = "On Request",
  href,
  imageUrl,
  className,
}: Pick<
  PropertyCardProps,
  "title" | "location" | "price" | "handover" | "href" | "imageUrl" | "className"
>) {
  const t = useTranslations("catalog");
  const displayPrice = price.replace(/^AED\s*/i, "");

  const card = (
    <article
      data-reveal
      className={cn(
        cardTypography.shell,
        "min-h-[480px]",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={title} icon="building" />
      <div className={cardTypography.body}>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <span className={cardTypography.badge}>{t("breadcrumbOffPlan")}</span>
            <Icon name="building" className="h-6 w-6 shrink-0 text-brand" />
          </div>
          <div>
            <h3 className={cardTypography.title}>{title}</h3>
            <p className={cn("mt-3", cardTypography.location)}>
              <Icon name="mapPin" className={cardTypography.locationIcon} />
              {location}
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-start justify-between gap-4 pt-2">
            <div>
              <p className={cardTypography.startingFrom}>{t("handoverLabel")}</p>
              <p className="mt-2 text-[15px] font-semibold leading-[22px] tracking-[-0.01em] text-brand">
                {handover}
              </p>
            </div>
            <div className="text-right">
              <p className={cardTypography.startingFrom}>{t("startingFrom")}</p>
              <p className={cn("mt-2 justify-end", cardTypography.price)}>
                <Icon name="currency" className={cardTypography.priceIcon} />
                {displayPrice}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className={cardTypography.badge}>{t("paymentPlanAvailable")}</span>
            {href ? (
              <span className={cn(cardTypography.cta, "motion-link-arrow inline-flex")}>
                {t("exploreProperty")}{" "}
                <Icon name="arrowRight" className={cardTypography.ctaIcon} />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2">
        {card}
      </Link>
    );
  }

  return card;
}

export function InsightCard({
  category,
  title,
  excerpt,
  readTime = "Read time not available",
  href,
  imageUrl,
  className,
}: InsightCardProps) {
  const t = useTranslations("common");
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(imageUrl) && !imageError;

  const card = (
    <article
      data-reveal
      className={cn(
        cardTypography.shell,
        "min-h-[440px] w-full",
        href && "cursor-pointer",
        className,
      )}
    >
      {showImage ? (
        <div className="relative h-[220px] overflow-hidden rounded-[4px]">
          <Image
            src={imageUrl!}
            alt={title}
            fill
            className="motion-card-image object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <ImagePlaceholder />
      )}
      <div className={cardTypography.bodyInsight}>
        <p className={cardTypography.category}>{category}</p>
        <h3 className={cn("mt-4", cardTypography.title)}>{title}</h3>
        <p className={cn("mt-4", cardTypography.excerpt)}>{excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className={cardTypography.metaMuted}>
            {readTime} | NIP Advisory
          </span>
          {href ? (
            <span className={cn(cardTypography.cta, "motion-link-arrow inline-flex")}>
              {t("readInsight")}{" "}
              <Icon name="arrowRight" className={cardTypography.ctaIcon} />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2">
        {card}
      </Link>
    );
  }

  return card;
}

export function AdvisorCard({
  title,
  excerpt,
  href,
  imageUrl,
  className,
}: AdvisorCardProps) {
  const viewControl = (
    <span className="inline-flex items-center gap-1 rounded-[4px] bg-accent px-3 py-1.5 text-xs font-semibold leading-4 text-white">
      View
      <Icon name="arrowRight" className="h-4 w-4" />
    </span>
  );

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[8px] border border-[#7c8694] bg-sapphire-800 p-2 text-white shadow-[0px_2px_4px_rgba(18,51,94,0.06)]",
        className,
      )}
    >
      {imageUrl ? (
        <div className="relative h-[220px] w-full overflow-hidden rounded-[4px] bg-[#d9e0ea]">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 344px"
          />
        </div>
      ) : (
        <div className="flex h-[220px] w-full items-center justify-center rounded-[4px] bg-[#d9e0ea]">
          <Icon name="home" className="h-[70px] w-[70px] text-white/80" />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between px-6 pb-6 pt-8">
        <span className="w-fit rounded-[4px] bg-[#7c8694] px-3 py-1.5 text-[11px] font-medium leading-[14px] text-white">
          PRIVATE
        </span>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold leading-[26px] text-white">{title}</h3>
          <p className="text-xs leading-4 text-[#8fb0dc]">{excerpt}</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="inline-flex items-end gap-1 text-xs leading-4 text-white">
            <Icon name="lock" className="h-6 w-6 shrink-0" />
            Advisor-Released
          </span>
          {href ? (
            <Link href={href} className="shrink-0">
              {viewControl}
            </Link>
          ) : (
            viewControl
          )}
        </div>
      </div>
    </article>
  );
}

const communityFactIcons = ["user", "mapPin", "grid", "building"] as const;

export function CommunityCard({
  title,
  facts,
  projectCount = "Projects Available",
  href,
  imageUrl,
  className,
}: CommunityCardProps & { imageUrl?: string }) {
  const t = useTranslations("catalog");
  const leftFacts = facts.slice(0, 2);
  const rightFacts = facts.slice(2, 4);

  const card = (
    <article
      data-reveal
      className={cn(
        cardTypography.shell,
        "min-h-[440px]",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={title} icon="mapPin" />
      <div className={cardTypography.body}>
        <div className="space-y-5">
          <h3 className={cn(cardTypography.title, "flex items-center gap-1.5")}>
            <Icon name="mapPin" className={cardTypography.priceIcon} />
            {title}
          </h3>
          <div className="flex gap-6 py-2.5">
            <div className="flex flex-col gap-2">
              {leftFacts.map((fact, index) => (
                <span
                  key={fact}
                  className="inline-flex items-center gap-2 text-body-xs text-ink"
                >
                  <Icon
                    name={communityFactIcons[index] ?? "mapPin"}
                    className={cn(cardTypography.priceIcon, "text-brand")}
                  />
                  {fact}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {rightFacts.map((fact, index) => (
                <span
                  key={fact}
                  className="inline-flex items-center gap-2 text-body-xs text-ink"
                >
                  <Icon
                    name={communityFactIcons[index + 2] ?? "building"}
                    className={cn(cardTypography.priceIcon, "text-brand")}
                  />
                  {fact}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <span className={cardTypography.badge}>{projectCount}</span>
          {href ? (
            <span className={cn(cardTypography.cta, "motion-link-arrow inline-flex")}>
              {t("exploreArea")}{" "}
              <Icon name="arrowRight" className={cn(cardTypography.ctaIcon, "rtl:rotate-180")} />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
      >
        {card}
      </Link>
    );
  }

  return card;
}
