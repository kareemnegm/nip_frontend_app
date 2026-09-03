import type { ApiBlogCategory } from "@/types/api";

/** Old-site import slugs — not real editorial destinations (see docs/CONTRIBUTE-BACKEND-HANDOFF.md). */
export const LEGACY_BLOG_CATEGORY_SLUGS = new Set([
  "market-insights",
  "investment-guide",
  "lifestyle",
  "news",
  "tips",
]);

/** Preferred footer / filter order for known editorial categories. */
const EDITORIAL_CATEGORY_ORDER = [
  "market-intelligence",
  "investment-guides",
  "community-guides",
  "golden-visa",
] as const;

export function isLegacyBlogCategorySlug(slug: string): boolean {
  return LEGACY_BLOG_CATEGORY_SLUGS.has(slug.toLowerCase().trim());
}

/** Keep only live editorial categories returned by `GET /blog-categories`. */
export function filterEditorialBlogCategories(
  categories: ApiBlogCategory[],
): ApiBlogCategory[] {
  const editorial = categories.filter((category) => !isLegacyBlogCategorySlug(category.slug));
  const order = new Map<string, number>(
    EDITORIAL_CATEGORY_ORDER.map((slug, index) => [slug, index]),
  );

  return [...editorial].sort((a, b) => {
    const orderDiff = (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999);
    if (orderDiff !== 0) return orderDiff;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

export function mapBlogCategoryToInsightLink(
  category: ApiBlogCategory,
  labelOverrides: Record<string, string> = {},
): { label: string; href: string } {
  return {
    label: labelOverrides[category.slug] ?? category.name,
    href: `/insights?category=${encodeURIComponent(category.slug)}`,
  };
}
