import { cache } from "react";
import type {
  ApiProperty,
  LaravelPaginated,
  PropertyListParams,
} from "@/types/api";
import { ApiError } from "./errors";
import { apiGet, unwrapData } from "./client";

function toQueryParams(params: PropertyListParams = {}) {
  const query: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query[key] = value;
    }
  }
  return query;
}

export async function getProperties(params: PropertyListParams = {}) {
  return apiGet<LaravelPaginated<ApiProperty>>("/properties", {
    params: toQueryParams(params),
  });
}

export const getPropertyBySlug = cache(async (slug: string) => {
  try {
    const response = await apiGet<ApiProperty | { data: ApiProperty }>(
      `/properties/${slug}`,
    );
    return unwrapData(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
});

export async function getSimilarProperties(slug: string) {
  try {
    const response = await apiGet<{ data: ApiProperty[] } | ApiProperty[]>(
      `/properties/${slug}/similar`,
    );
    return Array.isArray(response) ? response : unwrapData(response);
  } catch {
    return [];
  }
}

export function buildPropertySearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): PropertyListParams {
  const pick = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    page: pick("page") ? Number(pick("page")) : undefined,
    per_page: pick("per_page") ? Number(pick("per_page")) : undefined,
    keyword: pick("keyword") ?? pick("q"),
    type: pick("type"),
    listing_type: pick("listing_type") ?? pick("listing"),
    area: pick("area"),
    developer: pick("developer"),
    bedrooms: pick("bedrooms") ?? pick("beds"),
    bathrooms: pick("bathrooms") ?? pick("baths"),
    min_price: pick("min_price") ?? pick("price_min"),
    max_price: pick("max_price") ?? pick("price_max"),
    price_range: pick("price_range"),
    location: pick("location") ?? pick("community"),
    purpose: pick("purpose"),
  };
}
