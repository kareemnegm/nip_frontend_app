import { cn } from "@/lib/cn";

/**
 * Figma 1525:27840 / 3390:12474 — fits 80×80 slot; bottom-aligned above 16px button gap.
 */

type DeveloperHeroLogoProps = {
  src: string;
  alt: string;
  className?: string;
};

export function DeveloperHeroLogo({ src, alt, className }: DeveloperHeroLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        "max-h-[80px] w-auto max-w-[200px] shrink-0 object-contain object-bottom",
        className,
      )}
    />
  );
}
