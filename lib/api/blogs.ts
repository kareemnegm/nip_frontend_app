import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type {
  ApiBlog,
  ApiBlogCategory,
  BlogListParams,
  LaravelPaginated,
} from "@/types/api";
import { ApiError } from "./errors";
import { emptyPaginated, isOfflineError } from "./fallbacks";
import { apiGet, unwrapData } from "./client";

export async function getBlogCategories(locale: Locale = defaultLocale) {
  try {
    const response = await apiGet<{ data: ApiBlogCategory[] } | ApiBlogCategory[]>(
      "/blog-categories",
      { locale },
    );
    return Array.isArray(response) ? response : unwrapData(response);
  } catch {
    return [];
  }
}

export async function getBlogs(params: BlogListParams = {}) {
  const { locale = defaultLocale, ...query } = params;
  try {
    return await apiGet<LaravelPaginated<ApiBlog>>("/blogs", {
      params: {
        page: query.page,
        per_page: query.per_page,
        category: query.category,
      },
      locale,
    });
  } catch {
    return emptyPaginated<ApiBlog>(query.per_page ?? 9);
  }
}

export const getBlogBySlug = cache(
  async (slug: string, locale: Locale = defaultLocale) => {
    try {
      const response = await apiGet<ApiBlog | { data: ApiBlog }>(
        `/blogs/${slug}`,
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
