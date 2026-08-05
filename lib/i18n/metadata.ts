import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageSeo } from "@/lib/api/page-seo";
import { metaPageToPath } from "@/lib/navigation/page-seo-defaults";
import type { Locale } from "./config";

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
  const ogTitle = cms?.og_title?.trim() || title;
  const ogDescription = cms?.og_description?.trim() || description;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      siteName: "Novel Insight Property",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      url: path,
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
