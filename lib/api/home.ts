import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { ApiHomeResponse } from "@/types/api";
import { sortDevelopersByOrder } from "@/lib/mappers/developer";
import { EMPTY_HOME, logApiFallback } from "./fallbacks";
import { apiGet } from "./client";
import { STATIC_PAGE_REVALIDATE_SECONDS } from "@/lib/page-cache";

export const getHome = cache(async (locale: Locale = defaultLocale) => {
  try {
    const response = await apiGet<ApiHomeResponse>("/home", {
      locale,
      revalidate: STATIC_PAGE_REVALIDATE_SECONDS,
    });
    return {
      ...response.data,
      developers: sortDevelopersByOrder(response.data.developers ?? []),
    };
  } catch (error) {
    logApiFallback("GET /home", error);
    return EMPTY_HOME;
  }
});
