"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cardTypography } from "@/components/ui/Cards";
import { CurrencyIcon } from "@/components/ui/CurrencyIcon";
import { Icon } from "@/components/ui/Icon";
import { stripCurrencyPrefix } from "@/lib/i18n/currency-icon";
import { cn } from "@/lib/cn";
import type { PropertyCardModel } from "@/lib/mappers/property";

type ConciergePropertyCardProps = PropertyCardModel & {
  className?: string;
};

function ConciergeCardImage({
  imageUrl,
  alt,
}: {
  imageUrl?: string;
  alt: string;
}) {
  if (imageUrl) {
    return (
      <div className="relative h-[236px] w-full shrink-0 overflow-hidden rounded-[4px]">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="408px"
        />
      </div>
    );
  }

  return (
    <div className="flex h-[236px] w-full shrink-0 items-center justify-center rounded-[4px] bg-basalt-100">
      <Icon name="home" className="h-[70px] w-[70px] text-white" />
    </div>
  );
}

export function ConciergePropertyCard({
  title,
  location,
  price,
  href,
  imageUrl,
  meta = [],
  badges = [],
  className,
}: ConciergePropertyCardProps) {
  const t = useTranslations("catalog");
  const displayPrice = stripCurrencyPrefix(price, "AED");

  const card = (
    <article
      className={cn(
        cardTypography.shell,
        "w-full max-w-[408px] shadow-[0_2px_4px_rgba(18,51,94,0.06)]",
        href && "cursor-pointer",
        className,
      )}
    >
      <ConciergeCardImage imageUrl={imageUrl} alt={title} />
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
              <CurrencyIcon currency="AED" className={cardTypography.priceIcon} />
              {displayPrice}
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
              <span className={cardTypography.cta}>
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
      <Link
        href={href}
        className="block w-full max-w-[408px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
      >
        {card}
      </Link>
    );
  }

  return card;
}
