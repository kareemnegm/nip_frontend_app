import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n/config";
import { localizedHref, toLocaleAgnosticPath } from "@/lib/i18n/helpers";

const PUBLIC_FILE = /\.[^/]+$/;

/** Pretty Arancia URLs → static HTML (rewrite keeps address bar; base href in each HTML fixes assets). */
const ARANCIA_PAGE_REWRITE: Record<string, string> = {
  "/arancia": "/arancia/index.html",
  "/arancia/thank-you": "/arancia/thank-you/index.html",
  "/arancia/ar": "/arancia/ar/index.html",
  "/arancia/ar/thank-you": "/arancia/ar/thank-you/index.html",
};

function normalizeAranciaPathname(pathname: string): string {
  if (
    pathname.startsWith("/arancia") &&
    pathname.length > "/arancia".length &&
    pathname.endsWith("/")
  ) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname;
}

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (/\bar\b/i.test(acceptLanguage)) {
    return "ar";
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const aranciaPath = normalizeAranciaPathname(pathname);
  const aranciaHtml = ARANCIA_PAGE_REWRITE[aranciaPath];
  if (aranciaHtml) {
    const url = request.nextUrl.clone();
    url.pathname = aranciaHtml;
    return NextResponse.rewrite(url);
  }

  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];

  if (maybeLocale && isLocale(maybeLocale)) {
    if (segments[1] === "arancia") {
      const rest = segments.slice(2).join("/");
      const url = request.nextUrl.clone();
      url.pathname = rest ? `/arancia/${rest}`.replace(/\/+$/, "") : "/arancia";
      return NextResponse.redirect(url);
    }
    // Fix accidental double-locale URLs such as /en/en/properties
    if (segments[1] && isLocale(segments[1])) {
      const url = request.nextUrl.clone();
      url.pathname = localizedHref(
        maybeLocale as Locale,
        toLocaleAgnosticPath(pathname),
      );
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, maybeLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return response;
    }

    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, maybeLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon.svg|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
