import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type {
  ApiProperty,
  LaravelPaginated,
  PropertyListParams,
} from "@/types/api";
import { ApiError } from "./errors";
import { emptyPaginated, isOfflineError, logApiFallback } from "./fallbacks";
import { apiGet, unwrapData } from "./client";

function toQueryParams(params: PropertyListParams = {}) {
  const query: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (key === "locale") continue;
    if (value !== undefined && value !== null && value !== "") {
      query[key] = value;
    }
  }
  return query;
}

export async function getProperties(params: PropertyListParams = {}) {
  const { locale = defaultLocale, ...rest } = params;
  try {
    return await apiGet<LaravelPaginated<ApiProperty>>("/properties", {
      params: toQueryParams(rest),
      locale,
    });
  } catch (error) {
    logApiFallback("GET /properties", error);
    return emptyPaginated<ApiProperty>(Number(rest.per_page) || 9);
  }
}

export const getPropertyBySlug = cache(
  async (slug: string, locale: Locale = defaultLocale) => {
    try {
      const response = await apiGet<ApiProperty | { data: ApiProperty }>(
        `/properties/${slug}`,
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

export async function getSimilarProperties(
  slug: string,
  locale: Locale = defaultLocale,
) {
  try {
    const response = await apiGet<{ data: ApiProperty[] } | ApiProperty[]>(
      `/properties/${slug}/similar`,
      { locale },
    );
    return Array.isArray(response) ? response : unwrapData(response);
  } catch (error) {
    logApiFallback(`GET /properties/${slug}/similar`, error);
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
