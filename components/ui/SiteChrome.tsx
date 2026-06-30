import { cn } from "@/lib/cn";

/** Figma desktop artboard width (T02 · Home and shared chrome). */
export const siteMaxWidth = "max-w-[1440px]";

/** Horizontal padding — Figma px-[80px] on header, footer, and most sections. */
export const siteGutterX = "px-5 sm:px-8 lg:px-20";

/** Home hero frame — Figma 1525:28266: flex col, items-start, gap 36px, padding 200px 180px */
export const siteHeroLayoutClassName = cn(
  "relative mx-auto flex w-full max-w-[1440px] flex-col items-start gap-9 self-stretch",
  "px-5 py-16 sm:px-8 sm:py-24",
  "lg:px-[180px] lg:py-[200px]",
);

/** Home hero copy inset — Figma hero text at x=180 inside the 1440 frame. */
export const siteHeroGutterX = "px-5 sm:px-8 lg:px-20 xl:px-[180px]";

/** Page content inset — Figma px-[180px] (1080px inner on 1440 frame). */
export const sitePageGutterX = "px-5 sm:px-8 lg:px-20 xl:px-[180px]";

/** Section layout — Figma 180px gutters, 80px vertical padding, 40px internal gap (1525:28286). */
export const siteSectionLayoutClassName = cn(
  "mx-auto flex w-full max-w-[1440px] flex-col items-center gap-10",
  sitePageGutterX,
);

export const siteSectionY = "py-20";

/** Inner content width on 180px-gutter pages. */
export const sitePageInnerClassName = "mx-auto w-full max-w-[1080px]";

/**
 * Property-card section layout — 80px gutters (matches header/footer edges).
 * At 1440px: 1280px inner → three 408px cards + 2×24px gaps = 1272px → each card ≈ 410px.
 * Use for any home section that shows a 3-column grid of PropertyCards.
 */
export const siteCardSectionLayoutClassName = cn(
  "mx-auto flex w-full max-w-[1440px] flex-col items-center gap-10",
  siteGutterX,
);

/** Wider card row — Figma 1144px inner on area page off-plan band (148px gutters). */
export const siteWideCardGutterX = "px-5 sm:px-8 lg:px-20 xl:px-[148px]";

export const siteWideCardInnerClassName = "mx-auto w-full max-w-[1144px]";

/** Header, footer, sticky CTA inner wrapper. */
export const siteChromeClassName = cn(
  "mx-auto w-full",
  siteMaxWidth,
  siteGutterX,
);

/** Default page section wrapper (matches header/footer edges at 80px). */
export const siteContentClassName = cn(
  "mx-auto w-full",
  siteMaxWidth,
  siteGutterX,
);

export type SiteChromeProps = {
  children: React.ReactNode;
  className?: string;
};

export function SiteChrome({ children, className }: SiteChromeProps) {
  return (
    <div className={cn(siteChromeClassName, className)}>{children}</div>
  );
}
