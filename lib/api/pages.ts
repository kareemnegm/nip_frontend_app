import { cache } from "react";
import { apiGet, apiPost, apiRequest, unwrapData } from "./client";
import { getFallbackBuilderPage, getFallbackBuilderPages } from "@/lib/page-builder/fallback-pages";
import type { Locale } from "@/lib/i18n/config";
import type {
  BuilderPage,
  BuilderPageCreatePayload,
  BuilderPagePayload,
  BuilderPageUpdatePayload,
  BuilderSectionCreatePayload,
  BuilderSectionReorderPayload,
  BuilderSectionUpdatePayload,
} from "@/types/api/page-builder";

function normalizePage(raw: BuilderPage): BuilderPage {
  return {
    ...raw,
    sections: [...(raw.sections ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    nav_header_enabled: Boolean(raw.nav_header_enabled),
    nav_footer_enabled: Boolean(raw.nav_footer_enabled),
    nav_footer_zone_key: raw.nav_footer_zone_key ?? undefined,
    nav_label: raw.nav_label ?? raw.title,
  };
}

function unwrapPage(response: BuilderPage | { data: BuilderPage } | null): BuilderPage | null {
  if (!response) return null;
  return normalizePage(unwrapData(response));
}

function unwrapPages(response: BuilderPage[] | BuilderPagePayload | { data: BuilderPage[] }): BuilderPage[] {
  if (Array.isArray(response)) {
    return response.map(normalizePage);
  }
  if ("pages" in response && Array.isArray(response.pages)) {
    return response.pages.map(normalizePage);
  }
  const rows = unwrapData(response as { data: BuilderPage[] });
  return (rows ?? []).map(normalizePage);
}

export const getBuilderPage = cache(async (path: string, locale: Locale): Promise<BuilderPage | null> => {
  try {
    const response = await apiGet<BuilderPage | { data: BuilderPage } | null>("/pages", {
      params: { path, locale },
      locale,
      revalidate: false,
    });
    const page = unwrapPage(response);
    if (page?.is_published) return page;
    return null;
  } catch {
    if (process.env.NODE_ENV !== "production") {
      return getFallbackBuilderPage(path);
    }
    return null;
  }
});

export async function listBuilderPagesAdmin(locale: Locale, token: string): Promise<BuilderPage[]> {
  try {
    const response = await apiGet<BuilderPage[] | BuilderPagePayload | { data: BuilderPage[] }>(
      "/pages/admin",
      { params: { locale }, locale, token, revalidate: false },
    );
    return unwrapPages(response);
  } catch {
    if (process.env.NODE_ENV !== "production") {
      return getFallbackBuilderPages();
    }
    return [];
  }
}

/** Single page including drafts — used by the admin preview screen. */
export async function getBuilderPageAdminById(
  id: string,
  locale: Locale,
  token: string,
): Promise<BuilderPage | null> {
  const pages = await listBuilderPagesAdmin(locale, token);
  return pages.find((page) => page.id === id) ?? null;
}

export async function createBuilderPage(payload: BuilderPageCreatePayload, token: string) {
  return apiPost<{ id: string }>("/pages", payload, { token, revalidate: false });
}

export async function updateBuilderPage(
  id: string,
  payload: BuilderPageUpdatePayload,
  token: string,
) {
  return apiRequest(`/pages/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
    token,
    revalidate: false,
  });
}

export async function deleteBuilderPage(id: string, token: string) {
  return apiRequest(`/pages/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
    revalidate: false,
  });
}

export async function addBuilderSection(
  pageId: string,
  payload: BuilderSectionCreatePayload,
  token: string,
) {
  return apiPost<{ id: string }>(`/pages/${encodeURIComponent(pageId)}/sections`, payload, {
    token,
    revalidate: false,
  });
}

export async function updateBuilderSection(
  sectionId: string,
  payload: BuilderSectionUpdatePayload,
  token: string,
) {
  return apiRequest(`/pages/sections/${encodeURIComponent(sectionId)}`, {
    method: "PATCH",
    body: payload,
    token,
    revalidate: false,
  });
}

export async function deleteBuilderSection(sectionId: string, token: string) {
  return apiRequest(`/pages/sections/${encodeURIComponent(sectionId)}`, {
    method: "DELETE",
    token,
    revalidate: false,
  });
}

export async function reorderBuilderSections(
  payload: BuilderSectionReorderPayload,
  token: string,
) {
  return apiPost("/pages/sections/reorder", payload, { token, revalidate: false });
}
