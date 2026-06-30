import type { PropertyCardProps } from "@/components/ui/Cards";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import type { PropertyListParams } from "@/types/api";

export function searchParamsToObject(
  searchParams: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    result[key] = Array.isArray(value) ? value[0] : value;
  }
  return result;
}

export function buildPropertyListParams(
  searchParams: Record<string, string | string[] | undefined>,
  defaults: PropertyListParams = {},
): PropertyListParams {
  const sp = searchParamsToObject(searchParams);
  return {
    page: sp.page ? Number(sp.page) : defaults.page,
    per_page: defaults.per_page ?? 9,
    listing_type: defaults.listing_type ?? sp.listing_type ?? sp.listing,
    keyword: sp.keyword ?? sp.q,
    type: sp.type,
    area: sp.area ?? sp.location ?? sp.community,
    developer: sp.developer,
    bedrooms: sp.bedrooms ?? sp.beds,
    bathrooms: sp.bathrooms ?? sp.baths,
    min_price: sp.min_price ?? sp.price_min,
    max_price: sp.max_price ?? sp.price_max,
    price_range: sp.price_range,
    location: sp.location ?? sp.community,
    purpose: sp.purpose,
    sort: sp.sort ?? sp.order_by,
    locale: defaults.locale,
  };
}

export function listingBasePath(
  locale: Locale,
  listingType?: string,
): string {
  if (listingType === "offplan") {
    return localizedHref(locale, "/off-plan");
  }
  return localizedHref(locale, "/properties");
}

export type PropertyCardData = PropertyCardProps;
