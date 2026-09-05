import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { sortDevelopersByOrder } from "@/lib/mappers/developer";
import type { ApiDeveloper, LaravelPaginated } from "@/types/api";
import { ApiError } from "./errors";
import { emptyPaginated, isTransientApiError, logApiFallback } from "./fallbacks";
import { apiGet, unwrapData } from "./client";
import { CATALOG_PAGE_REVALIDATE_SECONDS } from "@/lib/page-cache";

/** Developers catalog is small — fetch all rows once so CMS `order_no` applies across pages. */
const DEVELOPERS_CATALOG_CAP = 200;

type DeveloperListParams = {
  page?: number;
  per_page?: number;
  locale?: Locale;
  /** When true, sort the full catalog by CMS order then slice the requested page. */
  globalOrder?: boolean;
};

async function fetchDevelopersPage(
  query: { page?: number; per_page?: number },
  locale: Locale,
): Promise<LaravelPaginated<ApiDeveloper>> {
  return apiGet<LaravelPaginated<ApiDeveloper>>("/developers", {
    params: { ...query, sort: "order_no" },
    locale,
    revalidate: false,
  });
}

export async function getDevelopers(params: DeveloperListParams = {}) {
  const { locale = defaultLocale, globalOrder = false, page = 1, per_page = 9 } = params;

  try {
    if (!globalOrder) {
      const response = await fetchDevelopersPage({ page, per_page }, locale);
      return {
        ...response,
        data: sortDevelopersByOrder(response.data),
      };
    }

    const bulk = await fetchDevelopersPage({ page: 1, per_page: DEVELOPERS_CATALOG_CAP }, locale);
    const sorted = sortDevelopersByOrder(bulk.data);
    const total = bulk.meta.total;
    const start = (page - 1) * per_page;

    return {
      ...bulk,
      data: sorted.slice(start, start + per_page),
      meta: {
        ...bulk.meta,
        total,
        per_page,
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / per_page)),
        from: total === 0 ? null : start + 1,
        to: total === 0 ? null : Math.min(start + per_page, total),
      },
    };
  } catch (error) {
    logApiFallback("GET /developers", error);
    return emptyPaginated<ApiDeveloper>(per_page);
  }
}

export const getDeveloperBySlug = cache(
  async (slug: string, locale: Locale = defaultLocale) => {
    try {
      const response = await apiGet<ApiDeveloper | { data: ApiDeveloper }>(
        `/developers/${slug}`,
        { locale, revalidate: CATALOG_PAGE_REVALIDATE_SECONDS || false },
      );
      return unwrapData(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      if (isTransientApiError(error)) {
        logApiFallback(`GET /developers/${slug}`, error, { production: true });
        return null;
      }
      throw error;
    }
  },
);
