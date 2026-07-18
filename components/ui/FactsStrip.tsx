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
          // Mobile / tablet: full-width 2-col grid (same width as gallery & other page boxes).
          // Desktop: single horizontal strip with dividers between facts.
          "mx-auto box-border grid w-full max-w-full grid-cols-2 overflow-hidden rounded-[var(--radius-card)] border border-border-default bg-white py-3",
          "lg:flex lg:flex-nowrap lg:items-center lg:py-[22px]",
          className,
        )}
      >
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className={cn(
              "flex w-full min-w-0 items-center justify-center",
              "lg:flex-1 lg:justify-start",
              // Balanced padding so both columns sit evenly inside the full-width card
              index % 2 === 0 ? "pl-4 pr-2 lg:px-0" : "pl-2 pr-4 lg:px-0",
            )}
          >
            {index > 0 ? (
              <div
                aria-hidden
                className="hidden h-9 w-px shrink-0 bg-border-default lg:block"
              />
            ) : null}
            {/* Figma 1525:28154 — icon 36px, gap 6px, label 11/14 inactive, value 15/22 semibold */}
            <div className="flex min-w-0 max-w-full items-center gap-1.5 py-2.5 lg:flex-1 lg:justify-center lg:px-4 lg:py-0">
              {variant === "property-detail" && isPropertyFactIconName(item.icon) ? (
                <PropertyFactIcon name={item.icon} className="h-9 w-9" />
              ) : (
                <Icon name={item.icon} className="h-9 w-9 shrink-0 text-sapphire-600" />
              )}
              {/* Figma 1525:28154 — 4px between label/value; trim + tight LH so 22px token LH doesn’t open a gap */}
              <div className="flex min-w-0 flex-col items-start justify-center gap-1 text-left">
                <p className="text-label-muted font-medium !leading-none text-text-inactive [text-box:trim-both_cap_alphabetic]">
                  {item.label}
                </p>
                <p className="truncate text-body-regular font-semibold !leading-none tracking-[-0.01em] text-brand [text-box:trim-both_cap_alphabetic]">
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
