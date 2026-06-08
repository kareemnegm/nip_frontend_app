import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

export type FactItem = {
  label: string;
  value: string;
  icon: IconName;
};

export type FactsStripProps = {
  items: FactItem[];
  className?: string;
};

export function FactsStrip({ items, className }: FactsStripProps) {
  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-[var(--radius-field)] border border-line bg-white sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item, index) => (
        <div
          key={`${item.label}-${item.value}`}
          className={cn(
            "flex items-center gap-3 px-5 py-4 text-brand",
            index > 0 && "border-t border-line sm:border-t-0 sm:border-l",
          )}
        >
          <Icon name={item.icon} className="h-6 w-6" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-ink-tertiary">
              {item.label}
            </p>
            <p className="truncate text-sm font-bold text-ink">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
