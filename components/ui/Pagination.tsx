import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type PaginationProps = {
  current?: number;
  pages?: number[];
  total?: number;
  className?: string;
};

export function Pagination({
  current = 1,
  pages = [1, 2, 3],
  total = 11,
  className,
}: PaginationProps) {
  const cellClasses =
    "inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-[var(--radius-field)] border border-border-default bg-white px-3.5 py-2 text-body-sm font-medium text-ink-secondary transition-colors hover:border-brand hover:text-brand";

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-2 pt-4", className)}
    >
      <button type="button" aria-label="Previous page" className={cellClasses}>
        <Icon name="chevronDown" className="h-3 w-3 rotate-90" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === current ? "page" : undefined}
          className={cn(
            cellClasses,
            page === current &&
              "border-brand bg-brand text-white hover:border-brand hover:text-white",
          )}
        >
          {page}
        </button>
      ))}
      <button type="button" className={cellClasses} aria-label="More pages">
        ...
      </button>
      <button type="button" className={cellClasses}>
        {total}
      </button>
      <button type="button" aria-label="Next page" className={cellClasses}>
        <Icon name="chevronDown" className="h-3 w-3 -rotate-90" />
      </button>
    </nav>
  );
}
