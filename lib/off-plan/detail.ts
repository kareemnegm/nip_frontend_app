import type { FactItem } from "@/components/ui/FactsStrip";
import { formatAedPrice, getPrimaryDeveloperName, propertyCardLocationLine } from "@/lib/mappers/property";
import type {
  ApiAvailableUnit,
  ApiPaymentPlanGroup,
  ApiProperty,
} from "@/types/api/property";

/** Normalized payment step for UI rendering */
export type PaymentPlanStep = {
  caption?: string | null;
  /** Big card value — percentage (e.g. "20%") or EOI currency (e.g. "AED 196,000"). */
  percentage: string;
  label: string;
};

/** One selectable plan — the section shows a switcher when there is more than one. */
export type PaymentPlanGroup = {
  title: string;
  steps: PaymentPlanStep[];
};

/** Normalized unit for UI rendering */
export type AvailableUnitRow = {
  unit_type: string;
  size_sqft: string;
  starting_price: string;
};

/** Shared by off-plan and resale — both render the payment plan cards. */
export type PaymentPlanLabels = {
  paymentStep1Caption: string;
  paymentStep1Label: string;
  paymentStep2Caption: string;
  paymentStep2Label: string;
  paymentStep3Caption: string;
  paymentStep3Label: string;
  paymentStep4Caption: string;
  paymentStep4Label: string;
};

