import type { AmenityIconName } from "@/components/ui/amenity-icon-registry";
import { amenityIconSvgs } from "@/components/ui/amenity-icon-registry";

/**
 * Backend `icon_key` → Figma amenity glyph.
 *
 * Prefer 1:1 keys that match AmenityIconName.
 * Aliases cover granular CMS keys until dedicated Figma icons exist.
 */
const ICON_KEY_ALIASES: Record<string, AmenityIconName> = {
  // Security
  cctv: "security",
  surveillance: "security",
  guard: "security",
  biometric: "security",
  gated: "security",
  "safe-room": "security",

  // Courts / sports → basketball until dedicated icons exist
  court: "basketball",
  tennis: "basketball",
  "multi-court": "basketball",
  "multi-purpose-court": "basketball",
  sports: "basketball",
  cricket: "basketball",
  football: "basketball",
  padel: "basketball",
  squash: "basketball",
  skate: "basketball",

  // Wellness
  wellness: "spa",
  sauna: "spa",
  steam: "spa",
  "steam-room": "spa",
  jacuzzi: "spa",
  beauty: "spa",
  meditation: "yoga",
  pilates: "yoga",
  dance: "yoga",

  // Fitness / outdoors
  gym: "fitness",
  trail: "cycling",
  trails: "cycling",
  jogging: "cycling",
  running: "cycling",
  walking: "cycling",
  "walking-trails": "cycling",
  "jogging-track": "cycling",
  golf: "fitness",

  // Greenery / pets
  garden: "flower",
  gardens: "flower",
  landscaped: "flower",
  lawn: "flower",
  "community-lawn": "flower",
  pet: "flower",
  "green-building": "flower",

  // Home / tech
  automation: "smart-home",
  "smart-home-automation": "smart-home",
  "ai-home": "smart-home",
  wifi: "smart-home",
  solar: "smart-home",

  // Hospitality / service
  butler: "concierge",
  service: "concierge",
  reception: "concierge",
  housekeeping: "concierge",
  chauffeur: "valet",
  shuttle: "valet",
  arrival: "valet",

  // Water
  swim: "pool",
  swimming: "pool",
  "infinity-pool": "pool",
  "sun-deck": "pool",
  "water-sports": "beach",

  // Kids
  playground: "kids",
  "kids-play": "kids",
  children: "kids",
  nursery: "kids",
  daycare: "kids",
  trampoline: "kids",

  // Parking
  garage: "parking",
  "ev-charging": "parking",

  // Dining
  dining: "dinner",
  "fine-dining": "dinner",
  restaurant: "dinner",
  cafe: "dinner",
  supermarket: "dinner",
  wine: "dinner",

  // Indoor leisure → lounge
  cinema: "lounge",
  gaming: "lounge",
  library: "lounge",
  music: "lounge",
  vr: "lounge",
  conference: "lounge",
  coworking: "lounge",
  "party-hall": "lounge",
  relaxation: "lounge",
  wardrobe: "lounge",

  // Location / medical
  retail: "branded-location",
  shopping: "branded-location",
  marina: "sea",
  waterfront: "sea",
  hospital: "star",
  medical: "star",
  prayer: "star",
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
 * Resolve backend `icon_key` to a Figma amenity icon name.
 * Returns `null` for missing / generic / unknown keys so callers can fall
 * through to label matching.
 */
export function resolveAmenityIconKey(
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

/** Canonical keys the backend should prefer (1:1 with Figma glyphs). */
export const CANONICAL_AMENITY_ICON_KEYS = Object.keys(
  amenityIconSvgs,
).sort() as AmenityIconName[];

/**
 * Granular backend keys that currently alias to an existing glyph.
 * Add a matching SVG under `public/icons/figma/amenities/` to promote any
 * of these to a 1:1 icon (then remove the alias).
 */
export const PENDING_FIGMA_AMENITY_ICONS = [
  "wifi",
  "tennis",
  "cinema",
  "shuttle",
  "ev-charging",
  "golf",
  "padel",
  "cricket",
  "football",
  "squash",
  "jacuzzi",
  "sauna",
  "steam-room",
  "marina",
  "pet",
  "library",
  "gaming",
  "coworking",
  "solar",
] as const;
