import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EditableText } from "@/components/EditableText";
import { SiteShell } from "@/components/SiteShell";
import {
  OffPlanRegisterInterestButton,
  OffPlanRegisterInterestCta,
} from "@/components/sections/OffPlanRegisterInterest";
import {
  AvailableUnitsTable,
  MasterplanLocationSection,
  OffPlanDescriptionSection,
} from "@/components/sections/OffPlanStorySections";
import { PaymentPlanSection } from "@/components/sections/PaymentPlanSection";
import { PropertyGallery } from "@/components/sections/PropertyStorySections";
import {
  Badge,
  Breadcrumbs,
  CenteredCardGrid,
  FactsStrip,
  Icon,
  OffPlanCard,
  PropertyDetailHeroAside,
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
import { getSiteUrl } from "@/lib/site-url";
import {
  formatAedPrice,
  isOffPlanProperty,
  mapPropertyToGalleryItems,
  mapPropertyToOffPlanCard,
  resolvePropertyQrCodeUrl,
  showsAvailableUnits,
} from "@/lib/mappers/property";
import { resolvePropertyTags } from "@/lib/mappers/property-tags";
import {
  hasBackendPaymentPlan,
  offPlanFactsFromApi,
  offPlanLocationLine,
  resolveAvailableUnitsFromApi,
  resolvePaymentPlanGroups,
  type OffPlanDetailLabels,
} from "@/lib/off-plan/detail";

type OffPlanDetailPageProps = {
  locale: Locale;
  slug: string;
};

export async function OffPlanDetailPage({ locale, slug }: OffPlanDetailPageProps) {
  const property = await getPropertyBySlug(slug, locale);
  if (!property || !isOffPlanProperty(property)) notFound();

  const similar = await getSimilarPropertiesFor(property, locale, "offplan");
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
  const paymentPlans = hasBackendPaymentPlan(property)
    ? resolvePaymentPlanGroups(property, labels)
    : [];
  const units = showsAvailableUnits(property)
    ? resolveAvailableUnitsFromApi(property)
    : [];

  const galleryImages = mapPropertyToGalleryItems(property);

  // Masterplan render only — the map below covers location, so a location photo
  // must not stand in for the plan.
  const masterPlanImageUrl = resolveMediaUrl(property.master_plan_image_url);

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${localizedHref(locale, `/off-plan/${slug}`)}`;
  const areaLabel = property.area?.name ?? property.location ?? property.title;
  const handoverBadge = property.handover_quarter
    ? `${property.handover_quarter} ${t("handoverLabel")}`
    : null;
  const tagLabels = resolvePropertyTags(property);
  const qrCodeUrl = resolvePropertyQrCodeUrl(property);

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
                  {tagLabels.map((tag) => (
                    <Badge key={tag.slug} tone="property">
                      {tag.label}
                    </Badge>
                  ))}
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

              <PropertyDetailHeroAside
                priceLabel={t("startingFrom")}
                price={formatAedPrice(property.price ?? null)}
                qrCodeUrl={qrCodeUrl}
                qrAlt={`${property.title} QR code`}
              >
                <OffPlanRegisterInterestButton
                  propertyId={property.id}
                  pageUrl={pageUrl}
                  label={t("registerInterest")}
                  modalTitle={t("registerInterestEyebrow")}
                  className="w-auto shrink-0"
                />
              </PropertyDetailHeroAside>
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
            <OffPlanDescriptionSection
              title={t("overviewTitle")}
              description={property.description}
            />
            {paymentPlans.length > 0 ? (
              <PaymentPlanSection title={t("paymentPlanTitle")} plans={paymentPlans} />
            ) : null}
            {units.length > 0 ? (
              <AvailableUnitsTable
                title={t("availableUnitsTitle")}
                unitTypeLabel={t("unitType")}
                sizeLabel={t("sizeSqft")}
                startingPriceLabel={t("startingPrice")}
                units={units}
              />
            ) : null}
            <MasterplanLocationSection
              title={t("masterplanTitle")}
              imageUrl={masterPlanImageUrl}
              latitude={property.latitude}
              longitude={property.longitude}
              locationName={property.location ?? property.area?.name ?? undefined}
              propertyTitle={property.title}
              locale={locale}
              facilities={property.facilities}
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
            relUrl={pageBlockKeys.offPlan.relUrl}
            blockKey={pageBlockKeys.offPlan.detailCta.title}
            locale={locale}
            placeholderContent={t("registerInterestTitle")}
            placeholderTag="h2"
            className="max-w-[720px] font-[family-name:var(--font-display)] text-[44px] uppercase leading-[52px] tracking-[-0.04em] text-white"
          />
        }
        modalTitle={t("registerInterestEyebrow")}
      />

      {similar.length > 0 ? (
        <section className="bg-sapphire-50 pb-20 pt-16">
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={cn(sitePageInnerClassName, "space-y-7")}>
              <p className="text-center text-overline font-semibold leading-4 text-accent">
                {t("moreOffPlanProjects")}
              </p>
              <CenteredCardGrid gap="section" data-reveal-stagger>
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
              </CenteredCardGrid>
            </div>
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
