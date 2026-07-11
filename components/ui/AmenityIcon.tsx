import { cn } from "@/lib/cn";
import { resolveAmenityIconSource } from "@/lib/amenities/resolve-amenity-icon";
import {
  amenityIconSvgs,
  type AmenityIconName,
} from "./amenity-icon-registry";

export type AmenityIconProps = {
  /** Inline SVG from backend — primary source. */
  facilityIcon?: string | null;
  /** CDN URL for backend amenity SVG. */
  iconUrl?: string | null;
  /** Facility label — accessibility. */
  facility?: string;
  /** Optional explicit Figma icon override (internal only). */
  name?: AmenityIconName;
  className?: string;
  title?: string;
};

const iconShellClassName =
  "inline-flex h-6 w-6 shrink-0 items-center justify-center text-sapphire-600 [&>svg]:h-full [&>svg]:w-full [&_svg]:h-full [&_svg]:w-full";

export function AmenityIcon({
  facilityIcon,
  iconUrl,
  facility,
  name,
  className,
  title,
}: AmenityIconProps) {
  const ariaLabel = title ?? facility;

  if (name) {
    const svgMarkup = amenityIconSvgs[name] ?? amenityIconSvgs.star;
    return (
      <span
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        className={cn(iconShellClassName, className)}
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
    );
  }

  const source = resolveAmenityIconSource({ facilityIcon, iconUrl });

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

  const svgMarkup =
    source.kind === "backend-svg"
      ? source.svg
      : (amenityIconSvgs[source.name] ?? amenityIconSvgs.star);

  return (
    <span
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn(iconShellClassName, className)}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}

export type { AmenityIconName };
