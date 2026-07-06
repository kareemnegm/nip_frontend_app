export const NAV_ZONE_KEYS = {
  HEADER_MAIN: "header_main",
  FOOTER_PROPERTIES: "footer_properties",
  FOOTER_AREAS: "footer_areas",
  FOOTER_OFF_PLAN: "footer_off_plan",
  FOOTER_RESOURCES: "footer_resources",
  FOOTER_INSIGHTS: "footer_insights",
  FOOTER_ABOUT: "footer_about",
  FOOTER_FOLLOW_US: "footer_follow_us",
  FOOTER_LEGAL: "footer_legal",
} as const;

export type NavZoneKey = (typeof NAV_ZONE_KEYS)[keyof typeof NAV_ZONE_KEYS];

export const HEADER_PARENT_KEYS = {
  PROPERTIES: "properties",
  OFF_PLAN: "offPlan",
} as const;

/** Footer columns rendered in the site layout (order matters). */
export const FOOTER_COLUMN_ZONES: NavZoneKey[][] = [
  [NAV_ZONE_KEYS.FOOTER_PROPERTIES, NAV_ZONE_KEYS.FOOTER_AREAS],
  [NAV_ZONE_KEYS.FOOTER_OFF_PLAN, NAV_ZONE_KEYS.FOOTER_RESOURCES],
  [NAV_ZONE_KEYS.FOOTER_INSIGHTS, NAV_ZONE_KEYS.FOOTER_ABOUT],
];
