"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Figma 1525:27842 — logo frame ≈ 120×24 inside the CTA column. */
const WIDE_LOGO_HEIGHT_PX = 24;
/** Cap for square/tall marks so they stay readable without towering over the button. */
const MAX_LOGO_HEIGHT_PX = 56;
/** Wide wordmarks (≈ Figma 5:1) keep the short 24px frame. */
const WIDE_ASPECT_RATIO = 2.5;

type DeveloperHeroLogoProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * Backend logos vary (wide SVG wordmarks vs square marks with padding).
 * Always span the full CTA column width; grow height only when needed so
 * square/SVG marks still read at a similar visual weight to Figma’s EMAAR.
 */
export function DeveloperHeroLogo({ src, alt, className }: DeveloperHeroLogoProps) {
  const [heightPx, setHeightPx] = useState(WIDE_LOGO_HEIGHT_PX);

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ height: heightPx }}
    >
      {/* Native img: remote SVGs scale more reliably than next/image fill. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain object-center"
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget;
          if (!naturalWidth || !naturalHeight) return;

          const ratio = naturalWidth / naturalHeight;
          if (ratio >= WIDE_ASPECT_RATIO) {
            setHeightPx(WIDE_LOGO_HEIGHT_PX);
            return;
          }

          // Fill as much column width as possible within the max height.
          const columnWidth = event.currentTarget.parentElement?.clientWidth ?? 134;
          const heightToFillWidth = Math.round(columnWidth / ratio);
          setHeightPx(
            Math.min(MAX_LOGO_HEIGHT_PX, Math.max(WIDE_LOGO_HEIGHT_PX, heightToFillWidth)),
          );
        }}
      />
    </div>
  );
}
