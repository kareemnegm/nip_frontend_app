import type { ApiFaq } from "@/types/api";
import { apiGet, unwrapData } from "./client";

export async function getFaqs() {
  const response = await apiGet<{ data: ApiFaq[] } | ApiFaq[]>("/faqs");
  return Array.isArray(response) ? response : unwrapData(response);
}
