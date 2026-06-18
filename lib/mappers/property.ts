import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { resolveMediaUrl } from "@/lib/api/media-url";
import type { ApiProperty } from "@/types/api";

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

export function propertyDetailHref(
  property: ApiProperty,
  locale: Locale,
): string {
  const base = isOffPlanProperty(property) ? "/off-plan" : "/properties";
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
    badges.push(
      property.listing_type === "offplan" ? "Off-Plan" : property.listing_type,
    );
  }
  return badges.length > 0 ? badges : ["Property"];
}

export function propertyLocation(property: ApiProperty): string {
  if (property.area?.name && property.location) {
    return `${property.area.name} | ${property.location}`;
  }
  return property.area?.name ?? property.location ?? "Dubai";
}

export type PropertyCardModel = {
  title: string;
  location: string;
  price: string;
  href: string;
  handover?: string;
  meta: string[];
  badges: string[];
  imageUrl?: string;
};

export function mapPropertyToCard(
  property: ApiProperty,
  locale: Locale,
): PropertyCardModel {
  return {
    title: property.title,
    location: propertyLocation(property),
    price: formatAedPrice(property.price ?? null),
    href: propertyDetailHref(property, locale),
    handover: property.handover_quarter ?? undefined,
    meta: propertyMeta(property),
    badges: propertyBadges(property),
    imageUrl: resolveMediaUrl(property.image_url),
  };
}

export function mapPropertyToOffPlanCard(
  property: ApiProperty,
  locale: Locale,
): PropertyCardModel {
  return mapPropertyToCard(property, locale);
}
