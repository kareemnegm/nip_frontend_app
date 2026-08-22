import type { BuilderPage } from "@/types/api/page-builder";

/** Dev-only sample page when Laravel pages API is not live yet. */
export function getFallbackBuilderPage(path: string): BuilderPage | null {
  if (path !== "/investor-guide") return null;

  return {
    id: "fallback-investor-guide",
    path: "/investor-guide",
    title: "Investor Guide",
    is_published: true,
    sort_order: 0,
    sections: [
      {
        id: "fb-sec-1",
        page_id: "fallback-investor-guide",
        section_type: "hero",
        block_prefix: "sec-1",
        data_source: "none",
        data_params: null,
        item_limit: 0,
        sort_order: 1,
        is_visible: true,
      },
      {
        id: "fb-sec-2",
        page_id: "fallback-investor-guide",
        section_type: "insight-cards",
        block_prefix: "sec-2",
        data_source: "blogs",
        data_params: {},
        item_limit: 4,
        sort_order: 2,
        is_visible: true,
      },
      {
        id: "fb-sec-3",
        page_id: "fallback-investor-guide",
        section_type: "property-grid",
        block_prefix: "sec-3",
        data_source: "properties",
        data_params: { listing_type: "offplan" },
        item_limit: 3,
        sort_order: 3,
        is_visible: true,
      },
      {
        id: "fb-sec-4",
        page_id: "fallback-investor-guide",
        section_type: "cta",
        block_prefix: "sec-4",
        data_source: "none",
        data_params: null,
        item_limit: 0,
        sort_order: 4,
        is_visible: true,
      },
    ],
  };
}

export function getFallbackBuilderPages(): BuilderPage[] {
  const page = getFallbackBuilderPage("/investor-guide");
  return page ? [page] : [];
}
