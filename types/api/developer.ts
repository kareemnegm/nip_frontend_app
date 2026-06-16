export type ApiDeveloper = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  photo_url?: string | null;
  properties_count?: number;
  properties?: unknown[];
};
