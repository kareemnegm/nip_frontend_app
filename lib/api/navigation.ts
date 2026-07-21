import { cache } from "react";
import { apiGet, apiPost, apiRequest } from "./client";
import { getBlogCategories } from "./blogs";
import { buildDefaultNavigation } from "@/lib/navigation/defaults";
import {
  mergeNavigationDefaults,
  normalizeNavigationPayload,
} from "@/lib/navigation/normalize";
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
    const raw = await apiGet<NavigationPayload | { data: NavigationPayload }>("/navigation", {
      locale,
      revalidate: 60,
    });
    const payload = normalizeNavigationPayload(raw);
    if (payload.zones.length === 0 && payload.items.length === 0) {
      return defaultNavigationWithInsights(locale);
    }
    return payload;
  } catch {
    return defaultNavigationWithInsights(locale);
  }
});

export async function getNavigationAdmin(
  locale: Locale,
  token: string,
): Promise<NavigationPayload> {
  const defaults = await defaultNavigationWithInsights(locale);
  try {
    const raw = await apiGet<NavigationPayload | { data: NavigationPayload }>(
      "/navigation/admin",
      {
        locale,
        token,
        revalidate: false,
      },
    );
    const payload = normalizeNavigationPayload(raw);
    if (payload.zones.length === 0 && payload.items.length === 0) {
      return defaults;
    }
    return mergeNavigationDefaults(payload, defaults);
  } catch {
    return defaults;
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
