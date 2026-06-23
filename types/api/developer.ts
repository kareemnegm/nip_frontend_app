export type ApiDeveloper = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  photo_url?: string | null;
  properties_count?: number;
  properties?: unknown[];
  established_year?: number | null;
  delivered_count?: string | null;
  under_development_count?: string | null;
  communities_count?: number | null;
  units_count?: string | null;
  presence?: string | null;
};
