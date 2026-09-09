"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";

type MemberSignOutButtonProps = {
  className?: string;
  redirectTo?: string;
};

export function MemberSignOutButton({
  className,
  redirectTo = "/private-office",
}: MemberSignOutButtonProps) {
  const { locale } = useLocale();
  const t = useTranslations("common");
  const [loading, setLoading] = useState(false);

  async function onSignOut() {
    setLoading(true);
    try {
      await fetch("/api/member/logout", { method: "POST" });
    } finally {
      window.location.assign(localizedHref(locale, redirectTo));
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      disabled={loading}
      onClick={onSignOut}
    >
      {loading ? t("signingOut") : t("signOut")}
    </Button>
  );
}
