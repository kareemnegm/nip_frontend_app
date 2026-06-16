import { cache } from "react";
import type { ApiDeveloper, LaravelPaginated } from "@/types/api";
import { ApiError } from "./errors";
import { apiGet, unwrapData } from "./client";

export async function getDevelopers(
  params: { page?: number; per_page?: number } = {},
) {
  return apiGet<LaravelPaginated<ApiDeveloper>>("/developers", { params });
}

export const getDeveloperBySlug = cache(async (slug: string) => {
  try {
    const response = await apiGet<ApiDeveloper | { data: ApiDeveloper }>(
      `/developers/${slug}`,
    );
    return unwrapData(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
});
