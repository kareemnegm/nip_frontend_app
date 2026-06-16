export type ApiMemberAdvisor = {
  id: number;
  name: string;
  email?: string;
  availability?: string | null;
};

export type ApiMemberUser = {
  id: number;
  email: string;
  name: string;
  salutation?: string | null;
  displayName?: string;
  role: string;
  preferredLocale?: string;
  advisor?: ApiMemberAdvisor | null;
};

export type ApiMemberLoginResponse = {
  token: string;
  user: ApiMemberUser;
  expiresAt?: string;
};

/** Member API listing shape — camelCase (not public catalog snake_case). */
export type ApiMemberPropertyCard = {
  id: number;
  slug: string;
  title: string;
  propertyType: string;
  listingType: string;
  price: number | null;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  location: string | null;
  area?: { slug: string; name: string };
  primaryImage: string | null;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isAvailable: boolean;
};

export type ApiMemberOffplanCard = {
  id: number;
  slug: string;
  name: string;
  startingPrice: number | null;
  currency: string;
  handoverQuarter: string | null;
  status: string;
  primaryImage: string | null;
  developer: { slug: string; name: string } | null;
  area?: { slug: string; name: string };
  isAvailable: boolean;
};

export type ApiCuratedItem = {
  id: number;
  title: string;
  note?: string | null;
  releasedAt?: string | null;
  type: "property" | "project";
  property: ApiMemberPropertyCard | null;
  project: ApiMemberOffplanCard | null;
  advisor?: { id: number; name: string } | null;
};

export type ApiSavedItem = {
  savedAt?: string;
  property: ApiMemberPropertyCard;
};

export type ApiAdvisorNote = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  advisor?: { id: number; name: string } | null;
};

export type ApiMemberMessagePayload = {
  subject: string;
  message: string;
  locale?: "en" | "ar";
  relatedPropertyId?: number | null;
  relatedProjectId?: number | null;
  relatedCuratedId?: number | null;
};
