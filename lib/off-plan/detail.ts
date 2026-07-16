import type { FactItem } from "@/components/ui/FactsStrip";
import { formatAedPrice, formatFurnishing } from "@/lib/mappers/property";
import type { ApiAvailableUnit, ApiProperty } from "@/types/api/property";

/** Normalized payment step for UI rendering */
export type PaymentPlanStep = {
  caption?: string | null;
  percentage: string;
  label: string;
};

/** Normalized unit for UI rendering */
export type AvailableUnitRow = {
  unit_type: string;
  size_sqft: string;
  starting_price: string;
};

export type OffPlanDetailLabels = {
  developerFactLabel: string;
  handoverFactLabel: string;
  unitTypesLabel: string;
  startingFromFactLabel: string;
  paymentLabel: string;
  statusLabel: string;
  statusOffPlan: string;
  furnishingFactLabel: string;
  referenceFactLabel: string;
  paymentStep1Caption: string;
  paymentStep1Label: string;
  paymentStep2Caption: string;
  paymentStep2Label: string;
  paymentStep3Caption: string;
  paymentStep3Label: string;
  paymentStep4Caption: string;
  paymentStep4Label: string;
  defaultUnit1Type: string;
  defaultUnit1Size: string;
  defaultUnit2Type: string;
  defaultUnit2Size: string;
  defaultUnit3Type: string;
  defaultUnit3Size: string;
  defaultUnit4Type: string;
  defaultUnit4Size: string;
};

export function formatCompactAedPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || Number.isNaN(price)) {
    return "—";
  }
  if (price >= 1_000_000) {
    const millions = price / 1_000_000;
    const formatted =
      millions % 1 === 0
        ? String(millions)
        : millions.toFixed(2).replace(/\.?0+$/, "");
    return `AED ${formatted}M`;
  }
  return `AED ${formatAedPrice(price)}`;
}

export function formatUnitPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || Number.isNaN(price)) {
    return "—";
  }
  return `AED ${formatAedPrice(price)}`;
}

export function defaultPaymentPlan(labels: OffPlanDetailLabels): PaymentPlanStep[] {
  return [
    {
      caption: labels.paymentStep1Caption,
      percentage: "10%",
      label: labels.paymentStep1Label,
    },
    {
      caption: labels.paymentStep2Caption,
      percentage: "20%",
      label: labels.paymentStep2Label,
    },
    {
      caption: labels.paymentStep3Caption,
      percentage: "30%",
      label: labels.paymentStep3Label,
    },
    {
      caption: labels.paymentStep4Caption,
      percentage: "40%",
      label: labels.paymentStep4Label,
    },
  ];
}

export function resolvePaymentPlan(
  property: ApiProperty,
  labels: OffPlanDetailLabels,
): PaymentPlanStep[] {
  // Prefer new camelCase shape from backend
  if (property.paymentPlan?.length) {
    return property.paymentPlan.map((item) => ({
      caption: item.stage,
      percentage: `${item.percentage}%`,
      label: item.description ?? "",
    }));
  }
  // Fallback to snake_case shape
  if (property.payment_plan?.length) {
    return property.payment_plan;
  }
  return defaultPaymentPlan(labels);
}

export function defaultUnits(
  property: ApiProperty,
  labels: OffPlanDetailLabels,
): AvailableUnitRow[] {
  const base = property.price ?? 4_710_000;
  return [
    {
      unit_type: labels.defaultUnit1Type,
      size_sqft: labels.defaultUnit1Size,
      starting_price: formatUnitPrice(Math.round(base * 0.25)),
    },
    {
      unit_type: labels.defaultUnit2Type,
      size_sqft: labels.defaultUnit2Size,
      starting_price: formatUnitPrice(Math.round(base * 0.45)),
    },
    {
      unit_type: labels.defaultUnit3Type,
      size_sqft: labels.defaultUnit3Size,
      starting_price: formatUnitPrice(Math.round(base * 0.73)),
    },
    {
      unit_type: labels.defaultUnit4Type,
      size_sqft: labels.defaultUnit4Size,
      starting_price: formatUnitPrice(base),
    },
  ];
}

/** Builds "750" or "750–850" when no ready-made label is provided */
function formatSizeRange(
  from: number | null | undefined,
  to: number | null | undefined,
): string | null {
  if (from == null) return null;
  if (to == null || to === from) return String(from);
  return `${from}–${to}`;
}

/** Builds "AED 902,500" or "AED 902,500 – 1,200,000" when no ready-made label is provided */
function formatPriceRange(
  from: number | null | undefined,
  to: number | null | undefined,
): string | null {
  if (from == null) return null;
  if (to == null || to === from) return `AED ${formatAedPrice(from)}`;
  return `AED ${formatAedPrice(from)} – ${formatAedPrice(to)}`;
}

