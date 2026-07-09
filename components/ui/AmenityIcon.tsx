import { cn } from "@/lib/cn";
import { resolveAmenityIconFromFacility } from "@/lib/amenities/resolve-amenity-icon";
import {
  amenityIconSvgs,
  type AmenityIconName,
} from "./amenity-icon-registry";

export type AmenityIconProps = {
  /** Backend `icon_key` — preferred source of truth. */
  iconKey?: string | null;
  /** Facility label — used only when `iconKey` is missing. */
  facility?: string;
  /** Optional explicit icon override. */
  name?: AmenityIconName;
  className?: string;
  title?: string;
};

export function AmenityIcon({
  iconKey,
  facility,
  name,
  className,
  title,
}: AmenityIconProps) {
  const iconName =
    name ??
    resolveAmenityIconFromFacility({ iconKey, facility: facility ?? "" });
  const svgMarkup = amenityIconSvgs[iconName] ?? amenityIconSvgs.star;

  return (
    <span
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center text-sapphire-600 [&>svg]:h-full [&>svg]:w-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}

export type { AmenityIconName };
