import { API_V1_ROOT } from "@/lib/api/client";

/**
 * Forwards browser concierge requests to the backend (server-side).
 * Avoids mixed-content blocks when the site is HTTPS but the API URL is HTTP.
 */
export async function proxyConciergeRequest(
  request: Request,
  backendPath: string,
): Promise<Response> {
  const url = new URL(`${API_V1_ROOT}${backendPath}`);
  const incoming = new URL(request.url);
  incoming.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers = new Headers();
  const accept = request.headers.get("Accept");
  if (accept) headers.set("Accept", accept);
  const contentType = request.headers.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);
  const acceptLanguage = request.headers.get("Accept-Language");
  if (acceptLanguage) headers.set("Accept-Language", acceptLanguage);
  const authorization = request.headers.get("Authorization");
  if (authorization) headers.set("Authorization", authorization);

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(url.toString(), init);
  const responseType = response.headers.get("Content-Type") ?? "application/json";

  if (responseType.includes("text/event-stream") && response.body) {
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  }

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": responseType },
  });
}
