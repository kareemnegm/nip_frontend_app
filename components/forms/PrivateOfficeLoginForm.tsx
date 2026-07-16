"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/FormControls";
import { AppLink as Link } from "@/components/AppLink";
import { localizedHref } from "@/lib/i18n/helpers";
import type { Locale } from "@/lib/i18n/config";
import { scrollPageToTop } from "@/lib/navigation/scroll-to-top";

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
      scrollPageToTop();
      router.push(localizedHref(locale, "/private-office/member"), { scroll: true });
      router.refresh();
    } catch {
      setError(t("signInFailedRetry"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
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
          <p className="text-body-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex justify-center">
          <Button type="submit" disabled={loading}>
            {loading ? tCommon("signingIn") : tCommon("signIn")}
          </Button>
        </div>
      </form>

      <p className="text-center text-label-muted font-medium text-accent">
        <Link href={localizedHref(locale, "/contact")} className="hover:underline">
          {t("requestAccess")}
        </Link>
        <span className="mx-2">|</span>
        <Link href={localizedHref(locale, "/contact")} className="hover:underline">
          {t("forgotPassword")}
        </Link>
      </p>
    </div>
  );
}
