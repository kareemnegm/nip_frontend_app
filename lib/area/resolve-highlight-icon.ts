import {
  amenityIconSvgs,
  type AmenityIconName,
} from "@/components/ui/amenity-icon-registry";
import type { IconName } from "@/components/ui/Icon";

export type HighlightIconResult = {
  /** Fallback IconName — used only when iconSvg is null. */
  icon: IconName;
  /** Raw SVG string (from amenity registry). Takes priority over icon in FeaturePillIcon. */
  iconSvg: string | null;
};

type AmenityRule = { kind: "amenity"; icon: AmenityIconName; keywords: string[] };
type FigmaRule = { kind: "figma"; icon: IconName; keywords: string[] };
type MatchRule = AmenityRule | FigmaRule;

/** Keyword rules ordered by specificity — first match wins. */
const HIGHLIGHT_MATCH_RULES: MatchRule[] = [
  // Water / coastal
  { kind: "amenity", icon: "beach", keywords: ["beach"] },
  {
    kind: "amenity",
    icon: "sea",
    keywords: ["marina", "berth", "yacht", "waterfront", "harbour", "harbor", "canal"],
  },
  // Dining / food
  {
    kind: "amenity",
    icon: "dinner",
    keywords: ["dining", "restaurant", "cuisine", "dinner", "cafe", "café"],
  },
  // Hospitality / resort
  {
    kind: "amenity",
    icon: "concierge",
    keywords: ["resort", "hotel", "five-star", "5-star", "concierge", "butler"],
  },
  // Wellness
  { kind: "amenity", icon: "spa", keywords: ["spa", "wellness", "sauna"] },
  { kind: "amenity", icon: "fitness", keywords: ["fitness", "gym", "sport"] },
  { kind: "amenity", icon: "pool", keywords: ["pool", "swim"] },
  { kind: "amenity", icon: "yoga", keywords: ["yoga", "meditation", "pilates"] },
  { kind: "amenity", icon: "cycling", keywords: ["cycl", "bike", "bicycle"] },
  { kind: "amenity", icon: "basketball", keywords: ["basketball", "tennis", "court"] },
  // Greenery / lifestyle
  {
    kind: "amenity",
    icon: "flower",
    keywords: ["garden", "park", "green", "landscap", "nature", "villa"],
  },
  // Family
  {
    kind: "amenity",
    icon: "kids",
    keywords: ["family", "child", "kids", "nursery", "school", "playground"],
  },
  // Branded / luxury
  {
    kind: "amenity",
    icon: "branded-location",
    keywords: ["branded", "luxury", "premium", "signature"],
  },
  // Smart / tech
  { kind: "amenity", icon: "smart-home", keywords: ["smart", "automation", "tech"] },
  // Residential buildings
  {
    kind: "figma",
    icon: "building",
    keywords: ["residence", "residential", "apartment", "tower", "penthouse"],
  },
  // Transport — connectivity section
  {
    kind: "figma",
    icon: "metro",
    keywords: ["metro", "tram", "train", "rail", "transit", "subway", "link"],
  },
  {
    kind: "figma",
    icon: "airport",
    keywords: ["airport", "flight", "terminal"],
  },
  {
    kind: "figma",
    icon: "downtown",
    keywords: ["downtown", "district", "city", "centre", "center"],
  },
  {
    kind: "figma",
    icon: "mapPin",
    keywords: ["location", "near", "access"],
  },
];

const DEFAULT_AMENITY_ICON: AmenityIconName = "star";

function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Maps an area highlight / connectivity label to a semantic icon.
 * Returns `iconSvg` (amenity SVG string) when an amenity icon matches,
 * or `icon` (figma IconName) for transport/location labels.
 */
export function resolveHighlightIcon(label: string): HighlightIconResult {
  const normalized = normalizeLabel(label);

  for (const rule of HIGHLIGHT_MATCH_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      if (rule.kind === "amenity") {
        return { icon: "star", iconSvg: amenityIconSvgs[rule.icon] };
      }
      return { icon: rule.icon, iconSvg: null };
    }
  }

  return { icon: "star", iconSvg: amenityIconSvgs[DEFAULT_AMENITY_ICON] };
}
