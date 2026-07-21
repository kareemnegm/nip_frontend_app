"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea, TextInput } from "@/components/ui/FormControls";
import { Icon } from "@/components/ui/Icon";
import { getFieldError, isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/cn";

type MemberAdvisorMessageFormProps = {
  advisorName?: string;
  locale?: "en" | "ar";
  onClose?: () => void;
};

export function MemberAdvisorMessageForm({
  advisorName = "Your Advisor",
  locale = "en",
  onClose,
}: MemberAdvisorMessageFormProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setFormError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/member/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          const mapped: Record<string, string> = {};
          for (const [field, messages] of Object.entries(
            data.errors as Record<string, string[]>,
          )) {
            mapped[field] = messages[0] ?? "Invalid value";
          }
          setErrors(mapped);
        } else {
          setFormError(data.message ?? "Message could not be sent.");
        }
        return;
      }
      setSuccessMessage(
        typeof data.message === "string"
          ? data.message
          : `${advisorName} will respond according to their availability.`,
      );
    } catch (error) {
      if (isApiError(error)) {
        setFormError(
          getFieldError(error.errors, "message") ??
            error.message ??
            "Message could not be sent.",
        );
      } else {
        setFormError("Message could not be sent.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (successMessage) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-lg font-bold text-brand">Message sent</p>
        <p className="text-body-sm text-ink-secondary">{successMessage}</p>
        <Button type="button" className="w-full justify-center" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-4 p-6" onSubmit={onSubmit}>
      <div>
        <p className="text-overline font-semibold text-accent">Private Office</p>
        <h2 className="mt-2 text-xl font-bold text-brand">Message {advisorName}</h2>
        <p className="mt-1 text-body-sm text-ink-secondary">
          Your note goes directly to your assigned advisor.
        </p>
      </div>
      <TextInput
        label="Subject"
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        error={errors.subject}
        required
      />
      <Textarea
        label="Message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        error={errors.message}
        required
      />
      {formError ? (
        <p className="text-sm text-error" role="alert">
          {formError}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="flex-1 justify-center" disabled={loading}>
          {loading ? "Sending…" : "Send Message"}
        </Button>
        {onClose ? (
          <Button type="button" variant="outline" className="justify-center" onClick={onClose}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function MemberAdvisorMessageDialog({
  advisorName,
  locale = "en",
  triggerClassName,
}: {
  advisorName?: string;
  locale?: "en" | "ar";
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("privateOffice");

  return (
    <>
      <Button
        type="button"
        variant="primary"
        size="md"
        className={cn("w-full shrink-0 justify-center sm:w-auto", triggerClassName)}
        onClick={() => setOpen(true)}
      >
        {t("messageAdvisor")}
      </Button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-message-title"
        >
          <div className="relative w-full max-w-lg rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 text-ink-tertiary hover:text-brand"
              onClick={() => setOpen(false)}
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
            <MemberAdvisorMessageForm
              advisorName={advisorName}
              locale={locale}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
