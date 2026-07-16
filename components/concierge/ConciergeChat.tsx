"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FaqAccordion } from "@/components/FaqAccordion";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { mapPropertyToCard } from "@/lib/mappers/property";
import { ConciergeMessageContent } from "./ConciergeMessageContent";
import { ConciergePropertyCard } from "./ConciergePropertyCard";
import { ConciergeTypingIndicator } from "./ConciergeTypingIndicator";
import { useConciergeChat } from "./useConciergeChat";

type ConciergeChatProps = {
  variant?: "page" | "panel";
  autoStartSession?: boolean;
  className?: string;
  onSessionStart?: () => void;
};

const assistantBubbleClass =
  "max-w-[460px] rounded-tl-[14px] rounded-tr-[14px] rounded-bl-[4px] rounded-br-[14px] bg-sapphire-50 px-[18px] py-3.5 text-[13px] leading-[18px] text-ink";

const userBubbleClass =
  "max-w-[360px] rounded-tl-[14px] rounded-tr-[14px] rounded-bl-[14px] rounded-br-[4px] bg-brand px-[18px] py-3.5 text-[13px] leading-[18px] text-white";

export function ConciergeChat({
  variant = "page",
  autoStartSession = variant === "page",
  className,
  onSessionStart,
}: ConciergeChatProps) {
  const t = useTranslations("pages.concierge");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userHasMessagedRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);
  const wasSendingRef = useRef(false);

  function isNearBottom(container: HTMLElement) {
    const threshold = 96;
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold
    );
  }

  function focusInput() {
    inputRef.current?.focus({ preventScroll: true });
  }

  const chat = useConciergeChat({
    autoStartSession,
    alwaysShowChatUi: variant === "page",
    defaultGreeting: t("defaultGreeting"),
  });
  const {
    locale,
    status,
    messages,
    leadCapture,
    leadSubmitted,
    leadThankYou,
    errorCode,
    errorMessage,
    quickPrompts,
    speakToAdvisorUrl,
    fallbackFaqs,
    isFallback,
    isSending,
    beginSession,
    send,
    submitLead,
  } = chat;

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    function handleScroll() {
      shouldAutoScrollRef.current = isNearBottom(container!);
    }

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!userHasMessagedRef.current || !shouldAutoScrollRef.current) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages, leadCapture.status]);

  useEffect(() => {
    if (wasSendingRef.current && !isSending) {
      focusInput();
    }
    wasSendingRef.current = isSending;
  }, [isSending]);

  useEffect(() => {
    if (chat.sessionId && onSessionStart) {
      onSessionStart();
    }
  }, [chat.sessionId, onSessionStart]);

  const fallbackChipPrompts = [t("chip1"), t("chip2"), t("chip3"), t("chip4")];
  const chips = quickPrompts.length > 0 ? quickPrompts : fallbackChipPrompts;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim() || isSending || isFallback) return;
    const value = input;
    setInput("");
    userHasMessagedRef.current = true;
    shouldAutoScrollRef.current = true;
    focusInput();
    await send(value);
    focusInput();
  }

  async function handleChipClick(prompt: string) {
    if (isSending || isFallback) return;
    userHasMessagedRef.current = true;
    if (!chat.sessionId) {
      await beginSession();
    }
    await send(prompt);
  }

  async function handleLeadSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (leadSubmitting || leadSubmitted) return;

    setLeadSubmitting(true);
    try {
      await submitLead({
        name: leadName.trim(),
        email: leadEmail.trim(),
        phone: leadPhone.trim() || undefined,
        consentMarketing: leadConsent,
        preferredLanguage: locale,
      });
    } catch {
      // error state handled in hook
    } finally {
      setLeadSubmitting(false);
    }
  }

  const showLeadForm =
    !leadSubmitted &&
    (leadCapture.status === "collecting" || leadCapture.status === "qualified");

  let leadFormMessageId: string | null = null;
  if (showLeadForm) {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i]?.leadCapture) {
        leadFormMessageId = messages[i]!.id;
        break;
      }
    }
  }

  function renderLeadCaptureBlock() {
    if (!showLeadForm) return null;

    return (
      <>
        {leadCapture.prompt ? (
          <div className="flex w-full justify-start">
            <p className={assistantBubbleClass}>{leadCapture.prompt}</p>
          </div>
        ) : null}

        <form
          onSubmit={(event) => void handleLeadSubmit(event)}
          className="max-w-[460px] space-y-3 rounded-2xl border border-line bg-surface-muted p-4"
        >
          <p className="text-body-xs font-semibold text-brand">{t("leadTitle")}</p>
          <input
            type="text"
            required
            value={leadName}
            onChange={(event) => setLeadName(event.target.value)}
            placeholder={t("leadName")}
            className="h-10 w-full rounded-[var(--radius-field)] border border-line bg-white px-3 text-body-sm outline-none focus:border-brand"
          />
          <input
            type="email"
            required
            value={leadEmail}
            onChange={(event) => setLeadEmail(event.target.value)}
            placeholder={t("leadEmail")}
            className="h-10 w-full rounded-[var(--radius-field)] border border-line bg-white px-3 text-body-sm outline-none focus:border-brand"
          />
          <input
            type="tel"
            value={leadPhone}
            onChange={(event) => setLeadPhone(event.target.value)}
            placeholder={t("leadPhone")}
            className="h-10 w-full rounded-[var(--radius-field)] border border-line bg-white px-3 text-body-sm outline-none focus:border-brand"
          />
          <label className="flex items-start gap-2 text-body-xs text-ink-secondary">
            <input
              type="checkbox"
              required
              checked={leadConsent}
              onChange={(event) => setLeadConsent(event.target.checked)}
              className="mt-0.5"
            />
            {t("leadConsent")}
          </label>
          <Button type="submit" size="sm" disabled={leadSubmitting}>
            {leadSubmitting ? tc("sending") : t("leadSubmit")}
          </Button>
        </form>
      </>
    );
  }

  if (status === "loading") {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-8 text-body-sm text-ink-secondary",
          className,
        )}
      >
        {tc("loading")}
      </div>
    );
  }

  if (isFallback) {
    const faqItems =
      fallbackFaqs.length > 0
        ? fallbackFaqs.map((item, index) => ({
            id: `faq-${index}`,
            question: item.question,
            answer: item.answer,
          }))
        : [];

    return (
      <div className={cn("space-y-6", className)}>
        {faqItems.length > 0 ? <FaqAccordion items={faqItems} /> : null}
        <p className="text-center text-body-sm text-ink-secondary">
          {t("errorDisabled")}{" "}
          <LocalizedLink
            href={speakToAdvisorUrl}
            className="font-semibold text-brand hover:text-brand-hover"
          >
            {t("speakToAdvisor")}
          </LocalizedLink>
        </p>
      </div>
    );
  }

  const shellClass =
    variant === "page"
      ? "gap-5 rounded-[12px] border border-line bg-white px-7 pb-6 pt-7 shadow-[0_6px_24px_rgba(18,51,94,0.08)]"
      : "rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden",
        variant === "page" && "max-h-[min(720px,calc(100vh-12rem))]",
        variant === "panel" && "h-full max-h-[min(640px,calc(100vh-8rem))]",
        shellClass,
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-wrap gap-2.5",
          variant === "panel" && "border-b border-line p-4",
        )}
      >
        {chips.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={isSending}
            onClick={() => void handleChipClick(prompt)}
            className="rounded-lg border border-[#b5c4d8] bg-white px-3.5 py-2 text-[11px] font-medium leading-[14px] text-ink-secondary transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div
        ref={messagesContainerRef}
        className={cn(
          "flex flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain",
          variant === "page" && "min-h-[320px]",
          variant === "panel" && "min-h-[280px] p-5 sm:p-6",
        )}
      >
        {messages.map((message) => {
          const isTyping =
            message.role === "assistant" &&
            message.isStreaming &&
            !message.content.trim();
          const hasAssistantBody =
            message.role === "user" ||
            Boolean(message.content.trim()) ||
            isTyping;

          return (
          <div key={message.id} className="flex w-full flex-col gap-4">
            {hasAssistantBody ? (
            <div
              className={cn(
                "flex w-full",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={
                  message.role === "user" ? userBubbleClass : assistantBubbleClass
                }
              >
                {message.role === "assistant" ? (
                  isTyping ? (
                    <ConciergeTypingIndicator label={t("typing")} />
                  ) : message.content ? (
                    <ConciergeMessageContent content={message.content} />
                  ) : null
                ) : (
                  message.content
                )}
              </div>
            </div>
            ) : null}

            {message.role === "assistant" && message.properties?.length ? (
              <div className="flex flex-col gap-4">
                {message.properties.map((property) => (
                  <ConciergePropertyCard
                    key={property.id}
                    {...mapPropertyToCard(property, locale)}
                  />
                ))}
              </div>
            ) : null}

            {message.id === leadFormMessageId ? renderLeadCaptureBlock() : null}
          </div>
          );
        })}

        {/* Fallback if lead is open but not yet pinned to a message (race). */}
        {showLeadForm && !leadFormMessageId ? renderLeadCaptureBlock() : null}

        {leadSubmitted ? (
          <div className="flex w-full justify-start">
            <p className={assistantBubbleClass}>
              {leadThankYou ?? t("leadSubmitted")}
            </p>
          </div>
        ) : null}

        {errorMessage ? (
          <p className="text-body-xs text-red-600" role="alert">
            {errorCode === "RATE_LIMITED"
              ? t("errorRateLimited")
              : errorCode === "SESSION_NOT_FOUND"
                ? t("sessionExpired")
                : errorMessage || t("errorGeneric")}
          </p>
        ) : null}
      </div>

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className={cn(
          "flex items-center justify-between gap-3 rounded-lg border border-[#b5c4d8] bg-white py-2 pl-[18px] pr-1.5",
          variant === "panel" && "mx-4 mb-4 mt-auto border-line",
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={status === "error"}
          aria-label={t("inputPlaceholder")}
          placeholder={t("inputPlaceholder")}
          className="h-9 min-w-0 flex-1 border-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-tertiary disabled:opacity-60"
        />
        <Button
          type="submit"
          variant="accent"
          size="md"
          className="shrink-0"
          disabled={isSending || !input.trim() || status === "error"}
        >
          {isSending ? tc("sending") : tc("send")}
        </Button>
      </form>
    </div>
  );
}
