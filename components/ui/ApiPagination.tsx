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

/** Beyond this many pages the list is windowed with ellipses. */
const MAX_INLINE_PAGES = 7;

type PageItem = number | "ellipsis";

/**
 * Always renders the first and last page so the total is visible at a glance —
 * a plain sliding window hid the last page until you were nearly on it.
 * Short lists (≤ 7) render in full; longer ones keep a 3-wide window around the
 * current page, nudged inward at the edges so the row keeps a stable width.
 */
function buildPageItems(currentPage: number, lastPage: number): PageItem[] {
  if (lastPage <= MAX_INLINE_PAGES) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  let start = Math.max(2, currentPage - 1);
  let end = Math.min(lastPage - 1, currentPage + 1);

  if (currentPage <= 3) {
    start = 2;
    end = 4;
  } else if (currentPage >= lastPage - 2) {
    start = lastPage - 3;
    end = lastPage - 1;
  }

  const items: PageItem[] = [1];
  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page++) items.push(page);
  if (end < lastPage - 1) items.push("ellipsis");
  items.push(lastPage);

  return items;
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

  const pageItems = buildPageItems(currentPage, lastPage);

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

      {pageItems.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden
            className="inline-flex min-h-[34px] min-w-[20px] items-center justify-center text-body-sm text-ink-tertiary"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref(basePath, item, query)}
            aria-current={item === currentPage ? "page" : undefined}
            className={cn(
              cellClasses,
              item === currentPage &&
                "border-brand bg-brand text-white hover:border-brand hover:text-white",
            )}
          >
            {item}
          </Link>
        ),
      )}

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
