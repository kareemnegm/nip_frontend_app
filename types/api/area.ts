export type ApiAreaHighlight = {
  label: string;
  icon?: string | null;
};

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
  communities_count?: number | null;
  distance_downtown?: string | null;
  map_image_url?: string | null;
  highlights?: ApiAreaHighlight[] | null;
  connectivity?: ApiAreaHighlight[] | null;
  properties?: unknown[];
};
