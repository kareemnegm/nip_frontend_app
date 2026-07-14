export type ApiDeveloper = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  photo_url?: string | null;
  properties_count?: number;
  properties?: unknown[];

  /** Facts strip — detail + list items (Admin CMS source of truth) */
  establishedYear?: number | string | null;
  projectsDelivered?: string | null;
  projectsUnderDevelopment?: string | null;
  communitiesCount?: number | string | null;
  unitsDisplay?: string | null;
  presence?: string | null;

  /** Legacy snake_case aliases (public API may still send these) */
  established_year?: number | string | null;
  projects_delivered?: string | null;
  projects_under_development?: string | null;
  communities_count?: number | string | null;
  units_display?: string | null;
  delivered_count?: string | null;
  under_development_count?: string | null;
  units_count?: string | null;
};
