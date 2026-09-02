import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { ApiArea, LaravelPaginated } from "@/types/api";
import { ApiError } from "./errors";
import { emptyPaginated, isTransientApiError, logApiFallback } from "./fallbacks";
import { apiGet, DEFAULT_REVALIDATE_SECONDS, unwrapData } from "./client";

export async function getAreas(
  params: { page?: number; per_page?: number; keyword?: string; locale?: Locale } = {},
) {
  const { locale = defaultLocale, ...query } = params;
  try {
    return await apiGet<LaravelPaginated<ApiArea>>("/areas", {
      params: query,
      locale,
      revalidate: false,
    });
  } catch (error) {
    logApiFallback("GET /areas", error);
    return emptyPaginated<ApiArea>(query.per_page ?? 9);
  }
}

export const getAreaBySlug = cache(async (slug: string, locale: Locale = defaultLocale) => {
  try {
    const response = await apiGet<ApiArea | { data: ApiArea }>(`/areas/${slug}`, {
      locale,
      revalidate: DEFAULT_REVALIDATE_SECONDS,
    });
    return unwrapData(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    if (isTransientApiError(error)) {
      logApiFallback(`GET /areas/${slug}`, error, { production: true });
      return null;
    }
    throw error;
  }
});
