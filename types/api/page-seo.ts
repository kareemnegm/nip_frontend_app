export type PageSeo = {
  id: string;
  path: string;
  locale: string;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  robots?: string | null;
  updated_at?: string;
};

export type PageSeoUpsertPayload = {
  path: string;
  locale: string;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  robots?: string | null;
};
