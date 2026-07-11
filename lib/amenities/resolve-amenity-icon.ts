import type { AmenityIconName } from "@/components/ui/amenity-icon-registry";
import { DEFAULT_AMENITY_ICON } from "@/lib/amenities/amenity-icon-keys";
import { sanitizeFacilityIconSvg } from "@/lib/amenities/sanitize-facility-icon";

export type AmenityIconSource =
  | { kind: "backend-svg"; svg: string }
  | { kind: "backend-url"; url: string }
  | { kind: "figma"; name: AmenityIconName };

type FacilityIconInput = {
  facilityIcon?: string | null;
  iconUrl?: string | null;
};

/**
 * Backend SVG only — ignores icon_key so each facility keeps its own artwork.
 * 1. facility_icon (inline SVG)
 * 2. icon_url (CDN)
 * 3. star
 */
export function resolveAmenityIconSource(
  input: FacilityIconInput,
): AmenityIconSource {
  const svg = sanitizeFacilityIconSvg(input.facilityIcon);
  if (svg) return { kind: "backend-svg", svg };

  const url = input.iconUrl?.trim();
  if (url) return { kind: "backend-url", url };

  return { kind: "figma", name: DEFAULT_AMENITY_ICON };
}
