import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageSeo } from "@/lib/api/page-seo";
import { metaPageToPath } from "@/lib/navigation/page-seo-defaults";
import { locales, type Locale } from "./config";

export type MetaPage =
  | "home"
  | "properties"
  | "offPlan"
  | "areas"
  | "developers"
  | "insights"
  | "about"
  | "contact"
  | "faq"
  | "concierge"
  | "contribute"
  | "legal"
  | "curated"
  | "privateOffice"
  | "privateOfficeMember"
  | "thankYou"
  | "notFound"
  | "serverError"
  | "adminLogin";

const metaNamespaces: Record<MetaPage, `meta.${MetaPage}`> = {
  home: "meta.home",
  properties: "meta.properties",
  offPlan: "meta.offPlan",
  areas: "meta.areas",
  developers: "meta.developers",
  insights: "meta.insights",
  about: "meta.about",
  contact: "meta.contact",
  faq: "meta.faq",
  concierge: "meta.concierge",
  contribute: "meta.contribute",
  legal: "meta.legal",
  curated: "meta.curated",
  privateOffice: "meta.privateOffice",
  privateOfficeMember: "meta.privateOfficeMember",
  thankYou: "meta.thankYou",
  notFound: "meta.notFound",
  serverError: "meta.serverError",
  adminLogin: "meta.adminLogin",
};

/**
 * Next does NOT deep-merge `openGraph` — a page that defines it replaces the
 * root layout's block entirely. Without this every main page shipped without an
 * og:image and previewed as a bare link in WhatsApp/Facebook, while property
 * pages (which build their own metadata) rendered a card.
 *
 * 1200×630 is the size Facebook/WhatsApp/X expect; keep the file small (~100KB)
 * or scrapers time out before fetching it.
 */
const DEFAULT_OG_IMAGE = {
  url: "/images/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "Novel Insight Property — Dubai real estate advisory",
} as const;

const SITE_BRAND = "Novel Insight Property";

/** Home SEO: company name first, then page descriptor / body copy. */
function formatHomeSeoTitle(raw: string): string {
  const title = raw.trim();
  if (!title) return `${SITE_BRAND} - Dubai Real Estate Advisory`;

  const brandSuffix = ` - ${SITE_BRAND}`;
  if (title.endsWith(brandSuffix)) {
    return `${SITE_BRAND} - ${title.slice(0, -brandSuffix.length).trim()}`;
  }

  const brandPrefix = `${SITE_BRAND} - `;
  if (title.startsWith(brandPrefix) || title.startsWith(`${SITE_BRAND} | `)) {
    return title.replace(`${SITE_BRAND} | `, `${SITE_BRAND} - `);
  }

  return `${SITE_BRAND} - ${title.replace(/\s*\|\s*/, " - ")}`;
}

function formatHomeSeoDescription(raw: string): string {
  const description = raw.trim();
  if (!description) {
    return `${SITE_BRAND} — NIP brings together market insight, editorial perspective, and private advisory for clients who want to move with judgment.`;
  }

  if (
    description.startsWith(`${SITE_BRAND} —`) ||
    description.startsWith(`${SITE_BRAND} -`) ||
    description.startsWith(`${SITE_BRAND} |`)
  ) {
    return description;
  }

  return `${SITE_BRAND} — ${description}`;
}

/**
 * Pages live under /<locale>, so a bare path (`/insights`) points at a URL that
 * only redirects. Social scrapers and canonical tags need the real one.
 */
function localizedPath(locale: Locale, path: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

function parseKeywords(raw?: string | null): string[] | undefined {
  if (!raw?.trim()) return undefined;
  const keywords = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return keywords.length > 0 ? keywords : undefined;
}

export async function localizedMetadata(
  locale: Locale,
  page: MetaPage,
): Promise<Metadata> {
  const path = metaPageToPath(page);
  const cms = await getPageSeo(path, locale);
  const t = await getTranslations({ locale, namespace: metaNamespaces[page] });

  const title = cms?.meta_title?.trim() || t("title");
  const description = cms?.meta_description?.trim() || t("description");
  const keywords = parseKeywords(cms?.meta_keywords);
  const resolvedTitle = page === "home" ? formatHomeSeoTitle(title) : title;
  const resolvedDescription =
    page === "home" ? formatHomeSeoDescription(description) : description;
  const ogTitle = cms?.og_title?.trim() || resolvedTitle;
  const ogDescription = cms?.og_description?.trim() || resolvedDescription;

  const canonicalPath = localizedPath(locale, path);

  const metadata: Metadata = {
    // Titles from CMS/i18n already include the brand — do not apply the root
    // layout template ("%s - Novel Insight Property") or Google shows it twice.
    title: { absolute: resolvedTitle },
    description: resolvedDescription,
    keywords,
    alternates: {
      canonical: canonicalPath,
      languages: Object.fromEntries(
        locales.map((code) => [code, localizedPath(code, path)]),
      ),
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      siteName: "Novel Insight Property",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      url: canonicalPath,
      images: [{ ...DEFAULT_OG_IMAGE, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };

  if (cms?.robots) {
    const parts = cms.robots.split(",").map((part) => part.trim());
    metadata.robots = {
      index: !parts.includes("noindex"),
      follow: !parts.includes("nofollow"),
    };
  }

  return metadata;
}
