export type ApiBlogCategory = {
  id: number;
  name: string;
  slug: string;
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
  /** Backend list/detail field (preferred). */
  author?: string | null;
  author_name?: string | null;
  author_image?: string | null;
  author_image_url?: string | null;
  category?: ApiBlogCategory | null;
  /** API returns minutes as a number; legacy string values supported. */
  read_time?: string | number | null;
  views?: number;
  created_at?: string;
};

export type BlogListParams = {
  locale?: import("@/lib/i18n/config").Locale;
  page?: number;
  per_page?: number;
  category?: string;
};
