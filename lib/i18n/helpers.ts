import {
  defaultLocale,
  isLocale,
  type Locale,
} from "./config";

/** Strip leading locale segment from pathname (e.g. `/en/about` → `/about`). */
export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0]!)) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

/** Strip all repeated locale prefixes (e.g. `/en/en/about` → `/about`). */
export function toLocaleAgnosticPath(pathname: string): string {
  let path = pathname || "/";
  let next = stripLocaleFromPathname(path);
  while (next !== path) {
    path = next;
    next = stripLocaleFromPathname(path);
  }
  return path;
}

/** Prefix an internal path with locale (e.g. `/about` → `/en/about`). Idempotent. */
export function localizedHref(locale: Locale, href: string): string {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return href;
  }

  const [pathPart, queryPart] = href.split("?");
  const agnostic = toLocaleAgnosticPath(pathPart || "/");
  const normalized = agnostic === "/" ? "" : agnostic;
  const localized = normalized ? `/${locale}${normalized}` : `/${locale}`;
  return queryPart ? `${localized}?${queryPart}` : localized;
}

/** Swap locale in current pathname while preserving route + query. */
export function switchLocalePathname(
  pathname: string,
  targetLocale: Locale,
): string {
  const relPath = stripLocaleFromPathname(pathname);
  return localizedHref(targetLocale, relPath);
}

export function resolveLocale(value: string | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }
  return defaultLocale;
}

/** CMS relUrl is locale-agnostic (e.g. `/about`, not `/en/about`). */
export function pageRelUrlFromPathname(pathname: string): string {
  return stripLocaleFromPathname(pathname);
}
