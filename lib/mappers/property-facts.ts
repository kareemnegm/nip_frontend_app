import type { FactItem } from "@/components/ui/FactsStrip";
import { formatFurnishing } from "@/lib/mappers/property";
import type { ApiProperty } from "@/types/api/property";

export type PropertyFactLabels = {
  bedroomLabel: string;
  bathroomLabel: string;
  areaLabel: string;
  typeLabel: string;
  furnishingLabel: string;
  referenceLabel: string;
};

/** Facts strip cells for a ready/resale unit — the real unit data, not project data. */
export function propertyFactsFromApi(
  property: ApiProperty,
  labels: PropertyFactLabels,
): FactItem[] {
  return [
    property.bedrooms != null
      ? { label: labels.bedroomLabel, value: String(property.bedrooms), icon: "bed" as const }
      : null,
    property.bathrooms != null
      ? { label: labels.bathroomLabel, value: String(property.bathrooms), icon: "bath" as const }
      : null,
    property.area_sqft != null
      ? {
          label: labels.areaLabel,
          value: `${new Intl.NumberFormat("en-AE").format(property.area_sqft)} sq ft`,
          icon: "area" as const,
        }
      : null,
    property.type
      ? { label: labels.typeLabel, value: property.type, icon: "building" as const }
      : null,
    {
      label: labels.furnishingLabel,
      value: property.furnishing ? formatFurnishing(property.furnishing) : "—",
      icon: "sofa" as const,
    },
    {
      label: labels.referenceLabel,
      value: property.reference_no ?? "—",
      icon: "reference" as const,
    },
  ].filter(Boolean) as FactItem[];
}
