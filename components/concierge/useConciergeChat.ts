"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getConciergeConfig,
  sendConciergeMessage,
  startConciergeSession,
  submitConciergeLead,
} from "@/lib/api/concierge";
import { isApiError } from "@/lib/api/errors";
import { useLocale } from "@/lib/i18n/context";
import { stripLocaleFromPathname } from "@/lib/i18n/helpers";
import type { ApiProperty } from "@/types/api";
import type {
  ConciergeConfig,
  ConciergeLeadInput,
  ConciergeMessageMeta,
  LeadCaptureState,
} from "@/types/api/concierge";

const SESSION_STORAGE_KEY = "nip-concierge-session-id";

export type ConciergeChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  properties?: ApiProperty[];
  isStreaming?: boolean;
  meta?: ConciergeMessageMeta;
  /** Pin lead UI after this assistant turn so later user messages stay chronologically below it. */
  leadCapture?: LeadCaptureState | null;
};

export type ConciergeChatStatus =
  | "idle"
  | "loading"
  | "ready"
  | "sending"
  | "error"
  | "disabled";

type UseConciergeChatOptions = {
  autoStartSession?: boolean;
  /** Keep the designed chat card on /concierge even when the API is off. */
  alwaysShowChatUi?: boolean;
  defaultGreeting?: string;
};

function readStoredSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredSessionId(sessionId: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (sessionId) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useConciergeChat(options: UseConciergeChatOptions = {}) {
  const {
    autoStartSession = false,
    alwaysShowChatUi = false,
    defaultGreeting = "",
  } = options;
  const { locale } = useLocale();
  const pathname = usePathname();

  const [config, setConfig] = useState<ConciergeConfig | null>(null);
  const [status, setStatus] = useState<ConciergeChatStatus>("loading");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConciergeChatMessage[]>([]);
  const [leadCapture, setLeadCapture] = useState<LeadCaptureState>({
    status: "none",
    missingFields: [],
  });
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadThankYou, setLeadThankYou] = useState<string | null>(null);

  const startingSessionRef = useRef(false);
  const sessionStartedRef = useRef(false);

  const sourcePage = stripLocaleFromPathname(pathname);

  const loadConfig = useCallback(async () => {
    setStatus("loading");
    setErrorCode(null);
    setErrorMessage(null);

    try {
      const nextConfig = await getConciergeConfig(locale);
      setConfig(nextConfig);

      if (!nextConfig.enabled || nextConfig.fallbackMode) {
        if (alwaysShowChatUi) {
          setStatus("ready");
          const greeting =
            nextConfig.greeting?.trim() || defaultGreeting.trim();
          if (greeting) {
            setMessages([
              { id: createMessageId(), role: "assistant", content: greeting },
            ]);
          }
        } else {
          setStatus("disabled");
        }
        return;
      }

      setStatus("ready");
    } catch (error) {
      if (alwaysShowChatUi) {
        setConfig(null);
        setStatus("ready");
        if (defaultGreeting.trim()) {
          setMessages([
            {
              id: createMessageId(),
              role: "assistant",
              content: defaultGreeting.trim(),
            },
          ]);
        }
        return;
      }
      setStatus("error");
      setErrorCode(isApiError(error) ? error.code ?? "ERROR" : "ERROR");
      setErrorMessage(
        isApiError(error) ? error.message : "Failed to load concierge",
      );
    }
  }, [alwaysShowChatUi, defaultGreeting, locale]);

  const beginSession = useCallback(
    async (forceNew = false) => {
      if (startingSessionRef.current) return sessionId;
      if (!forceNew && sessionId && sessionStartedRef.current) return sessionId;

      startingSessionRef.current = true;
      setErrorCode(null);
      setErrorMessage(null);

      try {
        const session = await startConciergeSession({
          locale,
          sourcePage,
        });

        setSessionId(session.sessionId);
        writeStoredSessionId(session.sessionId);
        setLeadCapture(session.leadCapture);
        sessionStartedRef.current = true;

        const greetingId = createMessageId();
        const greetingLead =
          session.leadCapture.status === "collecting" ||
          session.leadCapture.status === "qualified"
            ? session.leadCapture
            : null;

        setMessages([
          {
            id: greetingId,
            role: "assistant",
            content: session.greeting,
            leadCapture: greetingLead,
          },
        ]);

        setConfig((prev) =>
          prev
            ? {
                ...prev,
                disclaimer: session.disclaimer,
                quickPrompts:
                  session.quickPrompts.length > 0
                    ? session.quickPrompts
                    : prev.quickPrompts,
                greeting: session.greeting,
              }
            : prev,
        );

        setStatus("ready");
        return session.sessionId;
      } catch (error) {
        if (isApiError(error) && error.code === "CONCIERGE_DISABLED") {
          setStatus("disabled");
          setConfig((prev) =>
            prev ? { ...prev, enabled: false, fallbackMode: true } : prev,
          );
        } else {
          setStatus("error");
          setErrorCode(isApiError(error) ? error.code ?? "ERROR" : "ERROR");
          setErrorMessage(
            isApiError(error) ? error.message : "Failed to start session",
          );
        }
        return null;
      } finally {
        startingSessionRef.current = false;
      }
    },
    [locale, sessionId, sourcePage],
  );

  const ensureSession = useCallback(async () => {
    const stored = readStoredSessionId();
    if (stored && !sessionId) {
      setSessionId(stored);
      sessionStartedRef.current = true;
      return stored;
    }
    if (sessionId) return sessionId;
    return beginSession();
  }, [beginSession, sessionId]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status === "sending") return;
      if (status === "disabled" && !alwaysShowChatUi) return;

      const serviceOff =
        Boolean(config && (!config.enabled || config.fallbackMode)) ||
        (status === "error" && !sessionId && !config);

      setStatus("sending");
      setErrorCode(null);
      setErrorMessage(null);

      const activeSessionId = await ensureSession();
      if (!activeSessionId) {
        if (serviceOff && alwaysShowChatUi) {
          setErrorCode("CONCIERGE_DISABLED");
          setErrorMessage("Concierge is temporarily unavailable.");
        }
        setStatus(alwaysShowChatUi ? "ready" : "error");
        return;
      }

      const run = async (
        sid: string,
        options: { retryOnMissing?: boolean; appendUser?: boolean } = {
          retryOnMissing: true,
          appendUser: true,
        },
      ) => {
        const assistantId = createMessageId();

        if (options.appendUser) {
          const userMessage: ConciergeChatMessage = {
            id: createMessageId(),
            role: "user",
            content: trimmed,
          };
          setMessages((prev) => [
            ...prev,
            userMessage,
            {
              id: assistantId,
              role: "assistant",
              content: "",
              isStreaming: true,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content: "",
              isStreaming: true,
            },
          ]);
        }

        const appendToken = (token: string) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: message.content + token }
                : message,
            ),
          );
        };

        const finalizeAssistant = (patch: Partial<ConciergeChatMessage>) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, ...patch, isStreaming: false }
                : message,
            ),
          );
        };

        try {
          await sendConciergeMessage(
            {
              sessionId: sid,
              message: trimmed,
              locale,
            },
            {
              onToken: ({ text: token }) => appendToken(token),
              onProperties: ({ items }) => {
                setMessages((prev) =>
                  prev.map((message) =>
                    message.id === assistantId
                      ? { ...message, properties: items as ApiProperty[] }
                      : message,
                  ),
                );
              },
              onLeadCapture: (state) => {
                setLeadCapture(state);
                const pinForm =
                  state.status === "collecting" || state.status === "qualified";
                setMessages((prev) =>
                  prev.map((message) => {
                    if (message.id === assistantId) {
                      return {
                        ...message,
                        leadCapture: pinForm ? state : null,
                      };
                    }
                    // Only one open lead form in the timeline.
                    if (pinForm && message.leadCapture) {
                      return { ...message, leadCapture: null };
                    }
                    return message;
                  }),
                );
              },
              onMeta: (meta) => {
                setMessages((prev) =>
                  prev.map((message) =>
                    message.id === assistantId ? { ...message, meta } : message,
                  ),
                );
              },
              onError: ({ code, message }) => {
                setErrorCode(code ?? "ERROR");
                setErrorMessage(message);
                finalizeAssistant({
                  content: message,
                  isStreaming: false,
                });
              },
              onDone: () => {
                setMessages((prev) =>
                  prev.map((message) =>
                    message.id === assistantId
                      ? { ...message, isStreaming: false }
                      : message,
                  ),
                );
                setStatus("ready");
              },
            },
          );
        } catch (error) {
          if (
            options.retryOnMissing &&
            isApiError(error) &&
            (error.code === "SESSION_NOT_FOUND" || error.status === 404)
          ) {
            writeStoredSessionId(null);
            setSessionId(null);
            sessionStartedRef.current = false;
            setMessages((prev) => prev.filter((m) => m.id !== assistantId));
            const newSid = await beginSession(true);
            if (newSid) {
              await run(newSid, { retryOnMissing: false, appendUser: false });
              return;
            }
          }

          setStatus(
            isApiError(error) && error.code === "CONCIERGE_DISABLED"
              ? "disabled"
              : "error",
          );
          setErrorCode(isApiError(error) ? error.code ?? "ERROR" : "ERROR");
          setErrorMessage(
            isApiError(error) ? error.message : "Failed to send message",
          );
          finalizeAssistant({
            content: isApiError(error)
              ? error.message
              : "Something went wrong.",
            isStreaming: false,
          });
        }
      };

      await run(activeSessionId);
    },
    [alwaysShowChatUi, beginSession, ensureSession, locale, config, sessionId, status],
  );

  const submitLead = useCallback(
    async (input: Omit<ConciergeLeadInput, "sessionId">) => {
      const activeSessionId = await ensureSession();
      if (!activeSessionId) return;

      setErrorCode(null);
      setErrorMessage(null);

      try {
        const result = await submitConciergeLead({
          ...input,
          sessionId: activeSessionId,
          preferredLanguage: input.preferredLanguage ?? locale,
        });
        setLeadSubmitted(true);
        setLeadThankYou(result.message);
        setLeadCapture({ status: "submitted", missingFields: [] });
        setMessages((prev) =>
          prev.map((message) =>
            message.leadCapture
              ? { ...message, leadCapture: null }
              : message,
          ),
        );
      } catch (error) {
        if (isApiError(error) && error.code === "LEAD_ALREADY_SUBMITTED") {
          setLeadSubmitted(true);
          setLeadCapture({ status: "submitted", missingFields: [] });
          setMessages((prev) =>
            prev.map((message) =>
              message.leadCapture
                ? { ...message, leadCapture: null }
                : message,
            ),
          );
          return;
        }
        setErrorCode(isApiError(error) ? error.code ?? "ERROR" : "ERROR");
        setErrorMessage(
          isApiError(error) ? error.message : "Failed to submit lead",
        );
        throw error;
      }
    },
    [ensureSession, locale],
  );

  useEffect(() => {
    queueMicrotask(() => {
      void loadConfig();
    });
  }, [loadConfig]);

  useEffect(() => {
    if (!autoStartSession || status !== "ready") {
      return;
    }

    const serviceOff =
      Boolean(config && (!config.enabled || config.fallbackMode)) ||
      (status === "ready" && !config && alwaysShowChatUi);

    if (alwaysShowChatUi && serviceOff) {
      return;
    }

    if (sessionStartedRef.current) {
      return;
    }

    queueMicrotask(() => {
      void beginSession();
    });
  }, [autoStartSession, alwaysShowChatUi, beginSession, config, status]);

  const quickPrompts =
    config?.quickPrompts && config.quickPrompts.length > 0
      ? config.quickPrompts
      : [];

  return {
    locale,
    config,
    status,
    sessionId,
    messages,
    leadCapture,
    leadSubmitted,
    leadThankYou,
    errorCode,
    errorMessage,
    quickPrompts,
    disclaimer: config?.disclaimer ?? "",
    speakToAdvisorUrl: config?.speakToAdvisorUrl ?? "/contact",
    fallbackFaqs: config?.fallbackFaqs ?? [],
    isFallback:
      !alwaysShowChatUi &&
      Boolean(config?.fallbackMode || (config && !config.enabled)),
    isSending: status === "sending",
    loadConfig,
    beginSession,
    ensureSession,
    send,
    submitLead,
  };
}
