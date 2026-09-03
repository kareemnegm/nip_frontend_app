import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { resolveMediaUrl, resolvePropertyVideoUrl } from "@/lib/api/media-url";
import { resolveRentalPriceLabel } from "@/lib/rental/detail";
import { resolvePropertyTags } from "@/lib/mappers/property-tags";
import type { PropertyTagDisplay } from "@/components/ui/PropertyTagBadge";
import type { ApiProperty, PropertyGalleryImage } from "@/types/api/property";

export function formatAedPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || Number.isNaN(price)) {
    return "—";
  }
  return new Intl.NumberFormat("en-AE", {
    maximumFractionDigits: 0,
  }).format(price);
}

export function isOffPlanProperty(property: ApiProperty): boolean {
  return property.listing_type?.toLowerCase() === "offplan";
}

export function isResaleProperty(property: ApiProperty): boolean {
  return property.listing_type?.toLowerCase() === "resale";
}

export function isReadyProperty(property: ApiProperty): boolean {
  return property.listing_type?.toLowerCase() === "ready";
}

export function isRentalProperty(property: ApiProperty): boolean {
  const type = property.listing_type?.toLowerCase();
  return type === "rental" || type === "rent";
}

/** Off-plan, ready, and rental listings may expose an available-units table when the API returns rows. */
export function showsAvailableUnits(property: ApiProperty): boolean {
  const listingType = property.listing_type?.toLowerCase();
  if (listingType !== "offplan" && listingType !== "ready" && listingType !== "rental" && listingType !== "rent") {
    return false;
  }
  const units = property.availableUnits ?? property.available_units;
  return Boolean(units?.length);
}

/** Display label for a raw `listing_type` value, e.g. "offplan" -> "Off-Plan". */
export function listingTypeLabel(listingType: string): string {
  switch (listingType.toLowerCase()) {
    case "offplan":
      return "Off-Plan";
    case "resale":
      return "Resale";
    case "rental":
    case "rent":
      return "Rental";
    default:
      return listingType;
  }
}

export function formatFurnishing(value: string): string {
  return value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Single choke point for every property card link — resale gets its own detail layout. */
export function propertyDetailHref(
  property: ApiProperty,
  locale: Locale,
): string {
  const base = isOffPlanProperty(property)
    ? "/off-plan"
    : isResaleProperty(property)
      ? "/resale"
      : isRentalProperty(property)
        ? "/rental"
        : "/properties";
  return localizedHref(locale, `${base}/${property.slug}`);
}

export function propertyMeta(property: ApiProperty): string[] {
  const meta: string[] = [];
  if (property.bedrooms != null) {
    meta.push(`${property.bedrooms} Bed${property.bedrooms === 1 ? "" : "s"}`);
  }
  if (property.bathrooms != null) {
    meta.push(
      `${property.bathrooms} Bath${property.bathrooms === 1 ? "" : "s"}`,
    );
  }
  if (property.area_sqft != null) {
    meta.push(
      `${new Intl.NumberFormat("en-AE").format(property.area_sqft)} sq ft`,
    );
  }
  return meta.length > 0 ? meta : ["Details on request"];
}

export function propertyBadges(property: ApiProperty): string[] {
  const badges: string[] = [];
  if (property.type) badges.push(property.type);
  if (property.purpose) badges.push(property.purpose);
  else if (property.listing_type) {
    badges.push(listingTypeLabel(property.listing_type));
  }
  return badges.length > 0 ? badges : ["Property"];
}

export function resolvePropertyTagLabels(property: ApiProperty): string[] {
  return resolvePropertyTags(property).map((tag) => tag.label);
}

type DeveloperNameRef = {
  name: string;
  order_no?: number | null;
  orderNo?: number | null;
  order?: number | null;
};

function developerOrderNo(developer: DeveloperNameRef): number {
  const raw = developer.order_no ?? developer.orderNo ?? developer.order ?? 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Primary developer on a card — lowest explicit `order_no` (>0), then name; zeros last. */
export function getPrimaryDeveloperName(
  developers?: DeveloperNameRef[] | null,
): string | undefined {
  if (!developers?.length) return undefined;
  const sorted = [...developers].sort((a, b) => {
    const explicitA = developerOrderNo(a) > 0;
    const explicitB = developerOrderNo(b) > 0;
    if (explicitA !== explicitB) return explicitA ? -1 : 1;
    if (explicitA && explicitB) {
      const orderDiff = developerOrderNo(a) - developerOrderNo(b);
      if (orderDiff !== 0) return orderDiff;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
  return sorted[0]?.name;
}

/** Figma card line: `{area} | {developer}`. */
export function propertyCardLocationLine(input: {
  area?: { name: string } | null;
  location?: string | null;
  developers?: DeveloperNameRef[] | null;
  developer?: { name: string } | null;
}): string {
  const place = input.area?.name ?? input.location ?? "Dubai";
  const developer =
    getPrimaryDeveloperName(input.developers) ?? input.developer?.name;
  if (developer) {
    return `${place} | ${developer}`;
  }
  return place;
}

export function propertyLocation(property: ApiProperty): string {
  return propertyCardLocationLine(property);
}

export type PropertyCardModel = {
  title: string;
  location: string;
  price: string;
  href: string;
  handover?: string;
  meta: string[];
  badges: string[];
  tags: PropertyTagDisplay[];
  imageUrl?: string;
};

export function mapPropertyToCard(
  property: ApiProperty,
  locale: Locale,
  rentalLabels?: { pricePerYear: string; pricePerMonth: string },
): PropertyCardModel {
  const price = isRentalProperty(property) && rentalLabels
    ? resolveRentalPriceLabel(property, rentalLabels)
    : formatAedPrice(property.price ?? null);

  return {
    title: property.title,
    location: propertyLocation(property),
    price,
    href: propertyDetailHref(property, locale),
    handover: property.handover_quarter ?? undefined,
    meta: propertyMeta(property),
    badges: propertyBadges(property),
    tags: resolvePropertyTags(property),
    imageUrl: resolveMediaUrl(property.image_url),
  };
}

export function mapPropertyToOffPlanCard(
  property: ApiProperty,
  locale: Locale,
): PropertyCardModel {
  const card = mapPropertyToCard(property, locale);
  return {
    ...card,
    location: propertyCardLocationLine(property),
  };
}

/** Detail-page gallery — photos plus optional teaser video (video first when present). */
export function mapPropertyToGalleryItems(property: ApiProperty): PropertyGalleryImage[] {
  const images: PropertyGalleryImage[] = property.images?.length
    ? property.images.flatMap((image) => {
        const url = resolveMediaUrl(image.image_url);
        return url ? [{ url, type: image.type, mediaType: "image" as const }] : [];
      })
    : (() => {
        const fallback = resolveMediaUrl(property.image_url);
        return fallback ? [{ url: fallback, mediaType: "image" as const }] : [];
      })();

  const videoUrl = resolvePropertyVideoUrl(property);
  if (!videoUrl) return images;

  return [
    {
      url: videoUrl,
      type: "video",
      mediaType: "video",
      posterUrl: images[0]?.url,
    },
    ...images,
  ];
}
