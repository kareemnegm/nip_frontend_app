import { TEMP_HIDE_MAIN_NAV_CONCIERGE } from "@/lib/temporary-ui-flags";

const allMainNavItems = [
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

export const mainNavItems = allMainNavItems.filter(
  (item) => !(TEMP_HIDE_MAIN_NAV_CONCIERGE && item.key === "concierge"),
);

export type NavDropdownLeaf = { key: string; href: string };
export type NavDropdownItem = {
  key: string;
  href: string;
  /** Optional second-level items (e.g. Sale / Resale under each property type). */
  children?: readonly NavDropdownLeaf[];
};

/** Sale / Resale sub-filters for a property type — both hit the backend via `listing_type`. */
function saleResaleChildren(type: string): readonly NavDropdownLeaf[] {
  return [
    { key: "sale", href: `/properties?type=${type}&listing_type=sale` },
    { key: "resale", href: `/properties?type=${type}&listing_type=resale` },
  ];
}

export const propertiesDropdownItems: readonly NavDropdownItem[] = [
  {
    key: "apartments",
    href: "/properties?type=apartment",
    children: saleResaleChildren("apartment"),
  },
  {
    key: "townhouses",
    href: "/properties?type=townhouse",
    children: saleResaleChildren("townhouse"),
  },
  {
    key: "villas",
    href: "/properties?type=villa",
    children: saleResaleChildren("villa"),
  },
];

export const offPlanDropdownItems: readonly NavDropdownItem[] = [
  { key: "apartments", href: "/off-plan?type=apartment" },
  { key: "townhouses", href: "/off-plan?type=townhouse" },
  { key: "villas", href: "/off-plan?type=villa" },
];

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
