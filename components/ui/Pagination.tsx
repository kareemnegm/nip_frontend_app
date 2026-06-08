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
    "inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius-field)] border border-line px-3 text-sm text-ink-secondary transition-colors hover:border-brand hover:text-brand";

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <button type="button" aria-label="Previous page" className={cellClasses}>
        <Icon name="chevronDown" className="h-4 w-4 rotate-90" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === current ? "page" : undefined}
          className={cn(
            cellClasses,
            page === current && "border-brand bg-brand text-white hover:text-white",
          )}
        >
          {page}
        </button>
      ))}
      <span className="px-1 text-sm text-ink-tertiary">…</span>
      <button type="button" className={cellClasses}>
        {total}
      </button>
      <button type="button" aria-label="Next page" className={cellClasses}>
        <Icon name="chevronDown" className="h-4 w-4 -rotate-90" />
      </button>
    </nav>
  );
}
