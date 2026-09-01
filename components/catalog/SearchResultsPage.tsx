import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import { HomeSearchForm } from "@/components/sections/HomeSearchForm";
import {
  ApiPagination,
  CatalogEmptyState,
  CenteredCardGrid,
  CommunityCard,
  DeveloperCard,
  OffPlanCard,
  PropertyCard,
} from "@/components/ui";
import { Container } from "@/components/ui/Container";
import { AppLink as Link } from "@/components/AppLink";
import {
  SITE_SEARCH_PAGE_SIZE,
  SITE_SEARCH_PREVIEW_LIMIT,
  type SiteSearchParams,
} from "@/lib/api/search";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { mapAreaToCommunityCard } from "@/lib/mappers/area";
import {
  getDeveloperPropertyCount,
  mapDeveloperToCard,
} from "@/lib/mappers/developer";
import {
  isOffPlanProperty,
  mapPropertyToCard,
  mapPropertyToOffPlanCard,
} from "@/lib/mappers/property";
import type {
  ApiArea,
  ApiDeveloper,
  ApiProperty,
  SiteSearchResponse,
  SiteSearchSection,
} from "@/types/api";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";

type SearchResultsPageProps = {
  locale: Locale;
  query: string;
  section?: SiteSearchSection;
  page: number;
  results: SiteSearchResponse | null;
};

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export function buildSiteSearchParams(
  sp: Record<string, string | string[] | undefined>,
  locale: Locale,
): {
  query: string;
  section?: SiteSearchSection;
  page: number;
  fetchParams: SiteSearchParams;
} {
  const query = (typeof sp.q === "string" ? sp.q : "").trim();
  const sectionRaw = typeof sp.section === "string" ? sp.section : undefined;
  const section =
    sectionRaw === "properties" ||
    sectionRaw === "areas" ||
    sectionRaw === "developers"
      ? sectionRaw
      : undefined;
  const page = parsePositiveInt(typeof sp.page === "string" ? sp.page : undefined, 1);

  return {
    query,
    section,
    page,
    fetchParams: {
      q: query,
      locale,
      section,
      page,
      perPage: SITE_SEARCH_PAGE_SIZE,
      perSection: SITE_SEARCH_PREVIEW_LIMIT,
    },
  };
}

type SearchSectionBlockProps = {
  title: string;
  countLabel: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: React.ReactNode;
};

