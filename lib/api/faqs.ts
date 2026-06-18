import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { ApiFaq } from "@/types/api";
import { apiGet, unwrapData } from "./client";

export async function getFaqs(locale: Locale = defaultLocale) {
  try {
    const response = await apiGet<{ data: ApiFaq[] } | ApiFaq[]>("/faqs", {
      locale,
    });
    return Array.isArray(response) ? response : unwrapData(response);
  } catch {
    return [];
  }
}
