import { getTranslations } from "next-intl/server";
import type { Locale } from "./config";

/** Locale-aware CMS fallback copy from messages (until staff overrides in CMS). */
export async function getCmsPlaceholder(
  namespace: string,
  key: string,
  locale?: Locale,
) {
  const t = locale
    ? await getTranslations({ locale, namespace: namespace as never })
    : await getTranslations(namespace as never);
  return t(key as never);
}
