export type BuilderDataSource = "properties" | "blogs" | "areas" | "none";

export type BuilderBlockSlot = "eyebrow" | "title" | "desc" | "body" | "image";

export type BuilderPageSection = {
  id: string;
  page_id: string;
  section_type: string;
  block_prefix: string;
  data_source: BuilderDataSource | null;
  data_params: Record<string, unknown> | null;
  item_limit: number;
  sort_order: number;
  is_visible: boolean;
};

export type BuilderPage = {
  id: string;
  path: string;
  title: string;
  is_published: boolean;
  sort_order: number;
  sections: BuilderPageSection[];
  /** Optional — mirrored from navigation_items when backend stores placement on cms_pages */
  nav_header_enabled?: boolean;
  nav_footer_enabled?: boolean;
  nav_footer_zone_key?: string;
  nav_label?: string;
};

export type BuilderPagePayload = {
  pages: BuilderPage[];
};

export type BuilderPageCreatePayload = {
  path: string;
  title: string;
  locale?: string;
  is_published?: boolean;
  sort_order?: number;
  nav_header_enabled?: boolean;
  nav_footer_enabled?: boolean;
  nav_footer_zone_key?: string;
  nav_label?: string;
};

export type BuilderPageUpdatePayload = {
  path?: string;
  title?: string;
  is_published?: boolean;
  sort_order?: number;
  locale?: string;
  nav_header_enabled?: boolean;
  nav_footer_enabled?: boolean;
  nav_footer_zone_key?: string;
  nav_label?: string;
};

export type BuilderSectionCreatePayload = {
  section_type: string;
  block_prefix?: string;
  data_source?: BuilderDataSource | null;
  data_params?: Record<string, unknown> | null;
  item_limit?: number;
  sort_order?: number;
  is_visible?: boolean;
};

export type BuilderSectionUpdatePayload = Partial<
  Omit<BuilderSectionCreatePayload, "section_type">
>;

export type BuilderSectionReorderPayload = {
  items: Array<{ id: string; sort_order: number }>;
};
