"use client";

import { Children, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import {
  buildPageItems,
  paginationActiveClasses,
  paginationCellClasses,
} from "./ApiPagination";
import { Icon } from "./Icon";

type PaginatedCardsProps = {
  children: ReactNode;
  /** Cards per page — defaults to one grid row. */
  perPage?: number;
  className?: string;
  gridClassName?: string;
};

/**
 * Pages through cards in place, using the same numbered control as the catalog
 * listings (`ApiPagination`) so both read identically. Unlike that one this
 * keeps the whole set client-side and swaps pages without a navigation, so the
 * page does not jump or refetch — the items were already loaded with the page.
 */
export function PaginatedCards({
  children,
  perPage = 3,
  className,
  gridClassName = "grid gap-6 sm:grid-cols-2 xl:grid-cols-3",
}: PaginatedCardsProps) {
  const t = useTranslations("catalog");
  const items = Children.toArray(children);
  const lastPage = Math.max(1, Math.ceil(items.length / perPage));
  const [requestedPage, setRequestedPage] = useState(1);

  // Clamp during render rather than in an effect: if the item count shrinks
  // (locale switch, filter) while a later page is selected, this shows a valid
  // page immediately instead of flashing an empty one first.
  const currentPage = Math.min(requestedPage, lastPage);

  const start = (currentPage - 1) * perPage;
  const visible = items.slice(start, start + perPage);
  const pageItems = buildPageItems(currentPage, lastPage);

  return (
    <div className={className}>
      <div className={gridClassName}>{visible}</div>

      {lastPage > 1 ? (
        <nav
          aria-label={t("pagination")}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setRequestedPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            aria-label={t("previousPage")}
            className={cn(
              paginationCellClasses,
              currentPage === 1 && "pointer-events-none opacity-40",
            )}
          >
            <Icon name="chevronDown" className="h-3 w-3 rotate-90 rtl:-rotate-90" />
          </button>

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
              <button
                key={item}
                type="button"
                onClick={() => setRequestedPage(item)}
                aria-current={item === currentPage ? "page" : undefined}
                className={cn(
                  paginationCellClasses,
                  item === currentPage && paginationActiveClasses,
                )}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => setRequestedPage((page) => Math.min(lastPage, page + 1))}
            disabled={currentPage === lastPage}
            aria-label={t("nextPage")}
            className={cn(
              paginationCellClasses,
              currentPage === lastPage && "pointer-events-none opacity-40",
            )}
          >
            <Icon name="chevronDown" className="h-3 w-3 -rotate-90 rtl:rotate-90" />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
