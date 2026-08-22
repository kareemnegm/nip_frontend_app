import { NAV_ZONE_KEYS, type NavZoneKey } from "@/lib/navigation/zone-keys";
import { normalizeBuilderPath } from "./reserved-paths";
import type { NavigationItem } from "@/types/api/navigation";
import type { BuilderPage } from "@/types/api/page-builder";

/** Footer columns staff can pick when adding a builder page link. */
export const PAGE_FOOTER_ZONE_OPTIONS: Array<{ value: NavZoneKey; label: string }> = [
  { value: NAV_ZONE_KEYS.FOOTER_RESOURCES, label: "Resources" },
  { value: NAV_ZONE_KEYS.FOOTER_INSIGHTS, label: "Insights" },
  { value: NAV_ZONE_KEYS.FOOTER_ABOUT, label: "About NIP" },
  { value: NAV_ZONE_KEYS.FOOTER_PROPERTIES, label: "Properties" },
  { value: NAV_ZONE_KEYS.FOOTER_AREAS, label: "Areas" },
  { value: NAV_ZONE_KEYS.FOOTER_OFF_PLAN, label: "Off-plan" },
];

const ALLOWED_FOOTER_ZONES = new Set(PAGE_FOOTER_ZONE_OPTIONS.map((option) => option.value));

export type PageNavPlacementState = {
  headerEnabled: boolean;
  footerEnabled: boolean;
  footerZoneKey: NavZoneKey;
  linkLabel: string;
};

export type ExtraNavLink = {
  label: string;
  href: string;
};

export function defaultNavPlacement(pageTitle: string): PageNavPlacementState {
  return {
    headerEnabled: false,
    footerEnabled: false,
    footerZoneKey: NAV_ZONE_KEYS.FOOTER_RESOURCES,
    linkLabel: pageTitle,
  };
}

function asBool(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

export function isAllowedFooterZone(zoneKey: string | null | undefined): zoneKey is NavZoneKey {
  return Boolean(zoneKey && ALLOWED_FOOTER_ZONES.has(zoneKey as NavZoneKey));
}

/** Checkbox state from GET /pages/admin (Laravel syncs navigation_items). */
export function readNavPlacementFromPage(
  page: Pick<
    BuilderPage,
    "title" | "nav_header_enabled" | "nav_footer_enabled" | "nav_footer_zone_key" | "nav_label"
  >,
): PageNavPlacementState {
  return {
    headerEnabled: asBool(page.nav_header_enabled),
    footerEnabled: asBool(page.nav_footer_enabled),
    footerZoneKey: isAllowedFooterZone(page.nav_footer_zone_key)
      ? page.nav_footer_zone_key
      : NAV_ZONE_KEYS.FOOTER_RESOURCES,
    linkLabel: page.nav_label?.trim() || page.title,
  };
}

function hrefKey(href: string): string {
  const pathOnly = href.split("#")[0]?.split("?")[0] ?? href;
  return normalizeBuilderPath(pathOnly);
}

/**
 * Builder pages stored in navigation_items that are not already in the
 * hardcoded header/footer lists — append these so staff placement shows live.
 */
export function extraNavLinksForZone(
  items: NavigationItem[],
  zoneKey: string,
  existingHrefs: string[],
): ExtraNavLink[] {
  const seen = new Set(existingHrefs.map(hrefKey));
  const extra: ExtraNavLink[] = [];

  const sorted = [...items]
    .filter(
      (item) =>
        item.zone_key === zoneKey &&
        item.is_visible !== false &&
        !item.parent_key &&
        Boolean(item.href) &&
        Boolean(item.label) &&
        !item.id.startsWith("default-item-"),
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  for (const item of sorted) {
    const key = hrefKey(item.href);
    if (seen.has(key)) continue;
    seen.add(key);
    extra.push({ label: item.label, href: item.href });
  }

  return extra;
}
