import type { FactItem } from "@/components/ui/FactsStrip";
import type { IconName } from "@/components/ui/Icon";
import type { ApiArea } from "@/types/api/area";
import { resolveHighlightIcon } from "./resolve-highlight-icon";

export type AreaFeatureItem = {
  label: string;
  icon: IconName;
  iconSvg?: string | null;
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

function formatAvgPriceSqft(value: number): string {
  return `AED ${new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(value)}`;
}

function formatOffPlanCount(total: number, projectsCountLabel: string): string {
  return `${total} ${projectsCountLabel}`;
}

export function areaFactsFromApi(
  area: ApiArea,
  offPlanTotal: number,
  labels: AreaDetailLabels,
): FactItem[] {
  const avgPrice = area.avg_price_sqft ?? DEFAULT_AVG_PRICE_SQFT;
  const communities = area.communities_count ?? DEFAULT_COMMUNITIES;
  const avgYield = area.avg_yield ?? DEFAULT_AVG_YIELD;
  const lifestyle = area.lifestyle?.trim() || labels.defaultLifestyle;
  const downtown = area.distance_downtown?.trim() || labels.defaultDistanceDowntown;

  return [
    {
      label: labels.avgPriceSqftLabel,
      value: formatAvgPriceSqft(avgPrice),
      icon: "dirham-circle",
    },
    {
      label: labels.communitiesLabel,
      value: String(communities),
      icon: "communities",
    },
    {
      label: labels.offPlanProjectsLabel,
      value: formatOffPlanCount(offPlanTotal, labels.projectsCount),
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

export function resolveAreaHighlights(
  area: ApiArea,
  labels: AreaDetailLabels,
): AreaFeatureItem[] {
  if (area.highlights?.length) {
    return area.highlights.map((item) => {
      const resolved = resolveHighlightIcon(item.label);
      return {
        label: item.label,
        icon: resolved.icon,
        iconSvg: item.icon ?? resolved.iconSvg,
      };
    });
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
    return area.connectivity.map((item) => {
      const resolved = resolveHighlightIcon(item.label);
      return {
        label: item.label,
        icon: resolved.icon,
        iconSvg: item.icon ?? resolved.iconSvg,
      };
    });
  }

  return [
    { label: labels.connectivity1, ...resolveHighlightIcon(labels.connectivity1) },
    { label: labels.connectivity2, ...resolveHighlightIcon(labels.connectivity2) },
    { label: labels.connectivity3, ...resolveHighlightIcon(labels.connectivity3) },
    { label: labels.connectivity4, ...resolveHighlightIcon(labels.connectivity4) },
  ];
}
