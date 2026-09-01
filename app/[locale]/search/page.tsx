import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  SearchResultsPage,
  buildSiteSearchParams,
} from "@/components/catalog/SearchResultsPage";
import { getSiteSearch } from "@/lib/api/search";
import { resolveLocale } from "@/lib/i18n/helpers";
import { builderPageMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sp = await searchParams;
  const query = (typeof sp.q === "string" ? sp.q : "").trim();
  const t = await getTranslations({ locale, namespace: "meta.search" });

  const title = query ? t("titleWithQuery", { query }) : t("title");
  const description = query
    ? t("descriptionWithQuery", { query })
    : t("description");

  const metadata = await builderPageMetadata("/search", locale, title);
  return { ...metadata, description };
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sp = await searchParams;
  const { query, section, page, fetchParams } = buildSiteSearchParams(sp, locale);
  const results = query ? await getSiteSearch(fetchParams) : null;

  return (
    <SearchResultsPage
      locale={locale}
      query={query}
      section={section}
      page={page}
      results={results}
    />
  );
}
