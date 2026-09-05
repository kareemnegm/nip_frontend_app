import type { ApiBlogCategory } from "@/types/api";

/** Old-site import slugs — excluded from the Contribute form dropdown only. */
export const LEGACY_BLOG_CATEGORY_SLUGS = new Set([
  "market-insights",
  "investment-guide",
  "lifestyle",
  "news",
  "tips",
]);

export function isLegacyBlogCategorySlug(slug: string): boolean {
  return LEGACY_BLOG_CATEGORY_SLUGS.has(slug.toLowerCase().trim());
}

/**
 * Active categories from `GET /blog-categories` or `GET /insights/categories`
 * for insights page filters and footer links.
 */
export function filterEditorialBlogCategories(
  categories: ApiBlogCategory[],
): ApiBlogCategory[] {
  return categories
    .filter((category) => category.is_active !== false)
    .sort((a, b) => {
      const orderDiff = (a.order_no ?? 999) - (b.order_no ?? 999);
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
