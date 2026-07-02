import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { resolveMediaUrl } from "@/lib/api/media-url";
import type { ApiArea } from "@/types/api";

export type CommunityCardModel = {
  title: string;
  description: string;
  facts: string[];
  projectCount: string;
  href: string;
  imageUrl?: string;
};

function resolveAreaCardDescription(area: ApiArea): string {
  const raw = area.description?.trim();
  if (!raw) return "";
  const text = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text;
}

export function mapAreaToCommunityCard(
  area: ApiArea,
  locale: Locale,
  options?: { descriptionFallback?: string },
): CommunityCardModel {
  const facts: string[] = [];
  if (area.avg_price_sqft != null) {
    facts.push(`AED ${area.avg_price_sqft}/sq ft`);
  }
  if (area.avg_yield != null) {
    facts.push(`${area.avg_yield}% yield`);
  }
  if (area.lifestyle) {
    facts.push(area.lifestyle);
  }

  const count = area.project_count ?? 0;

  return {
    title: area.name,
    description:
      resolveAreaCardDescription(area) || options?.descriptionFallback?.trim() || "",
    facts: facts.slice(0, 4),
    projectCount: `${count} Project${count === 1 ? "" : "s"} Available`,
    href: localizedHref(locale, `/areas/${area.slug}`),
    imageUrl: resolveMediaUrl(area.image_url ?? area.photo_url),
  };
}
