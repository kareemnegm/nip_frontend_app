import type { BuilderPageSection } from "@/types/api/page-builder";
import { getSectionDefinition } from "./registry";

const SAMPLE_PAGE_ID = "section-sample";

/** Default section row used to render a real preview in the admin palette. */
export function buildSampleSection(type: string): BuilderPageSection | null {
  const definition = getSectionDefinition(type);
  if (!definition) return null;

  const dataParams =
    type === "property-grid" || type === "property-carousel"
      ? { listing_type: "offplan" }
      : null;

  const itemLimit =
    type === "property-grid"
      ? 3
      : type === "insight-cards"
        ? 3
        : type === "communities"
          ? 4
          : definition.defaultLimit ?? 6;

  return {
    id: `sample-${type}`,
    page_id: SAMPLE_PAGE_ID,
    section_type: type,
    block_prefix: "sample",
    data_source: definition.dataSource,
    data_params: dataParams,
    item_limit: itemLimit,
    sort_order: 1,
    is_visible: true,
  };
}

export function isSampleSectionType(type: string): boolean {
  return Boolean(getSectionDefinition(type));
}

/** relUrl for sample renders — blocks are read-only placeholders in thumbnails. */
export const SECTION_SAMPLE_REL_URL = "/__builder-section-sample__";
