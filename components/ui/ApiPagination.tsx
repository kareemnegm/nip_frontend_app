"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type ApiPaginationProps = {
  currentPage: number;
  lastPage: number;
  basePath: string;
  query?: Record<string, string | undefined>;
  className?: string;
};

function buildHref(
  basePath: string,
  page: number,
  query?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function ApiPagination({
  currentPage,
  lastPage,
  basePath,
  query,
  className,
}: ApiPaginationProps) {
  const t = useTranslations("catalog");

  if (lastPage <= 1) return null;

  const cellClasses =
    "inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-[var(--radius-field)] border border-border-default bg-white px-3.5 py-2 text-body-sm font-medium text-ink-secondary transition-colors hover:border-brand hover:text-brand";

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav
      aria-label={t("pagination")}
      className={cn("flex items-center gap-2 pt-4", className)}
    >
      {currentPage > 1 ? (
        <Link
          href={buildHref(basePath, currentPage - 1, query)}
          aria-label={t("previousPage")}
          className={cellClasses}
        >
          <Icon name="chevronDown" className="h-3 w-3 rotate-90 rtl:-rotate-90" />
        </Link>
      ) : (
        <span className={cn(cellClasses, "pointer-events-none opacity-40")}>
          <Icon name="chevronDown" className="h-3 w-3 rotate-90 rtl:-rotate-90" />
        </span>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(basePath, page, query)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            cellClasses,
            page === currentPage &&
              "border-brand bg-brand text-white hover:border-brand hover:text-white",
          )}
        >
          {page}
        </Link>
      ))}

      {currentPage < lastPage ? (
        <Link
          href={buildHref(basePath, currentPage + 1, query)}
          aria-label={t("nextPage")}
          className={cellClasses}
        >
          <Icon name="chevronDown" className="h-3 w-3 -rotate-90 rtl:rotate-90" />
        </Link>
      ) : (
        <span className={cn(cellClasses, "pointer-events-none opacity-40")}>
          <Icon name="chevronDown" className="h-3 w-3 -rotate-90 rtl:rotate-90" />
        </span>
      )}
    </nav>
  );
}

export function CatalogEmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-[var(--radius-card)] border border-dashed border-line bg-sapphire-50 px-6 py-12 text-center text-body-sm text-ink-secondary">
      {message}
    </p>
  );
}
