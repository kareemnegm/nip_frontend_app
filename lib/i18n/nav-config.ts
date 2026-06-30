export const mainNavItems = [
  { key: "home", href: "/" as const },
  { key: "insights", href: "/insights" as const },
  {
    key: "properties",
    href: "/properties" as const,
    dropdown: "properties" as const,
  },
  { key: "offPlan", href: "/off-plan" as const, dropdown: "offPlan" as const },
  { key: "areas", href: "/areas" as const },
  { key: "developers", href: "/developers" as const },
  { key: "concierge", href: "/concierge" as const },
] as const;

export const propertiesDropdownItems = [
  { key: "apartments", href: "/properties?type=apartment" as const },
  { key: "townhouses", href: "/properties?type=townhouse" as const },
  { key: "villas", href: "/properties?type=villa" as const },
] as const;

export const offPlanDropdownItems = [
  { key: "apartments", href: "/off-plan?type=apartment" as const },
  { key: "townhouses", href: "/off-plan?type=townhouse" as const },
  { key: "villas", href: "/off-plan?type=villa" as const },
] as const;

export type NavDropdownKey = "properties" | "offPlan";

export function getNavDropdownItems(dropdown: NavDropdownKey) {
  switch (dropdown) {
    case "properties":
      return propertiesDropdownItems;
    case "offPlan":
      return offPlanDropdownItems;
    default:
      return propertiesDropdownItems;
  }
}

/** @deprecated use propertiesDropdownItems */
export const saleDropdownItems = propertiesDropdownItems;
