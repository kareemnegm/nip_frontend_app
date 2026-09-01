import { cache } from "react";
import { sortDevelopersByOrder } from "@/lib/mappers/developer";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type {
  ApiDeveloper,
  LaravelPaginationMeta,
  SiteSearchApiBody,
  SiteSearchApiPayload,
  SiteSearchGroup,
  SiteSearchResponse,
  SiteSearchSection,
} from "@/types/api";
import { getAreas } from "./areas";
import { apiGet, unwrapData } from "./client";
import { getDevelopers } from "./developers";
import { ApiError } from "./errors";
import { getProperties } from "./properties";

export const SITE_SEARCH_PREVIEW_LIMIT = 6;
export const SITE_SEARCH_PAGE_SIZE = 9;

export type SiteSearchParams = {
  q: string;
  locale?: Locale;
  /** Preview mode — max items per section when `section` is omitted. */
  perSection?: number;
  /** Expanded single-section mode with pagination. */
  section?: SiteSearchSection;
  page?: number;
  perPage?: number;
};

function emptyGroup<T>(): SiteSearchGroup<T> {
  return {
    data: [],
    meta: { total: 0, current_page: 1, last_page: 1, per_page: 0 },
  };
}

function normalizeGroupMeta(meta: LaravelPaginationMeta) {
  return {
    total: meta.total,
    current_page: meta.current_page,
    last_page: meta.last_page,
    per_page: meta.per_page,
  };
}

function normalizeSearchGroup<T>(
  group: SiteSearchGroup<T> | undefined,
  perSection: number,
): SiteSearchGroup<T> {
  if (!group?.data?.length) {
    const total = group?.meta?.total ?? 0;
    if (total === 0) return emptyGroup();
    const perPage = group?.meta?.per_page ?? perSection;
    return {
      data: [],
      meta: {
        total,
        current_page: group?.meta?.current_page ?? 1,
        last_page:
          group?.meta?.last_page ?? Math.max(1, Math.ceil(total / perPage)),
        per_page: perPage,
      },
    };
  }

  const total = group.meta?.total ?? group.data.length;
  const perPage = group.meta?.per_page ?? (group.data.length || perSection);

  return {
    data: group.data,
    meta: {
      total,
      current_page: group.meta?.current_page ?? 1,
      last_page:
        group.meta?.last_page ?? Math.max(1, Math.ceil(total / perPage)),
      per_page: perPage,
    },
  };
}

function normalizeSearchResponse(
  raw: SiteSearchApiPayload,
  keyword: string,
  perSection: number,
): SiteSearchResponse {
  const body = unwrapData(raw as SiteSearchApiBody | { data: SiteSearchApiBody });

  if (!body || typeof body !== "object" || !("properties" in body)) {
    throw new Error("Invalid site search response shape");
  }

  return {
    query: body.query?.trim() || keyword,
    properties: normalizeSearchGroup(body.properties, perSection),
    areas: normalizeSearchGroup(body.areas, perSection),
    developers: normalizeSearchGroup(body.developers, perSection),
  };
}

function matchesDeveloperKeyword(developer: ApiDeveloper, keyword: string): boolean {
  const needle = keyword.toLowerCase();
  return (
    developer.name.toLowerCase().includes(needle) ||
    developer.slug.toLowerCase().includes(needle)
  );
}

async function fetchDevelopersFallback(
  keyword: string,
  section: SiteSearchSection | undefined,
  page: number,
  perPage: number,
  perSection: number,
  locale: Locale,
): Promise<SiteSearchGroup<ApiDeveloper>> {
  const response = await getDevelopers({ per_page: 100, page: 1, locale });
  const filtered = sortDevelopersByOrder(
    response.data.filter((developer) => matchesDeveloperKeyword(developer, keyword)),
  );
  const per = section === "developers" ? perPage : perSection;
  const start = section === "developers" ? (page - 1) * per : 0;
  const lastPage = Math.max(1, Math.ceil(filtered.length / per));

  return {
    data: filtered.slice(start, start + per),
    meta: {
      total: filtered.length,
      current_page: section === "developers" ? page : 1,
      last_page: lastPage,
      per_page: per,
    },
  };
}

async function composeSearchFallback(
  params: SiteSearchParams,
): Promise<SiteSearchResponse> {
  const {
    q,
    locale = defaultLocale,
    perSection = SITE_SEARCH_PREVIEW_LIMIT,
    section,
    page = 1,
    perPage = SITE_SEARCH_PAGE_SIZE,
  } = params;
  const keyword = q.trim();

  const response: SiteSearchResponse = {
    query: keyword,
    properties: emptyGroup(),
    areas: emptyGroup(),
    developers: emptyGroup(),
  };

  if (!keyword) return response;

  const fetchProperties = section === undefined || section === "properties";
  const fetchAreas = section === undefined || section === "areas";
  const fetchDevelopers = section === undefined || section === "developers";

  const [propertiesResult, areasResult, developersResult] = await Promise.all([
    fetchProperties
      ? getProperties({
          keyword,
          page: section === "properties" ? page : 1,
          per_page: section === "properties" ? perPage : perSection,
          locale,
        })
      : null,
    fetchAreas
      ? getAreas({
          keyword,
          page: section === "areas" ? page : 1,
          per_page: section === "areas" ? perPage : perSection,
          locale,
        })
      : null,
    fetchDevelopers
      ? fetchDevelopersFallback(keyword, section, page, perPage, perSection, locale)
      : null,
  ]);

  if (propertiesResult) {
    response.properties = {
      data: propertiesResult.data,
      meta: normalizeGroupMeta(propertiesResult.meta),
    };
  }

  if (areasResult) {
    response.areas = {
      data: areasResult.data,
      meta: normalizeGroupMeta(areasResult.meta),
    };
  }

  if (developersResult) {
    response.developers = developersResult;
  }

  return response;
}

export const getSiteSearch = cache(async (params: SiteSearchParams) => {
  const keyword = params.q?.trim();
  if (!keyword) return null;

  const {
    locale = defaultLocale,
    perSection = SITE_SEARCH_PREVIEW_LIMIT,
    section,
    page = 1,
    perPage = SITE_SEARCH_PAGE_SIZE,
  } = params;

  // Laravel v1 search is preview-only (`q` + `per_section`). Paginated section
  // views still use the individual list endpoints until backend adds `section`.
  if (section) {
    return composeSearchFallback(params);
  }

  try {
    const raw = await apiGet<SiteSearchApiPayload>("/search", {
      params: {
        q: keyword,
        per_section: perSection,
      },
      locale,
    });
    return normalizeSearchResponse(raw, keyword, perSection);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 501)) {
      return composeSearchFallback(params);
    }
    throw error;
  }
});
