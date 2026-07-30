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
  formatToDowntownMinutes: (minutes: number) => string;
};

function formatOffPlanCount(total: number, projectsCountLabel: string): string {
  return `${total} ${projectsCountLabel}`;
}

/** Facts strip — uses API fields; omits tiles when value is null (counts always show). */
export function areaFactsFromApi(area: ApiArea, labels: AreaDetailLabels): FactItem[] {
  const facts: FactItem[] = [];

  if (area.avg_price_sqft != null) {
    facts.push({
      label: labels.avgPriceSqftLabel,
      value: `AED ${new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(area.avg_price_sqft)}`,
      icon: "dirham-circle",
    });
  }

  if (area.communities_count != null) {
    facts.push({
      label: labels.communitiesLabel,
      value: String(area.communities_count),
      icon: "communities",
    });
  }

  facts.push({
    label: labels.offPlanProjectsLabel,
    value: formatOffPlanCount(area.offplan_project_count ?? 0, labels.projectsCount),
    icon: "crane",
  });

  if (area.avg_yield != null) {
    facts.push({
      label: labels.avgYieldLabel,
      value: `${area.avg_yield}%`,
      icon: "grow",
    });
  }

  if (area.lifestyle?.trim()) {
    facts.push({
      label: labels.lifestyleLabel,
      value: area.lifestyle.trim(),
      icon: "waterfront",
    });
  }

  if (area.to_downtown_minutes != null) {
    facts.push({
      label: labels.toDowntownLabel,
      value: labels.formatToDowntownMinutes(area.to_downtown_minutes),
      icon: "skyline",
    });
  } else if (area.distance_downtown?.trim()) {
    facts.push({
      label: labels.toDowntownLabel,
      value: area.distance_downtown.trim(),
      icon: "skyline",
    });
  }

  return facts;
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

export function resolveAreaHighlights(area: ApiArea): AreaFeatureItem[] {
  const fromFacilities = areaFacilitiesToFeatures(area);
  if (fromFacilities.length > 0) {
    return fromFacilities;
  }

  if (area.highlights?.length) {
    return area.highlights.map((item) => mapAreaFeatureItem(item));
  }

  return [];
}

export function resolveAreaConnectivity(area: ApiArea): AreaFeatureItem[] {
  if (!area.connectivity?.length) {
    return [];
  }

  return area.connectivity.map((item) => mapAreaFeatureItem(item));
}
