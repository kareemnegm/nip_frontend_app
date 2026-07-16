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
  strength1: string;
  strength2: string;
  strength3: string;
  strength4: string;
  strength5: string;
  strength6: string;
};

function displayString(value: string | number | null | undefined): string | null {
  if (value == null) return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function formatCommunitiesCount(
  value: number | string | null | undefined,
): string | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(n)) return null;
  return String(n);
}

function pushFact(
  facts: FactItem[],
  label: string,
  value: string | null,
  icon: IconName,
) {
  if (value == null) return;
  facts.push({ label, value, icon });
}

/**
 * Build developer facts strip from API fields.
 * Labels/icons stay in frontend; values come from CMS via API as-is.
 * Null/empty fields are omitted (no blank slots).
 */
export function developerFactsFromApi(
  developer: ApiDeveloper,
  labels: DeveloperDetailLabels,
): FactItem[] {
  const facts: FactItem[] = [];

  pushFact(
    facts,
    labels.establishedLabel,
    displayString(developer.establishedYear ?? developer.established_year),
    "established",
  );
  pushFact(
    facts,
    labels.deliveredLabel,
    displayString(
      developer.projectsDelivered ??
        developer.projects_delivered ??
        developer.delivered_count,
    ),
    "delivered",
  );
  pushFact(
    facts,
    labels.underDevLabel,
    displayString(
      developer.projectsUnderDevelopment ??
        developer.projects_under_development ??
        developer.under_development_count,
    ),
    "crane",
  );
  pushFact(
    facts,
    labels.communitiesFactLabel,
    formatCommunitiesCount(
      developer.communitiesCount ?? developer.communities_count,
    ),
    "communities",
  );
  pushFact(
    facts,
    labels.unitsLabel,
    displayString(
      developer.unitsDisplay ?? developer.units_display ?? developer.units_count,
    ),
    "floorplan",
  );
  pushFact(
    facts,
    labels.presenceLabel,
    displayString(developer.presence),
    "globe-presence",
  );

  return facts;
}

/** Figma T07 developer strength chips (1525:27855). */
const defaultStrengthIcons: IconName[] = [
  "skyline",
  "handover-check",
  "resale",
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
