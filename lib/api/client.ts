const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:8000";

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

function buildUrl(path: string, params?: Record<string, string>) {
  const url = new URL(path.startsWith("/") ? path.slice(1) : path, API_BASE_URL);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  { params, ...init }: FetchOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export { API_BASE_URL };
