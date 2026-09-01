import { Children, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Catalog listings — gap-x-8 (32px) / gap-y-10. */
export const centeredCatalogCardGridClassName =
  "flex flex-wrap justify-center gap-x-8 gap-y-10";

/** Standard section grids — uniform gap-6 (24px). */
export const centeredSectionCardGridClassName =
  "flex flex-wrap justify-center gap-6";

/** Three-up row at xl inside the page inner width (~1280px). */
export const centeredCatalogCardItemClassName =
  "w-full min-w-0 sm:w-[calc((100%-2rem)/2)] xl:w-[calc((100%-4rem)/3)]";

/** Three-up row with gap-6 at all breakpoints. */
export const centeredSectionCardItemClassName =
  "w-full min-w-0 sm:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-3rem)/3)]";

export type CenteredCardGridGap = "catalog" | "section";

export type CenteredCardGridProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  /** `catalog` = property/off-plan listings; `section` = areas, communities, etc. */
  gap?: CenteredCardGridGap;
  /** Stagger horizontal card entrance across the row. */
  stagger?: boolean;
};

/**
 * Flex grid that centers incomplete rows — 1 card centered, 2 cards centered,
 * last row of 4→3 reflow stays balanced (4th moves up, lone remainder centered).
 */
export function CenteredCardGrid({
  children,
  className,
  itemClassName,
  gap = "catalog",
  stagger = true,
}: CenteredCardGridProps) {
  const gridClassName =
    gap === "catalog"
      ? centeredCatalogCardGridClassName
      : centeredSectionCardGridClassName;
  const defaultItemClassName =
    gap === "catalog"
      ? centeredCatalogCardItemClassName
      : centeredSectionCardItemClassName;

  return (
    <div
      className={cn(gridClassName, className)}
      {...(stagger ? { "data-reveal-stagger": "" } : {})}
    >
      {Children.map(children, (child, index) => {
        if (child == null || !isValidElement(child)) return null;
        return (
          <div
            key={child.key ?? index}
            data-reveal={stagger ? "slide-x" : undefined}
            className={cn(
              defaultItemClassName,
              itemClassName,
              "[&>*]:h-full [&>*]:w-full",
            )}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
