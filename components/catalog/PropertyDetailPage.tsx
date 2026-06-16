import { notFound } from "next/navigation";
import { PropertyInquiryForm } from "@/components/forms/InquiryForms";
import { SiteShell } from "@/components/SiteShell";
import {
  PropertyGallery,
  PropertyStoryContent,
  PropertyViewingCard,
} from "@/components/sections/PropertyStorySections";
import {
  Badge,
  Breadcrumbs,
  Button,
  FactsStrip,
  Icon,
  PropertyCard,
} from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/api/properties";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import {
  formatAedPrice,
  isOffPlanProperty,
  mapPropertyToCard,
  mapPropertyToOffPlanCard,
} from "@/lib/mappers/property";
import type { ApiProperty } from "@/types/api";

type PropertyDetailPageProps = {
  locale: Locale;
  slug: string;
  detailBase: "properties" | "off-plan";
};

function propertyFactsFromApi(property: ApiProperty) {
  return [
    property.bedrooms != null
      ? { label: "Bedrooms", value: String(property.bedrooms), icon: "bed" as const }
      : null,
    property.bathrooms != null
      ? { label: "Bathrooms", value: String(property.bathrooms), icon: "bath" as const }
      : null,
    property.area_sqft != null
      ? {
          label: "Area",
          value: `${new Intl.NumberFormat("en-AE").format(property.area_sqft)} sq ft`,
          icon: "grid" as const,
        }
      : null,
    property.type
      ? { label: "Type", value: property.type, icon: "building" as const }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; icon: "bed" | "bath" | "grid" | "building" }>;
}

export async function PropertyDetailPage({
  locale,
  slug,
  detailBase,
}: PropertyDetailPageProps) {
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  if (detailBase === "off-plan" && !isOffPlanProperty(property)) notFound();
  if (detailBase === "properties" && isOffPlanProperty(property)) notFound();

  const similar = (await getSimilarProperties(slug)).filter((item) =>
    detailBase === "off-plan" ? isOffPlanProperty(item) : !isOffPlanProperty(item),
  );
  const listHref = localizedHref(locale, `/${detailBase}`);
  const facts = propertyFactsFromApi(property);
  const images =
    property.images?.map((image) => image.image_url).filter(Boolean) ??
    (property.image_url ? [property.image_url] : []);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageUrl = `${siteUrl}${localizedHref(locale, `/${detailBase}/${slug}`)}`;

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
                    { label: detailBase === "off-plan" ? "Off-Plan" : "Properties", href: listHref },
                    ...(property.type ? [{ label: property.type, href: listHref }] : []),
                    { label: property.location ?? property.title },
                  ]}
                />
                <div className="flex flex-wrap gap-2">
                  {property.type ? <Badge tone="property">{property.type}</Badge> : null}
                  {property.purpose ? <Badge tone="property">{property.purpose}</Badge> : null}
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
                  {property.title}
                </h1>
                {property.location ? (
                  <p className="flex items-center gap-1.5 text-body-sm text-ink-tertiary">
                    <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-brand" />
                    {property.location}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col items-start gap-4 lg:items-end">
                <p className="text-[11px] font-medium leading-[14px] text-basalt-300 lg:text-right">
                  GUIDE PRICE
                </p>
                <p className="flex items-center gap-2 text-[30px] font-bold leading-[38px] text-brand">
                  <Icon name="currency" className="h-6 w-6 shrink-0" />
                  {formatAedPrice(property.price ?? null)}
                </p>
                <Button href={localizedHref(locale, "/contact")} className="w-full sm:w-auto">
                  Request Private Advisory
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-8">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <PropertyGallery images={images} title={property.title} />
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
          <div
            className={cn(
              sitePageInnerClassName,
              "flex flex-col gap-12 lg:flex-row lg:gap-24",
            )}
          >
            <PropertyStoryContent
              description={property.description ?? property.about_location ?? undefined}
              facilities={property.facilities}
              locationNote={property.about_location ?? property.location ?? undefined}
            />
            <PropertyViewingCard>
              <PropertyInquiryForm propertyId={property.id} pageUrl={pageUrl} />
            </PropertyViewingCard>
          </div>
        </div>
      </section>

      {similar.length > 0 ? (
        <section className="bg-surface-muted pb-20 pt-16">
          <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
            <div className={cn(sitePageInnerClassName, "space-y-7")}>
              <p className="text-center text-overline font-semibold leading-4 text-accent">
                SIMILAR PROPERTIES
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {similar.map((item) => {
                  const card = isOffPlanProperty(item)
                    ? mapPropertyToOffPlanCard(item, locale)
                    : mapPropertyToCard(item, locale);
                  return (
                    <PropertyCard key={item.id} className="min-h-[480px]" {...card} />
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

export function buildPropertyMetadata(property: ApiProperty) {
  return {
    title: `${property.title} | NIP Reality`,
    description:
      property.description?.slice(0, 160) ??
      `Property details for ${property.title} in Dubai.`,
  };
}
