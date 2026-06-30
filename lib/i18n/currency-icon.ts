import type { IconName } from "@/components/ui/Icon";

const CURRENCY_ICON_MAP: Record<string, IconName> = {
  AED: "dirham",
  USD: "dollar",
  EUR: "euro",
  GBP: "pound",
};

/** Map ISO currency code to the Figma currency glyph (defaults to Dirham). */
export function iconForCurrency(currency?: string | null): IconName {
  if (!currency) return "dirham";
  return CURRENCY_ICON_MAP[currency.toUpperCase()] ?? "dirham";
}

/** Strip a leading currency code prefix from a formatted price string. */
export function stripCurrencyPrefix(value: string, currency = "AED"): string {
  const pattern = new RegExp(`^${currency}\\s*`, "i");
  return value.replace(pattern, "").trim();
}
