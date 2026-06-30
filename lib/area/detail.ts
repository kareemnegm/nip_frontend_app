import type { FactItem } from "@/components/ui/FactsStrip";
import type { IconName } from "@/components/ui/Icon";
import type { ApiArea } from "@/types/api/area";

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
      icon: "grid",
    },
    {
      label: labels.offPlanProjectsLabel,
      value: formatOffPlanCount(offPlanTotal, labels.projectsCount),
      icon: "crane",
    },
    {
      label: labels.avgYieldLabel,
      value: `${avgYield}%`,
      icon: "percent",
    },
    {
      label: labels.lifestyleLabel,
      value: lifestyle,
      icon: "globe",
    },
    {
      label: labels.toDowntownLabel,
      value: downtown,
      icon: "metro",
    },
  ];
}

const defaultHighlightIcons: IconName[] = [
  "mapPin",
  "building",
  "home",
  "mapPin",
  "building",
  "home",
];

export function resolveAreaHighlights(
  area: ApiArea,
  labels: AreaDetailLabels,
): AreaFeatureItem[] {
  if (area.highlights?.length) {
    return area.highlights.map((item, index) => ({
      label: item.label,
      icon: defaultHighlightIcons[index % defaultHighlightIcons.length] ?? "home",
      iconSvg: item.icon,
    }));
  }

  return [
    { label: labels.highlight1, icon: "mapPin" },
    { label: labels.highlight2, icon: "building" },
    { label: labels.highlight3, icon: "home" },
    { label: labels.highlight4, icon: "mapPin" },
    { label: labels.highlight5, icon: "building" },
    { label: labels.highlight6, icon: "home" },
  ];
}

const defaultConnectivityIcons: IconName[] = ["mapPin", "building", "mapPin", "grid"];

export function resolveAreaConnectivity(
  area: ApiArea,
  labels: AreaDetailLabels,
): AreaFeatureItem[] {
  if (area.connectivity?.length) {
    return area.connectivity.map((item, index) => ({
      label: item.label,
      icon: defaultConnectivityIcons[index % defaultConnectivityIcons.length] ?? "mapPin",
      iconSvg: item.icon,
    }));
  }

  return [
    { label: labels.connectivity1, icon: "mapPin" },
    { label: labels.connectivity2, icon: "building" },
    { label: labels.connectivity3, icon: "mapPin" },
    { label: labels.connectivity4, icon: "grid" },
  ];
}
