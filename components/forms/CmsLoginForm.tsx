"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import { useCanEditCms } from "@/components/cms/CmsAuthProvider";
import { Button } from "@/components/ui/Button";
import { Icon, Logo } from "@/components/ui";
import { TextInput } from "@/components/ui/FormControls";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";

function CmsLoginFormInner({ locale }: { locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useCanEditCms();
  const t = useTranslations("cms");
  const tf = useTranslations("forms");
  const tc = useTranslations("common");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { message?: string; canEdit?: boolean };
      if (!res.ok) {
        setError(data.message ?? tf("signInFailed"));
        return;
      }
      if (data.canEdit === false) {
        setError(t("cannotEditCms"));
        return;
      }
      await refresh();
      const returnUrl = searchParams.get("returnUrl");
      router.push(returnUrl ? decodeURIComponent(returnUrl) : localizedHref(locale, "/"));
      router.refresh();
    } catch {
      setError(tf("signInFailedRetry"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={onSubmit}>
      <TextInput
        label={tf("email")}
        type="email"
        placeholder={t("emailPlaceholder")}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <TextInput
        label={tf("password")}
        type="password"
        placeholder={tf("passwordPlaceholder")}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error ? (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex justify-center pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? tc("signingIn") : tc("signIn")}
        </Button>
      </div>
    </form>
  );
}

export function CmsLoginForm({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={null}>
      <CmsLoginFormInner locale={locale} />
    </Suspense>
  );
}

export function CmsLoginCard({ locale }: { locale: Locale }) {
  const t = useTranslations("cms");

  return (
    <div className="w-full max-w-md rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-card)] sm:p-10">
      <div className="flex w-full items-center justify-between">
        <Logo />
        <span className="text-end text-[10px] font-semibold uppercase leading-tight tracking-wide text-ink-tertiary">
          {t("contentEditorLine1")}
          <br />
          {t("contentEditorLine2")}
        </span>
      </div>

      <div className="mt-8 text-center">
        <span className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand text-white">
          <Icon name="lock" className="h-9 w-9" />
        </span>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
          {t("staffAccess")}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand">
          {t("loginTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-ink-secondary">
          {t("loginDescription")}
        </p>
      </div>

      <CmsLoginForm locale={locale} />
    </div>
  );
}
