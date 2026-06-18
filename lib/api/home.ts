import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { ApiHomeResponse } from "@/types/api";
import { EMPTY_HOME } from "./fallbacks";
import { apiGet } from "./client";

export const getHome = cache(async (locale: Locale = defaultLocale) => {
  try {
    const response = await apiGet<ApiHomeResponse>("/home", { locale });
    return response.data;
  } catch {
    return EMPTY_HOME;
  }
});
