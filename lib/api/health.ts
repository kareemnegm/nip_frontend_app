import { apiGet } from "./client";

export async function getHealth() {
  return apiGet<{ status: string; service?: string; version?: string }>(
    "/health",
    { revalidate: false },
  );
}
