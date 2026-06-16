import { cache } from "react";
import type {
  ApiBlog,
  ApiBlogCategory,
  BlogListParams,
  LaravelPaginated,
} from "@/types/api";
import { ApiError } from "./errors";
import { apiGet, unwrapData } from "./client";

export async function getBlogCategories() {
  const response = await apiGet<{ data: ApiBlogCategory[] } | ApiBlogCategory[]>(
    "/blog-categories",
  );
  return Array.isArray(response) ? response : unwrapData(response);
}

export async function getBlogs(params: BlogListParams = {}) {
  return apiGet<LaravelPaginated<ApiBlog>>("/blogs", {
    params: {
      page: params.page,
      per_page: params.per_page,
      category: params.category,
    },
  });
}

export const getBlogBySlug = cache(async (slug: string) => {
  try {
    const response = await apiGet<ApiBlog | { data: ApiBlog }>(`/blogs/${slug}`);
    return unwrapData(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
});
