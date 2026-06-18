import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "./config";

type MetaPage =
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

export async function localizedMetadata(
  locale: Locale,
  page: MetaPage,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: metaNamespaces[page] });
  return {
    title: t("title"),
    description: t("description"),
  };
}
