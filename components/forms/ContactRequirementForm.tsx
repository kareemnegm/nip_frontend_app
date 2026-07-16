"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox, PhoneInput, Select, Textarea, TextInput } from "@/components/ui/FormControls";
import { isApiError } from "@/lib/api/errors";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";

/** Figma "04 Label/Small" (11/14/500) — compact field labels: Name, Phone number, Email address, Message. */
const compactLabelClassName = "text-label-muted font-medium text-ink";
/** Figma "04 Label/Default" (13/18/500) — two-column select labels: Preferred language, Lead type, Budget range, Timeline. */
const defaultLabelClassName = "text-label font-medium text-ink";
/**
 * Figma select fields sit on a slightly lighter border than the free-text fields.
 * No text color override here — `Select` already darkens to `text-ink` once a
 * real value is picked and keeps `text-text-inactive` for the placeholder, so a
 * chosen option reads visibly darker than an unset one.
 */
const selectFieldClassName = "border-sapphire-200";

/**
 * Figma "T14 · Speak with NIP" contact form (`1525:27475`).
 * Richer than the generic `InquiryForm`: adds preferred language, lead type,
 * budget range and timeline selects. Submits via the consultation lead path.
 */
export function ContactRequirementForm() {
  const locale = useLocale().locale;
  const router = useRouter();
  const t = useTranslations("forms");
  const tc = useTranslations("common");

  const leadTypeOptions = [
    { label: t("leadTypeOptions.placeholder"), value: "" },
    { label: t("leadTypeOptions.buying"), value: "buying" },
    { label: t("leadTypeOptions.investing"), value: "investing" },
    { label: t("leadTypeOptions.renting"), value: "renting" },
    { label: t("leadTypeOptions.other"), value: "other" },
  ];

  const budgetRangeOptions = [
    { label: t("budgetRangeOptions.placeholder"), value: "" },
    { label: t("budgetRangeOptions.under2m"), value: "under-2m" },
    { label: t("budgetRangeOptions.between2And5m"), value: "2-5m" },
    { label: t("budgetRangeOptions.between5And10m"), value: "5-10m" },
    { label: t("budgetRangeOptions.tenPlus"), value: "10-plus" },
  ];

  const timelineOptions = [
    { label: t("timelineOptions.placeholder"), value: "" },
    { label: t("timelineOptions.immediate"), value: "immediate" },
    { label: t("timelineOptions.oneToThreeMonths"), value: "1-3-months" },
    { label: t("timelineOptions.threeToSixMonths"), value: "3-6-months" },
    { label: t("timelineOptions.sixToTwelveMonths"), value: "6-12-months" },
    { label: t("timelineOptions.exploring"), value: "exploring" },
  ];

  const preferredLanguageOptions = [
    { label: t("preferredLanguageOptions.english"), value: "en" },
    { label: t("preferredLanguageOptions.arabic"), value: "ar" },
    { label: t("preferredLanguageOptions.russian"), value: "ru" },
    { label: t("preferredLanguageOptions.chinese"), value: "zh" },
    { label: t("preferredLanguageOptions.french"), value: "fr" },
  ];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState(preferredLanguageOptions[0].value);
  const [leadType, setLeadType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      preferred_language: preferredLanguage,
      lead_type: leadType || undefined,
      budget_range: budgetRange || undefined,
      timeline: timeline || undefined,
      external_source: "Website Contact",
      company: company || undefined,
    };

    try {
      const res = await fetch("/api/forms/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw Object.assign(new Error(data.message ?? t("messageCouldNotBeSent")), {
          status: res.status,
          errors: data.errors,
        });
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
    <div className="flex w-full flex-col gap-[18px] rounded-[var(--radius-card)] border border-border-default bg-white p-10 lg:max-w-[540px]">
      <div className="flex flex-col gap-1.5">
        <p className="text-overline font-semibold uppercase text-accent">{t("stepIndicator")}</p>
        <h2 className="text-heading-h2 font-bold text-ink">{t("requirementTitle")}</h2>
        <p className="text-body-sm text-ink">{t("requirementSubtitle")}</p>
      </div>

      <form className="flex flex-col items-start gap-[18px]" onSubmit={onSubmit}>
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
          label={t("name")}
          labelClassName={compactLabelClassName}
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          required
        />

        <PhoneInput
          label={t("phoneNumber")}
          labelClassName={compactLabelClassName}
          placeholder={t("phonePlaceholder")}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={errors.phone}
        />

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label={t("preferredLanguage")}
            labelClassName={defaultLabelClassName}
            className={selectFieldClassName}
            options={preferredLanguageOptions}
            value={preferredLanguage}
            onChange={(event) => setPreferredLanguage(event.target.value)}
          />
          <Select
            label={t("leadType")}
            labelClassName={defaultLabelClassName}
            className={selectFieldClassName}
            options={leadTypeOptions}
            value={leadType}
            onChange={(event) => setLeadType(event.target.value)}
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label={t("budgetRange")}
            labelClassName={defaultLabelClassName}
            className={selectFieldClassName}
            options={budgetRangeOptions}
            value={budgetRange}
            onChange={(event) => setBudgetRange(event.target.value)}
          />
          <Select
            label={t("timeline")}
            labelClassName={defaultLabelClassName}
            className={selectFieldClassName}
            options={timelineOptions}
            value={timeline}
            onChange={(event) => setTimeline(event.target.value)}
          />
        </div>

        <TextInput
          label={t("emailAddress")}
          labelClassName={compactLabelClassName}
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          required
        />

        <Textarea
          label={t("message")}
          labelClassName="text-label-muted font-medium text-ink-secondary"
          placeholder={t("requirementMessagePlaceholder")}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          error={errors.message}
          required
        />

        <Checkbox
          label={t("consentUpdates")}
          labelClassName="max-w-[420px] text-body-xs text-ink-tertiary"
          className="size-[18px] rounded-[3px] border-border-default"
        />

        {formError ? (
          <p className="text-body-xs text-error" role="alert">
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={loading}>
          {loading ? tc("sending") : t("submitConsultationRequest")}
        </Button>

        <p className="text-body-xs text-text-inactive">{t("consultationHelper")}</p>
      </form>
    </div>
  );
}
