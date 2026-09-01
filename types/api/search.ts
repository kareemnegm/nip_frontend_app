import type { ApiArea } from "./area";
import type { ApiDeveloper } from "./developer";
import type { ApiProperty } from "./property";

export type SiteSearchSection = "properties" | "areas" | "developers";

export type SiteSearchGroupMeta = {
  total: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
};

export type SiteSearchGroup<T> = {
  data: T[];
  meta: SiteSearchGroupMeta;
};

export type SiteSearchResponse = {
  query: string;
  properties: SiteSearchGroup<ApiProperty>;
  areas: SiteSearchGroup<ApiArea>;
  developers: SiteSearchGroup<ApiDeveloper>;
};

/** Raw Laravel `SiteSearchResource` body (query is optional — injected client-side). */
export type SiteSearchApiBody = {
  query?: string;
  properties?: SiteSearchGroup<ApiProperty>;
  areas?: SiteSearchGroup<ApiArea>;
  developers?: SiteSearchGroup<ApiDeveloper>;
};

/** Laravel may wrap the payload in `{ data: … }`. */
export type SiteSearchApiPayload =
  | SiteSearchResponse
  | SiteSearchApiBody
  | { data: SiteSearchResponse }
  | { data: SiteSearchApiBody };
