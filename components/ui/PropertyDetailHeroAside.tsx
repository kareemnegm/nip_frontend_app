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
    <div className={cn("flex w-full flex-col gap-4 lg:w-auto lg:items-end", className)}>
      {qrCodeUrl ? (
        <PropertyQrCodeImage src={qrCodeUrl} alt={qrAlt} />
      ) : null}
      <p className="m-0 text-[11px] font-medium uppercase leading-[14px] text-basalt-300 lg:text-end">
        {priceLabel}
      </p>
      {/* Mobile: price + CTA on one row. Desktop: stacked & right-aligned. */}
      <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:flex-col lg:items-end lg:justify-start lg:gap-4">
        <div className="flex h-5 items-center gap-2 overflow-visible text-[30px] font-bold leading-[38px] text-brand lg:justify-end">
          <CurrencyIcon currency="AED" className="h-6 w-6 shrink-0" />
          <span className="whitespace-nowrap">{price}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
