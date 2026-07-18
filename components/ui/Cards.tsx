"use client";

import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { stripCurrencyPrefix } from "@/lib/i18n/currency-icon";
import { CurrencyIcon } from "./CurrencyIcon";
import { Icon } from "./Icon";

type BaseCardProps = {
  className?: string;
};

/** Shared Figma card typography — Card / Property & Card / Insight (node 1525:28291). */
export const cardTypography = {
  shell:
    "flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover,0_8px_24px_rgba(15,23,42,0.12))]",
  body: "flex flex-1 flex-col justify-between px-6 pb-4 pt-6",
  /** Figma "Description" frame — pt 24, px 24, pb 16, no forced row heights (avoids dead space under short titles) */
  bodySale: "flex flex-1 flex-col px-6 pb-4 pt-6",
  /** Figma Card / Project (Off-Plan) 1525:28104 — Description: pt 24, px 24, pb 16, space-between */
  bodyOffPlan:
    "flex min-h-0 flex-1 flex-col justify-between overflow-hidden px-6 pb-4 pt-6",
  /** Figma Card / Insight 1525:28283 — Description: pt 24, px 24, pb 8, space-between */
  bodyInsight:
    "flex min-h-0 flex-1 flex-col justify-between overflow-hidden px-6 pb-2 pt-6",
  title: "text-h3 font-bold text-brand",
  titleTwoLine: "line-clamp-2",
  location: "flex items-start gap-1 text-body-sm text-ink-tertiary",
  locationOneLine: "line-clamp-1 min-h-[1.125rem]",
  locationIcon: "h-3.5 w-3.5 shrink-0 text-accent",
  meta: "inline-flex shrink-0 items-center gap-1.5 text-label-semibold font-semibold text-ink",
  metaRow: "flex min-h-[22px] flex-nowrap gap-[14px] overflow-hidden",
  metaIconWrap:
    "inline-flex h-[22px] w-[22px] items-center justify-center rounded-[2px] bg-basalt-50 p-1",
  metaIcon: "h-3.5 w-3.5 text-ink",
  startingFrom: "text-body-xs text-ink-tertiary",
  price: "flex items-center gap-2 text-h3 font-bold text-brand",
  priceIcon: "h-[18px] w-[18px] shrink-0",
  badge:
    "rounded-[2px] bg-basalt-50 px-2.5 py-1 text-label-muted font-medium text-ink-secondary",
  cta: "inline-flex shrink-0 items-center gap-1 text-label-semibold font-semibold text-accent",
  ctaIcon: "h-4 w-4 rtl:rotate-180",
  category: "text-overline font-semibold uppercase text-accent",
  excerpt: "text-body-sm text-ink-secondary",
  metaMuted: "text-label-muted font-medium text-platinum-400",
} as const;

export type PropertyCardProps = BaseCardProps & {
  title: string;
  location: string;
  price: string;
  currency?: string;
  href?: string;
  handover?: string;
  imageLabel?: string;
  imageUrl?: string;
  meta?: string[];
  badges?: string[];
  layout?: "grid" | "list";
  /** Override default "Explore Property" CTA — Featured Selection uses Figma "Read the Property Story". */
  ctaLabel?: string;
};

export type InsightCardProps = BaseCardProps & {
  category: string;
  title: string;
  excerpt: string;
  readTime?: string;
  author?: string;
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
  description?: string;
  facts: string[];
  projectCount?: number;
  href?: string;
};

function ImagePlaceholder({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-[220px] shrink-0 items-center justify-center rounded-[4px]",
        dark ? "bg-sapphire-200/30" : "bg-basalt-100",
      )}
    >
      <Icon
        name="image"
        className={cn(
          "h-[88px] w-[88px]",
          dark ? "text-white/70" : "text-white/60",
        )}
      />
    </div>
  );
}

function metaIconForLabel(item: string) {
  const lower = item.toLowerCase();
  if (lower.includes("bed")) return "bed" as const;
  if (lower.includes("bath")) return "bath" as const;
  if (lower.includes("sq")) return "area" as const;
  return "grid" as const;
}

function CardImage({
  imageUrl,
  alt,
  icon = "image",
  className,
}: {
  imageUrl?: string;
  alt: string;
  icon?: "image" | "building" | "mapPin";
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div className={cn("relative h-[236px] w-full shrink-0 overflow-hidden rounded-[4px]", className)}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="motion-card-image object-cover object-center"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[236px] w-full shrink-0 items-center justify-center rounded-[4px] bg-basalt-100",
        className,
      )}
    >
      <Icon name={icon} className="h-[88px] w-[88px] text-white/60" />
    </div>
  );
}

