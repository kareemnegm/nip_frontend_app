import { cn } from "@/lib/cn";
import { resolveAmenityIconSource } from "@/lib/amenities/resolve-amenity-icon";

export type AmenityIconProps = {
  /** Inline SVG from API `facility_icon`. */
  facilityIcon?: string | null;
  /** CDN URL from API `icon_url`. */
  iconUrl?: string | null;
  /** Facility label — accessibility. */
  facility?: string;
  className?: string;
  title?: string;
};

const iconShellClassName =
  "inline-flex h-6 w-6 shrink-0 items-center justify-center text-sapphire-600 [&>svg]:h-full [&>svg]:w-full [&_svg]:h-full [&_svg]:w-full";

/**
 * Renders the facility icon from API SVG only (`facility_icon` or `icon_url`).
 * Returns nothing when the response has no icon markup.
 */
export function AmenityIcon({
  facilityIcon,
  iconUrl,
  facility,
  className,
  title,
}: AmenityIconProps) {
  const source = resolveAmenityIconSource({ facilityIcon, iconUrl });
  if (!source) return null;

  const ariaLabel = title ?? facility;

  if (source.kind === "backend-url") {
    return (
      <span
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        className={cn(iconShellClassName, className)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={source.url}
          alt=""
          width={24}
          height={24}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn(iconShellClassName, className)}
      dangerouslySetInnerHTML={{ __html: source.svg }}
    />
  );
}
