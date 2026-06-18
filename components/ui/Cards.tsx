"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Icon } from "./Icon";

type BaseCardProps = {
  className?: string;
};

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
          className="object-cover"
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
      className={cn(
        "flex h-full min-h-[480px] flex-col rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover,0_8px_24px_rgba(15,23,42,0.12))]",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={imageLabel ?? title} />
      {imageLabel ? <span className="sr-only">{imageLabel}</span> : null}
      <div className="flex flex-1 flex-col justify-between px-6 pb-4 pt-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold leading-[26px] text-brand">
            {title}
          </h3>
          <p className="flex items-center gap-1 text-body-sm text-ink-tertiary">
            <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-brand" />
            {location}
          </p>
          <div className="flex flex-wrap gap-3.5 pt-1">
            {meta.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 text-xs font-semibold leading-4 text-ink"
              >
                <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-[2px] bg-basalt-50 p-1">
                  <Icon
                    name={
                      item.toLowerCase().includes("bed")
                        ? "bed"
                        : item.toLowerCase().includes("bath")
                          ? "bath"
                          : "grid"
                    }
                    className="h-3.5 w-3.5 text-ink-secondary"
                  />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4 pt-6">
            <p className="text-xs leading-4 text-ink-tertiary">{t("startingFrom")}</p>
            <p className="flex items-center gap-2 text-xl font-bold leading-[26px] text-brand">
              <Icon name="currency" className="h-[18px] w-[18px] shrink-0" />
              {price.replace(/^AED\s*/i, "")}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-[2px] bg-basalt-50 px-2.5 py-1 text-[11px] font-medium leading-[14px] text-ink-secondary"
                >
                  {badge}
                </span>
              ))}
            </div>
            {href ? (
              <span className="inline-flex shrink-0 items-center gap-1 text-body-sm leading-[18px] text-accent">
                {t("exploreProperty")} <Icon name="arrowRight" className="h-4 w-4" />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2">
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
      className={cn(
        "flex h-full min-h-[480px] flex-col rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover,0_8px_24px_rgba(15,23,42,0.12))]",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={title} icon="building" />
      <div className="flex flex-1 flex-col justify-between px-6 pb-4 pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-[2px] bg-basalt-50 px-2.5 py-1 text-[11px] font-medium leading-[14px] text-ink-secondary">
              {t("breadcrumbOffPlan")}
            </span>
            <Icon name="building" className="h-6 w-6 shrink-0 text-brand" />
          </div>
          <div>
            <h3 className="text-xl font-bold leading-[26px] text-brand">{title}</h3>
            <p className="mt-3 flex items-center gap-1 text-body-sm text-ink-tertiary">
              <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-brand" />
              {location}
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-start justify-between gap-4 pt-2">
            <div>
              <p className="text-xs leading-4 text-ink-tertiary">{t("handoverLabel")}</p>
              <p className="mt-2 text-[15px] font-semibold leading-[22px] tracking-[-0.01em] text-brand">
                {handover}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs leading-4 text-ink-tertiary">{t("startingFrom")}</p>
              <p className="mt-2 flex items-center justify-end gap-2 text-xl font-bold leading-[26px] text-brand">
                <Icon name="currency" className="h-[18px] w-[18px] shrink-0" />
                {displayPrice}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-[2px] bg-basalt-50 px-2.5 py-1 text-[11px] font-medium leading-[14px] text-ink-secondary">
              {t("paymentPlanAvailable")}
            </span>
            {href ? (
              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold leading-4 text-accent">
                {t("exploreProperty")} <Icon name="arrowRight" className="h-4 w-4" />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2">
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
      className={cn(
        "flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover,0_8px_24px_rgba(15,23,42,0.12))]",
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
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <ImagePlaceholder />
      )}
      <div className="flex flex-1 flex-col justify-between px-6 pb-2 pt-6">
        <p className="text-overline font-semibold uppercase text-accent">
          {category}
        </p>
        <h3 className="mt-4 text-xl font-bold leading-[26px] text-brand">
          {title}
        </h3>
        <p className="mt-4 text-[13px] leading-[18px] text-ink-secondary">
          {excerpt}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4 text-[11px] font-medium leading-[14px] text-platinum-400">
          <span>{readTime} | NIP Advisory</span>
          {href ? (
            <span className="inline-flex items-center gap-1 text-[13px] leading-[18px] text-accent">
              {t("readInsight")} <Icon name="arrowRight" className="h-4 w-4" />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2">
        {card}
      </Link>
    );
  }

  return card;
}

export function AdvisorCard({ title, excerpt, className }: AdvisorCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-sapphire-800 p-2 text-white shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <ImagePlaceholder dark />
      <div className="flex flex-1 flex-col justify-between px-6 pb-4 pt-6">
        <span className="inline-flex w-fit rounded-[2px] bg-white/20 px-2.5 py-1 text-[11px] font-medium uppercase leading-[14px]">
          Private
        </span>
        <h3 className="mt-4 text-xl font-bold leading-[26px]">{title}</h3>
        <p className="mt-4 text-[13px] leading-[18px] text-accent-on-dark">
          {excerpt}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-[11px] font-medium leading-[14px] text-platinum-400">
            <Icon name="lock" className="h-3.5 w-3.5" />
            Advisor-Released
          </span>
          <Button variant="accent" size="sm">
            View <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
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
  const leftFacts = facts.slice(0, 2);
  const rightFacts = facts.slice(2, 4);

  return (
    <article
      className={cn(
        "flex h-full min-h-[440px] flex-col rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <CardImage imageUrl={imageUrl} alt={title} icon="mapPin" />
      <div className="flex flex-1 flex-col justify-between px-6 pb-4 pt-6">
        <div className="space-y-5">
          <h3 className="flex items-center gap-1.5 text-xl font-bold leading-[26px] text-brand">
            <Icon name="mapPin" className="h-[18px] w-[18px] shrink-0" />
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
                    className="h-[18px] w-[18px] shrink-0 text-brand"
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
                    className="h-[18px] w-[18px] shrink-0 text-brand"
                  />
                  {fact}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="rounded-[2px] bg-basalt-50 px-2.5 py-1 text-[11px] font-medium leading-[14px] text-ink-secondary">
            {projectCount}
          </span>
          <Button
            href={href}
            variant="link"
            className="shrink-0 text-xs font-semibold leading-4 text-accent"
          >
            Explore Area <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
