import type { Locale } from "@/lib/i18n/config";

/** Merge locale into API query params for backend localization. */
export function withLocaleParam(
  params: Record<string, string | number | undefined | null> = {},
  locale?: Locale,
) {
  if (!locale) return params;
  return { ...params, locale };
}