function mapAvailableUnit(unit: ApiAvailableUnit): AvailableUnitRow {
  const sizeLabel =
    unit.sizeSqftLabel ??
    unit.size_sqft_label ??
    formatSizeRange(
      unit.sizeSqftFrom ?? unit.size_sqft_from,
      unit.sizeSqftTo ?? unit.size_sqft_to,
    ) ??
    // Legacy "size_sqft" is a plain string equivalent of sizeSqftLabel
    unit.size_sqft;

  const priceLabel =
    unit.startingPriceLabel ??
    unit.starting_price_label ??
    formatPriceRange(
      unit.startingPriceFrom ?? unit.starting_price_from,
      unit.startingPriceTo ?? unit.starting_price_to,
    ) ??
    // Legacy "starting_price" is a plain number equivalent of startingPriceFrom
    formatUnitPrice(unit.starting_price);

  return {
    unit_type: unit.unitType ?? unit.unit_type,
    size_sqft: sizeLabel ?? "—",
    starting_price: priceLabel,
  };
}

export function resolveUnits(
  property: ApiProperty,
  labels: OffPlanDetailLabels,
): AvailableUnitRow[] {
  // Prefer new camelCase shape from backend
  if (property.availableUnits?.length) {
    return property.availableUnits.map(mapAvailableUnit);
  }
  // Fallback to snake_case shape
  if (property.available_units?.length) {
    return property.available_units.map(mapAvailableUnit);
  }
  // Legacy units field
  if (property.units?.length) {
    return property.units;
  }
  return defaultUnits(property, labels);
}

export function resolveUnitTypes(property: ApiProperty): string {
  if (property.unit_types?.trim()) {
    return property.unit_types;
  }
  if (property.bedrooms != null) {
    return `${property.bedrooms} Bed`;
  }
  return "1–4 Bed";
}

/** Raw payment_plan_summary_parts values, fixed length 4 (unused slots are null) */
export function resolvePaymentSplitParts(
  property: ApiProperty,
): (number | null)[] {
  const parts = property.paymentPlanSummaryParts ?? property.payment_plan_summary_parts;
  if (!parts?.length) return [null, null, null, null];
  const normalized = parts.slice(0, 4).map((value) =>
    typeof value === "number" && Number.isFinite(value) ? value : null,
  );
  while (normalized.length < 4) normalized.push(null);
  return normalized;
}

/** Mirrors the backend join rule: filled parts joined with " / ", e.g. [60,40] -> "60 / 40" */
function summaryFromParts(parts: (number | null)[]): string | null {
  const filled = parts.filter((value): value is number => value != null);
  return filled.length ? filled.join(" / ") : null;
}

export function resolvePaymentSplit(property: ApiProperty): string {
  // Prefer new camelCase shape from backend
  if (property.paymentPlanSummary?.trim()) {
    return property.paymentPlanSummary;
  }
  // Fallback to snake_case shape
  if (property.payment_plan_summary?.trim()) {
    return property.payment_plan_summary;
  }
  // Derive from raw parts array when only that is present
  const fromParts = summaryFromParts(resolvePaymentSplitParts(property));
  if (fromParts) return fromParts;
  // Legacy payment_split field
  return property.payment_split?.trim() || "60 / 40";
}

function formatHandoverDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    return `Q${quarter} ${date.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function resolveHandover(property: ApiProperty): string | null {
  // Prefer camelCase handoverQuarter
  if (property.handoverQuarter?.trim()) {
    return property.handoverQuarter;
  }
  // Fallback to snake_case handover_quarter
  if (property.handover_quarter?.trim()) {
    return property.handover_quarter;
  }
  // Format from camelCase handoverDate
  if (property.handoverDate?.trim()) {
    return formatHandoverDate(property.handoverDate);
  }
  // Format from snake_case handover_date
  if (property.handover_date?.trim()) {
    return formatHandoverDate(property.handover_date);
  }
  return null;
}

export function offPlanLocationLine(property: ApiProperty): string {
  const developer = property.developers?.[0]?.name;
  const location = property.location ?? property.area?.name ?? "Dubai";
  if (developer) {
    return `${location} | by ${developer}`;
  }
  return location;
}

export function offPlanFactsFromApi(
  property: ApiProperty,
  labels: OffPlanDetailLabels,
): FactItem[] {
  const facts: FactItem[] = [];
  const developer = property.developers?.[0]?.name;

  if (developer) {
    facts.push({
      label: labels.developerFactLabel,
      value: developer,
      icon: "developer",
    });
  }

  const handover = resolveHandover(property);
  if (handover) {
    facts.push({
      label: labels.handoverFactLabel,
      value: handover,
      icon: "handover",
    });
  }

  facts.push({
    label: labels.unitTypesLabel,
    value: resolveUnitTypes(property),
    icon: "floorplan",
  });

  if (property.price != null) {
    facts.push({
      label: labels.startingFromFactLabel,
      value: formatCompactAedPrice(property.price),
      icon: "dirham-circle",
    });
  }

  facts.push({
    label: labels.paymentLabel,
    value: resolvePaymentSplit(property),
    icon: "mortgage",
  });

  facts.push({
    label: labels.statusLabel,
    value: labels.statusOffPlan,
    icon: "crane",
  });

  facts.push({
    label: labels.furnishingFactLabel,
    value: property.furnishing ? formatFurnishing(property.furnishing) : "—",
    icon: "sofa",
  });

  facts.push({
    label: labels.referenceFactLabel,
    value: property.reference_no ?? "—",
    icon: "reference",
  });

  return facts;
}

export const paymentPlanCardColors = [
  "bg-sapphire-400",
  "bg-sapphire-500",
  "bg-sapphire-600",
  "bg-sapphire-700",
] as const;
