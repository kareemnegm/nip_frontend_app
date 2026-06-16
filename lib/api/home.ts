import { cache } from "react";
import type { ApiHomeResponse } from "@/types/api";
import { apiGet } from "./client";

export const getHome = cache(async () => {
  const response = await apiGet<ApiHomeResponse>("/home");
  return response.data;
});
