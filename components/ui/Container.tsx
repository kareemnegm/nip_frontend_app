import { cn } from "@/lib/cn";
import { siteContentClassName } from "./SiteChrome";

export type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Do NOT pass a narrower `max-w-[...]` in `className` to shrink this below
 * the page width. `siteContentClassName` bundles max-w-[1440px] together
 * with the responsive gutter (px-5 sm:px-8 lg:px-20) — overriding max-w
 * alone still leaves the gutter padding active, silently squeezing the
 * real content width (max-w minus gutter), which can wrap headings on
 * some browsers/fonts even though it looks fine in others. For a smaller
 * centered block, use a plain `mx-auto max-w-[...] px-6` div instead of
 * Container. See `.cursor/design-system/page-workflow.md`.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn(siteContentClassName, className)}>{children}</div>
  );
}
