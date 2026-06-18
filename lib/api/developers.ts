import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { ApiDeveloper, LaravelPaginated } from "@/types/api";
import { ApiError } from "./errors";
import { emptyPaginated, isOfflineError } from "./fallbacks";
import { apiGet, unwrapData } from "./client";

export async function getDevelopers(
  params: { page?: number; per_page?: number; locale?: Locale } = {},
) {
  const { locale = defaultLocale, ...query } = params;
  try {
    return await apiGet<LaravelPaginated<ApiDeveloper>>("/developers", {
      params: query,
      locale,
    });
  } catch {
    return emptyPaginated<ApiDeveloper>(query.per_page ?? 9);
  }
}

export const getDeveloperBySlug = cache(
  async (slug: string, locale: Locale = defaultLocale) => {
    try {
      const response = await apiGet<ApiDeveloper | { data: ApiDeveloper }>(
        `/developers/${slug}`,
        { locale },
      );
      return unwrapData(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      if (isOfflineError(error)) {
        return null;
      }
      throw error;
    }
  },
);
