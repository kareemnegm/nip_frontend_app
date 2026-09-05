"use client";

import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { AreaFeatureItem } from "@/lib/area/detail";
import { stripCurrencyPrefix } from "@/lib/i18n/currency-icon";
import { AmenityIcon } from "./AmenityIcon";
import { CurrencyIcon } from "./CurrencyIcon";
import { Icon } from "./Icon";
import {
  PropertyTagBadgeStack,
  type PropertyTagDisplay,
} from "./PropertyTagBadge";

type BaseCardProps = {
  className?: string;
};

/** Interactive card link — lift/hover lives on an inner wrapper, not the link itself. */
export const cardLinkClassName =
  "group block w-full text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2";

export const cardLiftClassName = "motion-card-lift h-full w-full";

export function CardLink({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  if (href) {
    return (
      <Link href={href} className={cn(cardLinkClassName, className)}>
        <div className={cardLiftClassName}>{children}</div>
      </Link>
    );
  }

  return <div className={cn(cardLiftClassName, className)}>{children}</div>;
}

/** Shared Figma card typography — Card / Property & Card / Insight (node 1525:28291). */
export const cardTypography = {
  shell:
    "flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card)]",
  body: "flex flex-1 flex-col justify-between px-6 pb-4 pt-6",
  /** Figma "Description" frame — pt 24, px 24, pb 16, no forced row heights (avoids dead space under short titles) */
  bodySale: "flex flex-1 flex-col px-6 pb-4 pt-6",
  /** Figma Card / Project (Off-Plan) 1525:28104 — Description: pt 24, px 24, pb 16, space-between */
  bodyOffPlan:
    "flex min-h-0 flex-1 flex-col justify-between px-6 pb-4 pt-6",
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
  cta: "inline-flex shrink-0 items-center gap-1 overflow-visible pe-0.5 text-label-semibold font-semibold text-accent",
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
  tags?: PropertyTagDisplay[];
  layout?: "grid" | "list";
  /** Rental cards — period line under the amount, e.g. "/ month". */
  pricePeriod?: string | null;
  /** Rental cards — eyebrow above price (monthlyRent, yearlyRent, …). */
  priceEyebrow?: "yearlyRent" | "monthlyRent" | "rentalPrice";
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
  facts: AreaFeatureItem[];
  projectsAvailableLabel?: string;
  exploreAreaLabel: string;
  href?: string;
};

export type DeveloperCardProps = BaseCardProps & {
  name: string;
  href: string;
  viewMakerLabel: string;
  projectsLabel?: string;
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

type PropertyCardPriceEyebrowKey = "yearlyRent" | "monthlyRent" | "rentalPrice";

function PropertyCardPriceRow({
  amount,
  currency = "AED",
  eyebrowKey,
  period,
  className,
}: {
  amount: string;
  currency?: string;
  eyebrowKey?: PropertyCardPriceEyebrowKey;
  period?: string | null;
  className?: string;
}) {
  const t = useTranslations("catalog");
  const eyebrow = eyebrowKey ? t(eyebrowKey) : t("startingFrom");
  const displayAmount = stripCurrencyPrefix(amount, currency);
  // Monthly/yearly rent eyebrow already states the period — no "/ month" on cards.
  const showPeriod =
    Boolean(period) &&
    eyebrowKey !== "monthlyRent" &&
    eyebrowKey !== "yearlyRent";

  return (
    <div className={cn("flex items-end justify-between gap-3", className)}>
      <p className={cn(cardTypography.startingFrom, "max-w-[40%] shrink-0 leading-tight")}>
        {eyebrow}
      </p>
      <p className={cn(cardTypography.price, "min-w-0 flex-1 justify-end text-end")}>
        <span className="inline-flex max-w-full flex-wrap items-baseline justify-end gap-x-1.5">
          <CurrencyIcon currency={currency} className={cardTypography.priceIcon} />
          <span className="tabular-nums">{displayAmount}</span>
          {showPeriod ? (
            <span className="whitespace-nowrap text-body-xs font-medium text-ink-tertiary">
              {period}
            </span>
          ) : null}
        </span>
      </p>
    </div>
  );
}

function CardImage({
  imageUrl,
  alt,
  icon = "image",
  className,
  tags = [],
}: {
  imageUrl?: string;
  alt: string;
  icon?: "image" | "building" | "mapPin";
  className?: string;
  tags?: PropertyTagDisplay[];
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
        <PropertyTagBadgeStack
          tags={tags}
          className="absolute start-2 top-2 z-10 max-w-[calc(100%-1rem)]"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-[236px] w-full shrink-0 items-center justify-center rounded-[4px] bg-basalt-100",
        className,
      )}
    >
      <Icon name={icon} className="h-[88px] w-[88px] text-white/60" />
      <PropertyTagBadgeStack
        tags={tags}
        className="absolute start-2 top-2 z-10 max-w-[calc(100%-1rem)]"
      />
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
  tags = [],
  layout = "grid",
  className,
  ctaLabel,
  pricePeriod,
  priceEyebrow,
}: PropertyCardProps) {
  const t = useTranslations("catalog");
  const ctaText = ctaLabel ?? t("exploreProperty");

  const isList = layout === "list";

  const card = isList ? (
    <article
      data-reveal="slide-x"
      className={cn(
        cardTypography.shell,
        "h-auto flex-col sm:flex-row sm:items-stretch",
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
            className="motion-card-image object-cover"
            sizes="(max-width: 640px) 100vw, 220px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-basalt-100">
            <Icon name="image" className="h-14 w-14 text-white/60" />
          </div>
        )}
        <PropertyTagBadgeStack
          tags={tags}
          className="absolute start-2 top-2 z-10 max-w-[calc(100%-1rem)]"
        />
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
        <PropertyCardPriceRow
          amount={price}
          currency={currency}
          eyebrowKey={priceEyebrow}
          period={pricePeriod}
          className="w-full min-w-0"
        />
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
      className={cn(
        cardTypography.shell,
        "h-full min-h-[480px]",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={imageLabel ?? title} tags={tags} />
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
        <PropertyCardPriceRow
          amount={price}
          currency={currency}
          eyebrowKey={priceEyebrow}
          period={pricePeriod}
          className="mt-auto pt-6"
        />
        <div className="mt-4 flex items-center justify-between gap-4 overflow-visible">
          <div className="flex min-w-0 flex-wrap gap-2">
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

  return (
    <CardLink
      href={href}
      className={isList ? "w-full" : "h-full w-full"}
    >
      {card}
    </CardLink>
  );
}

export function OffPlanCard({
  title,
  location,
  price,
  currency = "AED",
  handover = "On Request",
  href,
  imageUrl,
  tags = [],
  className,
}: Pick<
  PropertyCardProps,
  | "title"
  | "location"
  | "price"
  | "currency"
  | "handover"
  | "href"
  | "imageUrl"
  | "tags"
  | "className"
>) {
  const t = useTranslations("catalog");
  const displayPrice = stripCurrencyPrefix(price, currency);

  // Figma Card / Project 1525:28104 — side rows use justify-between (flush to 24px side padding)
  const card = (
    <article
      className={cn(
        cardTypography.shell,
        "h-full min-h-[480px]",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={title} icon="building" tags={tags} />
      <div className={cardTypography.bodyOffPlan}>
        <div className="flex w-full shrink-0 items-start justify-between gap-3">
          <span className={cardTypography.badge}>{t("breadcrumbOffPlan")}</span>
          <Icon name="crane" className="h-6 w-6 shrink-0 text-accent" />
        </div>
        <h3 className={cn(cardTypography.title, cardTypography.titleTwoLine, "shrink-0")}>
          {title}
        </h3>
        <p className={cn(cardTypography.location, "shrink-0")}>
          <Icon name="mapPin" className={cardTypography.locationIcon} />
          <span className={cn(cardTypography.locationOneLine, "min-w-0")}>{location}</span>
        </p>
        {/* min-w-0 on both columns so a long handover or price wraps instead of
            pushing into the other column. No effect while the text fits. */}
        <div className="flex w-full shrink-0 items-center justify-between gap-3 pt-2">
          <div className="flex min-w-0 flex-col items-start gap-2">
            <p className={cardTypography.startingFrom}>{t("handoverLabel")}</p>
            {/* Figma 1525:27936 — value keeps its normal 22px line-height + text-box trim (matches Figma
                Dev Mode code exactly); forcing leading-none clips glyphs where text-box is unsupported. */}
            <p className="break-words text-body-regular font-semibold tracking-[-0.01em] text-brand [text-box:trim-both_cap_alphabetic]">
              {handover}
            </p>
          </div>
          <div className="flex min-w-0 flex-col items-end gap-2 text-right">
            <p className={cardTypography.startingFrom}>{t("startingFrom")}</p>
            <p className={cn("justify-end", cardTypography.price)}>
              <CurrencyIcon currency={currency} className={cardTypography.priceIcon} />
              {displayPrice}
            </p>
          </div>
        </div>
        <div className="flex w-full shrink-0 items-center justify-between overflow-visible">
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

  return (
    <CardLink href={href} className="h-full min-h-[480px] w-full">
      {card}
    </CardLink>
  );
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
        {/* Mobile: stack meta + CTA. sm+: meta left, CTA right — `ms-auto` keeps the
            label+arrow as one unit; `justify-between` on the row was stretching the
            CTA span so the arrow sat at the card edge away from "Read the Insight". */}
        <div className="flex w-full shrink-0 flex-col items-start gap-2 pt-1 sm:flex-row sm:items-center sm:gap-4">
          <span
            className={cn(
              cardTypography.metaMuted,
              "inline-flex max-w-full min-w-0 items-center gap-1",
            )}
          >
            <span className="shrink-0 whitespace-nowrap">{readTime}</span>
            <span aria-hidden className="shrink-0">
              |
            </span>
            <span className="min-w-0 truncate">{author}</span>
          </span>
          {href ? (
            <span
              className={cn(
                cardTypography.cta,
                "inline-flex shrink-0 items-center gap-1 whitespace-nowrap py-2 sm:ms-auto sm:ps-2",
              )}
            >
              {t("readInsight")}
              <Icon
                name="arrowRight"
                className={cn(
                  cardTypography.ctaIcon,
                  "transition-transform duration-500 ease-[var(--motion-ease-lux)] group-hover:translate-x-1 motion-reduce:translate-x-0",
                )}
              />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  return (
    <CardLink href={href} className="h-full min-h-[440px] w-full">
      {card}
    </CardLink>
  );
}

export function AdvisorCard({
  title,
  excerpt,
  href,
  imageUrl,
  className,
}: AdvisorCardProps) {
  const viewControl = (
    <span className="inline-flex items-center gap-1 rounded-[var(--radius-field)] bg-accent px-3 py-1.5 text-label-semibold font-semibold text-white">
      View
      <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
    </span>
  );

  return (
    <article
      data-reveal="slide-x"
      className={cn(
        "motion-card-lift flex h-[440px] flex-col rounded-[var(--radius-card)] border border-platinum-600 bg-sapphire-800 p-2 text-white shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover,0_8px_24px_rgba(15,23,42,0.12))]",
        className,
      )}
    >
      {imageUrl ? (
        <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-[var(--radius-field)] bg-basalt-100">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="motion-card-image object-cover object-center"
            sizes="(max-width: 768px) 100vw, 528px"
          />
        </div>
      ) : (
        <div className="flex h-[220px] w-full shrink-0 items-center justify-center rounded-[var(--radius-field)] bg-basalt-100">
          <Icon name="image" className="h-[140px] w-[140px] text-white/80" />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between overflow-hidden px-6 pb-6 pt-8">
        <span className="w-fit rounded-[var(--radius-field)] bg-platinum-600 px-3 py-1.5 text-label-muted font-medium text-white">
          PRIVATE
        </span>
        <div className="flex flex-col gap-2">
          <h3 className="line-clamp-1 text-h3 font-bold text-white">{title}</h3>
          <p className="line-clamp-2 text-body-xs text-accent-on-dark">{excerpt}</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="inline-flex items-end gap-1 text-body-xs text-white">
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

/** Figma Card / Area (1054:1280) fact icon — 18×18, brand stroke/fill. */
function CardFactIcon({
  icon,
  iconSvg,
  iconUrl,
  label,
}: Pick<AreaFeatureItem, "icon" | "iconSvg" | "iconUrl" | "label">) {
  const amenity = (
    <AmenityIcon
      facilityIcon={iconSvg}
      iconUrl={iconUrl}
      facility={label}
      className="h-[18px] w-[18px] text-brand [&>svg]:h-[18px] [&>svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:w-[18px]"
    />
  );

  if (iconSvg?.trim() || iconUrl?.trim()) {
    return amenity;
  }

  return <Icon name={icon} className="h-[18px] w-[18px] shrink-0 text-brand" />;
}

/**
 * CommunityCard — Figma Card / Area (node 1054:1278 / description 1054:1280)
 * Pixel-perfect: 408×442, p-2, image h-236, body px-6 pt-6 pb-4.
 */
export function CommunityCard({
  title,
  facts,
  projectsAvailableLabel,
  exploreAreaLabel,
  href,
  imageUrl,
  className,
}: CommunityCardProps & { imageUrl?: string }) {
  const leftFacts = facts.slice(0, 2);
  const rightFacts = facts.slice(2, 4);

  const card = (
    <article
      className={cn(
        cardTypography.shell,
        "flex h-[442px] flex-col p-2",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={title} icon="mapPin" />
      {/* Description — Figma: px-24, pt-24, pb-16, flex-1, justify-between */}
      <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden px-6 pb-4 pt-6">
        {/* Title row — Figma: flex items-center gap-[6px] */}
        <div className="flex items-center gap-[6px]">
          <Icon
            name="mapPin"
            className="h-[18px] w-[19px] shrink-0 text-accent"
          />
          <h3 className="text-h3 font-bold leading-[26px] text-brand">
            {title}
          </h3>
        </div>

        {/* Facts grid — Figma: flex gap-24, py-10 */}
        <div className="flex gap-6 py-[10px]">
          <div className="flex flex-col gap-2">
            {leftFacts.map((fact) => (
              <span
                key={fact.label}
                className="inline-flex items-center gap-2 text-body-xs leading-4 text-ink"
              >
                <CardFactIcon {...fact} />
                {fact.label}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {rightFacts.map((fact) => (
              <span
                key={fact.label}
                className="inline-flex items-center gap-2 text-body-xs leading-4 text-ink"
              >
                <CardFactIcon {...fact} />
                {fact.label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom row — Figma: flex justify-between items-center */}
        <div className="flex items-center justify-between">
          {projectsAvailableLabel ? (
            <span className="rounded-[2px] bg-basalt-50 px-[10px] py-1 text-label-muted font-medium leading-[14px] text-ink-secondary">
              {projectsAvailableLabel}
            </span>
          ) : (
            <span aria-hidden className="shrink-0" />
          )}
          {href ? (
            <span className="motion-link-arrow inline-flex items-center gap-1 py-2 ps-2 text-label-semibold font-semibold leading-4 text-accent">
              {exploreAreaLabel}
              <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  return (
    <CardLink href={href} className="h-[442px]">
      {card}
    </CardLink>
  );
}
export function DeveloperCard({
  name,
  href,
  viewMakerLabel,
  projectsLabel,
  className,
}: DeveloperCardProps) {
  return (
    <CardLink href={href} className={className}>
      <div
        className={cn(
          "flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-card)]",
        )}
      >
        <span className="font-display text-h3 font-bold uppercase text-brand">
          {name.trim()}
        </span>
        {projectsLabel ? (
          <span className="text-body-sm text-ink-secondary">{projectsLabel}</span>
        ) : null}
        <span className="motion-link-arrow mt-2 inline-flex items-center gap-1 text-label-semibold font-semibold text-accent">
          {viewMakerLabel}
          <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
        </span>
      </div>
    </CardLink>
  );
}
