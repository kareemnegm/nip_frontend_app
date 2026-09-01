import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { AreaFactIcon, isAreaFactIconName } from "./AreaFactIcon";
import type { AreaFactIconName } from "./area-fact-icon-registry";
import { Icon, type IconName } from "./Icon";
import { isPropertyFactIconName, PropertyFactIcon } from "./PropertyFactIcon";

export type FactItem = {
  label: string;
  value: string;
  icon: IconName;
  /** Area detail strip — 36×36 icon with matched stroke weight */
  areaFactIcon?: AreaFactIconName;
};

export type FactsStripProps = {
  items: FactItem[];
  variant?: "default" | "property" | "property-detail" | "rental-detail" | "area";
  className?: string;
};

function FactCell({
  item,
  iconVariant,
}: {
  item: FactItem;
  iconVariant: "property-detail" | "rental-detail" | "generic";
}) {
  const icon =
    iconVariant === "property-detail" && isPropertyFactIconName(item.icon) ? (
      <PropertyFactIcon name={item.icon} className="h-9 w-9 shrink-0" />
    ) : iconVariant === "rental-detail" && isPropertyFactIconName(item.icon) ? (
      <PropertyFactIcon name={item.icon} className="h-9 w-9 shrink-0" />
    ) : (
      <Icon name={item.icon} className="h-9 w-9 shrink-0 text-sapphire-600" />
    );

  return (
    <>
      {icon}
      <div className="nip-facts-strip-stack min-w-0 flex-1">
        <p className="nip-facts-strip-stack__label text-label-muted font-medium text-text-inactive">
          {item.label}
        </p>
        <p
          className={cn(
            "nip-facts-strip-stack__value text-body-regular font-semibold tracking-[-0.01em] text-brand",
            iconVariant === "rental-detail" ? "truncate" : "break-words",
          )}
          title={iconVariant === "rental-detail" ? item.value : undefined}
        >
          {item.value}
        </p>
      </div>
    </>
  );
}

export function FactsStrip({
  items,
  variant = "default",
  className,
}: FactsStripProps) {
  if (variant === "rental-detail") {
    return (
      <div
        className={cn(
          "mx-auto grid w-full grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-border-default bg-border-default",
          "sm:grid-cols-3 lg:grid-cols-4",
          className,
        )}
      >
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex min-h-[72px] items-center gap-1.5 bg-white px-4 py-3 lg:min-h-[80px] lg:px-5 lg:py-[22px]"
          >
            <FactCell item={item} iconVariant="rental-detail" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "property" || variant === "property-detail" || variant === "area") {
    return (
      <div
        className={cn(
          // Mobile / tablet: 2-col grid. Desktop: Figma 1525:28154 — 1080×80, py 22px, equal cells.
          "mx-auto box-border grid w-full max-w-full grid-cols-2 overflow-hidden rounded-[var(--radius-card)] border border-border-default bg-white py-3",
          "lg:flex lg:flex-nowrap lg:items-center lg:overflow-visible lg:py-[22px]",
          className,
        )}
      >
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? (
              <div
                aria-hidden
                className="hidden h-9 w-px shrink-0 self-center bg-border-default lg:block"
              />
            ) : null}
            <div
              className={cn(
                // Mobile: left-align so icons/text line up down each column
                // (justify-center shifts short vs long labels left/right).
                // Desktop keeps centered cells to match Figma.
                "flex min-w-0 items-center justify-start gap-1.5 py-2.5",
                "lg:flex-1 lg:justify-center lg:py-0",
                index % 2 === 0 ? "pl-4 pr-2 lg:px-0" : "pl-2 pr-4 lg:px-0",
              )}
            >
              {variant === "area" && item.areaFactIcon && isAreaFactIconName(item.areaFactIcon) ? (
                <AreaFactIcon name={item.areaFactIcon} className="h-9 w-9 shrink-0" />
              ) : variant === "property-detail" && isPropertyFactIconName(item.icon) ? (
                <PropertyFactIcon name={item.icon} className="h-9 w-9 shrink-0" />
              ) : (
                <Icon name={item.icon} className="h-9 w-9 shrink-0 text-sapphire-600" />
              )}
              {/* Figma: gap 4px; label 11/14 inactive; value 15/22 brand + text-box trim */}
              <div className="nip-facts-strip-stack min-w-0">
                <p className="nip-facts-strip-stack__label text-label-muted font-medium text-text-inactive">
                  {item.label}
                </p>
                <p className="nip-facts-strip-stack__value break-words text-body-regular font-semibold tracking-[-0.01em] text-brand">
                  {item.value}
                </p>
              </div>
            </div>
          </Fragment>
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
            {/* Wraps instead of truncating — a long value is better on two
                lines than silently cut off with an ellipsis. */}
            <p className="break-words text-sm font-bold text-ink">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
