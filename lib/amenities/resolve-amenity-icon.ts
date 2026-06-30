import type { AmenityIconName } from "@/components/ui/amenity-icon-registry";

type AmenityMatchRule = {
  icon: AmenityIconName;
  keywords: string[];
};

/** Keyword rules ordered by specificity — first match wins. */
const AMENITY_MATCH_RULES: AmenityMatchRule[] = [
  { icon: "bbq", keywords: ["bbq", "barbecue", "grill"] },
  { icon: "cycling", keywords: ["cycl", "bike trail", "bicycle"] },
  { icon: "fitness", keywords: ["fitness", "gym", "exercise bike", "spin"] },
  { icon: "kids", keywords: ["kids", "child", "children", "nursery", "playground", "baby"] },
  { icon: "yoga", keywords: ["yoga", "meditation", "pilates"] },
  { icon: "smart-home", keywords: ["smart home", "automation", "home tech"] },
  { icon: "flower", keywords: ["flower", "garden", "landscap", "green space"] },
  { icon: "basketball", keywords: ["basketball", "court"] },
  { icon: "beach", keywords: ["beach", "private beach"] },
  { icon: "spa", keywords: ["spa", "wellness", "sauna", "steam"] },
  {
    icon: "valet",
    keywords: ["parking", "valet", "car park", "garage"],
  },
  { icon: "lounge", keywords: ["lounge", "lobby", "residents"] },
  { icon: "concierge", keywords: ["concierge", "butler", "24/7 service"] },
  { icon: "pool", keywords: ["pool", "swim", "infinity pool"] },
  {
    icon: "sea",
    keywords: ["marina", "waterfront", "sea", "harbour", "harbor", "yacht", "canal"],
  },
  { icon: "dinner", keywords: ["dining", "restaurant", "dinner", "cafe", "café", "kitchen"] },
  {
    icon: "branded-location",
    keywords: ["location", "retail", "shopping", "mall", "metro", "transit"],
  },
  { icon: "star", keywords: ["premium", "signature", "exclusive", "hospital", "clinic", "medical"] },
];

const DEFAULT_AMENITY_ICON: AmenityIconName = "star";

function normalizeFacilityLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Map a CMS/API facility label to a Figma amenity icon name. */
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
