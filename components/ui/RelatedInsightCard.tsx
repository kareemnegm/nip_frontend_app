"use client";

import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { InsightCardProps } from "./Cards";
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
      data-reveal
      className={cn(
        "flex h-full min-h-[440px] w-full flex-col items-start rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-card)]",
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
            className="object-cover object-center"
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

        {/* Footer — Figma: justify-between, pt 4 */}
        <div className="flex w-full shrink-0 items-center justify-between overflow-hidden pt-1">
          <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-label-muted font-medium text-platinum-400">
            <span>{readTime}</span>
            <span aria-hidden>|</span>
            <span>{author}</span>
          </div>
          {href ? (
            <span className="inline-flex shrink-0 items-center justify-center gap-1 py-2 ps-2 text-label-semibold font-semibold whitespace-nowrap text-accent">
              {t("readInsight")}
              <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
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
