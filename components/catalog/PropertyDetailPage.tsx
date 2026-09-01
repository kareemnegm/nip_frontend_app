import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PropertyInquiryForm } from "@/components/forms/InquiryForms";
import { SiteShell } from "@/components/SiteShell";
import {
  PropertyAdvisoryCard,
  PropertyGallery,
  PropertyStoryContent,
  PropertyViewingCard,
} from "@/components/sections/PropertyStorySections";
import { SavePropertyButton } from "@/components/sections/SavePropertyButton";
import {
  Badge,
  Breadcrumbs,
  Button,
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
import { getMemberSavedStatus } from "@/lib/api/member";
import { getPropertyBySlug, getSimilarPropertiesFor } from "@/lib/api/properties";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { getMemberToken } from "@/lib/member/auth.server";
import {
  formatAedPrice,
  isOffPlanProperty,
  isRentalProperty,
  isResaleProperty,
  mapPropertyToCard,
  mapPropertyToGalleryItems,
  mapPropertyToOffPlanCard,
  showsAvailableUnits,
} from "@/lib/mappers/property";
import { resolveAvailableUnitsFromApi } from "@/lib/off-plan/detail";
import { getSiteUrl } from "@/lib/site-url";
import type { ApiProperty } from "@/types/api/property";

type PropertyDetailPageProps = {
  locale: Locale;
  slug: string;
  detailBase: "properties" | "off-plan";
};

export async function PropertyDetailPage({
  locale,
  slug,
  detailBase,
}: PropertyDetailPageProps) {
  const property = await getPropertyBySlug(slug, locale);
  if (!property) notFound();
  if (detailBase === "off-plan" && !isOffPlanProperty(property)) notFound();
  if (detailBase === "properties" && isOffPlanProperty(property)) notFound();
  // Resale moved to its own layout — keep already-indexed /properties URLs alive.
  if (detailBase === "properties" && isResaleProperty(property)) {
    redirect(localizedHref(locale, `/resale/${slug}`));
  }
  if (detailBase === "properties" && isRentalProperty(property)) {
    redirect(localizedHref(locale, `/rental/${slug}`));
  }

  const similar = await getSimilarPropertiesFor(
    property,
    locale,
    detailBase === "off-plan" ? "offplan" : "sale",
  );
  const listHref = localizedHref(locale, `/${detailBase}`);
  const t = await getTranslations({ locale, namespace: "catalog" });
  const availableUnits = showsAvailableUnits(property)
    ? resolveAvailableUnitsFromApi(property)
    : undefined;
  const galleryImages = mapPropertyToGalleryItems(property);
  const locationImageUrl = resolveMediaUrl(property.location_image_url);
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${localizedHref(locale, `/${detailBase}/${slug}`)}`;

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
            {/* Figma 1525:28111 — items-end + justify-between; price column gap 16px, price row h 20px */}
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
              <div className="flex max-w-[614px] flex-col gap-5">
                <Breadcrumbs
                  format="property"
                  items={[
                    {
                      label:
                        detailBase === "off-plan"
                          ? t("breadcrumbOffPlan")
                          : t("breadcrumbProperties"),
                      href: listHref,
                    },
                    ...(property.type ? [{ label: property.type, href: listHref }] : []),
                    { label: property.location ?? property.title },
                  ]}
                />
                <div className="flex flex-wrap gap-2">
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
              </div>

              <div className="flex w-full shrink-0 flex-col gap-4 lg:w-auto lg:items-end">
                <p className="m-0 text-[11px] font-medium leading-[14px] text-basalt-300 lg:text-end">
                  {t("guidePrice")}
                </p>
                {/* Mobile: price + CTA on one row. Desktop: stacked & right-aligned (Figma 1525:28123). */}
                <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:flex-col lg:items-end lg:justify-start lg:gap-4">
                  {/* Figma 1525:28125 — h-[20px] so 16px flex gaps stay tight despite 38px leading */}
                  <div
                    className={cn(
                      "flex items-center gap-2 text-[30px] font-bold leading-[38px] text-brand",
                      detailBase === "properties" && "h-5 overflow-visible lg:justify-end",
                    )}
                  >
                    <CurrencyIcon currency="AED" className="h-6 w-6 shrink-0" />
                    <span className="whitespace-nowrap">
                      {formatAedPrice(property.price ?? null)}
                    </span>
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
            {detailBase === "properties" ? (
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
            ) : (
              <PropertyViewingCard
                labels={{
                  eyebrow: t("privateViewingEyebrow"),
                  title: t("privateViewingTitle"),
                  description: t("privateViewingDescription"),
                }}
              >
                <PropertyInquiryForm propertyId={property.id} pageUrl={pageUrl} />
              </PropertyViewingCard>
            )}
          </div>
        </div>
      </section>

      {similar.length > 0 ? (
        <section
          className={cn(
            "pb-20 pt-16",
            detailBase === "properties" ? "bg-sapphire-50" : "bg-surface-muted",
          )}
        >
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={cn(sitePageInnerClassName, "space-y-7")}>
              <p className="text-center text-overline font-semibold leading-4 text-accent">
                {t("similarProperties")}
              </p>
              <CenteredCardGrid gap="section" data-reveal-stagger>
                {similar.map((item) => {
                  const card = isOffPlanProperty(item)
                    ? mapPropertyToOffPlanCard(item, locale)
                    : mapPropertyToCard(item, locale);
                  return (
                    <PropertyCard key={item.id} className="min-h-[480px]" {...card} />
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

export function buildPropertyMetadata(property: ApiProperty) {
  const title = `${property.title} - Novel Insight Property`;
  const description =
    property.description?.slice(0, 160) ??
    `Property details for ${property.title} in Dubai.`;

  // Collect OG images: primary thumbnail first, then first gallery image
  const ogImageUrls: string[] = [];
  const primary = resolveMediaUrl(property.image_url ?? property.photo_url);
  if (primary) ogImageUrls.push(primary);
  if (property.images?.length) {
    for (const img of property.images) {
      const url = resolveMediaUrl(img.image_url);
      if (url && !ogImageUrls.includes(url)) {
        ogImageUrls.push(url);
        break;
      }
    }
  }

  const ogImages = ogImageUrls.map((url) => ({
    url,
    width: 1200,
    height: 630,
    alt: property.title,
  }));

  const keywords = [
    "Dubai real estate",
    "property for sale Dubai",
    property.type,
    property.location,
    property.area?.name,
    property.bedrooms ? `${property.bedrooms} bedroom` : null,
    "Novel Insight Property",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website" as const,
      ...(ogImages.length > 0 && { images: ogImages }),
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      ...(ogImageUrls[0] && { images: [ogImageUrls[0]] }),
    },
  };
}
