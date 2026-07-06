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
      locale: locale === "ar" ? "ar_AE" : "en_AE",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
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
