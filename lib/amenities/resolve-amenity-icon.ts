import type { AmenityIconName } from "@/components/ui/amenity-icon-registry";
import {
  DEFAULT_AMENITY_ICON,
  resolveAmenityIconKey,
} from "@/lib/amenities/amenity-icon-keys";

type AmenityMatchRule = {
  icon: AmenityIconName;
  keywords: string[];
};

/**
 * Label fallback — used when backend omits `icon_key` or sends a generic
 * placeholder like `"amenity"`.
 */
const AMENITY_MATCH_RULES: AmenityMatchRule[] = [
  { icon: "bbq", keywords: ["bbq", "barbecue", "grill"] },
  {
    icon: "cycling",
    keywords: ["cycl", "bike trail", "bicycle", "jogging", "walking trail", "promenade"],
  },
  {
    icon: "fitness",
    keywords: ["fitness", "gym", "exercise bike", "spin", "golf", "outdoor gym"],
  },
  {
    icon: "kids",
    keywords: ["kids", "child", "children", "nursery", "playground", "baby", "daycare", "trampoline"],
  },
  { icon: "yoga", keywords: ["yoga", "meditation", "pilates", "dance studio"] },
  {
    icon: "smart-home",
    keywords: ["smart home", "automation", "home tech", "wi-fi", "wifi", "internet", "ai-powered", "solar"],
  },
  {
    icon: "flower",
    keywords: ["flower", "garden", "landscap", "green space", "lawn", "pet park", "leed"],
  },
  {
    icon: "basketball",
    keywords: ["basketball", "tennis", "court", "cricket", "football", "skate"],
  },
  { icon: "beach", keywords: ["beach", "private beach", "water sports"] },
  {
    icon: "spa",
    keywords: ["spa", "wellness", "sauna", "steam", "jacuzzi", "hot tub", "beauty salon"],
  },
  {
    icon: "security",
    keywords: ["security", "cctv", "surveillance", "guard", "biometric", "gated", "safe room"],
  },
  {
    icon: "parking",
    keywords: ["parking", "car park", "garage", "car space", "ev charging", "driveway"],
  },
  { icon: "valet", keywords: ["valet", "chauffeur", "shuttle"] },
  {
    icon: "lounge",
    keywords: ["lounge", "lobby", "residents", "cinema", "gaming", "library", "cigar", "wine", "party hall", "conference", "co-working"],
  },
  {
    icon: "concierge",
    keywords: ["concierge", "butler", "reception", "housekeeping", "doctor on call"],
  },
  { icon: "pool", keywords: ["pool", "swim", "infinity pool", "sun deck", "lap pool"] },
  {
    icon: "sea",
    keywords: ["marina", "waterfront", "sea", "harbour", "harbor", "yacht", "canal", "berth"],
  },
  {
    icon: "dinner",
    keywords: ["dining", "restaurant", "dinner", "cafe", "café", "kitchen", "supermarket"],
  },
  {
    icon: "branded-location",
    keywords: ["location", "retail", "shopping", "mall", "metro", "transit", "hospital", "clinic", "medical", "prayer"],
  },
  {
    icon: "star",
    keywords: ["premium", "signature", "exclusive", "wardrobe", "vr room", "music studio"],
  },
];

function normalizeFacilityLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Map a CMS/API facility label to a Figma amenity icon name (legacy fallback). */
export function resolveAmenityIcon(facilityLabel: string): AmenityIconName {
  const normalized = normalizeFacilityLabel(facilityLabel);
  if (!normalized) return DEFAULT_AMENITY_ICON;

  for (const rule of AMENITY_MATCH_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.icon;
    }
  }

  return DEFAULT_AMENITY_ICON;
}

/**
 * Preferred resolver: real `icon_key` from API, then label keyword fallback.
 * Generic placeholders (`amenity`) and unknown keys fall through to the label.
 */
export function resolveAmenityIconFromFacility(input: {
  iconKey?: string | null;
  facility?: string | null;
}): AmenityIconName {
  const fromKey = resolveAmenityIconKey(input.iconKey);
  if (fromKey) return fromKey;
  return resolveAmenityIcon(input.facility ?? "");
}