export function PropertyCard({
  title,
  location,
  price,
  currency = "AED",
  href,
  imageLabel,
  imageUrl,
  meta = [],
  badges = [],
  layout = "grid",
  className,
  ctaLabel,
}: PropertyCardProps) {
  const t = useTranslations("catalog");
  const ctaText = ctaLabel ?? t("exploreProperty");

  const isList = layout === "list";

  const card = isList ? (
    <article
      data-reveal
      className={cn(
        cardTypography.shell,
        "h-auto flex-col overflow-hidden sm:flex-row sm:items-stretch",
        href && "cursor-pointer",
        className,
      )}
    >
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden rounded-[4px] sm:h-auto sm:w-[220px] sm:min-h-[200px] sm:self-stretch">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageLabel ?? title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 220px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-basalt-100">
            <Icon name="image" className="h-14 w-14 text-white/60" />
          </div>
        )}
      </div>
      {imageLabel ? <span className="sr-only">{imageLabel}</span> : null}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
        <div className="min-w-0 space-y-2">
          <h3 className={cardTypography.title}>{title}</h3>
          <p className={cardTypography.location}>
            <Icon name="mapPin" className={cardTypography.locationIcon} />
            <span className="min-w-0 truncate">{location}</span>
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            {meta.map((item) => (
              <span key={item} className={cardTypography.meta}>
                <span className={cardTypography.metaIconWrap}>
                  <Icon name={metaIconForLabel(item)} className={cardTypography.metaIcon} />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className={cardTypography.startingFrom}>{t("startingFrom")}</p>
            <p className={cardTypography.price}>
              <CurrencyIcon currency={currency} className={cardTypography.priceIcon} />
              {stripCurrencyPrefix(price, currency)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge} className={cardTypography.badge}>
                  {badge}
                </span>
              ))}
            </div>
            {href ? (
              <span className={cn(cardTypography.cta, "motion-link-arrow inline-flex shrink-0")}>
                {ctaText}{" "}
                <Icon name="arrowRight" className={cardTypography.ctaIcon} />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  ) : (
    <article
      data-reveal
      className={cn(
        cardTypography.shell,
        "h-full min-h-[480px] overflow-hidden",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={imageLabel ?? title} />
      {imageLabel ? <span className="sr-only">{imageLabel}</span> : null}
      <div className={cardTypography.bodySale}>
        <h3 className={cn(cardTypography.title, cardTypography.titleTwoLine)}>{title}</h3>
        <p className={cn(cardTypography.location, "mt-2")}>
          <Icon name="mapPin" className={cardTypography.locationIcon} />
          <span className={cn(cardTypography.locationOneLine, "min-w-0")}>{location}</span>
        </p>
        <div className={cn(cardTypography.metaRow, "mt-3")}>
          {meta.map((item) => (
            <span key={item} className={cardTypography.meta}>
              <span className={cardTypography.metaIconWrap}>
                <Icon
                  name={metaIconForLabel(item)}
                  className={cardTypography.metaIcon}
                />
              </span>
              {item}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <p className={cardTypography.startingFrom}>{t("startingFrom")}</p>
          <p className={cardTypography.price}>
            <CurrencyIcon currency={currency} className={cardTypography.priceIcon} />
            {stripCurrencyPrefix(price, currency)}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span key={badge} className={cardTypography.badge}>
                {badge}
              </span>
            ))}
          </div>
          {href ? (
            <span className={cn(cardTypography.cta, "motion-link-arrow inline-flex")}>
              {ctaText}{" "}
              <Icon name="arrowRight" className={cardTypography.ctaIcon} />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className={cn("block text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2", isList ? "w-full" : "h-full w-full")}>
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
  currency = "AED",
  handover = "On Request",
  href,
  imageUrl,
  className,
}: Pick<
  PropertyCardProps,
  "title" | "location" | "price" | "currency" | "handover" | "href" | "imageUrl" | "className"
>) {
  const t = useTranslations("catalog");
  const displayPrice = stripCurrencyPrefix(price, currency);

  // Figma Card / Project 1525:28104 — side rows use justify-between (flush to 24px side padding)
  const card = (
    <article
      data-reveal
      className={cn(
        cardTypography.shell,
        "h-full min-h-[480px] overflow-hidden",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={title} icon="building" />
      <div className={cardTypography.bodyOffPlan}>
        <div className="flex w-full shrink-0 items-start justify-between">
          <span className={cardTypography.badge}>
            {t("breadcrumbOffPlan")}
          </span>
          <Icon name="crane" className="h-6 w-6 shrink-0 text-accent" />
        </div>
        <h3 className={cn(cardTypography.title, cardTypography.titleTwoLine, "shrink-0")}>
          {title}
        </h3>
        <p className={cn(cardTypography.location, "shrink-0")}>
          <Icon name="mapPin" className={cardTypography.locationIcon} />
          <span className={cn(cardTypography.locationOneLine, "min-w-0")}>{location}</span>
        </p>
        <div className="flex w-full shrink-0 items-center justify-between pt-2">
          <div className="flex flex-col items-start gap-2">
            <p className={cardTypography.startingFrom}>{t("handoverLabel")}</p>
            {/* Figma 1525:27936 — Handover value uses text-box trim; Starting From left untouched */}
            <p className="text-body-regular font-semibold !leading-none tracking-[-0.01em] text-brand [text-box:trim-both_cap_alphabetic]">
              {handover}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <p className={cardTypography.startingFrom}>{t("startingFrom")}</p>
            <p className={cn("justify-end", cardTypography.price)}>
              <CurrencyIcon currency={currency} className={cardTypography.priceIcon} />
              {displayPrice}
            </p>
          </div>
        </div>
        <div className="flex w-full shrink-0 items-center justify-between overflow-hidden">
          <span className={cardTypography.badge}>{t("paymentPlanAvailable")}</span>
          {href ? (
            <span
              className={cn(
                cardTypography.cta,
                "motion-link-arrow inline-flex gap-1 py-2 ps-2",
              )}
            >
              {t("exploreProperty")}
              <Icon name="arrowRight" className={cardTypography.ctaIcon} />
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
        className="block h-full min-h-[480px] w-full text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
      >
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
  author = "NIP Advisory",
  href,
  imageUrl,
  className,
}: InsightCardProps) {
  const t = useTranslations("common");
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(imageUrl) && !imageError;

  // Figma Card / Insight 1525:28283 — 480×440, p 8, image 220, description space-between
  const card = (
    <article
      data-reveal
      className={cn(
        cardTypography.shell,
        "h-full min-h-[440px]",
        href && "cursor-pointer",
        className,
      )}
    >
      {showImage ? (
        <div className="relative h-[220px] shrink-0 overflow-hidden rounded-[4px]">
          <Image
            src={imageUrl!}
            alt={title}
            fill
            className="motion-card-image object-cover object-center"
            sizes="(max-width: 768px) 100vw, 480px"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <ImagePlaceholder />
      )}
      <div className={cardTypography.bodyInsight}>
        <p className={cn(cardTypography.category, "shrink-0")}>{category}</p>
        <h3 className={cn(cardTypography.title, "shrink-0 line-clamp-2")}>
          {title}
        </h3>
        <p className={cn(cardTypography.excerpt, "shrink-0 line-clamp-2")}>
          {excerpt}
        </p>
        <div className="flex shrink-0 items-center justify-between gap-4 overflow-hidden pt-1">
          <span className={cn(cardTypography.metaMuted, "inline-flex items-center gap-1")}>
            <span>{readTime}</span>
            <span aria-hidden>|</span>
            <span>{author}</span>
          </span>
          {href ? (
            <span
              className={cn(
                cardTypography.cta,
                "motion-link-arrow inline-flex gap-1 py-2 ps-2",
              )}
            >
              {t("readInsight")}
              <Icon name="arrowRight" className={cardTypography.ctaIcon} />
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
        className="block h-full min-h-[440px] w-full text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
      >
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
      <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
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
        <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-[4px] bg-[#d9e0ea]">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 344px"
          />
        </div>
      ) : (
        <div className="flex h-[220px] w-full shrink-0 items-center justify-center rounded-[4px] bg-[#d9e0ea]">
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
            <Icon name="lockOpen" className="h-6 w-6 shrink-0" />
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

const communityFactIcons = ["family", "park", "metro", "building"] as const;

export function CommunityCard({
  title,
  description,
  facts,
  projectCount = 0,
  href,
  imageUrl,
  className,
}: CommunityCardProps & { imageUrl?: string }) {
  const t = useTranslations("catalog");
  const leftFacts = facts.slice(0, 2);
  const rightFacts = facts.slice(2, 4);
  const showDescription = Boolean(description?.trim());
  const showFacts = !showDescription && facts.length > 0;

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
        <div className="space-y-3">
          <h3 className={cn(cardTypography.title, "flex items-start gap-1.5")}>
            <Icon
              name="mapPin"
              className={cn(cardTypography.priceIcon, "mt-1 text-accent")}
            />
            {title}
          </h3>
          {showDescription ? (
            <p className={cn(cardTypography.excerpt, "line-clamp-3")}>{description}</p>
          ) : null}
          {showFacts ? (
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
          ) : null}
        </div>
        <div className="mt-auto flex items-center justify-between gap-4">
          <span className={cardTypography.badge}>
            {t("projectsAvailable", { count: projectCount })}
          </span>
          {href ? (
            <span className={cn(cardTypography.cta, "motion-link-arrow inline-flex")}>
              {t("exploreArea")}{" "}
              <Icon name="arrowRight" className={cardTypography.ctaIcon} />
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
