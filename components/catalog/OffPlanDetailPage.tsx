import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import {
  OffPlanRegisterInterestButton,
  OffPlanRegisterInterestCta,
} from "@/components/sections/OffPlanRegisterInterest";
import {
  AvailableUnitsTable,
  MasterplanLocationSection,
  PaymentPlanSection,
} from "@/components/sections/OffPlanStorySections";
import { PropertyGallery } from "@/components/sections/PropertyStorySections";
import {
  Badge,
  Breadcrumbs,
  CurrencyIcon,
  FactsStrip,
  Icon,
  OffPlanCard,
} from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { resolveMediaUrl } from "@/lib/api/media-url";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/api/properties";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import {
  formatAedPrice,
  isOffPlanProperty,
  mapPropertyToOffPlanCard,
} from "@/lib/mappers/property";
import {
  offPlanFactsFromApi,
  offPlanLocationLine,
  resolvePaymentPlan,
  resolveUnits,
  type OffPlanDetailLabels,
} from "@/lib/off-plan/detail";
import type { PropertyGalleryImage } from "@/types/api/property";

type OffPlanDetailPageProps = {
  locale: Locale;
  slug: string;
};

export async function OffPlanDetailPage({ locale, slug }: OffPlanDetailPageProps) {
  const property = await getPropertyBySlug(slug, locale);
  if (!property || !isOffPlanProperty(property)) notFound();

  const similar = (await getSimilarProperties(slug, locale)).filter((item) =>
    isOffPlanProperty(item),
  );
  const listHref = localizedHref(locale, "/off-plan");
  const t = await getTranslations({ locale, namespace: "catalog" });
  const labels: OffPlanDetailLabels = {
    developerFactLabel: t("developerFactLabel"),
    handoverFactLabel: t("handoverFactLabel"),
    unitTypesLabel: t("unitTypesLabel"),
    startingFromFactLabel: t("startingFromFactLabel"),
    paymentLabel: t("paymentLabel"),
    statusLabel: t("statusLabel"),
    statusOffPlan: t("statusOffPlan"),
    paymentStep1Caption: t("paymentStep1Caption"),
    paymentStep1Label: t("paymentStep1Label"),
    paymentStep2Caption: t("paymentStep2Caption"),
    paymentStep2Label: t("paymentStep2Label"),
    paymentStep3Caption: t("paymentStep3Caption"),
    paymentStep3Label: t("paymentStep3Label"),
    paymentStep4Caption: t("paymentStep4Caption"),
    paymentStep4Label: t("paymentStep4Label"),
    defaultUnit1Type: t("defaultUnit1Type"),
    defaultUnit1Size: t("defaultUnit1Size"),
    defaultUnit2Type: t("defaultUnit2Type"),
    defaultUnit2Size: t("defaultUnit2Size"),
    defaultUnit3Type: t("defaultUnit3Type"),
    defaultUnit3Size: t("defaultUnit3Size"),
    defaultUnit4Type: t("defaultUnit4Type"),
    defaultUnit4Size: t("defaultUnit4Size"),
  };
  const facts = offPlanFactsFromApi(property, labels);
  const paymentPlan = resolvePaymentPlan(property, labels);
  const units = resolveUnits(property, labels);

  const galleryImages: PropertyGalleryImage[] = (() => {
    if (property.images?.length) {
      return property.images.flatMap((image) => {
        const url = resolveMediaUrl(image.image_url);
        return url ? [{ url, type: image.type }] : [];
      });
    }

    const fallback = resolveMediaUrl(property.image_url);
    return fallback ? [{ url: fallback }] : [];
  })();

  const masterPlanImageUrl =
    resolveMediaUrl(property.master_plan_image_url) ??
    resolveMediaUrl(property.location_image_url);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageUrl = `${siteUrl}${localizedHref(locale, `/off-plan/${slug}`)}`;
  const areaLabel = property.area?.name ?? property.location ?? property.title;
  const handoverBadge = property.handover_quarter
    ? `${property.handover_quarter} ${t("handoverLabel")}`
    : null;

  return (
    <SiteShell>
      <section className="bg-white pb-6 pt-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
              <div className="flex max-w-[614px] flex-col gap-5">
                <Breadcrumbs
                  format="property"
                  items={[
                    { label: t("breadcrumbOffPlan"), href: listHref },
                    { label: t("breadcrumbFeaturedProjects"), href: listHref },
                    { label: areaLabel },
                  ]}
                />
                <div className="flex flex-wrap gap-2">
                  <Badge tone="property">{t("breadcrumbOffPlan")}</Badge>
                  {handoverBadge ? <Badge tone="property">{handoverBadge}</Badge> : null}
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
                  {property.title}
                </h1>
                <p className="flex items-center gap-1.5 text-body-sm text-ink-tertiary">
                  <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-accent" />
                  {offPlanLocationLine(property)}
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 lg:items-end">
                <p className="text-[11px] font-medium uppercase leading-[14px] text-basalt-300 lg:text-end">
                  {t("startingFrom")}
                </p>
                <p className="flex items-center gap-2 text-[30px] font-bold leading-[38px] text-brand">
                  <CurrencyIcon currency="AED" className="h-6 w-6 shrink-0" />
                  {formatAedPrice(property.price ?? null)}
                </p>
                <OffPlanRegisterInterestButton
                  propertyId={property.id}
                  pageUrl={pageUrl}
                  label={t("registerInterest")}
                  modalTitle={t("privateViewingTitle")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-8">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <PropertyGallery images={galleryImages} title={property.title} />
          </div>
        </div>
      </section>

      {facts.length > 0 ? (
        <section className="bg-white pb-10">
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={sitePageInnerClassName}>
              <FactsStrip items={facts} variant="property" />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white pb-[72px]">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-16")}>
            <PaymentPlanSection title={t("paymentPlanTitle")} steps={paymentPlan} />
            <AvailableUnitsTable
              title={t("availableUnitsTitle")}
              unitTypeLabel={t("unitType")}
              sizeLabel={t("sizeSqft")}
              startingPriceLabel={t("startingPrice")}
              units={units}
            />
            <MasterplanLocationSection
              title={t("masterplanTitle")}
              imageUrl={masterPlanImageUrl}
              latitude={property.latitude}
              longitude={property.longitude}
              locationName={property.location ?? property.area?.name ?? undefined}
              mapsLinkLabel={t("openInGoogleMaps")}
              facilities={property.facilities}
            />
          </div>
        </div>
      </section>

      <OffPlanRegisterInterestCta
        propertyId={property.id}
        pageUrl={pageUrl}
        eyebrow={t("registerInterestEyebrow")}
        title={t("registerInterestTitle")}
        modalTitle={t("privateViewingTitle")}
      />

      {similar.length > 0 ? (
        <section className="bg-sapphire-50 pb-20 pt-16">
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={cn(sitePageInnerClassName, "space-y-7")}>
              <p className="text-center text-overline font-semibold leading-4 text-accent">
                {t("moreOffPlanProjects")}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {similar.slice(0, 3).map((item) => {
                  const card = mapPropertyToOffPlanCard(item, locale);
                  return (
                    <OffPlanCard
                      key={item.id}
                      className="min-h-[480px]"
                      title={card.title}
                      location={card.location}
                      price={card.price}
                      handover={card.handover ?? "On Request"}
                      href={card.href}
                      imageUrl={card.imageUrl}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
