import { cache } from "react";
import { apiGet, apiPost, apiRequest } from "./client";
import { getBlogCategories } from "./blogs";
import { buildDefaultNavigation } from "@/lib/navigation/defaults";
import type { Locale } from "@/lib/i18n/config";
import type {
  NavigationItemCreatePayload,
  NavigationItemReorderPayload,
  NavigationItemUpdatePayload,
  NavigationPayload,
  NavigationZoneUpdatePayload,
} from "@/types/api/navigation";

async function defaultNavigationWithInsights(locale: Locale) {
  const blogCategories = await getBlogCategories(locale);
  return buildDefaultNavigation(locale, { blogCategories });
}

export const getNavigation = cache(async (locale: Locale): Promise<NavigationPayload> => {
  try {
    return await apiGet<NavigationPayload>("/navigation", {
      locale,
      revalidate: 60,
    });
  } catch {
    return defaultNavigationWithInsights(locale);
  }
});

export async function getNavigationAdmin(
  locale: Locale,
  token: string,
): Promise<NavigationPayload> {
  try {
    return await apiGet<NavigationPayload>("/navigation/admin", {
      locale,
      token,
      revalidate: false,
    });
  } catch {
    return defaultNavigationWithInsights(locale);
  }
}

export async function updateNavigationZone(
  key: string,
  payload: NavigationZoneUpdatePayload,
  token: string,
) {
  return apiRequest(`/navigation/zones/${encodeURIComponent(key)}`, {
    method: "PATCH",
    body: payload,
    token,
    revalidate: false,
  });
}

export async function createNavigationItem(
  payload: NavigationItemCreatePayload,
  token: string,
) {
  return apiPost<{ id: string }>("/navigation/items", payload, {
    token,
    revalidate: false,
  });
}

export async function updateNavigationItem(
  id: string,
  payload: NavigationItemUpdatePayload,
  token: string,
) {
  return apiRequest(`/navigation/items/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
    token,
    revalidate: false,
  });
}

export async function deleteNavigationItem(id: string, token: string) {
  return apiRequest(`/navigation/items/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
    revalidate: false,
  });
}

export async function reorderNavigationItems(
  payload: NavigationItemReorderPayload,
  token: string,
) {
  return apiPost("/navigation/items/reorder", payload, {
    token,
    revalidate: false,
  });
}
