import { cn } from "@/lib/cn";

/** Figma desktop artboard width (T02 · Home and shared chrome). */
export const siteMaxWidth = "max-w-[1440px]";

/** Horizontal padding — Figma px-[80px] on header, footer, and most sections. */
export const siteGutterX = "px-5 sm:px-8 lg:px-20";

/** Home hero copy inset — Figma hero text at x=180 inside the 1440 frame. */
export const siteHeroGutterX = "px-5 sm:px-8 lg:px-20 xl:px-[180px]";

/** Page content inset — Figma px-[180px] (1080px inner on 1440 frame). */
export const sitePageGutterX = "px-5 sm:px-8 lg:px-20 xl:px-[180px]";

/** Inner content width on 180px-gutter pages. */
export const sitePageInnerClassName = "mx-auto w-full max-w-[1080px]";

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
