import type { ApiArea } from "./area";
import type { ApiDeveloper } from "./developer";
import type { ApiProperty } from "./property";

export type ApiHomeData = {
  featured_properties: ApiProperty[];
  areas: ApiArea[];
  developers: ApiDeveloper[];
  blogs_count: number;
};

export type ApiHomeResponse = {
  data: ApiHomeData;
};
