import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { resolveMediaUrl } from "@/lib/api/media-url";
import {
  resolveAreaCardFacts,
  type AreaCardLabels,
  type AreaFeatureItem,
} from "@/lib/area/detail";
import type { ApiArea } from "@/types/api";

export type CommunityCardModel = {
  title: string;
  facts: AreaFeatureItem[];
  projectCount: number;
  projectsAvailableLabel: string;
  exploreAreaLabel: string;
  href: string;
  imageUrl?: string;
};

export function mapAreaToCommunityCard(
  area: ApiArea,
  locale: Locale,
  options: {
    cardLabels: AreaCardLabels;
    projectsAvailableLabel: (count: number) => string;
    exploreAreaLabel: string;
  },
): CommunityCardModel {
  const projectCount = area.project_count ?? 0;
  return {
    title: area.name,
    facts: resolveAreaCardFacts(area, options.cardLabels),
    projectCount,
    projectsAvailableLabel: options.projectsAvailableLabel(projectCount),
    exploreAreaLabel: options.exploreAreaLabel,
    href: localizedHref(locale, `/areas/${area.slug}`),
    imageUrl: resolveMediaUrl(area.image_url ?? area.photo_url),
  };
}
