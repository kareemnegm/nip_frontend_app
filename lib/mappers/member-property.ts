import { resolveMediaUrl } from "@/lib/api/media-url";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import {
  formatAedPrice,
  listingTypeLabel,
  propertyCardLocationLine,
  type PropertyCardModel,
} from "@/lib/mappers/property";
import type {
  ApiMemberOffplanCard,
  ApiMemberPropertyCard,
} from "@/types/api/member";

/** Mirrors `propertyDetailHref` for the camelCase member API shape. */
export function memberDetailBase(listingType?: string | null): string {
  switch (listingType?.toLowerCase()) {
    case "offplan":
      return "/off-plan";
    case "resale":
      return "/resale";
    case "rental":
    case "rent":
      return "/rental";
    default:
      return "/properties";
  }
}

export function mapMemberPropertyToCard(
  property: ApiMemberPropertyCard,
  locale: Locale,
): PropertyCardModel {
  const location = propertyCardLocationLine(property);

  const badges: string[] = [];
  if (property.propertyType) badges.push(property.propertyType);
  if (property.listingType) {
    badges.push(listingTypeLabel(property.listingType));
  }

  const meta: string[] = [];
  if (property.bedrooms != null) {
    meta.push(`${property.bedrooms} Bed${property.bedrooms === 1 ? "" : "s"}`);
  }
  if (property.bathrooms != null) {
    meta.push(
      `${property.bathrooms} Bath${property.bathrooms === 1 ? "" : "s"}`,
    );
  }
  if (property.areaSqft != null) {
    meta.push(
      `${new Intl.NumberFormat("en-AE").format(property.areaSqft)} sq ft`,
    );
  }

  const base = memberDetailBase(property.listingType);

  return {
    title: property.title,
    location,
    price: formatAedPrice(property.price),
    href: localizedHref(locale, `${base}/${property.slug}`),
    handover: undefined,
    meta: meta.length > 0 ? meta : ["Details on request"],
    badges: badges.length > 0 ? badges : ["Property"],
    tags: [],
    imageUrl: resolveMediaUrl(property.primaryImage),
  };
}

export function mapMemberProjectToCard(
  project: ApiMemberOffplanCard,
  locale: Locale,
): PropertyCardModel {
  const location = propertyCardLocationLine({
    area: project.area,
    developer: project.developer,
  });
  const badges = ["Off-Plan"];
  if (project.developer?.name) badges.push(project.developer.name);

  return {
    title: project.name,
    location,
    price: formatAedPrice(project.startingPrice),
    href: localizedHref(locale, `/off-plan/${project.slug}`),
    handover: project.handoverQuarter ?? undefined,
    meta: project.handoverQuarter ? [project.handoverQuarter] : ["Details on request"],
    badges,
    tags: [],
    imageUrl: resolveMediaUrl(project.primaryImage),
  };
}

export function mapMemberListingToCard(
  listing: ApiMemberPropertyCard | ApiMemberOffplanCard,
  type: "property" | "project",
  locale: Locale,
): PropertyCardModel {
  return type === "project"
    ? mapMemberProjectToCard(listing as ApiMemberOffplanCard, locale)
    : mapMemberPropertyToCard(listing as ApiMemberPropertyCard, locale);
}
