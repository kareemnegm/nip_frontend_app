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

/** Legacy payment step shape (snake_case from older API) */
export type ApiPaymentStep = {
  caption?: string | null;
  percentage: string;
  label: string;
};

/** New payment plan item shape from backend */
export type ApiPaymentPlanItem = {
  stage: string;
  percentage: number;
  description?: string;
};

/** Legacy unit shape (snake_case from older API) */
export type ApiUnit = {
  unit_type: string;
  size_sqft: string;
  starting_price: string;
};

/** New available unit shape from backend */
export type ApiAvailableUnit = {
  unit_type: string;
  size_sqft?: string;
  starting_price?: number;
};

export type ApiProperty = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  type?: string | null;
  purpose?: string | null;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
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
  location_image?: string | null;
  location_image_url?: string | null;
  master_plan_description?: string | null;
  master_plan_image?: string | null;
  master_plan_image_url?: string | null;
  photo?: string | null;
  photo_url?: string | null;
  video?: string | null;
  video_url?: string | null;
  handover_date?: string | null;
  handoverDate?: string | null;
  handover_quarter?: string | null;
  handoverQuarter?: string | null;
  furnishing?: string | null;
  reference_no?: string | null;
  unit_types?: string | null;
  payment_split?: string | null;
  payment_plan_summary?: string | null;
  paymentPlanSummary?: string | null;
  payment_plan?: ApiPaymentStep[] | null;
  paymentPlan?: ApiPaymentPlanItem[] | null;
  units?: ApiUnit[] | null;
  available_units?: ApiAvailableUnit[] | null;
  availableUnits?: ApiAvailableUnit[] | null;
  area?: ApiAreaRef | null;
  developers?: ApiDeveloperRef[];
  facilities?: ApiFacility[];
  images?: ApiPropertyImage[];
  created_at?: string;
};

export type PropertyGalleryImage = {
  url: string;
  type?: string | null;
};

export type PropertyListParams = {
  locale?: import("@/lib/i18n/config").Locale;
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
  sort?: string;
};
