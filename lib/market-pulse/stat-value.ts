/** Parse staff-edited stat copy (e.g. "2,400", "6.2%") for count-up animation attrs. */
export function parseMarketPulseStatValue(raw: string): {
  count: string;
  suffix: string;
  decimals: number;
  display: string;
} {
  const trimmed = raw.trim();
  const hasPercent = trimmed.includes("%");
  const numericPart = trimmed.replace(/%/g, "").replace(/,/g, "").trim();
  const parsed = Number.parseFloat(numericPart);

  if (!Number.isFinite(parsed)) {
    return { count: "0", suffix: "", decimals: 0, display: trimmed || "0" };
  }

  const decimals = numericPart.includes(".")
    ? Math.min(numericPart.split(".")[1]?.length ?? 0, 2)
    : 0;
  const suffix = hasPercent ? "%" : "";
  const display =
    decimals > 0
      ? `${parsed.toFixed(decimals)}${suffix}`
      : `${Math.round(parsed).toLocaleString()}${suffix}`;

  return {
    count: numericPart,
    suffix,
    decimals,
    display,
  };
}

export function marketPulseKeysFromTitle(titleKey: string) {
  const prefix = titleKey.replace(/-title$/, "");
  return {
    cta: `${prefix}-cta`,
    stats: [1, 2, 3, 4].map((index) => ({
      context: `${prefix}-stat-${index}-context`,
      value: `${prefix}-stat-${index}-value`,
      label: `${prefix}-stat-${index}-label`,
    })),
  } as const;
}
