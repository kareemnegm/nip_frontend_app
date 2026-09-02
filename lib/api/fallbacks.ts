import type { ApiHomeData } from "@/types/api";
import type { LaravelPaginated } from "@/types/api";
import { ApiError } from "./errors";

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

/** Backend timeout, 5xx, rate limit, or malformed JSON — usually clears on retry. */
export function isTransientApiError(error: unknown): boolean {
  if (isOfflineError(error)) return true;
  if (error instanceof ApiError) {
    return (
      error.status >= 500 ||
      error.status === 408 ||
      error.status === 429 ||
      error.code === "INVALID_JSON"
    );
  }
  return false;
}

/** Log when an API call fails and the UI falls back instead of crashing. */
export function logApiFallback(
  endpoint: string,
  error: unknown,
  options: { production?: boolean } = {},
): void {
  const inDev = process.env.NODE_ENV === "development";
  if (!inDev && !options.production) return;

  const offline = isOfflineError(error);
  const message =
    error instanceof Error ? error.message : String(error ?? "Unknown error");

  const line = `[NIP API] ${endpoint} failed${offline ? " (backend unreachable)" : ""}: ${message}. Showing fallback instead of a 500 page.`;

  if (inDev) {
    console.warn(`${line} Check Laragon/backend is running and NEXT_PUBLIC_API_URL is correct.`);
  } else {
    console.error(line);
  }
}
