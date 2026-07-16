"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { scrollPageToTop } from "@/lib/navigation/scroll-to-top";

type MemberSignOutButtonProps = {
  className?: string;
  redirectTo?: string;
};

export function MemberSignOutButton({
  className,
  redirectTo = "/private-office",
}: MemberSignOutButtonProps) {
  const router = useRouter();
  const t = useTranslations("common");
  const [loading, setLoading] = useState(false);

  async function onSignOut() {
    setLoading(true);
    try {
      await fetch("/api/member/logout", { method: "POST" });
    } finally {
      scrollPageToTop();
      router.push(redirectTo, { scroll: true });
      router.refresh();
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
