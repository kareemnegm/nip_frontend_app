"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/FormControls";
import { localizedHref } from "@/lib/i18n/helpers";
import type { Locale } from "@/lib/i18n/config";
import Link from "next/link";

export function PrivateOfficeLoginForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = useTranslations("forms");
  const tCommon = useTranslations("common");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? t("signInFailed"));
        return;
      }
      router.push(localizedHref(locale, "/private-office/member"));
      router.refresh();
    } catch {
      setError(t("signInFailedRetry"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <TextInput
          label={t("email")}
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextInput
          label={t("password")}
          type="password"
          placeholder={t("passwordPlaceholder")}
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
            {loading ? tCommon("signingIn") : tCommon("signIn")}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-brand">
        <Link href={localizedHref(locale, "/contact")} className="hover:underline">
          {t("requestAccess")}
        </Link>
        <span className="mx-2 text-ink-tertiary">|</span>
        <Link href={localizedHref(locale, "/contact")} className="hover:underline">
          {t("forgotPassword")}
        </Link>
      </p>
    </>
  );
}
