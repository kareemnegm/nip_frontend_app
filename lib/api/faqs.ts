import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { ApiFaq, ApiFaqsResponse } from "@/types/api";
import { logApiFallback } from "./fallbacks";
import { apiGet, unwrapData } from "./client";

function normalizeFaqs(
  response: ApiFaq[] | ApiFaqsResponse | { data: ApiFaq[] },
): ApiFaq[] {
  if (Array.isArray(response)) return response;
  if ("items" in response && Array.isArray(response.items)) return response.items;
  if ("data" in response) return unwrapData(response);
  return [];
}

export async function getFaqs(locale: Locale = defaultLocale) {
  try {
    const response = await apiGet<
      ApiFaq[] | ApiFaqsResponse | { data: ApiFaq[] }
    >("/faqs", { locale });
    return normalizeFaqs(response);
  } catch (error) {
    logApiFallback("GET /faqs", error);
    return [];
  }
}
