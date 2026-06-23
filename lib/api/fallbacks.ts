import type { ApiHomeData } from "@/types/api";
import type { LaravelPaginated } from "@/types/api";

export const EMPTY_HOME: ApiHomeData = {
  featured_properties: [],
  areas: [],
  developers: [],
  blogs_count: 0,
};

export function emptyPaginated<T>(perPage = 9): LaravelPaginated<T> {
  return {
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: perPage,
      total: 0,
      from: null,
      to: null,
    },
    links: {
      first: null,
      last: null,
      prev: null,
      next: null,
    },
  };
}

/** True when Laravel is unreachable (not running, wrong URL, etc.). */
export function isOfflineError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (error && typeof error === "object" && "cause" in error) {
    const cause = (error as { cause?: { code?: string } }).cause;
    return cause?.code === "ECONNREFUSED" || cause?.code === "ENOTFOUND";
  }
  return false;
}

/** Log in dev when an API call fails and the UI falls back to empty data. */
export function logApiFallback(endpoint: string, error: unknown): void {
  if (process.env.NODE_ENV !== "development") return;

  const offline = isOfflineError(error);
  const message =
    error instanceof Error ? error.message : String(error ?? "Unknown error");

  console.warn(
    `[NIP API] ${endpoint} failed${offline ? " (backend unreachable)" : ""}: ${message}. Showing empty fallback — check Laragon/backend is running and NEXT_PUBLIC_API_URL is correct.`,
  );
}
