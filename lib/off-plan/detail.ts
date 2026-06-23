import type { FactItem } from "@/components/ui/FactsStrip";
import { formatAedPrice } from "@/lib/mappers/property";
import type { ApiPaymentStep, ApiProperty, ApiUnit } from "@/types/api/property";

export type OffPlanDetailLabels = {
  developerFactLabel: string;
  handoverFactLabel: string;
  unitTypesLabel: string;
  startingFromFactLabel: string;
  paymentLabel: string;
  statusLabel: string;
  statusOffPlan: string;
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

export function defaultPaymentPlan(labels: OffPlanDetailLabels): ApiPaymentStep[] {
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
): ApiPaymentStep[] {
  if (property.payment_plan?.length) {
    return property.payment_plan;
  }
  return defaultPaymentPlan(labels);
}

export function defaultUnits(
  property: ApiProperty,
  labels: OffPlanDetailLabels,
): ApiUnit[] {
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

export function resolveUnits(
  property: ApiProperty,
  labels: OffPlanDetailLabels,
): ApiUnit[] {
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

export function resolvePaymentSplit(property: ApiProperty): string {
  return property.payment_split?.trim() || "60 / 40";
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
      icon: "building",
    });
  }

  if (property.handover_quarter) {
    facts.push({
      label: labels.handoverFactLabel,
      value: property.handover_quarter,
      icon: "calendar",
    });
  }

  facts.push({
    label: labels.unitTypesLabel,
    value: resolveUnitTypes(property),
    icon: "grid",
  });

  if (property.price != null) {
    facts.push({
      label: labels.startingFromFactLabel,
      value: formatCompactAedPrice(property.price),
      icon: "currency",
    });
  }

  facts.push({
    label: labels.paymentLabel,
    value: resolvePaymentSplit(property),
    icon: "percent",
  });

  facts.push({
    label: labels.statusLabel,
    value: labels.statusOffPlan,
    icon: "building",
  });

  return facts;
}

export const paymentPlanCardColors = [
  "bg-sapphire-400",
  "bg-sapphire-500",
  "bg-sapphire-600",
  "bg-sapphire-700",
] as const;
