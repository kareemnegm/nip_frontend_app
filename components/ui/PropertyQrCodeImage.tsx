"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type PropertyQrCodeImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Figma 3670:12055 — 44×44 QR tile; plain img so API storage URLs always load. */
export function PropertyQrCodeImage({ src, alt, className }: PropertyQrCodeImageProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- QR comes from Laravel storage; bypass next/image optimizer.
    <img
      src={src}
      alt={alt}
      width={44}
      height={44}
      className={cn(
        "size-11 shrink-0 rounded-[var(--radius-field)] bg-white object-contain",
        className,
      )}
      onError={() => setHidden(true)}
    />
  );
}
