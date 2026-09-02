import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { sortDevelopersByOrder } from "@/lib/mappers/developer";
import type { ApiDeveloper, LaravelPaginated } from "@/types/api";
import { ApiError } from "./errors";
import { emptyPaginated, isTransientApiError, logApiFallback } from "./fallbacks";
import { apiGet, DEFAULT_REVALIDATE_SECONDS, unwrapData } from "./client";

export async function getDevelopers(
  params: { page?: number; per_page?: number; locale?: Locale } = {},
) {
  const { locale = defaultLocale, ...query } = params;
  try {
    const response = await apiGet<LaravelPaginated<ApiDeveloper>>("/developers", {
      params: query,
      locale,
      revalidate: false,
    });

    return {
      ...response,
      data: sortDevelopersByOrder(response.data),
    };
  } catch (error) {
    logApiFallback("GET /developers", error);
    return emptyPaginated<ApiDeveloper>(query.per_page ?? 9);
  }
}

export const getDeveloperBySlug = cache(
  async (slug: string, locale: Locale = defaultLocale) => {
    try {
      const response = await apiGet<ApiDeveloper | { data: ApiDeveloper }>(
        `/developers/${slug}`,
        { locale, revalidate: DEFAULT_REVALIDATE_SECONDS },
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
