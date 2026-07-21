import { unwrapData } from "@/lib/api/client";
import type { NavigationItem, NavigationPayload, NavigationZone } from "@/types/api/navigation";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

/** Normalize API / BFF JSON into `{ zones, items }` (handles Laravel `{ data: … }` wraps). */
export function normalizeNavigationPayload(raw: unknown): NavigationPayload {
  if (!isRecord(raw)) {
    return { zones: [], items: [] };
  }

  let payload: unknown = unwrapData(raw as NavigationPayload | { data: NavigationPayload });

  if (isRecord(payload) && isRecord(payload.data) && !Array.isArray(payload.zones)) {
    payload = payload.data;
  }

  if (!isRecord(payload)) {
    return { zones: [], items: [] };
  }

  const zones = Array.isArray(payload.zones) ? (payload.zones as NavigationZone[]) : [];
  const items = Array.isArray(payload.items) ? (payload.items as NavigationItem[]) : [];

  return { zones, items };
}

function itemIdentityKey(item: NavigationItem) {
  return [
    item.zone_key,
    item.locale,
    item.href,
    item.parent_key ?? "",
  ].join("|");
}

/**
 * Admin editor: fill missing header + footer zones/links from i18n defaults when the API
 * is empty, wrapped wrong, or only partially seeded.
 */
export function mergeNavigationDefaults(
  payload: NavigationPayload,
  defaults: NavigationPayload,
): NavigationPayload {
  const zones = [...payload.zones];
  for (const zone of defaults.zones) {
    if (!zones.some((z) => z.key === zone.key && z.locale === zone.locale)) {
      zones.push(zone);
    }
  }

  const items = [...payload.items];
  const seen = new Set(items.map(itemIdentityKey));
  for (const item of defaults.items) {
    const key = itemIdentityKey(item);
    if (!seen.has(key)) {
      items.push(item);
      seen.add(key);
    }
  }

  return { zones, items };
}
