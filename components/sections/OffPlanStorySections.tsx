import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AmenityIcon } from "@/components/ui/AmenityIcon";
import { Icon } from "@/components/ui/Icon";
import { PropertyMap } from "@/components/ui/PropertyMap";
import { hasValidCoordinates } from "@/lib/maps/coordinates";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { localizedHref } from "@/lib/i18n/helpers";
import type { Locale } from "@/lib/i18n/config";
import {
  paymentPlanCardColors,
  type AvailableUnitRow,
  type PaymentPlanStep,
} from "@/lib/off-plan/detail";
import type { ApiFacility } from "@/types/api/property";

export function PaymentPlanSection({
  title,
  steps,
  className,
}: {
  title: string;
  steps: PaymentPlanStep[];
  className?: string;
}) {
  return (
    <section className={cn("space-y-7", className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <article
            key={`${step.percentage}-${step.label}-${index}`}
            className={cn(
              "flex min-h-[160px] flex-col justify-between rounded-[var(--radius-card)] p-6 text-white",
              paymentPlanCardColors[index % paymentPlanCardColors.length],
            )}
          >
            {step.caption ? (
              <p className="text-xs leading-4 text-white/80">{step.caption}</p>
            ) : (
              <span aria-hidden />
            )}
            <p className="text-[36px] font-bold leading-[44px] tracking-[-0.02em]">
              {step.percentage}
            </p>
            <p className="text-sm font-medium leading-5">{step.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AvailableUnitsTable({
  title,
  unitTypeLabel,
  sizeLabel,
  startingPriceLabel,
  units,
  className,
}: {
  title: string;
  unitTypeLabel: string;
  sizeLabel: string;
  startingPriceLabel: string;
  units: AvailableUnitRow[];
  className?: string;
}) {
  return (
    <section className={cn("space-y-7", className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
        {title}
      </h2>
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
        <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-brand px-6 py-4 text-xs font-semibold uppercase leading-4 tracking-[0.04em] text-white">
          <span>{unitTypeLabel}</span>
          <span>{sizeLabel}</span>
          <span className="text-end">{startingPriceLabel}</span>
        </div>
        {units.map((unit, index) => (
          <div
            key={`${unit.unit_type}-${index}`}
            className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-line px-6 py-4 text-sm leading-5 text-ink-secondary last:border-b-0"
          >
            <span className="font-medium text-brand">{unit.unit_type}</span>
            <span>{unit.size_sqft}</span>
            <span className="text-end font-semibold text-brand">{unit.starting_price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MasterplanLocationSection({
  title,
  imageUrl,
  latitude,
  longitude,
  locationName,
  propertyTitle,
  locale = "en",
  facilities,
  className,
}: {
  title: string;
  imageUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  locationName?: string;
  propertyTitle?: string;
  locale?: string;
  facilities?: ApiFacility[] | null;
  className?: string;
}) {
  const items = facilities?.filter((item) => item.facility?.trim()) ?? [];
  const hasMapCoordinates = hasValidCoordinates(latitude, longitude);

  return (
    <section className={cn("space-y-7", className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
        {title}
      </h2>
      {hasMapCoordinates ? (
        <PropertyMap
          latitude={latitude}
          longitude={longitude}
          label={title}
          locationName={locationName}
          propertyTitle={propertyTitle}
          locale={locale}
          className="h-[420px]"
        />
      ) : (
        <div className="relative h-[420px] overflow-hidden rounded-[var(--radius-card)] border border-line shadow-[var(--shadow-card)]">
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
      )}
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-[10px]">
          {items.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-2 rounded bg-basalt-50 py-2 pl-3 pr-4 text-[11px] font-medium leading-[14px] text-ink-secondary"
            >
              <AmenityIcon facility={item.facility} />
              {item.facility}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export async function ProjectRegisterCta({ locale = "en" }: { locale?: Locale }) {
  const t = await getTranslations({ locale, namespace: "catalog" });
  const contactHref = localizedHref(locale, "/contact");

  return (
    <section className="bg-brand py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-center gap-10 text-center",
          )}
        >
          <div className="max-w-[608px] space-y-4">
            <p className="text-overline font-semibold text-[#8fb0dc]">
              {t("registerInterestEyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-white">
              {t("offPlanListingCtaTitle")}
            </h2>
          </div>
          <Link
            href={contactHref}
            className="inline-flex items-center justify-center rounded-[var(--radius-field)] bg-white px-6 py-[9px] text-xs font-semibold leading-4 text-brand transition-colors hover:bg-sapphire-50"
          >
            {t("speakWithNipCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
