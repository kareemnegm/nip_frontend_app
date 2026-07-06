import { cache } from "react";
import { apiGet, apiRequest, unwrapData } from "./client";
import {
  buildDefaultPageSeo,
  buildDefaultPageSeoList,
} from "@/lib/navigation/page-seo-defaults";
import type { Locale } from "@/lib/i18n/config";
import type { PageSeo, PageSeoUpsertPayload } from "@/types/api/page-seo";

function pickText(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Merge CMS row with i18n defaults so admin forms show the live effective values. */
export function mergePageSeoWithDefaults(
  cms: PageSeo | null,
  path: string,
  locale: Locale,
): PageSeo | null {
  const defaults = buildDefaultPageSeo(path, locale);
  if (!defaults && !cms) return null;
  if (!cms) return defaults;
  if (!defaults) return cms;

  const metaTitle = pickText(cms.meta_title) ?? defaults.meta_title ?? null;
  const metaDescription =
    pickText(cms.meta_description) ?? defaults.meta_description ?? null;
  const metaKeywords = pickText(cms.meta_keywords) ?? defaults.meta_keywords ?? null;

  return {
    ...defaults,
    ...cms,
    meta_title: metaTitle,
    meta_description: metaDescription,
    meta_keywords: metaKeywords,
    og_title: pickText(cms.og_title) ?? metaTitle,
    og_description: pickText(cms.og_description) ?? metaDescription,
  };
}

function mergePageSeoListWithDefaults(rows: PageSeo[], locale: Locale): PageSeo[] {
  const defaults = buildDefaultPageSeoList(locale);
  const byPath = new Map(defaults.map((row) => [row.path, row]));

  if (rows.length === 0) {
    return defaults;
  }

  for (const row of rows) {
    byPath.set(row.path, mergePageSeoWithDefaults(row, row.path, locale) ?? row);
  }

  return [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
}

export const getPageSeo = cache(
  async (path: string, locale: Locale): Promise<PageSeo | null> => {
    try {
      const response = await apiGet<PageSeo | null | { data: PageSeo | null }>("/page-seo", {
        params: { path, locale },
        locale,
        revalidate: 60,
      });
      if (response !== null && response !== undefined) {
        const row = unwrapData(response);
        if (row) {
          return mergePageSeoWithDefaults(row, path, locale);
        }
      }
    } catch {
      // fall through to defaults
    }
    return buildDefaultPageSeo(path, locale);
  },
);

export async function listPageSeo(locale: Locale, token: string): Promise<PageSeo[]> {
  try {
    const response = await apiGet<PageSeo[] | { data: PageSeo[] }>("/page-seo/admin", {
      params: { locale },
      locale,
      token,
      revalidate: false,
    });
    const rows = Array.isArray(response) ? response : unwrapData(response);
    return mergePageSeoListWithDefaults(rows ?? [], locale);
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
