import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";

function safeReturnUrl(url: string): string {
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }
  return "/";
}

export function buildCmsLoginUrl(localeInput: string, returnUrl?: string): string {
  const locale = resolveLocale(localeInput);
  const target = safeReturnUrl(
    returnUrl ??
      (typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : "/"),
  );
  const loginPath = localizedHref(locale, "/admin/login");
  return `${loginPath}?returnUrl=${encodeURIComponent(target)}`;
}

/** Send staff to CMS login and return them to the current page after sign-in. */
export function redirectToCmsLogin(localeInput: string, returnUrl?: string): void {
  if (typeof window === "undefined") return;
  window.location.assign(buildCmsLoginUrl(localeInput, returnUrl));
}

/** Returns true when a redirect was triggered (session expired / not signed in). */
export function redirectIfCmsUnauthorized(res: Response, localeInput: string): boolean {
  if (res.status !== 401) return false;
  redirectToCmsLogin(localeInput);
  return true;
}
