import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CurrencyIcon } from "./CurrencyIcon";
import { PropertyQrCodeImage } from "./PropertyQrCodeImage";

type PropertyDetailHeroAsideProps = {
  priceLabel: string;
  price: string;
  /** Resolved media URL — hidden when absent (Figma 3670:12055 / 1525:27992). */
  qrCodeUrl?: string;
  qrAlt?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Property detail hero — right column (Figma 1525:27992).
 * QR code: 44×44, white fill, 4px radius, top of stack, end-aligned.
 */
export function PropertyDetailHeroAside({
  priceLabel,
  price,
  qrCodeUrl,
  qrAlt = "Property QR code",
  className,
  children,
}: PropertyDetailHeroAsideProps) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col items-start gap-3 lg:w-auto lg:items-end lg:gap-4",
        className,
      )}
    >
      {qrCodeUrl ? (
        <PropertyQrCodeImage src={qrCodeUrl} alt={qrAlt} />
      ) : null}
      <p className="m-0 text-label-muted font-medium uppercase text-basalt-300 lg:text-end">
        {priceLabel}
      </p>
      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 lg:w-auto lg:flex-col lg:items-end lg:gap-4">
        <div className="flex min-w-0 shrink-0 items-center gap-2 text-heading-h2 font-bold tracking-normal text-brand sm:text-heading-h1 lg:justify-end">
          <CurrencyIcon currency="AED" className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
          <span className="min-w-0 break-words">{price}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
