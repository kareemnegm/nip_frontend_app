import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import { isPropertyFactIconName, PropertyFactIcon } from "./PropertyFactIcon";

export type FactItem = {
  label: string;
  value: string;
  icon: IconName;
};

export type FactsStripProps = {
  items: FactItem[];
  variant?: "default" | "property" | "property-detail";
  className?: string;
};

export function FactsStrip({
  items,
  variant = "default",
  className,
}: FactsStripProps) {
  if (variant === "property" || variant === "property-detail") {
    return (
      <div
        className={cn(
          // Mobile: fixed 2-col grid so each row (Beds|Baths, Area|Type, …) stays aligned.
          // Desktop: single horizontal strip with dividers between facts.
          "grid w-full grid-cols-2 items-stretch overflow-hidden rounded-[var(--radius-card)] border border-border-default bg-white py-4 sm:flex sm:flex-nowrap sm:items-center sm:py-[22px]",
          className,
        )}
      >
        {items.map((item, index) => (
          <div
            key={`${item.label}-${item.value}`}
            className="flex min-w-0 items-center sm:flex-1"
          >
            {index > 0 ? (
              <div
                aria-hidden
                className="hidden h-9 w-px shrink-0 bg-border-default sm:block"
              />
            ) : null}
            <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-0">
              {variant === "property-detail" && isPropertyFactIconName(item.icon) ? (
                <PropertyFactIcon name={item.icon} />
              ) : (
                <Icon name={item.icon} className="h-9 w-9 shrink-0 text-sapphire-600" />
              )}
              <div className="min-w-0 text-left">
                <p
                  className={cn(
                    variant === "property-detail"
                      ? "text-label-muted font-medium text-basalt-300"
                      : "text-[11px] font-medium leading-[14px] text-text-inactive",
                  )}
                >
                  {item.label}
                </p>
                <p
                  className={cn(
                    "truncate",
                    variant === "property-detail"
                      ? "text-[15px] font-bold leading-[22px] tracking-[-0.15px] text-brand"
                      : "text-[15px] font-semibold leading-[22px] tracking-[-0.01em] text-brand",
                  )}
                >
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
