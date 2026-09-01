import type { FactItem } from "@/components/ui/FactsStrip";
import { formatAedPrice, formatFurnishing } from "@/lib/mappers/property";
import {
  propertyFactsFromApi,
  type PropertyFactLabels,
} from "@/lib/mappers/property-facts";
import type { AvailableUnitRow } from "@/lib/off-plan/detail";
import type { ApiAvailableUnit, ApiProperty } from "@/types/api/property";

export type RentalDetailLabels = PropertyFactLabels & {
  chequesLabel: (count: number) => string;
  chequesFactLabel: string;
  pricePerYear: string;
  pricePerMonth: string;
};

export function resolvePricePeriod(property: ApiProperty): string | null {
  return property.pricePeriod ?? property.price_period ?? null;
}

export function rentalPricePeriodSuffix(
  property: ApiProperty,
  labels: Pick<RentalDetailLabels, "pricePerYear" | "pricePerMonth">,
): string {
  const period = resolvePricePeriod(property)?.toLowerCase();
  if (period === "monthly") return labels.pricePerMonth;
  if (period === "yearly") return labels.pricePerYear;
  return "";
}

export function resolveRentalPriceLabel(
  property: ApiProperty,
  labels: Pick<RentalDetailLabels, "pricePerYear" | "pricePerMonth">,
): string {
  const fromApi = property.priceLabel ?? property.price_label;
  if (fromApi?.trim()) return fromApi.trim();

  const price = property.price;
  if (price == null || Number.isNaN(price)) return "—";

  const suffix = rentalPricePeriodSuffix(property, labels);
  return `AED ${formatAedPrice(price)}${suffix}`;
}

export function resolveFurnishingLabel(property: ApiProperty): string | null {
  const fromApi = property.furnishingLabel ?? property.furnishing_label;
  if (fromApi?.trim()) return fromApi.trim();
  if (property.furnishing?.trim()) return formatFurnishing(property.furnishing);
  return null;
}

export function resolveChequeCount(property: ApiProperty): number | null {
  const count = property.chequeCount ?? property.cheque_count;
  if (count == null || Number.isNaN(count) || count <= 0) return null;
  return count;
}

export function rentalHighlightsLine(
  property: ApiProperty,
  labels: RentalDetailLabels,
): string | null {
  const segments = [
    resolveRentalPriceLabel(property, labels),
    resolveFurnishingLabel(property),
    resolveChequeCount(property) != null
      ? labels.chequesLabel(resolveChequeCount(property)!)
      : null,
  ].filter((segment) => segment && segment !== "—");

  return segments.length > 0 ? segments.join(" · ") : null;
}

export function rentalPriceEyebrowKey(property: ApiProperty): "yearlyRent" | "monthlyRent" | "rentalPrice" {
  const period = resolvePricePeriod(property)?.toLowerCase();
  if (period === "yearly") return "yearlyRent";
  if (period === "monthly") return "monthlyRent";
  return "rentalPrice";
}

/** Facts strip for rental — core unit specs + cheques; reference lives in the hero. */
export function rentalFactsFromApi(
  property: ApiProperty,
  labels: RentalDetailLabels,
): FactItem[] {
  const facts = propertyFactsFromApi(property, labels)
    .filter(
      (fact) =>
        fact.label !== labels.referenceLabel &&
        fact.value.trim() !== "" &&
        fact.value !== "—",
    )
    .map((fact) => {
      if (fact.label !== labels.furnishingLabel) return fact;
      const furnishing = resolveFurnishingLabel(property);
      return {
        ...fact,
        value: furnishing ?? "—",
      };
    })
    .filter((fact) => fact.value !== "—");

  const chequeCount = resolveChequeCount(property);
  if (chequeCount == null) return facts;

  const chequeFact: FactItem = {
    label: labels.chequesFactLabel,
    value: String(chequeCount),
    icon: "percent",
  };

  const furnishingIndex = facts.findIndex((fact) => fact.label === labels.furnishingLabel);
  if (furnishingIndex === -1) {
    return [...facts, chequeFact];
  }

  return [
    ...facts.slice(0, furnishingIndex + 1),
    chequeFact,
    ...facts.slice(furnishingIndex + 1),
  ];
}

function appendRentalPeriodToPriceLabel(
  priceLabel: string,
  property: ApiProperty,
  labels: Pick<RentalDetailLabels, "pricePerYear" | "pricePerMonth">,
): string {
  if (priceLabel.includes("/")) return priceLabel;
  const suffix = rentalPricePeriodSuffix(property, labels);
  return suffix ? `${priceLabel}${suffix}` : priceLabel;
}

function mapRentalAvailableUnit(
  unit: ApiAvailableUnit,
  property: ApiProperty,
  labels: Pick<RentalDetailLabels, "pricePerYear" | "pricePerMonth">,
): AvailableUnitRow {
  const unitType = unit.unitType ?? unit.unit_type;
  const sizeLabel =
    unit.sizeSqftLabel ??
    unit.size_sqft_label ??
    unit.size_sqft ??
    "—";

  let priceLabel =
    unit.startingPriceLabel ??
    unit.starting_price_label ??
    (unit.starting_price != null ? `AED ${formatAedPrice(unit.starting_price)}` : null) ??
    "—";

  if (priceLabel !== "—") {
    priceLabel = appendRentalPeriodToPriceLabel(priceLabel, property, labels);
  }

  return {
    unit_type: unitType,
    size_sqft: sizeLabel,
    starting_price: priceLabel,
  };
}

export function resolveRentalAvailableUnitsFromApi(
  property: ApiProperty,
  labels: Pick<RentalDetailLabels, "pricePerYear" | "pricePerMonth">,
): AvailableUnitRow[] {
  const raw = property.availableUnits ?? property.available_units;
  if (!raw?.length) return [];
  return raw.map((unit) => mapRentalAvailableUnit(unit, property, labels));
}
