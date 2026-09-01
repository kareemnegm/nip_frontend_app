import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EditableText } from "@/components/EditableText";
import { SiteShell } from "@/components/SiteShell";
import {
  OffPlanRegisterInterestButton,
  OffPlanRegisterInterestCta,
} from "@/components/sections/OffPlanRegisterInterest";
import { PaymentPlanSection } from "@/components/sections/PaymentPlanSection";
import {
  PropertyAdvisoryCard,
  PropertyGallery,
  PropertyStoryContent,
} from "@/components/sections/PropertyStorySections";
import {
  Badge,
  Breadcrumbs,
  CenteredCardGrid,
  CurrencyIcon,
  Icon,
  PropertyCard,
} from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { resolveMediaUrl } from "@/lib/api/media-url";
import { getPropertyBySlug, getSimilarPropertiesFor } from "@/lib/api/properties";
import { cn } from "@/lib/cn";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import {
  formatAedPrice,
  isResaleProperty,
  mapPropertyToCard,
  mapPropertyToGalleryItems,
} from "@/lib/mappers/property";
import {
  hasBackendPaymentPlan,
  offPlanLocationLine,
  resolvePaymentPlanGroups,
  type PaymentPlanLabels,
} from "@/lib/off-plan/detail";
import { getSiteUrl } from "@/lib/site-url";

type ResaleDetailPageProps = {
  locale: Locale;
  slug: string;
};

/**
 * Resale detail layout — the off-plan page's structure with resale content:
 * the hero shows the current asking price ("Selling Price"), the facts strip
 * shows real unit data led by the original price, and the off-plan-only
 * Available Units section is omitted. Payment Plan renders only when the backend
 * ships one for the listing. The Story / Amenities / Location column (map
 * included) and the "Arrange a viewing" advisory card are the same block the
 * properties detail page uses — there is no masterplan here.
 */
export async function ResaleDetailPage({ locale, slug }: ResaleDetailPageProps) {
  const property = await getPropertyBySlug(slug, locale);
  if (!property || !isResaleProperty(property)) notFound();

  const similar = await getSimilarPropertiesFor(property, locale, "resale");
  const listHref = localizedHref(locale, "/properties?listing_type=resale");
  const t = await getTranslations({ locale, namespace: "catalog" });

  // Resale plans come from the backend only — never fall back to the off-plan 10/20/30/40 default.
  const paymentPlanLabels: PaymentPlanLabels = {
    paymentStep1Caption: t("paymentStep1Caption"),
    paymentStep1Label: t("paymentStep1Label"),
    paymentStep2Caption: t("paymentStep2Caption"),
    paymentStep2Label: t("paymentStep2Label"),
    paymentStep3Caption: t("paymentStep3Caption"),
    paymentStep3Label: t("paymentStep3Label"),
    paymentStep4Caption: t("paymentStep4Caption"),
    paymentStep4Label: t("paymentStep4Label"),
  };
  const paymentPlans = hasBackendPaymentPlan(property)
    ? resolvePaymentPlanGroups(property, paymentPlanLabels)
    : [];

  const galleryImages = mapPropertyToGalleryItems(property);

  const locationImageUrl = resolveMediaUrl(property.location_image_url);

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${localizedHref(locale, `/resale/${slug}`)}`;
  const areaLabel = property.area?.name ?? property.location ?? property.title;

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
                    { label: t("breadcrumbProperties"), href: listHref },
                    { label: t("breadcrumbResale"), href: listHref },
                    { label: areaLabel },
                  ]}
                />
                <div className="flex flex-wrap gap-2">
                  <Badge tone="property">{t("breadcrumbResale")}</Badge>
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-heading-h1 uppercase text-brand">
                  {property.title}
                </h1>
                <p className="flex items-center gap-1.5 text-body-sm text-ink-tertiary">
                  <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-accent" />
                  {offPlanLocationLine(property)}
                </p>
              </div>

              <div className="flex w-full flex-col gap-4 lg:w-auto lg:items-end">
                <p className="text-label-muted font-medium uppercase text-basalt-300 lg:text-end">
                  {t("sellingPrice")}
                </p>
                {/* Mobile: price + CTA on one row. Desktop: stacked & right-aligned. */}
                <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:flex-col lg:items-end lg:justify-start lg:gap-4">
                  {/* Figma 1525:28125 — h-[20px] so 16px flex gaps stay tight despite 38px leading */}
                  <div className="flex h-5 items-center gap-2 overflow-visible text-heading-h1 font-bold tracking-normal text-brand lg:justify-end">
                    <CurrencyIcon currency="AED" className="h-6 w-6 shrink-0" />
                    <span className="whitespace-nowrap">
                      {formatAedPrice(property.price ?? null)}
                    </span>
                  </div>
                  <OffPlanRegisterInterestButton
                    propertyId={property.id}
                    pageUrl={pageUrl}
                    label={t("registerInterest")}
                    modalTitle={t("privateViewingTitle")}
                    className="w-auto shrink-0"
                  />
                </div>
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

      {paymentPlans.length > 0 ? (
        <section className="bg-white pb-[72px]">
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={sitePageInnerClassName}>
              <PaymentPlanSection title={t("paymentPlanTitle")} plans={paymentPlans} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white pb-[72px]">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div
            className={cn(
              sitePageInnerClassName,
              "flex flex-col gap-12 lg:flex-row lg:gap-24",
            )}
          >
            <PropertyStoryContent
              description={property.description ?? undefined}
              facilities={property.facilities}
              locationNote={property.about_location ?? undefined}
              locationImageUrl={locationImageUrl}
              latitude={property.latitude}
              longitude={property.longitude}
              locationName={property.location ?? property.area?.name ?? undefined}
              propertyTitle={property.title}
              locale={locale}
              labels={{
                storyTitle: t("storyTitle"),
                amenitiesTitle: t("amenitiesTitle"),
                locationTitle: t("locationTitle"),
                openInGoogleMaps: t("openInGoogleMaps"),
              }}
            />
            <PropertyAdvisoryCard
              propertyId={property.id}
              pageUrl={pageUrl}
              labels={{
                eyebrow: t("arrangeViewing"),
                description: t("advisoryDescription"),
                advisoryName: t("advisoryName"),
                advisoryResponds: t("advisoryResponds"),
                requestDetails: t("requestDetails"),
                modalTitle: t("privateViewingTitle"),
              }}
            />
          </div>
        </div>
      </section>

      <OffPlanRegisterInterestCta
        propertyId={property.id}
        pageUrl={pageUrl}
        eyebrow={t("registerInterestEyebrow")}
        title={
          <EditableText
            relUrl={pageBlockKeys.resale.relUrl}
            blockKey={pageBlockKeys.resale.detailCta.title}
            locale={locale}
            placeholderContent={t("registerInterestTitle")}
            placeholderTag="h2"
            className="max-w-[720px] font-[family-name:var(--font-display)] text-display-lg uppercase tracking-[-0.04em] text-white"
          />
        }
        modalTitle={t("privateViewingTitle")}
      />

      {similar.length > 0 ? (
        <section className="bg-sapphire-50 pb-20 pt-16">
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={cn(sitePageInnerClassName, "space-y-7")}>
              <p className="text-center text-overline font-semibold leading-4 text-accent">
                {t("moreResaleProperties")}
              </p>
              <CenteredCardGrid gap="section" data-reveal-stagger>
                {similar.slice(0, 3).map((item) => (
                  <PropertyCard
                    key={item.id}
                    className="min-h-[480px]"
                    {...mapPropertyToCard(item, locale)}
                  />
                ))}
              </CenteredCardGrid>
            </div>
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
