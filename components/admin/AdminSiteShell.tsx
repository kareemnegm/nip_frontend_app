"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref, toLocaleAgnosticPath } from "@/lib/i18n/helpers";
import { AdminGate } from "@/components/admin/AdminGate";

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

export type AdminBreadcrumb = {
  label: string;
  /** Locale-agnostic href, e.g. "/admin/site". Omit for the current page. */
  href?: string;
};

type AdminSiteShellProps = {
  title: string;
  children: React.ReactNode;
  /** Trail shown above the title. Falls back to a single "Site content" link. */
  breadcrumbs?: AdminBreadcrumb[];
  /** Small line under the title — path, status, saved state. */
  titleMeta?: React.ReactNode;
  /** Buttons aligned with the title. */
  actions?: React.ReactNode;
  /** "wide" gives the page builder room for its preview pane. */
  width?: "default" | "wide";
  /** Keeps the title row and actions in view while scrolling long lists. */
  stickyHeader?: boolean;
};

export function AdminSiteShell({
  title,
  children,
  breadcrumbs,
  titleMeta,
  actions,
  width = "default",
  stickyHeader = false,
}: AdminSiteShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  const hubHref = localizedHref(locale, "/admin/site");
  const isHub =
    normalizePath(toLocaleAgnosticPath(pathname)) === normalizePath("/admin/site");

  return (
    <AdminGate>
      <div
        className={cn(
          "mx-auto w-full px-5 pb-16 pt-6 sm:px-8",
          width === "wide" ? "max-w-[1560px]" : "max-w-5xl",
        )}
      >
        <div
          className={cn(
            stickyHeader &&
              "sticky top-0 z-30 -mx-5 border-b border-line bg-background/95 px-5 pb-4 pt-4 backdrop-blur sm:-mx-8 sm:px-8",
          )}
        >
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              breadcrumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                  {index > 0 ? (
                    <Icon name="chevronDown" className="h-3 w-3 -rotate-90 text-text-inactive" />
                  ) : null}
                  {crumb.href ? (
                    <Link
                      href={localizedHref(locale, crumb.href)}
                      className="text-body-xs font-medium text-brand transition-colors hover:text-accent"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-body-xs text-ink-tertiary">{crumb.label}</span>
                  )}
                </span>
              ))
            ) : isHub ? (
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
          </nav>

          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-display-sm text-brand">{title}</h1>
              {titleMeta ? <div className="mt-2">{titleMeta}</div> : null}
            </div>
            {actions ? (
              <div className="flex flex-wrap items-center gap-2">{actions}</div>
            ) : null}
          </div>
        </div>

        <div className={stickyHeader ? "mt-6" : "mt-8"}>{children}</div>
      </div>
    </AdminGate>
  );
}