function SearchSectionBlock({
  title,
  countLabel,
  viewAllHref,
  viewAllLabel,
  children,
}: SearchSectionBlockProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-h2 font-bold text-brand">{title}</h2>
          <p className="text-body-sm text-ink-secondary">{countLabel}</p>
        </div>
        {viewAllHref && viewAllLabel ? (
          <Link
            href={viewAllHref}
            className="text-label-semibold font-semibold text-accent hover:underline"
          >
            {viewAllLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function SearchPropertyCard({
  property,
  locale,
}: {
  property: ApiProperty;
  locale: Locale;
}) {
  if (isOffPlanProperty(property)) {
    const card = mapPropertyToOffPlanCard(property, locale);
    return <OffPlanCard className="min-h-[480px]" {...card} />;
  }

  const card = mapPropertyToCard(property, locale);
  return <PropertyCard className="min-h-[480px]" {...card} />;
}

function SearchPropertiesSection({
  locale,
  properties,
  expanded,
  query,
  page,
  title,
  countLabel,
  viewAllLabel,
  emptyMessage,
}: {
  locale: Locale;
  properties: SiteSearchResponse["properties"];
  expanded: boolean;
  query: string;
  page: number;
  title: string;
  countLabel: string;
  viewAllLabel: string;
  emptyMessage: string;
}) {
  const basePath = localizedHref(locale, "/search");
  const viewAllHref =
    !expanded && properties.meta.total > SITE_SEARCH_PREVIEW_LIMIT
      ? `${basePath}?q=${encodeURIComponent(query)}&section=properties`
      : undefined;

  return (
    <SearchSectionBlock
      title={title}
      countLabel={countLabel}
      viewAllHref={viewAllHref}
      viewAllLabel={viewAllLabel}
    >
      {properties.data.length === 0 ? (
        <CatalogEmptyState message={emptyMessage} />
      ) : (
        <>
          <CenteredCardGrid gap="section" data-reveal-stagger>
            {properties.data.map((property) => (
              <SearchPropertyCard key={property.id} property={property} locale={locale} />
            ))}
          </CenteredCardGrid>
          {expanded && (properties.meta.last_page ?? 1) > 1 ? (
            <ApiPagination
              currentPage={properties.meta.current_page ?? page}
              lastPage={properties.meta.last_page ?? 1}
              basePath={basePath}
              query={{ q: query, section: "properties" }}
            />
          ) : null}
        </>
      )}
    </SearchSectionBlock>
  );
}

function SearchAreasSection({
  locale,
  areas,
  expanded,
  query,
  page,
  title,
  countLabel,
  viewAllLabel,
  emptyMessage,
  projectsAvailableLabel,
  exploreAreaLabel,
}: {
  locale: Locale;
  areas: SiteSearchResponse["areas"];
  expanded: boolean;
  query: string;
  page: number;
  title: string;
  countLabel: string;
  viewAllLabel: string;
  emptyMessage: string;
  projectsAvailableLabel: (count: number) => string;
  exploreAreaLabel: string;
}) {
  const basePath = localizedHref(locale, "/search");
  const viewAllHref =
    !expanded && areas.meta.total > SITE_SEARCH_PREVIEW_LIMIT
      ? `${basePath}?q=${encodeURIComponent(query)}&section=areas`
      : undefined;

  const cards = areas.data.map((area: ApiArea) =>
    mapAreaToCommunityCard(area, locale, {
      projectsAvailableLabel,
      exploreAreaLabel,
    }),
  );

  return (
    <SearchSectionBlock
      title={title}
      countLabel={countLabel}
      viewAllHref={viewAllHref}
      viewAllLabel={viewAllLabel}
    >
      {cards.length === 0 ? (
        <CatalogEmptyState message={emptyMessage} />
      ) : (
        <>
          <CenteredCardGrid gap="section" data-reveal-stagger>
            {cards.map((card) => (
              <CommunityCard key={card.href} {...card} />
            ))}
          </CenteredCardGrid>
          {expanded && (areas.meta.last_page ?? 1) > 1 ? (
            <ApiPagination
              currentPage={areas.meta.current_page ?? page}
              lastPage={areas.meta.last_page ?? 1}
              basePath={basePath}
              query={{ q: query, section: "areas" }}
            />
          ) : null}
        </>
      )}
    </SearchSectionBlock>
  );
}

function SearchDevelopersSection({
  locale,
  developers,
  expanded,
  query,
  page,
  title,
  countLabel,
  viewAllLabel,
  emptyMessage,
  viewMakerLabel,
  projectsLabel,
}: {
  locale: Locale;
  developers: SiteSearchResponse["developers"];
  expanded: boolean;
  query: string;
  page: number;
  title: string;
  countLabel: string;
  viewAllLabel: string;
  emptyMessage: string;
  viewMakerLabel: string;
  projectsLabel: (count: number) => string;
}) {
  const basePath = localizedHref(locale, "/search");
  const viewAllHref =
    !expanded && developers.meta.total > SITE_SEARCH_PREVIEW_LIMIT
      ? `${basePath}?q=${encodeURIComponent(query)}&section=developers`
      : undefined;

  return (
    <SearchSectionBlock
      title={title}
      countLabel={countLabel}
      viewAllHref={viewAllHref}
      viewAllLabel={viewAllLabel}
    >
      {developers.data.length === 0 ? (
        <CatalogEmptyState message={emptyMessage} />
      ) : (
        <>
          <CenteredCardGrid gap="section" data-reveal-stagger>
            {developers.data.map((developer: ApiDeveloper) => {
              const card = mapDeveloperToCard(developer, locale);
              const propertyCount = getDeveloperPropertyCount(developer);
              return (
                <DeveloperCard
                  key={developer.id}
                  href={card.href}
                  name={card.name}
                  viewMakerLabel={viewMakerLabel}
                  projectsLabel={
                    propertyCount != null
                      ? projectsLabel(propertyCount)
                      : undefined
                  }
                />
              );
            })}
          </CenteredCardGrid>
          {expanded && (developers.meta.last_page ?? 1) > 1 ? (
            <ApiPagination
              currentPage={developers.meta.current_page ?? page}
              lastPage={developers.meta.last_page ?? 1}
              basePath={basePath}
              query={{ q: query, section: "developers" }}
            />
          ) : null}
        </>
      )}
    </SearchSectionBlock>
  );
}

export async function SearchResultsPage({
  locale,
  query,
  section,
  page,
  results,
}: SearchResultsPageProps) {
  const [t, tc, tCatalog, tHomeSearch] = await Promise.all([
    getTranslations({ locale, namespace: "pages.search" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "catalog" }),
    getTranslations({ locale, namespace: "home.search" }),
  ]);

  const expanded = section != null;
  const totalResults = results
    ? results.properties.meta.total +
      results.areas.meta.total +
      results.developers.meta.total
    : 0;

  const countLabel = (count: number) =>
    t("resultCount", { count });

  return (
    <SiteShell>
      <section data-site-hero className="bg-surface-muted pt-16 pb-9">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-6")}>
            <div className="space-y-2 text-center">
              <p className="text-overline font-semibold uppercase text-accent">
                {t("eyebrow")}
              </p>
              <h1 className="font-display text-display-sm font-normal uppercase text-brand sm:text-display-lg">
                {query ? t("titleWithQuery", { query }) : t("title")}
              </h1>
              {query && results ? (
                <p className="mx-auto max-w-[560px] text-body-sm text-ink-secondary sm:text-body-regular">
                  {t("summary", { count: totalResults })}
                </p>
              ) : (
                <p className="mx-auto max-w-[560px] text-body-sm text-ink-secondary sm:text-body-regular">
                  {t("prompt")}
                </p>
              )}
            </div>
            <HomeSearchForm
              key={query}
              label={tHomeSearch("label")}
              ariaLabel={tHomeSearch("ariaLabel")}
              placeholder={tHomeSearch("placeholder")}
              submitLabel={tHomeSearch("submit")}
              initialQuery={query}
              showLabel={false}
            />
          </div>
        </div>
      </section>

      <section className="bg-white pb-[72px] pt-10">
        <Container className="space-y-14">
          {!query ? null : !results || totalResults === 0 ? (
            <CatalogEmptyState message={t("empty")} />
          ) : expanded && section === "properties" ? (
            <SearchPropertiesSection
              locale={locale}
              properties={results.properties}
              expanded
              query={query}
              page={page}
              title={t("propertiesTitle")}
              countLabel={countLabel(results.properties.meta.total)}
              viewAllLabel={tc("viewAll")}
              emptyMessage={t("emptyProperties")}
            />
          ) : expanded && section === "areas" ? (
            <SearchAreasSection
              locale={locale}
              areas={results.areas}
              expanded
              query={query}
              page={page}
              title={t("areasTitle")}
              countLabel={countLabel(results.areas.meta.total)}
              viewAllLabel={tc("viewAll")}
              emptyMessage={t("emptyAreas")}
              projectsAvailableLabel={(count) =>
                tCatalog("projectsAvailable", { count })
              }
              exploreAreaLabel={tCatalog("exploreArea")}
            />
          ) : expanded && section === "developers" ? (
            <SearchDevelopersSection
              locale={locale}
              developers={results.developers}
              expanded
              query={query}
              page={page}
              title={t("developersTitle")}
              countLabel={countLabel(results.developers.meta.total)}
              viewAllLabel={tc("viewAll")}
              emptyMessage={t("emptyDevelopers")}
              viewMakerLabel={tc("viewMaker")}
              projectsLabel={(count) => tc("projects", { count })}
            />
          ) : (
            <>
              {results.properties.meta.total > 0 ? (
                <SearchPropertiesSection
                  locale={locale}
                  properties={results.properties}
                  expanded={false}
                  query={query}
                  page={page}
                  title={t("propertiesTitle")}
                  countLabel={countLabel(results.properties.meta.total)}
                  viewAllLabel={tc("viewAll")}
                  emptyMessage={t("emptyProperties")}
                />
              ) : null}
              {results.areas.meta.total > 0 ? (
                <SearchAreasSection
                  locale={locale}
                  areas={results.areas}
                  expanded={false}
                  query={query}
                  page={page}
                  title={t("areasTitle")}
                  countLabel={countLabel(results.areas.meta.total)}
                  viewAllLabel={tc("viewAll")}
                  emptyMessage={t("emptyAreas")}
                  projectsAvailableLabel={(count) =>
                    tCatalog("projectsAvailable", { count })
                  }
                  exploreAreaLabel={tCatalog("exploreArea")}
                />
              ) : null}
              {results.developers.meta.total > 0 ? (
                <SearchDevelopersSection
                  locale={locale}
                  developers={results.developers}
                  expanded={false}
                  query={query}
                  page={page}
                  title={t("developersTitle")}
                  countLabel={countLabel(results.developers.meta.total)}
                  viewAllLabel={tc("viewAll")}
                  emptyMessage={t("emptyDevelopers")}
                  viewMakerLabel={tc("viewMaker")}
                  projectsLabel={(count) => tc("projects", { count })}
                />
              ) : null}
            </>
          )}
        </Container>
      </section>
    </SiteShell>
  );
}
