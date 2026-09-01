/** Footer / nav query links for the property tag catalog. */
export const PROPERTY_TAG_LINKS = {
  /** @deprecated Use footer tag columns — kept for legacy URL redirects */
  exclusives: "/properties?tag=featured",
  newLaunches: "/off-plan?tag=new_launch&listing_type=offplan",
  featuredProjects: "/off-plan?tag=featured&listing_type=offplan",
  upcoming: "/off-plan?tag=upcoming&listing_type=offplan",
} as const;

export type PropertyTagSlug = "featured" | "upcoming" | "new_launch";

export type ApiPropertyTag = {
  value: PropertyTagSlug | string;
  label: string;
};

export type FooterTagLink = {
  labelKey: "tagFeatured" | "tagUpcoming" | "tagNewLaunch";
  href: string;
};

/** Footer Properties column — tag filters on ready/sale/rental catalog. */
export const FOOTER_PROPERTIES_TAG_LINKS: readonly FooterTagLink[] = [
  { labelKey: "tagFeatured", href: "/properties?tag=featured" },
  { labelKey: "tagUpcoming", href: "/properties?tag=upcoming" },
  { labelKey: "tagNewLaunch", href: "/properties?tag=new_launch" },
];

/** Footer Off-Plan column — same tags scoped to off-plan inventory. */
export const FOOTER_OFFPLAN_TAG_LINKS: readonly FooterTagLink[] = [
  { labelKey: "tagFeatured", href: "/off-plan?tag=featured&listing_type=offplan" },
  { labelKey: "tagUpcoming", href: "/off-plan?tag=upcoming&listing_type=offplan" },
  { labelKey: "tagNewLaunch", href: "/off-plan?tag=new_launch&listing_type=offplan" },
];

/** Maps legacy footer query params to the new `tag` slug. */
export function resolvePropertyTagFromSearchParams(
  sp: Record<string, string | undefined>,
): string | undefined {
  if (sp.tag?.trim()) return sp.tag.trim();

  const featured = sp.featured?.toLowerCase();
  if (featured === "1" || featured === "true") return "featured";

  const exclusive = sp.exclusive?.toLowerCase();
  if (exclusive === "1" || exclusive === "true") return "featured";

  if (sp.status?.toLowerCase() === "launching") return "upcoming";

  return undefined;
}
