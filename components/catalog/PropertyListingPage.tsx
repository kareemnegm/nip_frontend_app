import { SiteShell } from "@/components/SiteShell";
import {
  ApiPagination,
  CatalogEmptyState,
  OffPlanCard,
  PropertyCard,
  PropertyFilterBar,
  PropertyResultsToolbar,
} from "@/components/ui";
import {
  CatalogHeroSection,
  type CatalogPage,
} from "@/components/sections/CatalogHeroSection";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { buildPropertyListParams, listingBasePath, searchParamsToObject } from "@/lib/catalog/helpers";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getProperties } from "@/lib/api/properties";
import {
  mapPropertyToCard,
  mapPropertyToOffPlanCard,
} from "@/lib/mappers/property";
import { getTranslations } from "next-intl/server";

type PropertyListingPageProps = {
  locale: Locale;
  searchParams: Record<string, string | string[] | undefined>;
  mode: "sale" | "offplan";
  catalogPage: CatalogPage;
  afterContent?: React.ReactNode;
};

async function getHeroPlaceholders(catalogPage: CatalogPage, locale: Locale) {
  const ns =
    catalogPage === "offPlan"
      ? "placeholders.offPlan.hero"
      : "placeholders.properties.hero";

  return {
    eyebrow: await getCmsPlaceholder(ns, "eyebrow", locale),
    title: await getCmsPlaceholder(ns, "title", locale),
    description: await getCmsPlaceholder(ns, "description", locale),
  };
}

export async function PropertyListingPage({
  locale,
  searchParams,
  mode,
  catalogPage,
  afterContent,
}: PropertyListingPageProps) {
  const sp = searchParamsToObject(searchParams);
  const currentView: "grid" | "list" = sp.view === "list" ? "list" : "grid";
  const currentSort = sp.sort ?? sp.order_by ?? "newest";

  const params = buildPropertyListParams(searchParams, {
    listing_type: mode === "offplan" ? "offplan" : "sale",
    per_page: 9,
    locale,
  });
  const { data, meta } = await getProperties(params);
  const basePath = listingBasePath(locale, mode === "offplan" ? "offplan" : undefined);
  const query = searchParamsToQuery(searchParams, mode);
  const filterValues = sp;
  const heroPlaceholders = await getHeroPlaceholders(catalogPage, locale);
  const t = await getTranslations({ locale, namespace: "catalog" });

  return (
    <SiteShell>
      <CatalogHeroSection
        page={catalogPage}
        locale={locale}
        placeholders={heroPlaceholders}
      >
        {mode === "sale" ? (
          <PropertyFilterBar
            basePath={basePath}
            values={{
              keyword: filterValues.keyword ?? filterValues.q,
              area:
                filterValues.area ??
                filterValues.location ??
                filterValues.community,
              type: filterValues.type,
              bedrooms: filterValues.bedrooms ?? filterValues.beds,
              min_price: filterValues.min_price ?? filterValues.price_min,
            }}
          />
        ) : null}
      </CatalogHeroSection>

      <section className="bg-white pb-[72px] pt-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-6")}>
            {mode === "sale" ? (
              <PropertyResultsToolbar
                count={meta.total}
                currentSort={currentSort}
                currentView={currentView}
              />
            ) : null}

            {data.length === 0 ? (
              <CatalogEmptyState message={t("emptyListings")} />
            ) : currentView === "list" ? (
              <div className="flex flex-col gap-4">
                {data.map((property) => {
                  const card = mapPropertyToCard(property, locale);
                  return (
                    <PropertyCard
                      key={property.id}
                      layout="list"
                      {...card}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((property) => {
                  const card =
                    mode === "offplan"
                      ? mapPropertyToOffPlanCard(property, locale)
                      : mapPropertyToCard(property, locale);
                  const Card = mode === "offplan" ? OffPlanCard : PropertyCard;
                  return (
                    <Card
                      key={property.id}
                      className="min-h-[480px]"
                      {...card}
                    />
                  );
                })}
              </div>
            )}

            <ApiPagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              basePath={basePath}
              query={query}
            />
          </div>
        </div>
      </section>
      {afterContent}
    </SiteShell>
  );
}

function searchParamsToQuery(
  searchParams: Record<string, string | string[] | undefined>,
  mode: "sale" | "offplan",
) {
  const query: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page") continue;
    query[key] = Array.isArray(value) ? value[0] : value;
  }
  if (mode === "offplan" && !query.listing_type) {
    query.listing_type = "offplan";
  }
  return query;
}
