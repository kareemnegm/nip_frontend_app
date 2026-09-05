import { ApiError } from "./errors";
import type { Locale } from "@/lib/i18n/config";
import { withLocaleParam } from "./locale-params";

/** Hostnames treated as local backend during `npm run dev`. */
const LOCAL_API_HOSTS = new Set([
  "127.0.0.1",
  "localhost",
  "nip_reality_backend.test",
]);

const DEFAULT_LOCAL_API_URL = "http://127.0.0.1:8000";

function resolveApiBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    DEFAULT_LOCAL_API_URL;

  const trimmed = configured.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    try {
      const { hostname } = new URL(trimmed);
      if (!LOCAL_API_HOSTS.has(hostname)) {
        console.warn(
          `[NIP API] Dev mode: NEXT_PUBLIC_API_URL is "${trimmed}" — using ${DEFAULT_LOCAL_API_URL} for local backend. Update .env.local if you need a different host.`,
        );
        return DEFAULT_LOCAL_API_URL;
      }
    } catch {
      console.warn(
        `[NIP API] Dev mode: invalid NEXT_PUBLIC_API_URL — using ${DEFAULT_LOCAL_API_URL}.`,
      );
      return DEFAULT_LOCAL_API_URL;
    }
  }

  return trimmed;
}

export const API_BASE_URL = resolveApiBaseUrl();

export const API_V1_ROOT = `${API_BASE_URL.replace(/\/$/, "")}/api/v1`;

/** @deprecated ISR disabled — all API reads use no-store. Kept for /api/revalidate docs. */
export const DEFAULT_REVALIDATE_SECONDS = 0;

function resolveFetchCacheOptions(): Pick<RequestInit, "cache"> {
  return { cache: "no-store" };
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

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text.trim()) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(
      "API returned invalid JSON",
      response.status,
      undefined,
      "INVALID_JSON",
    );
  }
}

/**
 * A backend restart or a save that briefly locks a row makes one request fail.
 * Without a retry that single blip becomes a rendered 500 for every visitor
 * until the next revalidation, so retry idempotent reads once.
 */
const RETRYABLE_METHODS = new Set(["GET", "HEAD"]);
const RETRY_BASE_DELAY_MS = 300;
const RETRY_MAX_ATTEMPTS = 3;

function isRetryableStatus(status: number): boolean {
  return status >= 500 || status === 408 || status === 429;
}

function retryDelayMs(attempt: number): number {
  return RETRY_BASE_DELAY_MS * 2 ** attempt;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiRequest<T>(
  path: string,
  { params, token, locale, revalidate, body, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const queryParams = locale ? withLocaleParam(params, locale) : params;
  const method = (init.method ?? "GET").toUpperCase();
  const canRetry = RETRYABLE_METHODS.has(method);

  const send = () =>
    fetch(buildUrl(path, queryParams), {
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
      ...resolveFetchCacheOptions(),
    });

  let response: Response | undefined;
  let lastError: unknown;

  for (let attempt = 0; attempt < (canRetry ? RETRY_MAX_ATTEMPTS : 1); attempt += 1) {
    if (attempt > 0) {
      await sleep(retryDelayMs(attempt - 1));
    }

    try {
      response = await send();
      lastError = undefined;
    } catch (error) {
      lastError = error;
      if (!canRetry || attempt >= RETRY_MAX_ATTEMPTS - 1) {
        throw error;
      }
      continue;
    }

    if (response.ok || !canRetry || !isRetryableStatus(response.status)) {
      break;
    }

    if (attempt >= RETRY_MAX_ATTEMPTS - 1) {
      break;
    }
  }

  if (!response) {
    throw lastError ?? new ApiError("Request failed", 500);
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return parseJsonResponse<T>(response);
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
