import type { BuilderPageSection } from "@/types/api/page-builder";
import { getAreas } from "@/lib/api/areas";
import { getBlogs } from "@/lib/api/blogs";
import { getProperties } from "@/lib/api/properties";
import type { Locale } from "@/lib/i18n/config";
import { mapAreaToCommunityCard } from "@/lib/mappers/area";
import { mapBlogToInsightCard } from "@/lib/mappers/blog";
import { mapPropertyToCard } from "@/lib/mappers/property";
import { getSectionDefinition } from "./registry";

export type ResolvedSectionData = {
  insights?: ReturnType<typeof mapBlogToInsightCard> extends infer T ? T[] : never;
  properties?: ReturnType<typeof mapPropertyToCard> extends infer T ? T[] : never;
  areas?: ReturnType<typeof mapAreaToCommunityCard> extends infer T ? T[] : never;
};

export async function resolveSectionData(
  section: BuilderPageSection,
  locale: Locale,
): Promise<ResolvedSectionData> {
  const definition = getSectionDefinition(section.section_type);
  const dataSource = section.data_source ?? definition?.dataSource ?? "none";
  const limit = section.item_limit || definition?.defaultLimit || 6;
  const params = section.data_params ?? {};

  switch (dataSource) {
    case "properties": {
      const listingType =
        typeof params.listing_type === "string" ? params.listing_type : undefined;
      const res = await getProperties({
        ...(params as Record<string, string | number | undefined>),
        listing_type: listingType as "sale" | "rent" | "offplan" | undefined,
        per_page: limit,
        locale,
      });
      return { properties: res.data.map((item) => mapPropertyToCard(item, locale)) };
    }
    case "blogs": {
      const category = typeof params.category === "string" ? params.category : undefined;
      const res = await getBlogs({ category, per_page: limit, locale });
      return { insights: res.data.map((item) => mapBlogToInsightCard(item, locale)) };
    }
    case "areas": {
      const res = await getAreas({ per_page: limit, locale, ...(params as object) });
      return {
        areas: res.data.map((item) =>
          mapAreaToCommunityCard(item, locale, {
            projectsAvailableLabel: (count) => `${count} projects`,
            exploreAreaLabel: "Explore area",
          }),
        ),
      };
    }
    default:
      return {};
  }
}
