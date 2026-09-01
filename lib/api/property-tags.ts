import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { ApiPropertyTag } from "@/lib/catalog/property-tag-links";
import { logApiFallback } from "./fallbacks";
import { apiGet, unwrapData } from "./client";

export const getPropertyTags = cache(async (locale: Locale = defaultLocale) => {
  try {
    const response = await apiGet<ApiPropertyTag[] | { data: ApiPropertyTag[] }>(
      "/property-tags",
      { locale, revalidate: false },
    );
    return unwrapData(response);
  } catch (error) {
    logApiFallback("GET /property-tags", error);
    return [
      { value: "featured", label: "Featured" },
      { value: "upcoming", label: "Upcoming" },
      { value: "new_launch", label: "New Launch" },
    ] satisfies ApiPropertyTag[];
  }
});
