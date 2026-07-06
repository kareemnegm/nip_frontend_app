"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";
import { AdminGate } from "@/components/admin/AdminGate";

export function AdminSiteShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { locale } = useLocale();
  const hubHref = localizedHref(locale, "/admin/site");

  return (
    <AdminGate>
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Link
            href={hubHref}
            className="text-body-sm font-medium text-brand hover:underline"
          >
            ← Site content
          </Link>
        </div>
        <h1 className="font-display text-display-sm text-brand">{title}</h1>
        <div className="mt-8">{children}</div>
      </div>
    </AdminGate>
  );
}
