import { ApiError } from "./errors";
import type { Locale } from "@/lib/i18n/config";
import type { ApiProperty } from "@/types/api";
import type {
  ConciergeConfig,
  ConciergeJsonMessageResponse,
  ConciergeLeadInput,
  ConciergeLeadResponse,
  ConciergeMessageMeta,
  ConciergeSendMessageInput,
  ConciergeSession,
  ConciergeSseHandlers,
  ConciergeStartSessionInput,
  LeadCaptureState,
} from "@/types/api/concierge";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

const API_V1 = `${API_BASE}/api/v1`;

type FetchOptions = {
  locale?: Locale;
  token?: string;
  accept?: string;
};

async function parseErrorResponse(response: Response): Promise<ApiError> {
  const text = await response.text();
  let message = response.statusText || "Request failed";
  let code: string | undefined;

  if (text) {
    try {
      const json = JSON.parse(text) as {
        message?: string;
        error?: { code?: string; message?: string };
      };
      message = json.error?.message ?? json.message ?? message;
      code = json.error?.code;
    } catch {
      message = text;
    }
  }

  return new ApiError(message, response.status, undefined, code);
}

function buildHeaders({ locale, token, accept }: FetchOptions = {}): HeadersInit {
  const headers: Record<string, string> = {
    Accept: accept ?? "application/json",
    "Content-Type": "application/json",
  };

  if (locale) {
    headers["Accept-Language"] = locale;
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function conciergeFetch<T>(
  path: string,
  init: RequestInit & { locale?: Locale; token?: string; accept?: string } = {},
): Promise<T> {
  const { locale, token, accept, ...rest } = init;
  const response = await fetch(`${API_V1}${path}`, {
    ...rest,
    headers: {
      ...buildHeaders({ locale, token, accept }),
      ...(rest.headers as Record<string, string> | undefined),
    },
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getConciergeConfig(
  locale: Locale,
  token?: string,
): Promise<ConciergeConfig> {
  const url = new URL(`${API_V1}/concierge/config`);
  url.searchParams.set("locale", locale);

  const response = await fetch(url.toString(), {
    headers: buildHeaders({ locale, token }),
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return response.json() as Promise<ConciergeConfig>;
}

export async function startConciergeSession(
  body: ConciergeStartSessionInput,
  token?: string,
): Promise<ConciergeSession> {
  return conciergeFetch<ConciergeSession>("/concierge/sessions", {
    method: "POST",
    body: JSON.stringify(body),
    locale: body.locale,
    token,
  });
}

function dispatchSseEvent(
  eventName: string,
  data: unknown,
  handlers: ConciergeSseHandlers,
) {
  switch (eventName) {
    case "token":
      handlers.onToken?.(data as { text: string });
      break;
    case "properties":
      handlers.onProperties?.({ items: (data as { items: ApiProperty[] }).items });
      break;
    case "leadCapture":
      handlers.onLeadCapture?.(data as LeadCaptureState);
      break;
    case "meta":
      handlers.onMeta?.(data as ConciergeMessageMeta);
      break;
    case "error":
      handlers.onError?.(data as { code?: string; message: string });
      break;
    case "done":
      handlers.onDone?.();
      break;
    default:
      break;
  }
}

export async function sendConciergeMessage(
  body: ConciergeSendMessageInput,
  handlers: ConciergeSseHandlers,
  token?: string,
): Promise<void> {
  const response = await fetch(`${API_V1}/concierge/messages`, {
    method: "POST",
    headers: buildHeaders({
      locale: body.locale,
      token,
      accept: "text/event-stream",
    }),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new ApiError("Streaming not supported", 500);
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let eventName = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
        continue;
      }

      if (line.startsWith("data:") && eventName) {
        const raw = line.slice(5).trim();
        if (raw) {
          try {
            const data = JSON.parse(raw) as unknown;
            dispatchSseEvent(eventName, data, handlers);
          } catch {
            // ignore malformed SSE chunks
          }
        }
        eventName = "";
      }
    }
  }

  if (!eventName) {
    handlers.onDone?.();
  }
}

export async function sendConciergeMessageJson(
  body: ConciergeSendMessageInput,
  token?: string,
): Promise<ConciergeJsonMessageResponse> {
  return conciergeFetch<ConciergeJsonMessageResponse>("/concierge/messages", {
    method: "POST",
    body: JSON.stringify(body),
    locale: body.locale,
    token,
    accept: "application/json",
  });
}

export async function submitConciergeLead(
  body: ConciergeLeadInput,
  token?: string,
): Promise<ConciergeLeadResponse> {
  return conciergeFetch<ConciergeLeadResponse>("/concierge/lead", {
    method: "POST",
    body: JSON.stringify(body),
    locale: body.preferredLanguage,
    token,
  });
}
