export type ApiBlogCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  order_no?: number | null;
  is_active?: boolean | null;
};

export type ApiBlog = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  source_code?: string | null;
  body?: string | null;
  featured_image?: string | null;
  featured_image_url?: string | null;
  /**
   * Mid-article image — a separate upload, never embedded in `body`.
   * Rendered in the slot Figma reserves for it (1525:27600).
   */
  content_image?: string | null;
  content_image_url?: string | null;
  content_image_caption?: string | null;
  /** Backend list/detail field (preferred). */
  author?: string | null;
  author_name?: string | null;
  author_image?: string | null;
  author_image_url?: string | null;
  category?: ApiBlogCategory | null;
  /** API returns minutes as a number; legacy string values supported. */
  read_time?: string | number | null;
  views?: number;
  /** Detail endpoint's publication date; `created_at` is the legacy fallback. */
  published_date?: string | null;
  created_at?: string;
};

export type BlogListParams = {
  locale?: import("@/lib/i18n/config").Locale;
  page?: number;
  per_page?: number;
  category?: string;
};
