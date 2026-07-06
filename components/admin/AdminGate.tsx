"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCanEditCms } from "@/components/cms/CmsAuthProvider";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { locale } = useLocale();
  const { canEdit, loading } = useCanEditCms();

  useEffect(() => {
    if (!loading && !canEdit) {
      router.replace(localizedHref(locale, "/admin/login"));
    }
  }, [canEdit, loading, locale, router]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-body-sm text-ink-secondary">
        Loading…
      </div>
    );
  }

  if (!canEdit) {
    return null;
  }

  return <>{children}</>;
}
