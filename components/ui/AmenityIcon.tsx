import { cn } from "@/lib/cn";
import { resolveAmenityIcon } from "@/lib/amenities/resolve-amenity-icon";
import {
  amenityIconSvgs,
  type AmenityIconName,
} from "./amenity-icon-registry";

export type AmenityIconProps = {
  /** Facility label from API — resolved to the matching Figma amenity glyph. */
  facility?: string;
  /** Optional explicit icon override. */
  name?: AmenityIconName;
  className?: string;
  title?: string;
};

export function AmenityIcon({
  facility,
  name,
  className,
  title,
}: AmenityIconProps) {
  const iconName = name ?? resolveAmenityIcon(facility ?? "");
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
