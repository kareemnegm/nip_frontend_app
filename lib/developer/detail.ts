import type { FactItem } from "@/components/ui/FactsStrip";
import type { IconName } from "@/components/ui/Icon";
import type { AreaFeatureItem } from "@/lib/area/detail";
import type { ApiDeveloper } from "@/types/api/developer";
import type { ApiProperty } from "@/types/api/property";

export type DeveloperDetailLabels = {
  establishedLabel: string;
  deliveredLabel: string;
  underDevLabel: string;
  communitiesFactLabel: string;
  unitsLabel: string;
  presenceLabel: string;
  defaultEstablished: string;
  defaultDelivered: string;
  defaultUnderDev: string;
  defaultCommunities: string;
  defaultUnits: string;
  defaultPresence: string;
  strength1: string;
  strength2: string;
  strength3: string;
  strength4: string;
  strength5: string;
  strength6: string;
};

export function developerFactsFromApi(
  developer: ApiDeveloper,
  offPlanTotal: number,
  labels: DeveloperDetailLabels,
): FactItem[] {
  const established =
    developer.established_year != null
      ? String(developer.established_year)
      : labels.defaultEstablished;

  const delivered =
    developer.delivered_count?.trim() ||
    (developer.properties_count != null
      ? `${developer.properties_count}+ Projects`
      : labels.defaultDelivered);

  const underDev =
    developer.under_development_count?.trim() ||
    (offPlanTotal > 0 ? `${offPlanTotal}+ Projects` : labels.defaultUnderDev);

  const communities =
    developer.communities_count != null
      ? String(developer.communities_count)
      : labels.defaultCommunities;

  const units = developer.units_count?.trim() || labels.defaultUnits;
  const presence = developer.presence?.trim() || labels.defaultPresence;

  return [
    { label: labels.establishedLabel, value: established, icon: "established" },
    { label: labels.deliveredLabel, value: delivered, icon: "delivered" },
    { label: labels.underDevLabel, value: underDev, icon: "crane" },
    { label: labels.communitiesFactLabel, value: communities, icon: "communities" },
    { label: labels.unitsLabel, value: units, icon: "floorplan" },
    { label: labels.presenceLabel, value: presence, icon: "globe-presence" },
  ];
}

const defaultStrengthIcons: IconName[] = [
  "skyline",
  "handover",
  "percent",
  "star",
  "concierge",
  "globe-presence",
];

export function defaultDeveloperStrengths(
  labels: DeveloperDetailLabels,
): AreaFeatureItem[] {
  return [
    { label: labels.strength1, icon: defaultStrengthIcons[0]! },
    { label: labels.strength2, icon: defaultStrengthIcons[1]! },
    { label: labels.strength3, icon: defaultStrengthIcons[2]! },
    { label: labels.strength4, icon: defaultStrengthIcons[3]! },
    { label: labels.strength5, icon: defaultStrengthIcons[4]! },
    { label: labels.strength6, icon: defaultStrengthIcons[5]! },
  ];
}

export function uniqueAreaSlugsFromProperties(properties: ApiProperty[]): string[] {
  const seen = new Set<string>();
  const slugs: string[] = [];

  for (const property of properties) {
    const slug = property.area?.slug;
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      slugs.push(slug);
    }
  }

  return slugs;
}
