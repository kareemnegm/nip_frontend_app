import type { FactItem } from "@/components/ui/FactsStrip";
import { formatCompactAedPrice } from "@/lib/off-plan/detail";
import {
  propertyFactsFromApi,
  type PropertyFactLabels,
} from "@/lib/mappers/property-facts";
import type { ApiProperty } from "@/types/api/property";

export type ResaleDetailLabels = PropertyFactLabels & {
  originalPriceFactLabel: string;
};

/** What the unit originally sold for — distinct from `price`, which is the current asking price. */
export function resolveOriginalPrice(property: ApiProperty): number | null {
  return property.originalPrice ?? property.original_price ?? null;
}

/**
 * Facts strip for a resale unit: the same real-unit facts as /properties/{slug},
 * led by the original price when the backend provides it.
 */
export function resaleFactsFromApi(
  property: ApiProperty,
  labels: ResaleDetailLabels,
): FactItem[] {
  const facts = propertyFactsFromApi(property, labels);
  const originalPrice = resolveOriginalPrice(property);

  if (originalPrice == null) return facts;

  return [
    {
      label: labels.originalPriceFactLabel,
      value: formatCompactAedPrice(originalPrice),
      icon: "dirham-circle" as const,
    },
    ...facts,
  ];
}
