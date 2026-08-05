import type { FactItem } from "@/components/ui/FactsStrip";
import type { IconName } from "@/components/ui/Icon";
import { amenityIconSvgs } from "@/components/ui/amenity-icon-registry";
import { resolveFigmaAmenityIconKey } from "@/lib/amenities/amenity-icon-keys";
import { resolveAmenityIconSource } from "@/lib/amenities/resolve-amenity-icon";
import type { ApiArea, ApiAreaConnectivity } from "@/types/api/area";
import type { ApiFacility } from "@/types/api/property";
import { resolveHighlightIcon } from "./resolve-highlight-icon";

export type AreaFeatureItem = {
  label: string;
  icon: IconName;
  iconSvg?: string | null;
  iconUrl?: string | null;
};

export type AreaDetailLabels = {
  avgPriceSqftLabel: string;
  communitiesLabel: string;
  offPlanProjectsLabel: string;
  readyProjectsLabel: string;
  avgYieldLabel: string;
  lifestyleLabel: string;
  toDowntownLabel: string;
  projectsCount: string;
  formatToDowntownMinutes: (minutes: number) => string;
};

/** Formats a connectivity pill, e.g. ("Airport", 25) → "Airport · 25 min". */
export type ConnectivityLabelFormatter = (label: string, minutes: number) => string;

/**
 * Curated numeric stats only count when a real value was entered. Blank, junk
 * and zero all mean "nothing to show" — no area has an AED 0/sqft price, a 0%
 * yield or 0 communities worth printing.
 */
function positiveNumber(value: number | string | null | undefined): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

function formatProjectCount(total: number, projectsCountLabel: string): string {
  return `${total} ${projectsCountLabel}`;
}

type OptionalFact = Omit<FactItem, "value"> & { value: string | null };

function pushFact(facts: FactItem[], fact: OptionalFact) {
  if (fact.value == null) return;
  facts.push({ ...fact, value: fact.value });
}

/**
 * Facts strip — API values only. Every stat is optional in the admin panel, so a
 * field left blank is omitted entirely rather than filled with an invented
 * number. An area with no stats at all renders no strip.
 */
export function areaFactsFromApi(area: ApiArea, labels: AreaDetailLabels): FactItem[] {
  const facts: FactItem[] = [];

  const avgPrice = positiveNumber(area.avg_price_sqft);
  pushFact(facts, {
    label: labels.avgPriceSqftLabel,
    value:
      avgPrice == null ?
        null
      : `AED ${new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(avgPrice)}`,
    icon: "dirham-circle",
  });

  const communities = positiveNumber(area.communities_count);
  pushFact(facts, {
    label: labels.communitiesLabel,
    value: communities == null ? null : String(communities),
    icon: "communities",
  });

  const offplanCount = positiveNumber(area.offplan_project_count);
  pushFact(facts, {
    label: labels.offPlanProjectsLabel,
    value:
      offplanCount == null ?
        null
      : formatProjectCount(offplanCount, labels.projectsCount),
    icon: "crane",
  });

  const readyCount = positiveNumber(area.ready_project_count);
  pushFact(facts, {
    label: labels.readyProjectsLabel,
    value:
      readyCount == null ?
        null
      : formatProjectCount(readyCount, labels.projectsCount),
    icon: "building",
    areaFactIcon: "ready",
  });

  const avgYield = positiveNumber(area.avg_yield);
  pushFact(facts, {
    label: labels.avgYieldLabel,
    value: avgYield == null ? null : `${avgYield}%`,
    icon: "grow",
  });

  pushFact(facts, {
    label: labels.lifestyleLabel,
    value: area.lifestyle?.trim() || null,
    icon: "waterfront",
  });

  pushFact(facts, {
    label: labels.toDowntownLabel,
    value:
      area.to_downtown_minutes != null ?
        labels.formatToDowntownMinutes(area.to_downtown_minutes)
      : area.distance_downtown?.trim() || null,
    icon: "skyline",
  });

  return facts;
}

function mapAreaFeatureItem(item: { label: string; icon?: string | null }): AreaFeatureItem {
  const resolved = resolveHighlightIcon(item.label);
  return {
    label: item.label,
    icon: resolved.icon,
    iconSvg: item.icon ?? resolved.iconSvg,
  };
}

/** Maps API `facilities[]` — icon_key first, then inline SVG, then label fallback. */
export function mapFacilityToFeatureItem(facility: ApiFacility): AreaFeatureItem {
  const label = facility.facility?.trim() || "";

  const amenityKey = resolveFigmaAmenityIconKey(facility.icon_key);
  if (amenityKey) {
    return { label, icon: "star", iconSvg: amenityIconSvgs[amenityKey] };
  }

  const source = resolveAmenityIconSource({
    facilityIcon: facility.facility_icon,
    iconUrl: facility.icon_url,
  });

  if (source?.kind === "backend-svg") {
    return { label, icon: "star", iconSvg: source.svg };
  }

  if (source?.kind === "backend-url") {
    return { label, icon: "star", iconUrl: source.url };
  }

  const resolved = resolveHighlightIcon(label);
  return { label, icon: resolved.icon, iconSvg: resolved.iconSvg };
}

/**
 * A connectivity destination reuses the amenity icon resolution, then gains its
 * travel time in the label ("Airport" + 25 → "Airport · 25 min"). Without
 * minutes the destination stands on its own.
 */
function mapConnectivityItem(
  item: ApiAreaConnectivity,
  formatLabel?: ConnectivityLabelFormatter,
): AreaFeatureItem {
  const feature = mapFacilityToFeatureItem(item);
  const minutes = item.minutes;

  if (minutes == null || !Number.isFinite(minutes) || !formatLabel) {
    return feature;
  }

  return { ...feature, label: formatLabel(feature.label, minutes) };
}

function areaFacilitiesToFeatures(area: ApiArea): AreaFeatureItem[] {
  return (area.facilities ?? [])
    .filter((item) => item.facility?.trim())
    .map(mapFacilityToFeatureItem);
}

/**
 * Figma Card / Area (1054:1280) — up to a 2×2 grid built from the area's own
 * amenities. No padding with invented labels: an area with two amenities shows
 * two chips, one with none shows none.
 */
export function resolveAreaCardFacts(area: ApiArea): AreaFeatureItem[] {
  const fromFacilities = areaFacilitiesToFeatures(area);
  if (fromFacilities.length > 0) {
    return fromFacilities.slice(0, 4);
  }

  const left = (area.highlights ?? []).slice(0, 2).map(mapAreaFeatureItem);
  const right = (area.connectivity ?? []).slice(0, 2).map((item) => mapConnectivityItem(item));

  return [...left, ...right].slice(0, 4);
}

export function resolveAreaHighlights(area: ApiArea): AreaFeatureItem[] {
  const fromFacilities = areaFacilitiesToFeatures(area);
  if (fromFacilities.length > 0) {
    return fromFacilities;
  }

  return (area.highlights ?? []).map(mapAreaFeatureItem);
}

/**
 * Connectivity pills — amenity-catalog destinations with an optional travel
 * time. Icons resolve exactly like the amenity chips (`mapFacilityToFeatureItem`);
 * the minutes are appended to the label when the admin set them.
 */
export function resolveAreaConnectivity(
  area: ApiArea,
  formatLabel?: ConnectivityLabelFormatter,
): AreaFeatureItem[] {
  return (area.connectivity ?? [])
    .filter((item) => item.facility?.trim())
    .map((item) => mapConnectivityItem(item, formatLabel));
}

