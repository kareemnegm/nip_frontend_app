import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type GenericSearchBarProps = {
  className?: string;
  placeholder?: string;
  submitLabel?: string;
};

export function GenericSearchBar({
  className,
  placeholder = "Search properties, areas or projects",
  submitLabel = "Search",
}: GenericSearchBarProps) {
  return (
    <form
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] bg-surface-muted p-4",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-2 rounded-[var(--radius-field)] bg-white p-2 sm:flex-row sm:items-stretch">
        <input
          type="search"
          aria-label={placeholder}
          placeholder={placeholder}
          className="h-11 min-w-0 flex-1 rounded-[var(--radius-field)] border border-line bg-white px-4 text-sm text-ink outline-none placeholder:text-text-inactive focus:border-brand focus:ring-2 focus:ring-sapphire-100 rtl:text-right"
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-field)] bg-sapphire-600 px-6 text-xs font-semibold text-white transition-colors hover:bg-brand-hover active:bg-brand-pressed"
        >
          {submitLabel}
          <Icon name="arrowRight" className="h-4 w-4 shrink-0 rtl:rotate-180" />
        </button>
      </div>
    </form>
  );
}
