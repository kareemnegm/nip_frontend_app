"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox, PhoneInput, Textarea, TextInput } from "@/components/ui/FormControls";
import { Icon } from "@/components/ui/Icon";
import { getFieldError, isApiError } from "@/lib/api/errors";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";

type InquiryFormProps = {
  variant: "contact" | "consultation" | "privateAdvisory";
};

export function InquiryForm({ variant }: InquiryFormProps) {
  const locale = useLocale().locale;
  const router = useRouter();
  const t = useTranslations("forms");
  const tc = useTranslations("common");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title =
    variant === "privateAdvisory" ? t("privateAdvisoryTitle") : t("requirementTitle");
  const subtitle =
    variant === "privateAdvisory" ? t("privateAdvisorySubtitle") : t("requirementSubtitle");
  const submitLabel =
    variant === "contact"
      ? t("sendMessage")
      : variant === "consultation"
        ? t("submitConsultationRequest")
        : t("requestPrivateAdvisory");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setFormError(null);
    setLoading(true);

    const payload = {
      name,
      email,
      phone,
      message,
      language: locale,
      company: company || undefined,
    };

    try {
      if (variant === "contact") {
        const res = await fetch("/api/forms/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw Object.assign(new Error(data.message ?? t("messageCouldNotBeSent")), { status: res.status, errors: data.errors });
      } else {
        const res = await fetch("/api/forms/consultation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            external_source:
              variant === "privateAdvisory"
                ? "Website Private Advisory"
                : "Website Consultation",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw Object.assign(new Error(data.message ?? t("messageCouldNotBeSent")), { status: res.status, errors: data.errors });
      }
      router.push(localizedHref(locale, "/thank-you"));
    } catch (error) {
      if (isApiError(error) && error.errors) {
        const mapped: Record<string, string> = {};
        for (const [field, messages] of Object.entries(error.errors)) {
          mapped[field] = messages[0] ?? t("invalidValue");
        }
        setErrors(mapped);
      } else if (isApiError(error)) {
        setFormError(error.message);
      } else {
        setFormError(t("formErrorGeneric"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-sapphire-50 p-6">
      <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-card)]">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <p className="text-overline font-semibold text-accent">{t("stepIndicator")}</p>
            <h2 className="mt-3 text-xl font-bold leading-[26px] text-brand">{title}</h2>
            <p className="mt-2 text-body-sm leading-[18px] text-ink-secondary">{subtitle}</p>
          </div>

          <input
            type="text"
            name="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />

          <TextInput
            label={t("fullName")}
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
            required
          />
          <TextInput
            label={t("emailAddress")}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
            required
          />
          <PhoneInput
            label={t("phoneNumber")}
            placeholder={t("phonePlaceholder")}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            error={errors.phone}
          />
          <Textarea
            label={t("yourMessage")}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            error={errors.message}
            required
          />
          <Checkbox label={t("consentUpdates")} />

          {formError ? (
            <p className="text-sm text-error" role="alert">
              {formError}
            </p>
          ) : null}

          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? tc("sending") : submitLabel}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function PropertyInquiryForm({
  propertyId,
  pageUrl,
}: {
  propertyId: number;
  pageUrl: string;
}) {
  const locale = useLocale().locale;
  const router = useRouter();
  const tForms = useTranslations("forms");
  const tCatalog = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/forms/property-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: propertyId,
          name,
          email,
          phone,
          message,
          page_url: pageUrl,
          form_id: "property-detail-form",
          external_source: "Property Page",
          company: company || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          const mapped: Record<string, string> = {};
          for (const [field, messages] of Object.entries(data.errors as Record<string, string[]>)) {
            mapped[field] = messages[0] ?? "Invalid value";
          }
          setErrors(mapped);
        }
        return;
      }
      router.push(localizedHref(locale, "/thank-you"));
    } catch (error) {
      if (isApiError(error) && error.errors) {
        const mapped: Record<string, string> = {};
        for (const [field, messages] of Object.entries(error.errors)) {
          mapped[field] = messages[0] ?? "Invalid value";
        }
        setErrors(mapped);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <input type="text" name="company" value={company} onChange={(e) => setCompany(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <TextInput label={tForms("name")} value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />
      <TextInput label={tForms("email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
      <PhoneInput
        label={tForms("phoneNumber")}
        placeholder={tForms("phonePlaceholder")}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
      />
      <Textarea label={tForms("message")} value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} />
      <Button type="submit" className="w-full justify-center" disabled={loading}>
        {loading ? tCommon("sending") : tCatalog("requestViewing")}
      </Button>
    </form>
  );
}

export type NewsletterFormLabels = {
  emailPlaceholder: string;
  subscribeLabel: string;
  subscriptionFailed: string;
  subscriptionSuccess: string;
};

export function NewsletterForm({ labels }: { labels: NewsletterFormLabels }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/forms/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.errors?.email?.[0] ?? data.message ?? labels.subscriptionFailed);
        return;
      }
      setSuccess(true);
      setEmail("");
    } catch (err) {
      if (isApiError(err)) {
        setError(getFieldError(err.errors, "email") ?? err.message);
      } else {
        setError(labels.subscriptionFailed);
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <p className="text-[12px] leading-4 text-basalt-300">{labels.subscriptionSuccess}</p>
    );
  }

  return (
    <form className="flex w-full max-w-[240px] flex-col gap-2" onSubmit={onSubmit}>
      <div className="flex w-full items-center justify-between overflow-hidden rounded-[var(--radius-field)] bg-sapphire-50 py-1 pl-3.5 pr-1 rtl:flex-row-reverse">
        <input
          aria-label={labels.emailPlaceholder}
          placeholder={labels.emailPlaceholder}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="min-w-0 flex-1 bg-transparent text-[12px] leading-4 text-ink outline-none placeholder:text-text-inactive rtl:text-right"
        />
        <button
          type="submit"
          aria-label={labels.subscribeLabel}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center rounded-[var(--radius-field)] bg-sapphire-600 px-1.5 py-[5px] text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>
      {error ? <span className="text-[11px] text-error">{error}</span> : null}
    </form>
  );
}
