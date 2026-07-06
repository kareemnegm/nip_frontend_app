export type NavigationZone = {
  id: string;
  key: string;
  locale: string;
  title: string;
  sort_order: number;
  is_visible: boolean;
};

export type NavigationItem = {
  id: string;
  zone_key: string;
  locale: string;
  label: string;
  href: string;
  icon?: string | null;
  parent_key?: string | null;
  sort_order: number;
  is_visible: boolean;
  open_in_new_tab: boolean;
  seo_path?: string | null;
};

export type NavigationPayload = {
  zones: NavigationZone[];
  items: NavigationItem[];
};

export type NavigationZoneUpdatePayload = {
  locale: string;
  title?: string;
  sort_order?: number;
  is_visible?: boolean;
};

export type NavigationItemCreatePayload = {
  zone_key: string;
  locale: string;
  label: string;
  href: string;
  icon?: string | null;
  parent_key?: string | null;
  sort_order?: number;
  is_visible?: boolean;
  open_in_new_tab?: boolean;
  seo_path?: string | null;
};

export type NavigationItemUpdatePayload = Partial<
  Omit<NavigationItemCreatePayload, "zone_key" | "locale">
>;

export type NavigationItemReorderPayload = {
  items: Array<{ id: string; sort_order: number }>;
};
