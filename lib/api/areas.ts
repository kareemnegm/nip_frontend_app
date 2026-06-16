import { cache } from "react";
import type { ApiArea, LaravelPaginated } from "@/types/api";
import { ApiError } from "./errors";
import { apiGet, unwrapData } from "./client";

export async function getAreas(params: { page?: number; per_page?: number } = {}) {
  return apiGet<LaravelPaginated<ApiArea>>("/areas", { params });
}

export const getAreaBySlug = cache(async (slug: string) => {
  try {
    const response = await apiGet<ApiArea | { data: ApiArea }>(`/areas/${slug}`);
    return unwrapData(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
});
