import { ApiError } from "./errors";
import type { Locale } from "@/lib/i18n/config";
import { withLocaleParam } from "./locale-params";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://127.0.0.1:8000";

export const API_V1_ROOT = `${API_BASE_URL.replace(/\/$/, "")}/api/v1`;

export const DEFAULT_REVALIDATE_SECONDS = 60;

function resolveFetchCacheOptions(
  revalidate?: number | false,
): Pick<RequestInit, "cache"> | { next: { revalidate: number } } | undefined {
  // Always hit the backend in dev — avoids stale empty pages after a failed request.
  if (process.env.NODE_ENV === "development") {
    return { cache: "no-store" };
  }

  if (revalidate === false) {
    return undefined;
  }

  return { next: { revalidate: revalidate ?? DEFAULT_REVALIDATE_SECONDS } };
}

type RequestOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number | undefined | null>;
  token?: string;
  locale?: Locale;
  revalidate?: number | false;
  body?: unknown;
};

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_V1_ROOT}${normalized}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function buildHeaders(
  token?: string,
  contentType = true,
  locale?: Locale,
): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (contentType) {
    headers["Content-Type"] = "application/json";
  }

  if (locale) {
    headers["Accept-Language"] = locale;
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  const text = await response.text();
  let message = response.statusText || "Request failed";
  let errors: Record<string, string[]> | undefined;
  let code: string | undefined;

  if (text) {
    try {
      const json = JSON.parse(text) as {
        message?: string;
        error?: { code?: string; message?: string; details?: unknown };
        errors?: Record<string, string[]>;
      };
      message = json.error?.message ?? json.message ?? message;
      errors = json.errors;
      code = json.error?.code;
    } catch {
      message = text;
    }
  }

  return new ApiError(message, response.status, errors, code);
}

export async function apiRequest<T>(
  path: string,
  { params, token, locale, revalidate, body, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const queryParams = locale ? withLocaleParam(params, locale) : params;

  const response = await fetch(buildUrl(path, queryParams), {
    ...init,
    headers: {
      ...buildHeaders(token, !isFormData && body !== undefined, locale),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
    ...resolveFetchCacheOptions(revalidate),
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function apiGet<T>(
  path: string,
  options?: Omit<RequestOptions, "body" | "method">,
): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "GET" });
}

/** Laravel API Resources wrap single items as `{ data: T }`. */
export function unwrapData<T>(payload: T | { data: T }): T {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data: T }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options?: Omit<RequestOptions, "body" | "method">,
): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "POST", body });
}

export async function apiDelete<T>(
  path: string,
  options?: Omit<RequestOptions, "body" | "method">,
): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "DELETE" });
}

/** @deprecated Use apiGet/apiPost with /api/v1 paths */
export async function apiFetch<T>(
  path: string,
  { params, ...init }: RequestInit & { params?: Record<string, string> } = {},
): Promise<T> {
  const normalized = path.startsWith("/api/v1")
    ? path.replace(/^\/api\/v1/, "")
    : path.startsWith("/")
      ? path
      : `/${path}`;

  return apiRequest<T>(normalized, {
    ...init,
    params,
    revalidate: false,
    body:
      init.body && typeof init.body === "string"
        ? JSON.parse(init.body)
        : undefined,
  });
}

export { API_BASE_URL as legacyApiBaseUrl };
