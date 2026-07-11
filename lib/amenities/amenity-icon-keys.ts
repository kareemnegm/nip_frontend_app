import type { AmenityIconName } from "@/components/ui/amenity-icon-registry";
import { amenityIconSvgs } from "@/components/ui/amenity-icon-registry";

/**
 * Same-category aliases only — maps variant keys to an existing Figma glyph.
 * No cross-type reuse (tennis ≠ basketball, wifi ≠ smart-home).
 */
const ICON_KEY_ALIASES: Record<string, AmenityIconName> = {
  // Security variants
  cctv: "security",
  surveillance: "security",
  guard: "security",
  biometric: "security",
  gated: "security",
  "safe-room": "security",

  // Pool variants
  swim: "pool",
  swimming: "pool",
  "infinity-pool": "pool",
  "rooftop-pool": "pool",
  "kids-pool": "pool",
  "lap-pool": "pool",
  "private-pool": "pool",
  "sun-deck": "pool",

  // Kids variants
  "kids-play": "kids",
  playground: "kids",
  children: "kids",
  nursery: "kids",
  daycare: "kids",
  trampoline: "kids",

  // Garden / greenery
  garden: "flower",
  gardens: "flower",
  landscaped: "flower",
  lawn: "flower",
  "community-lawn": "flower",
  pet: "flower",
  "green-building": "flower",

  // Fitness
  gym: "fitness",
  "outdoor-gym": "fitness",

  // Cycling / trails
  trail: "cycling",
  trails: "cycling",
  jogging: "cycling",
  running: "cycling",
  walking: "cycling",
  "walking-trails": "cycling",
  "jogging-track": "cycling",

  // Wellness → spa or yoga (same category)
  wellness: "spa",
  sauna: "spa",
  steam: "spa",
  "steam-room": "spa",
  jacuzzi: "spa",
  beauty: "spa",
  meditation: "yoga",
  pilates: "yoga",
  dance: "yoga",

  // Smart home
  automation: "smart-home",
  "smart-home-automation": "smart-home",
  "ai-home": "smart-home",

  // Concierge / service
  butler: "concierge",
  reception: "concierge",
  housekeeping: "concierge",
  "hotel-style-reception": "concierge",

  // Valet / transport
  chauffeur: "valet",
  shuttle: "valet",
  arrival: "valet",

  // Dining
  dining: "dinner",
  "fine-dining": "dinner",
  restaurant: "dinner",
  cafe: "dinner",
  supermarket: "dinner",
  wine: "dinner",

  // Lounge variants
  relaxation: "lounge",
  "sky-lounge": "lounge",
  "cigar-lounge": "lounge",

  // Location / water
  retail: "branded-location",
  shopping: "branded-location",
  marina: "sea",
  waterfront: "sea",
  "water-sports": "beach",

  // Parking
  garage: "parking",
  "ev-charging": "parking",
  driveway: "parking",
};

/** Placeholder keys the CMS uses when no real category was assigned. */
const GENERIC_ICON_KEYS = new Set([
  "amenity",
  "amenities",
  "default",
  "generic",
  "other",
  "none",
  "null",
  "undefined",
]);

export const DEFAULT_AMENITY_ICON: AmenityIconName = "star";

export const FIGMA_AMENITY_ICON_KEYS = Object.keys(
  amenityIconSvgs,
).sort() as AmenityIconName[];

function normalizeIconKey(key: string): string {
  return key
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isAmenityIconName(value: string): value is AmenityIconName {
  return value in amenityIconSvgs;
}

/**
 * Resolve `icon_key` to a Figma registry name when a matching glyph exists.
 * Returns null when no Figma file matches (caller should use backend SVG).
 */
export function resolveFigmaAmenityIconKey(
  iconKey: string | null | undefined,
): AmenityIconName | null {
  if (!iconKey?.trim()) return null;

  const normalized = normalizeIconKey(iconKey);
  if (!normalized || GENERIC_ICON_KEYS.has(normalized)) return null;

  if (isAmenityIconName(normalized)) return normalized;

  const aliased = ICON_KEY_ALIASES[normalized];
  if (aliased) return aliased;

  return null;
}

/** @deprecated Use resolveFigmaAmenityIconKey */
export const resolveAmenityIconKey = resolveFigmaAmenityIconKey;

/** @deprecated Use FIGMA_AMENITY_ICON_KEYS */
export const CANONICAL_AMENITY_ICON_KEYS = FIGMA_AMENITY_ICON_KEYS;
