"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCanEditCms } from "./CmsAuthProvider";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref, stripLocaleFromPathname } from "@/lib/i18n/helpers";
import { normalizeBuilderPath } from "@/lib/page-builder/reserved-paths";
import type { BuilderPage } from "@/types/api/page-builder";

export function CmsStaffBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  const { canEdit, user, loading, refresh } = useCanEditCms();
  const [builderPage, setBuilderPage] = useState<BuilderPage | null>(null);

  const currentPath = normalizeBuilderPath(stripLocaleFromPathname(pathname ?? "/"));

  useEffect(() => {
    if (!canEdit || currentPath.startsWith("/admin")) {
      setBuilderPage(null);
      return;
    }

    let active = true;

    (async () => {
      try {
        const res = await fetch(`/api/pages/admin?locale=${locale}`, { cache: "no-store" });
        const data = (await res.json()) as { pages?: BuilderPage[] };
        if (!active || !res.ok) return;
        const match =
          (data.pages ?? []).find(
            (page) => normalizeBuilderPath(page.path) === currentPath,
          ) ?? null;
        setBuilderPage(match);
      } catch {
        if (active) setBuilderPage(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [canEdit, currentPath, locale]);

  if (loading || !canEdit) {
    return null;
  }

  async function signOut() {
    const response = await fetch("/api/cms/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    if (!response.ok) {
      return;
    }

    await refresh();
    router.refresh();
  }

  return (
    <div className="fixed bottom-4 end-4 z-50 flex flex-col items-end gap-2">
      <Link
        href={localizedHref(locale, "/admin/site")}
        className="max-w-[280px] rounded-[var(--radius-field)] border border-line bg-white px-4 py-2 text-end text-[11px] font-semibold text-brand shadow-[var(--shadow-card)] hover:bg-sapphire-50"
      >
        {builderPage ? (
          <span className="flex flex-col items-end gap-0.5">
            <span className="truncate">{builderPage.title}</span>
            <span>Manage SEO &amp; link labels</span>
          </span>
        ) : (
          "Manage SEO & link labels"
        )}
      </Link>
      <div className="flex items-center gap-3 rounded-[var(--radius-field)] border border-line bg-white px-4 py-2 shadow-[var(--shadow-card)]">
        <span className="text-[11px] font-medium text-ink-secondary">
          Editing as {user?.name ?? "Staff"}
        </span>
        <button
          type="button"
          onClick={() => void signOut()}
          className="text-[11px] font-semibold text-brand hover:underline"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
