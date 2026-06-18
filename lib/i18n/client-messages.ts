import type { Locale } from "@/lib/i18n/config";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

type Namespace = keyof typeof en;

function lookupPath(catalog: typeof en, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, catalog);

  return typeof value === "string" ? value : undefined;
}

/** Static message lookup for client components outside NextIntlClientProvider (e.g. error boundary). */
export function clientT(
  locale: Locale | undefined,
  namespace: Namespace,
  key: string,
): string {
  const catalog = locale === "ar" ? ar : en;
  const section = catalog[namespace] as Record<string, string>;
  const fallback = (en[namespace] as Record<string, string>)[key];
  return section[key] ?? fallback ?? key;
}

/** Dot-path lookup (e.g. `placeholders.global.footer.tagline`) without NextIntlClientProvider. */
export function clientTPath(
  locale: Locale | undefined,
  path: string,
): string {
  const catalog = locale === "ar" ? ar : en;
  return lookupPath(catalog, path) ?? lookupPath(en, path) ?? path;
}
