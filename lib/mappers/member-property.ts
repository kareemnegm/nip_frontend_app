import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { formatAedPrice, type PropertyCardModel } from "@/lib/mappers/property";
import type {
  ApiMemberOffplanCard,
  ApiMemberPropertyCard,
} from "@/types/api/member";

export function mapMemberPropertyToCard(
  property: ApiMemberPropertyCard,
  locale: Locale,
): PropertyCardModel {
  const location =
    property.area?.name && property.location
      ? `${property.area.name} | ${property.location}`
      : property.area?.name ?? property.location ?? "Dubai";

  const badges: string[] = [];
  if (property.propertyType) badges.push(property.propertyType);
  if (property.listingType) {
    badges.push(
      property.listingType === "offplan" ? "Off-Plan" : property.listingType,
    );
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

  const base =
    property.listingType?.toLowerCase() === "offplan" ? "/off-plan" : "/properties";

  return {
    title: property.title,
    location,
    price: formatAedPrice(property.price),
    href: localizedHref(locale, `${base}/${property.slug}`),
    handover: undefined,
    meta: meta.length > 0 ? meta : ["Details on request"],
    badges: badges.length > 0 ? badges : ["Property"],
    imageUrl: property.primaryImage ?? undefined,
  };
}

export function mapMemberProjectToCard(
  project: ApiMemberOffplanCard,
  locale: Locale,
): PropertyCardModel {
  const location = project.area?.name ?? "Dubai";
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
    imageUrl: project.primaryImage ?? undefined,
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