export type OffPlanDetailLabels = PaymentPlanLabels & {
  developerFactLabel: string;
  handoverFactLabel: string;
  unitTypesLabel: string;
  startingFromFactLabel: string;
  paymentLabel: string;
  statusLabel: string;
  statusOffPlan: string;
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

/** Top card labels are fixed design copy, not backend data. */
function paymentPlanCaptions(labels: PaymentPlanLabels): string[] {
  return [
    labels.paymentStep1Caption,
    labels.paymentStep2Caption,
    labels.paymentStep3Caption,
    labels.paymentStep4Caption,
  ];
}

function isEoiPaymentStage(
  stage: string,
  caption?: string | null,
  description?: string | null,
): boolean {
  if (stage.trim().toLowerCase() === "eoi") {
    return true;
  }

  const haystack = `${caption ?? ""} ${description ?? ""}`.toLowerCase();
  return haystack.includes("eoi") || haystack.includes("expression of interest");
}

function parseStepPercentage(value: string | number): number {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number.parseInt(String(value).replace(/[^\d]/g, ""), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatPaymentPlanDisplayValue(
  stage: string,
  percentage: number,
  propertyPrice?: number | null,
  caption?: string | null,
  description?: string | null,
  amount?: number | null,
): string {
  if (!isEoiPaymentStage(stage, caption, description)) {
    return `${percentage}%`;
  }

  if (amount != null && amount > 0) {
    return formatUnitPrice(amount);
  }

  // EOI rows may store the fixed booking fee directly (AED) when >= 100.
  if (percentage >= 100) {
    return formatUnitPrice(percentage);
  }

  // Otherwise derive the booking amount from the published starting price.
  if (propertyPrice != null && propertyPrice > 0) {
    return formatUnitPrice(Math.round((propertyPrice * percentage) / 100));
  }

  return formatUnitPrice(percentage);
}

export function defaultPaymentPlan(
  labels: PaymentPlanLabels,
  propertyPrice?: number | null,
): PaymentPlanStep[] {
  const captions = paymentPlanCaptions(labels);
  const stageDefs = [
    { caption: captions[0], percentage: 10, label: labels.paymentStep1Label },
    { caption: captions[1], percentage: 20, label: labels.paymentStep2Label },
    { caption: captions[2], percentage: 30, label: labels.paymentStep3Label },
    { caption: captions[3], percentage: 40, label: labels.paymentStep4Label },
  ];

  return stageDefs.map(({ caption, percentage, label }) => ({
    caption,
    percentage: formatPaymentPlanDisplayValue(
      label,
      percentage,
      propertyPrice,
      caption,
    ),
    label,
  }));
}

function backendPaymentPlanGroups(
  property: ApiProperty,
): ApiPaymentPlanGroup[] | null {
  const groups = property.paymentPlans ?? property.payment_plans;
  if (!groups?.length) return null;
  const withStages = groups.filter((group) => group.stages?.length);
  return withStages.length ? withStages : null;
}

/** True when the backend actually shipped a plan for this property. */
export function hasBackendPaymentPlan(property: ApiProperty): boolean {
  return Boolean(
    backendPaymentPlanGroups(property) ||
      property.paymentPlan?.length ||
      property.payment_plan?.length,
  );
}

export function resolvePaymentPlan(
  property: ApiProperty,
  labels: PaymentPlanLabels,
): PaymentPlanStep[] {
  const propertyPrice = property.price ?? null;
  const captions = paymentPlanCaptions(labels);
  const groups = backendPaymentPlanGroups(property);
  if (groups) {
    return stagesToSteps(groups[0].stages ?? [], captions, propertyPrice);
  }
  // Prefer new camelCase shape from backend.
  if (property.paymentPlan?.length) {
    return stagesToSteps(property.paymentPlan, captions, propertyPrice);
  }
  // Fallback to snake_case shape
  if (property.payment_plan?.length) {
    const isStandardPlan = property.payment_plan.length === captions.length;
    return property.payment_plan.map((step, index) => {
      const caption = isStandardPlan
        ? (captions[index] ?? null)
        : (step.caption ?? captions[index] ?? null);
      const percentage = parseStepPercentage(step.percentage);
      return {
        caption,
        percentage: formatPaymentPlanDisplayValue(
          step.label,
          percentage,
          propertyPrice,
          caption,
          step.caption,
        ),
        label: step.label,
      };
    });
  }
  return defaultPaymentPlan(labels, propertyPrice);
}

/**
 * Caption ownership:
 *
 * - The standard 4-stage plan is a fixed design layout, so its top labels are
 *   frontend copy (localized, and identical on every property). The backend's
 *   `description` is ignored there — stored values have repeatedly been wrong
 *   ("Reservation& Spa", "keys&completeions") and there is no Arabic for them.
 * - Any other plan shape (e.g. a 2-stage post-handover plan) is bespoke per
 *   property, so its captions come from the backend, falling back to the design
 *   copy when a description is blank.
 *
 * The backend always owns `stage` and the numeric share/amount input. EOI stages
 * render as AED (see formatPaymentPlanDisplayValue), not as a percentage.
 */
function stagesToSteps(
  stages: {
    stage: string;
    percentage: number;
    description?: string;
    amount?: number | null;
    amount_aed?: number | null;
  }[],
  captions: string[],
  propertyPrice?: number | null,
): PaymentPlanStep[] {
  const isStandardPlan = stages.length === captions.length;

  return stages.map((item, index) => {
    const caption = isStandardPlan
      ? (captions[index] ?? null)
      : item.description?.trim() || captions[index] || null;
    const amount = item.amount ?? item.amount_aed ?? null;

    return {
      caption,
      percentage: formatPaymentPlanDisplayValue(
        item.stage,
        item.percentage,
        propertyPrice,
        caption,
        item.description,
        amount,
      ),
      label: item.stage,
    };
  });
}

/**
 * Every plan the buyer can switch between. Falls back to a single unnamed group
 * so callers can always render the same component.
 */
export function resolvePaymentPlanGroups(
  property: ApiProperty,
  labels: PaymentPlanLabels,
): PaymentPlanGroup[] {
  const propertyPrice = property.price ?? null;
  const captions = paymentPlanCaptions(labels);
  const groups = backendPaymentPlanGroups(property);
  if (groups) {
    return groups
      .map((group, index) => ({
        position: group.position ?? index + 1,
        title: (group.title ?? group.name ?? "").trim(),
        steps: stagesToSteps(group.stages ?? [], captions, propertyPrice),
      }))
      .sort((a, b) => a.position - b.position)
      .map(({ title, steps }) => ({ title, steps }));
  }
  return [{ title: "", steps: resolvePaymentPlan(property, labels) }];
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

/** Maps API available-units only — no placeholder rows. */
export function resolveAvailableUnitsFromApi(property: ApiProperty): AvailableUnitRow[] {
  const raw = property.availableUnits ?? property.available_units;
  if (!raw?.length) return [];
  return raw.map(mapAvailableUnit);
}

export function resolveUnits(
  property: ApiProperty,
  labels: OffPlanDetailLabels,
): AvailableUnitRow[] {
  const fromApi = resolveAvailableUnitsFromApi(property);
  if (fromApi.length) return fromApi;
  // Legacy units field
  if (property.units?.length) {
    return property.units;
  }
  return defaultUnits(property, labels);
}

function bedLabel(count: number): string {
  return `${count} Bed`;
}

/** Builds "1 Bed" or "1–4 Bed" from a min/max bedroom range */
function formatBedsRange(
  min: number | null | undefined,
  max: number | null | undefined,
): string | null {
  if (min == null) return null;
  if (max == null || max === min) return bedLabel(min);
  return `${min}–${max} Bed`;
}

/** Extracts the bed count from strings like "1 Bed", "Studio", "4-Bedroom" */
function parseBedCount(unitType: string): number | null {
  const match = unitType.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

/** Derives min/max bed range from available_units' unitType labels, e.g. "1 Bed" + "4 Bed" → 1–4 */
function bedsRangeFromAvailableUnits(
  property: ApiProperty,
): { min: number; max: number } | null {
  const units = property.availableUnits ?? property.available_units;
  if (!units?.length) return null;

  const counts = units
    .map((unit) => parseBedCount(unit.unitType ?? unit.unit_type ?? ""))
    .filter((count): count is number => count != null);

  if (!counts.length) return null;
  return { min: Math.min(...counts), max: Math.max(...counts) };
}

export function resolveUnitTypes(property: ApiProperty): string {
  // Prefer backend-computed summary (new camelCase, then snake_case)
  if (property.unitTypes?.trim()) {
    return property.unitTypes;
  }
  if (property.unit_types?.trim()) {
    return property.unit_types;
  }
  // Derive from explicit min/max bed fields
  const bedsMin = property.bedsMin ?? property.beds_min;
  const bedsMax = property.bedsMax ?? property.beds_max;
  const fromMinMax = formatBedsRange(bedsMin, bedsMax);
  if (fromMinMax) return fromMinMax;
  // Derive from available_units' unitType labels
  const fromUnits = bedsRangeFromAvailableUnits(property);
  if (fromUnits) {
    return formatBedsRange(fromUnits.min, fromUnits.max) ?? "1–4 Bed";
  }
  if (property.bedrooms != null) {
    return bedLabel(property.bedrooms);
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
  const developer = getPrimaryDeveloperName(property.developers);
  const location = property.location ?? property.area?.name ?? "Dubai";
  if (developer) {
    return `${location} | by ${developer}`;
  }
  return location;
}

/** Off-plan listing card — Figma 1525:28104: `{area} | {developer}`. */
export function offPlanCardLocationLine(property: ApiProperty): string {
  return propertyCardLocationLine(property);
}

export function offPlanFactsFromApi(
  property: ApiProperty,
  labels: OffPlanDetailLabels,
): FactItem[] {
  const facts: FactItem[] = [];
  const developer = getPrimaryDeveloperName(property.developers);

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

  return facts;
}

export const paymentPlanCardColors = [
  "bg-sapphire-400",
  "bg-sapphire-500",
  "bg-sapphire-600",
  "bg-sapphire-700",
] as const;
