import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import {
  PropertyAdvisoryCard,
  PropertyGallery,
  PropertyStoryContent,
} from "@/components/sections/PropertyStorySections";
import { SavePropertyButton } from "@/components/sections/SavePropertyButton";
import {
  Badge,
  Breadcrumbs,
  Button,
  CenteredCardGrid,
  FactsStrip,
  Icon,
  PropertyCard,
} from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { resolveMediaUrl } from "@/lib/api/media-url";
import { getMemberSavedStatus } from "@/lib/api/member";
import { getPropertyBySlug, getSimilarPropertiesFor } from "@/lib/api/properties";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { isRentalProperty, mapPropertyToCard, mapPropertyToGalleryItems, showsAvailableUnits } from "@/lib/mappers/property";
import { getMemberToken } from "@/lib/member/auth.server";
import {
  rentalFactsFromApi,
  rentalHighlightsLine,
  rentalPriceEyebrowKey,
  resolveRentalAvailableUnitsFromApi,
  resolveRentalPriceLabel,
  type RentalDetailLabels,
} from "@/lib/rental/detail";
import { getSiteUrl } from "@/lib/site-url";

type RentalDetailPageProps = {
  locale: Locale;
  slug: string;
};

export async function RentalDetailPage({ locale, slug }: RentalDetailPageProps) {
  const property = await getPropertyBySlug(slug, locale);
  if (!property || !isRentalProperty(property)) notFound();

  const similar = await getSimilarPropertiesFor(property, locale, "rental");
  const listHref = localizedHref(locale, "/properties?listing_type=rental");
  const t = await getTranslations({ locale, namespace: "catalog" });
  const labels: RentalDetailLabels = {
    bedroomLabel: t("bedroomLabel"),
    bathroomLabel: t("bathroomLabel"),
    areaLabel: t("totalAreaLabel"),
    typeLabel: t("propertyTypeLabel"),
    furnishingLabel: t("furnishingLabel"),
    referenceLabel: t("referenceLabel"),
    chequesLabel: (count) => t("chequesLabel", { count }),
    chequesFactLabel: t("chequesFactLabel"),
    pricePerYear: t("pricePerYear"),
    pricePerMonth: t("pricePerMonth"),
  };
  const rentalCardLabels = {
    pricePerYear: labels.pricePerYear,
    pricePerMonth: labels.pricePerMonth,
  };
  const facts = rentalFactsFromApi(property, labels);
  const highlights = rentalHighlightsLine(property, labels);
  const priceEyebrowKey = rentalPriceEyebrowKey(property);
  const priceLabel = resolveRentalPriceLabel(property, labels);
  const availableUnits = showsAvailableUnits(property)
    ? resolveRentalAvailableUnitsFromApi(property, labels)
    : undefined;

  const galleryImages = mapPropertyToGalleryItems(property);
  const locationImageUrl = resolveMediaUrl(property.location_image_url);
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${localizedHref(locale, `/rental/${slug}`)}`;
  const areaLabel = property.area?.name ?? property.location ?? property.title;

  const memberToken = await getMemberToken();
  let initialSaved = false;
  if (memberToken) {
    try {
      const status = await getMemberSavedStatus(memberToken, property.id);
      initialSaved = status.saved;
    } catch {
      initialSaved = false;
    }
  }

  return (
    <SiteShell>
      <section className="bg-white pb-6 pt-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
              <div className="flex max-w-[614px] flex-col gap-5">
                <Breadcrumbs
                  format="property"
                  items={[
                    { label: t("breadcrumbProperties"), href: localizedHref(locale, "/properties") },
                    { label: t("breadcrumbRental"), href: listHref },
                    { label: areaLabel },
                  ]}
                />
                <div className="flex flex-wrap gap-2">
                  <Badge tone="property">{t("breadcrumbRental")}</Badge>
                  {property.type ? <Badge tone="property">{property.type}</Badge> : null}
                  {property.purpose ? <Badge tone="property">{property.purpose}</Badge> : null}
                </div>
                <h1 className="m-0 text-property-h1">{property.title}</h1>
                {property.location ? (
                  <p className="m-0 flex items-center gap-1.5 text-body-sm text-ink-tertiary">
                    <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-accent" />
                    {property.location}
                  </p>
                ) : null}
                {property.reference_no ? (
                  <p className="m-0 text-label-muted text-text-inactive">
                    {t("referenceLabel")}: {property.reference_no}
                  </p>
                ) : null}
                {highlights ? (
                  <p className="m-0 text-body-sm text-ink-secondary">{highlights}</p>
                ) : null}
              </div>

              <div className="flex w-full shrink-0 flex-col gap-4 lg:w-auto lg:items-end">
                <p className="m-0 text-label-muted font-medium lg:text-end">
                  {t(priceEyebrowKey)}
                </p>
                <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:flex-col lg:items-end lg:justify-start lg:gap-4">
                  <div className="flex h-5 items-center overflow-visible text-heading-h1 font-bold tracking-normal text-brand lg:justify-end">
                    <span className="whitespace-nowrap">{priceLabel}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {memberToken ? (
                      <SavePropertyButton
                        propertyId={property.id}
                        initialSaved={initialSaved}
                        labels={{
                          save: t("saveProperty"),
                          saved: t("savedProperty"),
                          remove: t("removeSavedProperty"),
                        }}
                      />
                    ) : null}
                    <Button href={localizedHref(locale, "/contact")}>
                      {t("requestAdvisory")}
                    </Button>
                  </div>
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

      {facts.length > 0 ? (
        <section className="bg-white pb-10">
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={cn(sitePageInnerClassName, "w-full")}>
              <FactsStrip className="w-full" items={facts} variant="rental-detail" />
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
              availableUnits={availableUnits}
              locationNote={property.about_location ?? undefined}
              locationImageUrl={locationImageUrl}
              latitude={property.latitude}
              longitude={property.longitude}
              locationName={property.location ?? undefined}
              propertyTitle={property.title}
              locale={locale}
              labels={{
                storyTitle: t("storyTitle"),
                amenitiesTitle: t("amenitiesTitle"),
                locationTitle: t("locationTitle"),
                openInGoogleMaps: t("openInGoogleMaps"),
                availableUnitsTitle: t("availableUnitsTitle"),
                unitTypeLabel: t("unitType"),
                sizeLabel: t("sizeSqft"),
                startingPriceLabel: t("startingPrice"),
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

      {similar.length > 0 ? (
        <section className="bg-sapphire-50 pb-20 pt-16">
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={cn(sitePageInnerClassName, "space-y-7")}>
              <p className="text-center text-overline font-semibold leading-4 text-accent">
                {t("moreRentalProperties")}
              </p>
              <CenteredCardGrid gap="section" data-reveal-stagger>
                {similar.slice(0, 3).map((item) => (
                  <PropertyCard
                    key={item.id}
                    className="min-h-[480px]"
                    {...mapPropertyToCard(item, locale, rentalCardLabels)}
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
