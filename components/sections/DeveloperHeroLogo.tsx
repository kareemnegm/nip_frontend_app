import { cn } from "@/lib/cn";

/**
 * Figma 1525:27840 — fixed 80×80px logo container.
 * Logo is centered and contained within the square frame.
 */

type DeveloperHeroLogoProps = {
  src: string;
  alt: string;
  className?: string;
};

export function DeveloperHeroLogo({ src, alt, className }: DeveloperHeroLogoProps) {
  return (
    <div className={cn("relative size-[80px] shrink-0", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 size-full object-contain object-center"
      />
    </div>
  );
}
