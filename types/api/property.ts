export type ApiAreaRef = {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
};

export type ApiDeveloperRef = {
  id: number;
  name: string;
  slug: string;
  logo_url?: string | null;
};

export type ApiFacility = {
  id: number;
  facility: string;
  facility_icon?: string | null;
};

export type ApiPropertyImage = {
  id: number;
  type?: string | null;
  image_url: string;
};

export type ApiProperty = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  type?: string | null;
  purpose?: string | null;
  location?: string | null;
  listing_type?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_sqft?: number | null;
  floors?: number | null;
  price?: number | null;
  image?: string | null;
  image_url?: string | null;
  hero_title?: string | null;
  featured?: boolean;
  about_location?: string | null;
  master_plan_description?: string | null;
  handover_quarter?: string | null;
  area?: ApiAreaRef | null;
  developers?: ApiDeveloperRef[];
  facilities?: ApiFacility[];
  images?: ApiPropertyImage[];
  created_at?: string;
};

export type PropertyListParams = {
  page?: number;
  per_page?: number;
  keyword?: string;
  type?: string;
  category?: string;
  listing_type?: string;
  purpose?: string;
  location?: string;
  community?: string;
  area?: string;
  developer?: string;
  bedrooms?: string;
  beds?: string;
  bathrooms?: string;
  baths?: string;
  min_price?: string;
  max_price?: string;
  price_min?: string;
  price_max?: string;
  price_range?: string;
};
