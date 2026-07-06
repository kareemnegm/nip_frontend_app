import { cache } from "react";
import { apiGet, apiRequest } from "./client";
import {
  buildDefaultPageSeo,
  buildDefaultPageSeoList,
} from "@/lib/navigation/page-seo-defaults";
import type { Locale } from "@/lib/i18n/config";
import type { PageSeo, PageSeoUpsertPayload } from "@/types/api/page-seo";

export const getPageSeo = cache(
  async (path: string, locale: Locale): Promise<PageSeo | null> => {
    try {
      const row = await apiGet<PageSeo | null>("/page-seo", {
        params: { path, locale },
        locale,
        revalidate: 60,
      });
      if (row) return row;
    } catch {
      // fall through to defaults
    }
    return buildDefaultPageSeo(path, locale);
  },
);

export async function listPageSeo(locale: Locale, token: string): Promise<PageSeo[]> {
  try {
    const rows = await apiGet<PageSeo[]>("/page-seo/admin", {
      params: { locale },
      locale,
      token,
      revalidate: false,
    });
    if (rows.length > 0) return rows;
  } catch {
    // fall through
  }
  return buildDefaultPageSeoList(locale);
}

export async function upsertPageSeo(payload: PageSeoUpsertPayload, token: string) {
  return apiRequest("/page-seo", {
    method: "PUT",
    body: payload,
    token,
    revalidate: false,
  });
}

export { buildDefaultPageSeoList };
