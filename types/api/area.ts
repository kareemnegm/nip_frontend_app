export type ApiArea = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  photo_url?: string | null;
  project_count?: number;
  avg_price_sqft?: number | null;
  avg_yield?: number | null;
  lifestyle?: string | null;
  properties?: unknown[];
};
