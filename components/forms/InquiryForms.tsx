"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox, PhoneInput, Textarea, TextInput } from "@/components/ui/FormControls";
import { getFieldError, isApiError } from "@/lib/api/errors";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";

type InquiryFormProps = {
  variant: "contact" | "consultation";
  title: string;
  subtitle: string;
  submitLabel: string;
};

export function InquiryForm({
  variant,
  title,
  subtitle,
  submitLabel,
}: InquiryFormProps) {
  const locale = useLocale().locale;
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
        if (!res.ok) throw Object.assign(new Error(data.message ?? "Failed"), { status: res.status, errors: data.errors });
      } else {
        const res = await fetch("/api/forms/consultation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            external_source: "Website Consultation",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw Object.assign(new Error(data.message ?? "Failed"), { status: res.status, errors: data.errors });
      }
      router.push(localizedHref(locale, "/thank-you"));
    } catch (error) {
      if (isApiError(error) && error.errors) {
        const mapped: Record<string, string> = {};
        for (const [field, messages] of Object.entries(error.errors)) {
          mapped[field] = messages[0] ?? "Invalid value";
        }
        setErrors(mapped);
      } else if (isApiError(error)) {
        setFormError(error.message);
      } else {
        setFormError("Something went wrong. Please try again.");
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
            <p className="text-overline font-semibold text-accent">Step 1 of 2</p>
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
            label="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
            required
          />
          <TextInput
            label="E-mail Address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
            required
          />
          <PhoneInput
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            error={errors.phone}
          />
          <Textarea
            label="Your Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            error={errors.message}
            required
          />
          <Checkbox label="I agree to receive curated updates from Novel Insight Property." />

          {formError ? (
            <p className="text-sm text-error" role="alert">
              {formError}
            </p>
          ) : null}

          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? "Sending…" : submitLabel}
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
      <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />
      <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
      <PhoneInput value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
      <Textarea label="Message" value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} />
      <Button type="submit" className="w-full justify-center" disabled={loading}>
        {loading ? "Sending…" : "Request Viewing"}
      </Button>
    </form>
  );
}

export function NewsletterForm() {
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
        setError(data.errors?.email?.[0] ?? data.message ?? "Subscription failed.");
        return;
      }
      setSuccess(true);
      setEmail("");
    } catch (err) {
      if (isApiError(err)) {
        setError(getFieldError(err.errors, "email") ?? err.message);
      } else {
        setError("Subscription failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <p className="text-[12px] leading-4 text-basalt-300">Thank you for subscribing.</p>
    );
  }

  return (
    <form className="flex w-full max-w-[240px] flex-col gap-2" onSubmit={onSubmit}>
      <div className="flex w-full items-center justify-between overflow-hidden rounded-[var(--radius-field)] bg-sapphire-50 py-1 pl-3.5 pr-1 rtl:flex-row-reverse">
        <input
          aria-label="Your email"
          placeholder="Your email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="min-w-0 flex-1 bg-transparent text-[12px] leading-4 text-ink outline-none placeholder:text-text-inactive rtl:text-right"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center rounded-[var(--radius-field)] bg-sapphire-600 px-1.5 py-[5px] text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          →
        </button>
      </div>
      {error ? <span className="text-[11px] text-error">{error}</span> : null}
    </form>
  );
}
