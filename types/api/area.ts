import type { ApiFacility } from "@/types/api/property";

export type ApiAreaHighlight = {
  label: string;
  icon?: string | null;
};

/**
 * A connectivity destination — an amenity-catalog entry (same shape and icon
 * fields as `ApiFacility`) plus the travel time set per area. `minutes` is
 * optional: null renders the destination name on its own.
 */
export type ApiAreaConnectivity = ApiFacility & {
  minutes?: number | null;
};

export type ApiArea = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  /** Short hero intro. Null/empty means the hero shows no paragraph. */
  hero_description?: string | null;
  image_url?: string | null;
  photo_url?: string | null;
  project_count?: number;
  offplan_project_count?: number;
  ready_project_count?: number;
  /**
   * Curated display values — a plain number ("2900") or a range/open-ended
   * string as typed in admin ("2,200 - 4,500", "8+"). Units (AED, %) are added
   * by the frontend, never stored.
   */
  avg_price_sqft?: number | string | null;
  avgPriceSqft?: number | string | null;
  avg_yield?: number | string | null;
  avgYield?: number | string | null;
  lifestyle?: string | null;
  communities_count?: number | string | null;
  communitiesCount?: number | string | null;
  to_downtown_minutes?: number | null;
  /** @deprecated Prefer `to_downtown_minutes`. */
  distance_downtown?: string | null;
  map_image_url?: string | null;
  latitude?: number;
  longitude?: number;
  highlights?: ApiAreaHighlight[] | null;
  connectivity?: ApiAreaConnectivity[] | null;
  facilities?: ApiFacility[] | null;
  facility_ids?: number[] | null;
  properties?: unknown[];
};
