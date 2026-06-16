import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import type { ApiDeveloper } from "@/types/api";

export type DeveloperCardModel = {
  name: string;
  href: string;
  logoUrl?: string;
  propertiesCount?: number;
};

export function mapDeveloperToCard(
  developer: ApiDeveloper,
  locale: Locale,
): DeveloperCardModel {
  return {
    name: developer.name,
    href: localizedHref(locale, `/developers/${developer.slug}`),
    logoUrl: developer.logo_url ?? developer.photo_url ?? undefined,
    propertiesCount: developer.properties_count,
  };
}
