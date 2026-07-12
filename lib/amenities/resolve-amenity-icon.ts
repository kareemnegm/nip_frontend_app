import { sanitizeFacilityIconSvg } from "@/lib/amenities/sanitize-facility-icon";

export type AmenityIconSource =
  | { kind: "backend-svg"; svg: string }
  | { kind: "backend-url"; url: string };

type FacilityIconInput = {
  facilityIcon?: string | null;
  iconUrl?: string | null;
};

/**
 * API SVG only — renders `facility_icon` or `icon_url` from the response.
 * Returns null when neither is present (no Figma, no icon_key, no star).
 */
export function resolveAmenityIconSource(
  input: FacilityIconInput,
): AmenityIconSource | null {
  const svg = sanitizeFacilityIconSvg(input.facilityIcon);
  if (svg) return { kind: "backend-svg", svg };

  const url = input.iconUrl?.trim();
  if (url) return { kind: "backend-url", url };

  return null;
}
