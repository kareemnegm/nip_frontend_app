"use client";

import { usePathname, useRouter } from "next/navigation";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref, toLocaleAgnosticPath } from "@/lib/i18n/helpers";
import { AdminGate } from "@/components/admin/AdminGate";

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

export function AdminSiteShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  const hubHref = localizedHref(locale, "/admin/site");
  const isHub =
    normalizePath(toLocaleAgnosticPath(pathname)) === normalizePath("/admin/site");

  return (
    <AdminGate>
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {isHub ? (
            <LocalizedLink
              href="/"
              className="text-body-sm font-medium text-brand hover:underline"
            >
              ← Back to website
            </LocalizedLink>
          ) : (
            <button
              type="button"
              onClick={() => router.push(hubHref)}
              className="text-body-sm font-medium text-brand hover:underline"
            >
              ← Site content
            </button>
          )}
        </div>
        <h1 className="font-display text-display-sm text-brand">{title}</h1>
        <div className="mt-8">{children}</div>
      </div>
    </AdminGate>
  );
}
