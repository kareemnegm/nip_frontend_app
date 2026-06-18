export const mainNavItems = [
  { key: "home", href: "/" as const },
  { key: "insights", href: "/insights" as const, caret: true },
  {
    key: "properties",
    href: "/properties" as const,
    dropdown: "properties" as const,
  },
  { key: "offPlan", href: "/off-plan" as const, dropdown: "offPlan" as const },
  { key: "areas", href: "/areas" as const, caret: true },
  { key: "developers", href: "/developers" as const, caret: true },
  { key: "concierge", href: "/concierge" as const, caret: true },
] as const;

export const propertiesDropdownItems = [
  { key: "apartments", href: "/properties?type=Apartment" as const },
  { key: "townhouses", href: "/properties?type=Townhouse" as const },
  { key: "villas", href: "/properties?type=Villa" as const },
] as const;

export const offPlanDropdownItems = [
  { key: "apartments", href: "/off-plan?type=Apartment" as const },
  { key: "townhouses", href: "/off-plan?type=Townhouse" as const },
  { key: "villas", href: "/off-plan?type=Villa" as const },
] as const;

/** @deprecated use propertiesDropdownItems */
export const saleDropdownItems = propertiesDropdownItems;
