import type { PropertyTagDisplay } from "@/components/ui/PropertyTagBadge";
import type { ApiProperty } from "@/types/api/property";

function formatTagSlug(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Tag slugs + display labels for card badges. */
export function resolvePropertyTags(property: ApiProperty): PropertyTagDisplay[] {
  const slugs = property.tags ?? property.tag ?? [];
  const labels = property.tagLabels ?? property.tag_labels ?? [];

  if (slugs.length) {
    return slugs
      .filter((slug): slug is string => Boolean(slug?.trim()))
      .map((slug, index) => ({
        slug: slug.toLowerCase(),
        label: labels[index]?.trim() || formatTagSlug(slug),
      }));
  }

  if (property.featured) {
    return [{ slug: "featured", label: "Featured" }];
  }

  return [];
}
