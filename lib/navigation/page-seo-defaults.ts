import type { MetaPage } from "@/lib/i18n/metadata";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import type { Locale } from "@/lib/i18n/config";
import type { PageSeo } from "@/types/api/page-seo";

const META_PAGE_PATHS: Record<MetaPage, string> = {
  home: "/",
  properties: "/properties",
  offPlan: "/off-plan",
  areas: "/areas",
  developers: "/developers",
  insights: "/insights",
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  concierge: "/concierge",
  contribute: "/contribute",
  legal: "/legal",
  curated: "/curated",
  privateOffice: "/private-office",
  privateOfficeMember: "/private-office",
  thankYou: "/thank-you",
  notFound: "/404",
  serverError: "/500",
  adminLogin: "/admin/login",
};

export function metaPageToPath(page: MetaPage): string {
  return META_PAGE_PATHS[page];
}

const DEFAULT_KEYWORDS: Partial<Record<MetaPage, string>> = {
  home: "NIP Reality, Dubai real estate, property advisory",
  about: "NIP Reality, about, Dubai real estate advisory",
  properties: "Dubai properties, buy property Dubai, NIP Reality",
  offPlan: "Dubai off-plan, new launches, NIP Reality",
  areas: "Dubai areas, communities, NIP Reality",
  developers: "Dubai developers, NIP Reality",
  insights: "Dubai real estate insights, market intelligence, NIP Reality",
  contact: "contact NIP, Dubai real estate advisory",
  faq: "NIP FAQ, Dubai real estate questions",
  concierge: "AI concierge, Dubai property search, NIP Reality",
  legal: "privacy, terms, NIP Reality policies",
};

function metaCatalog(locale: Locale) {
  return locale === "ar" ? ar.meta : en.meta;
}

export function buildDefaultPageSeoList(locale: Locale): PageSeo[] {
  const meta = metaCatalog(locale) as Record<
    string,
    { title: string; description: string }
  >;

  return (Object.keys(META_PAGE_PATHS) as MetaPage[]).map((pageKey) => {
    const path = META_PAGE_PATHS[pageKey];
    const entry = meta[pageKey];
    return {
      id: `default-seo-${path}-${locale}`,
      path,
      locale,
      meta_title: entry?.title ?? null,
      meta_description: entry?.description ?? null,
      meta_keywords: DEFAULT_KEYWORDS[pageKey] ?? null,
      og_title: null,
      og_description: null,
      robots: pageKey === "adminLogin" ? "noindex,nofollow" : null,
    };
  });
}

export function buildDefaultPageSeo(path: string, locale: Locale): PageSeo | null {
  return buildDefaultPageSeoList(locale).find((row) => row.path === path) ?? null;
}

export { META_PAGE_PATHS };
