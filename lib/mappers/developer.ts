import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { resolveMediaUrl } from "@/lib/api/media-url";
import type { ApiDeveloper } from "@/types/api";

export type DeveloperCardModel = {
  name: string;
  href: string;
  logoUrl?: string;
  propertiesCount?: number;
};

export function getDeveloperOrderNo(developer: ApiDeveloper): number {
  const raw = developer.order_no ?? developer.orderNo ?? developer.order ?? 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasExplicitDeveloperOrder(developer: ApiDeveloper): boolean {
  return getDeveloperOrderNo(developer) > 0;
}

/** CMS order ascending (1, 5, 8…), then unset/`0` rows, then name within each group. */
export function compareDevelopersByOrder(a: ApiDeveloper, b: ApiDeveloper): number {
  const explicitA = hasExplicitDeveloperOrder(a);
  const explicitB = hasExplicitDeveloperOrder(b);

  if (explicitA !== explicitB) {
    return explicitA ? -1 : 1;
  }

  if (explicitA && explicitB) {
    const orderDiff = getDeveloperOrderNo(a) - getDeveloperOrderNo(b);
    if (orderDiff !== 0) return orderDiff;
  }

  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

export function sortDevelopersByOrder<T extends ApiDeveloper>(developers: T[]): T[] {
  return [...developers].sort(compareDevelopersByOrder);
}

export function getDeveloperPropertyCount(developer: ApiDeveloper): number | undefined {
  const count = developer.property_count ?? developer.properties_count;
  return count == null ? undefined : count;
}

export function mapDeveloperToCard(
  developer: ApiDeveloper,
  locale: Locale,
): DeveloperCardModel {
  return {
    name: developer.name,
    href: localizedHref(locale, `/developers/${developer.slug}`),
    logoUrl: resolveMediaUrl(developer.logo_url ?? developer.photo_url),
    propertiesCount: getDeveloperPropertyCount(developer),
  };
}
