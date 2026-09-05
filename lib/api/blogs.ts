import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type {
  ApiBlog,
  ApiBlogCategory,
  BlogListParams,
  LaravelPaginated,
} from "@/types/api";
import {
  filterEditorialBlogCategories,
  isLegacyBlogCategorySlug,
} from "@/lib/mappers/blog-categories";
import { ApiError } from "./errors";
import { emptyPaginated, isOfflineError, logApiFallback } from "./fallbacks";
import { apiGet, unwrapData } from "./client";
import { STATIC_PAGE_REVALIDATE_SECONDS } from "@/lib/page-cache";

export async function getBlogCategories(locale: Locale = defaultLocale) {
  try {
    const response = await apiGet<{ data: ApiBlogCategory[] } | ApiBlogCategory[]>(
      "/blog-categories",
      { locale, revalidate: STATIC_PAGE_REVALIDATE_SECONDS },
    );
    return Array.isArray(response) ? response : unwrapData(response);
  } catch (primaryError) {
    try {
      const response = await apiGet<{ data: ApiBlogCategory[] } | ApiBlogCategory[]>(
        "/insights/categories",
        { locale, revalidate: STATIC_PAGE_REVALIDATE_SECONDS },
      );
      return Array.isArray(response) ? response : unwrapData(response);
    } catch (fallbackError) {
      logApiFallback("GET /blog-categories", primaryError);
      logApiFallback("GET /insights/categories", fallbackError);
      return [];
    }
  }
}

/**
 * Categories a contributor may pitch into on `/contribute`, in the order the
 * dropdown should list them. `/blog-categories` also returns legacy slugs left
 * over from the old-site import (`market-insights`, `investment-guide`,
 * `lifestyle`, `news`, `tips`) which are not editorial destinations for new
 * submissions — note `investment-guide` singular is an older, different
 * category to the plural one below.
 */
const CONTRIBUTOR_CATEGORY_SLUGS = [
  "market-intelligence",
  "investment-guides",
  "community-guides",
];

export async function getContributorCategories(locale: Locale = defaultLocale) {
  const categories = (await getBlogCategories(locale)).filter(
    (category) => !isLegacyBlogCategorySlug(category.slug),
  );
  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  return CONTRIBUTOR_CATEGORY_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (category): category is ApiBlogCategory => Boolean(category),
  );
}

export { filterEditorialBlogCategories, isLegacyBlogCategorySlug };

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
      revalidate: STATIC_PAGE_REVALIDATE_SECONDS,
    });
  } catch (error) {
    logApiFallback("GET /blogs", error);
    return emptyPaginated<ApiBlog>(query.per_page ?? 9);
  }
}

export const getBlogBySlug = cache(
  async (slug: string, locale: Locale = defaultLocale) => {
    try {
      const response = await apiGet<ApiBlog | { data: ApiBlog }>(
        `/blogs/${slug}`,
        { locale, revalidate: STATIC_PAGE_REVALIDATE_SECONDS },
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
