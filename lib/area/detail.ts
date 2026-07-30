import type { FactItem } from "@/components/ui/FactsStrip";
import type { IconName } from "@/components/ui/Icon";
import { amenityIconSvgs } from "@/components/ui/amenity-icon-registry";
import { resolveFigmaAmenityIconKey } from "@/lib/amenities/amenity-icon-keys";
import { resolveAmenityIconSource } from "@/lib/amenities/resolve-amenity-icon";
import type { ApiArea } from "@/types/api/area";
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
  avgYieldLabel: string;
  lifestyleLabel: string;
  toDowntownLabel: string;
  projectsCount: string;
  defaultLifestyle: string;
  defaultDistanceDowntown: string;
  formatToDowntownMinutes: (minutes: number) => string;
  highlight1: string;
  highlight2: string;
  highlight3: string;
  highlight4: string;
  highlight5: string;
  highlight6: string;
  connectivity1: string;
  connectivity2: string;
  connectivity3: string;
  connectivity4: string;
};

const DEFAULT_AVG_PRICE_SQFT = 2400;
const DEFAULT_COMMUNITIES = 28;
const DEFAULT_AVG_YIELD = 6.2;

function formatOffPlanCount(total: number, projectsCountLabel: string): string {
  return `${total} ${projectsCountLabel}`;
}

/** Facts strip — API values when present; dummy defaults when null. */
export function areaFactsFromApi(area: ApiArea, labels: AreaDetailLabels): FactItem[] {
  const avgPrice = area.avg_price_sqft ?? DEFAULT_AVG_PRICE_SQFT;
  const communities = area.communities_count ?? DEFAULT_COMMUNITIES;
  const offplanCount = area.offplan_project_count ?? 0;
  const avgYield = area.avg_yield ?? DEFAULT_AVG_YIELD;
  const lifestyle = area.lifestyle?.trim() || labels.defaultLifestyle;
  const downtown =
    area.to_downtown_minutes != null ?
      labels.formatToDowntownMinutes(area.to_downtown_minutes)
    : area.distance_downtown?.trim() || labels.defaultDistanceDowntown;

  return [
    {
      label: labels.avgPriceSqftLabel,
      value: `AED ${new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(avgPrice)}`,
      icon: "dirham-circle",
    },
    {
      label: labels.communitiesLabel,
      value: String(communities),
      icon: "communities",
    },
    {
      label: labels.offPlanProjectsLabel,
      value: formatOffPlanCount(offplanCount, labels.projectsCount),
      icon: "crane",
    },
    {
      label: labels.avgYieldLabel,
      value: `${avgYield}%`,
      icon: "grow",
    },
    {
      label: labels.lifestyleLabel,
      value: lifestyle,
      icon: "waterfront",
    },
    {
      label: labels.toDowntownLabel,
      value: downtown,
      icon: "skyline",
    },
  ];
}

export type AreaCardLabels = {
  highlight1: string;
  highlight2: string;
  connectivity1: string;
  connectivity2: string;
};

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

function areaFacilitiesToFeatures(area: ApiArea): AreaFeatureItem[] {
  return (area.facilities ?? [])
    .filter((item) => item.facility?.trim())
    .map(mapFacilityToFeatureItem);
}

function defaultCardFacts(labels: AreaCardLabels): AreaFeatureItem[] {
  return [
    { label: labels.highlight1, ...resolveHighlightIcon(labels.highlight1) },
    { label: labels.highlight2, ...resolveHighlightIcon(labels.highlight2) },
    { label: labels.connectivity1, ...resolveHighlightIcon(labels.connectivity1) },
    { label: labels.connectivity2, ...resolveHighlightIcon(labels.connectivity2) },
  ];
}

function padCardFacts(items: AreaFeatureItem[], labels: AreaCardLabels): AreaFeatureItem[] {
  if (items.length >= 4) return items.slice(0, 4);
  const fallbacks = defaultCardFacts(labels);
  return [...items, ...fallbacks].slice(0, 4);
}

/** Figma Card / Area (1054:1280) — 2×2 grid from API facilities, padded with dummy labels when needed. */
export function resolveAreaCardFacts(area: ApiArea, labels: AreaCardLabels): AreaFeatureItem[] {
  const fromFacilities = areaFacilitiesToFeatures(area);
  if (fromFacilities.length > 0) {
    return padCardFacts(fromFacilities, labels);
  }

  if (area.highlights?.length || area.connectivity?.length) {
    const left =
      area.highlights?.length ?
        area.highlights.slice(0, 2).map(mapAreaFeatureItem)
      : [
          { label: labels.highlight1, ...resolveHighlightIcon(labels.highlight1) },
          { label: labels.highlight2, ...resolveHighlightIcon(labels.highlight2) },
        ];

    const right =
      area.connectivity?.length ?
        area.connectivity.slice(0, 2).map(mapAreaFeatureItem)
      : [
          { label: labels.connectivity1, ...resolveHighlightIcon(labels.connectivity1) },
          { label: labels.connectivity2, ...resolveHighlightIcon(labels.connectivity2) },
        ];

    return [...left, ...right].slice(0, 4);
  }

  return defaultCardFacts(labels);
}

export function resolveAreaHighlights(
  area: ApiArea,
  labels: AreaDetailLabels,
): AreaFeatureItem[] {
  const fromFacilities = areaFacilitiesToFeatures(area);
  if (fromFacilities.length > 0) {
    return fromFacilities;
  }

  if (area.highlights?.length) {
    return area.highlights.map((item) => mapAreaFeatureItem(item));
  }

  return [
    { label: labels.highlight1, ...resolveHighlightIcon(labels.highlight1) },
    { label: labels.highlight2, ...resolveHighlightIcon(labels.highlight2) },
    { label: labels.highlight3, ...resolveHighlightIcon(labels.highlight3) },
    { label: labels.highlight4, ...resolveHighlightIcon(labels.highlight4) },
    { label: labels.highlight5, ...resolveHighlightIcon(labels.highlight5) },
    { label: labels.highlight6, ...resolveHighlightIcon(labels.highlight6) },
  ];
}

export function resolveAreaConnectivity(
  area: ApiArea,
  labels: AreaDetailLabels,
): AreaFeatureItem[] {
  if (area.connectivity?.length) {
    return area.connectivity.map((item) => mapAreaFeatureItem(item));
  }

  return [
    { label: labels.connectivity1, ...resolveHighlightIcon(labels.connectivity1) },
    { label: labels.connectivity2, ...resolveHighlightIcon(labels.connectivity2) },
    { label: labels.connectivity3, ...resolveHighlightIcon(labels.connectivity3) },
    { label: labels.connectivity4, ...resolveHighlightIcon(labels.connectivity4) },
  ];
}
