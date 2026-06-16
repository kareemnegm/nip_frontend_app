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
import { getProperties } from "@/lib/api/properties";
import {
  isOffPlanProperty,
  mapPropertyToCard,
  mapPropertyToOffPlanCard,
} from "@/lib/mappers/property";

type PropertyListingPageProps = {
  locale: Locale;
  searchParams: Record<string, string | string[] | undefined>;
  mode: "sale" | "offplan";
  catalogPage: CatalogPage;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription?: string;
  afterContent?: React.ReactNode;
};

export async function PropertyListingPage({
  locale,
  searchParams,
  mode,
  catalogPage,
  heroEyebrow,
  heroTitle,
  heroDescription,
  afterContent,
}: PropertyListingPageProps) {
  const params = buildPropertyListParams(searchParams, {
    listing_type: mode === "offplan" ? "offplan" : undefined,
    per_page: 9,
  });
  const { data, meta } = await getProperties(params);
  const basePath = listingBasePath(locale, mode === "offplan" ? "offplan" : undefined);
  const query = searchParamsToQuery(searchParams, mode);
  const filterValues = searchParamsToObject(searchParams);

  return (
    <SiteShell>
      <CatalogHeroSection
        page={catalogPage}
        locale={locale}
        placeholders={{
          eyebrow: heroEyebrow,
          title: heroTitle,
          description: heroDescription,
        }}
      >
        {mode === "sale" ? (
          <PropertyFilterBar
            basePath={basePath}
            values={{
              keyword: filterValues.keyword ?? filterValues.q,
              location: filterValues.location ?? filterValues.community,
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
              <PropertyResultsToolbar count={meta.total} />
            ) : null}

            {data.length === 0 ? (
              <CatalogEmptyState message="No listings match your search yet. Check back soon or speak with an advisor." />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((property) => {
                  const card =
                    mode === "offplan" || isOffPlanProperty(property)
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
