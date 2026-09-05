"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { InsightCardProps } from "./Cards";
import { CardLink, cardTypography } from "./Cards";
import { Icon } from "./Icon";

/**
 * Figma Card / Insight — Related Insights only (node 1525:27618).
 * Pixel structure: p 8 · image 220 · description pt 24 / px 24 / pb 8 · footer pt 4.
 * Does not replace the main listing/carousel `InsightCard`.
 */
export function RelatedInsightCard({
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

  const card = (
    <article
      data-reveal="slide-x"
      className={cn(
        "flex h-full min-h-[440px] w-full flex-col items-start rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover,0_8px_24px_rgba(15,23,42,0.12))]",
        href && "cursor-pointer",
        className,
      )}
    >
      {showImage ? (
        <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-[4px] bg-basalt-100">
          <Image
            src={imageUrl!}
            alt={title}
            fill
            className="motion-card-image object-cover object-center"
            sizes="(max-width: 768px) 100vw, 344px"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="flex h-[220px] w-full shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-basalt-100">
          <Icon name="image" className="h-[100px] w-[100px] text-white" />
        </div>
      )}

      {/* Description — Figma: items-start + justify-between, pt 24, px 24, pb 8 */}
      <div className="flex min-h-px w-full flex-1 flex-col items-start justify-between overflow-hidden px-6 pt-6 pb-2 text-start">
        <p className="w-full shrink-0 text-overline font-semibold uppercase text-accent">
          {category}
        </p>
        <h3 className="w-full shrink-0 line-clamp-2 text-h3 font-bold text-brand">
          {title}
        </h3>
        <p className="w-full shrink-0 line-clamp-2 text-body-sm text-ink-secondary">
          {excerpt}
        </p>

        {/* Mobile: stack meta + CTA. sm+: meta left, CTA right — ms-auto keeps label+arrow
            together; justify-between was clipping the arrow at the card edge. */}
        <div className="flex w-full shrink-0 flex-col items-start gap-2 overflow-visible pt-1 sm:flex-row sm:items-center sm:gap-4">
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
                "motion-link-arrow inline-flex shrink-0 items-center gap-1 whitespace-nowrap py-2 sm:ms-auto sm:ps-2",
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
